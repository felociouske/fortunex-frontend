import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, Timer } from "lucide-react";
import { tradingAPI } from "../api/trading";
import usePositionsSocket from "../hooks/usePositionsSocket";

/**
 * OpenPositions — three rendering variants controlled by `variant` prop:
 *
 *  "desktop-sidebar"  Persistent left panel (260px). Appears when trades are
 *                     open, disappears (parent hides it) when count hits 0.
 *                     Reports count up via onCountChange.
 *
 *  "mobile-card"      Slides down from top of the Trade tab. Shows only the
 *                     most-recently-opened position. Auto-hides when settled.
 *
 *  "mobile-list"      Full scrollable list for the Positions tab. Always
 *                     visible; shows empty state when nothing is open.
 */
export default function OpenPositions({
  variant = "desktop-sidebar",
  onCountChange,
}) {
  const queryClient   = useQueryClient();
  const { lastEvent } = usePositionsSocket();

  const [overlay,     setOverlay]     = useState({});   // id → { current_price, profit_loss }
  const [justSettled, setJustSettled] = useState({});   // id → settle event

  const { data, isLoading } = useQuery({
    queryKey:       ["openPositions"],
    queryFn:        tradingAPI.getOpenPositions,
    refetchInterval: 30000,
  });
  const positions = data?.data || [];

  // ── WebSocket event handler ────────────────────────────────────────────────
  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.event === "opened") {
      queryClient.invalidateQueries({ queryKey: ["openPositions"] });
      return;
    }

    if (lastEvent.event === "mark") {
      setOverlay((prev) => ({
        ...prev,
        [lastEvent.id]: {
          current_price: lastEvent.current_price,
          profit_loss:   lastEvent.profit_loss,
        },
      }));
    }

    if (lastEvent.event === "settled") {
      setJustSettled((prev) => ({ ...prev, [lastEvent.id]: lastEvent }));
      queryClient.invalidateQueries({ queryKey: ["openPositions"] });
      queryClient.invalidateQueries({ queryKey: ["positionHistory"] });
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });

      const t = setTimeout(() => {
        setJustSettled((prev) => {
          const next = { ...prev };
          delete next[lastEvent.id];
          return next;
        });
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [lastEvent, queryClient]);

  // ── Merged list (REST + live overlay) ────────────────────────────────────
  const merged = useMemo(
    () =>
      positions.map((p) => ({
        ...p,
        current_price: overlay[p.id]?.current_price ?? p.current_price,
        profit_loss:   overlay[p.id]?.profit_loss   ?? p.profit_loss,
      })),
    [positions, overlay]
  );

  const totalPl = useMemo(
    () => merged.reduce((sum, p) => sum + Number(p.profit_loss || 0), 0),
    [merged]
  );

  const settledBanners  = Object.values(justSettled);
  const totalCount      = merged.length + settledBanners.length;

  // Report count to parent (Dashboard uses it to show/hide desktop sidebar
  // and badge the mobile tab).
  useEffect(() => {
    onCountChange?.(totalCount);
  }, [totalCount, onCountChange]);

  // ── Shared position card ──────────────────────────────────────────────────
  function PositionCard({ position, compact = false }) {
    const pl    = Number(position.profit_loss || 0);
    const isPos = pl >= 0;

    return (
      <div
        className="rounded-2xl border border-fx-border p-3 space-y-3"
        style={{ background: "linear-gradient(135deg,#171821,#11121b)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs text-fx-text-dim">{position.instrument?.symbol}</div>
            <div className={`font-semibold ${compact ? "text-sm" : "text-base"}`}>
              {position.instrument?.name}
            </div>
          </div>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
            style={
              position.side === "RISE" || position.side === "BUY"
                ? { background: "#073a37", color: "#5eead4" }
                : { background: "#3d121b", color: "#fca5a5" }
            }
          >
            {position.side}
          </span>
        </div>

        {/* P/L + price row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-2.5" style={{ background: "#0d0d18" }}>
            <div className="text-xs text-fx-text-dim uppercase tracking-wide mb-1">P/L</div>
            <div
              className={`font-bold tabular-nums ${compact ? "text-sm" : "text-base"}`}
              style={{ color: isPos ? "#00c2b2" : "#e8404a" }}
            >
              {isPos ? "+" : "−"}${Math.abs(pl).toFixed(2)}
            </div>
          </div>
          <div className="rounded-xl p-2.5" style={{ background: "#0d0d18" }}>
            <div className="text-xs text-fx-text-dim uppercase tracking-wide mb-1">Price</div>
            <div className={`font-bold tabular-nums text-fx-text ${compact ? "text-sm" : "text-base"}`}>
              {Number(position.current_price).toFixed(4)}
            </div>
          </div>
        </div>

        {/* Stake + entry */}
        {!compact && (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-2.5" style={{ background: "#0d0d18" }}>
              <div className="text-xs text-fx-text-dim mb-1">Stake</div>
              <div className="text-sm font-semibold text-white">
                ${Number(position.stake).toFixed(2)}
              </div>
            </div>
            <div className="rounded-xl p-2.5" style={{ background: "#0d0d18" }}>
              <div className="text-xs text-fx-text-dim mb-1">Entry</div>
              <div className="text-sm font-semibold text-white tabular-nums">
                {Number(position.entry_price).toFixed(4)}
              </div>
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="text-xs text-fx-text-dim">
          {new Date(position.opened_at).toLocaleTimeString()} ·{" "}
          {position.duration_value} {position.duration_unit}
        </div>
      </div>
    );
  }

  // ── Settled result banner ─────────────────────────────────────────────────
  function SettledBanner({ evt }) {
    const won = evt.status === "WON";
    const pl  = Number(evt.profit_loss);
    return (
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{
          background: won ? "rgba(0,194,178,0.10)" : "rgba(232,64,74,0.10)",
          border:     `1px solid ${won ? "rgba(0,194,178,0.3)" : "rgba(232,64,74,0.3)"}`,
        }}
      >
        <Flag size={16} style={{ color: won ? "#00c2b2" : "#e8404a", flexShrink: 0 }} />
        <div className="flex-1">
          <div
            className="text-sm font-bold"
            style={{ color: won ? "#00c2b2" : "#e8404a" }}
          >
            {won ? "Contract won" : "Contract lost"}
          </div>
          <div className="text-xs text-fx-text-dim">
            {pl >= 0 ? "+" : ""}${Math.abs(pl).toFixed(2)} USD
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VARIANT: desktop-sidebar
  // ════════════════════════════════════════════════════════════════════════════
  if (variant === "desktop-sidebar") {
    // When nothing is open and nothing just settled, render nothing
    // (parent will hide the column anyway via hasPositions state).
    if (!isLoading && merged.length === 0 && settledBanners.length === 0) {
      return null;
    }

    return (
      <aside
        className="rounded-2xl border border-fx-border flex flex-col"
        style={{ background: "#0d0d18", minHeight: 200 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-fx-border">
          <h3 className="text-sm font-bold text-fx-text">Open positions</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(0,194,178,0.12)", color: "#00c2b2" }}
          >
            {merged.length}
          </span>
        </div>

        {/* Position list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-200px)]">
          {isLoading && (
            <div className="text-fx-text-dim text-xs px-1">Loading…</div>
          )}

          {settledBanners.map((evt) => (
            <SettledBanner key={evt.id} evt={evt} />
          ))}

          {merged.map((pos) => (
            <PositionCard key={pos.id} position={pos} compact />
          ))}
        </div>

        {/* Footer total */}
        <div className="px-4 py-3 border-t border-fx-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-fx-text-dim">{merged.length} open position{merged.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-fx-text-dim font-medium">Total P/L</span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: totalPl >= 0 ? "#00c2b2" : "#e8404a" }}
            >
              {totalPl >= 0 ? "+" : "−"}${Math.abs(totalPl).toFixed(2)} USD
            </span>
          </div>
        </div>
      </aside>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VARIANT: mobile-card  (slides down from top, shows latest position)
  // ════════════════════════════════════════════════════════════════════════════
  if (variant === "mobile-card") {
    const latestSettled = settledBanners[settledBanners.length - 1] ?? null;
    const latestOpen    = merged[merged.length - 1] ?? null;

    // Nothing to show
    if (!latestOpen && !latestSettled) return null;

    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: "1px solid",
          borderColor: latestSettled
            ? latestSettled.status === "WON" ? "rgba(0,194,178,0.3)" : "rgba(232,64,74,0.3)"
            : "#2a2a3d",
          background: "#0d0d18",
          // Slide-down animation via CSS
          animation: "slideDown 0.3s ease",
        }}
      >
        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Settled result takes priority */}
        {latestSettled ? (
          <div className="px-4 py-4 flex items-center gap-3">
            {/* Checkered flag icon circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: latestSettled.status === "WON"
                  ? "rgba(0,194,178,0.15)"
                  : "rgba(232,64,74,0.15)",
              }}
            >
              <Flag
                size={18}
                style={{ color: latestSettled.status === "WON" ? "#00c2b2" : "#e8404a" }}
              />
            </div>
            <div>
              <div
                className="text-base font-bold"
                style={{ color: latestSettled.status === "WON" ? "#00c2b2" : "#e8404a" }}
              >
                {latestSettled.status === "WON" ? "Profit" : "Loss"}:{" "}
                {Number(latestSettled.profit_loss) >= 0 ? "+" : ""}
                {Number(latestSettled.profit_loss).toFixed(2)} USD
              </div>
              <div className="text-xs text-fx-text-dim mt-0.5">
                {latestSettled.contract_type || "Contract"} ·{" "}
                {latestSettled.instrument_name || ""}
              </div>
            </div>
          </div>
        ) : latestOpen ? (
          <div className="px-4 py-4 flex items-center gap-3">
            {/* Timer icon circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,194,178,0.10)" }}
            >
              <Timer size={18} style={{ color: "#00c2b2" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-fx-text">
                Stake: ${Number(latestOpen.stake).toFixed(2)} USD
              </div>
              <div className="text-xs text-fx-text-dim mt-0.5 truncate">
                {latestOpen.side} · {latestOpen.instrument?.name}
              </div>
            </div>
            {/* Live P/L badge */}
            <div
              className="text-sm font-bold tabular-nums flex-shrink-0"
              style={{
                color: Number(latestOpen.profit_loss) >= 0 ? "#00c2b2" : "#e8404a",
              }}
            >
              {Number(latestOpen.profit_loss) >= 0 ? "+" : ""}
              {Number(latestOpen.profit_loss).toFixed(2)}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VARIANT: mobile-list  (Positions tab — full scrollable list)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* Settled banners */}
      {settledBanners.map((evt) => (
        <SettledBanner key={evt.id} evt={evt} />
      ))}

      {/* Open positions */}
      {isLoading ? (
        <div className="text-fx-text-dim text-sm">Loading positions…</div>
      ) : merged.length ? (
        <>
          {merged.map((pos) => (
            <PositionCard key={pos.id} position={pos} />
          ))}
          {/* Total footer */}
          <div
            className="rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{ background: "#0d0d18", border: "1px solid #2a2a3d" }}
          >
            <span className="text-sm text-fx-text-dim">
              {merged.length} open position{merged.length !== 1 ? "s" : ""}
            </span>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: totalPl >= 0 ? "#00c2b2" : "#e8404a" }}
            >
              Total P/L: {totalPl >= 0 ? "+" : "−"}${Math.abs(totalPl).toFixed(2)} USD
            </span>
          </div>
        </>
      ) : (
        <div
          className="rounded-2xl border border-fx-border p-8 text-center"
          style={{ background: "#0d0d18" }}
        >
          <div className="text-fx-text-dim text-sm">No open positions currently.</div>
          <div className="text-fx-text-dim text-xs mt-1">
            Place a trade on the Trade tab to get started.
          </div>
        </div>
      )}
    </div>
  );
}