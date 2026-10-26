import { Link } from "react-router-dom";
import { Card, EmptyState, StatusBadge, formatDate } from "@components/ui";
import { durationMinutes } from "@utils/sessionUtils";

export default function UpcomingSessionsCard({ sessions, subjectName }) {
  return (
    <Card className="span-two">
      <div className="card-heading">
        <div><span className="eyebrow">Schedule</span><h2>Upcoming sessions</h2></div>
      </div>
      {sessions.length === 0 ? (
        <EmptyState
          title="No sessions scheduled"
          text="Find a tutor and request a time that works for you."
          action={<Link to="/tutors" className="button button-secondary">Browse tutors</Link>}
        />
      ) : (
        <div className="session-list">
          {sessions.map((s) => {
            const start = new Date(s.startTime);
            return (
              <article className="session-row" key={s.tutoringSessionId}>
                <div className="date-tile">
                  <b>{start.getDate()}</b>
                  <span>{start.toLocaleString("en-ZA", { month: "short" })}</span>
                </div>
                <div className="session-info">
                  <h3>{subjectName(s.subject?.subjectId)}</h3>
                  <p>{formatDate(s.startTime)} · {durationMinutes(s)} min</p>
                </div>
                <StatusBadge status={s.status} />
              </article>
            );
          })}
        </div>
      )}
    </Card>
  );
}