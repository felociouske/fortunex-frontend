import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { cashierAPI } from "../api/cashier";
import AmountInput from "../pages/cashier/AmountInput";

/**
 * Dedicated submission form for a single P2P agent card. Deliberately
 * a completely separate file from ManualMpesaDepositForm, sharing only
 * the same backend endpoint (manualMpesaDeposit), not the component
 * itself, so this can change freely without touching that one, and
 * vice versa.
 *
 * `agentPhoneNumber` is used purely for the instructional text ("send
 * to THIS number"), it is not sent to the backend, the backend only
 * ever records the phone number the USER paid FROM, for identification.
 */
export default function AgentPaymentSubmitForm({ agentPhoneNumber }) {
  const [amount, setAmount] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [code, setCode] = useState("");
  const [rate, setRate] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only the conversion rate is needed here, not the paybill fields,
  // this is a Send Money payment, not a Paybill one.
  useEffect(() => {
    cashierAPI.exchangeRate()
      .then(({ data }) => setRate(Number(data.usd_to_kes)))
      .catch(() => {});
  }, []);

  const kesAmount = amount && rate ? Math.round(Number(amount) * rate) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) return setError("Enter a valid amount.");
    if (!senderPhone) return setError("Enter the phone number you paid from.");
    if (!code) return setError("Enter the M-Pesa confirmation code from your SMS.");

    setLoading(true);
    try {
      await cashierAPI.manualMpesaDeposit({ amount, phone_number: senderPhone, mpesa_code: code });
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
      <div className="rounded-xl border border-fx-border bg-fx-bg p-5 text-center">
        <CheckCircle2 className="mx-auto text-fx-teal" size={26} />
        <p className="mt-3 font-medium text-sm">Submitted for verification</p>
        <p className="mt-1 text-xs text-fx-text-dim">
          We'll confirm your payment and credit your wallet shortly.
        </p>
        <button
          onClick={() => { setSubmitted(false); setAmount(""); setSenderPhone(""); setCode(""); }}
          className="btn-teal mt-3 text-sm"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Instructions specific to THIS agent's number, a Send Money flow, not Paybill */}
      <div className="rounded-lg px-3 py-2.5 text-xs text-fx-text-dim space-y-1" style={{ background: "rgba(0,194,178,0.06)" }}>
        <p>1. Open M-Pesa &rarr; Send Money</p>
        <p>2. Send to <span className="text-fx-text font-medium">{agentPhoneNumber}</span></p>
        <p>3. Enter the amount and the confirmation code below</p>
      </div>

      <AmountInput amount={amount} onChange={setAmount} currency="USD" />
      {kesAmount && (
        <p className="text-xs text-fx-text-dim -mt-2">
          That's approximately <span className="text-fx-text font-medium">KES {kesAmount}</span> to send.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="input-label">Phone number you paid from</label>
          <input
            value={senderPhone}
            onChange={(e) => setSenderPhone(e.target.value)}
            placeholder="0712345678"
            className="input-field"
          />
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

        <button type="submit" disabled={loading} className="btn-teal w-full">
          {loading ? "Submitting…" : "Submit for verification"}
        </button>
      </form>
    </div>
  );
}