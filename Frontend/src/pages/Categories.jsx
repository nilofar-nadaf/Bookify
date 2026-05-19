import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import "../index.css";

const Categories = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/books");
        setAllBooks(response.data);
      } catch (error) {
        console.error("Frontend Axios Error:", error);
      }
    };
    fetchBooks();
  }, []);

  const categories = [
    "All",
    ...new Set(allBooks.map((book) => book.category).filter(Boolean)),
  ];

  const books =
    activeCategory === "All"
      ? allBooks
      : allBooks.filter(
          (book) =>
            (book.category || "").toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <main className="shop-wrapper">
      <header className="category-page-header">
        <p className="section-tag">Browse by Genre</p>
        <h1 className="title-text">
          Book <span>Categories</span>
        </h1>

        <div className="category-tabs-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <section className="shop-grid">
        {books.length > 0 ? (
          books.map((book) => <BookCard key={book.id} {...book} />)
        ) : (
          <div className="no-books-container">
            <p>
              No books found in <strong>{activeCategory}</strong>.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Categories;