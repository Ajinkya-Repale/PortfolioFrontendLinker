import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CertificatesAdmin.css";

const extractId = (cert) =>
  cert?._id?.$oid || cert?._id || cert?.id || null;

export default function CertificatesAdmin() {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState({ title: "", issuer: "", issueDate: "", credentialUrl: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchCertificates(); }, []);

  const fetchCertificates = async () => {
    setError(null);
    try {
      const res = await axios.get("https://portfoliobackendlinker.onrender.com/certificate/all");
      setCertificates(res.data || []);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
      setError("Could not load certificates. Is the backend running?");
      setCertificates([]);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.post("https://portfoliobackendlinker.onrender.com/certificate/admin/add", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setForm({ title: "", issuer: "", issueDate: "", credentialUrl: "" });
      await fetchCertificates();
    } catch (err) {
      console.error("Add failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Add failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleEdit = (cert) => {
    const id = extractId(cert);
    if (!id) return alert("Could not determine certificate ID.");
    setEditingId(id);
    setForm({
      title: cert.title || "",
      issuer: cert.issuer || "",
      issueDate: cert.issueDate || "",
      credentialUrl: cert.credentialUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!editingId) return alert("No editing ID found. Please click Edit again.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.put(
        `https://portfoliobackendlinker.onrender.com/certificate/admin/edit/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEditingId(null);
      setForm({ title: "", issuer: "", issueDate: "", credentialUrl: "" });
      await fetchCertificates();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Update failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!id) return alert("Could not determine certificate ID.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await axios.delete(`https://portfoliobackendlinker.onrender.com/certificate/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchCertificates();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Delete failed. Check console.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", issuer: "", issueDate: "", credentialUrl: "" });
  };

  return (
    <div className="cert-admin-page">

      <h2 className="cert-admin-title">Certificates</h2>

      {error && (
        <div className="cert-error-banner">
          ⚠ {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchCertificates}>Retry</button>
        </div>
      )}

      <div className={`cert-form-card${editingId ? " cert-form-card--editing" : ""}`}>

        <div className="cert-form-mode">
          <span className={`cert-form-mode-dot${editingId ? " cert-form-mode-dot--warn" : ""}`} />
          {editingId ? `Edit Mode — ID: ${editingId}` : "Add a new certificate"}
        </div>

        <div className="cert-form-grid">
          <div className="cert-field">
            <label>Certificate Title</label>
            <input
              name="title"
              placeholder="e.g. AWS Certified Developer"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="cert-field">
            <label>Issuer</label>
            <input
              name="issuer"
              placeholder="e.g. Amazon Web Services"
              value={form.issuer}
              onChange={handleChange}
            />
          </div>

          <div className="cert-field">
            <label>Issue Date</label>
            <input
              name="issueDate"
              placeholder="e.g. Jan 2026"
              value={form.issueDate}
              onChange={handleChange}
            />
          </div>

          <div className="cert-field">
            <label>Logo / Credential Image Path</label>
            <input
              name="credentialUrl"
              placeholder="/certs/aws.png"
              value={form.credentialUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="cert-form-actions">
          {editingId ? (
            <>
              <button className="btn btn-save" onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving…" : "✓ Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}>✕ Cancel</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding…" : "+ Add Certificate"}
            </button>
          )}
        </div>
      </div>

      <div className="cert-list-header">
        <span>Saved Certificates</span>
        <span className="badge badge-count">{certificates.length}</span>
      </div>

      <div className="cert-list">
        {certificates.length === 0 ? (
          <div className="cert-empty">
            <div className="cert-empty-icon">🏆</div>
            {error ? "Failed to load entries." : "No certificates yet. Add one above."}
          </div>
        ) : (
          certificates.map((cert) => {
            const id = extractId(cert);
            const isEditing = id && editingId === id;
            return (
              <div key={id || Math.random()} className={`cert-item${isEditing ? " cert-item--editing" : ""}`}>

                <img
                  src={cert.credentialUrl || "/Images/cert-placeholder.png"}
                  alt={cert.title}
                />

                <div className="cert-item-info">
                  <div className="cert-item-title">{cert.title}</div>
                  <div className="cert-item-meta">
                    {cert.issuer && <span className="badge badge-blue">{cert.issuer}</span>}
                    {cert.issueDate && <span className="cert-item-date">{cert.issueDate}</span>}
                  </div>
                </div>

                <div className="cert-item-actions">
                  {isEditing ? (
                    <>
                      <button className="btn btn-save btn-sm" onClick={handleUpdate} disabled={loading}>
                        {loading ? "…" : "✓ Save"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={handleCancel}>✕ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(cert)}>✏ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>🗑 Delete</button>
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