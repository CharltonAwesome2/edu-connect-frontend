import { UsersRound } from "lucide-react";
import { Card, EmptyState, StatusBadge, formatDate } from "@components/ui";

export default function RecentBookingsCard({ bookings, subjectName }) {
  return (
    <Card>
      <div className="card-heading">
        <div><span className="eyebrow">History</span><h2>Recent bookings</h2></div>
      </div>
      {bookings.length === 0 ? (
        <EmptyState title="No booking requests" text="Your requests will be tracked here." />
      ) : (
        <div className="compact-list">
          {bookings.slice(0, 5).map((b) => (
            <div key={b.bookingRequestId}>
              <span className="list-icon"><UsersRound /></span>
              <span>
                <b>{subjectName(b.subject?.subjectId)}</b>
                <small>{formatDate(b.requestedStartTime)}</small>
              </span>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}