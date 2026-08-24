import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/certificates.css";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("https://portfoliobackendlinker.onrender.com/certificate/all");
      setCertificates(res.data || []);
    } catch (err) {
      console.error("Failed to load certificates:", err);
      setCertificates([]);
    }
  };

  return (
    <section id="certificates" className="certificates-section reveal">
      <div className="certificates-inner">

        <h2 className="certificates-title">
          Certificates
          <span className="certificates-title-accent">& achievements</span>
        </h2>

        <div className="certificates-grid">
          {certificates.length === 0 ? (
            <p className="certificates-empty">No certificates added yet.</p>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} className="certificate-card">

                <div className="certificate-image-wrap">
                  <img
                    src={cert.credentialUrl || "/Images/cert-placeholder.png"}
                    alt={cert.title}
                    loading="lazy"
                    onError={(e) => { e.target.src = "/Images/cert-placeholder.png"; }}
                  />
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certificate-view-btn"
                      aria-label={`View full certificate: ${cert.title}`}
                    >
                      View full
                    </a>
                  )}
                </div>

                <div className="certificate-card-body">
                  <h3 className="certificate-title">{cert.title}</h3>
                  {cert.issuer && <p className="certificate-issuer">{cert.issuer}</p>}
                  {cert.issueDate && (
                    <span className="certificate-date-badge">{cert.issueDate}</span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}