import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { cashierAPI } from "../api/cashier";
import AmountInput from "../pages/cashier/AmountInput";

/**
 * Manual M-Pesa deposit: user pays via the Paybill directly through
 * their own M-Pesa menu (no STK prompt from us), then submits the
 * confirmation code here for an admin to verify and approve -- same
 * PENDING -> admin review flow your Deposit model already had, just
 * fed by a human typing a code instead of Safaricom's callback.
 */
export default function ManualMpesaDepositForm() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [rate, setRate] = useState(null);
  const [paybill, setPaybill] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Same shared config endpoint the automatic flow uses -- rate AND
  // paybill details come from the backend, never hardcoded here.
  useEffect(() => {
    cashierAPI.exchangeRate()
      .then(({ data }) => {
        setRate(Number(data.usd_to_kes));
        setPaybill({ shortcode: data.paybill_shortcode, accountName: data.paybill_account_name });
      })
      .catch(() => {});
  }, []);

  const kesAmount = amount && rate ? Math.round(Number(amount) * rate) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) return setError("Enter a valid amount.");
    if (!phone) return setError("Enter the phone number you paid from.");
    if (!code) return setError("Enter the M-Pesa confirmation code from your SMS.");

    setLoading(true);
    try {
      await cashierAPI.manualMpesaDeposit({ amount, phone_number: phone, mpesa_code: code });
      setSubmitted(true);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.mpesa_code?.[0] || data?.phone_number?.[0] || data?.detail || "Unable to submit deposit.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-fx-border bg-[#11131f] p-6 text-center max-w-md">
        <CheckCircle2 className="mx-auto text-fx-teal" size={32} />
        <p className="mt-4 font-medium">Submitted for verification</p>
        <p className="mt-1 text-sm text-fx-text-dim">
          We'll confirm your payment and credit your wallet shortly. You'll get a notification either way.
        </p>
        <button onClick={() => { setSubmitted(false); setAmount(""); setPhone(""); setCode(""); }} className="btn-teal mt-4">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-6">
      <AmountInput amount={amount} onChange={setAmount} currency="USD" />

      {/* Payment instructions -- appear once we know how much to pay in KES */}
      {paybill && (
        <div className="rounded-xl border border-fx-border bg-fx-bg p-4 text-sm space-y-1.5">
          <p className="text-fx-text font-medium mb-2">How to pay</p>
          <p className="text-fx-text-dim">1. Go to M-Pesa &rarr; Lipa na M-Pesa &rarr; Pay Bill</p>
          <p className="text-fx-text-dim">2. Business Number: <span className="text-fx-text font-medium">{paybill.shortcode}</span></p>
          <p className="text-fx-text-dim">3. Account Number: <span className="text-fx-text font-medium">{paybill.accountName}</span></p>
          <p className="text-fx-text-dim">
            4. Amount: <span className="text-fx-teal font-medium">{kesAmount ? `KES ${kesAmount}` : "enter an amount above"}</span>
          </p>
          <p className="text-fx-text-dim">5. Enter your M-Pesa PIN, then copy the confirmation code from the SMS you receive.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="input-label">Phone number you paid from</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712345678" className="input-field" />
        </div>
        <div>
          <label className="input-label">M-Pesa confirmation code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. QGH7K9L2M1"
            className="input-field font-mono tracking-wider"
          />
        </div>

        {error && <div className="text-fx-red text-sm">{error}</div>}

        <button type="submit" disabled={loading} className="btn-teal">
          {loading ? "Submitting…" : "Submit for verification"}
        </button>
      </form>
    </div>
  );
}