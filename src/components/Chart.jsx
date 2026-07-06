import { useEffect, useRef, useState, useMemo } from "react";
import { createChart, AreaSeries, LineSeries, CandlestickSeries, BarSeries } from "lightweight-charts";
import { tradingAPI } from "../api/trading";
import useTicksSocket from "../hooks/useTicksSocket";

// ─── Candle bucket size in seconds ────────────────────────────
// 1s buckets produce micro-candles on fast instruments like Vol100(1s).
// 10s gives visible bodies while still feeling "live".
const CANDLE_BUCKET_SECS = 10;

function candleTime(unixSec) {
  return Math.floor(unixSec / CANDLE_BUCKET_SECS) * CANDLE_BUCKET_SECS;
}

// ─── Chart type definitions ────────────────────────────────────
const CHART_TYPES = [
  {
    id: "area",
    label: "Area",
    icon: (active) => (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <polyline points="2,18 7,10 12,14 17,6 22,8" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2,18 L7,10 L12,14 L17,6 L22,8 L22,18 Z" fill={active ? "rgba(0,194,178,0.15)" : "rgba(107,114,128,0.1)"}/>
      </svg>
    ),
  },
  {
    id: "line",
    label: "Line",
    icon: (active) => (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <polyline points="2,18 7,10 12,14 17,6 22,9" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "candle",
    label: "Candles",
    icon: (active) => (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="4" height="10" rx="0.5" fill={active ? "#00c2b2" : "#6b7280"}/>
        <line x1="5" y1="4" x2="5" y2="7" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="1.5"/>
        <line x1="5" y1="17" x2="5" y2="20" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="1.5"/>
        <rect x="10" y="5" width="4" height="8" rx="0.5" fill={active ? "#e8404a" : "#6b7280"}/>
        <line x1="12" y1="3" x2="12" y2="5" stroke={active ? "#e8404a" : "#6b7280"} strokeWidth="1.5"/>
        <line x1="12" y1="13" x2="12" y2="17" stroke={active ? "#e8404a" : "#6b7280"} strokeWidth="1.5"/>
        <rect x="17" y="6" width="4" height="9" rx="0.5" fill={active ? "#00c2b2" : "#6b7280"}/>
        <line x1="19" y1="3" x2="19" y2="6" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="1.5"/>
        <line x1="19" y1="15" x2="19" y2="19" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "bar",
    label: "Bars",
    icon: (active) => (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <line x1="5" y1="4" x2="5" y2="20" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
        <line x1="5" y1="8" x2="2" y2="8" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
        <line x1="5" y1="15" x2="8" y2="15" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
        <line x1="13" y1="4" x2="13" y2="18" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
        <line x1="13" y1="7" x2="10" y2="7" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
        <line x1="13" y1="13" x2="16" y2="13" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
        <line x1="21" y1="6" x2="21" y2="19" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
        <line x1="21" y1="10" x2="18" y2="10" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
        <line x1="21" y1="16" x2="24" y2="16" stroke={active ? "#00c2b2" : "#6b7280"} strokeWidth="2"/>
      </svg>
    ),
  },
];

// ─── Digit badge ───────────────────────────────────────────────
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
        <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#2a2a3d" strokeWidth={strokeWidth}/>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${filled} ${circumference}`} strokeLinecap="round"/>
        </svg>
        <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center" style={{ margin: strokeWidth + 1 }}>
          <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: "#13131f" }}>
            <span className="text-white font-bold leading-none" style={{ fontSize: digitFontSize }}>{digit}</span>
            <span className="leading-none mt-0.5" style={{ fontSize: pctFontSize, color: "#9ca3af" }}>{percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      {isLatest ? (
        <svg width={8} height={6} viewBox="0 0 10 7"><polygon points="5,0 10,7 0,7" fill={color}/></svg>
      ) : (
        <div style={{ height: 6 }}/>
      )}
    </div>
  );
}

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
  const badgeSize = width < 400 ? 30 : width < 640 ? 38 : 52;
  const gap = width < 400 ? 2 : width < 640 ? 4 : 8;
  return (
    <div className="mt-4 pb-1" style={{ display: "flex", alignItems: "flex-start", gap, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
      {!hasTicks ? (
        <span className="text-fx-text-dim text-xs">Digits will appear as ticks arrive…</span>
      ) : (
        digitStats.map(({ digit, percentage, isEven }) => (
          <DigitBadge key={digit} digit={digit} percentage={percentage}
            isLatest={digit === latestDigit} isEven={isEven} size={badgeSize}/>
        ))
      )}
    </div>
  );
}

// ─── Barrier lines ─────────────────────────────────────────────
const BARRIER_CONTRACTS = ["HIGHER_LOWER", "TOUCH_NO_TOUCH"];
function getBarrierFromPosition(position) {
  if (!position) return null;
  if (!BARRIER_CONTRACTS.includes(position.contract_type)) return null;
  const barrier = Number(position.prediction?.barrier);
  if (!barrier || isNaN(barrier)) return null;
  return barrier;
}

// ─── Main Chart component ──────────────────────────────────────
export default function Chart({
  symbol,
  instrumentName,
  onTicksUpdate,
  instruments = [],
  selected = null,
  onSelect = null,
  openPosition = null,
}) {
  const containerRef      = useRef(null);
  const chartRef          = useRef(null);
  const seriesRef         = useRef(null);
  const barrierUpRef      = useRef(null);
  const barrierDownRef    = useRef(null);
  const seededTickCountRef = useRef(0);
  const lastChartTimeRef   = useRef(null);
  const lastChartValueRef  = useRef(null);
  const animFrameRef       = useRef(null);
  const pickerRef          = useRef(null);
  // Keyed by candleTime(unixSec) — 10-second buckets
  const candleBucketRef    = useRef({});

  const [seedError, setSeedError]   = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [chartType, setChartType]   = useState("area");

  const { ticks, latest, connected } = useTicksSocket(symbol);
  const isOHLC = chartType === "candle" || chartType === "bar";

  // ── Close picker on outside click ────────────────────────────
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e) => { if (!pickerRef.current?.contains(e.target)) setPickerOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  // ── Build / rebuild chart when symbol OR chartType changes ───
  useEffect(() => {
    if (!containerRef.current) return;
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
      barrierUpRef.current = null;
      barrierDownRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      layout: { background: { color: "transparent" }, textColor: "#9ca3af", fontFamily: "Inter, system-ui, sans-serif" },
      grid: { vertLines: { color: "#1a1a2e" }, horzLines: { color: "#1a1a2e" } },
      rightPriceScale: { borderColor: "#2a2a3d" },
      timeScale: { borderColor: "#2a2a3d", timeVisible: true, secondsVisible: true },
      crosshair: { mode: 0 },
      autoSize: true,
    });

    let series;
    if (chartType === "area") {
      series = chart.addSeries(AreaSeries, {
        lineColor: "#00c2b2", topColor: "rgba(0,194,178,0.25)",
        bottomColor: "rgba(0,194,178,0.02)", lineWidth: 2,
        priceLineVisible: true, lastValueVisible: true,
      });
    } else if (chartType === "line") {
      series = chart.addSeries(LineSeries, {
        color: "#00c2b2", lineWidth: 2,
        priceLineVisible: true, lastValueVisible: true,
      });
    } else if (chartType === "candle") {
      series = chart.addSeries(CandlestickSeries, {
        upColor: "#00c2b2", downColor: "#e8404a",
        borderUpColor: "#00c2b2", borderDownColor: "#e8404a",
        wickUpColor: "#00c2b2", wickDownColor: "#e8404a",
        priceLineVisible: true, lastValueVisible: true,
      });
    } else if (chartType === "bar") {
      series = chart.addSeries(BarSeries, {
        upColor: "#00c2b2", downColor: "#e8404a",
        priceLineVisible: true, lastValueVisible: true,
      });
    }

    chartRef.current = chart;
    seriesRef.current = series;
    seededTickCountRef.current = 0;
    lastChartTimeRef.current = null;
    lastChartValueRef.current = null;
    candleBucketRef.current = {};

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      barrierUpRef.current = null;
      barrierDownRef.current = null;
    };
  }, [symbol, chartType]);

  // ── Seed history ─────────────────────────────────────────────
  useEffect(() => {
    if (!symbol) return;
    setSeedError("");
    let cancelled = false;

    tradingAPI.getInstrumentTicks(symbol, 150).then(({ data }) => {
      if (cancelled || !seriesRef.current) return;

      if (!isOHLC) {
        // Area / Line — one point per tick
        const points = data.map((t) => ({
          time:  Math.floor(new Date(t.created_at).getTime() / 1000),
          value: Number(t.price),
        }));
        const deduped = [];
        for (const p of points) {
          if (!deduped.length || deduped[deduped.length - 1].time < p.time) deduped.push(p);
        }
        seriesRef.current.setData(deduped);
        seededTickCountRef.current = data.length ? data[data.length - 1].tick_count : 0;
        lastChartTimeRef.current   = deduped.length ? deduped[deduped.length - 1].time  : null;
        lastChartValueRef.current  = deduped.length ? deduped[deduped.length - 1].value : null;

      } else {
        // Candle / Bar — aggregate into CANDLE_BUCKET_SECS buckets
        // Using candleTime() ensures each bucket spans exactly 10 seconds,
        // giving candles with real body height even on fast-ticking instruments.
        const buckets = {};
        for (const t of data) {
          const rawSec = Math.floor(new Date(t.created_at).getTime() / 1000);
          const time   = candleTime(rawSec);   // snap to 10s bucket
          const price  = Number(t.price);
          if (!buckets[time]) {
            buckets[time] = { time, open: price, high: price, low: price, close: price };
          } else {
            buckets[time].high  = Math.max(buckets[time].high, price);
            buckets[time].low   = Math.min(buckets[time].low,  price);
            buckets[time].close = price;
          }
        }
        const candles = Object.values(buckets).sort((a, b) => a.time - b.time);
        seriesRef.current.setData(candles);
        candleBucketRef.current    = buckets;
        seededTickCountRef.current = data.length ? data[data.length - 1].tick_count : 0;
        lastChartTimeRef.current   = candles.length ? candles[candles.length - 1].time  : null;
        lastChartValueRef.current  = candles.length ? candles[candles.length - 1].close : null;
      }

      chartRef.current?.timeScale().fitContent();
    }).catch(() => {
      if (!cancelled) setSeedError("Couldn't load price history. Live ticks will still appear.");
    });

    return () => { cancelled = true; };
  }, [symbol, chartType]);   // chartType in deps so re-seed when switching modes

  // ── Live tick updates ─────────────────────────────────────────
  useEffect(() => {
    if (!latest || !seriesRef.current) return;
    if (latest.tick_count <= seededTickCountRef.current) return;

    const rawSec = Math.floor(new Date(latest.timestamp).getTime() / 1000);

    if (isOHLC) {
      const time  = candleTime(rawSec);   // same 10s bucket key
      const price = Number(latest.price);
      const prev  = candleBucketRef.current[time];
      const candle = prev
        ? { time, open: prev.open, high: Math.max(prev.high, price), low: Math.min(prev.low, price), close: price }
        : { time, open: lastChartValueRef.current ?? price, high: price, low: price, close: price };
      candleBucketRef.current[time] = candle;
      lastChartValueRef.current     = candle.close;
      lastChartTimeRef.current      = time;
      seriesRef.current.update(candle);
      return;
    }

    // Area / Line — smooth linear interpolation between ticks
    let time = rawSec;
    if (lastChartTimeRef.current !== null && time <= lastChartTimeRef.current) {
      time = lastChartTimeRef.current + 1;
    }
    lastChartTimeRef.current = time;

    const targetValue = Number(latest.price);
    const startValue  = lastChartValueRef.current ?? targetValue;
    lastChartValueRef.current = targetValue;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (startValue === targetValue) {
      seriesRef.current.update({ time, value: targetValue });
      return;
    }

    const duration  = 980;
    const startedAt = performance.now();
    const step = (now) => {
      const t     = Math.min((now - startedAt) / duration, 1);
      const value = startValue + (targetValue - startValue) * t;
      seriesRef.current?.update({ time, value });
      if (t < 1) animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, [latest, chartType]);

  // ── Cancel animation on unmount / symbol change ───────────────
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastChartValueRef.current = null;
    };
  }, [symbol]);

  // ── Barrier price lines from open position ────────────────────
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    try { if (barrierUpRef.current)   series.removePriceLine(barrierUpRef.current);   } catch {}
    try { if (barrierDownRef.current) series.removePriceLine(barrierDownRef.current); } catch {}
    barrierUpRef.current   = null;
    barrierDownRef.current = null;

    const barrier = getBarrierFromPosition(openPosition);
    if (!barrier) return;

    const entryPrice = Number(openPosition.entry_price);
    const diff       = Math.abs(barrier - entryPrice);

    barrierUpRef.current = series.createPriceLine({
      price: entryPrice + diff, color: "#3b82f6", lineWidth: 1, lineStyle: 0,
      axisLabelVisible: true, title: `+${diff.toFixed(3)}`,
    });
    barrierDownRef.current = series.createPriceLine({
      price: entryPrice - diff, color: "#3b82f6", lineWidth: 1, lineStyle: 0,
      axisLabelVisible: true, title: `-${diff.toFixed(3)}`,
    });
  }, [openPosition, chartType]);

  // ── Surface ticks to parent ───────────────────────────────────
  useEffect(() => { onTicksUpdate?.(ticks); }, [ticks, onTicksUpdate]);

  // ── Digit stats ───────────────────────────────────────────────
  const digitStats = useMemo(() => {
    const window = ticks.slice(-100);
    const counts = Array(10).fill(0);
    let valid = 0;
    for (const t of window) {
      const d = parseInt(String(t.price).slice(-1), 10);
      if (!isNaN(d)) { counts[d]++; valid++; }
    }
    return counts.map((c, d) => ({ digit: d, count: c, percentage: valid > 0 ? (c / valid) * 100 : 0, isEven: d % 2 === 0 }));
  }, [ticks]);

  const latestDigit = useMemo(() => {
    if (!latest) return null;
    const d = parseInt(String(latest.price).slice(-1), 10);
    return isNaN(d) ? null : d;
  }, [latest]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-fx-border bg-[#0a0a12] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        {onSelect && instruments.length > 0 ? (
          <div className="relative inline-block" ref={pickerRef}>
            <button type="button" onClick={() => setPickerOpen((v) => !v)}
              className="flex items-center gap-2 text-sm font-semibold text-fx-text hover:text-fx-teal transition-colors">
              <span className="text-base">{selected?.name || instrumentName || symbol}</span>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {pickerOpen && (
              <div className="absolute left-0 z-30 mt-2 w-64 rounded-lg border border-fx-border bg-fx-surface shadow-2xl overflow-hidden">
                {instruments.map((inst) => (
                  <button key={inst.id} type="button"
                    onClick={() => { onSelect(inst); setPickerOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-fx-surface2 transition-colors border-b border-fx-border last:border-0"
                    style={{ color: selected?.id === inst.id ? "#00c2b2" : "#e5e7eb" }}>
                    <div className="font-semibold">{inst.name}</div>
                    <div className="text-xs text-fx-text-dim mt-0.5">{inst.symbol}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className="text-base font-bold text-fx-text">{instrumentName || symbol}</span>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl text-fx-teal tabular-nums">
            {latest ? Number(latest.price).toFixed(2) : "—"}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-fx-text-dim">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: connected ? "#00c2b2" : "#e8404a" }}/>
            {connected ? "Live" : "Reconnecting…"}
          </span>
          {/* Candle bucket size label */}
          {isOHLC && (
            <span className="text-xs text-fx-text-dim ml-2">
              {CANDLE_BUCKET_SECS}s candles
            </span>
          )}
        </div>
      </div>

      {seedError && <div className="text-fx-red text-xs px-4 pb-2">{seedError}</div>}

      {/* Chart area with left toolbar */}
      <div className="relative flex">
        {/* Left toolbar */}
        <div className="flex flex-col items-center gap-1 py-2 px-1 border-r border-fx-border flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.02)", width: 44 }}>
          {CHART_TYPES.map((ct) => (
            <button key={ct.id} type="button" title={ct.label}
              onClick={() => setChartType(ct.id)}
              className="w-8 h-8 flex items-center justify-center rounded transition-colors"
              style={{ background: chartType === ct.id ? "rgba(0,194,178,0.12)" : "transparent" }}>
              {ct.icon(chartType === ct.id)}
            </button>
          ))}
          <div className="w-6 border-t border-fx-border my-1" />
          <button type="button" title="Zoom in"
            onClick={() => chartRef.current?.timeScale().applyOptions({ barSpacing: Math.min(20, (chartRef.current.timeScale().options()?.barSpacing ?? 6) + 2) })}
            className="w-8 h-8 flex items-center justify-center rounded text-fx-text-dim hover:text-fx-text transition-colors"
            style={{ fontSize: 18, lineHeight: 1 }}>+</button>
          <button type="button" title="Zoom out"
            onClick={() => chartRef.current?.timeScale().applyOptions({ barSpacing: Math.max(2, (chartRef.current.timeScale().options()?.barSpacing ?? 6) - 2) })}
            className="w-8 h-8 flex items-center justify-center rounded text-fx-text-dim hover:text-fx-text transition-colors"
            style={{ fontSize: 18, lineHeight: 1 }}>−</button>
          <button type="button" title="Fit all data"
            onClick={() => chartRef.current?.timeScale().fitContent()}
            className="w-8 h-8 flex items-center justify-center rounded text-fx-text-dim hover:text-fx-text transition-colors">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Chart canvas */}
        <div ref={containerRef} className="flex-1 h-[320px] sm:h-[400px]" />
      </div>

      {/* Digit strip */}
      <div className="ml-7 px-4 pb-4">
        <DigitStrip digitStats={digitStats} latestDigit={latestDigit} hasTicks={ticks.length > 0} />
      </div>
    </div>
  );
}
