import api from "./client";

export const tutorReviews = {
  all: () => api.get("/tutor-review/all").then((r) => r.data),
  byId: (id) => api.get(`/tutor-review/read/${id}`).then((r) => r.data),
  byTutorId: (id) => api.get(`/tutor-review/by-tutor-id/${id}`).then((r) => r.data),
  byStudentId: (id) =>
    api.get(`/tutor-review/by-student-id/${id}`).then((r) => r.data),
  create: (payload) =>
    api.post("/tutor-review/create", payload).then((r) => r.data),
  update: (payload) =>
    api.put("/tutor-review/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/tutor-review/delete/${id}`),
};