import { CalendarPlus } from "lucide-react";
import { Field, Notice, formatDate, money } from "@components/ui";

export default function BookingForm({
  tutor, subjectList, selectedSubjects, booking, setBooking,
  isLoggedIn, isStudent, busy, onSubmit,
}) {
  const pickSubject = (id) => {
    const found = subjectList.find((s) => s.subjectId === Number(id)) ?? null;
    setBooking((c) => ({ ...c, subject: found }));
  };

  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <span className="eyebrow">Request a session</span>
      <h3>{money(tutor.hourlyRate)} {Number(tutor.hourlyRate) === 0 ? "" : "per hour"}</h3>

      {!isLoggedIn ? (
        <Notice kind="info">Log in as a student to request this tutor.</Notice>
      ) : !isStudent ? (
        <Notice kind="info">Only student accounts can request sessions.</Notice>
      ) : (
        <>
          <Field label="Subject">
            <select
              value={booking.subject?.subjectId ?? ""}
              onChange={(e) => pickSubject(e.target.value)}
              required
            >
              <option value="">Choose a subject</option>
              {selectedSubjects.map((ts) => {
                const sid = ts.subject?.subjectId ?? ts.subjectId;
                const subject = subjectList.find((s) => s.subjectId === sid);
                return (
                  <option key={ts.tutorSubjectId} value={sid ?? ""}>
                    {subject ? `${subject.subjectCode} — ${subject.subjectName}` : `Subject #${sid ?? "?"}`}
                  </option>
                );
              })}
            </select>
          </Field>
          <Field label="Selected slot">
            <div className="selected-slot">
              {booking.requestedStartTime
                ? formatDate(booking.requestedStartTime)
                : "Pick an availability slot on the left."}
            </div>
          </Field>
          <Field label="Duration">
            <select
              value={booking.durationMinutes}
              onChange={(e) => setBooking((c) => ({ ...c, durationMinutes: Number(e.target.value) }))}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>2 hours</option>
            </select>
          </Field>
          <Field label="What do you need help with?">
            <textarea rows={4} value={booking.studentNotes}
              onChange={(e) => setBooking((c) => ({ ...c, studentNotes: e.target.value }))}
              placeholder="Describe the topic or question…" />
          </Field>
          <button className="button button-primary button-full"
            disabled={busy || !booking.subject || !booking.requestedStartTime}>
            <CalendarPlus size={18} /> {busy ? "Sending request…" : "Request session"}
          </button>
        </>
      )}
    </form>
  );
}