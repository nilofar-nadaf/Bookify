const express = require("express");
const router = express.Router();
const pool = require("../Database/pool");

// REGISTER - Removed bcrypt hashing
router.post("/register", (req, res) => {
  const { full_name, email, password, phone_no, address, role } = req.body;

  const sql = `
    INSERT INTO users (full_name, email, password, phone_no, address, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // We save the password exactly as it comes from req.body
  pool.query(sql, [full_name, email, password, phone_no, address, role], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error in registration");
    }
    res.send("User registered successfully");
  });
});

// LOGIN - Changed to direct SQL comparison
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // This query looks for a direct match of both email and plain-text password
  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  pool.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      // result[0] is the user object found in the database
      res.json({ message: "Login successful", user: result[0] });
    } else {
      res.json({ message: "Invalid email or password" });
    }
  });
});

// ADMIN LOGIN - only allows users with admin role
router.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=? AND role='admin'";

  pool.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      res.json({ message: "Admin login successful", user: result[0] });
    } else {
      res.json({ message: "Invalid admin email or password" });
    }
  });
});

// GET all books
router.get("/books", (req, res) => {
  const sql = "SELECT * FROM books";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

// GET categories for shop filtering
router.get("/categories", (req, res) => {
  const sql = "SELECT id, name FROM categories ORDER BY name ASC";
  pool.query(sql, (err, result) => {
    if (err) {
      // fallback if categories table does not exist yet
      const fallbackSql = `
        SELECT DISTINCT category AS name
        FROM books
        WHERE category IS NOT NULL AND category <> ''
        ORDER BY category ASC
      `;
      return pool.query(fallbackSql, (fallbackErr, fallbackResult) => {
        if (fallbackErr) {
          console.error("Fetch categories error:", fallbackErr);
          return res.status(500).json({ message: "Failed to fetch categories" });
        }
        return res.json(
          fallbackResult.map((row, idx) => ({
            id: idx + 1,
            name: row.name,
          }))
        );
      });
    }

    res.json(result);
  });
});
// GET books by category
router.get("/category/:categoryName", (req, res) => {
  const category = req.params.categoryName;
  
  // LOGIC: If category is "All", skip the WHERE filter
  let sql = "SELECT * FROM books";
  let params = [];
  if (category !== "All") {
    sql = "SELECT * FROM books WHERE category = ?";
    params = [category];
  }
  pool.query(sql, params, (err, result) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log(`Fetched ${result.length} books for category: ${category}`);
    res.json(result);
  });
});

module.exports = router;