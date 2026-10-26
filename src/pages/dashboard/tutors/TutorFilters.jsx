import { Search } from "lucide-react";
import { Field } from "@components/ui";

export default function TutorFilters({ subjectList, subjectId, setSubjectId, maxRate, setMaxRate, onSubmit }) {
  return (
    <form className="filter-bar" onSubmit={onSubmit}>
      <div className="input-icon">
        <Search size={18} />
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">All subjects</option>
          {subjectList.map((s) => (
            <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
          ))}
        </select>
      </div>
      <Field label="Maximum hourly rate">
        <input type="number" min="0" step="10" placeholder="Any rate"
          value={maxRate} onChange={(e) => setMaxRate(e.target.value)} />
      </Field>
      <button className="button button-primary">Search tutors</button>
    </form>
  );
}