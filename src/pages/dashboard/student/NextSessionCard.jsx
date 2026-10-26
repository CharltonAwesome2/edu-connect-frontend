import { CalendarCheck2 } from "lucide-react";
import { Card, formatDate } from "@components/ui";

export default function NextSessionCard({ nextSession, subjectName }) {
  return (
    <Card className="next-session-card">
      <span className="eyebrow">Next up</span>
      <div className="next-icon"><CalendarCheck2 /></div>
      {nextSession ? (
        <>
          <h2>{subjectName(nextSession.subject?.subjectId)}</h2>
          <p>{formatDate(nextSession.startTime)}</p>
        </>
      ) : (
        <>
          <h2>Your schedule is clear</h2>
          <p>Book a tutor whenever you are ready.</p>
        </>
      )}
    </Card>
  );
}