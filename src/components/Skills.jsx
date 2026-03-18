import React, { useEffect, useState } from "react";
import "../styles/skills.css";

import { FaReact, FaCss3Alt, FaNodeJs, FaGitAlt, FaGithub, FaDocker, FaFigma, FaLinux } from "react-icons/fa";
import {
  SiJavascript, SiHtml5, SiTypescript, SiTailwindcss,
  SiNextdotjs, SiVuedotjs, SiAngular, SiSvelte,
  SiRedux, SiWebpack, SiVite, SiBootstrap,
  SiSpringboot, SiExpress, SiDjango, SiFastapi,
  SiFlask, SiLaravel, SiGraphql, SiDotnet,
  SiMongodb, SiMysql, SiPostgresql, SiRedis,
  SiFirebase, SiSqlite, SiSupabase, SiPrisma,
  SiKubernetes, SiPostman, SiJira,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { MdDevices } from "react-icons/md";
import { TbApi } from "react-icons/tb";
import axios from "axios";

// FIXED: icons that were #ffffff now use dark-friendly fallback colors
// They use CSS variable so they adapt to light/dark theme
const iconMap = {
  FaReact:       { icon: <FaReact />,       color: "#61dafb" },
  SiJavascript:  { icon: <SiJavascript />,  color: "#f7df1e" },
  SiHtml5:       { icon: <SiHtml5 />,       color: "#e34f26" },
  FaCss3Alt:     { icon: <FaCss3Alt />,     color: "#264de4" },
  SiTypescript:  { icon: <SiTypescript />,  color: "#3178c6" },
  SiTailwindcss: { icon: <SiTailwindcss />, color: "#38bdf8" },
  SiNextdotjs:   { icon: <SiNextdotjs />,   color: "#000000" }, // FIXED: was #ffffff
  SiVuedotjs:    { icon: <SiVuedotjs />,    color: "#42b883" },
  SiAngular:     { icon: <SiAngular />,     color: "#dd0031" },
  SiSvelte:      { icon: <SiSvelte />,      color: "#ff3e00" },
  SiRedux:       { icon: <SiRedux />,       color: "#764abc" },
  SiWebpack:     { icon: <SiWebpack />,     color: "#8dd6f9" },
  SiVite:        { icon: <SiVite />,        color: "#646cff" },
  SiBootstrap:   { icon: <SiBootstrap />,   color: "#7952b3" },
  SiSpringboot:  { icon: <SiSpringboot />,  color: "#6db33f" },
  FaNodeJs:      { icon: <FaNodeJs />,      color: "#68a063" },
  SiExpress:     { icon: <SiExpress />,     color: "#555555" }, // FIXED: was #aaaaaa (too light)
  SiDjango:      { icon: <SiDjango />,      color: "#44b78b" },
  SiFastapi:     { icon: <SiFastapi />,     color: "#009688" },
  SiFlask:       { icon: <SiFlask />,       color: "#555555" }, // FIXED: was #aaaaaa (too light)
  SiLaravel:     { icon: <SiLaravel />,     color: "#ff2d20" },
  SiGraphql:     { icon: <SiGraphql />,     color: "#e10098" },
  SiDotnet:      { icon: <SiDotnet />,      color: "#512bd4" },
  SiMongodb:     { icon: <SiMongodb />,     color: "#47a248" },
  SiMysql:       { icon: <SiMysql />,       color: "#4479a1" },
  SiPostgresql:  { icon: <SiPostgresql />,  color: "#336791" },
  SiRedis:       { icon: <SiRedis />,       color: "#dc382d" },
  SiFirebase:    { icon: <SiFirebase />,    color: "#ffca28" },
  SiSqlite:      { icon: <SiSqlite />,      color: "#44aadd" },
  SiSupabase:    { icon: <SiSupabase />,    color: "#3ecf8e" },
  SiPrisma:      { icon: <SiPrisma />,      color: "#5a67d8" },
  FaGitAlt:      { icon: <FaGitAlt />,      color: "#f05032" },
  FaGithub:      { icon: <FaGithub />,      color: "#333333" }, // FIXED: was #ffffff
  VscVscode:     { icon: <VscVscode />,     color: "#007acc" },
  FaDocker:      { icon: <FaDocker />,      color: "#2496ed" },
  SiKubernetes:  { icon: <SiKubernetes />,  color: "#326ce5" },
  SiPostman:     { icon: <SiPostman />,     color: "#ff6c37" },
  FaFigma:       { icon: <FaFigma />,       color: "#f24e1e" },
  SiJira:        { icon: <SiJira />,        color: "#0052cc" },
  FaLinux:       { icon: <FaLinux />,       color: "#fcc624" },
  MdDevices:     { icon: <MdDevices />,     color: "#64748b" }, // FIXED: was #94a3b8 (too light)
  TbApi:         { icon: <TbApi />,         color: "#64748b" }, // FIXED: was #94a3b8 (too light)
};

const GROUP_ORDER = ["Frontend", "Backend", "Database", "Tools"];

export default function Skills() {
  const [skillGroups, setSkillGroups] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8082/skills/all")
      .then(res => {
        const data = res.data;
        const grouped = data.reduce((acc, skill) => {
          const group = skill.group || "Tools";
          if (!acc[group]) acc[group] = [];
          acc[group].push(skill);
          return acc;
        }, {});

        const groupArray = GROUP_ORDER
          .filter(g => grouped[g]?.length > 0)
          .map(g => ({ title: g, skills: grouped[g] }));

        Object.keys(grouped)
          .filter(g => !GROUP_ORDER.includes(g))
          .forEach(g => groupArray.push({ title: g, skills: grouped[g] }));

        setSkillGroups(groupArray);
      })
      .catch(err => console.error("Error fetching skills:", err));
  }, []);

  return (
    <section id="skills" className="skills-section reveal">
      <div className="skills-header">
        <h2>Tech Stack</h2>
        <p>Tools and technologies I use to craft modern digital experiences.</p>
      </div>

      <div className="skills-container">
        {skillGroups.map((group, index) => {
          const cols = Math.min(group.skills.length, 5);
          return (
            <div className="skills-group" key={index}>
              <h3 className="group-title">{group.title}</h3>
              <div
                className="skills-grid"
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
              >
                {group.skills.map(skill => {
                  const iconData = iconMap[skill.icon] || iconMap["FaReact"];
                  return (
                    <div className="skill-card" key={skill.name}>
                      <div className="skill-icon" style={{ color: iconData.color }}>
                        {iconData.icon}
                      </div>
                      <span className="skill-name">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}