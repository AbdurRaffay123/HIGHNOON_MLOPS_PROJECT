import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../assets/LogoHighnoon.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`container_nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav__logo">
        <img src={logo} alt="Highnoon" />
      </div>

      <div className="nav__menu" id="nav-menu">
        <ul className="nav__list">
          <li className="nav__item">
            <a href="#home" className="nav__link">
              Home
            </a>
          </li>
          <li className="nav__item">
            <a href="#upload" className="nav__link">
              Upload File
            </a>
          </li>
          <li className="nav__item">
            <a href="#mlops" className="nav__link">
              MLOps
            </a>
          </li>
          <li className="nav__item">
            <a href="#data-science" className="nav__link">
              Data Science
            </a>
          </li>
          <li className="nav__item">
            <a href="#contact" className="nav__link">
              Contact
            </a>
          </li>
        </ul>
      </div>

      <div className="search-box">
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="search-btn">
          <img
            src="https://img.icons8.com/?size=100&id=7695&format=png&color=000000"
            alt="Search Icon"
            className="search-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
