import { useEffect, useRef, useState, useMemo } from "react";
import { createChart, AreaSeries } from "lightweight-charts";
import { tradingAPI } from "../api/trading";
import useTicksSocket from "../hooks/useTicksSocket";

/**
 * Live price chart for one instrument, Deriv-style.
 *
 * - Seeds history from GET /trading/instruments/<symbol>/ticks/ on mount
 *   (lightweight-charts needs a starting series; we don't want to wait
 *   for live ticks to trickle in one by one before anything is visible).
 * - Then switches to live updates via useTicksSocket, calling
 *   series.update() per tick rather than re-setting the whole series
 *   (cheap, and avoids the chart visibly "jumping").
 * - Shows a digits strip (last digit of each recent tick) underneath,
 *   matching Deriv's Even/Odd visual convention -- teal for even digits,
 *   coral for odd. This is purely visual context for now; Even/Odd
 *   contracts themselves come in a later build.
 */

/** Deriv-style circular digit badge with SVG progress ring + percentage */
function DigitBadge({ digit, percentage, isLatest, isEven, size = 52 }) {
  const strokeWidth = size < 45 ? 2.5 : 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percentage / 100) * circumference;
  const color = isEven ? "#00c2b2" : "#e8404a";
  const digitFontSize = size < 45 ? 11 : 15;
  const pctFontSize = size < 45 ? 7 : 9;

  return (
    <div className="flex flex-col items-center flex-shrink-0" style={{ gap: 2 }}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track ring */}
        <svg
          width={size}
          height={size}
          style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2a2a3d"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Dark circle background */}
        <div
          className="absolute inset-0 rounded-full flex flex-col items-center justify-center"
          style={{ margin: strokeWidth + 1 }}
        >
          <div
            className="w-full h-full rounded-full flex flex-col items-center justify-center"
            style={{ background: "#13131f" }}
          >
            <span className="text-white font-bold leading-none" style={{ fontSize: digitFontSize }}>
              {digit}
            </span>
            <span className="leading-none mt-0.5" style={{ fontSize: pctFontSize, color: "#9ca3af" }}>
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Triangle pointer for the latest digit */}
      {isLatest ? (
        <svg width={8} height={6} viewBox="0 0 10 7">
          <polygon points="5,0 10,7 0,7" fill={color} />
        </svg>
      ) : (
        <div style={{ height: 6 }} />
      )}
    </div>
  );
}

/** Returns current window inner width, updates on resize */
function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function DigitStrip({ digitStats, latestDigit, hasTicks }) {
  const width = useWindowWidth();
  // On very small screens fit all 10 badges; container is ~320px min
  // 320px / 10 badges = 32px each — use 30 to leave gap room
  const badgeSize = width < 400 ? 30 : width < 640 ? 38 : 52;
  const gap = width < 400 ? 2 : width < 640 ? 4 : 8;

  return (
    <div
      className="mt-4 pb-1"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap,
        overflowX: "auto",
        // hide scrollbar but keep scroll on mobile
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {!hasTicks ? (
        <span className="text-fx-text-dim text-xs">Digits will appear as ticks arrive…</span>
      ) : (
        digitStats.map(({ digit, percentage, isEven }) => (
          <DigitBadge
            key={digit}
            digit={digit}
            percentage={percentage}
            isLatest={digit === latestDigit}
            isEven={isEven}
            size={badgeSize}
          />
        ))
      )}
    </div>
  );
}

export default function Chart({ symbol, instrumentName, onTicksUpdate }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const seededTickCountRef = useRef(0);
  const lastChartTimeRef = useRef(null);

  const [seedError, setSeedError] = useState("");
  const { ticks, latest, connected } = useTicksSocket(symbol);

  // Create the chart once per symbol mount.
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#9ca3af",
        fontFamily: "Inter, system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: "#1a1a2e" },
        horzLines: { color: "#1a1a2e" },
      },
      rightPriceScale: { borderColor: "#2a2a3d" },
      timeScale: {
        borderColor: "#2a2a3d",
        timeVisible: true,
        secondsVisible: true,
      },
      crosshair: { mode: 0 },
      autoSize: true,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#00c2b2",
      topColor: "rgba(0,194,178,0.25)",
      bottomColor: "rgba(0,194,178,0.02)",
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      seededTickCountRef.current = 0;
      lastChartTimeRef.current = null;
    };
  }, [symbol]);

  // Seed history once we know the symbol.
  useEffect(() => {
    if (!symbol) return;
    setSeedError("");
    let cancelled = false;

    tradingAPI
      .getInstrumentTicks(symbol, 150)
      .then(({ data }) => {
        if (cancelled || !seriesRef.current) return;
        const points = data.map((t) => ({
          time: Math.floor(new Date(t.created_at).getTime() / 1000),
          value: Number(t.price),
        }));
        // lightweight-charts requires strictly ascending, de-duplicated times.
        const deduped = [];
        for (const p of points) {
          if (!deduped.length || deduped[deduped.length - 1].time < p.time) {
            deduped.push(p);
          }
        }
        seriesRef.current.setData(deduped);
        seededTickCountRef.current = data.length ? data[data.length - 1].tick_count : 0;
        lastChartTimeRef.current = deduped.length ? deduped[deduped.length - 1].time : null;
        chartRef.current?.timeScale().fitContent();
      })
      .catch(() => {
        if (!cancelled) setSeedError("Couldn't load price history. Live ticks will still appear below.");
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  // Append live ticks as they arrive.
  useEffect(() => {
    if (!latest || !seriesRef.current) return;
    // Skip ticks that history-seeding already covered, to avoid a
    // backwards-time update error from lightweight-charts.
    if (latest.tick_count <= seededTickCountRef.current) return;

    // lightweight-charts requires strictly increasing time per update().
    // If an instrument ticks faster than once per second, two ticks can
    // floor to the same Unix second -- nudge forward by 1s rather than
    // dropping the point, so fast instruments still render every tick.
    let time = Math.floor(new Date(latest.timestamp).getTime() / 1000);
    if (lastChartTimeRef.current !== null && time <= lastChartTimeRef.current) {
      time = lastChartTimeRef.current + 1;
    }
    lastChartTimeRef.current = time;

    seriesRef.current.update({ time, value: Number(latest.price) });
  }, [latest]);

  // Surface the rolling tick buffer to the parent (e.g. for AI trend
  // advisory) without that parent needing its own duplicate WebSocket
  // connection to the same symbol.
  useEffect(() => {
    onTicksUpdate?.(ticks);
  }, [ticks, onTicksUpdate]);

  // Build digit frequency stats from the last 100 ticks (same window Deriv uses)
  const digitStats = useMemo(() => {
    const window = ticks.slice(-100);
    const counts = Array(10).fill(0);
    let valid = 0;
    for (const t of window) {
      const priceStr = String(t.price);
      const d = parseInt(priceStr[priceStr.length - 1], 10);
      if (!Number.isNaN(d)) { counts[d]++; valid++; }
    }
    return counts.map((c, d) => ({
      digit: d,
      count: c,
      percentage: valid > 0 ? (c / valid) * 100 : 0,
      isEven: d % 2 === 0,
    }));
  }, [ticks]);

  const latestDigit = useMemo(() => {
    if (!latest) return null;
    const priceStr = String(latest.price);
    const d = parseInt(priceStr[priceStr.length - 1], 10);
    return Number.isNaN(d) ? null : d;
  }, [latest]);

  return (
    <div className="rounded-2xl border border-fx-border bg-[#0a0a12] p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-fx-text">
            {instrumentName || symbol}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl font-bold text-fx-teal tabular-nums">
              {latest ? Number(latest.price).toFixed(2) : "—"}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs text-fx-text-dim"
              title={connected ? "Live" : "Reconnecting…"}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: connected ? "#00c2b2" : "#e8404a" }}
              />
              {connected ? "Live" : "Reconnecting…"}
            </span>
          </div>
        </div>
      </div>

      {seedError && <div className="text-fx-red text-xs mb-2">{seedError}</div>}

      <div ref={containerRef} className="h-[320px] sm:h-[400px] w-full" />

      {/* Deriv-style digit frequency strip — 0-9 with circular progress rings */}
      <DigitStrip
        digitStats={digitStats}
        latestDigit={latestDigit}
        hasTicks={ticks.length > 0}
      />
    </div>
  );
}