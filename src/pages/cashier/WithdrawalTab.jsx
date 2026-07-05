import { useState, useEffect } from "react";
import { cashierAPI } from "../../api/cashier";
import AccountBanner from "./AccountBanner";

export default function WithdrawalTab() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [bankAccount, setBankAccount] = useState("");
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Same shared rate endpoint the M-Pesa deposit form uses -- one
  // source of truth, so this preview can never drift from the backend.
  useEffect(() => {
    cashierAPI.exchangeRate()
      .then(({ data }) => setRate(Number(data.usd_to_kes)))
      .catch(() => setRate(null));
  }, []);

  const kesPreview = amount && rate ? (Number(amount) * rate).toFixed(0) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid withdrawal amount.");
      setLoading(false);
      return;
    }
    if (!bankAccount) {
      setError("Please provide a bank account or payout details.");
      setLoading(false);
      return;
    }

    try {
      await cashierAPI.withdrawal({ amount, currency, payout_details: bankAccount });
      setMessage("Withdrawal request submitted successfully.");
      setAmount("");
      setBankAccount("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to submit withdrawal request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold">Withdraw funds</h1>
      <p className="text-fx-text-dim mt-2 text-sm sm:text-base">
        Request a withdrawal and send funds to your bank account.
      </p>

      <div className="mt-6">
        <AccountBanner />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        {/* Your wallet is always USD internally -- this just shows what
            that translates to in KES, since withdrawals are still paid
            out manually by an admin (M-Pesa payout automation isn't
            built yet -- that's a separate task). */}
        {kesPreview && (
          <p className="text-sm text-fx-text-dim -mt-3">
            You will receive approximately <span className="text-fx-text font-medium">KES {kesPreview}</span>.
          </p>
        )}

        <div>
          <label className="input-label">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input-field"
          >
            <option value="USD">USD</option>
            <option value="KES">KES</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div>
          <label className="input-label">Payout details</label>
          <input
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className="input-field"
            placeholder="M-Pesa phone number, bank account, etc."
          />
        </div>

        {error && <div className="text-fx-red text-sm">{error}</div>}
        {message && <div className="text-fx-teal text-sm">{message}</div>}

        <button type="submit" disabled={loading} className="btn-teal">
          {loading ? "Submitting…" : "Submit withdrawal"}
        </button>
      </form>
    </div>
  );
}