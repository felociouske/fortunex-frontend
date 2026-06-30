// Axios instance — all API calls go through here.
// Base URL reads from VITE_API_URL env var (set in .env).
import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Shared in-flight refresh promise so multiple 401s arriving at once
// reuse the same refresh call instead of each posting separately.
let refreshPromise = null;

// Handle 401 — try to refresh token, else force logout
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          const refresh = localStorage.getItem("refresh_token");
          refreshPromise = axios
            .post(
              `${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/auth/token/refresh/`,
              { refresh }
            )
            .finally(() => {
              refreshPromise = null;
            });
        }
        const { data } = await refreshPromise;
        localStorage.setItem("access_token", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        // Refresh failed — clear tokens and update auth store so app can
        // decide how to handle redirecting (prevents racing redirects).
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        try {
          const clearAuth = useAuthStore.getState().clearAuth;
          if (clearAuth) clearAuth();
        } catch (e) {
          // fallback: navigate to login
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;