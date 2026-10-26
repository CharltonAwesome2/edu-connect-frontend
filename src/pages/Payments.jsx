import { CreditCard, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  EmptyState,
  Field,
  Loading,
  Modal,
  Notice,
  PageHeader,
  StatusBadge,
  formatDate,
  money,
} from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { payments as paymentApi, tutoringSessions } from "@api";
import { useNotice } from "@hooks/useNotice";

const METHODS = ["CARD", "EFT", "SNAPSCAN", "PAYPAL", "BANK_TRANSFER", "CASH"];

export default function Payments() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    sessionId: "",
    method: "CARD",
    transactionReference: "",
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, clear, showError, showSuccess } = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      const [mine, myPayments] = await Promise.all([
        tutoringSessions.byStudentId(user.userId),
        paymentApi.byStudentId(user.userId),
      ]);
      setSessions(mine);
      setPayments(myPayments);
    } catch (cause) {
      showError(cause.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    void load();
  }, []);

  const payableSessions = useMemo(() => {
    const pendingBySession = new Set(
      payments
        .filter((p) => p.status === "PENDING" && p.session?.tutoringSessionId != null)
        .map((p) => p.session.tutoringSessionId),
    );
    return sessions.filter((s) => pendingBySession.has(s.tutoringSessionId));
  }, [sessions, payments]);

  const selectedPayment = useMemo(() => {
    if (!form.sessionId) return null;
    return (
      payments.find((p) => p.status === "PENDING" && String(p.session?.tutoringSessionId) === String(form.sessionId)) ??
      null
    );
  }, [payments, form.sessionId]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (!selectedPayment) {
        showError("No pending invoice found for this session. Ask your tutor to mark it completed first.");
        return;
      }

      await paymentApi.markPaid(selectedPayment.paymentId, form.method, form.transactionReference || null);

      setShow(false);
      setForm({ sessionId: "", method: "CARD", transactionReference: "" });
      showSuccess("Payment recorded.");
      await load();
    } catch (cause) {
      showError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading label="Loading payments" />;

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Payments"
        description="Pay for sessions and track your payment history."
        action={
          <button
            className="button button-primary"
            onClick={() => setShow(true)}
            disabled={payableSessions.length === 0}
            title={payableSessions.length === 0 ? "No pending payments to settle" : undefined}
          >
            <Plus size={18} /> Record payment
          </button>
        }
      />
      {notice && (
        <Notice kind={notice.kind} onClose={clear}>
          {notice.text}
        </Notice>
      )}

      <Card>
        {payments.length === 0 ? (
          <EmptyState title="No payments yet" text="Payments appear here once a tutor marks a session complete." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Paid</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentId}>
                    <td>#{p.session?.tutoringSessionId ?? "—"}</td>
                    <td>
                      <b>{money(p.amount)}</b>
                    </td>
                    <td>{p.paymentMethod ?? "—"}</td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
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
              <select
                value={form.sessionId}
                onChange={(e) => setForm((c) => ({ ...c, sessionId: e.target.value }))}
                required
              >
                <option value="">Select a session…</option>
                {payableSessions.map((s) => (
                  <option key={s.tutoringSessionId} value={s.tutoringSessionId}>
                    #{s.tutoringSessionId} · {formatDate(s.startTime)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Amount (R)" hint="Set by the tutor's hourly rate × session duration">
              <input value={selectedPayment ? money(selectedPayment.amount) : "—"} disabled readOnly />
            </Field>

            <Field label="Method">
              <select value={form.method} onChange={(e) => setForm((c) => ({ ...c, method: e.target.value }))}>
                {METHODS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>

            <Field label="Transaction reference" hint="Optional">
              <input
                value={form.transactionReference}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    transactionReference: e.target.value,
                  }))
                }
              />
            </Field>

            <button className="button button-primary" disabled={busy || !selectedPayment}>
              <CreditCard size={18} /> {busy ? "Saving…" : "Record payment"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
