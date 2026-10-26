import { Flag, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, EmptyState, Field, Loading, Modal, Notice, PageHeader, StatusBadge, formatDate } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { reports as reportApi, users } from "@api";
import { useNotice } from "@hooks/useNotice";

export default function Reports() {
  const { user } = useAuth();
  const [mine, setMine] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ reportedUserId: "", reason: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, clear, showError, showSuccess } = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      const list = await reportApi.byReporterId(user.userId);
      setMine(list);
    } catch (cause) { showError(cause.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await reportApi.create({
        reporter: { userId: user.userId },
        reportedUser: { userId: Number(form.reportedUserId) },
        reason: form.reason,
        description: form.description,
        status: "OPEN",
        reportedAt: new Date().toISOString(),
      });
      setShow(false);
      setForm({ reportedUserId: "", reason: "", description: "" });
      showSuccess("Report submitted.");
      await load();
    } catch (cause) { showError(cause.message); }
    finally { setBusy(false); }
  };

  if (loading) return <Loading label="Loading reports" />;

  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title="Reports"
        description="Flag behaviour that breaks our community guidelines."
        action={<button className="button button-primary" onClick={() => setShow(true)}>
          <Plus size={18} /> File a report
        </button>}
      />
      {notice && <Notice kind={notice.kind} onClose={clear}>{notice.text}</Notice>}

      <Card>
        {mine.length === 0 ? (
          <EmptyState title="No reports filed" text="Reports you submit will appear here with their status." />
        ) : (
          <div className="compact-list">
            {mine.map((r) => (
              <div key={r.reportId}>
                <span className="list-icon"><Flag /></span>
                <span>
                  <b>{r.reason}</b>
                  <small>Against user #{r.reportedUser?.userId} · {formatDate(r.reportedAt)}</small>
                </span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {show && (
        <Modal title="File a report" onClose={() => setShow(false)}>
          <form className="stack-form" onSubmit={submit}>
            <Field label="Reported user ID" hint="You can find this on the user's profile">
              <input type="number" value={form.reportedUserId}
                onChange={(e) => setForm((c) => ({ ...c, reportedUserId: e.target.value }))} required />
            </Field>
            <Field label="Reason">
              <input value={form.reason}
                onChange={(e) => setForm((c) => ({ ...c, reason: e.target.value }))}
                placeholder="e.g. Harassment, No-show, Inappropriate behaviour" required />
            </Field>
            <Field label="Description">
              <textarea rows={5} value={form.description}
                onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} required />
            </Field>
            <button className="button button-primary" disabled={busy}>
              <Flag size={18} /> {busy ? "Submitting…" : "Submit report"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}