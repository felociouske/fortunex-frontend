import { Link } from "react-router-dom";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import DashboardNavbar from "../../components/DashboardNavbar";
import useAuthStore from "../../store/authStore";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBalance(num) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const optionPlatforms = [
  {
    name: "Fortunex Trader",
    desc: "The options and multipliers trading platform.",
  },
  {
    name: "Fortunex Bots",
    desc: "The ultimate bot trading platform.",
  },
  {
    name: "Fortunex AI",
    desc: "The legacy options trading platform.",
  },
];

const mt5Accounts = [
  { name: "Standard", desc: "CFDs on derived and financial instruments.", tag: null },
  { name: "Financial", desc: "CFDs on financial instruments.", tag: null },
  { name: "Financial STP", desc: "Direct access to market prices.", tag: null },
  { name: "Swap-Free", desc: "Swap-free CFDs on selected instruments.", tag: null },
  { name: "Zero Spread", desc: "Zero spread CFDs on financial and derived instruments.", tag: null },
  { name: "Gold", desc: "Trading opportunities on popular precious metals.", tag: "NEW" },
];

const ctraderPlatforms = [
  { name: "Fortunex cTrader", desc: "CFDs on financial and derived instruments." },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PlatformRow({ platform, actionLabel = "Open", to = "/dashboard" }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-fx-border last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-fx-text text-sm font-semibold">{platform.name}</p>
          {platform.tag && (
            <span className="text-[10px] font-bold bg-yellow-400 text-black px-1.5 py-0.5 rounded">
              {platform.tag}
            </span>
          )}
        </div>
        <p className="text-fx-text-dim text-xs mt-0.5 leading-snug">{platform.desc}</p>
      </div>
      <Link
        to={to}
        className="flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-all duration-200 bg-fx-red hover:bg-fx-red-dk whitespace-nowrap"
      >
        {actionLabel}
        <ArrowUpRight size={12} />
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Deposit Banner
// ---------------------------------------------------------------------------

function DepositBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-8 bg-fx-surface2 border border-fx-border">
      {/* Subtle chart line background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 160"
      >
        <polyline
          points="0,120 80,90 160,100 240,60 320,75 400,40 480,55 560,30 640,50 720,20 800,45 880,35 960,55 1040,25 1120,40 1200,30"
          fill="none"
          className="stroke-fx-teal"
          strokeWidth="2"
        />
        <polygon
          points="0,120 80,90 160,100 240,60 320,75 400,40 480,55 560,30 640,50 720,20 800,45 880,35 960,55 1040,25 1120,40 1200,30 1200,160 0,160"
          className="fill-fx-teal/10"
        />
      </svg>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-fx-text text-xl sm:text-2xl font-semibold mb-1">
            Make your first deposit to start trading
          </h2>
          <p className="text-fx-text-dim text-sm">Fund your account and access all trading platforms.</p>
        </div>
        <Link
          to="/cashier?tab=deposit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-bold text-sm transition-all duration-200 bg-fx-red hover:bg-fx-red-dk whitespace-nowrap self-start sm:self-auto"
        >
          Deposit now
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Options Section
// ---------------------------------------------------------------------------

function OptionsSection({ balance = 0 }) {
  return (
    <div className="rounded-xl border mb-4 bg-fx-surface border-fx-border">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-fx-border">
        <div>
          <h3 className="text-fx-text text-base font-bold mb-0.5">Options</h3>
          <p className="text-fx-text-dim text-sm">
            Predict the market, profit if you're right, risk only what you put in.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <p className="text-fx-teal text-sm font-bold leading-tight">
              {formatBalance(balance)} USD
            </p>
            <p className="text-fx-text-dim text-xs">Account balance</p>
          </div>
          <Link
            to="/cashier?tab=deposit"
            className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold bg-fx-red hover:bg-fx-red-dk transition-colors duration-200"
          >
            Deposit
          </Link>
        </div>
      </div>

      {/* Platforms */}
      <div className="px-5 divide-y divide-fx-border">
        {optionPlatforms.map((p, i) => (
          <PlatformRow key={i} platform={p} actionLabel="Open" to="/dashboard" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CFDs Section
// ---------------------------------------------------------------------------

function CFDsSection() {
  return (
    <div className="rounded-xl border mb-4 bg-fx-surface border-fx-border">
      {/* Header */}
      <div className="p-5 border-b border-fx-border">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h3 className="text-fx-text text-base font-bold">CFDs</h3>
        </div>
        <p className="text-fx-text-dim text-sm">
          Trade bigger positions with less capital on a wide range of global markets.{" "}
        </p>
      </div>

      <div className="p-5">
        {/* MT5 */}
        <h4 className="text-fx-text text-sm font-bold mb-2">Fortunex MT5</h4>
        <div className="divide-y divide-fx-border">
          {mt5Accounts.map((acc, i) => (
            <PlatformRow key={i} platform={acc} actionLabel="Get" to="/#" />
          ))}
        </div>

        {/* cTrader */}
        <h4 className="text-fx-text text-sm font-bold mt-6 mb-2">Fortunex cTrader</h4>
        <div className="divide-y divide-fx-border">
          {ctraderPlatforms.map((p, i) => (
            <PlatformRow key={i} platform={p} actionLabel="Get" to="/#" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function TradersHubHeader({ totalBalance }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
      <h1 className="text-fx-text text-2xl font-bold">Trader's Hub</h1>
      <div className="sm:text-right">
        <p className="text-fx-text-dim text-xs mb-0.5">Total assets</p>
        <p className="text-fx-teal text-2xl font-bold tracking-tight">
          {formatBalance(totalBalance)} USD
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function TradersHub() {
  const user = useAuthStore((s) => s.user);
  const wallet = user?.wallet;
  const balance = wallet
    ? [wallet.real_balance, wallet.deposit_balance, wallet.yield_balance]
        .reduce((sum, cur) => sum + Number(cur || 0), 0)
    : 0;

  return (
    <div className="min-h-screen font-sans bg-fx-bg text-fx-text">
      <DashboardNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <DepositBanner />
        <TradersHubHeader totalBalance={balance} />
        <OptionsSection balance={balance} />
        <CFDsSection />
      </div>
    </div>
  );
}