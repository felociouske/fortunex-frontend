import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bell, ShieldAlert, Wallet, Banknote, Sparkles, AlertTriangle, Check } from "lucide-react";
import { notificationsAPI } from "../api/notifications";

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

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Notification bell + dropdown, mounted in DashboardNavbar. Polls
 * every 30s (notifications aren't latency-sensitive the way live
 * trading data is, so a WebSocket felt like overkill here) and shows
 * up to 6 most recent in the dropdown, with a link through to the
 * full notifications page for everything else.
 */
export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsAPI.list(),
    refetchInterval: 30000,
  });

  const notifications = data?.data?.results || [];
  const unreadCount = data?.data?.unread_count || 0;
  const preview = notifications.slice(0, 6);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await notificationsAPI.markRead(notification.id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
    if (notification.action_url) {
      setOpen(false);
      navigate(notification.action_url);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationsAPI.markAllRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-fx-text-dim hover:text-fx-text hover:bg-white/5 transition-colors duration-150"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
            style={{ background: "#e8404a", fontSize: 9, fontWeight: 700 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-fx-border bg-fx-surface shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-fx-border">
            <h3 className="font-semibold text-fx-text text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-fx-teal hover:underline flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {preview.length === 0 ? (
              <div className="px-4 py-8 text-center text-fx-text-dim text-sm">
                You're all caught up.
              </div>
            ) : (
              preview.map((n) => {
                const Icon = CATEGORY_ICON[n.category] || Bell;
                const color = CATEGORY_COLOR[n.category] || "#9ca3af";
                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-fx-surface2 transition-colors duration-150 border-b border-fx-border last:border-b-0"
                    style={!n.read ? { background: "rgba(0,194,178,0.04)" } : undefined}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}1A` }}
                    >
                      <Icon size={15} style={{ color }} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-sm ${!n.read ? "font-semibold text-fx-text" : "text-fx-text-dim"}`}>
                          {n.title}
                        </span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-fx-teal flex-shrink-0" />}
                      </span>
                      <span className="block text-xs text-fx-text-dim mt-0.5 line-clamp-2">
                        {n.message}
                      </span>
                      <span className="block text-xs text-fx-text-dim mt-1 opacity-70">
                        {timeAgo(n.created_at)}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <button
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
            className="w-full text-center text-sm text-fx-teal py-3 border-t border-fx-border hover:bg-fx-surface2 transition-colors duration-150"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}