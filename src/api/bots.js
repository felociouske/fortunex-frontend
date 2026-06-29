import api from "./axios";

export const botsAPI = {
  getCatalog: () => api.get("/bots/catalog/"),
  getAICatalog: () => api.get("/bots/ai-catalog/"),
  getMyAutomation: () => api.get("/bots/my-automation/"),
  purchase: (productId) => api.post("/bots/purchase/", { product_id: productId }),
};