import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Brand } from "@components/Brand";
import { dashboardPath, useAuth } from "@context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError("Please fill in all fields.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      const user = await login(email, password, remember);
      const requested = location.state?.from;
      navigate(requested || dashboardPath(user), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-side">
        <Link to="/" className="back-link">
          <ArrowLeft size={17} /> Back home
        </Link>
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1>Continue your learning journey.</h1>
          <p>Sessions, resources and progress are waiting for you.</p>
        </div>
        <blockquote>
          “The beautiful thing about learning is that no one can take it away from you.”
          <cite>— B.B. King</cite>
        </blockquote>
      </aside>

      <main className="auth-main">
        <Brand />
        <form className="auth-card" onSubmit={handleSubmit}>
          <header>
            <h2>Log in to EduConnect</h2>
            <p>Use your registered email and password.</p>
          </header>

          {error && (
            <div className="notice notice-error">
              <span>{error}</span>
            </div>
          )}

          <div className="field">
            <label>Email address</label>
            <div className="input-icon">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-icon">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me on this device</span>
          </label>

          <button type="submit" className="button button-primary button-full" disabled={loading}>
            {loading ? "Signing in…" : (
              <>
                Log in <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="auth-switch">
            New to EduConnect? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </main>
    </div>
  );
}