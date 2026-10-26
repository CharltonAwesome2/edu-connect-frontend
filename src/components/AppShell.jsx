import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { notifications as notificationApi } from "@api";
import Sidebar from "@components/shell/Sidebar";
import Topbar from "@components/shell/Topbar";

export default function AppShell() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const refreshUnread = async () => {
    if (!user?.userId) return;
    try {
      const list = await notificationApi.byUserId(user.userId);
      setUnread(list.filter((n) => !n.isRead).length);
    } catch {
      setUnread(0);
    }
  };

  useEffect(() => {
    void refreshUnread();
    const t = setInterval(refreshUnread, 30000);
    const handler = () => refreshUnread();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("notifications:refresh", handler);
    window.addEventListener("keydown", onKey);
    return () => {
      clearInterval(t);
      window.removeEventListener("notifications:refresh", handler);
      window.removeEventListener("keydown", onKey);
    };
    /* eslint-disable-next-line */
  }, [user?.userId]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore network errors — still navigate away */
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const initials = [user?.name?.[0], user?.surname?.[0]].filter(Boolean).join("").toUpperCase() || "EC";

  return (
    <div className="app-shell">
      {open && <button className="sidebar-scrim" onClick={() => setOpen(false)} aria-label="Close menu" />}

      <Sidebar
        user={user}
        role={role}
        initials={initials}
        open={open}
        onClose={() => setOpen(false)}
        onLogout={handleLogout}
      />

      <div className="app-main">
        <Topbar unread={unread} onOpenSidebar={() => setOpen(true)} />
        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
