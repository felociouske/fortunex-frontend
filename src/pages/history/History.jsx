import { useEffect, useState } from "react";
import { History as HistoryIcon, TrendingUp, TrendingDown } from "lucide-react";
import { tradingAPI } from "../../api/trading";
import DashboardNavbar from "../../components/DashboardNavbar";

const CONTRACT_LABELS = {
  RISE_FALL: "Rise/Fall",
  EVEN_ODD: "Even/Odd",
  HIGHER_LOWER: "Higher/Lower",
  OVER_UNDER: "Over/Under",
  MATCHES_DIFFERS: "Matches/Differs",
  TOUCH_NO_TOUCH: "Touch/No Touch",
};

/**
 * Turns the raw contract_type plus side or prediction into one human
 * readable string per row, since each contract type stores its detail
 * differently on the backend (side for Rise/Fall, a JSON prediction
 * object for everything else).
 */
function describePrediction(position) {
  if (position.contract_type === "RISE_FALL") return position.side;
  const p = position.prediction || {};
  if (position.contract_type === "EVEN_ODD") return p.parity;
  if (position.contract_type === "HIGHER_LOWER") return `${p.direction} ${p.barrier ?? ""}`.trim();
  if (position.contract_type === "OVER_UNDER") return `${p.direction} ${p.digit ?? ""}`.trim();
  if (position.contract_type === "MATCHES_DIFFERS") return `${p.mode} ${p.digit ?? ""}`.trim();
  if (position.contract_type === "TOUCH_NO_TOUCH") return `${p.mode} ${p.barrier ?? ""}`.trim();
  return "";
}

function StatusBadge({ status }) {
  const isWon = status === "WON";
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{
        background: isWon ? "rgba(0,194,178,0.12)" : "rgba(232,64,74,0.12)",
        color: isWon ? "#00c2b2" : "#e8404a",
      }}
    >
      {status}
    </span>
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-fx-border bg-fx-surface p-5">
      <p className="text-fx-text-dim text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color: accent ? "#00c2b2" : "#e5e7eb" }}>{value}</p>
    </div>
  );
}

function Skeleton({ className }) {
  return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "#1a1a2e" }} />;
}

export default function History() {
  const [positions, setPositions] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    tradingAPI.getPositionHistory()
      .then(({ data }) => setPositions(data))
      .catch(() => setError("Unable to load your trade history."));
  }, []);

  const wonCount = positions?.filter((p) => p.status === "WON").length ?? 0;
  const lostCount = positions?.filter((p) => p.status === "LOST").length ?? 0;
  const total = wonCount + lostCount;
  const winRate = total ? Math.round((wonCount / total) * 100) : 0;
  const netProfitLoss = positions?.reduce((sum, p) => sum + Number(p.profit_loss || 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-fx-text">Trade history</h1>
          <p className="text-fx-text-dim text-sm mt-1">All your settled contracts, most recent first.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "#e8404a33", background: "#e8404a11", color: "#e8404a" }}>
            {error}
          </div>
        )}

        {positions === null && !error && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
            <Skeleton className="h-64" />
          </div>
        )}

        {positions && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard label="Total trades" value={total} />
              <SummaryCard label="Won" value={wonCount} accent />
              <SummaryCard
                label="Net profit and loss"
                value={`${netProfitLoss >= 0 ? "+" : ""}${netProfitLoss.toFixed(2)} USD`}
              />
            </div>

            <div className="rounded-2xl border border-fx-border bg-fx-surface p-6">
              {positions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(0,194,178,0.08)" }}>
                    <HistoryIcon size={24} style={{ color: "#00c2b2", opacity: 0.6 }} />
                  </div>
                  <p className="text-fx-text text-sm font-medium mb-1">No trades yet</p>
                  <p className="text-fx-text-dim text-xs max-w-xs leading-relaxed">
                    Your settled contracts will show up here once you place and finish a trade.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2 px-2">
                  <table className="w-full min-w-[820px] text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-fx-border">
                        <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Instrument</th>
                        <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Contract</th>
                        <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Prediction</th>
                        <th className="text-right font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Stake</th>
                        <th className="text-right font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Profit and loss</th>
                        <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Status</th>
                        <th className="text-right font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5">Closed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((p) => {
                        const isProfit = Number(p.profit_loss) >= 0;
                        return (
                          <tr key={p.id} className="border-b border-fx-border/60 last:border-0 hover:bg-white/[0.02]">
                            <td className="py-3 pr-4 text-fx-text font-medium whitespace-nowrap">{p.instrument?.symbol}</td>
                            <td className="py-3 pr-4 text-fx-text-dim whitespace-nowrap">{CONTRACT_LABELS[p.contract_type] || p.contract_type}</td>
                            <td className="py-3 pr-4 text-fx-text-dim whitespace-nowrap flex items-center gap-1.5">
                              {p.contract_type === "RISE_FALL" && (p.side === "RISE" ? <TrendingUp size={13} className="text-fx-teal" /> : <TrendingDown size={13} className="text-fx-red" />)}
                              {describePrediction(p)}
                            </td>
                            <td className="py-3 pr-4 text-right text-fx-text-dim whitespace-nowrap">${Number(p.stake).toFixed(2)}</td>
                            <td className="py-3 pr-4 text-right font-semibold whitespace-nowrap" style={{ color: isProfit ? "#00c2b2" : "#e8404a" }}>
                              {isProfit ? "+" : ""}{Number(p.profit_loss).toFixed(2)}
                            </td>
                            <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                            <td className="py-3 text-fx-text-dim text-right whitespace-nowrap">
                              {p.closed_at ? new Date(p.closed_at).toLocaleString() : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}