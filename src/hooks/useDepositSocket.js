import { useEffect, useRef, useState, useCallback } from "react";

const WS_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1")
  .replace(/^http/, "ws")
  .replace(/\/api\/v1\/?$/, "");

/**
 * Subscribes to the authenticated user's own M-Pesa deposit status
 * events: { event: "deposit_update", checkout_request_id, status, ... }
 * Same auth-via-query-param pattern as usePositionsSocket, since this
 * reuses the identical backend ws_auth.py middleware.
 */
export default function useDepositSocket() {
  const [lastEvent, setLastEvent] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const closedByUsRef = useRef(false);

  const connect = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const url = `${WS_BASE}/ws/cashier/deposits/?token=${token}`;
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

    ws.onerror = () => ws.close();
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