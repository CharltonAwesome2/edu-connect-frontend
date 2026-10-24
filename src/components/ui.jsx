import { X } from "lucide-react";

export function Card({ className = "", children }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function Loading({ label = "Loading" }) {
  return <div className="loading">{label}…</div>;
}

export function Modal({ title, onClose, wide = false, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal ${wide ? "modal-wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

export function Notice({ kind = "error", onClose, children }) {
  return (
    <div className={`notice notice-${kind}`}>
      <span>{children}</span>
      {onClose && (
        <button className="icon-button" onClick={onClose} aria-label="Dismiss">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function StatusBadge({ status }) {
  return <span className={`status status-${String(status).toLowerCase()}`}>{status}</span>;
}

export function StatCard({ icon, label, value, tone = "cyan" }) {
  return (
    <div className="stat-card card">
      <span className={`stat-icon ${tone}`}>{icon}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

export function money(value) {
  const n = Number(value) || 0;
  return n === 0 ? "Free" : `R ${n.toFixed(2)}`;
}