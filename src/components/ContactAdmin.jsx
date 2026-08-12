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

const getInitials = (name) =>
  name
    ? name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

export default function ContactAdmin() {
  const [contacts,   setContacts]   = useState([]);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [editingId,  setEditingId]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const [messages,        setMessages]        = useState([]);
  const [messagesLoading, setMessagesLoading]  = useState(false);
  const [messagesError,   setMessagesError]    = useState(null);

  useEffect(() => {
    fetchContacts();
    fetchMessages();
  }, []);

  const fetchContacts = async () => {
    setError(null);
    try {
     const res = await axios.get("https://portfoliobackendlinker.onrender.com/contact/view");

      console.log("Raw response:", res.data);
      console.log("Is array:", Array.isArray(res.data));

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

  const fetchMessages = async () => {
    setMessagesError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setMessagesError("Admin login required to view submissions.");
      return;
    }
    setMessagesLoading(true);
    try {
     const res = await axios.get("https://portfoliobackendlinker.onrender.com/contact/messages", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      setMessages(data);
    } catch (err) {
      console.error("Fetch messages failed:", err);
      setMessagesError(
        err.response?.status === 403
          ? "403 Forbidden — check your JWT token."
          : "Could not load submissions."
      );
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.post("https://portfoliobackendlinker.onrender.com/contact/add", form, {
        headers: { Authorization: "Bearer " + token },
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
    const token = localStorage.getItem("token");
    if (!token) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.put(
        "https://portfoliobackendlinker.onrender.com/contact/edit/" + editingId,
        form,
        { headers: { Authorization: "Bearer " + token } }
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

      <h2 className="ca-title">Contact Section</h2>

      {error && (
        <div className="ca-error-banner">
          Warning: {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchContacts}>Retry</button>
        </div>
      )}

      <div className={"ca-form-card" + (editingId ? " ca-form-card--editing" : "")}>

        <div className="ca-form-mode">
          <span className={"ca-form-mode-dot" + (editingId ? " ca-form-mode-dot--warn" : "")} />
          {editingId ? "Edit Mode — ID: " + editingId : "Add a new contact entry"}
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
                {loading ? "Saving…" : "Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding…" : "+ Add Entry"}
            </button>
          )}
        </div>

      </div>

      <div className="ca-list-header">
        <span>Saved Entries</span>
        <span className="badge badge-count">{contacts.length}</span>
      </div>

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
                className={"ca-item" + (isEditing ? " ca-item--editing" : "")}
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
                        GitHub
                      </a>
                    )}
                    {contact.linkedInUrl && (
                      <a
                        href={contact.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ca-link ca-link--linkedin"
                      >
                        LinkedIn
                      </a>
                    )}
                    {contact.emailUrl && (
                      <a href={contact.emailUrl} className="ca-link ca-link--email">
                        Email Link
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
                        {loading ? "…" : "Save"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEdit(contact)}
                    >
                      Edit
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      <div className="ca-list-header" style={{ marginTop: "40px" }}>
        <span>Contact Form Submissions</span>
        <span className="badge badge-count">{messages.length}</span>
      </div>

      {messagesError && (
        <div className="ca-error-banner">
          Warning: {messagesError}
          <button className="btn btn-ghost btn-sm" onClick={fetchMessages}>Retry</button>
        </div>
      )}

      <div className="ca-list">
        {messagesLoading ? (
          <div className="ca-empty">Loading submissions…</div>
        ) : messages.length === 0 ? (
          <div className="ca-empty">
            <div className="ca-empty-icon">📭</div>
            {messagesError ? "Failed to load submissions." : "No messages submitted yet."}
          </div>
        ) : (
          messages.map((msg, index) => {
            const id = extractId(msg) || index;
            return (
              <div
                key={id}
                style={{
                  background: "rgba(37,99,235,0.05)",
                  border: "1px solid rgba(37,99,235,0.18)",
                  borderLeft: "3px solid #2563eb",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "14px",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(msg.name)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#fff" }}>
                        {msg.name}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#60a5fa" }}>
                        {msg.email}
                      </p>
                    </div>
                  </div>
                  {msg.submittedAt && (
                    <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}>
                      {formatDate(msg.submittedAt)}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    marginBottom: "12px",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "14px", color: "#d1d5db", lineHeight: 1.6 }}>
                    {msg.message}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <a
                    href={"mailto:" + msg.email}
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      background: "rgba(37,99,235,0.15)",
                      color: "#93c5fd",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Reply by email
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}