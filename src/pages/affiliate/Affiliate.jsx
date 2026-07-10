import { useEffect, useState } from "react";
import { Copy, Check, Users, DollarSign, TrendingUp, Link2, Clock, X, Wallet as WalletIcon } from "lucide-react";
import { affiliateAPI } from "../../api/affiliate";
import { cashierAPI } from "../../api/cashier";
import { authAPI } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import DashboardNavbar from "../../components/DashboardNavbar";

function copyToClipboard(text, onSuccess) {
  navigator.clipboard.writeText(text).then(onSuccess);
}

function StatCard({ icon: Icon, label, value, accent = false, action }) {
  return (
    <div className="rounded-2xl border border-fx-border bg-fx-surface p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accent ? "rgba(0,194,178,0.12)" : "rgba(255,255,255,0.05)" }}
      >
        <Icon size={18} style={{ color: accent ? "#00c2b2" : "#9ca3af" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-fx-text-dim text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-lg sm:text-xl font-bold truncate" style={{ color: accent ? "#00c2b2" : "#e5e7eb" }}>{value}</p>
        {action}
      </div>
    </div>
  );
}

function ReferralLinkBox({ code }) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `${window.location.origin}/register?trade=${code}`;

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

      <div className="flex items-center gap-3 rounded-xl border border-fx-border bg-fx-bg px-4 py-3">
        <span className="flex-1 text-fx-text-dim text-sm font-mono truncate">{referralUrl}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0"
          style={{
            background: copied ? "rgba(0,194,178,0.15)" : "rgba(0,194,178,0.1)",
            color: "#00c2b2",
            border: "1px solid rgba(0,194,178,0.25)",
          }}
        >
          {copied ? (<><Check size={12} />Copied</>) : (<><Copy size={12} />Copy</>)}
        </button>
      </div>
    </div>
  );
}

function ReferralsTable({ rows }) {
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(0,194,178,0.08)" }}>
          <Users size={24} style={{ color: "#00c2b2", opacity: 0.6 }} />
        </div>
        <p className="text-fx-text text-sm font-medium mb-1">No referrals yet</p>
        <p className="text-fx-text-dim text-xs max-w-xs leading-relaxed">
          Share your referral link above -- new sign-ups show up here immediately.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="w-full min-w-[720px] text-sm border-collapse">
        <thead>
          <tr className="border-b border-fx-border">
            <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Name</th>
            <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Email</th>
            <th className="text-left font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Phone number</th>
            <th className="text-right font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5 pr-4">Commission earned</th>
            <th className="text-right font-medium text-fx-text-dim text-xs uppercase tracking-wide py-2.5">Registered</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-fx-border/60 last:border-0 hover:bg-white/[0.02]">
              <td className="py-3 pr-4 text-fx-text font-medium whitespace-nowrap">{row.full_name || "-"}</td>
              <td className="py-3 pr-4 text-fx-text-dim whitespace-nowrap">{row.email}</td>
              <td className="py-3 pr-4 text-fx-text-dim whitespace-nowrap">{row.phone_number || "-"}</td>
              <td className="py-3 pr-4 text-fx-teal font-semibold text-right whitespace-nowrap">
                {/* Defensive fallback: `|| 0` means a missing/null value
                    from the API renders as $0.00 instead of $NaN --
                    doesn't fix a backend mismatch, but stops it from
                    ever displaying garbage to the user. */}
                ${Number(row.commission_earned || 0).toFixed(2)}
              </td>
              <td className="py-3 text-fx-text-dim text-right whitespace-nowrap">
                {new Date(row.joined_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -- Yield wallet withdrawal modal --------------------------------------
   Reuses the existing /cashier/withdrawal/ endpoint -- the only thing
   that makes this different from the Cashier page's own withdrawal
   form is explicitly setting source_wallet: "yield_balance", which
   that form never sends (so it always defaults to real_balance
   server-side). No backend changes needed; WithdrawalSerializer
   already validates against the right balance and checks KYC. */
function YieldWithdrawModal({ availableBalance, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (Number(amount) > Number(availableBalance)) {
      setError("Amount exceeds your yield wallet balance.");
      return;
    }
    if (!bankAccount) {
      setError("Provide a bank account or payout destination.");
      return;
    }

    setLoading(true);
    try {
      await cashierAPI.withdrawal({
        amount,
        currency: "USD",
        payout_details: bankAccount,
        source_wallet: "yield_balance",
      });
      onSuccess();
    } catch (err) {
      const data = err.response?.data;
      // validate() on the backend raises a plain ValidationError (no
      // field name) for KYC/insufficient-balance checks, which DRF
      // puts under "non_field_errors" -- check that before falling
      // back to a generic message.
      setError(data?.non_field_errors?.[0] || data?.detail || "Unable to submit withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-fx-border bg-fx-surface p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">Withdraw from yield wallet</h3>
          <button onClick={onClose} className="text-fx-text-dim hover:text-fx-text">
            <X size={18} />
          </button>
        </div>
        <p className="text-fx-text-dim text-xs mb-5">
          Available: <span className="text-fx-teal font-medium">${Number(availableBalance).toFixed(2)}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Amount (USD)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="input-label">Bank account / payout details</label>
            <input
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="input-field"
              placeholder="Bank account, PayPal, or mobile wallet"
            />
          </div>

          {error && <div className="text-fx-red text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="btn-teal">
            {loading ? "Submitting…" : "Submit withdrawal"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Skeleton({ className }) {
  return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "#1a1a2e" }} />;
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-48" />
    </div>
  );
}

export default function Affiliate() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState("");

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const yieldBalance = user?.wallet?.yield_balance ?? 0;

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

  const referredUsers = data?.referred_users ?? [];
  const totalEarned = referredUsers.reduce((sum, r) => sum + parseFloat(r.commission_earned || 0), 0);

  const handleWithdrawSuccess = async () => {
    setShowWithdrawModal(false);
    setWithdrawMessage("Withdrawal request submitted. An admin will review it shortly.");
    // Refresh the cached user so the yield balance shown here (and
    // everywhere else it's displayed) reflects the pending withdrawal
    // -- note the balance itself only actually decreases once an
    // admin approves it, same as any other withdrawal on this platform.
    try {
      const { data: profile } = await authAPI.getProfile();
      setUser(profile);
    } catch {
      // Non-fatal -- the balance will just be stale until next reload.
    }
    setTimeout(() => setWithdrawMessage(""), 4000);
  };

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-fx-text">Referral program</h1>
          <p className="text-fx-text-dim text-sm mt-1">
            Invite traders and earn commissions on every qualifying trade they make.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "#e8404a33", background: "#e8404a11", color: "#e8404a" }}>
            {error}
          </div>
        )}
        {withdrawMessage && (
          <div className="mb-6 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "#00c2b233", background: "#00c2b211", color: "#00c2b2" }}>
            {withdrawMessage}
          </div>
        )}

        {!data && !error && <LoadingState />}

        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total referrals" value={referredUsers.length} />
              <StatCard icon={DollarSign} label="Total earned" value={`$${totalEarned.toFixed(2)}`} accent />
              <StatCard icon={TrendingUp} label="Commission rate" value={data.commission_rate ? `${data.commission_rate}%` : "—"} />
              {/* New: yield wallet balance, with a withdraw action right on the card */}
              <StatCard
                icon={WalletIcon}
                label="Yield wallet"
                value={`$${Number(yieldBalance).toFixed(2)}`}
                accent
                action={
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="text-xs font-semibold mt-1"
                    style={{ color: "#00c2b2" }}
                  >
                    Withdraw
                  </button>
                }
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <ReferralLinkBox code={data.link.code} />
              </div>
              <div className="hidden md:block"></div>
            </div>

            <div className="rounded-2xl border border-fx-border bg-fx-surface p-6">
              <div className="mb-5">
                <p className="text-fx-text text-sm font-semibold">My referrals</p>
                <p className="text-fx-text-dim text-xs mt-0.5">
                  {referredUsers.length
                    ? `${referredUsers.length} ${referredUsers.length !== 1 ? "people" : "person"} signed up with your link`
                    : "No referrals yet"}
                </p>
              </div>

              <ReferralsTable rows={referredUsers} />
            </div>
          </div>
        )}
      </main>

      {showWithdrawModal && (
        <YieldWithdrawModal
          availableBalance={yieldBalance}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={handleWithdrawSuccess}
        />
      )}
    </div>
  );
}