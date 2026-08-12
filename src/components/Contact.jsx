import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/contact.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const DEFAULTS = {
  email:       "john@example.com",
  location:    "India",
  githubUrl:   "https://github.com/yourusername",
  linkedInUrl: "https://linkedin.com/in/yourprofile",
  emailUrl:    "mailto:john@example.com",
};

export default function Contact() {

  const [contactData, setContactData] = useState(null);
  const [form, setForm]               = useState({ name: "", email: "", message: "" });
  const [status, setStatus]           = useState(""); // "sending" | "sent" | "error"

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get("https://portfoliobackendlinker.onrender.com/contact/view");
        if (res.data && res.data.length > 0) {
          setContactData(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch contact data:", err);
      }
    };
    fetchContact();
  }, []);

  const data = {
    email:       contactData?.email       || DEFAULTS.email,
    location:    contactData?.location    || DEFAULTS.location,
    githubUrl:   contactData?.githubUrl   || DEFAULTS.githubUrl,
    linkedInUrl: contactData?.linkedInUrl || DEFAULTS.linkedInUrl,
    emailUrl:    contactData?.emailUrl    || `mailto:${contactData?.email || DEFAULTS.email}`,
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
     await axios.post("https://portfoliobackendlinker.onrender.com/contact/submit", form);

      setStatus("sent");
      setForm({ name: "", email: "", message: "" });

      Swal.fire({
        icon: "success",
        title: "Message sent!",
        text: "Thanks for reaching out — we will contact you soon.",
        background: "#0a0e1a",
        color: "#fff",
        confirmButtonColor: "#2563eb",
      });
    } catch (err) {
      console.error("Send failed:", err);
      setStatus("error");

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Couldn't send your message. Please try again.",
        background: "#0a0e1a",
        color: "#fff",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">

        {/* LEFT */}
        <div className="contact-info">

          <h2>Let's Work Together</h2>

          <p>
            Have a project idea or want to collaborate?
            Feel free to reach out and let's build
            something amazing together.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <span>Email</span>
              <p>{data.email}</p>
            </div>
            <div className="contact-item">
              <span>Location</span>
              <p>{data.location}</p>
            </div>
          </div>

          <div className="contact-socials">
            <a href={data.linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
              <FaLinkedin />
            </a>
            <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
              <FaGithub />
            </a>
            <a href={data.emailUrl} aria-label="Email" title="Send Email">
              <FaEnvelope />
            </a>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div className="contact-form-wrapper">

          <form className="contact-form" onSubmit={handleSubmit}>

            <div className="input-group">
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Your Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Email Address</label>
            </div>

            <div className="input-group">
              <textarea
                name="message"
                rows="5"
                required
                value={form.message}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Your Message</label>
            </div>

            <button
              className="contact-btn"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}