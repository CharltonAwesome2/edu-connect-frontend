import api from "./client";

export const availability = {
  all: () => api.get("/availability/all").then((r) => r.data),
  byId: (id) => api.get(`/availability/read/${id}`).then((r) => r.data),
  byTutorProfileId: (tutorProfileId) =>
    api.get(`/availability/by-tutor-profile-id/${tutorProfileId}`).then((r) => r.data),
  byDay: (dayOfWeek) => api.get(`/availability/by-day/${dayOfWeek}`).then((r) => r.data),
  create: (payload) => api.post("/availability/create", payload).then((r) => r.data),
  update: (payload) => api.put("/availability/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/availability/delete/${id}`),
  byAvailabilityId: (id) => api.get(`/availability/by-availability-id/${id}`).then((r) => r.data),
};
