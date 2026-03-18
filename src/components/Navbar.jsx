import React, { useState } from "react";
import "../styles/navbar.css";

export default function Navbar({ dark, setDark }) {

  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      setMenuOpen(false); // close menu on mobile
    }
  };

  return (
    <nav className={`navbar ${dark ? "dark" : "light"}`}>

      <div className="logo">PortDev</div>

      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        <button onClick={() => scrollToSection("about")}>About</button>
        <button onClick={() => scrollToSection("skills")}>Skills</button>
        <button onClick={() => scrollToSection("projects")}>Projects</button>
        <button onClick={() => scrollToSection("education")}>Education</button>
        <button onClick={() => scrollToSection("experience")}>Experience</button>
        <button onClick={() => scrollToSection("contact")}>Contact</button>

        <button
          className="mode-toggle"
          onClick={() => setDark(!dark)}
        >
          {dark ? "Light" : "Dark"}
        </button>

      </div>

    </nav>
  );
}