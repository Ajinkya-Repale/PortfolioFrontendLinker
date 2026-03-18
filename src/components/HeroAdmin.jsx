import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminHero.css";

// ── helper: safely extract MongoDB _id regardless of shape ──────────────────
// Spring Boot may return _id as:
//   { $oid: "abc123" }  ← raw MongoDB extended JSON
//   "abc123"            ← plain string (most common with Spring Data)
//   { id: "abc123" }    ← some custom serialisers
const extractId = (hero) =>
  hero?._id?.$oid     // extended JSON shape
  || hero?._id        // plain string shape
  || hero?.id         // alternate field name
  || null;

export default function HeroAdmin() {
  const [heroData, setHeroData]   = useState([]);
  const [form, setForm]           = useState({ introText: "", name: "", role: "", avatarUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  // token is read fresh inside each function call

  useEffect(() => { fetchHero(); }, []);

  const fetchHero = async () => {
    setError(null);
    try {
      const res = await axios.get("http://localhost:8082/hero/all");
      setHeroData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch hero data:", err);
      setError("Could not load hero data. Is the backend running?");
      setHeroData([]);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.post("http://localhost:8082/hero/add", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setForm({ introText: "", name: "", role: "", avatarUrl: "" });
      await fetchHero();
    } catch (err) {
      console.error("Add failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Add failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleEdit = (hero) => {
    const id = extractId(hero);
    console.log("Editing hero, extracted id:", id, "| raw _id:", hero._id); // debug
    if (!id) return alert("Could not determine hero ID — check console.");
    setEditingId(id);
    setForm({
      introText: hero.introText || "",
      name:      hero.name      || "",
      role:      hero.role      || "",
      avatarUrl: hero.avatarUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!editingId) return alert("No editing ID found. Please click Edit again.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8082/hero/edit/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEditingId(null);
      setForm({ introText: "", name: "", role: "", avatarUrl: "" });
      await fetchHero();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Update failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!id) return alert("Could not determine hero ID.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    if (!window.confirm("Delete this hero entry?")) return;
    try {
      await axios.delete(`http://localhost:8082/hero/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchHero();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Delete failed. Check console.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ introText: "", name: "", role: "", avatarUrl: "" });
  };

  return (
    <div className="hero-admin-page">

      {/* ── Page Title ── */}
      <h2 className="hero-admin-title">Hero Section</h2>

      {/* ── Error Banner ── */}
      {error && (
        <div className="hero-error-banner">
          ⚠ {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchHero}>Retry</button>
        </div>
      )}

      {/* ── Form Card ── */}
      <div className={`hero-form-card${editingId ? " hero-form-card--editing" : ""}`}>

        <div className="hero-form-mode">
          <span className={`hero-form-mode-dot${editingId ? " hero-form-mode-dot--warn" : ""}`} />
          {editingId
            ? `Edit Mode — ID: ${editingId}`
            : "Add a new hero entry"}
        </div>

        <div className="hero-form-grid">
          <div className="hero-field">
            <label>Intro Text</label>
            <input
              name="introText"
              placeholder="e.g. Hi, I'm"
              value={form.introText}
              onChange={handleChange}
            />
          </div>

          <div className="hero-field">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="e.g. Avinash Repale"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="hero-field">
            <label>Role</label>
            <input
              name="role"
              placeholder="e.g. Java Developer"
              value={form.role}
              onChange={handleChange}
            />
          </div>

          <div className="hero-field">
            <label>Avatar URL</label>
            <input
              name="avatarUrl"
              placeholder="/Images/Profile.jpg"
              value={form.avatarUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="hero-form-actions">
          {editingId ? (
            <>
              <button
                className="btn btn-save"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving…" : "✓ Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Adding…" : "+ Add Entry"}
            </button>
          )}
        </div>
      </div>

      {/* ── List Header ── */}
      <div className="hero-list-header">
        <span>Saved Entries</span>
        <span className="badge badge-count">{heroData.length}</span>
      </div>

      {/* ── Hero List ── */}
      <div className="hero-list">
        {heroData.length === 0 ? (
          <div className="hero-empty">
            <div className="hero-empty-icon">🧑‍💻</div>
            {error ? "Failed to load entries." : "No hero entries yet. Add one above."}
          </div>
        ) : (
          heroData.map((hero) => {
            const id = extractId(hero);
            const isEditing = id && editingId === id;
            return (
              <div key={id || Math.random()} className={`hero-item${isEditing ? " hero-item--editing" : ""}`}>

                <img
                  src={hero.avatarUrl || "/Images/Profile.jpg"}
                  alt={hero.name}
                />

                <div className="hero-item-info">
                  <div className="hero-item-name">{hero.name}</div>
                  <div className="hero-item-meta">
                    <span className="badge badge-blue">{hero.role}</span>
                    {hero.introText && (
                      <span className="hero-item-intro">"{hero.introText}"</span>
                    )}
                  </div>
                </div>

                <div className="hero-item-actions">
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
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(hero)}>
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