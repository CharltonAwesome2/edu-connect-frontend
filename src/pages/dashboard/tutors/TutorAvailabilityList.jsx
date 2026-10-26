import { StatusBadge, formatDate } from "@components/ui";

export default function TutorAvailabilityList({ availability, pickedStartTime, onPick, canPick }) {
  if (!availability.length) return <p className="muted">No recurring availability has been listed yet.</p>;
  return (
    <div className="availability-list">
      {availability.map((slot) => {
        const isPicked = pickedStartTime === slot.startTime;
        return (
          <button
            key={slot.availabilityId}
            type="button"
            className={`availability-slot ${isPicked ? "selected" : ""}`}
            onClick={() => canPick && onPick(slot)}
            disabled={!canPick}
            title={canPick ? "Pick this slot" : "Only students can book"}
          >
            <b>{slot.dayOfWeek}</b>
            <span>{formatDate(slot.startTime)} – {formatDate(slot.endTime)}</span>
            {slot.isRecurring && <StatusBadge status="Recurring" />}
          </button>
        );
      })}
    </div>
  );
}