const express = require("express");
const router = express.Router();
const pool = require("../Database/pool");

// Ensure cart table exists (helps when SQL file wasn't re-run manually)
const createCartTableSql = `
  CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_book (user_id, book_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
  )
`;

pool.query(createCartTableSql, (err) => {
  if (err) {
    console.error("Cart table init error:", err);
  }
});

// Add book to cart (persistent in DB)
router.post("/add-to-cart", (req, res) => {
  const { user_id, book_id, quantity = 1 } = req.body;

  if (!user_id || !book_id) {
    return res.status(400).json({ message: "user_id and book_id are required" });
  }

  const sql = `
    INSERT INTO cart (user_id, book_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  pool.query(sql, [user_id, book_id, quantity], (err) => {
    if (err) {
      console.error("Add to cart error:", err);
      return res.status(500).json({ message: "Failed to add to cart" });
    }
    res.json({ message: "Book added to cart successfully" });
  });
});

// Get all cart items for one user
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT
      c.id AS cart_id,
      c.user_id,
      c.book_id,
      c.quantity,
      b.title,
      b.author,
      b.price,
      b.image,
      b.category
    FROM cart c
    INNER JOIN books b ON c.book_id = b.id
    WHERE c.user_id = ?
    ORDER BY c.id DESC
  `;

  pool.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Fetch cart error:", err);
      return res.status(500).json({ message: "Failed to fetch cart items" });
    }
    res.json(result);
  });
});

// Remove one item from cart
router.delete("/remove/:cartId", (req, res) => {
  const { cartId } = req.params;

  const sql = "DELETE FROM cart WHERE id = ?";

  pool.query(sql, [cartId], (err, result) => {
    if (err) {
      console.error("Remove cart item error:", err);
      return res.status(500).json({ message: "Failed to remove cart item" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart successfully" });
  });
});

module.exports = router;
