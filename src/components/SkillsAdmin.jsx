import React, { useEffect, useState } from "react";
import axios from "axios";

// ── React Icons ───────────────────────────────────────────────────────────────
// Frontend
import { FaReact, FaCss3Alt } from "react-icons/fa";
import {
  SiJavascript, SiHtml5, SiTypescript, SiTailwindcss,
  SiNextdotjs, SiVuedotjs, SiAngular, SiSvelte,
  SiRedux, SiWebpack, SiVite, SiBootstrap,
} from "react-icons/si";

// Backend
import { FaNodeJs } from "react-icons/fa";
import {
  SiSpringboot, SiExpress, SiDjango, SiFastapi,
  SiFlask, SiLaravel, SiGraphql, SiDotnet,
} from "react-icons/si";

// Database
import {
  SiMongodb, SiMysql, SiPostgresql, SiRedis,
  SiFirebase, SiSqlite, SiSupabase, SiPrisma,
} from "react-icons/si";

// Tools
import { FaGitAlt, FaGithub, FaDocker, FaFigma, FaLinux } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { SiKubernetes, SiPostman, SiJira } from "react-icons/si";

import "../styles/AdminSkills.css";

// ── Full icon map — key must match backend SkillsService.iconMap ──────────────
const ICON_MAP = {
  // Frontend
  FaReact:       { icon: <FaReact />,       color: "#61dafb" },
  SiJavascript:  { icon: <SiJavascript />,  color: "#f7df1e" },
  SiHtml5:       { icon: <SiHtml5 />,       color: "#e34f26" },
  FaCss3Alt:     { icon: <FaCss3Alt />,     color: "#264de4" },
  SiTypescript:  { icon: <SiTypescript />,  color: "#3178c6" },
  SiTailwindcss: { icon: <SiTailwindcss />, color: "#38bdf8" },
  SiNextdotjs:   { icon: <SiNextdotjs />,   color: "#ffffff" },
  SiVuedotjs:    { icon: <SiVuedotjs />,    color: "#42b883" },
  SiAngular:     { icon: <SiAngular />,     color: "#dd0031" },
  SiSvelte:      { icon: <SiSvelte />,      color: "#ff3e00" },
  SiRedux:       { icon: <SiRedux />,       color: "#764abc" },
  SiWebpack:     { icon: <SiWebpack />,     color: "#8dd6f9" },
  SiVite:        { icon: <SiVite />,        color: "#646cff" },
  SiBootstrap:   { icon: <SiBootstrap />,   color: "#7952b3" },
  // Backend
  SiSpringboot:  { icon: <SiSpringboot />,  color: "#6db33f" },
  FaNodeJs:      { icon: <FaNodeJs />,      color: "#68a063" },
  SiExpress:     { icon: <SiExpress />,     color: "#ffffff" },
  SiDjango:      { icon: <SiDjango />,      color: "#092e20" },
  SiFastapi:     { icon: <SiFastapi />,     color: "#009688" },
  SiFlask:       { icon: <SiFlask />,       color: "#ffffff" },
  SiLaravel:     { icon: <SiLaravel />,     color: "#ff2d20" },
  SiGraphql:     { icon: <SiGraphql />,     color: "#e10098" },
  SiDotnet:      { icon: <SiDotnet />,      color: "#512bd4" },
  // Database
  SiMongodb:     { icon: <SiMongodb />,     color: "#47a248" },
  SiMysql:       { icon: <SiMysql />,       color: "#4479a1" },
  SiPostgresql:  { icon: <SiPostgresql />,  color: "#336791" },
  SiRedis:       { icon: <SiRedis />,       color: "#dc382d" },
  SiFirebase:    { icon: <SiFirebase />,    color: "#ffca28" },
  SiSqlite:      { icon: <SiSqlite />,      color: "#003b57" },
  SiSupabase:    { icon: <SiSupabase />,    color: "#3ecf8e" },
  SiPrisma:      { icon: <SiPrisma />,      color: "#2d3748" },
  // Tools
  FaGitAlt:      { icon: <FaGitAlt />,      color: "#f05032" },
  FaGithub:      { icon: <FaGithub />,      color: "#ffffff" },
  VscVscode:     { icon: <VscVscode />,     color: "#007acc" },
  FaDocker:      { icon: <FaDocker />,      color: "#2496ed" },
  SiKubernetes:  { icon: <SiKubernetes />,  color: "#326ce5" },
  SiPostman:     { icon: <SiPostman />,     color: "#ff6c37" },
  FaFigma:       { icon: <FaFigma />,       color: "#f24e1e" },
  SiJira:        { icon: <SiJira />,        color: "#0052cc" },
  FaLinux:       { icon: <FaLinux />,       color: "#fcc624" },
};

// ── Skill options per group ───────────────────────────────────────────────────
const SKILL_OPTIONS = {
  Frontend: [
    { name: "React",            icon: "FaReact"       },
    { name: "JavaScript",       icon: "SiJavascript"  },
    { name: "HTML5",            icon: "SiHtml5"       },
    { name: "CSS3",             icon: "FaCss3Alt"     },
    { name: "TypeScript",       icon: "SiTypescript"  },
    { name: "Tailwind CSS",     icon: "SiTailwindcss" },
    { name: "Next.js",          icon: "SiNextdotjs"   },
    { name: "Vue.js",           icon: "SiVuedotjs"    },
    { name: "Angular",          icon: "SiAngular"     },
    { name: "Svelte",           icon: "SiSvelte"      },
    { name: "Redux",            icon: "SiRedux"       },
    { name: "Webpack",          icon: "SiWebpack"     },
    { name: "Vite",             icon: "SiVite"        },
    { name: "Bootstrap",        icon: "SiBootstrap"   },
  ],
  Backend: [
    { name: "Spring Boot",      icon: "SiSpringboot"  },
    { name: "Node.js",          icon: "FaNodeJs"      },
    { name: "Express",          icon: "SiExpress"     },
    { name: "Django",           icon: "SiDjango"      },
    { name: "FastAPI",          icon: "SiFastapi"     },
    { name: "Flask",            icon: "SiFlask"       },
    { name: "Laravel",          icon: "SiLaravel"     },
    { name: "GraphQL",          icon: "SiGraphql"     },
    { name: ".NET",             icon: "SiDotnet"      },
  ],
  Database: [
    { name: "MongoDB",          icon: "SiMongodb"     },
    { name: "MySQL",            icon: "SiMysql"       },
    { name: "PostgreSQL",       icon: "SiPostgresql"  },
    { name: "Redis",            icon: "SiRedis"       },
    { name: "Firebase",         icon: "SiFirebase"    },
    { name: "SQLite",           icon: "SiSqlite"      },
    { name: "Supabase",         icon: "SiSupabase"    },
    { name: "Prisma",           icon: "SiPrisma"      },
  ],
  Tools: [
    { name: "Git",              icon: "FaGitAlt"      },
    { name: "GitHub",           icon: "FaGithub"      },
    { name: "VS Code",          icon: "VscVscode"     },
    { name: "Docker",           icon: "FaDocker"      },
    { name: "Kubernetes",       icon: "SiKubernetes"  },
    { name: "Postman",          icon: "SiPostman"     },
    { name: "Figma",            icon: "FaFigma"       },
    { name: "Jira",             icon: "SiJira"        },
    { name: "Linux",            icon: "FaLinux"       },
  ],
};

const GROUPS = ["Frontend", "Backend", "Database", "Tools"];

const extractId = (item) =>
  item?._id?.$oid || item?._id || item?.id || null;

// ── Helper: get icon key from skill name ─────────────────────────────────────
const getIconKeyForName = (name) => {
  for (const group of Object.values(SKILL_OPTIONS)) {
    const found = group.find((s) => s.name === name);
    if (found) return found.icon;
  }
  return "FaReact";
};

export default function SkillsAdmin() {
  const [skills, setSkills]       = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("Frontend");
  const [selectedSkill, setSelectedSkill] = useState(SKILL_OPTIONS["Frontend"][0]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => { fetchSkills(); }, []);

  // When group changes, reset selected skill to first in group
  const handleGroupChange = (g) => {
    setSelectedGroup(g);
    setSelectedSkill(SKILL_OPTIONS[g][0]);
  };

  const fetchSkills = async () => {
    setError(null);
    try {
      const res = await axios.get("https://portfoliobackendlinker.onrender.com/skills/all");
      setSkills(res.data || []);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      setError("Could not load skills. Is the backend running?");
      setSkills([]);
    }
  };

  const getToken = () => localStorage.getItem("token");

  const handleAdd = async () => {
    const token = getToken();
    if (!token) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.post(
        "https://portfoliobackendlinker.onrender.com/skills/add",
        { name: selectedSkill.name, group: selectedGroup },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSkills();
    } catch (err) {
      console.error("Add failed:", err);
      alert(err.response?.status === 403 ? "403 — check your token." : "Add failed.");
    } finally { setLoading(false); }
  };

  const handleEdit = (skill) => {
    const id = extractId(skill);
    if (!id) return alert("Could not determine skill ID.");
    setEditingId(id);
    const group = skill.group || "Frontend";
    setSelectedGroup(group);
    const found = SKILL_OPTIONS[group]?.find((s) => s.name === skill.name)
      || SKILL_OPTIONS[group]?.[0];
    setSelectedSkill(found);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    const token = getToken();
    if (!editingId) return alert("No editing ID found.");
    if (!token) return alert("Admin login required.");
    setLoading(true);
    try {
      await axios.put(
        `https://portfoliobackendlinker.onrender.com/skills/edit/${editingId}`,
        { name: selectedSkill.name, group: selectedGroup },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setSelectedGroup("Frontend");
      setSelectedSkill(SKILL_OPTIONS["Frontend"][0]);
      await fetchSkills();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.status === 403 ? "403 — check your token." : "Update failed.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!id || !token) return alert(!id ? "No ID found." : "Login required.");
    if (!window.confirm("Delete this skill?")) return;
    try {
      await axios.delete(`https://portfoliobackendlinker.onrender.com/skills/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSkills();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setSelectedGroup("Frontend");
    setSelectedSkill(SKILL_OPTIONS["Frontend"][0]);
  };

  // Group skills by group field
  const grouped = GROUPS.reduce((acc, g) => {
    acc[g] = skills.filter((s) => s.group === g);
    return acc;
  }, {});

  // Current icon preview
  const previewIconData = ICON_MAP[selectedSkill?.icon] || ICON_MAP["FaReact"];

  return (
    <div className="skills-admin-page">

      <h2 className="skills-admin-title">Skills Section</h2>

      {error && (
        <div className="skills-error-banner">
          ⚠ {error}
          <button className="btn btn-ghost btn-sm" onClick={fetchSkills}>Retry</button>
        </div>
      )}

      {/* ── Form Card ── */}
      <div className={`skills-form-card${editingId ? " skills-form-card--editing" : ""}`}>
        <div className="skills-form-mode">
          <span className={`skills-form-dot${editingId ? " skills-form-dot--warn" : ""}`} />
          {editingId ? "Edit Mode — update the skill below" : "Add a new skill"}
        </div>

        <div className="skills-form-grid">

          {/* Group selector — tab style */}
          <div className="skills-field">
            <label>Group</label>
            <div className="skills-group-tabs">
              {GROUPS.map((g) => (
                <button
                  key={g}
                  className={`skills-group-tab skills-group-tab--${g.toLowerCase()}${selectedGroup === g ? " active" : ""}`}
                  onClick={() => handleGroupChange(g)}
                  type="button"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Skill selector with icon preview */}
          <div className="skills-field">
            <label>Skill</label>
            <div className="skills-skill-selector">
              {/* Big icon preview */}
              <div
                className="skills-icon-preview"
                style={{ color: previewIconData.color }}
              >
                {previewIconData.icon}
              </div>
              <select
                value={selectedSkill?.name}
                onChange={(e) => {
                  const found = SKILL_OPTIONS[selectedGroup].find(
                    (s) => s.name === e.target.value
                  );
                  if (found) setSelectedSkill(found);
                }}
              >
                {SKILL_OPTIONS[selectedGroup].map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="skills-form-actions">
          {editingId ? (
            <>
              <button className="btn btn-save" onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving…" : "✓ Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={handleCancel}>✕ Cancel</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding…" : `+ Add ${selectedSkill?.name || "Skill"}`}
            </button>
          )}
        </div>
      </div>

      {/* ── Grouped Skill Cards ── */}
      {GROUPS.map((group) =>
        grouped[group]?.length > 0 ? (
          <div key={group} className={`skills-group skills-group--${group.toLowerCase()}`}>
            <div className="skills-group-header">
              <span className="skills-group-label">{group}</span>
              <span className="badge badge-count">{grouped[group].length}</span>
            </div>

            <div className="skills-grid">
              {grouped[group].map((skill) => {
                const id = extractId(skill);
                const isEditing = editingId === id;
                // Use icon from DB, fallback to name lookup, fallback to FaReact
                const iconKey = skill.icon || getIconKeyForName(skill.name);
                const iconData = ICON_MAP[iconKey] || ICON_MAP["FaReact"];
                return (
                  <div
                    key={id}
                    className={`skill-card${isEditing ? " skill-card--editing" : ""}`}
                  >
                    <div
                      className="skill-card-icon"
                      style={{ color: iconData.color }}
                    >
                      {iconData.icon}
                    </div>
                    <div className="skill-card-name">{skill.name}</div>
                    <div className="skill-card-actions">
                      {isEditing ? (
                        <>
                          <button className="btn btn-save btn-sm" onClick={handleUpdate}>✓</button>
                          <button className="btn btn-ghost btn-sm" onClick={handleCancel}>✕</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(skill)}>✏</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>🗑</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}

      {skills.length === 0 && !error && (
        <div className="skills-empty">
          <div className="skills-empty-icon">⚡</div>
          No skills yet. Add one above.
        </div>
      )}

    </div>
  );
}
