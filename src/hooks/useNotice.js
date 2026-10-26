import { useCallback, useState } from "react";

export function useNotice() {
  const [notice, setNotice] = useState(null);
  const clear = useCallback(() => setNotice(null), []);
  const showError = useCallback((text) => setNotice({ kind: "error", text }), []);
  const showSuccess = useCallback((text) => setNotice({ kind: "success", text }), []);
  return { notice, setNotice, clear, showError, showSuccess };
}