import { Link } from "react-router-dom";

export function Brand({ to = "/" }) {
  return (
    <Link to={to} className="brand">
      <span className="brand-mark">EC</span>
      <span>Edu<span>Connect</span></span>
    </Link>
  );
}