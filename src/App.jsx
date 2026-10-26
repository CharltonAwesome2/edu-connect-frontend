import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import { RequireAuth, RedirectIfAuthed } from "@components/guards";
import AppShell from "@components/AppShell";
import Landing from "@pages/Landing";
import Login from "@pages/auth/Login";
import Signup from "@pages/auth/Signup";
import Tutors from "@pages/Tutors";
import TutorPublicPage from "@pages/TutorPublicPage";
import StudentDashboard from "@pages/StudentDashboard";
import TutorDashboard from "@pages/TutorDashboard";
import NotFound from "@pages/NotFound";
import Notifications from "@pages/Notifications";
import Profile from "@pages/Profile";
import Payments from "@pages/Payments";
import Invoices from "@pages/Invoices";
import Reports from "@pages/Reports";
import SessionDetail from "@pages/SessionDetail";
import AdminReports from "@pages/AdminReports";

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

          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/tutor" element={<TutorDashboard />} />
              <Route path="/tutors" element={<Tutors />} />
              <Route path="/tutors/:id" element={<TutorPublicPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/sessions/:id" element={<SessionDetail />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}