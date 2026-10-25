import api from "./client";

export const notifications = {
  all: () => api.get("/notification/all").then((r) => r.data),
  byId: (id) => api.get(`/notification/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/notification/create", payload).then((r) => r.data),
  update: (payload) => api.put("/notification/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/notification/delete/${id}`),
  byUserId: (userId) => api.get(`/notification/by-user-id/${userId}`).then((r) => r.data),
  markRead: (id) => api.patch(`/notification/${id}/read`).then((r) => r.data),
  markAllRead: (userId) => api.patch(`/notification/by-user-id/${userId}/read-all`).then((r) => r.data),
  byUser: (user) => api.post("/notification/by-user", user).then((r) => r.data),
  byType: (type) => api.get(`/notification/by-type/${type}`).then((r) => r.data),
  unreadByUserId: (userId) => api.get(`/notification/unread/by-user-id/${userId}`).then((r) => r.data),
  countUnreadByUserId: (userId) => api.get(`/notification/unread/count/by-user-id/${userId}`).then((r) => r.data),
};
