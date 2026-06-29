import { useEffect, useState } from "react";
import { Copy, Check, Users, DollarSign, TrendingUp, Link2, ChevronRight, Clock } from "lucide-react";
import { affiliateAPI } from "../../api/affiliate";
import DashboardNavbar from "../../components/DashboardNavbar";

function copyToClipboard(text, onSuccess) {
  navigator.clipboard.writeText(text).then(onSuccess);
}

function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div
      className="rounded-2xl border border-fx-border bg-fx-surface p-5 flex items-start gap-4"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accent ? "rgba(0,194,178,0.12)" : "rgba(255,255,255,0.05)" }}
      >
        <Icon
          size={18}
          style={{ color: accent ? "#00c2b2" : "#9ca3af" }}
        />
      </div>
      <div>
        <p className="text-fx-text-dim text-xs font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p
          className="text-xl font-bold"
          style={{ color: accent ? "#00c2b2" : "#e5e7eb" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Referral Link Box
// ---------------------------------------------------------------------------

function ReferralLinkBox({ code }) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `${window.location.origin}/register?referral_code=${code}`;

  const handleCopy = () => {
    copyToClipboard(referralUrl, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-2xl border border-fx-border bg-fx-surface p-6">
      <div className="flex items-center gap-2 mb-1">
        <Link2 size={15} className="text-fx-teal" />
        <p className="text-fx-text text-sm font-semibold">Your referral link</p>
      </div>
      <p className="text-fx-text-dim text-xs mb-4">
        Share this link and earn a commission every time someone signs up and trades.
      </p>

      <div
        className="flex items-center gap-3 rounded-xl border border-fx-border bg-fx-bg px-4 py-3"
      >
        <span className="flex-1 text-fx-text-dim text-sm font-mono truncate">
          {referralUrl}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0"
          style={{
            background: copied ? "rgba(0,194,178,0.15)" : "rgba(0,194,178,0.1)",
            color: copied ? "#00c2b2" : "#00c2b2",
            border: "1px solid rgba(0,194,178,0.25)",
          }}
        >
          {copied ? (
            <>
              <Check size={12} />
              Copied
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Commission Row
// ---------------------------------------------------------------------------

function CommissionRow({ item }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-fx-border bg-fx-bg transition-colors duration-150 hover:border-fx-teal"
      style={{ cursor: "default" }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: "rgba(0,194,178,0.12)", color: "#00c2b2" }}
        >
          {item.referred_email?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="text-fx-text text-sm font-medium leading-tight">
            {item.referred_email}
          </p>
          <p className="text-fx-text-dim text-xs mt-0.5">{item.description}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <p className="text-fx-teal text-sm font-bold">+${item.amount}</p>
        {item.created_at && (
          <p className="text-fx-text-dim text-xs mt-0.5 flex items-center gap-1 justify-end">
            <Clock size={10} />
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyCommissions() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(0,194,178,0.08)" }}
      >
        <Users size={24} style={{ color: "#00c2b2", opacity: 0.6 }} />
      </div>
      <p className="text-fx-text text-sm font-medium mb-1">No commissions yet</p>
      <p className="text-fx-text-dim text-xs max-w-xs leading-relaxed">
        Share your referral link to start earning. Commissions appear here once a referred user completes a trade.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function Skeleton({ className }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: "#1a1a2e" }}
    />
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-48" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function Affiliate() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await affiliateAPI.getOverview();
        setData(res.data);
      } catch {
        setError("Unable to load affiliate stats. Please try again.");
      }
    };
    load();
  }, []);

  const totalEarned = data?.commissions?.reduce(
    (sum, c) => sum + parseFloat(c.amount || 0),
    0
  ) ?? 0;

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-fx-text">Referral program</h1>
          <p className="text-fx-text-dim text-sm mt-1">
            Invite traders and earn commissions on every qualifying trade they make.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 rounded-xl border px-4 py-3 text-sm"
            style={{ borderColor: "#e8404a33", background: "#e8404a11", color: "#e8404a" }}
          >
            {error}
          </div>
        )}

        {!data && !error && <LoadingState />}

        {data && (
          <div className="space-y-6">

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total referrals"
                value={data.commissions?.length ?? 0}
              />
              <StatCard
                icon={DollarSign}
                label="Total earned"
                value={`$${totalEarned.toFixed(2)}`}
                accent
              />
              <StatCard
                icon={TrendingUp}
                label="Commission rate"
                value={data.commission_rate ? `${data.commission_rate}%` : "—"}
              />
              <StatCard
                icon={Clock}
                label="Pending payout"
                value={data.pending_payout ? `$${data.pending_payout}` : "$0.00"}
              />
            </div>

            {/* Two-column layout: link + how it works */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <ReferralLinkBox code={data.link.code} />
              </div>
              <div>
              </div>
            </div>

            {/* Commissions table */}
            <div className="rounded-2xl border border-fx-border bg-fx-surface p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-fx-text text-sm font-semibold">Commission history</p>
                  <p className="text-fx-text-dim text-xs mt-0.5">
                    {data.commissions?.length
                      ? `${data.commissions.length} referral${data.commissions.length !== 1 ? "s" : ""}`
                      : "No referrals yet"}
                  </p>
                </div>
                {data.commissions?.length > 0 && (
                  <button
                    className="flex items-center gap-1 text-xs font-medium transition-colors duration-150"
                    style={{ color: "#00c2b2" }}
                  >
                    View all
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>

              {data.commissions?.length ? (
                <div className="space-y-2">
                  {data.commissions.map((item) => (
                    <CommissionRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyCommissions />
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}