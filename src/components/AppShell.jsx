import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Brand } from "@components/Brand";
import { useAuth } from "@context/AuthContext";

export default function AppShell() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = `${user?.name?.[0] ?? ""}${user?.surname?.[0] ?? ""}`.toUpperCase() || "EC";

  return (
    <div className="app-shell">
      {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close menu" />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-head">
          <Brand />
          <button className="icon-button mobile-only" onClick={() => setOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <nav className="side-nav">
          {role === "student" || role === "both" ? (
            <NavLink to="/student" onClick={() => setOpen(false)}>
              Student dashboard
            </NavLink>
          ) : null}
          {role === "tutor" || role === "both" ? (
            <NavLink to="/tutor" onClick={() => setOpen(false)}>
              Tutor dashboard
            </NavLink>
          ) : null}
          <NavLink to="/tutors" onClick={() => setOpen(false)}>
            Find tutors
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <span className="user-avatar">{initials}</span>
          <div className="user-meta">
            <strong>{user?.name} {user?.surname}</strong>
            <span>{role}</span>
          </div>
          <button className="icon-button" onClick={handleLogout} title="Log out" aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <span className="topbar-message">
            <span className="live-dot" /> EduConnect
          </span>
        </header>
        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}