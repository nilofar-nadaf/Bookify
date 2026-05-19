const express = require("express");
const router = express.Router();
const pool = require("../Database/pool");

const createOrdersTableSql = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_code VARCHAR(40) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
  )
`;

pool.query(createOrdersTableSql, (err) => {
  if (err) {
    console.error("Orders table init error:", err);
  }
});

router.post("/place-order", (req, res) => {
  const {
    order_code,
    user_id,
    book_id,
    quantity = 1,
    full_name,
    email,
    address,
    payment_method,
    delivery_fee = 0,
    total_amount,
  } = req.body;

  if (!order_code || !user_id || !book_id || !full_name || !email || !address || !payment_method || !total_amount) {
    return res.status(400).json({ message: "Missing required order details" });
  }

  const findExistingSql = `
    SELECT id, quantity, total_amount
    FROM orders
    WHERE user_id = ? AND book_id = ? AND status IN ('Pending', 'Order Placed')
    LIMIT 1
  `;

  pool.query(findExistingSql, [user_id, book_id], (findErr, existingRows) => {
    if (findErr) {
      console.error("Find order error:", findErr);
      return res.status(500).json({ message: "Failed to place order" });
    }

    // If same user buys same book again, increase quantity instead of creating a duplicate row.
    if (existingRows.length > 0) {
      const existing = existingRows[0];
      const updateSql = `
        UPDATE orders
        SET
          quantity = quantity + ?,
          total_amount = total_amount + ?,
          full_name = ?,
          email = ?,
          address = ?,
          payment_method = ?,
          delivery_fee = ?,
          status = 'Pending'
        WHERE id = ?
      `;

      return pool.query(
        updateSql,
        [quantity, total_amount, full_name, email, address, payment_method, delivery_fee, existing.id],
        (updateErr) => {
          if (updateErr) {
            console.error("Update order error:", updateErr);
            return res.status(500).json({ message: "Failed to place order" });
          }

          return res.json({
            message: "Order quantity updated successfully",
            order_code,
          });
        }
      );
    }

    const insertSql = `
      INSERT INTO orders (
        order_code, user_id, book_id, quantity, full_name, email, address,
        payment_method, delivery_fee, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      insertSql,
      [
        order_code,
        user_id,
        book_id,
        quantity,
        full_name,
        email,
        address,
        payment_method,
        delivery_fee,
        total_amount,
      ],
      (insertErr) => {
        if (insertErr) {
          console.error("Place order error:", insertErr);
          return res.status(500).json({ message: "Failed to place order" });
        }

        return res.json({ message: "Order placed successfully", order_code });
      }
    );
  });
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT
      o.id,
      o.order_code,
      o.quantity,
      o.payment_method,
      o.delivery_fee,
      o.total_amount,
      o.status,
      o.created_at,
      b.title,
      b.author,
      b.image,
      b.price
    FROM orders o
    INNER JOIN books b ON o.book_id = b.id
    WHERE o.user_id = ?
    ORDER BY o.id DESC
  `;

  pool.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Fetch orders error:", err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
    res.json(result);
  });
});

// Remove a placed order by id
router.delete("/remove/:orderId", (req, res) => {
  const { orderId } = req.params;

  const sql = "DELETE FROM orders WHERE id = ?";

  pool.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error("Remove order error:", err);
      return res.status(500).json({ message: "Failed to remove order" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order removed successfully" });
  });
});

module.exports = router;
