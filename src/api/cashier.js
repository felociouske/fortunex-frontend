import api from "./axios";

export const cashierAPI = {
  deposit: (data) => api.post("/cashier/deposit/", data),
  manualMpesaDeposit: (data) => api.post("/cashier/mpesa/manual/", data),
  withdrawal: (data) => api.post("/cashier/withdrawal/", data),
  transactions: () => api.get("/cashier/transactions/"),
  paymentAgents: () => api.get("/cashier/payment-agents/"),

  // M-Pesa STK Push
  mpesaStkPush: (data) => api.post("/cashier/mpesa/stkpush/", data),
  depositStatus: (checkoutRequestId) => api.get(`/cashier/mpesa/status/${checkoutRequestId}/`),
  exchangeRate: () => api.get("/cashier/exchange-rate/"),
};