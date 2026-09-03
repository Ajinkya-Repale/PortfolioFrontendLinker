import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  const [links, setLinks] = useState({
    linkedinUrl: "",
    githubUrl: "",
    email: "",
  });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get("https://portfoliobackendlinker.onrender.com/footer/all");
        if (res.data.length > 0) {
          const data = res.data[0];
          setLinks({
            linkedinUrl: data.linkedinUrl || "",
            githubUrl: data.githubUrl || "",
            email: data.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch footer links:", err);
      }
    };
    fetchFooter();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="footer-wrap">

      {/* Back to top notch */}
      <div className="footer-notch" onClick={scrollToTop} aria-label="Back to top">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 10l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <footer className="footer">

        <span className="footer-copy">© {new Date().getFullYear()} Ajinkya Repale</span>

        <div className="footer-icons">
          {links.linkedinUrl && (
            <a
              href={links.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon-btn"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          )}

          {links.githubUrl && (
            <a
              href={links.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon-btn"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          )}

          {links.email && (
            <a
              href={`mailto:${links.email}`}
              className="footer-icon-btn"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          )}
        </div>

      </footer>

    </div>
  );
}