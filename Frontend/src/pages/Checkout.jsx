import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const checkoutBook = location.state?.book;

  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    address: user?.address || "",
    paymentMethod: "cash-on-delivery",
  });

  const fallbackImage = useMemo(
    () => `https://picsum.photos/seed/checkout-${checkoutBook?.id || checkoutBook?.title}/240/320`,
    [checkoutBook]
  );

  if (!checkoutBook) {
    return (
      <main className="checkout-wrapper">
        <p className="cart-empty">No book selected for checkout.</p>
      </main>
    );
  }

  const resolvedImage =
    checkoutBook.image && /^https?:\/\//i.test(checkoutBook.image)
      ? checkoutBook.image
      : fallbackImage;

  const deliveryFee = 50;
  const totalAmount = Number(checkoutBook.price) + deliveryFee;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("Please login first to continue.");
      navigate("/auth");
      return;
    }

    const orderCode = `BKY-${Date.now()}`;

    try {
      const response = await axios.post("http://localhost:5000/api/orders/place-order", {
        order_code: orderCode,
        user_id: user.id,
        book_id: checkoutBook.id,
        quantity: 1,
        full_name: formData.fullName,
        email: formData.email,
        address: formData.address,
        payment_method: formData.paymentMethod,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
      });

      alert(`${response.data.message}. Order ID: ${response.data.order_code}`);
      navigate("/orders");
    } catch (error) {
      console.error("Place order failed:", error);
      alert(error?.response?.data?.message || "Could not place order.");
    }
  };

  return (
    <main className="checkout-wrapper">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="title-text">Checkout</h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form-card" onSubmit={handlePlaceOrder}>
          <h2>Delivery Details</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Delivery Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="cash-on-delivery">Cash on Delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <button type="submit" className="buy-now-btn">
            Place Order
          </button>
        </form>

        <section className="checkout-summary-card">
          <h2>Order Summary</h2>
          <div className="checkout-book-row">
            <img
              src={resolvedImage}
              alt={checkoutBook.title}
              className="checkout-book-image"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
            <div>
              <h3>{checkoutBook.title}</h3>
              <p>By {checkoutBook.author}</p>
              <p>Book Price: Rs.{checkoutBook.price}</p>
              <p>Delivery Fee: Rs.{deliveryFee}</p>
            </div>
          </div>
          <div className="checkout-total">Total Payable: Rs.{totalAmount.toFixed(2)}</div>
        </section>
      </div>
    </main>
  );
};

export default Checkout;
