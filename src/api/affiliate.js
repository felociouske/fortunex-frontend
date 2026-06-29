import api from "./axios";

export const affiliateAPI = {
  getOverview: () => api.get("/affiliate/overview/"),
};
