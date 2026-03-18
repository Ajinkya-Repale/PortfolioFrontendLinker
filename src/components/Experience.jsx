import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Experience.css";

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [active, setActive]         = useState(0);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await axios.get("http://localhost:8082/experience/all");
        setExperience(res.data || []);
      } catch (err) {
        console.error("Failed to load experience:", err);
        setExperience([]);
      }
    };
    fetchExperience();
  }, []);

  if (experience.length === 0) return null;

  const current = experience[active];

  return (
    <section id="experience" className="exp-section reveal">

      {/* ── Header ── */}
      <div className="exp-header">
        <span className="exp-eyebrow">Career Path</span>
        <h2 className="exp-title">Experience</h2>
      </div>

      <div className="exp-layout">

        {/* ── LEFT — Tab list ── */}
        <div className="exp-tabs">
          {experience.map((exp, i) => (
            <button
              key={exp.id || i}
              className={`exp-tab${active === i ? " exp-tab--active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="exp-tab__dot" />
              <div className="exp-tab__text">
                <span className="exp-tab__company">{exp.companyName}</span>
                <span className="exp-tab__years">
                  {exp.startYear} — {exp.endYear || "Present"}
                </span>
              </div>
            </button>
          ))}

          {/* vertical line behind dots */}
          <div className="exp-tabs__line" />
        </div>

        {/* ── RIGHT — Detail panel ── */}
        <div className="exp-panel" key={active}>

          <div className="exp-panel__top">
            <div>
              <h3 className="exp-panel__role">{current.jobTitle}</h3>
              <p className="exp-panel__company">{current.companyName}</p>
            </div>
            <span className="exp-panel__badge">
              {current.startYear} — {current.endYear || "Present"}
            </span>
          </div>

          {current.description && (
            <p className="exp-panel__desc">{current.description}</p>
          )}

          {/* decorative corner accent */}
          <span className="exp-panel__corner exp-panel__corner--tl" />
          <span className="exp-panel__corner exp-panel__corner--br" />

        </div>

      </div>

    </section>
  );
}