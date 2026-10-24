import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  UserRoundCheck,
} from "lucide-react";
import { Brand } from "@components/Brand";
import { dashboardPath, useAuth } from "@context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    studentNumber: "",
    email: "",
    contactNumber: "",
    password: "",
    confirm: "",
    isStudent: true,
    isTutor: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((c) => ({ ...c, [key]: value }));
  const handleChange = (e) => update(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      name, surname, studentNumber, email, contactNumber,
      password, confirm, isStudent, isTutor,
    } = form;

    if (!name || !surname || !email || !password || !confirm) {
      return setError("Please fill in all required fields.");
    }
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!isStudent && !isTutor) return setError("Choose at least one account role.");
    if (isStudent && !studentNumber) return setError("Student number is required for students.");

    setLoading(true);
    try {
      const user = await signup({
        name,
        surname,
        studentNumber: studentNumber || undefined,
        email,
        contactNumber: contactNumber || undefined,
        password,
        isTutor,
        isStudent,
      });
      navigate(dashboardPath(user), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <aside className="auth-side">
        <Link to="/" className="back-link">
          <ArrowLeft size={17} /> Back home
        </Link>
        <div>
          <span className="eyebrow">Join the community</span>
          <h1>Build better learning connections.</h1>
          <p>Learn from a peer, share your skills, or do both.</p>
        </div>
        <div className="auth-benefits">
          <span><BookOpen size={18} /> Subject resources in one place</span>
          <span><UserRoundCheck size={18} /> Trusted session workflows</span>
          <span><GraduationCap size={18} /> Progress you can follow</span>
        </div>
      </aside>

      <main className="auth-main auth-main-wide">
        <Brand />
        <form className="auth-card" onSubmit={handleSubmit}>
          <header>
            <h2>Create your account</h2>
            <p>Start with your role and basic information.</p>
          </header>

          {error && (
            <div className="notice notice-error">
              <span>{error}</span>
            </div>
          )}

          <div className="role-picker">
            <button
              type="button"
              className={form.isStudent ? "selected" : ""}
              onClick={() => update("isStudent", !form.isStudent)}
            >
              <GraduationCap size={20} />
              <span>
                <strong>Student</strong>
                <small>I want extra learning support</small>
              </span>
            </button>
            <button
              type="button"
              className={form.isTutor ? "selected" : ""}
              onClick={() => update("isTutor", !form.isTutor)}
            >
              <UserRoundCheck size={20} />
              <span>
                <strong>Tutor</strong>
                <small>I want to help students learn</small>
              </span>
            </button>
          </div>

          <div className="form-grid two">
            <div className="field">
              <label>First name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Surname</label>
              <input name="surname" value={form.surname} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-grid two">
            {form.isStudent && (
              <div className="field">
                <label>Student number</label>
                <input
                  name="studentNumber"
                  value={form.studentNumber}
                  onChange={handleChange}
                  placeholder="e.g. 221123456"
                  required={form.isStudent}
                />
              </div>
            )}
            <div className="field">
              <label>Contact number</label>
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="field">
            <label>Email address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-grid two">
            <div className="field">
              <label>Password</label>
              <input
                name="password"
                type="password"
                minLength={8}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input
                name="confirm"
                type="password"
                minLength={8}
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="button button-primary button-full" disabled={loading}>
            {loading ? "Creating account…" : (
              <>
                Create account <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="auth-switch">
            Already registered? <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}