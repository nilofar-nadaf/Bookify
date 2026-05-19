import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import "../index.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceAction, setPriceAction] = useState("default");

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchTerm(searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [booksResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/users/books"),
          axios.get("http://localhost:5000/api/users/categories"),
        ]);
        setBooks(booksResponse.data);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Backend Error:", error);
      }
    };
    fetchBooks();
  }, []);

  const processedBooks = books
    .filter((book) => {
      const searchMatch =
        (book.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.author || "").toLowerCase().includes(searchTerm.toLowerCase());

      const inStock = Boolean(book.inStock);
      const categoryMatch =
        selectedCategory === "all" ||
        (book.category || "").toLowerCase() === selectedCategory.toLowerCase();
      const stockMatch =
        stockFilter === "all" ||
        (stockFilter === "instock" && inStock) ||
        (stockFilter === "outofstock" && !inStock);

      let priceMatch = true;
      if (priceAction === "0-500") priceMatch = book.price <= 500;
      if (priceAction === "600-5000") priceMatch = book.price >= 600 && book.price <= 5000;

      return searchMatch && categoryMatch && stockMatch && priceMatch;
    })
    .sort((a, b) => {
      if (priceAction === "low-high") return a.price - b.price;
      if (priceAction === "high-low") return b.price - a.price;
      return 0;
    });

  return (
    <main className="shop-wrapper">
      <header className="filter-nav">
        <div className="filter-left">
          <div className="dropdown-item">
            <input
              type="text"
              placeholder="Search by title or author"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value.trim()) {
                  setSearchParams({ search: value });
                } else {
                  setSearchParams({});
                }
              }}
              className="filter-input"
            />
          </div>

          <div className="dropdown-item">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              className="filter-select"
            >
              <option value="all">Category</option>
              {categories.map((category) => (
                <option key={category.id || category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-item">
            <select
              onChange={(e) => setStockFilter(e.target.value)}
              value={stockFilter}
              className="filter-select"
            >
              <option value="all">Availability</option>
              <option value="instock">In Stock</option>
              <option value="outofstock">Out of Stock</option>
            </select>
          </div>

          <div className="dropdown-item">
            <select
              onChange={(e) => setPriceAction(e.target.value)}
              value={priceAction}
              className="filter-select"
            >
              <option value="default">Price</option>
              <option value="0-500">Under Rs.500</option>
              <option value="600-5000">Rs.600 - Rs.5000</option>
              <option value="low-high">Sort: Low to High</option>
              <option value="high-low">Sort: High to Low</option>
            </select>
          </div>
        </div>

        <div className="filter-right">
          <button
            className="reset-filter-btn"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setStockFilter("all");
              setPriceAction("default");
              setSearchParams({});
            }}
          >
            Reset
          </button>
          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </header>

      <p className="shop-result-count">{processedBooks.length} books found</p>

      <section className={viewMode === "grid" ? "shop-grid" : "shop-list"}>
        {processedBooks.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </section>
    </main>
  );
};

export default Shop;