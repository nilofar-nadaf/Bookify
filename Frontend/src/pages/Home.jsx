import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import About from "./AboutUs";
import Footer from "../components/Footer";
import "../index.css";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };

  return (
    <>
      {/* HERO SECTION */}
      <div className="hero-container">
        <div className="hero-content">
          <h1>
            Where every page <br /> is a new adventure.
          </h1>

          <p className="subtitle">
            Discover a curated collection of stories that spark the imagination.
            From timeless classics to modern masterpieces, find your next dream here.
          </p>

          <form className="search-bar" onSubmit={handleSearch}>
            <button type="submit" className="search-icon-btn" aria-label="Search books">
              <i className="fas fa-search"></i>
            </button>
            <input
              type="text"
              placeholder="Search your books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-shopping-cart cart-icon" onClick={() => navigate("/cart")}></i>
          </form>
        </div>

        <div className="hero-image">
          <img src="Images/books.png" alt="books" />
        </div>
      </div>

      <About />
      <Footer />
    </>
  );
};

export default Home;