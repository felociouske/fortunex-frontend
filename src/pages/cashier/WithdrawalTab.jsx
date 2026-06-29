import { useState } from "react";
import { cashierAPI } from "../../api/cashier";
import AccountBanner from "./AccountBanner";
import AmountInput from "./AmountInput";

export default function WithdrawalTab() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      await cashierAPI.withdrawal({ amount, currency, bank_account: bankAccount });
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
        <AmountInput amount={amount} onChange={setAmount} currency={currency} />

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
          <label className="input-label">Bank account / payout details</label>
          <input
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className="input-field"
            placeholder="Bank account, PayPal, or mobile wallet"
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
