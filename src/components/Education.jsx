import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Education.css";

const RING_RADIUS = 16;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~100.53

export default function Education() {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await axios.get("https://portfoliobackendlinker.onrender.com/education/all");
      setEducation(res.data || []);
    } catch (err) {
      console.error("Failed to load education:", err);
      setEducation([]);
    }
  };

  // percentage assumed on a 10-point CGPA scale; adjust divisor if your data uses 100-point scale
  const getRingOffset = (percentage) => {
    const val = parseFloat(percentage);
    if (isNaN(val)) return RING_CIRCUMFERENCE;
    const ratio = Math.min(val / 10, 1);
    return RING_CIRCUMFERENCE * (1 - ratio);
  };

  return (
    <section id="education" className="education-section reveal">
      <div className="education-inner">

        
        <h2 className="education-title">
          Education
          <span className="education-title-accent">& credentials</span>
        </h2>

        <div className="education-container">
          {education.length === 0 ? (
            <p className="education-empty">No education data available.</p>
          ) : (
            education.map((edu) => {
              const isComplete = edu.percentage && !isNaN(parseFloat(edu.percentage));
              const ringOffset = isComplete ? getRingOffset(edu.percentage) : RING_CIRCUMFERENCE;

              return (
                <div
                  key={edu.id}
                  className={`education-card ${isComplete ? "is-complete" : ""}`}
                >
                  <div className="education-dot" />

                  <div className="education-card-body">

                    <div className="education-card-header">
                      <h3 className="education-degree">{edu.degree}</h3>

                      <span className="education-years-badge">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M1 5h10" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                        {edu.startYear} – {edu.endYear || "Present"}
                      </span>
                    </div>

                    {edu.collegeTitle && (
                      <p className="education-college">{edu.collegeTitle}</p>
                    )}

                    <div className="education-card-footer">
                      <div className="education-gpa-ring">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                          <circle className="track" cx="20" cy="20" r={RING_RADIUS} fill="none" strokeWidth="3" />
                          <circle
                            className={`fill ${isComplete ? "" : "dim"}`}
                            cx="20" cy="20" r={RING_RADIUS} fill="none" strokeWidth="3"
                            strokeDasharray={RING_CIRCUMFERENCE}
                            strokeDashoffset={ringOffset}
                          />
                        </svg>
                      </div>

                      <div className="education-gpa-text">
                        <span className="education-gpa-label">CGPA</span>
                        <span className={`education-gpa-value ${isComplete ? "" : "pending"}`}>
                          {isComplete ? `${edu.percentage} / 10` : "In progress"}
                        </span>
                      </div>

                      <span className={`education-status-tag ${isComplete ? "" : "muted"}`}>
                        {isComplete ? "Completed" : "Ongoing"}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}