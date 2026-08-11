import React, { useEffect, useState } from "react";
import axios from "axios";
import { TbMapPin, TbSchool, TbBriefcase } from "react-icons/tb";
import "../styles/about.css";

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [visible, setVisible]     = useState(false);

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
        setTimeout(() => setVisible(true), 100);
      }
    };
    fetchAbout();
  }, []);

  const initials = aboutData?.name
    ? aboutData.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "AR";

  return (
    <section id="about" className="about-section">
      <div className="about-container">

        <h2 className={`about-title about-reveal ${visible ? "active" : ""}`}>
          About Me
        </h2>

        {loading ? (
          <div className="about-skeleton-wrap">
            <div className="about-skeleton" style={{ width: "90%" }} />
            <div className="about-skeleton" style={{ width: "75%" }} />
            <div className="about-skeleton" style={{ width: "60%" }} />
          </div>
        ) : aboutData ? (
          <>
            <div className={`about-header about-reveal about-reveal--delay-1 ${visible ? "active" : ""}`}>
              <div className="about-avatar">{initials}</div>
              <div className="about-bio">
                {aboutData.bio1 && <p className="about-intro">{aboutData.bio1}</p>}
                {aboutData.bio2 && <p className="about-intro">{aboutData.bio2}</p>}
              </div>
            </div>

            <div className={`about-meta about-reveal about-reveal--delay-2 ${visible ? "active" : ""}`}>
              {aboutData.location && (
                <div className="about-meta__card">
                  <div className="about-meta__icon-wrap">
                    <TbMapPin className="about-meta__icon" />
                  </div>
                  <span className="about-meta__label">Location</span>
                  <span className="about-meta__value">{aboutData.location}</span>
                </div>
              )}
              {(aboutData.degree || aboutData.college) && (
                <div className="about-meta__card">
                  <div className="about-meta__icon-wrap">
                    <TbSchool className="about-meta__icon" />
                  </div>
                  <span className="about-meta__label">Education</span>
                  <span className="about-meta__value">{aboutData.degree}</span>
                  {aboutData.college && (
                    <span className="about-meta__sub">{aboutData.college}</span>
                  )}
                </div>
              )}
              {aboutData.role && (
                <div className="about-meta__card">
                  <div className="about-meta__icon-wrap">
                    <TbBriefcase className="about-meta__icon" />
                  </div>
                  <span className="about-meta__label">Role</span>
                  <span className="about-meta__value">{aboutData.role}</span>
                </div>
              )}
            </div>
          </>
        ) : null}

      </div>
    </section>
  );
}