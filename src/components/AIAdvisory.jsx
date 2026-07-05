import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, TrendingUp, TrendingDown, Minus, Target, Radar as RadarIcon, X, ChevronRight } from "lucide-react";

/**
 * Rule based market commentary, styled to look like a live AI analysis
 * feed. For you, not the user: this is still not a real ML or LLM
 * model, it is deterministic tick math, broken out per contract type,
 * wrapped in a fake thinking animation, with a reasoning drawer.
 *
 * Three phases, not two:
 *   "analysing" -> the cosmetic 4 second thinking timer is running
 *   "waiting"   -> the timer finished but there were not yet enough
 *                  live ticks to analyse (this is the state the
 *                  previous version was missing, which is what caused
 *                  the blank headline and lone percent sign bug)
 *   "result"    -> a real, fully populated result is ready to show
 *
 * The component only ever shows result fields while phase is exactly
 * "result", and phase only ever becomes "result" alongside a real,
 * non null result, set together in the same function.
 */

const STATUS_LINES = [
  "Connecting to live price feed",
  "Scanning recent tick history",
  "Cross checking volatility patterns",
  "Weighing contract specific signals",
  "Finalising prediction",
];

const WAITING_LINE = "Waiting for enough live tick data";
const ANALYSIS_DURATION_MS = 4000;
const AUTO_REFRESH_MS = 45000;

export default function AIAdvisory({ ticks, aiName, contractType, prediction, side }) {
  const [phase, setPhase] = useState("analysing");
  const [statusIndex, setStatusIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [showReasons, setShowReasons] = useState(false);

  // ticks changes constantly as new prices stream in. If we read the
  // `ticks` prop from inside a setTimeout callback, that callback
  // closes over whatever `ticks` was AT THE MOMENT THE TIMER WAS
  // STARTED, four seconds earlier, not the current value. A ref
  // sidesteps that: it is updated every render, so reading
  // ticksRef.current inside a callback always gets the latest ticks,
  // not a four second old snapshot.
  const ticksRef = useRef(ticks);
  useEffect(() => {
    ticksRef.current = ticks;
  }, [ticks]);

  // A cycle id guards against a stale timer from a previous contract
  // selection resolving after a newer one has already started, which
  // could otherwise overwrite a fresh result with a stale one.
  const cycleIdRef = useRef(0);
  const timeoutRef = useRef(null);
  const statusIntervalRef = useRef(null);

  // Tries to produce a result RIGHT NOW using the latest ticks. Used
  // both when the 4 second timer fires, and again immediately whenever
  // new ticks arrive while we are stuck in "waiting."
  const attemptResolve = (cycleId) => {
    if (cycleIdRef.current !== cycleId) return; // a newer cycle already started, this one is stale
    const analysis = analyseForContract(ticksRef.current, contractType, prediction, side);
    if (analysis) {
      clearInterval(statusIntervalRef.current);
      setResult(analysis);
      setPhase("result");
    } else {
      // Not enough data yet. Stay visibly honest about why, instead of
      // silently showing a half filled result.
      setPhase("waiting");
    }
  };

  const runAnalysisCycle = () => {
    const thisCycle = ++cycleIdRef.current;
    setPhase("analysing");
    setStatusIndex(0);
    setDismissed(false); // mobile bar reappears at the start of every new cycle, per spec

    clearInterval(statusIntervalRef.current);
    statusIntervalRef.current = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_LINES.length);
    }, ANALYSIS_DURATION_MS / STATUS_LINES.length);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => attemptResolve(thisCycle), ANALYSIS_DURATION_MS);
  };

  // Re-trigger a full new cycle whenever the user changes contract type, prediction, or side.
  useEffect(() => {
    runAnalysisCycle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractType, JSON.stringify(prediction), side]);

  // Also re-trigger a full new cycle on a fixed timer, so it feels like a live feed.
  useEffect(() => {
    const id = setInterval(runAnalysisCycle, AUTO_REFRESH_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While stuck in "waiting," retry the instant new ticks arrive,
  // rather than guessing at a retry delay. This does nothing while
  // phase is "analysing" (the cosmetic timer is still the one in
  // charge) or "result" (nothing to retry).
  useEffect(() => {
    if (phase === "waiting") {
      attemptResolve(cycleIdRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks]);

  // Clean up any pending timers if the component unmounts mid cycle.
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(statusIntervalRef.current);
    };
  }, []);

  const statusLine = phase === "waiting" ? WAITING_LINE : STATUS_LINES[statusIndex];

  return (
    <>
      <div className="hidden md:block">
        <AdvisoryCard
          phase={phase}
          statusLine={statusLine}
          result={result}
          aiName={aiName}
          onOpenReasons={() => setShowReasons(true)}
        />
      </div>

      <div className="md:hidden">
        <MobileBar
          phase={phase}
          statusLine={statusLine}
          result={result}
          aiName={aiName}
          dismissed={dismissed}
          onDismiss={() => setDismissed(true)}
          onOpenReasons={() => setShowReasons(true)}
        />
      </div>

      {/*
        Rendered through a portal straight into document.body. A plain
        "fixed inset-0" overlay stops covering the real viewport the
        moment any ancestor element has a CSS transform, filter, or
        similar property, which is common in chart library wrappers. A
        portal sidesteps that by attaching outside the component tree.

        Gated on `phase === "result" && result` together, not just
        `result` alone, so a leftover result object from a previous
        cycle can never be opened while a newer cycle is still
        analysing or waiting.
      */}
      {showReasons && phase === "result" && result && createPortal(
        <ReasonModal aiName={aiName} result={result} onClose={() => setShowReasons(false)} />,
        document.body
      )}
    </>
  );
}

/* Radar sweep visual, shared by both layouts and both "analysing" and "waiting" phases */
function RadarSweep({ size = 64 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full radar-pulse" style={{ animationDelay: "0s" }} />
      <span className="absolute inset-0 rounded-full radar-pulse" style={{ animationDelay: "1s" }} />
      <div
        className="absolute inset-1 rounded-full flex items-center justify-center"
        style={{ background: "#0d0d14", border: "1px solid rgba(0,194,178,0.35)" }}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="radar-sweep-wedge" />
        </div>
        <RadarIcon size={size * 0.32} className="text-fx-teal relative z-10" />
      </div>
      <style>{`
        .radar-pulse {
          border: 1px solid rgba(0,194,178,0.4);
          animation: radarPulse 2s ease-out infinite;
        }
        @keyframes radarPulse {
          0%   { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .radar-sweep-wedge {
          width: 100%; height: 100%;
          background: conic-gradient(from 0deg, rgba(0,194,178,0.55), transparent 35%);
          animation: radarSpin 1.6s linear infinite;
        }
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .fx-fade-in {
          animation: fxFadeIn 0.35s ease-out;
        }
        @keyframes fxFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* Circular confidence ring */
function ConfidenceRing({ value, size = 46 }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#2a2a3d" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#00c2b2" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-fx-text">
        {value}
      </span>
    </div>
  );
}

function ResultIcon({ direction, size = 16 }) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : direction === "target" ? Target : Minus;
  const color = direction === "up" ? "#00c2b2" : direction === "down" ? "#e8404a" : direction === "target" ? "#f5a623" : "#9ca3af";
  return <Icon size={size} style={{ color }} className="flex-shrink-0" />;
}

/* Desktop card. Explicitly branches on phase, "result" only ever
   renders when `result` is also non null, by construction upstream,
   but the check stays here too as a second line of defense. */
function AdvisoryCard({ phase, statusLine, result, aiName, onOpenReasons }) {
  const showResult = phase === "result" && result;

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col"
      style={{ borderColor: "#2a2a3d", background: "linear-gradient(180deg, #14141f 0%, #101018 100%)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={15} className="text-fx-teal" />
        <p className="text-sm font-semibold text-fx-text">{aiName}</p>
      </div>
      <p className="text-fx-text-dim text-xs mb-5">Live market analysis</p>

      <div className="flex flex-col items-center text-center gap-4 py-2">
        {!showResult ? (
          <div key="thinking" className="fx-fade-in flex flex-col items-center gap-4">
            <RadarSweep size={72} />
            <div>
              <p className="text-fx-text text-sm font-medium">Analysing the market</p>
              <p className="text-fx-text-dim text-xs mt-1 min-h-[1rem]">{statusLine}</p>
            </div>
          </div>
        ) : (
          <div key="result" className="w-full text-left fx-fade-in">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <ResultIcon direction={result.direction} />
                <p className="text-fx-text text-sm font-semibold">{result.headline}</p>
              </div>
              <ConfidenceRing value={result.confidence} />
            </div>
            <p className="text-fx-text-dim text-xs leading-relaxed mb-4">{result.detail}</p>

            <button
              onClick={onOpenReasons}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150"
              style={{ background: "rgba(0,194,178,0.08)", color: "#00c2b2" }}
            >
              See why
              <ChevronRight size={14} />
            </button>

            <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t" style={{ borderColor: "#2a2a3d" }}>
              <span className="text-fx-text-dim">{result.dataPoints} ticks analysed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Mobile floating bar. Same showResult guard as the desktop card,
   this is what actually fixes the blank headline and lone percent
   sign you saw, that branch simply cannot be entered without a real result now. */
function MobileBar({ phase, statusLine, result, aiName, dismissed, onDismiss, onOpenReasons }) {
  const touchStartY = useRef(null);
  const showResult = phase === "result" && result;

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.touches[0].clientY;
    if (delta > 40) onDismiss();
  };

  if (dismissed) return null;

  return (
    <div
      className="fixed top-14 left-0 right-0 z-40 mx-3 rounded-xl border shadow-lg fx-fade-in"
      style={{ borderColor: "#2a2a3d", background: "#13131fee", backdropFilter: "blur(6px)" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div
        className="flex items-center gap-3 px-3 py-2.5"
        onClick={() => showResult && onOpenReasons()}
        role={showResult ? "button" : undefined}
      >
        {!showResult ? (
          <RadarSweep size={36} />
        ) : (
          <div className="flex-shrink-0"><ResultIcon direction={result.direction} /></div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-fx-text truncate">{aiName}</p>
          {!showResult ? (
            <p className="text-fx-text-dim text-[11px] truncate">{statusLine}</p>
          ) : (
            <p className="text-fx-text-dim text-[11px] truncate">{result.headline}, tap for reasons</p>
          )}
        </div>

        {showResult && (
          <span className="text-[11px] font-semibold flex-shrink-0" style={{ color: "#00c2b2" }}>
            {result.confidence}%
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          className="text-fx-text-dim hover:text-fx-text flex-shrink-0 p-1"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* Reasoning modal, only ever mounted (via the portal check above) when
   a real result exists, so no null checks needed inside it. */
function ReasonModal({ aiName, result, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4">
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border p-6 max-h-[85vh] overflow-y-auto"
        style={{ borderColor: "#2a2a3d", background: "#13131f" }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-fx-teal" />
            <p className="text-sm font-semibold text-fx-text">{aiName}, reasoning</p>
          </div>
          <button onClick={onClose} className="text-fx-text-dim hover:text-fx-text">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-4 mb-5">
          <ResultIcon direction={result.direction} size={22} />
          <div>
            <p className="text-fx-text text-sm font-semibold">{result.headline}</p>
            <p className="text-fx-text-dim text-xs mt-0.5">{result.confidence}% confidence, {result.dataPoints} ticks analysed</p>
          </div>
        </div>

        <p className="text-fx-text-dim text-xs leading-relaxed mb-5">{result.detail}</p>

        {result.digitBreakdown && (
          <div className="mb-5">
            <p className="text-fx-text text-xs font-medium mb-2">Last digit frequency, most recent 20 ticks</p>
            <div className="flex items-end gap-1.5 h-24">
              {result.digitBreakdown.map((count, digit) => {
                const max = Math.max(...result.digitBreakdown, 1);
                const heightPct = (count / max) * 100;
                const isHighlighted = result.highlightDigit === digit;
                return (
                  <div key={digit} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${Math.max(heightPct, 4)}%`,
                        background: isHighlighted ? "#00c2b2" : "#2a2a3d",
                        transition: "height 0.4s ease-out",
                      }}
                    />
                    <span className="text-[10px] text-fx-text-dim mt-1">{digit}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-fx-text text-xs font-medium mb-1">What the model looked at</p>
          {result.reasons.map((reason, i) => (
            <div key={i} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg" style={{ background: "#1a1a2e" }}>
              <span className="text-fx-text-dim">{reason.label}</span>
              <span className="text-fx-text font-medium">{reason.value}</span>
            </div>
          ))}
        </div>

        <p className="text-fx-text-dim text-[11px] mt-5 leading-relaxed">
          This analysis is generated from recent tick data using statistical patterns. It is not a guarantee of future price movement.
        </p>
      </div>
    </div>
  );
}

/* Analysis engine, unchanged logic from before, this part was never the bug */

function analyseForContract(ticks, contractType, prediction, side) {
  if (!ticks || ticks.length < 8) return null;
  const recent = ticks.slice(-20);
  const prices = recent.map((t) => Number(t.price));

  switch (contractType) {
    case "EVEN_ODD":
      return analyseEvenOdd(prices);
    case "HIGHER_LOWER":
      return analyseHigherLower(prices);
    case "TOUCH_NO_TOUCH":
      return analyseTouchNoTouch(prices);
    case "OVER_UNDER":
      return analyseOverUnder(prices);
    case "MATCHES_DIFFERS":
      return analyseMatchesDiffers(prices);
    default:
      return analyseRiseFall(prices);
  }
}

function trendSignal(prices) {
  const first = prices[0];
  const last = prices[prices.length - 1];
  const netChangePct = ((last - first) / first) * 100;
  const diffs = prices.slice(1).map((p, i) => Math.abs(p - prices[i]));
  const avgStep = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const volatilityPct = avgStep > 0 ? (avgStep / first) * 100 : 0;
  const signal = volatilityPct > 0 ? netChangePct / (volatilityPct * Math.sqrt(prices.length)) : 0;
  return { signal, volatilityPct, netChangePct, last, avgStep };
}

function lastDigit(price) {
  const str = price.toFixed(2).replace(".", "");
  return Number(str[str.length - 1]);
}

function confidenceFromStrength(strength) {
  return Math.min(92, Math.max(55, Math.round(55 + strength * 37)));
}

function analyseRiseFall(prices) {
  const { signal, netChangePct, volatilityPct } = trendSignal(prices);
  const reasons = [
    { label: "Net price change", value: `${netChangePct.toFixed(3)}%` },
    { label: "Average step size", value: `${volatilityPct.toFixed(4)}%` },
    { label: "Signal strength", value: signal.toFixed(2) },
    { label: "Ticks analysed", value: prices.length },
  ];

  if (signal > 0.4) {
    return {
      direction: "up",
      headline: "Upward momentum detected",
      detail: "Recent ticks show consistent upward movement, a Rise contract aligns with the current trend.",
      confidence: confidenceFromStrength(Math.min(1, Math.abs(signal))),
      dataPoints: prices.length,
      reasons,
    };
  }
  if (signal < -0.4) {
    return {
      direction: "down",
      headline: "Downward momentum detected",
      detail: "Recent ticks show consistent downward movement, a Fall contract aligns with the current trend.",
      confidence: confidenceFromStrength(Math.min(1, Math.abs(signal))),
      dataPoints: prices.length,
      reasons,
    };
  }
  return {
    direction: "flat",
    headline: "No clear directional trend",
    detail: "Price is moving sideways. Directional contracts carry more risk right now, consider waiting or switching contract type.",
    confidence: confidenceFromStrength(0.2),
    dataPoints: prices.length,
    reasons,
  };
}

function analyseHigherLower(prices) {
  const { signal, volatilityPct, last, avgStep } = trendSignal(prices);
  const barrierOffset = Math.max(avgStep * 2, last * 0.0005);
  const direction = signal >= 0 ? "up" : "down";
  const barrier = signal >= 0 ? last + barrierOffset : last - barrierOffset;

  return {
    direction,
    headline: `Suggests ${signal >= 0 ? "Higher" : "Lower"} than ${barrier.toFixed(2)}`,
    detail: `Current price ${last.toFixed(2)} with ${volatilityPct.toFixed(3)}% average volatility supports a barrier ${barrierOffset.toFixed(2)} away from spot.`,
    confidence: confidenceFromStrength(Math.min(1, Math.abs(signal))),
    dataPoints: prices.length,
    reasons: [
      { label: "Current price", value: last.toFixed(2) },
      { label: "Suggested barrier", value: barrier.toFixed(2) },
      { label: "Average volatility", value: `${volatilityPct.toFixed(4)}%` },
      { label: "Signal strength", value: signal.toFixed(2) },
    ],
  };
}

function analyseTouchNoTouch(prices) {
  const { volatilityPct, last, avgStep } = trendSignal(prices);
  const isVolatile = volatilityPct > 0.05;
  const barrierOffset = avgStep * 3;
  const barrier = isVolatile ? last + barrierOffset : last + barrierOffset * 2;

  return {
    direction: "target",
    headline: isVolatile ? `Touch likely near ${barrier.toFixed(2)}` : `No Touch likely beyond ${barrier.toFixed(2)}`,
    detail: isVolatile
      ? "Recent volatility is elevated, price is moving enough that a nearby barrier could plausibly be touched."
      : "Recent volatility is low, price looks likely to stay within a tighter range, favouring No Touch on a wider barrier.",
    confidence: confidenceFromStrength(isVolatile ? 0.6 : 0.5),
    dataPoints: prices.length,
    reasons: [
      { label: "Current price", value: last.toFixed(2) },
      { label: "Suggested barrier", value: barrier.toFixed(2) },
      { label: "Average volatility", value: `${volatilityPct.toFixed(4)}%` },
      { label: "Volatility classed as", value: isVolatile ? "Elevated" : "Low" },
    ],
  };
}

function analyseEvenOdd(prices) {
  const digits = prices.map(lastDigit);
  const evenCount = digits.filter((d) => d % 2 === 0).length;
  const oddCount = digits.length - evenCount;
  const majorityIsEven = evenCount >= oddCount;
  const pct = Math.round((Math.max(evenCount, oddCount) / digits.length) * 100);
  const digitBreakdown = Array(10).fill(0);
  digits.forEach((d) => digitBreakdown[d]++);

  return {
    direction: majorityIsEven ? "up" : "down",
    headline: `Last digit trending ${majorityIsEven ? "EVEN" : "ODD"}`,
    detail: `${pct}% of the last ${digits.length} ticks ended on an ${majorityIsEven ? "even" : "odd"} digit.`,
    confidence: confidenceFromStrength(pct / 100),
    dataPoints: digits.length,
    digitBreakdown,
    reasons: [
      { label: "Even digit count", value: evenCount },
      { label: "Odd digit count", value: oddCount },
      { label: "Majority share", value: `${pct}%` },
    ],
  };
}

function analyseOverUnder(prices) {
  const digits = prices.map(lastDigit);
  const overCount = digits.filter((d) => d > 5).length;
  const underCount = digits.filter((d) => d < 5).length;
  const favoursOver = overCount >= underCount;
  const relevant = favoursOver ? overCount : underCount;
  const pct = Math.round((relevant / digits.length) * 100);
  const digitBreakdown = Array(10).fill(0);
  digits.forEach((d) => digitBreakdown[d]++);

  return {
    direction: favoursOver ? "up" : "down",
    headline: `Suggests ${favoursOver ? "Over" : "Under"} 5`,
    detail: `${pct}% of recent last digits were ${favoursOver ? "above" : "below"} 5.`,
    confidence: confidenceFromStrength(pct / 100),
    dataPoints: digits.length,
    digitBreakdown,
    reasons: [
      { label: "Digits above 5", value: overCount },
      { label: "Digits below 5", value: underCount },
      { label: "Majority share", value: `${pct}%` },
    ],
  };
}

function analyseMatchesDiffers(prices) {
  const digits = prices.map(lastDigit);
  const counts = Array(10).fill(0);
  digits.forEach((d) => counts[d]++);
  const mostFrequentDigit = counts.indexOf(Math.max(...counts));
  const frequency = counts[mostFrequentDigit];
  const pct = Math.round((frequency / digits.length) * 100);
  const suggestMatches = pct >= 20;

  return {
    direction: "target",
    headline: suggestMatches ? `Matches on ${mostFrequentDigit}` : `Differs from ${mostFrequentDigit}`,
    detail: suggestMatches
      ? `${mostFrequentDigit} appeared in ${pct}% of recent ticks, well above the roughly 10% baseline for any single digit.`
      : `${mostFrequentDigit} is the most common recent digit at only ${pct}%, close to baseline, Differs is the statistically safer bet.`,
    confidence: confidenceFromStrength(suggestMatches ? pct / 100 : 0.55),
    dataPoints: digits.length,
    digitBreakdown: counts,
    highlightDigit: mostFrequentDigit,
    reasons: [
      { label: "Most frequent digit", value: mostFrequentDigit },
      { label: "Its frequency", value: `${pct}%` },
      { label: "Baseline for any digit", value: "10%" },
    ],
  };
}