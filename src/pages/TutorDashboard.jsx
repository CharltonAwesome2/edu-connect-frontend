import { CalendarClock, Check, Save, Star, UserRoundCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Card, EmptyState, Field, Loading, Modal, Notice, PageHeader, StatCard, StatusBadge, formatDate,
} from "@components/ui";
import { useAuth } from "@context/AuthContext";
import {
  subjects as subjectApi, tutorProfiles, tutorSubjects, availability as availabilityApi,
  tutoringSessions, bookingRequests, tutorReviews,
} from "@api";

export default function TutorDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [tutorSubjectLinks, setTutorSubjectLinks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profileForm, setProfileForm] = useState({ bio: "", yearsExperience: 0, hourlyRate: 0 });
  const [subjectId, setSubjectId] = useState("");
  const [availability, setAvailability] = useState({
    dayOfWeek: "MONDAY", startTime: "09:00", endTime: "12:00", isRecurring: true,
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [reviewSession, setReviewSession] = useState(null);
  const [review, setReview] = useState({
    rating: 5, comment: "", strengths: "", improvements: "", isPublic: false,
  });
  const [delivery, setDelivery] = useState({
    status: "SCHEDULED", sessionNotes: "",
  });
  const [showProfile, setShowProfile] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [subs, profiles] = await Promise.all([subjectApi.all(), tutorProfiles.byUserId(user.userId)]);
      const own = profiles[0] ?? null;
      setSubjects(subs); setProfile(own);

      if (own) {
        setProfileForm({
          bio: own.bio ?? "",
          yearsExperience: own.yearsExperience ?? 0,
          hourlyRate: own.hourlyRate ?? 0,
        });
        const [links, sess] = await Promise.all([
          tutorSubjects.byTutorProfileId(own.tutorProfileId),
          tutoringSessions.byTutorProfileId(own.tutorProfileId),
        ]);
        setTutorSubjectLinks(links); setSessions(sess);
      }

      let reqs = [];
      try { reqs = await bookingRequests.all(); } catch { /* optional */ }
      setBookings(reqs.filter((r) => (r.tutorProfile?.tutorProfileId) === own?.tutorProfileId));
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  const assignedSubjects = useMemo(
    () => subjects.filter((s) => tutorSubjectLinks.some((l) => l.subject?.subjectId === s.subjectId)),
    [subjects, tutorSubjectLinks]
  );
  const subjectName = (id) => subjects.find((s) => s.subjectId === id)?.subjectName ?? `Subject ${id}`;

  const saveProfile = async (e) => {
    e.preventDefault();
    setBusy(true); setNotice(null);
    try {
      const payload = {
        ...(profile ? { tutorProfileId: profile.tutorProfileId } : {}),
        user: { userId: user.userId },
        bio: profileForm.bio,
        yearsExperience: profileForm.yearsExperience,
        hourlyRate: profileForm.hourlyRate,
        createdAt: profile?.createdAt ?? new Date().toISOString(),
        isVerified: profile?.isVerified ?? false,
      };
      if (profile) await tutorProfiles.update(payload);
      else await tutorProfiles.create(payload);
      setShowProfile(false);
      setNotice({ kind: "success", text: "Tutor profile saved." });
      await load();
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setBusy(false);
    }
  };

  const addSubject = async (e) => {
    e.preventDefault();
    if (!subjectId || !profile) return;
    setBusy(true);
    try {
      await tutorSubjects.create({
        tutorProfile: { tutorProfileId: profile.tutorProfileId },
        subject: { subjectId: Number(subjectId) },
      });
      setSubjectId("");
      setNotice({ kind: "success", text: "Subject added." });
      await load();
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setBusy(false);
    }
  };

  const addAvailability = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setBusy(true);
    try {
      // Availability.startTime/endTime are LocalDateTime — combine today's date with the time.
      const today = new Date().toISOString().slice(0, 10);
      await availabilityApi.create({
        tutorProfile: { tutorProfileId: profile.tutorProfileId },
        dayOfWeek: availability.dayOfWeek,
        startTime: `${today}T${availability.startTime}:00`,
        endTime: `${today}T${availability.endTime}:00`,
        isRecurring: availability.isRecurring,
      });
      setShowAvailability(false);
      setNotice({ kind: "success", text: "Availability published." });
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setBusy(false);
    }
  };

  const respond = async (id, status) => {
    try {
      const req = bookings.find((b) => b.bookingRequestId === id);
      await bookingRequests.update({ ...req, status });
      setNotice({ kind: "success", text: `Booking ${status.toLowerCase()}.` });
      await load();
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    }
  };

  const openDelivery = (s) => {
    setSelectedSession(s);
    setDelivery({ status: s.status, sessionNotes: s.sessionNotes ?? "" });
  };

  const saveDelivery = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;
    setBusy(true);
    try {
      await tutoringSessions.update({
        ...selectedSession,
        status: delivery.status,
        sessionNotes: delivery.sessionNotes,
        updatedAt: new Date().toISOString(),
      });
      setSelectedSession(null);
      setNotice({ kind: "success", text: "Session updated." });
      await load();
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setBusy(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewSession) return;
    setBusy(true);
    try {
      await tutorReviews.create({
        session: { tutoringSessionId: reviewSession.tutoringSessionId },
        student: reviewSession.student,
        tutorProfile: reviewSession.tutorProfile,
        rating: review.rating,
        comment: review.comment,
        strengths: review.strengths,
        improvements: review.improvements,
        isPublic: review.isPublic,
        reviewedAt: new Date().toISOString(),
      });
      setReviewSession(null);
      setReview({ rating: 5, comment: "", strengths: "", improvements: "", isPublic: false });
      setNotice({ kind: "success", text: "Review saved." });
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading label="Preparing your tutor workspace" />;

  return (
    <>
      <PageHeader
        eyebrow="Tutor workspace"
        title={`Welcome, ${user?.name ?? "Tutor"}`}
        description="Manage requests, teaching, and your operational record."
        action={
          <div className="button-row">
            <button className="button button-secondary" onClick={() => setShowAvailability(true)} disabled={!profile}>
              <CalendarClock size={18} /> Add availability
            </button>
            <button className="button button-primary" onClick={() => setShowProfile(true)}>
              <UserRoundCheck size={18} /> {profile ? "Edit profile" : "Create profile"}
            </button>
          </div>
        }
      />

      {notice && <Notice kind={notice.kind} onClose={() => setNotice(null)}>{notice.text}</Notice>}
      {!profile && <Notice kind="info">Create your tutor profile before adding subjects or availability.</Notice>}

      <div className="stats-grid">
        <StatCard icon={<CalendarClock />} label="Pending requests" value={bookings.filter((b) => b.status === "PENDING").length} tone="amber" />
        <StatCard icon={<CalendarClock />} label="Scheduled sessions" value={sessions.filter((s) => s.status === "SCHEDULED").length} />
        <StatCard icon={<UserRoundCheck />} label="Subjects taught" value={assignedSubjects.length} tone="violet" />
        <StatCard icon={<Star />} label="Completed sessions" value={sessions.filter((s) => s.status === "COMPLETED").length} tone="green" />
      </div>

      <div className="dashboard-grid">
        <Card className="span-two">
          <div className="card-heading">
            <div><span className="eyebrow">Action needed</span><h2>Booking requests</h2></div>
          </div>
          {bookings.filter((b) => b.status === "PENDING").length === 0
            ? <EmptyState title="No pending requests" text="New student requests will appear here." />
            : <div className="request-list">
                {bookings.filter((b) => b.status === "PENDING").map((b) => (
                  <article key={b.bookingRequestId}>
                    <div className="request-icon"><CalendarClock /></div>
                    <div>
                      <h3>{subjectName(b.subject?.subjectId)}</h3>
                      <p>{formatDate(b.requestedStartTime)} · {b.durationMinutes} min</p>
                      <small>{b.studentNotes || "No notes from the student."}</small>
                    </div>
                    <div className="request-actions">
                      <button className="button button-success" onClick={() => void respond(b.bookingRequestId, "ACCEPTED")}>
                        <Check size={17} /> Accept
                      </button>
                      <button className="button button-danger" onClick={() => void respond(b.bookingRequestId, "DECLINED")}>
                        <X size={17} /> Decline
                      </button>
                    </div>
                  </article>
                ))}
              </div>
          }
        </Card>

        <Card>
          <div className="card-heading">
            <div><span className="eyebrow">Teaching profile</span><h2>Your subjects</h2></div>
          </div>
          <div className="tag-row large">
            {assignedSubjects.map((s) => <span key={s.subjectId}>{s.subjectCode}</span>)}
          </div>
          {assignedSubjects.length === 0 && <p className="muted">No subjects assigned yet.</p>}
          <form className="inline-form vertical-mobile" onSubmit={addSubject}>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required disabled={!profile}>
              <option value="">Select a subject…</option>
              {subjects.filter((s) => !assignedSubjects.some((a) => a.subjectId === s.subjectId))
                .map((s) => <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} — {s.subjectName}</option>)}
            </select>
            <button className="button button-secondary" disabled={!profile || busy}>Add</button>
          </form>
        </Card>
      </div>

      <Card>
        <div className="card-heading">
          <div><span className="eyebrow">Lesson delivery</span><h2>Sessions</h2></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Subject</th><th>Student</th><th>Date</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.tutoringSessionId}>
                  <td><b>{subjectName(s.subject?.subjectId)}</b></td>
                  <td>Student #{s.student?.userId}</td>
                  <td>{formatDate(s.startTime)}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    {s.status === "COMPLETED"
                      ? <button onClick={() => setReviewSession(s)}><Star size={15} /> Review</button>
                      : <button onClick={() => openDelivery(s)} disabled={s.status === "CANCELLED"}>Manage</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sessions.length === 0 && <EmptyState title="No tutoring sessions" text="Accepted bookings become scheduled sessions." />}
        </div>
      </Card>

      {showProfile && (
        <Modal title={profile ? "Edit tutor profile" : "Create tutor profile"} onClose={() => setShowProfile(false)}>
          <form className="stack-form" onSubmit={saveProfile}>
            <Field label="Tutor bio">
              <textarea rows={5} value={profileForm.bio}
                onChange={(e) => setProfileForm((c) => ({ ...c, bio: e.target.value }))} required />
            </Field>
            <div className="form-grid two">
              <Field label="Years of experience">
                <input type="number" min="0" value={profileForm.yearsExperience}
                  onChange={(e) => setProfileForm((c) => ({ ...c, yearsExperience: Number(e.target.value) }))} required />
              </Field>
              <Field label="Hourly rate (R)" hint="Enter 0 for free tutoring">
                <input type="number" min="0" step="0.01" value={profileForm.hourlyRate}
                  onChange={(e) => setProfileForm((c) => ({ ...c, hourlyRate: Number(e.target.value) }))} required />
              </Field>
            </div>
            <button className="button button-primary" disabled={busy}><Save size={18} /> Save profile</button>
          </form>
        </Modal>
      )}

      {showAvailability && (
        <Modal title="Add recurring availability" onClose={() => setShowAvailability(false)}>
          <form className="stack-form" onSubmit={addAvailability}>
            <Field label="Day">
              <select value={availability.dayOfWeek}
                onChange={(e) => setAvailability((c) => ({ ...c, dayOfWeek: e.target.value }))}>
                {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <div className="form-grid two">
              <Field label="Starts">
                <input type="time" value={availability.startTime}
                  onChange={(e) => setAvailability((c) => ({ ...c, startTime: e.target.value }))} required />
              </Field>
              <Field label="Ends">
                <input type="time" value={availability.endTime}
                  onChange={(e) => setAvailability((c) => ({ ...c, endTime: e.target.value }))} required />
              </Field>
            </div>
            <label className="check-row">
              <input type="checkbox" checked={availability.isRecurring}
                onChange={(e) => setAvailability((c) => ({ ...c, isRecurring: e.target.checked }))} />
              <span>Repeat every week</span>
            </label>
            <button className="button button-primary" disabled={busy}>Publish availability</button>
          </form>
        </Modal>
      )}

      {selectedSession && (
        <Modal title="Manage tutoring session" onClose={() => setSelectedSession(null)} wide>
          <form className="stack-form" onSubmit={saveDelivery}>
            <Field label="Session status">
              <select value={delivery.status} onChange={(e) => setDelivery((c) => ({ ...c, status: e.target.value }))}>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </Field>
            <Field label="Session notes">
              <textarea rows={3} value={delivery.sessionNotes}
                onChange={(e) => setDelivery((c) => ({ ...c, sessionNotes: e.target.value }))} />
            </Field>
            <button className="button button-primary" disabled={busy}><Save size={18} /> {busy ? "Saving…" : "Save session"}</button>
          </form>
        </Modal>
      )}

      {reviewSession && (
        <Modal title="Review the student" onClose={() => setReviewSession(null)}>
          <form className="stack-form" onSubmit={submitReview}>
            <Field label="Rating">
              <div className="rating-picker">
                {[1,2,3,4,5].map((v) => (
                  <button type="button" key={v} className={v <= review.rating ? "active" : ""}
                    onClick={() => setReview((c) => ({ ...c, rating: v }))}><Star /></button>
                ))}
              </div>
            </Field>
            <Field label="Review">
              <textarea rows={3} required value={review.comment}
                onChange={(e) => setReview((c) => ({ ...c, comment: e.target.value }))} />
            </Field>
            <Field label="Strengths">
              <input value={review.strengths}
                onChange={(e) => setReview((c) => ({ ...c, strengths: e.target.value }))} />
            </Field>
            <Field label="Areas to improve">
              <input value={review.improvements}
                onChange={(e) => setReview((c) => ({ ...c, improvements: e.target.value }))} />
            </Field>
            <label className="check-row">
              <input type="checkbox" checked={review.isPublic}
                onChange={(e) => setReview((c) => ({ ...c, isPublic: e.target.checked }))} />
              <span>Make this feedback public</span>
            </label>
            <button className="button button-primary" disabled={busy}>Submit review</button>
          </form>
        </Modal>
      )}
    </>
  );
}