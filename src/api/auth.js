import api from "./client";

export async function loginApi(email, password) {
  const { data } = await api.post("/v1/user-auth/verify", { email, password });
  return data; 
}

export async function signupApi(payload) {
  const { data } = await api.post("/v1/user-auth/register", payload);
  return data;
}

export async function logoutApi() {
  return Promise.resolve();
}

export async function createUserAuth(payload) {
  const { data } = await api.post("/v1/user-auth/create", payload);
  return data;
}
export async function getUserAuthById(id) {
  const { data } = await api.get(`/v1/user-auth/read/${id}`);
  return data;
}
export async function updateUserAuth(payload) {
  const { data } = await api.put("/v1/user-auth/update", payload);
  return data;
}
export async function deleteUserAuth(id) {
  await api.delete(`/v1/user-auth/delete/${id}`);
}
export async function getAllUserAuth() {
  const { data } = await api.get("/v1/user-auth/all");
  return data;
}
export async function getUserAuthByUser(user) {
  const { data } = await api.post("/v1/user-auth/by-user", user);
  return data;
}
export async function getUserAuthByUserId(userId) {
  const { data } = await api.get(`/v1/user-auth/by-user-id/${userId}`);
  return data;
}
export async function getUserAuthByEmail(email) {
  const { data } = await api.get("/v1/user-auth/by-email", { params: { email } });
  return data;
}
export async function existsByUser(user) {
  const { data } = await api.post("/v1/user-auth/exists-by-user", user);
  return data;
}
