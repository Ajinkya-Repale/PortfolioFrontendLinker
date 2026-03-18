import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AboutAdmin.css";

const extractId = (item) =>
  item?._id?.$oid
  || item?._id
  || item?.id
  || null;

const EMPTY_FORM = {
  name:     "",
  role:     "",
  bio1:     "",
  bio2:     "",
  location: "",
  college:  "",
  degree:   "",
};

export default function AboutAdmin() {
  const [abouts,    setAbouts]    = useState([]);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  useEffect(() => { fetchAbouts(); }, []);

  const fetchAbouts = async () => {
    setError(null);
    try {
      const res = await axios.get("http://localhost:8082/about/all");
      setAbouts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch about data:", err);
      setError("Could not load about data. Is the backend running?");
      setAbouts([]);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.post("http://localhost:8082/about/add", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setForm(EMPTY_FORM);
      await fetchAbouts();
    } catch (err) {
      console.error("Add failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Add failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleEdit = (about) => {
    const id = extractId(about);
    if (!id) return alert("Could not determine ID — check console.");
    setEditingId(id);
    setForm({
      name:     about.name     || "",
      role:     about.role     || "",
      bio1:     about.bio1     || "",
      bio2:     about.bio2     || "",
      location: about.location || "",
      college:  about.college  || "",
      degree:   about.degree   || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!editingId) return alert("No editing ID found. Please click Edit again.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8082/about/update/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEditingId(null);
      setForm(EMPTY_FORM);
      await fetchAbouts();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Update failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!id) return alert("Could not determine ID.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    if (!window.confirm("Delete this about entry?")) return;
    try {
      await axios.delete(`http://localhost:8082/about/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchAbouts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Delete failed. Check console.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="about-admin-page">

      {/* ── Page Title ── */}
      <h2 className="about-admin-title">About Section</h2>

      {/* ── Error Banner ── */}
      {error && (
        <div className="about-error-banner">
          ⚠ {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchAbouts}>Retry</button>
        </div>
      )}

      {/* ── Form Card ── */}
      <div className={`about-form-card${editingId ? " about-form-card--editing" : ""}`}>

        <div className="about-form-mode">
          <span className={`about-form-mode-dot${editingId ? " about-form-mode-dot--warn" : ""}`} />
          {editingId ? `Edit Mode — ID: ${editingId}` : "Add a new about entry"}
        </div>

        <div className="about-form-grid">

          <div className="about-field">
            <label>Name</label>
            <input
              name="name"
              placeholder="e.g. Ajinkya Repale"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="about-field">
            <label>Role</label>
            <input
              name="role"
              placeholder="e.g. Java Developer"
              value={form.role}
              onChange={handleChange}
            />
          </div>

          <div className="about-field">
            <label>Location</label>
            <input
              name="location"
              placeholder="e.g. Pune, Maharashtra"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="about-field">
            <label>Degree</label>
            <input
              name="degree"
              placeholder="e.g. B.E. Computer Engineering"
              value={form.degree}
              onChange={handleChange}
            />
          </div>

          <div className="about-field about-field--full">
            <label>College</label>
            <input
              name="college"
              placeholder="e.g. Pune University"
              value={form.college}
              onChange={handleChange}
            />
          </div>

          <div className="about-field about-field--full">
            <label>Bio Paragraph 1</label>
            <textarea
              name="bio1"
              placeholder="First paragraph about yourself..."
              value={form.bio1}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="about-field about-field--full">
            <label>Bio Paragraph 2 <span className="about-optional">(optional)</span></label>
            <textarea
              name="bio2"
              placeholder="Second paragraph about yourself..."
              value={form.bio2}
              onChange={handleChange}
              rows={3}
            />
          </div>

        </div>

        <div className="about-form-actions">
          {editingId ? (
            <>
              <button className="btn btn-save" onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving…" : "✓ Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding…" : "+ Add Entry"}
            </button>
          )}
        </div>

      </div>

      {/* ── List Header ── */}
      <div className="about-list-header">
        <span>Saved Entries</span>
        <span className="badge badge-count">{abouts.length}</span>
      </div>

      {/* ── List ── */}
      <div className="about-list">
        {abouts.length === 0 ? (
          <div className="about-empty">
            <div className="about-empty-icon">👤</div>
            {error ? "Failed to load entries." : "No about entries yet. Add one above."}
          </div>
        ) : (
          abouts.map((about) => {
            const id = extractId(about);
            const isEditing = id && editingId === id;
            return (
              <div key={id || Math.random()} className={`about-item${isEditing ? " about-item--editing" : ""}`}>

                <div className="about-item-info">
                  <div className="about-item-name">{about.name}</div>
                  <div className="about-item-meta">
                    {about.role     && <span className="badge badge-blue">{about.role}</span>}
                    {about.location && <span className="about-item-sub">📍 {about.location}</span>}
                    {about.degree   && <span className="about-item-sub">🎓 {about.degree}</span>}
                  </div>
                  {about.bio1 && (
                    <p className="about-item-bio">{about.bio1}</p>
                  )}
                </div>

                <div className="about-item-actions">
                  {isEditing ? (
                    <>
                      <button className="btn btn-save btn-sm" onClick={handleUpdate} disabled={loading}>
                        {loading ? "…" : "✓ Save"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
                        ✕ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(about)}>
                        ✏ Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>
                        🗑 Delete
                      </button>
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