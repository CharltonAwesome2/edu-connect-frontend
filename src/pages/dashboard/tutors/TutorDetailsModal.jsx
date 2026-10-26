import { Star } from "lucide-react";
import { Modal } from "@components/ui";
import TutorAvailabilityList from "./TutorAvailabilityList";
import TutorReviewsList from "./TutorReviewsList";
import BookingForm from "./BookingForm";

export default function TutorDetailsModal({
  tutor, onClose,
  availability, reviews, selectedSubjects, subjectList,
  booking, setBooking, isLoggedIn, isStudent, busy, onBook, onPickSlot,
}) {
  return (
    <Modal title={`${tutor.user?.name ?? ""} ${tutor.user?.surname ?? ""}`} onClose={onClose} wide>
      <div className="tutor-modal-grid">
        <div>
          <div className="profile-summary">
            <div className="tutor-avatar large">
              {tutor.user?.name?.[0] ?? ""}{tutor.user?.surname?.[0] ?? ""}
            </div>
            <div>
              <h3>{tutor.user?.name} {tutor.user?.surname}</h3>
              <p>{tutor.bio}</p>
              <div className="rating">
                <Star size={16} /> {Number(tutor.averageRating ?? 0).toFixed(1)} ·{" "}
                {tutor.yearsExperience ?? 0} years
              </div>
            </div>
          </div>
          <h3 className="section-title">Availability</h3>
          <TutorAvailabilityList
            availability={availability}
            pickedStartTime={booking.requestedStartTime}
            onPick={onPickSlot}
            canPick={isStudent}
          />
          <h3 className="section-title">Student reviews</h3>
          <TutorReviewsList reviews={reviews} />
        </div>
        <BookingForm
          tutor={tutor}
          subjectList={subjectList}
          selectedSubjects={selectedSubjects}
          booking={booking}
          setBooking={setBooking}
          isLoggedIn={isLoggedIn}
          isStudent={isStudent}
          busy={busy}
          onSubmit={onBook}
        />
      </div>
    </Modal>
  );
}