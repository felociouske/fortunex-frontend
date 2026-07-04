import { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Receipt } from "lucide-react";
import { cashierAPI } from "../../api/cashier";
import DashboardNavbar from "../../components/DashboardNavbar";

const STATUS_COLORS = {
  APPROVED:   { bg: "rgba(0,194,178,0.12)", text: "#00c2b2" },
  PROCESSING: { bg: "rgba(255,193,7,0.12)", text: "#ffc107" },
  PENDING:    { bg: "rgba(255,193,7,0.12)", text: "#ffc107" },
  REJECTED:   { bg: "rgba(232,64,74,0.12)", text: "#e8404a" },
  FAILED:     { bg: "rgba(232,64,74,0.12)", text: "#e8404a" },
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: "rgba(255,255,255,0.06)", text: "#9ca3af" };
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: colors.bg, color: colors.text }}
    >
      {status}
    </span>
  );
}

function TypeBadge({ type }) {
  const isDeposit = type === "DEPOSIT";
  const Icon = isDeposit ? ArrowDownCircle : ArrowUpCircle;
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap" style={{ color: isDeposit ? "#00c2b2" : "#e8404a" }}>
      <Icon size={14} />
      <span className="text-sm font-medium">{isDeposit ? "Deposit" : "Withdrawal"}</span>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(0,194,178,0.08)" }}>
        <Receipt size={24} style={{ color: "#00c2b2", opacity: 0.6 }} />
      </div>
      <p className="text-fx-text text-sm font-medium mb-1">No transactions yet</p>
      <p className="text-fx-text-dim text-xs max-w-xs leading-relaxed">
        Your deposits and withdrawals will show up here.
      </p>
    </div>
  );
}

function Skeleton({ className }) {
  return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "#1a1a2e" }} />;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cashierAPI.transactions()
      .then(({ data }) => setTransactions(data.transactions))
      .catch(() => setError("Unable to load your transaction history."));
  }, []);

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-fx-text">Statements</h1>
          <p className="text-fx-text-dim text-sm mt-1">All your deposits and withdrawals in one place.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "#e8404a33", background: "#e8404a11", color: "#e8404a" }}>
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-fx-border bg-fx-surface p-6">
          {transactions === null && !error && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          )}

          {transactions?.length === 0 && <EmptyState />}

          {transactions?.length > 0 && (
            // Same horizontal-scroll pattern as the affiliate table --
            // narrow screens scroll sideways instead of squashing columns.
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[720px] text-sm border-collapse">
                <thead>
                  <tr className="border-b border-fx-border">
                    <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Type</th>
                    <th className="text-right font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Amount</th>
                    <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Method</th>
                    <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Detail</th>
                    <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Status</th>
                    <th className="text-right font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-fx-border/60 last:border-0 hover:bg-white/[0.02]">
                      <td className="py-3 pr-4"><TypeBadge type={t.type} /></td>
                      <td className="py-3 pr-4 text-right font-semibold whitespace-nowrap" style={{ color: t.type === "DEPOSIT" ? "#00c2b2" : "#e8404a" }}>
                        {t.type === "DEPOSIT" ? "+" : "-"}{t.currency} {Number(t.amount).toFixed(2)}
                      </td>
                      <td className="py-3 pr-4 text-fx-text-dim whitespace-nowrap">{t.method}</td>
                      <td className="py-3 pr-4 text-fx-text-dim whitespace-nowrap">{t.detail}</td>
                      <td className="py-3 pr-4"><StatusBadge status={t.status} /></td>
                      <td className="py-3 text-fx-text-dim text-right whitespace-nowrap">
                        {new Date(t.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}