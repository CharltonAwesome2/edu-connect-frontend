import api from "./client";

export const bookingRequests = {
  all: () => api.get("/booking-request/all").then((r) => r.data),
  byId: (id) => api.get(`/booking-request/read/${id}`).then((r) => r.data),
  create: (payload) =>
    api.post("/booking-request/create", payload).then((r) => r.data),
  update: (payload) =>
    api.put("/booking-request/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/booking-request/delete/${id}`),
};