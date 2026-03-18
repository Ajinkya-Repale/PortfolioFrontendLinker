import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ContactAdmin.css";

const extractId = (item) =>
  item?.id
  || item?._id?.$oid
  || item?._id
  || null;

const EMPTY_FORM = {
  email:       "",
  location:    "",
  githubUrl:   "",
  linkedInUrl: "",
  emailUrl:    "",
};

export default function ContactAdmin() {
  const [contacts,   setContacts]   = useState([]);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [editingId,  setEditingId]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setError(null);
    try {
      const res = await axios.get("http://localhost:8082/contact/view");

      // ── DEBUG: remove after confirming data shows ──
      console.log("Raw response:", res.data);
      console.log("Is array:", Array.isArray(res.data));

      // Handle both array and single object response from Spring
      let data = res.data;
      if (!Array.isArray(data)) {
        data = data ? [data] : [];
      }

      console.log("Processed contacts:", data);
      setContacts(data);

    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Could not load contact data. Is the backend running?");
      setContacts([]);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.post("http://localhost:8082/contact/add", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setForm(EMPTY_FORM);
      await fetchContacts();
    } catch (err) {
      console.error("Add failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Add failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleEdit = (contact) => {
    const id = extractId(contact);
    console.log("Editing contact, id:", id, "raw:", contact);
    if (!id) return alert("Could not determine ID — check console.");
    setEditingId(id);
    setForm({
      email:       contact.email       || "",
      location:    contact.location    || "",
      githubUrl:   contact.githubUrl   || "",
      linkedInUrl: contact.linkedInUrl || "",
      emailUrl:    contact.emailUrl    || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!editingId) return alert("No editing ID found.");
    if (!localStorage.getItem("token")) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8082/contact/edit/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEditingId(null);
      setForm(EMPTY_FORM);
      await fetchContacts();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.status === 403 ? "403 Forbidden — check your JWT token." : "Update failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="ca-page">

      {/* ── Title ── */}
      <h2 className="ca-title">Contact Section</h2>

      {/* ── Error Banner ── */}
      {error && (
        <div className="ca-error-banner">
          ⚠ {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchContacts}>Retry</button>
        </div>
      )}

      {/* ── Form Card ── */}
      <div className={`ca-form-card${editingId ? " ca-form-card--editing" : ""}`}>

        <div className="ca-form-mode">
          <span className={`ca-form-mode-dot${editingId ? " ca-form-mode-dot--warn" : ""}`} />
          {editingId ? `Edit Mode — ID: ${editingId}` : "Add a new contact entry"}
        </div>

        <div className="ca-form-grid">

          <div className="ca-field">
            <label>Email</label>
            <input
              name="email"
              placeholder="e.g. ajinkya@gmail.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="ca-field">
            <label>Location</label>
            <input
              name="location"
              placeholder="e.g. Pune, India"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="ca-field">
            <label>GitHub URL</label>
            <input
              name="githubUrl"
              placeholder="https://github.com/username"
              value={form.githubUrl}
              onChange={handleChange}
            />
          </div>

          <div className="ca-field">
            <label>LinkedIn URL</label>
            <input
              name="linkedInUrl"
              placeholder="https://linkedin.com/in/username"
              value={form.linkedInUrl}
              onChange={handleChange}
            />
          </div>

          <div className="ca-field ca-field--full">
            <label>
              Email URL{" "}
              <span className="ca-hint">(mailto: link — leave blank to auto-generate from Email)</span>
            </label>
            <input
              name="emailUrl"
              placeholder="mailto:ajinkya@gmail.com"
              value={form.emailUrl}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="ca-form-actions">
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
      <div className="ca-list-header">
        <span>Saved Entries</span>
        <span className="badge badge-count">{contacts.length}</span>
      </div>

      {/* ── List ── */}
      <div className="ca-list">
        {contacts.length === 0 ? (
          <div className="ca-empty">
            <div className="ca-empty-icon">📬</div>
            {error ? "Failed to load entries." : "No contact entries yet. Add one above."}
          </div>
        ) : (
          contacts.map((contact, index) => {
            const id = extractId(contact);
            const isEditing = id && editingId === id;
            return (
              <div
                key={id || index}
                className={`ca-item${isEditing ? " ca-item--editing" : ""}`}
              >

                <div className="ca-item-info">

                  <div className="ca-item-row">
                    {contact.email && (
                      <div className="ca-item-field">
                        <span className="ca-item-label">Email</span>
                        <span className="ca-item-value">{contact.email}</span>
                      </div>
                    )}
                    {contact.location && (
                      <div className="ca-item-field">
                        <span className="ca-item-label">Location</span>
                        <span className="ca-item-value">{contact.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="ca-item-links">
                    {contact.githubUrl && (
                      <a
                        href={contact.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ca-link ca-link--github"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {contact.linkedInUrl && (
                      <a
                        href={contact.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ca-link ca-link--linkedin"
                      >
                        LinkedIn ↗
                      </a>
                    )}
                    {contact.emailUrl && (
                      <a href={contact.emailUrl} className="ca-link ca-link--email">
                        Email Link ↗
                      </a>
                    )}
                  </div>

                </div>

                <div className="ca-item-actions">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-save btn-sm"
                        onClick={handleUpdate}
                        disabled={loading}
                      >
                        {loading ? "…" : "✓ Save"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
                        ✕ Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEdit(contact)}
                    >
                      ✏ Edit
                    </button>
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