import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/hero.css";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    introText: "Hello I'm",
    name: "Ajinkya Repale",
    role: "Java Developer",
    avatarUrl: "/Images/Profile.jpg",
  });

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get("http://localhost:8082/hero/all");
        if (res.data.length > 0) {
          const data = res.data[0];
          setHeroData({
            introText: data.introText || "Hello I'm",
            name: data.name || "Your Name",
            role: data.role || "Developer",
            avatarUrl: data.avatarUrl || "/Images/Profile.jpg",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHero();
  }, []);

  // Split name into first and last
  const nameParts = heroData.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <section id="hero" className="hero">

      {/* Background effects */}
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orb hero-orb--1" aria-hidden="true" />
      <div className="hero-orb hero-orb--2" aria-hidden="true" />

      <div className="hero-inner">

        {/* LEFT */}
        <div className="hero-text">

          <p className="hero-intro">{heroData.introText}</p>

          <h1 className="hero-name">
            <span className="hero-name__first">{firstName}</span>
            <span className="hero-name__last">{lastName}</span>
          </h1>

          <h2 className="hero-role">{heroData.role}</h2>

          <p className="hero-summary">
            I build modern web applications using Java, Spring Boot,
            React and cloud technologies.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollTo("projects")}>
              <span>View Projects</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-outline" onClick={() => scrollTo("contact")}>
              Contact Me
            </button>
          </div>

        </div>

        {/* RIGHT */}
        <div className="hero-image-area">
          <div className="hero-image-wrap">

            {/* Corner accents */}
            <span className="hero-corner hero-corner--tl" />
            <span className="hero-corner hero-corner--tr" />
            <span className="hero-corner hero-corner--bl" />
            <span className="hero-corner hero-corner--br" />

            <div className="hero-image-card">
              <img
                src={heroData.avatarUrl}
                alt={heroData.name}
                onError={(e) => { e.target.src = "/Images/Profile.jpg"; }}
              />
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}