import { Card, EmptyState, StatusBadge, formatDate } from "@components/ui";

export default function TutorSessionsCard({ sessions, subjectName, onManage }) {
  return (
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
                  {s.status !== "COMPLETED" && s.status !== "CANCELLED" ? (
                    <button onClick={() => onManage(s)}>Manage</button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sessions.length === 0 && (
          <EmptyState
            title="No tutoring sessions"
            text="Accepted bookings become scheduled sessions."
          />
        )}
      </div>
    </Card>
  );
}