import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/FooterAdmin.css";

// ── helper: safely extract MongoDB _id regardless of shape ──────────────────
const extractId = (footer) =>
  footer?._id?.$oid
  || footer?._id
  || footer?.id
  || null;

export default function FooterAdmin() {
  const [footerData, setFooterData] = useState([]);
  const [form, setForm] = useState({ linkedinUrl: "", githubUrl: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchFooter(); }, []);

  const fetchFooter = async () => {
    setError(null);
    try {
      const res = await axios.get("https://portfoliobackendlinker.onrender.com/footer/all");
      setFooterData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch footer data:", err);
      setError("Could not load footer data. Is the backend running?");
      setFooterData([]);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.post("https://portfoliobackendlinker.onrender.com/footer/add", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setForm({ linkedinUrl: "", githubUrl: "", email: "" });
      await fetchFooter();
    } catch (err) {
      console.error("Add failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Add failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleEdit = (footer) => {
    const id = extractId(footer);
    if (!id) return alert("Could not determine footer ID — check console.");
    setEditingId(id);
    setForm({
      linkedinUrl: footer.linkedinUrl || "",
      githubUrl: footer.githubUrl || "",
      email: footer.email || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!editingId) return alert("No editing ID found. Please click Edit again.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.put(
        `https://portfoliobackendlinker.onrender.com/footer/edit/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEditingId(null);
      setForm({ linkedinUrl: "", githubUrl: "", email: "" });
      await fetchFooter();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Update failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!id) return alert("Could not determine footer ID.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    if (!window.confirm("Delete this footer entry?")) return;
    try {
      await axios.delete(`https://portfoliobackendlinker.onrender.com/footer/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchFooter();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Delete failed. Check console.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ linkedinUrl: "", githubUrl: "", email: "" });
  };

  return (
    <div className="footer-admin-page">

      <h2 className="footer-admin-title">Footer Links</h2>

      {error && (
        <div className="footer-admin-error-banner">
          ⚠ {error}
          <button className="fa-btn fa-btn-ghost fa-btn-sm" onClick={fetchFooter}>Retry</button>
        </div>
      )}

      <div className={`footer-admin-form-card${editingId ? " footer-admin-form-card--editing" : ""}`}>

        <div className="footer-admin-form-mode">
          <span className={`footer-admin-mode-dot${editingId ? " footer-admin-mode-dot--warn" : ""}`} />
          {editingId
            ? `Edit Mode — ID: ${editingId}`
            : "Add footer social links"}
        </div>

        <div className="footer-admin-form-grid">
          <div className="footer-admin-field">
            <label>LinkedIn URL</label>
            <input
              name="linkedinUrl"
              placeholder="https://linkedin.com/in/your-profile"
              value={form.linkedinUrl}
              onChange={handleChange}
            />
          </div>

          <div className="footer-admin-field">
            <label>GitHub URL</label>
            <input
              name="githubUrl"
              placeholder="https://github.com/your-username"
              value={form.githubUrl}
              onChange={handleChange}
            />
          </div>

          <div className="footer-admin-field">
            <label>Email</label>
            <input
              name="email"
              placeholder="your-email@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="footer-admin-form-actions">
          {editingId ? (
            <>
              <button className="fa-btn fa-btn-save fa-btn-sm" onClick={handleUpdate} disabled={loading}>
                {loading ? "…" : "✓ Save"}
              </button>
              <button className="fa-btn fa-btn-ghost fa-btn-sm" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </>
          ) : (
            <button className="fa-btn fa-btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding…" : "+ Add Entry"}
            </button>
          )}
        </div>
      </div>

      <div className="footer-admin-list-header">
        <span>Saved Entries</span>
        <span className="fa-badge fa-badge-count">{footerData.length}</span>
      </div>

      <div className="footer-admin-list">
        {footerData.length === 0 ? (
          <div className="footer-admin-empty">
            <div className="footer-admin-empty-icon">🔗</div>
            {error ? "Failed to load entries." : "No footer entries yet. Add one above."}
          </div>
        ) : (
          footerData.map((footer) => {
            const id = extractId(footer);
            const isEditing = id && editingId === id;
            return (
              <div key={id || Math.random()} className={`footer-admin-item${isEditing ? " footer-admin-item--editing" : ""}`}>

                <div className="footer-admin-item-info">
                  <div className="footer-admin-item-name">{footer.email || "No email set"}</div>
                  <div className="footer-admin-item-meta">
                    {footer.linkedinUrl && <span className="fa-badge fa-badge-blue">LinkedIn</span>}
                    {footer.githubUrl && <span className="fa-badge fa-badge-blue">GitHub</span>}
                  </div>
                </div>

                <div className="footer-admin-item-actions">
                  {isEditing ? (
                    <>
                      <button className="fa-btn fa-btn-save fa-btn-sm" onClick={handleUpdate} disabled={loading}>
                        {loading ? "…" : "✓ Save"}
                      </button>
                      <button className="fa-btn fa-btn-ghost fa-btn-sm" onClick={handleCancel}>
                        ✕ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="fa-btn fa-btn-ghost fa-btn-sm" onClick={() => handleEdit(footer)}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit
                      </button>
                      <button className="fa-btn fa-btn-danger fa-btn-sm" onClick={() => handleDelete(id)}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M2.5 4h11M6 4V2.5h4V4M6.5 7.5v4M9.5 7.5v4M3.5 4l.7 8.5A1 1 0 005.2 13.5h5.6a1 1 0 001-0.9L12.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Delete
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