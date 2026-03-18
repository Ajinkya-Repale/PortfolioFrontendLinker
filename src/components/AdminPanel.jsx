import React, { useState } from "react";
import HeroAdmin from "./HeroAdmin";
import SkillsAdmin from "./SkillsAdmin";
import ProjectsAdmin from "./ProjectsAdmin";
import AboutAdmin from "./AboutAdmin";
import ContactAdmin from "./ContactAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import EducationAdmin from "./EducationAdmin";
import "../styles/AdminPanel.css";

export default function AdminPanel({ setAdmin }) {
  const [activeSection, setActiveSection] = useState("hero");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAdmin(false);
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          {[
            { key: "hero",     label: "Hero" },
            { key: "skills",   label: "Skills" },
            { key: "projects", label: "Projects" },
            { key: "experience", label: "Experience" },
            {key: "education", label:"Education"},
            { key: "about",    label: "About" },
            { key: "contact",  label: "Contact" },
          ].map(({ key, label }) => (
            <li
              key={key}
              className={activeSection === key ? "active" : ""}
              onClick={() => setActiveSection(key)}
            >
              {label}
            </li>
          ))}
        </ul>

        <button className="sidebar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {activeSection === "hero"     && <HeroAdmin />}
        {activeSection === "skills"   && <SkillsAdmin />}
        {activeSection === "projects" && <ProjectsAdmin />}
        {activeSection === "about"    && <AboutAdmin />}
        {activeSection === "contact"  && <ContactAdmin />}
        {activeSection === "experience" && <ExperienceAdmin />}
        {activeSection === "education" && <EducationAdmin />}
      </main>
    </div>
  );
}