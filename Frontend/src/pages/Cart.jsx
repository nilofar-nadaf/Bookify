import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("Please login first.");
        navigate("/auth");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
        setCartItems(response.data || []);
      } catch (error) {
        console.error("Cart fetch failed:", error);
        alert(error?.response?.data?.message || "Unable to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleRemoveItem = async (cartId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${cartId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.cart_id !== cartId));
      alert(response.data.message || "Item removed from cart");
    } catch (error) {
      console.error("Remove cart item failed:", error);
      alert(error?.response?.data?.message || "Unable to remove cart item.");
    }
  };

  if (loading) {
    return <p className="cart-loading">Loading cart...</p>;
  }

  return (
    <main className="cart-wrapper">
      <h1 className="title-text">My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <section className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.cart_id}>
                <img
                  src={
                    item.image && /^https?:\/\//i.test(item.image)
                      ? item.image
                      : `https://picsum.photos/seed/cart-${item.book_id || item.title}/200/260`
                  }
                  alt={item.title}
                  className="cart-item-image"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/cart-${item.book_id || item.title}/200/260`;
                  }}
                />
                <div className="cart-item-content">
                  <h3>{item.title}</h3>
                  <p>By {item.author}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Rs.{Number(item.price) * Number(item.quantity)}</p>
                  <button
                    className="remove-cart-btn"
                    onClick={() => handleRemoveItem(item.cart_id)}
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            ))}
          </section>
          <div className="cart-total">Total: Rs.{totalAmount.toFixed(2)}</div>
        </>
      )}
    </main>
  );
};

export default Cart;
