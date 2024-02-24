const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const { Database: db, pool } = require("./database");
const config = require("./config.js");

const app = express();
const port = 8084;

// Parses the body as json
app.use(express.json());

// Allows certain requests from origin depending on configuration
app.use(cors(config.cors));
// app.use(
//   cors({
//     origin: "http://192.168.1.10:8080",
//     methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204,
//   })
// );

app.use(express.static(path.join(__dirname, "app")));

app.post("/signup", async (req, res) => {
  // Register a new user
  let conn, result;
  const { email, username, password } = req.body;
  const signupData = { email: email, username: username, password: password };
  try {
    conn = await db.getPoolConn();
    const validSignup = await db.validateSignup(conn, signupData);
    if (validSignup.status === 200) {
      const hashedPw = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        username,
        password: hashedPw,
      };
      result = await db.registerUser(conn, newUser);
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
  try {
    conn = await db.getPoolConn();
    const userData = await db.retrieveUserData(
      conn,
      "username",
      loginData.username
    );
    const validLogin = await db.validateLogin(loginData, userData.json.data);
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

app.get("/customer/:id", async (req, res) => {
  // Retrieves the customer data
  let conn;
  try {
    conn = await pool.getConnection();
    const queryData = await conn.query(
      "SELECT id, firstname, lastname, email, DATE_FORMAT(birthdate, '%Y-%m-%d') AS birthdate, phone FROM customers WHERE is_deleted = 0 AND id = ?",
      [req.params.id]
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
app.put("/customer/edit/:id", async (req, res) => {
  // Updates the customer data
  let conn;
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
    const msg = "Error deleting customer";
    console.error(msg, err.message);
    return res.status(500).json({ message: msg, error: err.message });
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});
