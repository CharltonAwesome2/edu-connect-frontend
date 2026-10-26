import { useState } from "react";
import { Field, Modal } from "@components/ui";

const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];

export default function AvailabilityModal({ busy, onClose, onSubmit }) {
  const [form, setForm] = useState({
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "12:00",
    isRecurring: true,
  });
  const submit = (e) => { e.preventDefault(); onSubmit(form); };
  return (
    <Modal title="Add recurring availability" onClose={onClose}>
      <form className="stack-form" onSubmit={submit}>
        <Field label="Day">
          <select value={form.dayOfWeek}
            onChange={(e) => setForm((c) => ({ ...c, dayOfWeek: e.target.value }))}>
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <div className="form-grid two">
          <Field label="Starts">
            <input type="time" value={form.startTime}
              onChange={(e) => setForm((c) => ({ ...c, startTime: e.target.value }))} required />
          </Field>
          <Field label="Ends">
            <input type="time" value={form.endTime}
              onChange={(e) => setForm((c) => ({ ...c, endTime: e.target.value }))} required />
          </Field>
        </div>
        <label className="check-row">
          <input type="checkbox" checked={form.isRecurring}
            onChange={(e) => setForm((c) => ({ ...c, isRecurring: e.target.checked }))} />
          <span>Repeat every week</span>
        </label>
        <button className="button button-primary" disabled={busy}>Publish availability</button>
      </form>
    </Modal>
  );
}