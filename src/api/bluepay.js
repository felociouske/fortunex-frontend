import api from "./axios";

// BluePay -- a separate M-Pesa payment rail from the Daraja paybill
// endpoints in cashier.js. Kept in its own file on purpose so it's easy
// to remove (or bring the Daraja flow back to the front) later without
// touching the existing M-Pesa code.
export const bluepayAPI = {
  stkPush: (data) => api.post("/cashier/bluepay/stkpush/", data),
  depositStatus: (checkoutRequestId) => api.get(`/cashier/bluepay/status/${checkoutRequestId}/`),
};