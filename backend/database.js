const bcrypt = require("bcrypt");
const mariadb = require("mariadb");
const config = require("./config.js");

// Creates a database connection pool
const pool = mariadb.createPool(config.db);

class Database {
  static async getPoolConn() {
    // Opens the connection with the database
    try {
      return pool.getConnection();
    } catch (err) {
      const msg = "Pool connection error";
      console.error(msg, err);
      return res.status(500).json({ message: msg, error: err.message });
    }
  }

  static async retrieveUserData(conn, key, value) {
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

  static async validateSignup(conn, signupData) {
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

  static async validateLogin(loginData, userData) {
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

  static async registerUser(conn, userData) {
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
}

module.exports = { Database, pool };
