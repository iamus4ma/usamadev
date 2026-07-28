import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  /*=============== Change Background Header ===============*/
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      if (window.scrollY >= 80) header.classList.add("scroll-header");
      else header.classList.remove("scroll-header");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /*=============== Toggle Menu ===============*/
  const [Toggle, showMenu] = useState(false);
  const [activeNav, setActiveNav] = useState("#home");

  /*=============== Active Section on Scroll ===============*/
  useEffect(() => {
    const sectionIds = ["home", "about", "skills", "services", "projects", "contact"];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;

      let current = "#home";
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && scrollPos >= section.offsetTop) {
          current = `#${id}`;
        }
      }
      setActiveNav(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [theme, setTheme] = useState("light");

  // Check and apply the theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Toggle theme and save it to localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="header">
      <nav className="nav container">
        <a href="index.html" className="nav__logo">
          Usama Hassan
        </a>
        <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
          <ul className="nav__list grid">
            <li className="nav__item">
              <a
                href="#home"
                onClick={() => setActiveNav("#home")}
                className={
                  activeNav === "#home" ? "nav__link active-link" : "nav__link"
                }
              >
                <i className="uil uil-estate nav__icon"></i>Home
              </a>
            </li>
            <li className="nav__item">
              <a href="#about" onClick={() => setActiveNav("#about")}
                className={
                  activeNav === "#about" ? "nav__link active-link" : "nav__link"
                }>
                <i className="uil uil-user nav__icon"></i>About
              </a>
            </li>
            <li className="nav__item">
              <a href="#skills" onClick={() => setActiveNav("#skills")}
                className={
                  activeNav === "#skills" ? "nav__link active-link" : "nav__link"
                }>
                <i className="uil uil-file-alt nav__icon"></i>Skills
              </a>
            </li>
            <li className="nav__item">
              <a href="#services" onClick={() => setActiveNav("#services")}
                className={
                  activeNav === "#services" ? "nav__link active-link" : "nav__link"
                }>
                <i className="uil uil-briefcase-alt nav__icon"></i>Services
              </a>
            </li>
            <li className="nav__item">
              <a href="#projects" onClick={() => setActiveNav("#projects")}
                className={
                  activeNav === "#projects" ? "nav__link active-link" : "nav__link"
                }>
                <i className="uil uil-briefcase nav__icon"></i>Projects
              </a>
            </li>
            <li className="nav__item">
              <a href="#contact" onClick={() => setActiveNav("#contact")}
                className={
                  activeNav === "#contact" ? "nav__link active-link" : "nav__link"
                }>
                <i className="uil uil-message nav__icon"></i>Contact
              </a>
            </li>
            {/* Theme Toggle Switch */}
            <li className="nav__item nav__theme-item">
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              >
                <span className="theme-toggle__track">
                  <i className="uil uil-sun theme-toggle__sun"></i>
                  <i className="uil uil-moon theme-toggle__moon"></i>
                  <span
                    className={`theme-toggle__thumb ${
                      theme === "dark" ? "theme-toggle__thumb--dark" : ""
                    }`}
                  ></span>
                </span>
              </button>
            </li>
          </ul>
          <i
            className="uil uil-times nav__close"
            onClick={() => showMenu(!Toggle)}
          ></i>
        </div>
        <div className="nav__toggle" onClick={() => showMenu(!Toggle)}>
          <i className="uil uil-apps"></i>
        </div>
      </nav>
    </header>
  );
};

export default Header;