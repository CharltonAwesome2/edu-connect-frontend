import { useState } from "react";
import { Save } from "lucide-react";
import { Field, Modal } from "@components/ui";

export default function ManageSessionModal({ session, busy, onClose, onSubmit }) {
  const [form, setForm] = useState({
    status: session.status,
    sessionNotes: session.sessionNotes ?? "",
  });
  const submit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <Modal title="Manage tutoring session" onClose={onClose} wide>
      <form className="stack-form" onSubmit={submit}>
        <Field label="Session status">
          <select value={form.status}
            onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </Field>
        <Field label="Session notes">
          <textarea rows={3} value={form.sessionNotes}
            onChange={(e) => setForm((c) => ({ ...c, sessionNotes: e.target.value }))} />
        </Field>
        <button className="button button-primary" disabled={busy}>
          <Save size={18} /> {busy ? "Saving…" : "Save session"}
        </button>
      </form>
    </Modal>
  );
}