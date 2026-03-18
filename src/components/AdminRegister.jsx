import React, { useState } from "react";
import "../styles/admin.css";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Register clicked (static demo)");
  };

  return (
    <section className="admin-section">
      <div className="admin-container">
        <div className="admin-card">
          <h2>Admin Register</h2>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder=" "
              />
              <label>Name</label>
            </div>
            <div className="input-group">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=" "
              />
              <label>Email</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=" "
              />
              <label>Password</label>
            </div>
            <button className="admin-btn">Register</button>
          </form>
        </div>
      </div>
    </section>
  );
}