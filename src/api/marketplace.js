import { availability } from "./availability";
import { bookingRequests } from "./bookingRequests";
import { subjects } from "./subjects";
import { tutorProfiles } from "./tutorProfiles";
import { tutorReviews } from "./tutorReviews";
import { tutorSubjects } from "./tutorSubjects";

const normalizeId = (value) => Number(value);

export const marketplace = {
  directory: async ({ subjectId = "", maxRate = "" } = {}) => {
    const [subjectList, profiles] = await Promise.all([subjects.all(), tutorProfiles.all()]);

    let tutors = profiles;
    if (subjectId) {
      const links = await tutorSubjects.bySubjectId(normalizeId(subjectId));
      const profileIds = new Set(links.map((link) => link.tutorProfile?.tutorProfileId ?? link.tutorProfileId));
      tutors = tutors.filter((profile) => profileIds.has(profile.tutorProfileId));
    }

    if (maxRate) {
      tutors = tutors.filter((profile) => Number(profile.hourlyRate) <= Number(maxRate));
    }

    return { subjects: subjectList, tutors };
  },

  tutorDetails: async (tutorProfileId) => {
    const id = normalizeId(tutorProfileId);
    const [tutor, tutorSubjectLinks, tutorAvailability, tutorReviewList] = await Promise.all([
      tutorProfiles.byId(id),
      tutorSubjects.byTutorProfileId(id),
      availability.byTutorProfileId(id),
      tutorReviews.byTutorId(id),
    ]);

    return {
      tutor,
      subjects: tutorSubjectLinks,
      availability: tutorAvailability,
      reviews: tutorReviewList,
    };
  },

  createBookingRequest: (payload) =>
    bookingRequests.create({
      student: payload.student,
      tutorProfile: payload.tutorProfile,
      subject: payload.subject,
      status: payload.status ?? "PENDING",
      requestedStartTime: payload.requestedStartTime,
      durationMinutes: payload.durationMinutes ?? 60,
      studentNotes: payload.studentNotes ?? "",
    }),
};

