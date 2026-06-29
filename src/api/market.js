import api from "./axios";

export const walletAPI = {
  getBalance: () => api.get("/wallet/balance/"),
};