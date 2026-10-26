import { Bell, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Topbar({ unread, onOpenSidebar }) {
  return (
    <header className="topbar">
      <button
        className="icon-button mobile-only"
        onClick={onOpenSidebar}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <span className="topbar-message">
        <span className="live-dot" /> EduConnect
      </span>

      <NavLink
        to="/notifications"
        className="notification-button"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && <span>{unread > 9 ? "9+" : unread}</span>}
      </NavLink>
    </header>
  );
}