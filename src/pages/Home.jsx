import { useAuth } from "@context/AuthContext";

export default function Home() {
  const { user, role, logout } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>EduConnect</h1>
      <p>Welcome, {user?.name} {user?.surname}</p>
      <p>Role: {role}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}