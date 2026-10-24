import api from "./client";

export const users = {
  all: () => api.get("/user/all").then((r) => r.data),
  byId: (id) => api.get(`/user/read/${id}`).then((r) => r.data),
  byEmail: (email) =>
    api.get("/user/by-email", { params: { email } }).then((r) => r.data),
  byStudentNumber: (sn) =>
    api.get("/user/by-student-number", { params: { studentNumber: sn } }).then((r) => r.data),
  create: (payload) => api.post("/user/create", payload).then((r) => r.data),
  update: (payload) => api.put("/user/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/user/delete/${id}`),
  tutors: () => api.get("/user/allTutors").then((r) => r.data),
  students: () => api.get("/user/allStudent").then((r) => r.data),
  existsByEmail: (email) =>
    api.get("/user/exists-by-email", { params: { email } }).then((r) => r.data),
  existsByStudentNumber: (sn) =>
    api.get("/user/exists-by-student-number", { params: { studentNumber: sn } }).then((r) => r.data),
};