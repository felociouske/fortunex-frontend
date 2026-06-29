import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardNavbar from "../../components/DashboardNavbar";
import Chart from "../../components/Chart";
import Contracts from "../../components/Contracts";
import OpenPositions from "../../components/OpenPositions";
import InstrumentPicker from "../../components/InstrumentPicker";
import AIAdvisory from "../../components/AIAdvisory";
import { tradingAPI } from "../../api/trading";
import { walletAPI } from "../../api/market";

/**
 * Dashboard layout:
 *
 * DESKTOP (xl+)
 *   - No trades open:  [chart full-width] | [contracts sidebar]
 *   - Trades open:     [positions panel] [chart] | [contracts sidebar]
 *
 * MOBILE (<xl)
 *   - Bottom tab bar: "Trade" (chart) | "Positions"
 *   - Active position card slides down from top of chart view
 *   - Settled position shows result card briefly then disappears
 */
export default function Dashboard() {
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [chartTicks, setChartTicks]   = useState([]);
  const [mobileTab, setMobileTab]     = useState("trade"); // "trade" | "positions"
  const [hasPositions, setHasPositions] = useState(false); // driven up from OpenPositions

  const { data: marketData } = useQuery({
    queryKey: ["marketInstruments"],
    queryFn:  tradingAPI.getMarket,
  });
  const instruments = marketData?.data || [];

  const { data: walletData } = useQuery({
    queryKey: ["walletBalance"],
    queryFn:  walletAPI.getBalance,
  });
  const wallet = walletData?.data;

  const { data: tierData } = useQuery({
    queryKey: ["myTier"],
    queryFn:  tradingAPI.getMyTier,
    staleTime: 30000,
  });
  const tier       = tierData?.data;
  const isAIActive = tier?.active_automation?.kind === "AI";

  const handleTicksUpdate = useCallback((ticks) => setChartTicks(ticks), []);

  useEffect(() => {
    if (!selectedInstrument && instruments.length > 0) {
      setSelectedInstrument(instruments[0]);
    }
  }, [instruments, selectedInstrument]);

  // When a new trade opens on mobile, auto-switch to trade tab so the
  // slide-down card is visible over the chart.
  const handlePositionsChange = useCallback((count) => {
    setHasPositions(count > 0);
  }, []);

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto py-4 sm:py-6 px-3 sm:px-4 pb-20 xl:pb-6">

        {/* ── Instrument picker row ──────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">Trade</h1>
          <InstrumentPicker
            instruments={instruments}
            selected={selectedInstrument}
            onSelect={setSelectedInstrument}
          />
        </div>

        {/* ── Desktop layout ─────────────────────────────────────────────── */}
        {/*
            Grid columns:
              no trades  → positions panel hidden, chart+contracts share space
              has trades → [240px positions] [1fr chart] [360px contracts]
        */}
        <section
          className="hidden xl:grid gap-4 items-start transition-all duration-300"
          style={{
            gridTemplateColumns: hasPositions
              ? "260px 1fr 360px"
              : "1fr 360px",
          }}
        >
          {/* Positions sidebar — desktop only, visible when trades exist */}
          {hasPositions && (
            <OpenPositions
              variant="desktop-sidebar"
              onCountChange={handlePositionsChange}
            />
          )}

          {/* Chart column */}
          <div className="space-y-4">
            {selectedInstrument ? (
              <Chart
                symbol={selectedInstrument.symbol}
                instrumentName={selectedInstrument.name}
                onTicksUpdate={handleTicksUpdate}
              />
            ) : (
              <div className="rounded-2xl border border-fx-border bg-[#0a0a12] p-8 text-center text-fx-text-dim">
                Loading instruments…
              </div>
            )}
            {isAIActive && (
              <AIAdvisory ticks={chartTicks} aiName={tier.active_automation.name} />
            )}
          </div>

          {/* Contracts sidebar */}
          <aside>
            <Contracts instrument={selectedInstrument} wallet={wallet} />
          </aside>
        </section>

        {/* Hidden OpenPositions on desktop when no trades — still mounts
            so it can report count=0 back up */}
        {!hasPositions && (
          <div className="hidden xl:block">
            <OpenPositions
              variant="desktop-sidebar"
              onCountChange={handlePositionsChange}
            />
          </div>
        )}

        {/* ── Mobile layout ──────────────────────────────────────────────── */}
        <div className="xl:hidden">

          {/* Trade tab: chart + floating position card */}
          {mobileTab === "trade" && (
            <div className="relative space-y-4">
              {/* Slide-down position card (renders on top of chart area) */}
              <OpenPositions
                variant="mobile-card"
                onCountChange={handlePositionsChange}
              />

              {selectedInstrument ? (
                <Chart
                  symbol={selectedInstrument.symbol}
                  instrumentName={selectedInstrument.name}
                  onTicksUpdate={handleTicksUpdate}
                />
              ) : (
                <div className="rounded-2xl border border-fx-border bg-[#0a0a12] p-8 text-center text-fx-text-dim">
                  Loading instruments…
                </div>
              )}

              {isAIActive && (
                <AIAdvisory ticks={chartTicks} aiName={tier.active_automation.name} />
              )}

              <Contracts instrument={selectedInstrument} wallet={wallet} />
            </div>
          )}

          {/* Positions tab: full list */}
          {mobileTab === "positions" && (
            <OpenPositions
              variant="mobile-list"
              onCountChange={handlePositionsChange}
            />
          )}
        </div>
      </main>

      {/* ── Mobile bottom tab bar ──────────────────────────────────────────── */}
      <nav
        className="xl:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-fx-border"
        style={{ background: "#13131f" }}
      >
        {[
          { key: "trade",     label: "Trade",     icon: TradeIcon },
          { key: "positions", label: "Positions", icon: PositionsIcon },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMobileTab(key)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-150"
          >
            <Icon
              size={20}
              active={mobileTab === key}
              count={key === "positions" && hasPositions ? 1 : 0}
            />
            <span
              className="text-xs font-medium"
              style={{ color: mobileTab === key ? "#00c2b2" : "#6b7280" }}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Tab bar icons ────────────────────────────────────────────────────────────

function TradeIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polyline
        points="3,17 9,11 13,15 21,7"
        stroke={active ? "#00c2b2" : "#6b7280"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PositionsIcon({ size, active, count }) {
  return (
    <div className="relative">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle
          cx="12" cy="12" r="9"
          stroke={active ? "#00c2b2" : "#6b7280"}
          strokeWidth="2"
        />
        <polyline
          points="12,7 12,12 15,15"
          stroke={active ? "#00c2b2" : "#6b7280"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
          style={{ background: "#e8404a", fontSize: 9, fontWeight: 700 }}
        >
          {count}
        </span>
      )}
    </div>
  );
}