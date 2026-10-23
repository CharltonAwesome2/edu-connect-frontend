import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import "./auth.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirm } = form;
    if (!name || !email || !password || !confirm) return setError("Please fill in all fields.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await signup(name, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your EduConnect account</h2>
        <p className="auth-subtitle">Join the learning community</p>

        {error && <div className="auth-error">{error}</div>}

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />

        <label>Confirm Password</label>
        <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Repeat password" />

        <button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Sign Up"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}