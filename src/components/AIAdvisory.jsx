import { useMemo } from "react";
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";

/**
 * Rule-based trend commentary, shown persistently near the chart only
 * when the user's active automation is an AI (any of the 4 tiers).
 * Per product decision this is NOT a real ML/LLM analysis -- it's a
 * simple recent-tick-trend read, framed as "the AI's" commentary.
 *
 * Also recommends a bot to automate the suggested trade, since AIs are
 * meant to nudge users toward pairing with a bot for execution.
 */
export default function AIAdvisory({ ticks, aiName }) {
  const analysis = useMemo(() => analyseTrend(ticks), [ticks]);

  if (!analysis) {
    return (
      <div className="rounded-xl border border-fx-border bg-fx-surface2 px-4 py-3 flex items-center gap-2 text-sm text-fx-text-dim">
        <Sparkles size={16} className="text-fx-teal flex-shrink-0" />
        <span>{aiName} is gathering live data — analysis will appear shortly.</span>
      </div>
    );
  }

  const { direction, label, suggestion } = analysis;
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const color = direction === "up" ? "#00c2b2" : direction === "down" ? "#e8404a" : "#9ca3af";

  return (
    <div
      className="rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      style={{ borderColor: "#2a2a3d", background: "rgba(0,194,178,0.04)" }}
    >
      <div className="flex items-start gap-2.5">
        <Sparkles size={16} className="text-fx-teal flex-shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-fx-text">
            <Icon size={14} style={{ color }} />
            {label}
          </div>
          <p className="text-fx-text-dim text-xs mt-0.5">{suggestion}</p>
        </div>
      </div>
      <span className="text-xs text-fx-text-dim flex-shrink-0">via {aiName}</span>
    </div>
  );
}

/**
 * Reads the last ~20 ticks and classifies the trend by net movement
 * relative to its own volatility (so it adapts to each instrument's
 * scale rather than using a fixed price-delta threshold).
 */
function analyseTrend(ticks) {
  if (!ticks || ticks.length < 8) return null;

  const recent = ticks.slice(-20);
  const prices = recent.map((t) => Number(t.price));
  const first = prices[0];
  const last = prices[prices.length - 1];
  const netChangePct = ((last - first) / first) * 100;

  const diffs = prices.slice(1).map((p, i) => Math.abs(p - prices[i]));
  const avgStep = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const volatilityPct = (avgStep / first) * 100;

  // Net move relative to typical step size -- a simple, scale-adaptive
  // "is this a real trend or just noise" heuristic.
  const signal = volatilityPct > 0 ? netChangePct / (volatilityPct * Math.sqrt(recent.length)) : 0;

  if (signal > 0.4) {
    return {
      direction: "up",
      label: "Market trending upward",
      suggestion: "Recent ticks show consistent upward movement. Consider a Rise contract, or pair with a bot to automate it.",
    };
  }
  if (signal < -0.4) {
    return {
      direction: "down",
      label: "Market trending downward",
      suggestion: "Recent ticks show consistent downward movement. Consider a Fall contract, or pair with a bot to automate it.",
    };
  }
  return {
    direction: "flat",
    label: "Market moving sideways",
    suggestion: "No strong directional trend right now. Even/Odd or Matches/Differs contracts may suit choppy conditions better.",
  };
}