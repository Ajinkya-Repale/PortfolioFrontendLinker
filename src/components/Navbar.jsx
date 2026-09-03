import React, { useState, useEffect } from "react";
import "../styles/navbar.css";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ dark, setDark }) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      setActiveSection(id); // highlight immediately on click
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      setMenuOpen(false); // close menu on mobile
    }
  };

  // Scrollspy: keep highlight in sync when user scrolls manually.
  // Uses distance-from-top instead of intersectionRatio, so tall
  // sections (Projects, Experience) aren't skipped over.
  //
  // Some sections (Projects, Experience) render nothing until their
  // axios fetch resolves, so their #id doesn't exist in the DOM yet
  // when this effect first runs. A MutationObserver re-attaches the
  // IntersectionObserver whenever the page's DOM changes, so late-
  // mounted sections get picked up too.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        // Section becomes "active" once its top crosses this line
        rootMargin: "-15% 0px -80% 0px",
        threshold: 0,
      }
    );

    const observedIds = new Set();

    const attachToAvailableSections = () => {
      NAV_ITEMS.forEach((item) => {
        if (observedIds.has(item.id)) return;
        const section = document.getElementById(item.id);
        if (section) {
          observer.observe(section);
          observedIds.add(item.id);
        }
      });
    };

    attachToAvailableSections(); // catch sections already in the DOM

    // Watch for late-mounted sections (Projects/Experience after fetch)
    const mutationObserver = new MutationObserver(attachToAvailableSections);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <nav className={`navbar ${dark ? "dark" : "light"}`}>

      <div className="logo">
        <img src="/logo.png" alt="AR logo" className="logo-img" />
      </div>

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

        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={activeSection === item.id ? "active-link" : ""}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}

      </div>

    </nav>
  );
}