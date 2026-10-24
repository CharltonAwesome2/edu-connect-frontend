import api from "./client";

export const tutorProfiles = {
  all: () => api.get("/tutor-profile/all").then((r) => r.data),
  byId: (id) => api.get(`/tutor-profile/read/${id}`).then((r) => r.data),
  byUserId: (userId) =>
    api.get(`/tutor-profile/by-user-id/${userId}`).then((r) => r.data),
  byUser: (user) =>
    api.post("/tutor-profile/by-user", user).then((r) => r.data),
  create: (payload) =>
    api.post("/tutor-profile/create", payload).then((r) => r.data),
  update: (payload) =>
    api.put("/tutor-profile/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/tutor-profile/delete/${id}`),
};