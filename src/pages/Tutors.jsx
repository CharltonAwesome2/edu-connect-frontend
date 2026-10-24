import { ArrowLeft, CalendarPlus, Clock3, GraduationCap, Search, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brand } from "@components/Brand";
import {
  EmptyState, Field, Loading, Modal, Notice, StatusBadge, formatDate, money,
} from "@components/ui";
import { useAuth } from "@context/AuthContext";
import {
  subjects as subjectApi, tutorProfiles, tutorSubjects,
  availability as availabilityApi, tutorReviews, bookingRequests,
} from "@api";

function localDateTimeMinimum() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export default function Tutors() {
  const { isLoggedIn, isStudent, user } = useAuth();
  const [subjectList, setSubjectList] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [booking, setBooking] = useState({
    subjectId: "", requestedStartTime: "", durationMinutes: 60, studentNotes: "",
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [subs, profiles] = await Promise.all([subjectApi.all(), tutorProfiles.all()]);
      setSubjectList(subs);

      let filtered = profiles;
      if (subjectId) {
        const links = await tutorSubjects.bySubjectId(Number(subjectId));
        const ids = new Set(links.map((l) => l.tutorProfile?.tutorProfileId));
        filtered = filtered.filter((p) => ids.has(p.tutorProfileId));
      }
      if (maxRate) filtered = filtered.filter((p) => Number(p.hourlyRate) <= Number(maxRate));
      setTutors(filtered);
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  const openTutor = async (tutor) => {
    setSelected(tutor);
    setBooking({ subjectId: "", requestedStartTime: "", durationMinutes: 60, studentNotes: "" });
    try {
      const [subs, avail, revs] = await Promise.all([
        tutorSubjects.byTutorProfileId(tutor.tutorProfileId),
        availabilityApi.byTutorProfileId(tutor.tutorProfileId),
        tutorReviews.byTutorId(tutor.tutorProfileId),
      ]);
      setSelectedSubjects(subs);
      setAvailability(avail);
      setReviews(revs.filter((r) => r.isPublic));
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    }
  };

  const book = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setBusy(true); setNotice(null);
    try {
      await bookingRequests.create({
        student: { userId: user.userId },
        tutorProfile: { tutorProfileId: selected.tutorProfileId },
        subject: { subjectId: Number(booking.subjectId) },
        status: "PENDING",
        requestedStartTime: `${booking.requestedStartTime}:00`,
        durationMinutes: booking.durationMinutes,
        studentNotes: booking.studentNotes,
      });
      setNotice({ kind: "success", text: "Your request was sent." });
      setSelected(null);
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="directory-page">
      <header className="directory-nav">
        <Brand />
        <Link to="/"><ArrowLeft size={17} /> Home</Link>
        {isLoggedIn
          ? <span className="signed-in">Signed in as {user?.name}</span>
          : <Link className="button button-primary" to="/login">Log in to book</Link>}
      </header>

      <main className="directory-main">
        <div className="directory-heading">
          <span className="eyebrow">Tutor directory</span>
          <h1>Find someone who understands how you learn.</h1>
          <p>Compare subjects, experience, ratings and rates.</p>
        </div>

        {notice && <Notice kind={notice.kind} onClose={() => setNotice(null)}>{notice.text}</Notice>}

        <form className="filter-bar" onSubmit={(e) => { e.preventDefault(); void load(); }}>
          <div className="input-icon">
            <Search size={18} />
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">All subjects</option>
              {subjectList.map((s) => <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>)}
            </select>
          </div>
          <Field label="Maximum hourly rate">
            <input type="number" min="0" step="10" placeholder="Any rate" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} />
          </Field>
          <button className="button button-primary">Search tutors</button>
        </form>

        {loading ? <Loading label="Finding tutors" /> :
          tutors.length === 0 ? <EmptyState title="No tutors match these filters" text="Try another subject or a higher maximum rate." /> :
          <div className="tutor-grid">
            {tutors.map((t) => (
              <article className="tutor-card" key={t.tutorProfileId}>
                <div className="tutor-head">
                  <div className="tutor-avatar">
                    {(t.user?.name?.[0] ?? "")}{(t.user?.surname?.[0] ?? "")}
                  </div>
                  <div>
                    <h2>{t.user?.name} {t.user?.surname}</h2>
                    <span><GraduationCap size={15} /> {t.isVerified ? "Verified tutor" : "Peer tutor"}</span>
                  </div>
                  <div className="rating"><Star size={16} /> {Number(t.averageRating ?? 0).toFixed(1)}</div>
                </div>
                <p>{t.bio}</p>
                <div className="tutor-facts">
                  <span><Users /> {t.yearsExperience ?? 0} years experience</span>
                  <span><Clock3 /> Flexible schedule</span>
                </div>
                <footer>
                  <div>
                    <strong>{money(t.hourlyRate)}</strong>
                    <span>{Number(t.hourlyRate) === 0 ? "community support" : "per hour"}</span>
                  </div>
                  <button className="button button-secondary" onClick={() => void openTutor(t)}>View & book</button>
                </footer>
              </article>
            ))}
          </div>
        }
      </main>

      {selected && (
        <Modal title={`${selected.user?.name ?? ""} ${selected.user?.surname ?? ""}`} onClose={() => setSelected(null)} wide>
          <div className="tutor-modal-grid">
            <div>
              <div className="profile-summary">
                <div className="tutor-avatar large">
                  {(selected.user?.name?.[0] ?? "")}{(selected.user?.surname?.[0] ?? "")}
                </div>
                <div>
                  <h3>{selected.user?.name} {selected.user?.surname}</h3>
                  <p>{selected.bio}</p>
                  <div className="rating">
                    <Star size={16} /> {Number(selected.averageRating ?? 0).toFixed(1)} · {selected.yearsExperience ?? 0} years
                  </div>
                </div>
              </div>

              <h3 className="section-title">Availability</h3>
              {availability.length
                ? <div className="availability-list">{availability.map((slot) => (
                    <div key={slot.availabilityId}>
                      <b>{slot.dayOfWeek}</b>
                      <span>{formatDate(slot.startTime)} – {formatDate(slot.endTime)}</span>
                      {slot.isRecurring && <StatusBadge status="Recurring" />}
                    </div>
                  ))}</div>
                : <p className="muted">No recurring availability has been listed yet.</p>}

              <h3 className="section-title">Student reviews</h3>
              {reviews.length
                ? <div className="review-list">{reviews.slice(0, 3).map((r) => (
                    <blockquote key={r.tutorReviewId}>
                      <div>{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} />)}</div>
                      <p>“{r.comment}”</p>
                      <small>{formatDate(r.reviewedAt)}</small>
                    </blockquote>
                  ))}</div>
                : <p className="muted">No public reviews yet.</p>}
            </div>

            <form className="booking-form" onSubmit={book}>
              <span className="eyebrow">Request a session</span>
              <h3>{money(selected.hourlyRate)} {Number(selected.hourlyRate) === 0 ? "" : "per hour"}</h3>

              {!isLoggedIn
                ? <Notice kind="info">Log in as a student to request this tutor.</Notice>
                : !isStudent
                  ? <Notice kind="info">Only student accounts can request sessions.</Notice>
                  : <>
                      <Field label="Subject">
                        <select
                          value={booking.subjectId}
                          onChange={(e) => setBooking((c) => ({ ...c, subjectId: e.target.value }))}
                          required
                        >
                          <option value="">Choose a subject</option>
                          {selectedSubjects.map((ts) => (
                            <option key={ts.tutorSubjectId} value={ts.subject?.subjectId}>
                              {ts.subject?.subjectName}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Preferred date and time">
                        <input
                          type="datetime-local"
                          min={localDateTimeMinimum()}
                          value={booking.requestedStartTime}
                          onChange={(e) => setBooking((c) => ({ ...c, requestedStartTime: e.target.value }))}
                          required
                        />
                      </Field>

                      <Field label="Duration">
                        <select
                          value={booking.durationMinutes}
                          onChange={(e) => setBooking((c) => ({ ...c, durationMinutes: Number(e.target.value) }))}
                        >
                          <option value={30}>30 minutes</option>
                          <option value={60}>60 minutes</option>
                          <option value={90}>90 minutes</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </Field>

                      <Field label="What do you need help with?">
                        <textarea
                          rows={4}
                          value={booking.studentNotes}
                          onChange={(e) => setBooking((c) => ({ ...c, studentNotes: e.target.value }))}
                          placeholder="Describe the topic or question…"
                        />
                      </Field>

                      <button className="button button-primary button-full" disabled={busy || !booking.subjectId}>
                        <CalendarPlus size={18} /> {busy ? "Sending request…" : "Request session"}
                      </button>
                    </>
              }
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}