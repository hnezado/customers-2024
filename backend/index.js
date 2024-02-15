const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("mariadb");
const config = require("./config.js");

const app = express();
const port = 8084;

// Parses the body as json
app.use(express.json());

// Allows certain requests from origin depending on configuration
// app.use(cors(config.cors));
app.use(
  cors({
    origin: "http://192.168.1.10:8080",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Creates a database connection pool
const pool = db.createPool(config.db);

async function getPoolConn() {
  // Opens the connection with the database
  try {
    return pool.getConnection();
  } catch (err) {
    const msg = "Pool connection error";
    console.error(msg, err);
    return res.status(500).json({ message: msg, error: err.message });
  }
}

async function retrieveUserData(conn, key, value) {
  try {
    const userData = await conn.query(
      `SELECT * FROM users WHERE ${key} = '${value}'`
    );
    return {
      status: 200,
      json: {
        message: `User retrieved successfully`,
        data: userData,
      },
    };
  } catch (err) {
    const msg = "Error retrieving data";
    console.error(msg, err.message);
    return {
      status: 500,
      json: {
        message: msg,
        error: err.message,
      },
    };
  }
}

async function validateSignup(conn, signupData) {
  // Validates data from user before registering it
  try {
    const existingEmail = await retrieveUserData(
      conn,
      "email",
      signupData.email
    );
    if (existingEmail.json.data.length) {
      return {
        status: 400,
        json: {
          message: `This email is already registered`,
          data: signupData,
        },
      };
    }
  } catch (err) {
    const msg = "Error validating existing email";
    console.error(msg, err.message);
    return {
      status: 500,
      json: {
        message: msg,
        error: err.message,
      },
    };
  }
  try {
    const existingUsername = await retrieveUserData(
      conn,
      "username",
      signupData.username
    );
    if (existingUsername.json.data.length) {
      return {
        status: 400,
        json: {
          message: `This username is already registered`,
          data: signupData,
        },
      };
    }
  } catch (err) {
    const msg = "Error validating existing username";
    console.error(msg, err.message);
    return {
      status: 500,
      json: {
        message: msg,
        error: err.message,
      },
    };
  }

  //////////////////////////////////////////////////////
  // Temporal skip pass validation
  // return {
  //   status: 200,
  // };
  //////////////////////////////////////////////////////

  // Password validation
  function hasValidLength(len) {
    return signupData.password.length >= len;
  }
  function hasValidCharacters() {
    const containsDigits = /\d/.test(signupData.password);
    const containsLetters = /[a-zA-Z]/.test(signupData.password);
    return containsDigits && containsLetters;
  }
  try {
    if (!hasValidLength(8)) {
      return {
        status: 400,
        json: {
          message: `The password must contain at least 8 characters`,
          data: signupData,
        },
      };
    }
    if (!hasValidCharacters()) {
      return {
        status: 400,
        json: {
          message: `The password must contain at least 1 digit and 1 letter`,
          data: signupData,
        },
      };
    }
  } catch (err) {
    const msg = "Error validating password";
    console.error(msg, err.message);
    return {
      status: 500,
      json: {
        message: msg,
        error: err.message,
      },
    };
  }
  return {
    status: 200,
  };
}

async function validateLogin(loginData, userData) {
  // Validates data from user to start its session
  try {
    if (!userData.length) {
      return {
        status: 400,
        json: {
          message: `This username is not registered`,
          data: loginData,
        },
      };
    }
    const passwordMatch = await bcrypt.compare(
      loginData.password,
      userData[0].password
    );
    if (passwordMatch) {
      return {
        status: 200,
        json: {
          message: `Logged in successfully`,
          data: userData[0],
        },
      };
    } else {
      return {
        status: 400,
        json: {
          message: `The password does not match`,
          data: loginData,
        },
      };
    }
  } catch (err) {
    const msg = "Error validating login data";
    console.error(msg, err.message);
    return {
      status: 500,
      json: {
        message: msg,
        error: err.message,
      },
    };
  }
}

async function registerUser(conn, userData) {
  // Adds the user data into the database
  try {
    await conn.execute(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [userData.email, userData.username, userData.password]
    );
    return {
      status: 200,
      json: {
        message: `User registered successfully`,
        // Sent username to auto show it on the login input
        data: {
          username: userData.username,
        },
      },
    };
  } catch (err) {
    const msg = "Error inserting data in database";
    console.error(msg, err.message);
    return {
      status: 500,
      json: {
        message: msg,
        error: err.message,
      },
    };
  }
}

app.post("/signup", async (req, res) => {
  // Register a new user
  let conn, result;
  const { email, username, password } = req.body;
  const signupData = { email: email, username: username, password: password };
  try {
    conn = await getPoolConn();
    const validSignup = await validateSignup(conn, signupData);
    if (validSignup.status === 200) {
      const hashedPw = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        username,
        password: hashedPw,
      };
      result = await registerUser(conn, newUser);
      res.status(result.status).json(result.json);
    } else {
      res.status(validSignup.status).json(validSignup.json);
    }
  } finally {
    if (conn) conn.release();
  }
});

app.post("/login", async (req, res) => {
  // Logs in into the user session
  let conn;
  const { username, password } = req.body;
  const loginData = { username: username, password: password };
  console.log("loginData:", loginData);
  try {
    conn = await getPoolConn();
    const userData = await retrieveUserData(
      conn,
      "username",
      loginData.username
    );
    const validLogin = await validateLogin(loginData, userData.json.data);
    return res.status(validLogin.status).json(validLogin.json);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/catalog", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const queryData = await conn.query(
      `SELECT
        p.name,
        p.description,
        p.price,
        p.manufacturer,
        p.model,
        p.release_date,
        sq.categories2 AS categories,
        pi.portrait_url as main_img
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      JOIN
        (SELECT
          pc.product_id AS product_id,
          GROUP_CONCAT(c.name) AS categories2
        FROM product_category pc
        JOIN categories c ON pc.category_id = c.id
        GROUP BY pc.product_id) sq ON p.id = sq.product_id;`
    );
    return res.status(200).json(queryData);
  } catch (err) {
    const msg = "Error querying the database";
    console.error(msg, err.message);
    return res.status(500).json({ message: msg, error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.get("/customers/list", async (req, res) => {
  // Retrieves the customers list
  let conn;
  try {
    conn = await pool.getConnection();
    const queryData = await conn.query(
      "SELECT id, firstname, lastname, email, DATE_FORMAT(birthdate, '%Y-%m-%d') AS birthdate, phone FROM customers WHERE is_deleted = 0"
    );
    return res.status(200).json(queryData);
  } catch (err) {
    const msg = "Error querying the database";
    console.error(msg, err.message);
    return res.status(500).json({ message: msg, error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// *Si pongo aquí un patch en vez de put me falla saveEdit y delete y no se por qué
app.put("/customers/edit/:id", async (req, res) => {
  // Updates the customer data
  let conn;
  console.log("req.body", req.body);
  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE customers SET firstname = ?, lastname = ?, email = ?, birthdate = ?, phone = ? WHERE id = ?",
      [
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        req.body.birthdate,
        req.body.phone,
        req.params.id,
      ]
    );
    return res.status(204).end();
  } catch (err) {
    const msg = "Error updating the database";
    console.error(msg, err.message);
    return res.status(500).json({ message: msg, error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.patch("/customers/delete/:id", async (req, res) => {
  // Deletes the customer
  const customerId = req.params.id;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE customers SET is_deleted = 1 WHERE id = ?", [
      customerId,
    ]);
    return res.status(204).end();
  } catch (err) {
    console.error("Delete error:", err.message);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/test", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const queryData = await conn.query(
      "SELECT id, firstname, lastname, email, DATE_FORMAT(birthdate, '%Y-%m-%d') AS birthdate, phone FROM customers WHERE firstname = 'john'"
    );
    return res.status(200).json(queryData);
  } catch (err) {
    const msg = "Error retrieving data";
    return res.status(500).json({ message: msg, error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});
