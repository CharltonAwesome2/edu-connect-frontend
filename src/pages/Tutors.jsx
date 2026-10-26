import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brand } from "@components/Brand";
import { Notice } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import {
  availability as availabilityApi,
  bookingRequests,
  subjects as subjectApi,
  tutorProfiles,
  tutorReviews,
  tutorSubjects,
} from "@api";
import { useNotice } from "@hooks/useNotice";
import TutorFilters from "./dashboard/tutors/TutorFilters";
import TutorGrid from "./dashboard/tutors/TutorGrid";
import TutorDetailsModal from "./dashboard/tutors/TutorDetailsModal";

const emptyBooking = (user, tutor) => ({
  student: user ?? null,
  tutorProfile: tutor,
  subject: null,
  status: "PENDING",
  requestedStartTime: "",
  durationMinutes: 60,
  studentNotes: "",
});

export default function Tutors() {
  const { isLoggedIn, isStudent, user } = useAuth();
  const [subjectList, setSubjectList] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [booking, setBooking] = useState(emptyBooking(null, null));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, setNotice, clear, showError, showSuccess } = useNotice();

  const load = async () => {
    setLoading(true);
    try {
      const [subs, profiles] = await Promise.all([subjectApi.all(), tutorProfiles.all()]);
      setSubjectList(subs);
      let filtered = profiles;
      if (subjectId) {
        const links = await tutorSubjects.bySubjectId(Number(subjectId));
        const ids = new Set(links.map((l) => l.tutorProfile?.tutorProfileId ?? l.tutorProfileId));
        filtered = filtered.filter((p) => ids.has(p.tutorProfileId));
      }
      if (maxRate) filtered = filtered.filter((p) => Number(p.hourlyRate) <= Number(maxRate));
      setTutors(filtered);
    } catch (cause) {
      showError(cause.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(); /* eslint-disable-next-line */
  }, []);

  const openTutor = async (tutor) => {
    setSelected(tutor);
    setBooking(emptyBooking(user, tutor));
    try {
      const [subs, avail, revs] = await Promise.all([
        tutorSubjects.byTutorProfileId(tutor.tutorProfileId),
        availabilityApi.byTutorProfileId(tutor.tutorProfileId),
        tutorReviews.byTutorId(tutor.tutorProfileId),
      ]);
      setSelectedSubjects(subs);
      setAvailability(avail);
      setReviews(revs);
    } catch (cause) {
      showError(cause.message);
    }
  };

  const pickSlot = (slot) => setBooking((c) => ({ ...c, requestedStartTime: slot.startTime }));

  const book = async (e) => {
    e.preventDefault();
    if (!booking.subject) return setNotice({ kind: "error", text: "Choose a subject." });
    if (!booking.requestedStartTime) return setNotice({ kind: "error", text: "Pick an availability slot." });
    setBusy(true);
    try {
      await bookingRequests.create({
        student: booking.student,
        tutorProfile: booking.tutorProfile,
        subject: booking.subject,
        status: booking.status,
        requestedStartTime: booking.requestedStartTime,
        durationMinutes: booking.durationMinutes,
        studentNotes: booking.studentNotes,
      });
      showSuccess("Your request was sent.");
      setSelected(null);
    } catch (cause) {
      showError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="directory-page">
      <header className="directory-nav">
        <Brand />
        <Link to="/">
          <ArrowLeft size={17} /> Home
        </Link>
        {isLoggedIn ? (
          <span className="signed-in">Signed in as {user?.name}</span>
        ) : (
          <Link className="button button-primary" to="/login">
            Log in to book
          </Link>
        )}
      </header>

      <main className="directory-main">
        <div className="directory-heading">
          <span className="eyebrow">Tutor directory</span>
          <h1>Find someone who understands how you learn.</h1>
          <p>Compare subjects, experience, ratings and rates.</p>
        </div>
        {notice && (
          <Notice kind={notice.kind} onClose={clear}>
            {notice.text}
          </Notice>
        )}

        <TutorFilters
          subjectList={subjectList}
          subjectId={subjectId}
          setSubjectId={setSubjectId}
          maxRate={maxRate}
          setMaxRate={setMaxRate}
          onSubmit={(e) => {
            e.preventDefault();
            void load();
          }}
        />

        <TutorGrid loading={loading} tutors={tutors} onOpen={openTutor} />
      </main>

      {selected && (
        <TutorDetailsModal
          tutor={selected}
          onClose={() => setSelected(null)}
          availability={availability}
          reviews={reviews}
          selectedSubjects={selectedSubjects}
          subjectList={subjectList}
          booking={booking}
          setBooking={setBooking}
          isLoggedIn={isLoggedIn}
          isStudent={isStudent}
          busy={busy}
          onBook={book}
          onPickSlot={pickSlot}
        />
      )}
    </div>
  );
}
