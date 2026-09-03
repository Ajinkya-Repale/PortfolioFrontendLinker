import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminProjects.css";

/* ── inline SVG icons (replace emoji) ───────────────────────────────── */
const IconWarning = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconX = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconRocket = (p) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
    <path d="M12 15c-3.5-3.5-4.5-8-4.5-11 3 0 7.5 1 11 4.5-1.5 1.5-3.5 3.5-6.5 6.5Z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const IconCode = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconExternalLink = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconClock = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconEdit = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
/* ───────────────────────────────────────────────────────────────────── */

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
      const res = await axios.get("https://portfoliobackendlinker.onrender.com/projects/all");
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
      await axios.post("https://portfoliobackendlinker.onrender.com/projects/add", buildPayload(), {
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
        `https://portfoliobackendlinker.onrender.com/projects/edit/${editingId}`,
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
      await axios.delete(`https://portfoliobackendlinker.onrender.com/projects/delete/${id}`, {
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
          <IconWarning /> {error}
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
                {loading ? "Saving…" : <><IconCheck /> Save Changes</>}
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}><IconX /> Cancel</button>
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
            <div className="projects-empty-icon"><IconRocket /></div>
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
                    <div className="project-item-thumb-placeholder"><IconRocket width="20" height="20" /></div>
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
                        <IconCode /> View Code
                      </a>
                    )}
                    {project.liveDemo ? (
                      <a href={project.liveDemo} target="_blank" rel="noreferrer"
                        className="project-item-link project-item-link--live"
                        onClick={(e) => e.stopPropagation()}>
                        <IconExternalLink /> Live Demo
                      </a>
                    ) : (
                      <span className="project-item-link--pending"><IconClock /> Live soon</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="project-item-actions">
                  {isEditing ? (
                    <>
                      <button className="btn btn-save btn-sm" onClick={handleUpdate} disabled={loading}>
                        {loading ? "…" : <><IconCheck /> Save</>}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={handleCancel}><IconX /></button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(project)}><IconEdit /> Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project)}><IconTrash /> Delete</button>
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