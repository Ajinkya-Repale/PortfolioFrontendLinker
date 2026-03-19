import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/experienceAdmin.css";

const EMPTY_FORM = {
  companyName: "",
  jobTitle: "",
  startYear: "",
  endYear: "",
  description: ""
};

export default function ExperienceAdmin() {

  const [experience, setExperience] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = () => localStorage.getItem("token");

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await axios.get("https://portfoliobackendlinker.onrender.com/experience/all");
      setExperience(res.data || []);
    } catch (err) {
      console.error("Failed to fetch experience:", err);
      setExperience([]);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!token()) return alert("Admin login required");

    setLoading(true);

    try {
      await axios.post(
        "https://portfoliobackendlinker.onrender.com/experience/admin/add",
        form,
        { headers: { Authorization: `Bearer ${token()}` } }
      );

      setForm(EMPTY_FORM);
      fetchExperience();

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleEdit = (exp) => {

    setEditingId(exp.id);

    setForm({
      companyName: exp.companyName || "",
      jobTitle: exp.jobTitle || "",
      startYear: exp.startYear || "",
      endYear: exp.endYear || "",
      description: exp.description || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {

    if (!token()) return alert("Admin login required");

    setLoading(true);

    try {

      await axios.put(
        `https://portfoliobackendlinker.onrender.com/experience/admin/edit/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${token()}` } }
      );

      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchExperience();

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {

    if (!token()) return alert("Admin login required");

    if (!window.confirm("Delete this experience?")) return;

    try {

      await axios.delete(
        `https://portfoliobackendlinker.onrender.com/experience/admin/delete/${id}`,
        { headers: { Authorization: `Bearer ${token()}` } }
      );

      fetchExperience();

    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="experience-admin-page">

      {/* SECTION TITLE */}

      <h2 className="experience-admin-title">
        Experience Section
      </h2>

      {/* FORM CARD */}

      <div className={`experience-form-card ${editingId ? "experience-form-card--editing" : ""}`}>

        <div className="experience-form-mode">
          {editingId ? "Edit Mode — update details" : "Add new experience"}
        </div>

        <div className="experience-form-grid">

          <input
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
          />

          <input
            name="jobTitle"
            placeholder="Job Title"
            value={form.jobTitle}
            onChange={handleChange}
          />

          <input
            name="startYear"
            placeholder="Start Year"
            value={form.startYear}
            onChange={handleChange}
          />

          <input
            name="endYear"
            placeholder="End Year"
            value={form.endYear}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

        </div>

        <div className="experience-form-actions">

          {editingId ? (
            <>
              <button
                className="btn btn-save"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "✓ Save Changes"}
              </button>

              <button
                className="btn btn-ghost"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Adding..." : "+ Add Experience"}
            </button>
          )}

        </div>
      </div>

      {/* LIST HEADER */}

      <div className="experience-list-header">
        <span>Saved Experience</span>
        <span className="experience-count-badge">
          {experience.length}
        </span>
      </div>

      {/* EXPERIENCE LIST */}

      <div className="experience-list">

        {experience.length === 0 ? (
          <div className="experience-empty">
            No experience added yet.
          </div>
        ) : (

          experience.map((exp) => {

            const isEditing = editingId === exp.id;

            return (

              <div
                key={exp.id}
                className={`experience-item ${isEditing ? "experience-item--editing" : ""}`}
              >

                <div className="experience-item-info">

                  <div className="experience-company">
                    {exp.companyName}
                  </div>

                  <div className="experience-role">
                    {exp.jobTitle}
                  </div>

                  <div className="experience-years">
                    {exp.startYear} - {exp.endYear}
                  </div>

                  <div className="experience-desc">
                    {exp.description}
                  </div>

                </div>

                <div className="experience-item-actions">

                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-save btn-sm"
                        onClick={handleUpdate}
                      >
                        ✓ Save
                      </button>

                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEdit(exp)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(exp.id)}
                      >
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
