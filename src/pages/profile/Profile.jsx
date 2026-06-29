import { useState, useEffect } from "react";
import { authAPI } from "../../api/auth";
import DashboardNavbar from "../../components/DashboardNavbar";
import useAuthStore from "../../store/authStore";
import { COUNTRIES } from "../../utils/constants";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    country: "",
    phone_number: "",
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
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="rounded-[32px] border border-fx-border bg-fx-surface p-8">
          <h1 className="text-3xl font-semibold">Profile</h1>
          <p className="text-fx-text-dim mt-2">Manage your account details and KYC status.</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="input-label">First name</label>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Last name</label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="input-label">Date of birth</label>
                  <input
                    name="date_of_birth"
                    type="date"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Country</label>
                  <select name="country" value={form.country} onChange={handleChange} className="input-field">
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Phone number</label>
                <input
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              {error && <div className="text-fx-red">{error}</div>}
              {message && <div className="text-fx-teal">{message}</div>}

              <button type="submit" disabled={loading} className="btn-teal">
                {loading ? "Saving…" : "Save profile"}
              </button>
            </form>

            <div className="rounded-[32px] border border-fx-border bg-[#11131f] p-6">
              <h2 className="text-xl font-semibold">Account status</h2>
              <div className="mt-4 space-y-3 text-fx-text-dim">
                <div>
                  <span className="block text-sm text-fx-text-dim">Email</span>
                  <span className="font-medium text-white">{user?.email}</span>
                </div>
                <div>
                  <span className="block text-sm text-fx-text-dim">KYC status</span>
                  <span className={`font-medium ${user?.kyc_status === "VERIFIED" ? "text-teal-300" : "text-yellow-400"}`}>
                    {user?.kyc_status || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-fx-text-dim">Referral code</span>
                  <span className="font-medium text-white">{user?.referral_code || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
