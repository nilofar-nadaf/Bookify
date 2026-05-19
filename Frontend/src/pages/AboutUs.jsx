import React from "react";
import "../index.css";

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-image">
          <img src="Images/aboutUs.jpg" alt="Our Library" />
        </div>

        <div className="about-content">
          <p className="section-tag">Our Story</p>

          <h2>
            A quiet corner for <span>dreamers.</span>
          </h2>

          <p>
            Founded in 2026, Bookify started with a simple mission: to make the
            magic of reading accessible to everyone. We believe that every book
            is a gateway to a new world, and we've curated a collection that
            spans across genres and generations.
          </p>

          <div className="about-stats">
            <div className="stat-item">
              <h3>10k+</h3>
              <p>Books</p>
            </div>

            <div className="stat-item">
              <h3>5k+</h3>
              <p>Readers</p>
            </div>

            <div className="stat-item">
              <h3>50+</h3>
              <p>Genres</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
