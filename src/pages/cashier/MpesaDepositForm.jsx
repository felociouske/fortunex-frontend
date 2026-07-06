import { useState, useEffect, useRef } from "react";
import { Smartphone, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cashierAPI } from "../../api/cashier";
import { authAPI } from "../../api/auth";
import useDepositSocket from "../../hooks/useDepositSocket";
import useAuthStore from "../../store/authStore";
import AmountInput from "./AmountInput";

/**
 * M-Pesa STK Push deposit flow.
 *
 * Lifecycle: idle -> "sending" (awaiting Safaricom to accept the push)
 * -> "waiting" (prompt is on the user's phone) -> "success" | "failed".
 *
 * We deliberately do NOT poll on an interval: the WebSocket delivers the
 * result the instant Safaricom's callback lands (typically 2-15s after
 * the user enters their PIN), so a poll loop would only ever ADD lag,
 * never reduce it. The one-shot fallback below exists purely for the
 * rare case of a dropped WebSocket connection.
 */
const FALLBACK_TIMEOUT_MS = 20000;
const GIVE_UP_TIMEOUT_MS = 60000;

export default function MpesaDepositForm() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [rate, setRate] = useState(null);
  const [stage, setStage] = useState("idle"); // idle | sending | waiting | success | failed
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [error, setError] = useState("");

  const fallbackTimerRef = useRef(null);
  const giveUpTimerRef = useRef(null);

  const { lastEvent } = useDepositSocket();
  const setUser = useAuthStore((s) => s.setUser);

  // Fetch the live USD->KES rate once, so the "you'll pay ~KES X" hint
  // never drifts from what the backend will actually charge.
  useEffect(() => {
    cashierAPI.exchangeRate()
      .then(({ data }) => setRate(Number(data.usd_to_kes)))
      .catch(() => setRate(null)); // hint just won't show if this fails -- not fatal
  }, []);

  const kesPreview = amount && rate ? (Number(amount) * rate).toFixed(0) : null;

  const clearTimers = () => {
    clearTimeout(fallbackTimerRef.current);
    clearTimeout(giveUpTimerRef.current);
  };

  const resolveSuccess = (message) => {
    clearTimers();
    setStage("success");
    setResultMessage(message);
    // Wallet balance changed server-side -- refresh the cached user so
    // AccountBanner / balances elsewhere update without a full reload.
    authAPI.getProfile().then(({ data }) => setUser(data)).catch(() => {});
  };

  const resolveFailure = (message) => {
    clearTimers();
    setStage("failed");
    setResultMessage(message || "Payment was not completed.");
  };

  // React to the WebSocket event, once we have a checkout_request_id to match against.
  useEffect(() => {
    if (!lastEvent || !checkoutRequestId) return;
    if (lastEvent.checkout_request_id !== checkoutRequestId) return; // some other deposit's event

    if (lastEvent.status === "APPROVED") {
      resolveSuccess(`Deposit of $${amount} confirmed. Receipt: ${lastEvent.mpesa_receipt_number || "-"}`);
    } else if (lastEvent.status === "FAILED") {
      resolveFailure(lastEvent.result_desc);
    }
    // if still PROCESSING, ignore -- keep waiting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent, checkoutRequestId]);

  useEffect(() => clearTimers, []); // cleanup on unmount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!phone) {
      setError("Enter your M-Pesa phone number.");
      return;
    }

    setStage("sending");
    try {
      const { data } = await cashierAPI.mpesaStkPush({ amount, phone_number: phone });
      setCheckoutRequestId(data.checkout_request_id);
      setStage("waiting");

      // Fallback: if the WebSocket hasn't resolved things within 20s,
      // ask the backend to actively re-check with Daraja once.
      fallbackTimerRef.current = setTimeout(async () => {
        try {
          const res = await cashierAPI.depositStatus(data.checkout_request_id);
          if (res.data.status === "APPROVED") {
            resolveSuccess(`Deposit of $${amount} confirmed. Receipt: ${res.data.mpesa_receipt_number || "-"}`);
          } else if (res.data.status === "FAILED") {
            resolveFailure(res.data.result_desc);
          }
          // else still PROCESSING -- let the give-up timer below handle it
        } catch {
          // Swallow -- the give-up timer is still a backstop.
        }
      }, FALLBACK_TIMEOUT_MS);

      // Absolute backstop so the UI never spins forever.
      giveUpTimerRef.current = setTimeout(() => {
        setStage((current) => (current === "waiting" ? "failed" : current));
        setResultMessage((current) => current || "This is taking longer than expected. Check the Cashier page shortly, or try again.");
      }, GIVE_UP_TIMEOUT_MS);
    } catch (err) {
      setStage("idle");
      setError(err.response?.data?.detail || "Unable to start the M-Pesa payment.");
    }
  };

  const reset = () => {
    setStage("idle");
    setAmount("");
    setPhone("");
    setCheckoutRequestId(null);
    setResultMessage("");
    setError("");
  };

  if (stage === "waiting" || stage === "sending") {
    return (
      <div className="rounded-2xl border border-fx-border bg-[#11131f] p-6 text-center max-w-md">
        <Loader2 className="mx-auto animate-spin text-fx-teal" size={32} />
        <p className="mt-4 font-medium">
          {stage === "sending" ? "Sending payment request…" : "Check your phone"}
        </p>
        <p className="mt-1 text-sm text-fx-text-dim">
          {stage === "waiting" && `Enter your M-Pesa PIN on ${phone} to complete the ~KES ${kesPreview} payment.`}
        </p>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="rounded-2xl border border-fx-border bg-[#11131f] p-6 text-center max-w-md">
        <CheckCircle2 className="mx-auto text-fx-teal" size={32} />
        <p className="mt-4 font-medium">{resultMessage}</p>
        <button onClick={reset} className="btn-teal mt-4">Make another deposit</button>
      </div>
    );
  }

  if (stage === "failed") {
    return (
      <div className="rounded-2xl border border-fx-border bg-[#11131f] p-6 text-center max-w-md">
        <XCircle className="mx-auto text-fx-red" size={32} />
        <p className="mt-4 font-medium">{resultMessage}</p>
        <button onClick={reset} className="btn-teal mt-4">Try again</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <AmountInput amount={amount} onChange={setAmount} currency="USD" />
      {kesPreview && (
        <p className="text-sm text-fx-text-dim -mt-3">
          You will pay approximately <span className="text-fx-text font-medium">KES {kesPreview}</span> via M-Pesa.
        </p>
      )}

      <div>
        <label className="input-label">M-Pesa phone number</label>
        <div className="relative">
          <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fx-text-dim" />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0712345678"
            className="input-field pl-9"
          />
        </div>
      </div>

      {error && <div className="text-fx-red text-sm">{error}</div>}

      <button type="submit" className="btn-teal">Initialize</button>
    </form>
  );
}