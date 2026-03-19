import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/about.css";

export default function About() {

  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get("https://portfoliobackendlinker.onrender.com/about/all");
        if (res.data && res.data.length > 0) {
          setAboutData(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="about-container">

        <h2 className="about-title">About Me</h2>

        {loading ? (
          <div className="about-skeleton-wrap">
            <div className="about-skeleton" style={{ width: "90%" }} />
            <div className="about-skeleton" style={{ width: "75%" }} />
            <div className="about-skeleton" style={{ width: "60%" }} />
          </div>
        ) : aboutData ? (
          <>
            <div className="about-bio">
              {aboutData.bio1 && <p className="about-intro">{aboutData.bio1}</p>}
              {aboutData.bio2 && <p className="about-intro">{aboutData.bio2}</p>}
            </div>

            <div className="about-meta">
              {aboutData.location && (
                <div className="about-meta__item">
                  <span className="about-meta__icon">📍</span>
                  <span>{aboutData.location}</span>
                </div>
              )}
              {(aboutData.degree || aboutData.college) && (
                <div className="about-meta__item">
                  <span className="about-meta__icon">🎓</span>
                  <span>
                    {aboutData.degree && aboutData.college
                      ? `${aboutData.degree} — ${aboutData.college}`
                      : aboutData.degree || aboutData.college}
                  </span>
                </div>
              )}
              {aboutData.role && (
                <div className="about-meta__item">
                  <span className="about-meta__icon">💼</span>
                  <span>{aboutData.role}</span>
                </div>
              )}
            </div>
          </>
        ) : null}

      </div>
    </section>
  );
}
