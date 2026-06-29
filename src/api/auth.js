// All authentication API calls
import api from "./axios";

export const authAPI = {
  // Register a new user account
  register: (data) => api.post("/auth/register/", data),

  // Login — returns access + refresh JWT tokens
  login: (data) => api.post("/auth/login/", data),

  // Logout — blacklists the refresh token on the server
  logout: (refresh) => api.post("/auth/logout/", { refresh }),

  // Get or update current user profile
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (data) => api.patch("/auth/profile/", data),

  // Submit KYC documents for verification
  submitKYC: (formData) =>
    api.post("/auth/kyc/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Refresh access token
  refreshToken: (refresh) => api.post("/auth/token/refresh/", { refresh }),
};
