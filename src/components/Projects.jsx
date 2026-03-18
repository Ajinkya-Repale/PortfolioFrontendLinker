import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/projects.css";

const BASE_URL = "http://localhost:8082";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_URL}/projects/all`)
      .then(res => {
        const mappedProjects = res.data.map((p, index) => ({
          id: p._id?.$oid || p.id || index,
          title: p.title || "Untitled",
          description: p.description || "",
          tech: Array.isArray(p.tech) ? p.tech : (p.tech ? p.tech.split(",").map(t => t.trim()) : []),
          liveDemo: p.liveDemo || "",
          github: p.github || "",
          image: p.image || "/Images/placeholder.png",
        }));
        setProjects(mappedProjects);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  function openLink(url) {
    if (url) {
      window.open(url, "_blank", "noreferrer");
    }
  }

  if (loading) return <p>Loading Projects...</p>;
  if (!projects.length) return <p>No projects found.</p>;

  return (
    <section id="projects" className="projects-section reveal">
      <div className="projects-header">
        <h2>Selected Work</h2>
        <p>
          A selection of projects that showcase my ability to
          build modern, scalable and user-focused applications.
        </p>
      </div>

      <div className="projects-container">
        {projects.map((project, index) => (
          <div
            className={"project-showcase " + (index % 2 === 0 ? "normal" : "reverse")}
            key={project.id}
          >
            <div className="project-image">
              <img
                src={project.image}
                alt={project.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/Images/placeholder.png";
                }}
              />
              <div className="image-overlay"></div>
            </div>

            <div className="project-content">
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <div className="project-tech">
                {project.tech.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>

              <div className="project-links">
                <button
                  className="project-btn"
                  onClick={() => openLink(project.liveDemo)}
                  disabled={!project.liveDemo}
                >
                  Live Demo
                </button>

                <button
                  className="project-btn outline"
                  onClick={() => openLink(project.github)}
                  disabled={!project.github}
                >
                  View Code
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}