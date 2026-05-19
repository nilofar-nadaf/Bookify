const express = require("express");
const router = express.Router();
const pool = require("../Database/pool");

// Categories table for admin category management
const createCategoriesTableSql = `
  CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

pool.query(createCategoriesTableSql, (err) => {
  if (err) {
    console.error("Create categories table error:", err);
    return;
  }

  // Keep categories in sync with existing books categories
  const seedSql = `
    INSERT IGNORE INTO categories (name)
    SELECT DISTINCT category
    FROM books
    WHERE category IS NOT NULL AND category <> ''
  `;
  pool.query(seedSql, (seedErr) => {
    if (seedErr) console.error("Seed categories error:", seedErr);
  });
});

// View all users
router.get("/users", (req, res) => {
  const sql = `
    SELECT id, full_name, email, role, phone_no, address
    FROM users
    ORDER BY id DESC
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Admin users fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
    res.json(result);
  });
});

// View all books
router.get("/books", (req, res) => {
  const sql = "SELECT * FROM books ORDER BY id DESC";

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Admin books fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch books" });
    }
    res.json(result);
  });
});

// Add new book
router.post("/books", (req, res) => {
  const {
    title,
    author,
    price,
    category,
    tag,
    language,
    inStock = true,
    description,
    image,
  } = req.body;

  if (!title || !author || !price) {
    return res.status(400).json({ message: "title, author and price are required" });
  }

  const sql = `
    INSERT INTO books (title, author, price, category, tag, language, inStock, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [title, author, price, category || null, tag || null, language || null, inStock, description || null, image || null],
    (err, result) => {
      if (err) {
        console.error("Admin add book error:", err);
        return res.status(500).json({ message: "Failed to add book" });
      }
      if (category) {
        pool.query("INSERT IGNORE INTO categories (name) VALUES (?)", [category], () => {});
      }
      res.json({ message: "Book added successfully", id: result.insertId });
    }
  );
});

// Edit existing book
router.put("/books/:bookId", (req, res) => {
  const { bookId } = req.params;
  const { price, category, description, image, title, author, tag, language, inStock } = req.body;

  const sql = `
    UPDATE books
    SET
      title = ?,
      author = ?,
      price = ?,
      category = ?,
      tag = ?,
      language = ?,
      inStock = ?,
      description = ?,
      image = ?
    WHERE id = ?
  `;

  pool.query(
    sql,
    [
      title || null,
      author || null,
      price,
      category || null,
      tag || null,
      language || null,
      inStock,
      description || null,
      image || null,
      bookId,
    ],
    (err, result) => {
      if (err) {
        console.error("Admin update book error:", err);
        return res.status(500).json({ message: "Failed to update book" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (category) {
        pool.query("INSERT IGNORE INTO categories (name) VALUES (?)", [category], () => {});
      }
      res.json({ message: "Book updated successfully" });
    }
  );
});

// Delete book
router.delete("/books/:bookId", (req, res) => {
  const { bookId } = req.params;
  const sql = "DELETE FROM books WHERE id = ?";

  pool.query(sql, [bookId], (err, result) => {
    if (err) {
      console.error("Admin delete book error:", err);
      return res.status(500).json({ message: "Failed to delete book" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  });
});

// View all categories
router.get("/categories", (req, res) => {
  const sql = "SELECT id, name FROM categories ORDER BY name ASC";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Admin categories fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
    res.json(result);
  });
});

// Add category
router.post("/categories", (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Category name is required" });
  }

  pool.query("INSERT INTO categories (name) VALUES (?)", [name.trim()], (err, result) => {
    if (err) {
      console.error("Add category error:", err);
      return res.status(500).json({ message: "Failed to add category" });
    }
    res.json({ message: "Category added successfully", id: result.insertId });
  });
});

// Edit category name and update mapped books category
router.put("/categories/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Category name is required" });
  }

  pool.query("SELECT name FROM categories WHERE id = ?", [categoryId], (findErr, rows) => {
    if (findErr) {
      console.error("Find category error:", findErr);
      return res.status(500).json({ message: "Failed to update category" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const oldName = rows[0].name;
    const newName = name.trim();

    pool.query("UPDATE categories SET name = ? WHERE id = ?", [newName, categoryId], (updateErr) => {
      if (updateErr) {
        console.error("Update category error:", updateErr);
        return res.status(500).json({ message: "Failed to update category" });
      }

      pool.query("UPDATE books SET category = ? WHERE category = ?", [newName, oldName], () => {});
      return res.json({ message: "Category updated successfully" });
    });
  });
});

// Delete category and unassign it from books
router.delete("/categories/:categoryId", (req, res) => {
  const { categoryId } = req.params;

  pool.query("SELECT name FROM categories WHERE id = ?", [categoryId], (findErr, rows) => {
    if (findErr) {
      console.error("Find category error:", findErr);
      return res.status(500).json({ message: "Failed to delete category" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const categoryName = rows[0].name;
    pool.query("DELETE FROM categories WHERE id = ?", [categoryId], (delErr) => {
      if (delErr) {
        console.error("Delete category error:", delErr);
        return res.status(500).json({ message: "Failed to delete category" });
      }

      pool.query("UPDATE books SET category = NULL WHERE category = ?", [categoryName], () => {});
      return res.json({ message: "Category deleted successfully" });
    });
  });
});

// View all orders
router.get("/orders", (req, res) => {
  const sql = `
    SELECT
      o.id,
      o.order_code,
      o.quantity,
      o.total_amount,
      o.payment_method,
      o.status,
      o.address,
      o.created_at,
      u.full_name AS customer_name,
      u.email AS customer_email,
      b.title AS book_title,
      b.author AS book_author
    FROM orders o
    INNER JOIN users u ON o.user_id = u.id
    INNER JOIN books b ON o.book_id = b.id
    ORDER BY o.id DESC
  `;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Admin orders fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
    res.json(result);
  });
});

// Update order status (Pending, Shipped, Delivered, Cancelled)
router.put("/orders/:orderId/status", (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const allowedStatus = ["Pending", "Shipped", "Delivered", "Cancelled"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  pool.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.error("Update order status error:", err);
      return res.status(500).json({ message: "Failed to update order status" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order status updated successfully" });
  });
});

module.exports = router;
