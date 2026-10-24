import { BookOpen, CalendarCheck2, CheckCircle2, Clock3, Search, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card, EmptyState, Loading, Notice, PageHeader, StatCard, StatusBadge, formatDate,
} from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { subjects as subjectApi, tutoringSessions, bookingRequests } from "@api";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [subs, sess] = await Promise.all([
        subjectApi.all(),
        tutoringSessions.byStudentId(user.userId),
      ]);
      let reqs = [];
      try { reqs = await bookingRequests.all(); } catch { /* optional */ }
      setSubjects(subs); setSessions(sess);
      setBookings(reqs.filter((r) => r.student?.userId === user.userId));
    } catch (cause) {
      setNotice({ kind: "error", text: cause.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  const upcoming = sessions.filter((s) => s.status === "SCHEDULED" || s.status === "IN_PROGRESS");
  const completed = sessions.filter((s) => s.status === "COMPLETED");
  const subjectName = (id) => subjects.find((s) => s.subjectId === id)?.subjectName ?? `Subject ${id}`;
  const nextSession = useMemo(
    () => [...upcoming].sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)))[0],
    [upcoming]
  );

  if (loading) return <Loading label="Preparing your learning dashboard" />;

  return (
    <>
      <PageHeader
        eyebrow="Student workspace"
        title="Your learning, all connected"
        description="Manage sessions and track your progress."
        action={<Link to="/tutors" className="button button-primary"><Search size={18} /> Find a tutor</Link>}
      />

      {notice && <Notice kind={notice.kind} onClose={() => setNotice(null)}>{notice.text}</Notice>}

      <div className="stats-grid">
        <StatCard icon={<CalendarCheck2 />} label="Upcoming sessions" value={upcoming.length} tone="violet" />
        <StatCard icon={<CheckCircle2 />} label="Completed sessions" value={completed.length} tone="green" />
        <StatCard icon={<Clock3 />} label="Pending requests" value={bookings.filter((b) => b.status === "PENDING").length} tone="amber" />
        <StatCard icon={<BookOpen />} label="Subjects available" value={subjects.length} />
      </div>

      <div className="dashboard-grid">
        <Card className="span-two">
          <div className="card-heading">
            <div><span className="eyebrow">Schedule</span><h2>Upcoming sessions</h2></div>
          </div>
          {upcoming.length === 0
            ? <EmptyState
                title="No sessions scheduled"
                text="Find a tutor and request a time that works for you."
                action={<Link to="/tutors" className="button button-secondary">Browse tutors</Link>}
              />
            : <div className="session-list">{upcoming.map((s) => {
                const start = new Date(s.startTime);
                const end = new Date(s.endTime);
                const minutes = Math.round((end - start) / 60000);
                return (
                  <article className="session-row" key={s.tutoringSessionId}>
                    <div className="date-tile">
                      <b>{start.getDate()}</b>
                      <span>{start.toLocaleString("en-ZA", { month: "short" })}</span>
                    </div>
                    <div className="session-info">
                      <h3>{subjectName(s.subject?.subjectId)}</h3>
                      <p>{formatDate(s.startTime)} · {minutes} min</p>
                    </div>
                    <StatusBadge status={s.status} />
                  </article>
                );
              })}</div>
          }
        </Card>

        <Card className="next-session-card">
          <span className="eyebrow">Next up</span>
          {nextSession
            ? <>
                <div className="next-icon"><CalendarCheck2 /></div>
                <h2>{subjectName(nextSession.subject?.subjectId)}</h2>
                <p>{formatDate(nextSession.startTime)}</p>
              </>
            : <>
                <div className="next-icon"><CalendarCheck2 /></div>
                <h2>Your schedule is clear</h2>
                <p>Book a tutor whenever you are ready.</p>
              </>
          }
        </Card>
      </div>

      <Card>
        <div className="card-heading">
          <div><span className="eyebrow">History</span><h2>Recent bookings</h2></div>
        </div>
        {bookings.length === 0
          ? <EmptyState title="No booking requests" text="Your requests will be tracked here." />
          : <div className="compact-list">{bookings.slice(0, 5).map((b) => (
              <div key={b.bookingRequestId}>
                <span className="list-icon"><UsersRound /></span>
                <span>
                  <b>{subjectName(b.subject?.subjectId)}</b>
                  <small>{formatDate(b.requestedStartTime)}</small>
                </span>
                <StatusBadge status={b.status} />
              </div>
            ))}</div>
        }
      </Card>
    </>
  );
}