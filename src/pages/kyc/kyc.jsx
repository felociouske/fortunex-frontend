// KYC — built in Phase 7
import { useState } from "react";
import IndexNavbar from "../../components/IndexNavbar";
import useAuthStore from "../../store/authStore";
import { authAPI } from "../../api/auth";

export default function KycPage() {
  const user = useAuthStore((s) => s.user);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e) => setFile(e.target.files?.[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!file) return setError("Please select a document (JPG, PNG or PDF).");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("document", file);
      const { data } = await authAPI.submitKYC(fd);
      setMessage(data.detail || "KYC submitted.");
      // refresh user profile in store
      const { data: profile } = await authAPI.getProfile();
      useAuthStore.getState().setUser(profile);
    } catch (err) {
      setError(err.response?.data?.document || err.response?.data?.detail || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <IndexNavbar />
      <main className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-fx-surface rounded-lg p-6">
          <h2 className="text-lg font-semibold">KYC Verification</h2>
          <p className="text-fx-text-dim mt-2">Upload a government-issued ID or passport. Supported: JPG, PNG, PDF (max 5 MB).</p>

          <form onSubmit={handleSubmit} className="mt-4">
            <div>
              <input type="file" accept="image/*,application/pdf" onChange={handleFile} />
            </div>

            {error && <div className="mt-3 text-fx-red">{error}</div>}
            {message && <div className="mt-3 text-fx-teal">{message}</div>}

            <div className="mt-4">
              <button type="submit" disabled={loading} className="btn-teal">
                {loading ? "Submitting…" : user?.kyc_status === "SUBMITTED" ? "Resubmit" : "Submit KYC"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
