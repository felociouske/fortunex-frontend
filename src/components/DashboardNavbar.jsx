import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  BarChart2,
  FileText,
  Wallet,
  Settings,
  HelpCircle,
  Shield,
  MessageCircle,
  User,
  TrendingUp,
  Bot,
  Briefcase,
  LogOut,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import Deposit from "./Deposit";
import NotificationDropdown from "./NotificationDropdown";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const platforms = [
  { abbr: "FT", label: "FortuNex Trader", color: "#e8404a", path: "/dashboard" },
  { abbr: "FB", label: "FortuNex Bots",   color: "#e8404a", path: "/bots" },
];

const navLinks = [
  { label: "Trader's Hub",     path: "/landing",           icon: Home },
  { label: "Bots & AI",        path: "/bots",              icon: Bot },
  { label: "Cashier",          path: "/cashier?tab=deposit", icon: Wallet },
  { label: "Fortunex Trader",  path: "/dashboard",         icon: FileText },
];

const mobileMenuItems = [
  { label: "Trader's Hub",     path: "/landing",              icon: Home,        chevron: false, external: false },
  { label: "Trade",            path: "/dashboard",                icon: TrendingUp,  chevron: false, external: false },
  { label: "Reports",          path: "/dashboard",              icon: FileText,    chevron: true,  external: false },
  { label: "Account settings", path: "/dashboard",             icon: User,        chevron: true,  external: false },
  { label: "Cashier",          path: "/cashier?tab=deposit",  icon: Wallet,      chevron: true,  external: false },
  { label: "Help centre",      path: "/dashboard",                 icon: HelpCircle,  chevron: false, external: false },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a number with commas, 2 decimal places */
function formatBalance(num) {
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PlatformIcon({ abbr, color, size = 28 }) {
  return (
    <div
      className="rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: color }}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.38 }}>
        {abbr}
      </span>
    </div>
  );
}

function LogoBadge() {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-white text-base"
      style={{ background: "#e8404a" }}
    >
      f
    </div>
  );
}

/** US flag as an SVG circle — no external image dependency */
function USFlagCircle({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      style={{ borderRadius: "50%", flexShrink: 0, display: "block" }}
    >
      <clipPath id="circle-clip">
        <circle cx="14" cy="14" r="14" />
      </clipPath>
      <g clipPath="url(#circle-clip)">
        {/* White base */}
        <rect width="28" height="28" fill="#fff" />
        {/* Red stripes (7 red, 6 white alternating = 13 stripes, each ~2.15px tall) */}
        {[0,2,4,6,8,10,12].map((i) => (
          <rect key={i} x="0" y={i * 2.154} width="28" height="2.154" fill="#B22234" />
        ))}
        {/* Blue canton */}
        <rect x="0" y="0" width="11.2" height="15.08" fill="#3C3B6E" />
        {/* Stars — simplified rows */}
        {[1.5, 3.5, 5.5, 7.5, 9.5, 11.5, 13.5].map((y, ri) =>
          [1.4, 2.8, 4.2, 5.6, 7.0, 8.4].slice(0, ri % 2 === 0 ? 6 : 5).map((x, ci) => (
            <circle
              key={`${ri}-${ci}`}
              cx={ri % 2 === 0 ? x : x + 0.7}
              cy={y}
              r="0.55"
              fill="#fff"
            />
          ))
        )}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Platform Switcher Dropdown
// ---------------------------------------------------------------------------

function PlatformSwitcher({ activePlatform, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-150 hover:bg-white/5"
      >
        <PlatformIcon abbr={activePlatform.abbr} color={activePlatform.color} />
        <span className="text-fx-text text-sm font-medium hidden lg:block">
          {activePlatform.label}
        </span>
        <ChevronDown
          size={14}
          className="text-fx-text-dim transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-52 rounded-xl border border-fx-border py-1 z-50"
          style={{ background: "#13131f" }}
        >
          {platforms.map((p) => (
            <button
              key={p.abbr}
              onClick={() => { onChange(p); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-white/5"
            >
              <PlatformIcon abbr={p.abbr} color={p.color} />
              <span className="text-fx-text text-sm">{p.label}</span>
              {p.abbr === activePlatform.abbr && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#00c2b2" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Balance Display (desktop + mobile top-bar)
// ---------------------------------------------------------------------------

function BalanceDisplay({ balance }) {
  return (
    <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors duration-150">
      <USFlagCircle size={27} />
      <div className="text-left">
        <p className="text-[10px] text-fx-text-dim leading-none mb-0.5">Real</p>
        <p className="text-[#00c2b2] text-xs font-bold leading-none">
          {formatBalance(balance)} USD
        </p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Mobile Slide-out Menu
// ---------------------------------------------------------------------------

function MobileMenu({ open, onClose, activePlatform, onPlatformChange, balance }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [darkTheme, setDarkTheme] = useState(true);

  const go = (path, external) => {
    onClose();
    if (external) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    onClose();
    logout?.();
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col transition-transform duration-300"
        style={{
          background: "#13131f",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          borderRight: "1px solid #2a2a3d",
        }}
      >
        {/* Header: X  Menu  [EN flag] */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-fx-border">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-fx-text-dim hover:text-fx-text transition-colors"
            >
              <X size={18} />
            </button>
            <span className="text-fx-text font-bold text-base">Menu</span>
          </div>
          {/* EN flag badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-fx-text text-xs font-semibold">EN</span>
          </div>
        </div>

        {/* Platform switcher row */}
        <div className="px-5 py-4 border-b border-fx-border">
          <div className="flex items-center gap-3">
            <PlatformIcon abbr={activePlatform.abbr} color={activePlatform.color} size={32} />
            <div>
              <p className="text-fx-text text-sm font-semibold leading-none">
                {activePlatform.label.replace("FortuNex ", "")}
              </p>
            </div>
            <ChevronDown size={14} className="text-fx-text-dim ml-auto" />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {mobileMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => go(item.path, item.external)}
                className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-white/5"
              >
                <Icon size={18} className="text-fx-text-dim flex-shrink-0" />
                <span className="text-fx-text text-sm flex-1">{item.label}</span>
                {item.chevron && (
                  <ChevronDown
                    size={14}
                    className="text-fx-text-dim"
                    style={{ transform: "rotate(-90deg)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="px-5 py-4 border-t border-fx-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 hover:bg-white/5"
          >
            <LogOut size={18} className="flex-shrink-0" style={{ color: "#e8404a" }} />
            <span className="text-sm font-semibold" style={{ color: "#e8404a" }}>
              Log out
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Navbar
// ---------------------------------------------------------------------------

export default function DashboardNavbar() {
  const user = useAuthStore((s) => s.user);
  const wallet = user?.wallet;
  const balance = wallet
    ? [wallet.real_balance, wallet.deposit_balance, wallet.yield_balance]
        .reduce((sum, cur) => sum + Number(cur || 0), 0)
        .toFixed(2)
    : "0.00";

  const [activePlatform, setActivePlatform] = useState(platforms[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const depositBtnRef = useRef(null);

  return (
    <>
      <header
        className="w-full sticky top-0 z-30 border-b border-fx-border"
        style={{ background: "#13131f" }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 h-14">

          {/* ── LEFT ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1">

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg text-fx-text-dim hover:text-fx-text hover:bg-white/5 transition-colors mr-1"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex-shrink-0 mr-2">
              <LogoBadge />
            </Link>

            {/* Cashier briefcase icon — mobile only */}
            <Link
              to="/cashier?tab=deposit"
              className="md:hidden p-2 rounded-lg text-fx-text-dim hover:text-fx-text hover:bg-white/5 transition-colors"
            >
              <Briefcase size={18} />
            </Link>

            {/* Nav links — desktop only */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-fx-text-dim text-sm font-medium hover:text-fx-text hover:bg-white/5 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divider — desktop */}
            <div
              className="hidden md:block w-px h-5 mx-2"
              style={{ background: "#2a2a3d" }}
            />

            {/* Platform switcher — desktop only */}
            <div className="hidden md:block">
              <PlatformSwitcher
                activePlatform={activePlatform}
                onChange={setActivePlatform}
              />
            </div>
          </div>

          {/* ── RIGHT ────────────────────────────────────────────────────── */}
          <div className="relative flex items-center gap-1 sm:gap-2">

            {/* Deposit button — desktop only */}
            <button
              ref={depositBtnRef}
              onClick={() => setDepositOpen((v) => !v)}
              className="hidden sm:flex items-center px-4 py-1.5 rounded-lg text-white text-sm font-semibold transition-all duration-200 mr-1"
              style={{ background: "#e8404a" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c93039")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#e8404a")}
            >
              Deposit
            </button>

            {/* Balance (shows on both desktop + mobile) */}
            <BalanceDisplay balance={balance} />

            {/* Notification bell */}
            <NotificationDropdown />

            {/* User avatar — desktop only */}
            <button className="hidden md:flex p-2 rounded-lg text-fx-text-dim hover:text-fx-text hover:bg-white/5 transition-colors duration-150">
              <User size={17} />
            </button>

            {/* Quick deposit popover */}
            <Deposit
              open={depositOpen}
              onClose={() => setDepositOpen(false)}
              anchorRef={depositBtnRef}
            />
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activePlatform={activePlatform}
        onPlatformChange={setActivePlatform}
        balance={balance}
      />
    </>
  );
}