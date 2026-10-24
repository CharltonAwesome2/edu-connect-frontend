import api from "./client";

export const tutoringSessions = {
  all: () => api.get("/tutoring-session/all").then((r) => r.data),
  byId: (id) => api.get(`/tutoring-session/read/${id}`).then((r) => r.data),
  byTutorProfileId: (tutorProfileId) =>
    api.get(`/tutoring-session/by-tutor-profile-id/${tutorProfileId}`).then((r) => r.data),
  byTutorProfile: (tutorProfile) =>
    api.post("/tutoring-session/by-tutor-profile", tutorProfile).then((r) => r.data),
  byStudentId: (studentId) =>
    api.get(`/tutoring-session/by-student-id/${studentId}`).then((r) => r.data),
  byStudent: (student) =>
    api.post("/tutoring-session/by-student", student).then((r) => r.data),
  create: (payload) =>
    api.post("/tutoring-session/create", payload).then((r) => r.data),
  update: (payload) =>
    api.put("/tutoring-session/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/tutoring-session/delete/${id}`),
};