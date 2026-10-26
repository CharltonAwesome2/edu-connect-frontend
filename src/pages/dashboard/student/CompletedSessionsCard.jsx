import { Star } from "lucide-react";
import { Card, EmptyState, StatusBadge, formatDate } from "@components/ui";

export default function CompletedSessionsCard({
  sessions, subjectName, hasReviewed, onReview,
}) {
  return (
    <Card>
      <div className="card-heading">
        <div><span className="eyebrow">Progress record</span><h2>Completed sessions</h2></div>
      </div>
      {sessions.length === 0 ? (
        <EmptyState
          title="No completed sessions yet"
          text="Once a session finishes, you'll be able to review your tutor here."
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Subject</th><th>Date</th><th>Tutor</th><th>Status</th><th />
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.tutoringSessionId}>
                  <td><b>{subjectName(s.subject?.subjectId)}</b></td>
                  <td>{formatDate(s.startTime)}</td>
                  <td>
                    {s.tutorProfile?.user?.name
                      ? `${s.tutorProfile.user.name} ${s.tutorProfile.user.surname ?? ""}`.trim()
                      : `Tutor #${s.tutorProfile?.tutorProfileId ?? "?"}`}
                  </td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    {hasReviewed(s.tutoringSessionId) ? (
                      <span className="muted">Reviewed</span>
                    ) : (
                      <button onClick={() => onReview(s)}>
                        <Star size={15} /> Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}