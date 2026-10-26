import { Flag, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card, EmptyState, Field, Loading, Modal, Notice, PageHeader, StatusBadge, formatDate } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { reports as reportApi, tutorProfiles, tutoringSessions } from "@api";
import { useNotice } from "@hooks/useNotice";

const REASONS = [
  "No-show",
  "Harassment",
  "Inappropriate behaviour",
  "Payment dispute",
  "Unprofessional conduct",
  "Other",
];

export default function Reports() {
  const { user, isTutor } = useAuth();
  const [reports, setReports] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    sessionId: "",
    reason: "No-show",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, clear, showError, showSuccess } = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      const myReports = await reportApi.byReporterId(user.userId);

      let mySessions = [];
      let ownProfile = null;

      if (isTutor) {
        const profiles = await tutorProfiles.byUserId(user.userId);
        ownProfile = profiles[0] ?? null;
        if (ownProfile) {
          mySessions = await tutoringSessions.byTutorProfileId(ownProfile.tutorProfileId);
        }
      }
      const asStudent = await tutoringSessions.byStudentId(user.userId);

      const byId = new Map();
      [...mySessions, ...asStudent].forEach((s) => {
        byId.set(s.tutoringSessionId, s);
      });

      setReports(myReports);
      setSessions([...byId.values()]);
      setTutorProfile(ownProfile);
    } catch (cause) {
      showError(cause.message);
    } finally {
      setLoading(false);
    }
  };


  const reportedSessionIds = useMemo(() => new Set(reports.map((r) => r.session?.tutoringSessionId)), [reports]);

  const reportableSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (s.status !== "COMPLETED") return false;
      if (reportedSessionIds.has(s.tutoringSessionId)) return false;
      return true;
    });
  }, [sessions, reportedSessionIds]);

  const otherParty = useMemo(() => {
    if (!form.sessionId) return null;
    const session = sessions.find((s) => String(s.tutoringSessionId) === String(form.sessionId));
    if (!session) return null;

    const iAmStudent = session.student?.userId === user.userId;
    if (iAmStudent) {
      const tutorUser = session.tutorProfile?.user;
      return {
        userId: tutorUser?.userId ?? null,
        label: tutorUser
          ? `${tutorUser.name ?? ""} ${tutorUser.surname ?? ""}`.trim() ||
            `Tutor #${session.tutorProfile?.tutorProfileId}`
          : `Tutor #${session.tutorProfile?.tutorProfileId}`,
        kind: "tutor",
      };
    }

    return {
      userId: session.student?.userId ?? null,
      label: session.student
        ? `${session.student.name ?? ""} ${session.student.surname ?? ""}`.trim() ||
          `Student #${session.student.userId}`
        : "Student",
      kind: "student",
    };
  }, [form.sessionId, sessions, user.userId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!otherParty?.userId) {
      showError("Could not determine the other party for this session.");
      return;
    }
    setBusy(true);
    try {
      await reportApi.create({
        reporter: { userId: user.userId },
        reportedUser: { userId: otherParty.userId },
        session: { tutoringSessionId: Number(form.sessionId) },
        reason: form.reason,
        description: form.description,
        status: "PENDING",
        reportedAt: new Date().toISOString(),
      });
      setShow(false);
      setForm({ sessionId: "", reason: "No-show", description: "" });
      showSuccess("Report submitted.");
      await load();
    } catch (cause) {
      showError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading label="Loading reports" />;

  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title="Reports"
        description="Flag behaviour from sessions you've been part of."
        action={
          <button
            className="button button-primary"
            onClick={() => setShow(true)}
            disabled={reportableSessions.length === 0}
            title={reportableSessions.length === 0 ? "No completed sessions available to report" : undefined}
          >
            <Plus size={18} /> File a report
          </button>
        }
      />
      {notice && (
        <Notice kind={notice.kind} onClose={clear}>
          {notice.text}
        </Notice>
      )}

      <Card>
        {reports.length === 0 ? (
          <EmptyState title="No reports filed" text="Reports you submit will appear here with their status." />
        ) : (
          <div className="compact-list">
            {reports.map((r) => (
              <div key={r.reportId}>
                <span className="list-icon">
                  <Flag />
                </span>
                <span>
                  <b>{r.reason}</b>
                  <small>
                    {r.session ? `Session #${r.session.tutoringSessionId}` : "No session linked"} · against{" "}
                    {r.reportedUser?.name
                      ? `${r.reportedUser.name} ${r.reportedUser.surname ?? ""}`.trim()
                      : `user #${r.reportedUser?.userId}`}{" "}
                    · {formatDate(r.reportedAt)}
                  </small>
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
            <Field label="Which session?" hint="Only completed sessions can be reported.">
              <select
                value={form.sessionId}
                onChange={(e) => setForm((c) => ({ ...c, sessionId: e.target.value }))}
                required
              >
                <option value="">Select a session…</option>
                {reportableSessions.map((s) => {
                  // Show the other party in the label
                  const iAmStudent = s.student?.userId === user.userId;
                  const other = iAmStudent ? s.tutorProfile?.user : s.student;
                  const otherName = other
                    ? `${other.name ?? ""} ${other.surname ?? ""}`.trim()
                    : iAmStudent
                      ? `Tutor #${s.tutorProfile?.tutorProfileId}`
                      : "Student";

                  return (
                    <option key={s.tutoringSessionId} value={s.tutoringSessionId}>
                      #{s.tutoringSessionId} · {otherName} · {formatDate(s.startTime)}
                    </option>
                  );
                })}
              </select>
            </Field>

            {otherParty && (
              <Field label="Reporting">
                <input value={otherParty.label} disabled readOnly />
              </Field>
            )}

            <Field label="Reason">
              <select value={form.reason} onChange={(e) => setForm((c) => ({ ...c, reason: e.target.value }))}>
                {REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>

            <Field label="Description" hint="Include dates, times, and what happened.">
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
                required
              />
            </Field>

            <button className="button button-primary" disabled={busy || !otherParty?.userId}>
              <Flag size={18} /> {busy ? "Submitting…" : "Submit report"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
