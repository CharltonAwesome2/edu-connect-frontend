import { useState } from "react";
import { Plus } from "lucide-react";
import { Field, Modal } from "@components/ui";

export default function CreateSubjectModal({ busy, onClose, onSubmit }) {
  const [form, setForm] = useState({ subjectName: "", subjectCode: "", department: "" });
  const submit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <Modal title="Create a subject" onClose={onClose}>
      <form className="stack-form" onSubmit={submit}>
        <Field label="Subject name">
          <input
            value={form.subjectName}
            onChange={(e) => setForm((c) => ({ ...c, subjectName: e.target.value }))}
            placeholder="Mathematics"
            required
          />
        </Field>
        <div className="form-grid two">
          <Field label="Subject code">
            <input
              value={form.subjectCode}
              onChange={(e) => setForm((c) => ({ ...c, subjectCode: e.target.value.toUpperCase() }))}
              placeholder="MAT101"
              required
            />
          </Field>
          <Field label="Department">
            <input
              value={form.department}
              onChange={(e) => setForm((c) => ({ ...c, department: e.target.value }))}
              placeholder="Science"
            />
          </Field>
        </div>
        <button className="button button-primary" disabled={busy}>
          <Plus size={18} /> {busy ? "Creating…" : "Create subject"}
        </button>
      </form>
    </Modal>
  );
}