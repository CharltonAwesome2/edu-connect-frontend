import api from "./client";

export const bookingRequests = {
  all: () => api.get("/booking-request/all").then((r) => r.data),
  byId: (id) => api.get(`/booking-request/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/booking-request/create", payload).then((r) => r.data),
  update: (payload) => api.put("/booking-request/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/booking-request/delete/${id}`),
  byStudent: (student) => api.post("/booking-request/by-student", student).then((r) => r.data),
  byStudentId: (userId) => api.get(`/booking-request/by-student-id/${userId}`).then((r) => r.data),
  byTutorProfile: (tutorProfile) => api.post("/booking-request/by-tutor-profile", tutorProfile).then((r) => r.data),
  bySubject: (subject) => api.post("/booking-request/by-subject", subject).then((r) => r.data),
  byStatus: (status) => api.get(`/booking-request/by-status/${status}`).then((r) => r.data),
  byStudentAndStatus: (student, status) =>
    api.post("/booking-request/by-student-and-status", student, { params: { status } }).then((r) => r.data),
  byTutorProfileAndStatus: (tutorProfile, status) =>
    api.post("/booking-request/by-tutor-profile-and-status", tutorProfile, { params: { status } }).then((r) => r.data),
  byStartTimeBetween: (start, end) =>
    api.get("/booking-request/by-start-time-between", { params: { start, end } }).then((r) => r.data),
  updateStatus: (id, status) =>
    api.patch(`/booking-request/${id}/status`, null, { params: { status } }).then((r) => r.data),
};
