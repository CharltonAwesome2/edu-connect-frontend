import { createContext, useContext, useState, useCallback } from "react";
import { loginApi, signupApi } from "@api/auth";

const USER_KEY = "educonnect.user";

const AuthContext = createContext(null);

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const persist = useCallback((user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const user = await loginApi(email, password);
      persist(user);
      return user;
    },
    [persist]
  );

  const signup = useCallback(
    async (name, email, password) => {
      const user = await signupApi(name, email, password);
      persist(user);
      return user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const role = deriveRole(user);
  const value = { user, role, isLoggedIn: !!user, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}