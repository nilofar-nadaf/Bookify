import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BookDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state;

  if (!book) return <p>Book not found.</p>;

  const fallbackImage = `https://picsum.photos/seed/bookify-${book.id || book.title}/400/550`;

  const resolvedImage =
    book.image && /^https?:\/\//i.test(book.image) ? book.image : fallbackImage;

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      alert("Please login first to add books to cart.");
      navigate("/auth");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/cart/add-to-cart", {
        user_id: user.id,
        book_id: book.id,
        quantity: 1,
      });
      alert(response.data.message || "Added to cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Could not add this book to cart. Please try again.");
    }
  };

  const handleBuyNow = () => {
    if (!book.inStock) {
      alert("This book is currently out of stock.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please login first to continue.");
      navigate("/auth");
      return;
    }

    navigate("/checkout", { state: { book } });
  };

  return (
    <div className="details-page-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Shop
      </button>

      <div className="details-container">
        <div className="details-image">
          <img
            src={resolvedImage}
            alt={book.title}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
        </div>

        <div className="details-content">
          <span className="badge-tag">{book.tag}</span>
          <h1>{book.title}</h1>
          <p className="author">By {book.author}</p>

          <div className="meta-row">
            <span>
              Language: <strong>{book.language}</strong>
            </span>
            <span>
              <br />
              Status:{" "}
              <strong style={{ color: book.inStock ? "#8fa8a0" : "#e74c3c" }}>
                {book.inStock ? "Available" : "Out of Stock"}
              </strong>
            </span>
          </div>

          <p className="description">{book.description}</p>

          <div className="purchase-section">
            <span className="details-price">Rs.{book.price}</span>
            <div className="purchase-actions">
              <button
                className="add-cart-btn"
                disabled={!book.inStock}
                onClick={handleAddToCart}
              >
                Add to Cart +
              </button>
              <button
                className="buy-now-btn"
                disabled={!book.inStock}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;