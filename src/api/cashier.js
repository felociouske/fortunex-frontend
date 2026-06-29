import api from "./axios";

export const cashierAPI = {
  deposit: (data) => api.post("/cashier/deposit/", data),
  withdrawal: (data) => api.post("/cashier/withdrawal/", data),
};
