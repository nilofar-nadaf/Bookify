import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("Please login first.");
        navigate("/auth");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${user.id}`);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Orders fetch failed:", error);
        alert(error?.response?.data?.message || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleRemoveOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/orders/remove/${orderId}`);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      alert(response.data.message || "Order removed successfully");
    } catch (error) {
      console.error("Remove order failed:", error);
      alert(error?.response?.data?.message || "Unable to remove order.");
    }
  };

  if (loading) return <p className="cart-loading">Loading orders...</p>;

  return (
    <main className="orders-wrapper">
      <h1 className="title-text">My Orders</h1>

      {orders.length === 0 ? (
        <p className="cart-empty">You have not placed any orders yet.</p>
      ) : (
        <section className="orders-list">
          {orders.map((order) => {
            const fallbackImage = `https://picsum.photos/seed/order-${order.id}/200/260`;
            const imageSrc =
              order.image && /^https?:\/\//i.test(order.image) ? order.image : fallbackImage;

            return (
              <article className="order-item" key={order.id}>
                <img
                  src={imageSrc}
                  alt={order.title}
                  className="cart-item-image"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="cart-item-content">
                  <h3>{order.title}</h3>
                  <p>By {order.author}</p>
                  <p>Order ID: {order.order_code}</p>
                  <p>Qty: {order.quantity}</p>
                  <p>Payment: {order.payment_method}</p>
                  <p>Status: {order.status}</p>
                  <p>Total Paid: Rs.{Number(order.total_amount).toFixed(2)}</p>
                  <button
                    className="remove-order-btn"
                    onClick={() => handleRemoveOrder(order.id)}
                  >
                    Remove Order
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Orders;
