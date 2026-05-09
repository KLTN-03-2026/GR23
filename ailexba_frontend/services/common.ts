import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7083/api",
});

// Add Bearer Token automatically
api.interceptors.request.use((config) => {
   const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;