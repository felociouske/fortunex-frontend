import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Wallet, Banknote, Sparkles, AlertTriangle, Bell, Check } from "lucide-react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { notificationsAPI } from "../../api/notifications";

const CATEGORY_ICON = {
  KYC: ShieldAlert,
  DEPOSIT: Wallet,
  WITHDRAWAL: Banknote,
  PROMOTIONAL: Sparkles,
  SYSTEM: AlertTriangle,
};

const CATEGORY_COLOR = {
  KYC: "#e8404a",
  DEPOSIT: "#00c2b2",
  WITHDRAWAL: "#00c2b2",
  PROMOTIONAL: "#a78bfa",
  SYSTEM: "#e8404a",
};

const CATEGORY_LABEL = {
  KYC: "Verification",
  DEPOSIT: "Deposits",
  WITHDRAWAL: "Withdrawals",
  PROMOTIONAL: "Promotions",
  SYSTEM: "System",
};

const FILTERS = ["ALL", "KYC", "DEPOSIT", "WITHDRAWAL", "PROMOTIONAL", "SYSTEM"];

function formatDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsAPI.list(),
  });

  const all = data?.data?.results || [];
  const unreadCount = data?.data?.unread_count || 0;
  const filtered = filter === "ALL" ? all : all.filter((n) => n.category === filter);

  const handleClick = async (n) => {
    if (!n.read) {
      await notificationsAPI.markRead(n.id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
    if (n.action_url) navigate(n.action_url);
  };

  const handleMarkAllRead = async () => {
    await notificationsAPI.markAllRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />

      <main className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <p className="text-fx-text-dim text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-sm text-fx-teal hover:underline"
            >
              <Check size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150"
              style={
                filter === f
                  ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                  : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
              }
            >
              {f === "ALL" ? "All" : CATEGORY_LABEL[f]}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-fx-border bg-fx-surface overflow-hidden">
          {isLoading ? (
            <div className="px-6 py-12 text-center text-fx-text-dim">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Bell size={28} className="text-fx-text-dim mx-auto mb-3 opacity-50" />
              <p className="text-fx-text-dim text-sm">No notifications here yet.</p>
            </div>
          ) : (
            filtered.map((n) => {
              const Icon = CATEGORY_ICON[n.category] || Bell;
              const color = CATEGORY_COLOR[n.category] || "#9ca3af";
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className="w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-fx-surface2 transition-colors duration-150 border-b border-fx-border last:border-b-0"
                  style={!n.read ? { background: "rgba(0,194,178,0.04)" } : undefined}
                >
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}1A` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-3">
                      <span className={`text-sm ${!n.read ? "font-semibold text-fx-text" : "text-fx-text-dim"}`}>
                        {n.title}
                      </span>
                      <span className="text-xs text-fx-text-dim flex-shrink-0">{formatDate(n.created_at)}</span>
                    </span>
                    <span className="block text-sm text-fx-text-dim mt-1">{n.message}</span>
                    {n.action_url && (
                      <span className="inline-block text-xs text-fx-teal font-medium mt-2">
                        {n.action_label || "View"} →
                      </span>
                    )}
                  </span>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-fx-teal flex-shrink-0 mt-1.5" />}
                </button>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}