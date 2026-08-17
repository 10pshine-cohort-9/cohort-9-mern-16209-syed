import axios from "axios";

// Environment variable fallback (supports Create React App & Vite)
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired credentials
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login if not already on an auth page
      if (!window.location.pathname.startsWith("/login") && 
          !window.location.pathname.startsWith("/signup")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;