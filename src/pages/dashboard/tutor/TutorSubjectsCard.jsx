import { useState } from "react";
import { Card } from "@components/ui";

export default function TutorSubjectsCard({ subjects, assignedSubjects, onAdd, disabled, busy }) {
  const [subjectId, setSubjectId] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!subjectId) return;
    await onAdd(Number(subjectId));
    setSubjectId("");
  };
  return (
    <Card>
      <div className="card-heading">
        <div><span className="eyebrow">Teaching profile</span><h2>Your subjects</h2></div>
      </div>
      <div className="tag-row large">
        {assignedSubjects.map((s) => <span key={s.subjectId}>{s.subjectCode}</span>)}
      </div>
      {assignedSubjects.length === 0 && <p className="muted">No subjects assigned yet.</p>}
      <form className="inline-form vertical-mobile" onSubmit={submit}>
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required disabled={disabled}>
          <option value="">Select a subject…</option>
          {subjects
            .filter((s) => !assignedSubjects.some((a) => a.subjectId === s.subjectId))
            .map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectCode} — {s.subjectName}
              </option>
            ))}
        </select>
        <button className="button button-secondary" disabled={disabled || busy}>Add</button>
      </form>
    </Card>
  );
}