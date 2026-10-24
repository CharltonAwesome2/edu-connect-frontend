import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "@components/Brand";

export default function NotFound() {
  return (
    <main className="not-found">
      <Brand />
      <span>404</span>
      <h1>This page missed the lesson.</h1>
      <p>The page you requested does not exist or has moved.</p>
      <Link className="button button-primary" to="/"><ArrowLeft size={18} /> Return home</Link>
    </main>
  );
}