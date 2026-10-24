import api from "./client";

export const notifications = {
  all: () => api.get("/notification/all").then((r) => r.data),
  byId: (id) => api.get(`/notification/read/${id}`).then((r) => r.data),
  create: (payload) =>
    api.post("/notification/create", payload).then((r) => r.data),
  update: (payload) =>
    api.put("/notification/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/notification/delete/${id}`),
};