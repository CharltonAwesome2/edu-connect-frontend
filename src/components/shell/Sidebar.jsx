import { LogOut, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Brand } from "@components/Brand";

const NAV_ITEMS = [
  { to: "/tutors",        label: "Find tutors",   roles: "all" },
  { to: "/profile",       label: "Profile",       roles: "all" },
  { to: "/payments",      label: "Payments",      roles: "student" },
  { to: "/invoices",      label: "Invoices",      roles: "student" },
  { to: "/reports",       label: "Reports",       roles: "all" },
  { to: "/notifications", label: "Notifications", roles: "all" },
];

function canSee(roles, currentRole) {
  if (roles === "all") return true;
  return currentRole === roles || currentRole === "both";
}

export default function Sidebar({ user, role, initials, open, onClose, onLogout }) {
  const brandHome = role === "tutor" ? "/tutor" : "/student";

  return (
    <aside
      className={`sidebar ${open ? "open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="sidebar-head">
        <Brand to={brandHome} />
        <button
          className="icon-button mobile-only"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="side-nav">
        {(role === "student" || role === "both") && (
          <NavLink to="/student" onClick={onClose}>
            Student dashboard
          </NavLink>
        )}
        {(role === "tutor" || role === "both") && (
          <NavLink to="/tutor" onClick={onClose}>
            Tutor dashboard
          </NavLink>
        )}

        {NAV_ITEMS.filter((item) => canSee(item.roles, role)).map((item) => (
          <NavLink key={item.to} to={item.to} onClick={onClose}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <span className="user-avatar">{initials}</span>
        <div className="user-meta">
          <strong>
            {[user?.name, user?.surname].filter(Boolean).join(" ") ||
              "EduConnect user"}
          </strong>
          <span>{role}</span>
        </div>
        <button
          className="icon-button"
          onClick={onLogout}
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}