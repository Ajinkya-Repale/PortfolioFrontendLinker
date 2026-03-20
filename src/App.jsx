import React, { useState, useEffect, useRef } from "react";
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
import AdminPanel from "./components/AdminPanel";

// Backend loader
import BackendLoader from "./components/BackendLoader";

// Styles
import "./styles/global.css";
import "./styles/AdminPanel.css";

export default function App() {
  const [dark, setDark] = useState(true);
  const [admin, setAdmin] = useState(() => !!localStorage.getItem("token"));
  const [backendReady, setBackendReady] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const observe = () => {
      const elements = document.querySelectorAll(".reveal:not(.active)");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
            }
          });
        },
        { threshold: 0.05 }
      );
      elements.forEach((el) => observer.observe(el));
    };

    observe();
    const t1 = setTimeout(observe, 500);
    const t2 = setTimeout(observe, 1500);
    const t3 = setTimeout(observe, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [backendReady]);

  // Cursor glow effect
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let animFrame;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = "1";
    };

    const onMouseLeave = () => {
      cursor.style.opacity = "0";
    };

    const animate = () => {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      cursor.style.left = `${curX - 10}px`;
      cursor.style.top  = `${curY - 10}px`;
      animFrame = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    animFrame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (!backendReady) {
    return (
      <>
        <div ref={cursorRef} className="cursor-glow" />
        <BackendLoader onReady={() => setBackendReady(true)} />
      </>
    );
  }

  return (
    <>
      <div ref={cursorRef} className="cursor-glow" />

      <Router>
        <Routes>
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
          <Route path="/admin/login" element={<AdminLogin setAdmin={setAdmin} />} />
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
    </>
  );
}