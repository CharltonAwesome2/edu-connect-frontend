import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./availability", () => ({
  availability: {
    byTutorProfileId: vi.fn(),
  },
}));

vi.mock("./bookingRequests", () => ({
  bookingRequests: {
    create: vi.fn(),
  },
}));

vi.mock("./subjects", () => ({
  subjects: {
    all: vi.fn(),
  },
}));

vi.mock("./tutorProfiles", () => ({
  tutorProfiles: {
    all: vi.fn(),
    byId: vi.fn(),
  },
}));

vi.mock("./tutorReviews", () => ({
  tutorReviews: {
    byTutorId: vi.fn(),
  },
}));

vi.mock("./tutorSubjects", () => ({
  tutorSubjects: {
    bySubjectId: vi.fn(),
    byTutorProfileId: vi.fn(),
  },
}));

import { availability } from "./availability";
import { bookingRequests } from "./bookingRequests";
import { marketplace } from "./marketplace";
import { subjects } from "./subjects";
import { tutorProfiles } from "./tutorProfiles";
import { tutorReviews } from "./tutorReviews";
import { tutorSubjects } from "./tutorSubjects";

describe("marketplace API facade", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("directory", () => {
    it("returns all tutors when no filters are provided", async () => {
      const mockSubjects = [{ subjectId: 1, subjectCode: "MTH101" }];
      const mockTutors = [{ tutorProfileId: 11, hourlyRate: 50 }, { tutorProfileId: 22, hourlyRate: 80 }];

      subjects.all.mockResolvedValue(mockSubjects);
      tutorProfiles.all.mockResolvedValue(mockTutors);

      const result = await marketplace.directory();

      expect(subjects.all).toHaveBeenCalledTimes(1);
      expect(tutorProfiles.all).toHaveBeenCalledTimes(1);
      expect(tutorSubjects.bySubjectId).not.toHaveBeenCalled();
      expect(result).toEqual({ subjects: mockSubjects, tutors: mockTutors });
    });

    it("filters tutors by subject and max rate", async () => {
      const mockSubjects = [{ subjectId: 1, subjectCode: "MTH101" }];
      const mockTutors = [
        { tutorProfileId: 11, hourlyRate: 50 },
        { tutorProfileId: 22, hourlyRate: 80 },
        { tutorProfileId: 33, hourlyRate: 30 },
      ];
      const subjectLinks = [
        { tutorProfile: { tutorProfileId: 11 } },
        { tutorProfileId: 22 },
      ];

      subjects.all.mockResolvedValue(mockSubjects);
      tutorProfiles.all.mockResolvedValue(mockTutors);
      tutorSubjects.bySubjectId.mockResolvedValue(subjectLinks);

      const result = await marketplace.directory({ subjectId: "7", maxRate: "60" });

      expect(tutorSubjects.bySubjectId).toHaveBeenCalledWith(7);
      expect(result).toEqual({
        subjects: mockSubjects,
        tutors: [{ tutorProfileId: 11, hourlyRate: 50 }],
      });
    });
  });

  describe("tutorDetails", () => {
    it("aggregates tutor profile, subjects, availability, and reviews", async () => {
      const tutor = { tutorProfileId: 11 };
      const tutorSubjectLinks = [{ tutorSubjectId: 1 }];
      const tutorAvailability = [{ availabilityId: 1 }];
      const tutorReviewList = [{ tutorReviewId: 1 }];

      tutorProfiles.byId.mockResolvedValue(tutor);
      tutorSubjects.byTutorProfileId.mockResolvedValue(tutorSubjectLinks);
      availability.byTutorProfileId.mockResolvedValue(tutorAvailability);
      tutorReviews.byTutorId.mockResolvedValue(tutorReviewList);

      const result = await marketplace.tutorDetails("11");

      expect(tutorProfiles.byId).toHaveBeenCalledWith(11);
      expect(tutorSubjects.byTutorProfileId).toHaveBeenCalledWith(11);
      expect(availability.byTutorProfileId).toHaveBeenCalledWith(11);
      expect(tutorReviews.byTutorId).toHaveBeenCalledWith(11);
      expect(result).toEqual({
        tutor,
        subjects: tutorSubjectLinks,
        availability: tutorAvailability,
        reviews: tutorReviewList,
      });
    });
  });

  describe("createBookingRequest", () => {
    it("applies defaults before creating a booking request", async () => {
      const payload = {
        student: { userId: 1 },
        tutorProfile: { tutorProfileId: 11 },
        subject: { subjectId: 5 },
        requestedStartTime: "2026-11-09T13:00:00Z",
      };

      bookingRequests.create.mockResolvedValue({ bookingRequestId: 99 });

      await marketplace.createBookingRequest(payload);

      expect(bookingRequests.create).toHaveBeenCalledWith({
        student: payload.student,
        tutorProfile: payload.tutorProfile,
        subject: payload.subject,
        status: "PENDING",
        requestedStartTime: payload.requestedStartTime,
        durationMinutes: 60,
        studentNotes: "",
      });
    });

    it("keeps caller-provided booking values", async () => {
      const payload = {
        student: { userId: 1 },
        tutorProfile: { tutorProfileId: 11 },
        subject: { subjectId: 5 },
        status: "APPROVED",
        requestedStartTime: "2026-11-09T14:00:00Z",
        durationMinutes: 90,
        studentNotes: "Need exam prep",
      };

      bookingRequests.create.mockResolvedValue({ bookingRequestId: 100 });

      await marketplace.createBookingRequest(payload);

      expect(bookingRequests.create).toHaveBeenCalledWith(payload);
    });
  });
});

