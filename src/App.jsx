import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Public components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Experience from "./components/Experience";

// Admin components
import AdminLogin from "./components/AdminLogin";

import AdminPanel from "./components/AdminPanel";  // ← single source of truth

// Styles
import "./styles/global.css";
import "./styles/AdminPanel.css";

export default function App() {
  const [dark, setDark] = useState(true);

  // ✅ Persist admin state across page refreshes using token in localStorage
  const [admin, setAdmin] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    });
    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <Router>
      <Routes>
        {/* PUBLIC PORTFOLIO */}
        <Route
          path="/"
          element={
            <>
              <Navbar dark={dark} setDark={setDark} />
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Education />
              <Experience />
              <Contact />
              <footer className="footer">
                © 2026 Ajinkya Repale — Full Stack Developer
              </footer>
            </>
          }
        />

        {/* ADMIN LOGIN / REGISTER */}
        <Route path="/admin/login"    element={<AdminLogin setAdmin={setAdmin} />} />
       

        {/* ADMIN PANEL — protected, redirects to login if no token */}
        <Route
          path="/admin/*"
          element={
            admin
              ? <AdminPanel setAdmin={setAdmin} />
              : <Navigate to="/admin/login" />
          }
        />
      </Routes>
    </Router>
  );
}