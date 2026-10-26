import { CreditCard, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, EmptyState, Field, Loading, Modal, Notice, PageHeader, StatusBadge, formatDate, money } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { payments as paymentApi, tutoringSessions } from "@api";
import { useNotice } from "@hooks/useNotice";

const METHODS = ["CARD", "EFT", "CASH", "MOBILE"];
const STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function Payments() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    sessionId: "",
    amount: "",
    method: "CARD",
    transactionReference: "",
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, clear, showError, showSuccess } = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      const [mine, all] = await Promise.all([
        tutoringSessions.byStudentId(user.userId),
        paymentApi.all(),
      ]);
      setSessions(mine);
      setPayments(all.filter((p) => p.session?.student?.userId === user.userId));
    } catch (cause) { showError(cause.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const session = sessions.find((s) => String(s.tutoringSessionId) === String(form.sessionId));
      await paymentApi.create({
        session: { tutoringSessionId: Number(form.sessionId) },
        amount: Number(form.amount),
        method: form.method,
        transactionReference: form.transactionReference || null,
        status: "PAID",
        paidAt: new Date().toISOString(),
      });
      setShow(false);
      setForm({ sessionId: "", amount: "", method: "CARD", transactionReference: "" });
      showSuccess(`Payment recorded for ${session ? "session #" + session.tutoringSessionId : "session"}.`);
      await load();
    } catch (cause) { showError(cause.message); }
    finally { setBusy(false); }
  };

  if (loading) return <Loading label="Loading payments" />;

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Payments"
        description="Pay for sessions and track your payment history."
        action={<button className="button button-primary" onClick={() => setShow(true)}>
          <Plus size={18} /> Record payment
        </button>}
      />
      {notice && <Notice kind={notice.kind} onClose={clear}>{notice.text}</Notice>}

      <Card>
        {payments.length === 0 ? (
          <EmptyState title="No payments yet" text="Payments you record will appear here." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Session</th><th>Amount</th><th>Method</th><th>Status</th><th>Paid</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentId}>
                    <td>#{p.session?.tutoringSessionId ?? "—"}</td>
                    <td><b>{money(p.amount)}</b></td>
                    <td>{p.method}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>{formatDate(p.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {show && (
        <Modal title="Record a payment" onClose={() => setShow(false)}>
          <form className="stack-form" onSubmit={submit}>
            <Field label="Session">
              <select value={form.sessionId}
                onChange={(e) => setForm((c) => ({ ...c, sessionId: e.target.value }))} required>
                <option value="">Select a session…</option>
                {sessions.map((s) => (
                  <option key={s.tutoringSessionId} value={s.tutoringSessionId}>
                    #{s.tutoringSessionId} · {formatDate(s.startTime)}
                  </option>
                ))}
              </select>
            </Field>
            <div className="form-grid two">
              <Field label="Amount (R)">
                <input type="number" min="0" step="0.01" value={form.amount}
                  onChange={(e) => setForm((c) => ({ ...c, amount: e.target.value }))} required />
              </Field>
              <Field label="Method">
                <select value={form.method}
                  onChange={(e) => setForm((c) => ({ ...c, method: e.target.value }))}>
                  {METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Transaction reference" hint="Optional">
              <input value={form.transactionReference}
                onChange={(e) => setForm((c) => ({ ...c, transactionReference: e.target.value }))} />
            </Field>
            <button className="button button-primary" disabled={busy}>
              <CreditCard size={18} /> {busy ? "Saving…" : "Record payment"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}