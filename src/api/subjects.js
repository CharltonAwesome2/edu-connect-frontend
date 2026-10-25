import api from "./client";

export const subjects = {
  all: () => api.get("/subject/all").then((r) => r.data),
  byId: (id) => api.get(`/subject/read/${id}`).then((r) => r.data),
  create: (payload) => api.post("/subject/create", payload).then((r) => r.data),
  update: (payload) => api.put("/subject/update", payload).then((r) => r.data),
  remove: (id) => api.delete(`/subject/delete/${id}`),
  bySubjectCode: (code) => api.get("/subject/by-subject-code", { params: { subjectCode: code } }).then((r) => r.data),
  existsBySubjectCode: (code) =>
    api.get("/subject/exists-by-subject-code", { params: { subjectCode: code } }).then((r) => r.data),
  existsBySubjectName: (name) =>
    api.get("/subject/exists-by-subject-name", { params: { subjectName: name } }).then((r) => r.data),
  byDepartment: (department) => api.get("/subject/by-department", { params: { department } }).then((r) => r.data),
  search: (keyword) => api.get("/subject/search", { params: { keyword } }).then((r) => r.data),
};
