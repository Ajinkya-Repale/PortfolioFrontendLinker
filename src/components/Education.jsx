import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Education.css";

export default function Education() {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await axios.get("http://localhost:8082/education/all");
      setEducation(res.data || []);
    } catch (err) {
      console.error("Failed to load education:", err);
      setEducation([]);
    }
  };

  return (
    <section id="education" className="education-section reveal">

      <h2 className="education-title">
        <span className="education-title-accent">Education</span>
      </h2>
      <div className="education-subtitle-line" />

      <div className="education-container">
        {education.length === 0 ? (
          <p className="education-empty">No education data available.</p>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="education-card">

              <div className="education-dot" />

              <div className="education-card-body">

                <div className="education-card-header">
                  <h3 className="education-college">{edu.collegeTitle}</h3>
                  <span className="education-years-badge">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M1 5h10" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    {edu.startYear} – {edu.endYear}
                  </span>
                </div>

                {edu.degree && (
                  <p className="education-degree">{edu.degree}</p>
                )}

                <div className="education-card-footer">
                  <span className="education-percentage-pill">
                    {edu.percentage}
                  </span>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </section>
  );
}
