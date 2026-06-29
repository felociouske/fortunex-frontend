import api from "./axios";

export const tradingAPI = {
  getMarket: () => api.get("/trading/market/"),
  getInstrumentTicks: (symbol, limit = 100) =>
    api.get(`/trading/instruments/${symbol}/ticks/`, { params: { limit } }),
  getOpenPositions: () => api.get("/trading/positions/"),
  getPositionHistory: () => api.get("/trading/positions/history/"),
  openContract: (data) => api.post("/trading/contracts/", data),
  getMyTier: () => api.get("/trading/my-tier/"),
  startBotRun: (data) => api.post("/trading/botrun/start/", data),
  stopBotRun: () => api.post("/trading/botrun/stop/"),
  getMyBotRun: () => api.get("/trading/botrun/mine/"),
};