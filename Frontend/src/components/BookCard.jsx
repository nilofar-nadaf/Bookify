import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = (props) => {
  const navigate = useNavigate();
  const fallbackImage = `https://picsum.photos/seed/bookify-${props.id || props.title}/300/420`;

  const resolvedImage =
    props.image && /^https?:\/\//i.test(props.image) ? props.image : fallbackImage;

  const handleDetails = () => {
    navigate(`/book/${props.id}`, { state: props });
  };

  return (
    <div className="book-card-premium">
      <div className="image-container-premium">
        <img
          src={resolvedImage}
          alt={props.title}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      <div className="content-area">
        <h3 className="title-text">{props.title}</h3>
        <p className="author-text">By {props.author}</p>

        <div className="card-footer">
          <span className="price-text">Rs.{props.price}</span>
        </div>
        <div className="card-overlay">
          <button className="view-details-btn" onClick={handleDetails}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;