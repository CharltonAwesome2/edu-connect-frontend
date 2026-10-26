import { useMemo } from "react";

export function useSubjectLookup(subjects) {
  const byId = useMemo(() => {
    const m = new Map();
    subjects.forEach((s) => m.set(s.subjectId, s));
    return m;
  }, [subjects]);

  const nameOf = (id) => byId.get(id)?.subjectName ?? `Subject ${id}`;
  const codeOf = (id) => byId.get(id)?.subjectCode ?? "—";

  return { byId, nameOf, codeOf };
}
