import api from "./client";

export const subjects = {
  all: () => api.get("/subject/all").then((r) => r.data),
  byId: (id) => api.get(`/subject/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/subject/create", payload).then((r) => r.data),
  update: (payload) => api.put("/subject/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/subject/delete/${id}`),
};