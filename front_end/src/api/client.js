import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

// Inject the JWT from localStorage on every request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("um_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surface a clean error object for callers — controllers/UI shouldn't have
// to dig into Axios's nested response/data to find the server message.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiMessage = error?.response?.data?.message;
    const message = apiMessage || error.message || "Network error.";
    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default client;
