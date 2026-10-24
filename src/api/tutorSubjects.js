import api from "./client";

export const tutorSubjects = {
  all: () => api.get("/tutor-subject/all").then((r) => r.data),
  byId: (id) => api.get(`/tutor-subject/read/${id}`).then((r) => r.data),
  byTutorProfileId: (tutorProfileId) =>
    api.get(`/tutor-subject/by-tutor-profile-id/${tutorProfileId}`).then((r) => r.data),
  bySubjectId: (subjectId) =>
    api.get(`/tutor-subject/by-subject-id/${subjectId}`).then((r) => r.data),
  byTutorProfile: (tutorProfile) =>
    api.post("/tutor-subject/by-tutor-profile", tutorProfile).then((r) => r.data),
  bySubject: (subject) =>
    api.post("/tutor-subject/by-subject", subject).then((r) => r.data),
  create: (payload) =>
    api.post("/tutor-subject/create", payload).then((r) => r.data),
  update: (payload) =>
    api.put("/tutor-subject/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/tutor-subject/delete/${id}`),
};