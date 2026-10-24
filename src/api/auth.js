import api from "./client";

export async function loginApi(email, password) {
  const { data } = await api.post("/v1/user-auth/verify", { email, password });
  return data; // User
}

export async function signupApi(payload) {
  const { data } = await api.post("/v1/user-auth/register", payload);
  return data; // User
}

export async function logoutApi() {
  return Promise.resolve();
}