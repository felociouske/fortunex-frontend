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

  // Change password (requires old + new) -- logs out other sessions server-side
  changePassword: (data) => api.post("/auth/change-password/", data),

  // Submit KYC documents for verification
  // KYC -- per category now
    getKYC: () => api.get("/auth/kyc/"),
    submitKYCIdentity: (formData) =>
      api.post("/auth/kyc/identity/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    submitKYCAddress: (formData) =>
      api.post("/auth/kyc/address/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),

  // Refresh access token
  refreshToken: (refresh) => api.post("/auth/token/refresh/", { refresh }),
};
