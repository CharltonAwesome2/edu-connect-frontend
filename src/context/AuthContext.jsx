import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { loginApi, signupApi, logoutApi } from "@api/auth";

const USER_KEY = "educonnect.user";
const REMEMBER_KEY = "educonnect.remember";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function deriveRole(user) {
  if (!user) return null;
  if (user.isTutor && user.isStudent) return "both";
  if (user.isTutor) return "tutor";
  if (user.isStudent) return "student";
  return "unknown";
}

export function dashboardPath(user) {
  const role = deriveRole(user);
  if (role === "tutor") return "/tutor";
  if (role === "student") return "/student";
  return "/";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const persist = useCallback((nextUser, remember) => {
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    other.removeItem(USER_KEY);
    target.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
    setUser(nextUser);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email, password, remember = true) => {
      const nextUser = await loginApi(email, password);
      persist(nextUser, remember);
      return nextUser;
    },
    [persist],
  );

  const signup = useCallback(
    async (payload, remember = true) => {
      const nextUser = await signupApi(payload);
      persist(nextUser, remember);
      return nextUser;
    },
    [persist],
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore — no server session
    }
    clear();
  }, [clear]);

  // Keeps the sidebar/header in sync after Profile.jsx saves.
  useEffect(() => {
    const handler = (e) => {
      if (!e.detail) return;
      const remember = localStorage.getItem(REMEMBER_KEY) === "1";
      persist(e.detail, remember);
    };
    window.addEventListener("auth:refresh", handler);
    return () => window.removeEventListener("auth:refresh", handler);
  }, [persist]);

  const role = deriveRole(user);
  const value = {
    user,
    role,
    isLoggedIn: !!user,
    isStudent: !!user?.isStudent,
    isTutor: !!user?.isTutor,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}