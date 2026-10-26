import { CalendarCheck2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loading, Notice, PageHeader } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import { bookingRequests, subjects as subjectApi, tutorReviews, tutoringSessions } from "@api";
import { useNotice } from "@hooks/useNotice";
import { useSubjectLookup } from "@hooks/useSubjectLookup";
import { isCompleted, isUpcoming, sortByStartTime } from "@utils/sessionUtils";
import StudentStats from "./dashboard/student/StudentStats";
import UpcomingSessionsCard from "./dashboard/student/UpcomingSessionsCard";
import NextSessionCard from "./dashboard/student/NextSessionCard";
import RecentBookingsCard from "./dashboard/student/RecentBookingsCard";
import CompletedSessionsCard from "./dashboard/student/CompletedSessionsCard";
import ReviewTutorModal from "./dashboard/student/ReviewTutorModal";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [reviewSession, setReviewSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, setNotice, clear, showError, showSuccess } = useNotice();
  const { nameOf } = useSubjectLookup(subjects);

  const load = async () => {
    setLoading(true);
    try {
      const [subs, sess] = await Promise.all([subjectApi.all(), tutoringSessions.byStudentId(user.userId)]);
      let reqs = [];
      try {
        reqs = await bookingRequests.all();
      } catch {}
      let revs = [];
      try {
        revs = (await tutorReviews.all()).filter((r) => r.student?.userId === user.userId);
      } catch {}
      setSubjects(subs);
      setSessions(sess);
      setBookings(reqs.filter((r) => r.student?.userId === user.userId));
      setMyReviews(revs);
    } catch (cause) {
      showError(cause.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(); /* eslint-disable-next-line */
  }, []);

  const upcoming = useMemo(() => sortByStartTime(sessions.filter(isUpcoming)), [sessions]);
  const completed = useMemo(() => sessions.filter(isCompleted), [sessions]);
  const nextSession = upcoming[0];
  const hasReviewed = (sessionId) => myReviews.some((r) => r.session?.tutoringSessionId === sessionId);

  const submitReview = async (review) => {
    if (!reviewSession) return;
    setBusy(true);
    try {
      await tutorReviews.create({
        session: { tutoringSessionId: reviewSession.tutoringSessionId },
        student: { userId: user.userId },
        tutorProfile: reviewSession.tutorProfile,
        ...review,
        reviewedAt: new Date().toISOString(),
      });
      setReviewSession(null);
      showSuccess("Review saved.");
      await load();
    } catch (cause) {
      showError(
        /uq_rev_session|Duplicate entry/.test(cause.message) ? "You've already reviewed this session." : cause.message,
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading label="Preparing your learning dashboard" />;

  return (
    <>
      <PageHeader
        eyebrow="Student workspace"
        title="Your learning, all connected"
        description="Manage sessions and track your progress."
        action={
          <Link to="/tutors" className="button button-primary">
            <Search size={18} /> Find a tutor
          </Link>
        }
      />
      {notice && (
        <Notice kind={notice.kind} onClose={clear}>
          {notice.text}
        </Notice>
      )}
      <StudentStats
        upcoming={upcoming.length}
        completed={completed.length}
        pendingCount={bookings.filter((b) => b.status === "PENDING").length}
        subjectCount={subjects.length}
      />
      <div className="dashboard-grid">
        <UpcomingSessionsCard sessions={upcoming} subjectName={nameOf} />
        <NextSessionCard nextSession={nextSession} subjectName={nameOf} />
      </div>
      <RecentBookingsCard bookings={bookings} subjectName={nameOf} />
      <CompletedSessionsCard
        sessions={completed}
        subjectName={nameOf}
        hasReviewed={hasReviewed}
        onReview={setReviewSession}
      />
      {reviewSession && (
        <ReviewTutorModal
          session={reviewSession}
          busy={busy}
          onClose={() => setReviewSession(null)}
          onSubmit={submitReview}
        />
      )}
    </>
  );
}
