// top imports — added useQuery + walletAPI
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../api/auth";
import { walletAPI } from "../../api/market";
import DashboardNavbar from "../../components/DashboardNavbar";
import useAuthStore from "../../store/authStore";
import { COUNTRIES } from "../../utils/constants";

/* ── Shared "plain" building blocks for this page only ─────────────────────
   Deliberately flat: no gradients, no glow, no filled buttons, no big
   border-radius. Buttons are transparent with a hairline border, sized
   to their text instead of stretched full-width. */
const panel = "border border-fx-border bg-fx-surface p-6";
const heading = "text-lg font-semibold border-b border-fx-border pb-3 mb-5";
const label = "block text-xs text-fx-text-dim mb-1";
const field = "w-full bg-transparent border border-fx-border px-3 py-2 text-sm text-fx-text focus:outline-none focus:border-fx-text-dim";
const plainButton = "border border-fx-border px-4 py-1.5 text-sm text-fx-text hover:border-fx-text hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const row = "flex items-center justify-between py-2 border-b border-fx-border/60 last:border-0";

function PasswordSection() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const [form, setForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.new_password !== form.confirm_password) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        old_password: form.old_password,
        new_password: form.new_password,
      });
      setMessage("Password changed. Redirecting you to log in again…");
      setForm({ old_password: "", new_password: "", confirm_password: "" });

      setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 1500);
    } catch (err) {
      const data = err.response?.data;
      const firstError =
        data?.old_password?.[0] || data?.new_password?.[0] || data?.detail || "Unable to change password.";
      setError(firstError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={panel}>
      <h3 className={heading}>Change password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Current password</label>
          <input type="password" name="old_password" value={form.old_password} onChange={handleChange} className={field} autoComplete="current-password" />
        </div>
        <div>
          <label className={label}>New password</label>
          <input type="password" name="new_password" value={form.new_password} onChange={handleChange} className={field} autoComplete="new-password" />
        </div>
        <div>
          <label className={label}>Confirm new password</label>
          <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} className={field} autoComplete="new-password" />
        </div>

        {error && <div className="text-fx-red text-sm">{error}</div>}
        {message && <div className="text-fx-teal text-sm">{message}</div>}

        <button type="submit" disabled={loading} className={plainButton}>
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    first_name: "", last_name: "", date_of_birth: "", country: "",
    phone_number: "", location: "", kra_pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        date_of_birth: user.date_of_birth || "",
        country: user.country || "Kenya",
        phone_number: user.phone_number || "",
        location: user.location || "",
        kra_pin: user.kra_pin || "",
      });
    }
  }, [user]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const { data } = await authAPI.updateProfile(form);
      setUser(data);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const { data: walletData } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletAPI.getBalance,
  });
  const wallet = walletData?.data;

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-1">Profile</h1>
        <p className="text-fx-text-dim text-sm mb-8">Account details and settings.</p>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {/* Editable details */}
            <div className={panel}>
              <h3 className={heading}>Personal details</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>First name</label>
                    <input name="first_name" value={form.first_name} onChange={handleChange} className={field} />
                  </div>
                  <div>
                    <label className={label}>Last name</label>
                    <input name="last_name" value={form.last_name} onChange={handleChange} className={field} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>Date of birth</label>
                    <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className={field} />
                  </div>
                  <div>
                    <label className={label}>Country</label>
                    <select name="country" value={form.country} onChange={handleChange} className={field}>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>Phone number</label>
                    <input name="phone_number" value={form.phone_number} onChange={handleChange} className={field} />
                  </div>
                  <div>
                    <label className={label}>Location</label>
                    <input name="location" value={form.location} onChange={handleChange} className={field} placeholder="Nairobi, Kenya" />
                  </div>
                </div>

                <div className="sm:w-1/2 sm:pr-2">
                  <label className={label}>KRA PIN</label>
                  <input name="kra_pin" value={form.kra_pin} onChange={handleChange} className={field} placeholder="A123456789Z" />
                </div>

                {error && <div className="text-fx-red text-sm">{error}</div>}
                {message && <div className="text-fx-teal text-sm">{message}</div>}

                <button type="submit" disabled={loading} className={plainButton}>
                  {loading ? "Saving…" : "Save changes"}
                </button>
              </form>
            </div>

            <PasswordSection />
          </div>

          <div className="space-y-6">
            {/* Read-only account summary */}
            <div className={panel}>
              <h3 className={heading}>Account</h3>
              <div>
                <div className={row}><span className="text-fx-text-dim text-sm">Email</span><span className="text-sm">{user?.email}</span></div>
                <div className={row}><span className="text-fx-text-dim text-sm">Referral code</span><span className="text-sm">{user?.referral_code || "-"}</span></div>
                <div className={row}>
                  <span className="text-fx-text-dim text-sm">KYC status</span>
                  <span className="text-sm border border-fx-border px-2 py-0.5">{user?.kyc_status || "N/A"}</span>
                </div>
                <div className={row}>
                  <span className="text-fx-text-dim text-sm">Member since</span>
                  <span className="text-sm">{user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "-"}</span>
                </div>
              </div>
            </div>

            {/* Wallet summary */}
            {wallet && (
              <div className={panel}>
                <h3 className={heading}>Wallet</h3>
                <div>
                  <div className={row}><span className="text-fx-text-dim text-sm">Real balance</span><span className="text-sm">${Number(wallet.real_balance).toFixed(2)}</span></div>
                  <div className={row}><span className="text-fx-text-dim text-sm">Deposit balance</span><span className="text-sm">${Number(wallet.deposit_balance).toFixed(2)}</span></div>
                  <div className={row}><span className="text-fx-text-dim text-sm">Yield balance</span><span className="text-sm">${Number(wallet.yield_balance).toFixed(2)}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}