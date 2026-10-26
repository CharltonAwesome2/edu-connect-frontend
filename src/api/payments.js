import api from "./client";

export const payments = {
  all: () => api.get("/payment/all").then((r) => r.data),
  byId: (id) => api.get(`/payment/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/payment/create", payload).then((r) => r.data),
  update: (payload) => api.put("/payment/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/payment/delete/${id}`),

  bySession: (session) => api.post("/payment/by-session", session).then((r) => r.data),
  byTransactionReference: (reference) => api.get(`/payment/by-transaction-reference/${reference}`).then((r) => r.data),
  existsByTransactionReference: (reference) =>
    api.get("/payment/exists-by-transaction-reference", { params: { reference } }).then((r) => r.data),
  byStatus: (status) => api.get(`/payment/by-status/${status}`).then((r) => r.data),
  byPaymentMethod: (method) => api.get(`/payment/by-payment-method/${method}`).then((r) => r.data),
  byPaidAtBetween: (start, end) =>
    api.get("/payment/by-paid-at-between", { params: { start, end } }).then((r) => r.data),
  byStudentId: (userId) => api.get(`/payment/by-student-id/${userId}`).then((r) => r.data),
  byTutorProfileId: (tutorProfileId) => api.get(`/payment/by-tutor-profile-id/${tutorProfileId}`).then((r) => r.data),

  updateStatus: (id, status) => api.patch(`/payment/${id}/status`, null, { params: { status } }).then((r) => r.data),
  markPaid: (id, method, reference) =>
    api.put(`/payment/${id}/pay`, null, { params: { method, reference } }).then((r) => r.data),
};
