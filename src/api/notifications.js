import api from "./axios";

export const notificationsAPI = {
  list: (unreadOnly = false) =>
    api.get("/notifications/", unreadOnly ? { params: { unread: "true" } } : undefined),
  markRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllRead: () => api.post("/notifications/read-all/"),
  getKycStatus: () => api.get("/notifications/kyc-status/"),
};