import { ArrowLeft, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Brand } from "@components/Brand";
import { Loading, Notice, formatDate, money } from "@components/ui";
import {
  availability as availabilityApi, tutorProfiles, tutorReviews, tutorSubjects,
} from "@api";
import { useNotice } from "@hooks/useNotice";

export default function TutorPublicPage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notice, clear, showError } = useNotice();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [t, subs, avail, revs] = await Promise.all([
          tutorProfiles.byId(Number(id)),
          tutorSubjects.byTutorProfileId(Number(id)),
          availabilityApi.byTutorProfileId(Number(id)),
          tutorReviews.byTutorId(Number(id)),
        ]);
        setTutor(t);
        setSubjects(subs);
        setSlots(avail);
        setReviews(revs);
      } catch (cause) { showError(cause.message); }
      finally { setLoading(false); }
    })();
  }, [id, showError]);

  if (loading) return <Loading label="Loading tutor" />;
  if (!tutor) return (
    <main className="not-found"><Brand />
      <h1>Tutor not found</h1>
      <Link className="button button-primary" to="/tutors"><ArrowLeft size={18} /> Back to directory</Link>
    </main>
  );

  return (
    <div className="directory-page">
      <header className="directory-nav">
        <Brand />
        <Link to="/tutors"><ArrowLeft size={17} /> Directory</Link>
      </header>

      <main className="directory-main">
        {notice && <Notice kind={notice.kind} onClose={clear}>{notice.text}</Notice>}

        <section className="profile-summary">
          <div className="tutor-avatar large">
            {tutor.user?.name?.[0] ?? ""}{tutor.user?.surname?.[0] ?? ""}
          </div>
          <div>
            <h1>{tutor.user?.name} {tutor.user?.surname}</h1>
            <p>{tutor.bio}</p>
            <div className="rating">
              <Star size={16} /> {Number(tutor.averageRating ?? 0).toFixed(1)} ·{" "}
              {tutor.yearsExperience ?? 0} years · {money(tutor.hourlyRate)}
            </div>
          </div>
        </section>

        <section>
          <h2>Subjects</h2>
          <div className="tag-row large">
            {subjects.map((s) => (
              <span key={s.tutorSubjectId}>
                {s.subject?.subjectCode ?? `#${s.subject?.subjectId}`}
              </span>
            ))}
            {subjects.length === 0 && <p className="muted">No subjects listed.</p>}
          </div>
        </section>

        <section>
          <h2>Availability</h2>
          {slots.length === 0
            ? <p className="muted">No recurring availability yet.</p>
            : <div className="availability-list">
                {slots.map((s) => (
                  <div key={s.availabilityId} className="availability-slot">
                    <b>{s.dayOfWeek}</b>
                    <span>{formatDate(s.startTime)} – {formatDate(s.endTime)}</span>
                  </div>
                ))}
              </div>
          }
        </section>

        <section>
          <h2>Reviews</h2>
          {reviews.length === 0
            ? <p className="muted">No reviews yet.</p>
            : <div className="review-list">
                {reviews.slice(0, 8).map((r) => (
                  <blockquote key={r.tutorReviewId}>
                    <div>{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} />)}</div>
                    <p>“{r.comment}”</p>
                    <small>{formatDate(r.reviewedAt)}</small>
                  </blockquote>
                ))}
              </div>
          }
        </section>
      </main>
    </div>
  );
}