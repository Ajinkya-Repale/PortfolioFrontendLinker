import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Experience.css";

// splits a plain description blob into scannable bullets + a tech-stack tag list
function parseDescription(raw) {
  if (!raw) return { intro: "", bullets: [], stack: [] };

  let text = raw.trim();
  let stack = [];

  // pull a trailing "Tech Stack: A, B, C" segment out into tags
  const stackMatch = text.match(/Tech Stack:\s*(.+)$/i);
  if (stackMatch) {
    stack = stackMatch[1]
      .split(/[·,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    text = text.slice(0, stackMatch.index).trim();
  }

  // pull an optional "Key Contributions:" label, then split the rest into sentences
  text = text.replace(/Key Contributions:\s*/i, "");

  const sentences = text
    .split(/(?<=[.])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);

  // first two sentences read as the intro paragraph, the rest become bullets
  const intro = sentences.slice(0, 2).join(" ");
  const rest = sentences.slice(2);
  const seen = new Set();
  const bullets = rest.filter((s) => {
    if (seen.has(s)) return false; // guard against duplicated sentences in source data
    seen.add(s);
    return true;
  });

  return { intro: intro || "", bullets, stack };
}

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [active, setActive]         = useState(0);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await axios.get("https://portfoliobackendlinker.onrender.com/experience/all");
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

          {current.description && (() => {
            const { intro, bullets, stack } = parseDescription(current.description);
            return (
              <>
                {intro && <p className="exp-panel__desc">{intro}</p>}

                {bullets.length > 0 && (
                  <ul className="exp-panel__list">
                    {bullets.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}

                {stack.length > 0 && (
                  <div className="exp-panel__stack">
                    {stack.map((tech) => (
                      <span key={tech} className="exp-panel__stack-tag">{tech}</span>
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          {/* decorative corner accent */}
          <span className="exp-panel__corner exp-panel__corner--tl" />
          <span className="exp-panel__corner exp-panel__corner--br" />

        </div>

      </div>

    </section>
  );
}