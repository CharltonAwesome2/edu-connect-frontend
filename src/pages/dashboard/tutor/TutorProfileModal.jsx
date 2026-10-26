import { useState } from "react";
import { Save } from "lucide-react";
import { Field, Modal } from "@components/ui";

export default function TutorProfileModal({ profile, busy, onClose, onSubmit }) {
  const [form, setForm] = useState({
    bio: profile?.bio ?? "",
    yearsExperience: profile?.yearsExperience ?? 0,
    hourlyRate: profile?.hourlyRate ?? 0,
  });
  const submit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <Modal title={profile ? "Edit tutor profile" : "Create tutor profile"} onClose={onClose}>
      <form className="stack-form" onSubmit={submit}>
        <Field label="Tutor bio">
          <textarea rows={5} value={form.bio}
            onChange={(e) => setForm((c) => ({ ...c, bio: e.target.value }))} required />
        </Field>
        <div className="form-grid two">
          <Field label="Years of experience">
            <input type="number" min="0" value={form.yearsExperience}
              onChange={(e) => setForm((c) => ({ ...c, yearsExperience: Number(e.target.value) }))} required />
          </Field>
          <Field label="Hourly rate (R)" hint="Enter 0 for free tutoring">
            <input type="number" min="0" step="0.01" value={form.hourlyRate}
              onChange={(e) => setForm((c) => ({ ...c, hourlyRate: Number(e.target.value) }))} required />
          </Field>
        </div>
        <button className="button button-primary" disabled={busy}>
          <Save size={18} /> Save profile
        </button>
      </form>
    </Modal>
  );
}