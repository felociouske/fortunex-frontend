import { useState } from "react";
import { CreditCard, Building2, Wallet as WalletIcon, Banknote, Bitcoin } from "lucide-react";
import { cashierAPI } from "../../api/cashier";
import AccountBanner from "./AccountBanner";
import AmountInput from "./AmountInput";

const paymentMethods = [
  { label: "Credit / Debit", icon: CreditCard },
  { label: "Instant Bank Transfer", icon: Building2 },
  { label: "E-wallet", icon: WalletIcon },
  { label: "Local Payment Methods", icon: Banknote },
];

const cryptoMethods = ["Bitcoin", "Ethereum", "Litecoin", "USD Coin", "Tether"];

export default function DepositTab() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid deposit amount.");
      setLoading(false);
      return;
    }

    try {
      await cashierAPI.deposit({ amount, currency });
      setMessage("Deposit request submitted successfully.");
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to submit deposit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold">Deposit funds</h1>
      <p className="text-fx-text-dim mt-2 text-sm sm:text-base">
        Submit a deposit request and top up your wallet.
      </p>

      <div className="mt-6">
        <AccountBanner />
      </div>

      {/* Form */}
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

        {error && <div className="text-fx-red text-sm">{error}</div>}
        {message && <div className="text-fx-teal text-sm">{message}</div>}

        <button type="submit" disabled={loading} className="btn-teal">
          {loading ? "Submitting…" : "Submit deposit"}
        </button>
      </form>

      {/* Reference: available payment methods (static for now) */}
      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Deposit via bank wire, credit card, and e-wallet
          </h2>
          <div className="card-elevated flex flex-wrap gap-x-8 gap-y-4">
            {paymentMethods.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5 text-fx-text-dim">
                <Icon size={20} className="text-fx-teal flex-shrink-0" />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Deposit cryptocurrencies</h2>
          <div className="card-elevated flex flex-wrap gap-x-8 gap-y-4">
            {cryptoMethods.map((label) => (
              <div key={label} className="flex items-center gap-2.5 text-fx-text-dim">
                <Bitcoin size={20} className="text-fx-teal flex-shrink-0" />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
