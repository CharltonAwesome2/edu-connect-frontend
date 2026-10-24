import api from "./client";

export const reports = {
  all: () => api.get("/report/all").then((r) => r.data),
  byId: (id) => api.get(`/report/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/report/create", payload).then((r) => r.data),
  update: (payload) => api.put("/report/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/report/delete/${id}`),
};