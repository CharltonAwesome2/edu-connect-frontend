import api from "./client";

export const reports = {
  all: () => api.get("/report/all").then((r) => r.data),
  byId: (id) => api.get(`/report/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/report/create", payload).then((r) => r.data),
  update: (payload) => api.put("/report/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/report/delete/${id}`),
  byReporter: (reporter) => api.post("/report/by-reporter", reporter).then((r) => r.data),
  byReporterId: (userId) => api.get(`/report/by-reporter-id/${userId}`).then((r) => r.data),
  byReportedUser: (user) => api.post("/report/by-reported-user", user).then((r) => r.data),
  byReportedUserId: (userId) => api.get(`/report/by-reported-user-id/${userId}`).then((r) => r.data),
  bySession: (session) => api.post("/report/by-session", session).then((r) => r.data),
  byStatus: (status) => api.get(`/report/by-status/${status}`).then((r) => r.data),
  byReportedAtBetween: (start, end) =>
    api.get("/report/by-reported-at-between", { params: { start, end } }).then((r) => r.data),
  countByReportedUserId: (userId) => api.get(`/report/count-by-reported-user-id/${userId}`).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/report/${id}/status`, null, { params: { status } }).then((r) => r.data),
  resolve: (id, finalStatus) =>
    api.patch(`/report/${id}/resolve`, null, { params: { finalStatus } }).then((r) => r.data),
};
