import { CalendarClock, Check, X } from "lucide-react";
import { Card, EmptyState, formatDate } from "@components/ui";

export default function BookingRequestsCard({ bookings, subjectName, onRespond }) {
  const pending = bookings.filter((b) => b.status === "PENDING");
  return (
    <Card className="span-two">
      <div className="card-heading">
        <div><span className="eyebrow">Action needed</span><h2>Booking requests</h2></div>
      </div>
      {pending.length === 0 ? (
        <EmptyState title="No pending requests" text="New student requests will appear here." />
      ) : (
        <div className="request-list">
          {pending.map((b) => (
            <article key={b.bookingRequestId}>
              <div className="request-icon"><CalendarClock /></div>
              <div>
                <h3>{subjectName(b.subject?.subjectId)}</h3>
                <p>{formatDate(b.requestedStartTime)} · {b.durationMinutes} min</p>
                <small>{b.studentNotes || "No notes from the student."}</small>
              </div>
              <div className="request-actions">
                <button className="button button-success" onClick={() => onRespond(b.bookingRequestId, "APPROVED")}>
                  <Check size={17} /> Accept
                </button>
                <button className="button button-danger" onClick={() => onRespond(b.bookingRequestId, "DECLINED")}>
                  <X size={17} /> Decline
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}