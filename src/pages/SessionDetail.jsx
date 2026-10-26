import { ArrowLeft, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Field, Loading, Notice, PageHeader, StatusBadge, formatDate } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { tutorReviews, tutoringSessions } from "@api";
import { useNotice } from "@hooks/useNotice";
import { durationMinutes } from "@utils/sessionUtils";

export default function SessionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [review, setReview] = useState(null);
  const [form, setForm] = useState({ rating: 5, comment: "", isPublic: true });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, clear, showError, showSuccess } = useNotice();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await tutoringSessions.byId(Number(id));
        setSession(s);
        try { setReview(await tutorReviews.bySession({ tutoringSessionId: Number(id) })); }
        catch { /* not found is fine */ }
      } catch (cause) { showError(cause.message); }
      finally { setLoading(false); }
    })();
  }, [id, showError]);

  const submit = async (e) => {
    e.preventDefault();
    if (!session) return;
    setBusy(true);
    try {
      await tutorReviews.create({
        session: { tutoringSessionId: session.tutoringSessionId },
        student: { userId: user.userId },
        tutorProfile: session.tutorProfile,
        ...form,
        reviewedAt: new Date().toISOString(),
      });
      showSuccess("Review saved.");
      setReview(await tutorReviews.bySession({ tutoringSessionId: session.tutoringSessionId }));
    } catch (cause) { showError(cause.message); }
    finally { setBusy(false); }
  };

  if (loading) return <Loading label="Loading session" />;
  if (!session) return (
    <main className="not-found"><h1>Session not found</h1>
      <Link to="/student" className="button button-primary"><ArrowLeft size={18} /> Back</Link>
    </main>
  );

  const canReview = session.status === "COMPLETED" && !review;

  return (
    <>
      <PageHeader
        eyebrow="Session"
        title={`Session #${session.tutoringSessionId}`}
        description={formatDate(session.startTime)}
        action={<Link to="/student" className="button button-secondary"><ArrowLeft size={17} /> Back</Link>}
      />
      {notice && <Notice kind={notice.kind} onClose={clear}>{notice.text}</Notice>}

      <div className="dashboard-grid">
        <Card className="span-two">
          <h2>Details</h2>
          <p><b>Starts:</b> {formatDate(session.startTime)}</p>
          <p><b>Ends:</b> {formatDate(session.endTime)}</p>
          <p><b>Duration:</b> {durationMinutes(session)} min</p>
          <p><b>Status:</b> <StatusBadge status={session.status} /></p>
          {session.sessionNotes && <p><b>Notes:</b> {session.sessionNotes}</p>}
        </Card>

        <Card>
          <h2>Review</h2>
          {review ? (
            <>
              <div>{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={16} />)}</div>
              <p>“{review.comment}”</p>
            </>
          ) : canReview ? (
            <form className="stack-form" onSubmit={submit}>
              <Field label="Rating">
                <input type="number" min="1" max="5" value={form.rating}
                  onChange={(e) => setForm((c) => ({ ...c, rating: Number(e.target.value) }))} />
              </Field>
              <Field label="Comment">
                <textarea rows={3} value={form.comment}
                  onChange={(e) => setForm((c) => ({ ...c, comment: e.target.value }))} required />
              </Field>
              <button className="button button-primary" disabled={busy}>
                {busy ? "Saving…" : "Submit review"}
              </button>
            </form>
          ) : (
            <p className="muted">Reviews become available after the session is completed.</p>
          )}
        </Card>
      </div>
    </>
  );
}