import { CalendarClock, Plus, UserRoundCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Loading, Notice, PageHeader } from "@components/ui";
import { useAuth } from "@context/AuthContext";
import {
  availability as availabilityApi,
  bookingRequests,
  subjects as subjectApi,
  tutorProfiles,
  tutorSubjects,
  tutoringSessions,
} from "@api";
import { useNotice } from "@hooks/useNotice";
import { useSubjectLookup } from "@hooks/useSubjectLookup";
import { normaliseStatus } from "@utils/bookingUtils";
import TutorStats from "./dashboard/tutor/TutorStats";
import BookingRequestsCard from "./dashboard/tutor/BookingRequestsCard";
import TutorSubjectsCard from "./dashboard/tutor/TutorSubjectsCard";
import TutorSessionsCard from "./dashboard/tutor/TutorSessionsCard";
import CreateSubjectModal from "./dashboard/tutor/CreateSubjectModal";
import TutorProfileModal from "./dashboard/tutor/TutorProfileModal";
import AvailabilityModal from "./dashboard/tutor/AvailabilityModal";
import ManageSessionModal from "./dashboard/tutor/ManageSessionModal";

export default function TutorDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [tutorSubjectLinks, setTutorSubjectLinks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [show, setShow] = useState({ profile: false, availability: false, subject: false });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { notice, setNotice, clear, showError, showSuccess } = useNotice();
  const { nameOf } = useSubjectLookup(subjects);

  const load = async () => {
    setLoading(true);
    try {
      const [subs, profiles] = await Promise.all([subjectApi.all(), tutorProfiles.byUserId(user.userId)]);
      const own = profiles[0] ?? null;
      setSubjects(subs);
      setProfile(own);
      if (own) {
        const [links, sess] = await Promise.all([
          tutorSubjects.byTutorProfileId(own.tutorProfileId),
          tutoringSessions.byTutorProfileId(own.tutorProfileId),
        ]);
        setTutorSubjectLinks(links);
        setSessions(sess);
      }
      let reqs = [];
      try {
        reqs = await bookingRequests.all();
      } catch {}
      setBookings(reqs.filter((r) => r.tutorProfile?.tutorProfileId === own?.tutorProfileId));
    } catch (cause) {
      showError(cause.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(); /* eslint-disable-next-line */
  }, []);

  const assignedSubjects = useMemo(
    () => subjects.filter((s) => tutorSubjectLinks.some((l) => l.subject?.subjectId === s.subjectId)),
    [subjects, tutorSubjectLinks],
  );

  const createSubject = async (form) => {
    setBusy(true);
    try {
      await subjectApi.create({
        ...form,
        subjectCode: form.subjectCode.toUpperCase(),
      });
      setShow((c) => ({ ...c, subject: false }));
      showSuccess("Subject created.");
      await load();
    } catch (cause) {
      showError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  const saveProfile = async (form) => {
    setBusy(true);
    try {
      const payload = {
        ...(profile ? { tutorProfileId: profile.tutorProfileId } : {}),
        user: { userId: user.userId },
        ...form,
        createdAt: profile?.createdAt ?? new Date().toISOString(),
        isVerified: profile?.isVerified ?? false,
      };
      if (profile) await tutorProfiles.update(payload);
      else await tutorProfiles.create(payload);
      setShow((c) => ({ ...c, profile: false }));
      showSuccess("Tutor profile saved.");
      await load();
    } catch (cause) {
      showError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  const addSubject = async (subjectId) => {
    if (!profile) return;
    setBusy(true);
    try {
      await tutorSubjects.create({
        tutorProfile: { tutorProfileId: profile.tutorProfileId },
        subject: { subjectId },
      });
      showSuccess("Subject added.");
      await load();
    } catch (cause) {
      showError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  const addAvailability = async (form) => {
    if (!profile) return;
    setBusy(true);
    try {
      const now = new Date();
      const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-");
      await availabilityApi.create({
        tutorProfile: { tutorProfileId: profile.tutorProfileId },
        dayOfWeek: form.dayOfWeek,
        startTime: `${today}T${form.startTime}:00`,
        endTime: `${today}T${form.endTime}:00`,
        isRecurring: form.isRecurring,
      });
      setShow((c) => ({ ...c, availability: false }));
      showSuccess("Availability published.");
    } catch (cause) {
      showError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  const respond = async (id, uiStatus) => {
    try {
      const req = bookings.find((b) => b.bookingRequestId === id);
      await bookingRequests.update({ ...req, status: normaliseStatus(uiStatus) });
      showSuccess(`Booking ${uiStatus.toLowerCase()}.`);
      await load();
    } catch (cause) {
      showError(cause.message);
    }
  };

  const saveDelivery = async (form) => {
    if (!selectedSession) return;
    setBusy(true);
    try {
      await tutoringSessions.update({
        ...selectedSession,
        ...form,
        updatedAt: new Date().toISOString(),
      });
      setSelectedSession(null);
      showSuccess("Session updated.");
      await load();
    } catch (cause) {
      showError(cause.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading label="Preparing your tutor workspace" />;

  return (
    <>
      <PageHeader
        eyebrow="Tutor workspace"
        title={`Welcome, ${user?.name ?? "Tutor"}`}
        description="Manage requests, teaching, and your operational record."
        action={
          <div className="button-row">
            <button className="button button-secondary" onClick={() => setShow((c) => ({ ...c, subject: true }))}>
              <Plus size={18} /> New subject
            </button>
            <button
              className="button button-secondary"
              disabled={!profile}
              onClick={() => setShow((c) => ({ ...c, availability: true }))}
            >
              <CalendarClock size={18} /> Add availability
            </button>
            <button className="button button-primary" onClick={() => setShow((c) => ({ ...c, profile: true }))}>
              <UserRoundCheck size={18} /> {profile ? "Edit profile" : "Create profile"}
            </button>
          </div>
        }
      />
      {notice && (
        <Notice kind={notice.kind} onClose={clear}>
          {notice.text}
        </Notice>
      )}
      {!profile && <Notice kind="info">Create your tutor profile before adding subjects or availability.</Notice>}

      <TutorStats
        pendingCount={bookings.filter((b) => b.status === "PENDING").length}
        scheduledCount={sessions.filter((s) => s.status === "SCHEDULED").length}
        subjectCount={assignedSubjects.length}
        completedCount={sessions.filter((s) => s.status === "COMPLETED").length}
      />

      <div className="dashboard-grid">
        <BookingRequestsCard bookings={bookings} subjectName={nameOf} onRespond={respond} />
        <TutorSubjectsCard
          subjects={subjects}
          assignedSubjects={assignedSubjects}
          onAdd={addSubject}
          disabled={!profile}
          busy={busy}
        />
      </div>

      <TutorSessionsCard sessions={sessions} subjectName={nameOf} onManage={setSelectedSession} />

      {show.subject && (
        <CreateSubjectModal
          busy={busy}
          onClose={() => setShow((c) => ({ ...c, subject: false }))}
          onSubmit={createSubject}
        />
      )}
      {show.profile && (
        <TutorProfileModal
          profile={profile}
          busy={busy}
          onClose={() => setShow((c) => ({ ...c, profile: false }))}
          onSubmit={saveProfile}
        />
      )}
      {show.availability && (
        <AvailabilityModal
          busy={busy}
          onClose={() => setShow((c) => ({ ...c, availability: false }))}
          onSubmit={addAvailability}
        />
      )}
      {selectedSession && (
        <ManageSessionModal
          session={selectedSession}
          busy={busy}
          onClose={() => setSelectedSession(null)}
          onSubmit={saveDelivery}
        />
      )}
    </>
  );
}
