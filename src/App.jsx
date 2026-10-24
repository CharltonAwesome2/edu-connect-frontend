import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import { RequireAuth, RedirectIfAuthed } from "@components/guards";
import AppShell from "@components/AppShell";
import Landing from "@pages/Landing";
import Login from "@pages/auth/Login";
import Signup from "@pages/auth/Signup";
import Tutors from "@pages/Tutors";
import StudentDashboard from "@pages/StudentDashboard";
import TutorDashboard from "@pages/TutorDashboard";
import NotFound from "@pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<RedirectIfAuthed />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route path="/" element={<Landing />} />

          {/* Authenticated pages now share a sidebar with logout */}
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/tutor" element={<TutorDashboard />} />
              <Route path="/tutors" element={<Tutors />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}