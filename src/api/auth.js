import api from "./client";

export async function loginApi(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function signupApi(name, email, password) {
  const { data } = await api.post("/auth/signup", { name, email, password });
  return data; 
}