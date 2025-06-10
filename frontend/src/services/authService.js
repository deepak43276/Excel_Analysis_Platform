import api from "./api";

const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

const register = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

const logout = async () => {
  await api.post("/auth/logout");
};

export default { login, register, logout };
