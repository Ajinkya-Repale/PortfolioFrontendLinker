import React, { useState, useEffect } from "react";

export default function BackendLoader({ onReady }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Waking up server...");
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev; // stop at 90 until backend responds
        return prev + Math.random() * 8;
      });
    }, 800);

    // Update status messages
    const statusMessages = [
      { time: 2000,  msg: "Waking up server..." },
      { time: 5000,  msg: "Connecting to database..." },
      { time: 10000, msg: "Almost there..." },
      { time: 15000, msg: "Taking longer than usual..." },
      { time: 20000, msg: "Still loading, please wait..." },
    ];

    const timeouts = statusMessages.map(({ time, msg }) =>
      setTimeout(() => setStatus(msg), time)
    );

    // Ping backend until it responds
    const pingBackend = async () => {
      try {
        const res = await fetch(
          "https://portfoliobackendlinker.onrender.com/hero/all"
        );
        if (res.ok) {
          setProgress(100);
          setStatus("Ready!");
          setTimeout(() => onReady(), 600);
        } else {
          setTimeout(pingBackend, 3000);
        }
      } catch {
        setTimeout(pingBackend, 3000);
      }
    };

    pingBackend();

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#020617",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      fontFamily: "Inter, sans-serif",
      padding: "20px",
    }}>

      {/* Logo */}
      <div style={{
        fontSize: "2rem",
        fontWeight: 700,
        background: "linear-gradient(90deg, #60a5fa, #2563eb)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "48px",
      }}>
        PortDev
      </div>

      {/* Progress bar */}
      <div style={{
        width: "280px",
        height: "4px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "999px",
        overflow: "hidden",
        marginBottom: "20px",
      }}>
        <div style={{
          height: "100%",
          width: `${Math.min(progress, 100)}%`,
          background: "linear-gradient(90deg, #60a5fa, #2563eb)",
          borderRadius: "999px",
          transition: "width 0.8s ease",
        }} />
      </div>

      {/* Percentage */}
      <div style={{
        fontSize: "0.85rem",
        color: "#60a5fa",
        fontWeight: 600,
        marginBottom: "12px",
      }}>
        {Math.min(Math.round(progress), 100)}%
      </div>

      {/* Status */}
      <div style={{
        fontSize: "0.95rem",
        color: "#94a3b8",
        marginBottom: "32px",
      }}>
        {status}{dots}
      </div>

      {/* Info note */}
      <div style={{
        fontSize: "0.78rem",
        color: "#475569",
        textAlign: "center",
        maxWidth: "300px",
        lineHeight: 1.6,
        padding: "12px 20px",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.03)",
      }}>
        🚀 Backend is hosted on <span style={{ color: "#60a5fa" }}>Render free plan</span>.
        It may take <strong style={{ color: "#f8fafc" }}>1–2 minutes</strong> to wake up
        after inactivity. Thanks for your patience!
      </div>

    </div>
  );
}