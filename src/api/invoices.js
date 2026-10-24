import api from "./client";

export const invoices = {
  all: () => api.get("/invoice/all").then((r) => r.data),
  byId: (id) => api.get(`/invoice/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/invoice/create", payload).then((r) => r.data),
  update: (payload) => api.put("/invoice/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/invoice/delete/${id}`),
};