import api from "./client";

export const payments = {
  all: () => api.get("/payment/all").then((r) => r.data),
  byId: (id) => api.get(`/payment/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/payment/create", payload).then((r) => r.data),
  update: (payload) => api.put("/payment/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/payment/delete/${id}`),
};