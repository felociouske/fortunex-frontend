// Register page — multi-step sign up form
// Step 1: country & email | Step 2: personal details & password
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, TrendingUp, ChevronLeft } from "lucide-react";
import { authAPI } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import { COUNTRIES } from "../../utils/constants";

const STEPS = ["Country", "Details", "Password"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1); // 1 = country/email, 2 = full details
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    password: "", confirm_password: "",
    date_of_birth: "", country: "Kenya", referral_code: "",
  });

  // Auto-apply a referral code from a shared link (e.g.
  // /register?referral_code=4RAYY79S) -- the person who clicked the
  // link should never have to type or even see a code; it's silently
  // attached to their registration.
  const referralCodeFromLink = searchParams.get("referral_code");
  useEffect(() => {
    if (referralCodeFromLink) {
      setForm((f) => ({ ...f, referral_code: referralCodeFromLink }));
    }
  }, [referralCodeFromLink]);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Step 1 → Step 2
  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.country) {
      setError("Please fill all fields.");
      return;
    }
    setStep(2);
  };

  // Final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register({
        first_name:    form.first_name,
        last_name:     form.last_name,
        email:         form.email,
        password:      form.password,
        date_of_birth: form.date_of_birth,
        country:       form.country,
        referral_code: form.referral_code || undefined,
      });
      setAuth({ user: data.user, access: data.access, refresh: data.refresh });
      navigate("/landing");
    } catch (err) {
      const d = err.response?.data;
      setError(
        typeof d === "string" ? d :
        d?.email?.[0] || d?.detail || d?.non_field_errors?.[0] ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,194,178,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,178,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-fx-teal rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">FORTUNEX</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className="text-fx-teal text-sm font-semibold uppercase tracking-widest">Join Today</p>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Fast deposits,<br />
              <span className="text-fx-teal">quick</span><br />
              withdrawals.
            </h1>
          </div>
          <p className="text-fx-text-dim text-lg max-w-sm">
            Join thousands of traders on Fortunex. Start with as little as $5.
          </p>
          <div className="flex gap-8 pt-4">
            {[["$5", "Min Deposit"], ["Instant", "Withdrawals"], ["KES", "M-Pesa Support"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-fx-teal text-2xl font-bold font-mono">{val}</div>
                <div className="text-fx-muted text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 opacity-30">
          <svg viewBox="0 0 400 80" className="w-full">
            <polyline
              points="0,70 50,50 100,60 150,20 200,35 250,10 300,25 350,5 400,15"
              fill="none" stroke="#00c2b2" strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-fx-bg">
        <div className="w-full max-w-sm space-y-6">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3">
            <div className="w-9 h-9 bg-fx-teal rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FORTUNEX</span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${i + 1 < step ? "bg-fx-teal text-white" :
                    i + 1 === step ? "bg-fx-teal text-white ring-2 ring-fx-teal/30" :
                    "bg-fx-border text-fx-muted"}`}>
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i + 1 === step ? "text-fx-text" : "text-fx-muted"}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px ${i + 1 < step ? "bg-fx-teal" : "bg-fx-border"}`} />
                )}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {step === 1 ? "Join 3M+ global traders" : "Your details"}
            </h2>
            <p className="text-fx-text-dim text-sm mt-1">
              {step === 1
                ? "Tell us where you live. We'll show you available products."
                : "Almost there — fill in your personal information."}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-fx-red/10 border border-fx-red/30 rounded-lg px-4 py-3 text-fx-red text-sm">
              {error}
            </div>
          )}

          {/* ─── STEP 1 ─── */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="input-label">Country / Region</label>
                <select name="country" value={form.country} onChange={set} className="input-field">
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Email address</label>
                <input
                  type="email" name="email" value={form.email} onChange={set}
                  placeholder="you@example.com" required className="input-field"
                />
              </div>

              {/* Referral code -- hidden once auto-applied from a shared link;
              only shown as a manual fallback when no link param is present. */}
              {referralCodeFromLink ? (
                <div className="rounded-lg bg-fx-surface2 px-4 py-3 text-sm text-fx-text-dim">
                  You're signing up via a referral link — referral code{" "}
                  <span className="text-fx-teal font-semibold">{referralCodeFromLink}</span> will be applied automatically.
                </div>
              ) : (
                <div>
                  <label className="input-label">Referral code <span className="text-fx-muted normal-case">(optional)</span></label>
                  <input
                    type="text" name="referral_code" value={form.referral_code} onChange={set}
                    placeholder="Enter referral code" className="input-field"
                  />
                </div>
              )}

              <button type="submit" className="btn-teal">Next</button>

              {/* Social sign up */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-fx-border" />
                <span className="text-fx-muted text-xs">or</span>
                <div className="flex-1 h-px bg-fx-border" />
              </div>

              {[
                { label: "Sign up with Google",   icon: "G", color: "#EA4335" },
                { label: "Sign up with Facebook",  icon: "f", color: "#1877F2" },
              ].map(({ label, icon, color }) => (
                <button key={label} type="button" className="btn-outline flex items-center justify-center gap-3 text-sm">
                  <span className="font-bold text-base" style={{ color }}>{icon}</span>
                  {label}
                </button>
              ))}
            </form>
          )}

          {/* ─── STEP 2 ─── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">First name</label>
                  <input type="text" name="first_name" value={form.first_name} onChange={set}
                    placeholder="John" required className="input-field" />
                </div>
                <div>
                  <label className="input-label">Last name</label>
                  <input type="text" name="last_name" value={form.last_name} onChange={set}
                    placeholder="Doe" required className="input-field" />
                </div>
              </div>

              <div>
                <label className="input-label">Date of birth</label>
                <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={set}
                  required className="input-field" />
              </div>

              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} name="password"
                    value={form.password} onChange={set}
                    placeholder="Min 8 characters" required className="input-field pr-11"
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fx-muted hover:text-fx-text transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"} name="confirm_password"
                    value={form.confirm_password} onChange={set}
                    placeholder="Re-enter password" required className="input-field pr-11"
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-fx-muted hover:text-fx-text transition-colors">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex items-center gap-1 btn-outline px-4 py-3 w-auto">
                  <ChevronLeft size={16} /> Back
                </button>
                <button type="submit" disabled={loading} className="btn-teal flex-1">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Creating account…
                    </span>
                  ) : "Create account"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-fx-text-dim text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-fx-teal font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
