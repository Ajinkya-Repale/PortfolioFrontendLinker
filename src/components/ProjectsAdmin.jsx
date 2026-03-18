import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminProjects.css";

const extractId = (item) =>
  item?._id?.$oid || item?._id || item?.id || null;

// tech is stored as List<String> in backend
// we handle it as a comma-separated string in the form for easy input
const techToString = (tech) => (Array.isArray(tech) ? tech.join(", ") : tech || "");
const stringToTech = (str) => str.split(",").map((t) => t.trim()).filter(Boolean);

const EMPTY_FORM = {
  title:       "",
  description: "",
  tech:        "",   // comma-separated string in form, converted to array on submit
  github:      "",
  liveDemo:    "",
  image:       "",
};

export default function ProjectsAdmin() {
  const [projects, setProjects]   = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const token = () => localStorage.getItem("token");

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setError(null);
    try {
      const res = await axios.get("http://localhost:8082/projects/all");
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Could not load projects.");
      setProjects([]);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Build payload matching backend entity field names
  const buildPayload = () => ({
    title:       form.title,
    description: form.description,
    tech:        stringToTech(form.tech),
    github:      form.github,
    liveDemo:    form.liveDemo,
    image:       form.image,
  });

  const handleAdd = async () => {
    if (!token()) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.post("http://localhost:8082/projects/add", buildPayload(), {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setForm(EMPTY_FORM);
      await fetchProjects();
    } catch (err) {
      alert(err.response?.status === 403 ? "403 — check your token." : "Add failed.");
    } finally { setLoading(false); }
  };

  const handleEdit = (project) => {
    const id = extractId(project);
    if (!id) return alert("Could not determine project ID.");
    setEditingId(id);
    setForm({
      title:       project.title       || "",
      description: project.description || "",
      tech:        techToString(project.tech),
      github:      project.github      || "",
      liveDemo:    project.liveDemo    || "",
      image:       project.image       || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!editingId) return alert("No editing ID found.");
    if (!token()) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8082/projects/edit/${editingId}`,
        buildPayload(),
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setEditingId(null);
      setForm(EMPTY_FORM);
      await fetchProjects();
    } catch (err) {
      alert(err.response?.status === 403 ? "403 — check your token." : "Update failed.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (project) => {
    if (!token()) return alert("Admin login required.");
    if (!window.confirm("Delete this project?")) return;
    const id = extractId(project);
    try {
      await axios.delete(`http://localhost:8082/projects/delete/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      await fetchProjects();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="projects-admin-page">

      <h2 className="projects-admin-title">Projects Section</h2>

      {error && (
        <div className="projects-error-banner">
          ⚠ {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchProjects}>Retry</button>
        </div>
      )}

      {/* ── Form Card ── */}
      <div className={`projects-form-card${editingId ? " projects-form-card--editing" : ""}`}>
        <div className="projects-form-mode">
          <span className={`projects-form-dot${editingId ? " projects-form-dot--warn" : ""}`} />
          {editingId ? "Edit Mode — update fields and save" : "Add a new project"}
        </div>

        <div className="projects-form-grid">

          {/* Row 1: Title + GitHub */}
          <div className="projects-field">
            <label>Title</label>
            <input name="title" placeholder="e.g. Portfolio Website" value={form.title} onChange={handleChange} />
          </div>
          <div className="projects-field">
            <label>GitHub URL</label>
            <input name="github" placeholder="https://github.com/you/repo" value={form.github} onChange={handleChange} />
          </div>

          {/* Row 2: Live Demo + Image */}
          <div className="projects-field">
            <label>Live Demo URL <span className="projects-field-optional">(optional)</span></label>
            <input name="liveDemo" placeholder="https://yourproject.com" value={form.liveDemo} onChange={handleChange} />
          </div>
          <div className="projects-field">
            <label>Image URL</label>
            <input name="image" placeholder="/Images/project1.jpg or https://..." value={form.image} onChange={handleChange} />
          </div>

          {/* Row 3: Tech stack — full width */}
          <div className="projects-field projects-field--full">
            <label>Tech Stack <span className="projects-field-hint">comma-separated — e.g. React, Spring Boot, MongoDB</span></label>
            <input name="tech" placeholder="React, Spring Boot, MongoDB, Tailwind CSS" value={form.tech} onChange={handleChange} />
          </div>

          {/* Row 4: Description — full width */}
          <div className="projects-field projects-field--full">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Brief description of the project..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

        </div>

        <div className="projects-form-actions">
          {editingId ? (
            <>
              <button className="btn btn-save" onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving…" : "✓ Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}>✕ Cancel</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding…" : "+ Add Project"}
            </button>
          )}
        </div>
      </div>

      {/* ── List Header ── */}
      <div className="projects-list-header">
        <span>Saved Projects</span>
        <span className="projects-count-badge">{projects.length}</span>
      </div>

      {/* ── Projects List ── */}
      <div className="projects-list">
        {projects.length === 0 ? (
          <div className="projects-empty">
            <div className="projects-empty-icon">🚀</div>
            No projects yet. Add one above.
          </div>
        ) : (
          projects.map((project) => {
            const id = extractId(project);
            const isEditing = editingId === id;
            return (
              <div key={id} className={`project-item${isEditing ? " project-item--editing" : ""}`}>

                {/* Thumbnail */}
                <div className="project-item-thumb">
                  {project.image ? (
                    <img src={project.image} alt={project.title} />
                  ) : (
                    <div className="project-item-thumb-placeholder">🚀</div>
                  )}
                </div>

                {/* Info */}
                <div className="project-item-info">
                  <div className="project-item-title">{project.title}</div>
                  <div className="project-item-desc">{project.description}</div>

                  {/* Tech tags */}
                  {project.tech?.length > 0 && (
                    <div className="project-item-tech">
                      {project.tech.slice(0, 4).map((t) => (
                        <span key={t} className="project-tech-tag">{t}</span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="project-tech-tag project-tech-tag--more">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="project-item-links">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer"
                        className="project-item-link project-item-link--github"
                        onClick={(e) => e.stopPropagation()}>
                        ⌥ View Code
                      </a>
                    )}
                    {project.liveDemo ? (
                      <a href={project.liveDemo} target="_blank" rel="noreferrer"
                        className="project-item-link project-item-link--live"
                        onClick={(e) => e.stopPropagation()}>
                        ↗ Live Demo
                      </a>
                    ) : (
                      <span className="project-item-link--pending">⏳ Live soon</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="project-item-actions">
                  {isEditing ? (
                    <>
                      <button className="btn btn-save btn-sm" onClick={handleUpdate} disabled={loading}>
                        {loading ? "…" : "✓ Save"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={handleCancel}>✕</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(project)}>✏ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project)}>🗑 Delete</button>
                    </>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}