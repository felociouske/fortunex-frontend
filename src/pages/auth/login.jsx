// Login page — split layout: left hero, right form
// Matches the Deriv-style design from the documentation screenshots
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { authAPI } from "../../api/auth";
import useAuthStore from "../../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      // Store tokens and user info in global state
      setAuth({ user: data.user, access: data.access, refresh: data.refresh });
      navigate("/landing");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient flex-col justify-between p-10 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,194,178,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,178,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-fx-teal rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">FORTUNEX</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className="text-fx-teal text-sm font-semibold uppercase tracking-widest">
              Professional Trading
            </p>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Trading for anyone.<br />
              <span className="text-fx-teal">Anywhere.</span><br />
              Anytime.
            </h1>
          </div>
          <p className="text-fx-text-dim text-lg max-w-sm">
            Binary-style contracts on forex pairs. Real-time charts. Automated bots. All in one platform.
          </p>

          {/* Live stats strip */}
          <div className="flex gap-8 pt-4">
            {[["50+", "Forex Pairs"], ["6", "Contract Types"], ["24/7", "Market Access"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-fx-teal text-2xl font-bold font-mono">{val}</div>
                <div className="text-fx-muted text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative chart lines */}
        <div className="relative z-10 opacity-30">
          <svg viewBox="0 0 400 80" className="w-full">
            <polyline
              points="0,60 40,45 80,55 120,30 160,40 200,15 240,25 280,10 320,20 360,5 400,12"
              fill="none" stroke="#00c2b2" strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-fx-bg">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-6">
            <div className="w-9 h-9 bg-fx-teal rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FORTUNEX</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-fx-text-dim text-sm mt-1">Sign in to your trading account</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-fx-red/10 border border-fx-red/30 rounded-lg px-4 py-3 text-fx-red text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fx-muted hover:text-fx-text transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <button type="button" className="text-xs text-fx-teal hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-teal mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in…
                </span>
              ) : "Log in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-fx-border" />
            <span className="text-fx-muted text-xs">or continue with</span>
            <div className="flex-1 h-px bg-fx-border" />
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            {[
              { label: "Log in with Google",   icon: "G", color: "#EA4335" },
              { label: "Log in with Facebook",  icon: "f", color: "#1877F2" },
            ].map(({ label, icon, color }) => (
              <button
                key={label}
                type="button"
                className="btn-outline flex items-center justify-center gap-3 text-sm"
              >
                <span className="font-bold text-base" style={{ color }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <p className="text-center text-fx-text-dim text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-fx-teal font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
