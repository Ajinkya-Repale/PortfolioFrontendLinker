import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/educationAdmin.css";

export default function EducationAdmin() {

  const [education, setEducation] = useState([]);

  const [form, setForm] = useState({
    collegeTitle: "",
    startYear: "",
    endYear: "",
    percentage: ""
  });

  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await axios.get("http://localhost:8082/education/all");
      setEducation(res.data || []);
    } catch (err) {
      console.error("Failed to fetch education:", err);
      setEducation([]);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      collegeTitle: "",
      startYear: "",
      endYear: "",
      percentage: ""
    });
  };

  /* =========================
     ADD EDUCATION
  ========================= */

  const handleAdd = async () => {
    if (!token) return alert("Admin login required");

    try {
      await axios.post(
        "http://localhost:8082/education/admin/add",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      resetForm();
      fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (edu) => {
    setEditingId(edu.id);

    setForm({
      collegeTitle: edu.collegeTitle,
      startYear: edu.startYear,
      endYear: edu.endYear,
      percentage: edu.percentage
    });
  };

  /* =========================
     UPDATE
  ========================= */

  const handleUpdate = async () => {
    if (!token) return alert("Admin login required");

    try {
      await axios.put(
        `http://localhost:8082/education/admin/edit/${editingId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      resetForm();
      fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    if (!token) return alert("Admin login required");

    try {
      await axios.delete(
        `http://localhost:8082/education/admin/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchEducation();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="education-admin-page">

      {/* TITLE */}

      <h2 className="education-admin-title">Education</h2>

      {/* ================= FORM CARD ================= */}

      <div className="education-form-card">

        <div className="education-form-grid">

          <div className="education-field">
            <label>College / University</label>
            <input
              name="collegeTitle"
              placeholder="Enter college name"
              value={form.collegeTitle}
              onChange={handleChange}
            />
          </div>

          <div className="education-field">
            <label>Start Year</label>
            <input
              name="startYear"
              placeholder="2019"
              value={form.startYear}
              onChange={handleChange}
            />
          </div>

          <div className="education-field">
            <label>End Year</label>
            <input
              name="endYear"
              placeholder="2023"
              value={form.endYear}
              onChange={handleChange}
            />
          </div>

          <div className="education-field">
            <label>Percentage / CGPA</label>
            <input
              name="percentage"
              placeholder="8.5 CGPA / 75%"
              value={form.percentage}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* ACTION BUTTONS */}

        <div className="education-form-actions">

          {editingId ? (
            <>
              <button className="btn btn-save" onClick={handleUpdate}>
                Save
              </button>

              <button className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd}>
              Add Education
            </button>
          )}

        </div>

      </div>

      {/* ================= EDUCATION LIST ================= */}

      <div className="education-list">

        {education.length === 0 ? (
          <div className="education-empty">
            No education records yet.
          </div>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="education-item">

              <div className="education-item-info">

                <div className="education-item-degree">
                  {edu.collegeTitle}
                </div>

                <div className="education-item-college">
                  {edu.percentage}
                </div>

                <div className="education-item-year">
                  {edu.startYear} - {edu.endYear}
                </div>

              </div>

              <div className="education-item-actions">

                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEdit(edu)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(edu.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}