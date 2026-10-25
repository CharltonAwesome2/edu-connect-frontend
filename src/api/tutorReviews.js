import api from "./client";

export const tutorReviews = {
  all: () => api.get("/tutor-review/all").then((r) => r.data),
  byId: (id) => api.get(`/tutor-review/read/${id}`).then((r) => r.data),
  byTutorId: (id) => api.get(`/tutor-review/by-tutor-id/${id}`).then((r) => r.data),
  byStudentId: (id) => api.get(`/tutor-review/by-student-id/${id}`).then((r) => r.data),
  create: (payload) => api.post("/tutor-review/create", payload).then((r) => r.data),
  update: (payload) => api.put("/tutor-review/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/tutor-review/delete/${id}`),
  bySession: (session) => api.post("/tutor-review/by-session", session).then((r) => r.data),
  existsBySession: (session) => api.post("/tutor-review/exists-by-session", session).then((r) => r.data),
  byStudent: (student) => api.post("/tutor-review/by-student", student).then((r) => r.data),
  byTutorProfile: (tutorProfile) => api.post("/tutor-review/by-tutor-profile", tutorProfile).then((r) => r.data),
  publicByTutorProfile: (tutorProfile) =>
    api.post("/tutor-review/public-by-tutor-profile", tutorProfile).then((r) => r.data),
  byTutorProfileMinRating: (tutorProfile, minRating) =>
    api.post("/tutor-review/by-tutor-profile-min-rating", tutorProfile, { params: { minRating } }).then((r) => r.data),
  averageRating: (tutorProfile) => api.post("/tutor-review/average-rating", tutorProfile).then((r) => r.data),
  countByTutorProfile: (tutorProfile) =>
    api.post("/tutor-review/count-by-tutor-profile", tutorProfile).then((r) => r.data),
};
