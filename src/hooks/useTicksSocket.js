import { useEffect, useRef, useState, useCallback } from "react";

const WS_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1")
  .replace(/^http/, "ws")
  .replace(/\/api\/v1\/?$/, "");

/**
 * Subscribes to live ticks for one instrument symbol over WebSocket.
 * Keeps a rolling buffer of the most recent ticks (capped) for charting,
 * and exposes the latest price/tick_count separately for quick reads
 * (e.g. showing the current price next to the chart).
 *
 * Reconnects automatically with backoff if the connection drops — ticks
 * are a long-lived stream, not a one-shot request.
 */
export default function useTicksSocket(symbol, { maxPoints = 120 } = {}) {
  const [ticks, setTicks] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const closedByUsRef = useRef(false);

  const connect = useCallback(() => {
    if (!symbol) return;
    const url = `${WS_BASE}/ws/trading/ticks/${symbol}/`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      retryRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTicks((prev) => {
          const next = [...prev, data];
          return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
        });
      } catch {
        // ignore malformed frames
      }
    };

    ws.onclose = () => {
      setConnected(false);
      if (closedByUsRef.current) return;
      // Exponential backoff, capped at 10s, so a dead backend doesn't
      // spam reconnect attempts.
      const delay = Math.min(1000 * 2 ** retryRef.current, 10000);
      retryRef.current += 1;
      setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [symbol, maxPoints]);

  useEffect(() => {
    closedByUsRef.current = false;
    setTicks([]); // clear history when switching instruments
    connect();
    return () => {
      closedByUsRef.current = true;
      wsRef.current?.close();
    };
  }, [connect]);

  const latest = ticks.length ? ticks[ticks.length - 1] : null;

  return { ticks, latest, connected };
}