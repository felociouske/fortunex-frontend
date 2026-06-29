// Global auth state using Zustand.
// Stores user info, tokens, and KYC status.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../api/auth";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Called on successful login
      setAuth: ({ user, access, refresh }) => {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        set({ user, accessToken: access, refreshToken: refresh, isAuthenticated: true });
      },

      // Initialize auth state from stored tokens (called on app mount)
      initAuth: async () => {
        const access = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");
        if (!access && !refresh) return;
        try {
          // Try to fetch profile with existing access token
          const { data } = await authAPI.getProfile();
          set({ user: data, accessToken: access, refreshToken: refresh, isAuthenticated: true });
        } catch (err) {
          // If access is expired, try to refresh
          if (refresh) {
            try {
              const r = await authAPI.refreshToken(refresh);
              const newAccess = r.data.access;
              localStorage.setItem("access_token", newAccess);
              // retry profile
              const { data } = await authAPI.getProfile();
              set({ user: data, accessToken: newAccess, refreshToken: refresh, isAuthenticated: true });
            } catch (e) {
              // Refresh failed — clear stored tokens
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("fortunex-auth");
              set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
            }
          } else {
            // No refresh token — clear
            localStorage.removeItem("access_token");
            localStorage.removeItem("fortunex-auth");
            set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
          }
        }
      },

      // Update user info (e.g. after profile update or KYC status change)
      setUser: (user) => set({ user }),

      // Clear everything on logout
      clearAuth: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("fortunex-auth");
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      // Logout — blacklists refresh token on server then wipes local state
      logout: async () => {
        const refresh = get().refreshToken;
        // Tell server to blacklist the token (best-effort, don't block on failure)
        try {
          if (refresh) await authAPI.logout(refresh);
        } catch (_) {}
        // Clear all localStorage keys
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Remove the zustand persist snapshot so it doesn't re-hydrate isAuthenticated: true
        localStorage.removeItem("fortunex-auth");
        // Reset in-memory state
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      // Convenience getters
      isKycVerified: () => get().user?.kyc_status === "VERIFIED",
      isKycPending: () => ["PENDING", "SUBMITTED"].includes(get().user?.kyc_status),
    }),
    {
      name: "fortunex-auth", // persisted to localStorage
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);

export default useAuthStore;