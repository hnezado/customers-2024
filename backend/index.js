const express = require("express");
const db = require("mariadb");
const cors = require("cors");
const config = require("./config.js");

const app = express();
const port = 8084;

app.use(cors());

const pool = db.createPool(config.db);

app.get("/", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("conn:", conn);
    const rows = await conn.query(
      "SELECT * FROM customer WHERE is_deleted = 0",
    );
    res.json(rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database connection error");
  } finally {
    if (conn) conn.release();
  }
});

// Si pongo aquí un patch me falla saveEdit y delete y no se por qué:
app.put("/customers/edit/:id", async (req, res) => {
	console.log("params:", req.params)
  const customerId = req.params.id;
	const updatedData = req.body;
  console.log(`Editing customer with ID: ${customerId}`);
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE customer SET is_deleted = 1 WHERE id = ?", [
      customerId,
    ]);
    res.status(204).end();
  } catch (error) {
    console.error("Edit error:", error);
  } finally {
    if (conn) conn.release();
  }
});

app.patch("/customers/delete/:id", async (req, res) => {
  const customerId = req.params.id;
  console.log(`Deleting customer with ID: ${customerId}`);
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE customer SET is_deleted = 1 WHERE id = ?", [
      customerId,
    ]);
    res.status(204).end();
  } catch (error) {
    console.error("Delete error:", error);
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});
