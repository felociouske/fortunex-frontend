import { useEffect, useRef, useState, useCallback } from "react";

const WS_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1")
  .replace(/^http/, "ws")
  .replace(/\/api\/v1\/?$/, "");

/**
 * Subscribes to the authenticated user's bot-automation run status:
 *   { event: "trade_settled", id, status, cumulative_profit_loss, trades_count, current_position_id }
 *   { event: "stopped", ...same shape, status is one of the STOPPED_* values }
 *
 * Mirrors usePositionsSocket.js's auth approach (?token=<access_token>
 * in the URL, since browsers can't set custom headers on a WS handshake).
 */
export default function useBotRunSocket() {
  const [lastEvent, setLastEvent] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const closedByUsRef = useRef(false);

  const connect = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const url = `${WS_BASE}/ws/trading/botrun/?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      retryRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        setLastEvent(JSON.parse(event.data));
      } catch {
        // ignore malformed frames
      }
    };

    ws.onclose = () => {
      setConnected(false);
      if (closedByUsRef.current) return;
      const delay = Math.min(1000 * 2 ** retryRef.current, 10000);
      retryRef.current += 1;
      setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    closedByUsRef.current = false;
    connect();
    return () => {
      closedByUsRef.current = true;
      wsRef.current?.close();
    };
  }, [connect]);

  return { lastEvent, connected };
}