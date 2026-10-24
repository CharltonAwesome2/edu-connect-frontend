import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

export function RequireAuth() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  return isLoggedIn
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
export function RedirectIfAuthed() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
}

export function RequireRole({ allow }) {
  const { role, isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
}