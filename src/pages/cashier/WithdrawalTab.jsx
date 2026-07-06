import { useState, useEffect } from "react";
import { cashierAPI } from "../../api/cashier";
import AccountBanner from "./AccountBanner";
import AmountInput from "./AmountInput";

export default function WithdrawalTab() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [bankAccount, setBankAccount] = useState("");
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Same shared rate endpoint the M-Pesa deposit form uses, one source
  // of truth, so this preview can never drift from the backend.
  useEffect(() => {
    cashierAPI.exchangeRate()
      .then(({ data }) => setRate(Number(data.usd_to_kes)))
      .catch(() => setRate(null));
  }, []);

  // Describes what the user will actually be paid, and where, quoting
  // back the exact payout details they typed so the sentence is
  // concrete instead of a vague "this payment option". Falls back to
  // generic wording only while that field is still empty.
  const payoutPreviewText = () => {
    if (!amount || Number(amount) <= 0) return null;

    const destination = bankAccount.trim() || "this payout option";

    if (currency === "USD") {
      // Same currency as the wallet, no conversion needed at all.
      return `USD ${Number(amount).toFixed(2)} will be sent to Mpesa Number ${destination}.`;
    }
    if (currency === "KES") {
      if (!rate) return null; // rate has not loaded yet, do not show a stale or missing figure
      const kesAmount = (Number(amount) * rate).toFixed(0);
      return `KES ${kesAmount} will be sent to Mpesa number ${destination}.`;
    }
    // EUR: there is no USD to EUR rate anywhere in the backend
    // (settings.py only defines USD_TO_KES_RATE), so rather than invent
    // a number, we stay upfront that a real conversion is not available yet.
    return `A converted amount for EUR is not available yet, you will be contacted about the payout to ${destination}.`;
  };

  const previewText = payoutPreviewText();

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
          <label className="input-label">Payout details</label>
          <input
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className="input-field"
            placeholder="M-Pesa phone number, bank account, etc."
          />
        </div>

        {/* Moved below the field it actually describes, and now quotes
            back the number the user just typed, instead of sitting
            above it and pointing at nothing concrete. */}
        {previewText && (
          <p className="text-sm text-fx-text-dim -mt-3">
            {previewText}
          </p>
        )}

        {error && <div className="text-fx-red text-sm">{error}</div>}
        {message && <div className="text-fx-teal text-sm">{message}</div>}

        <button type="submit" disabled={loading} className="btn-teal">
          {loading ? "Submitting…" : "Submit withdrawal"}
        </button>
      </form>
    </div>
  );
}