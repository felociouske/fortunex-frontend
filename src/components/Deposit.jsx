import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { cashierAPI } from "../api/cashier";
import AmountInput from "../pages/cashier/AmountInput";

/**
 * Floating quick-deposit popover, triggered from the navbar's Deposit
 * button. Submits straight to the deposit endpoint; "See all options"
 * routes through to the full Cashier page for currency change, payment
 * method reference, etc.
 *
 * Usage (in DashboardNavbar):
 *   const [depositOpen, setDepositOpen] = useState(false);
 *   <button onClick={() => setDepositOpen((v) => !v)}>Deposit</button>
 *   <Deposit open={depositOpen} onClose={() => setDepositOpen(false)} anchorRef={depositBtnRef} />
 */
export default function Deposit({ open, onClose, anchorRef }) {
  const navigate = useNavigate();
  const popoverRef = useRef(null);

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const clickedAnchor = anchorRef?.current?.contains(e.target);
      const clickedPopover = popoverRef.current?.contains(e.target);
      if (!clickedAnchor && !clickedPopover) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Reset transient state each time it's opened
  useEffect(() => {
    if (open) {
      setMessage("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      await cashierAPI.deposit({ amount, currency: "USD" });
      setMessage("Deposit request submitted.");
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to submit deposit request.");
    } finally {
      setLoading(false);
    }
  };

  const goToFullCashier = () => {
    onClose();
    navigate("/cashier?tab=deposit");
  };

  return (
    <>
      {/* Mobile backdrop — full screen sheet feel on small viewports */}
      <div
        className="fixed inset-0 z-40 sm:hidden"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />

      <div
        ref={popoverRef}
        className="
          fixed sm:absolute z-50
          left-4 right-4 bottom-4
          sm:left-auto sm:right-4 sm:bottom-auto sm:top-16 sm:w-80
          rounded-2xl border border-fx-border bg-fx-surface
          shadow-2xl p-5
        "
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-fx-text">Quick deposit</h2>
          <button
            onClick={onClose}
            className="text-fx-text-dim hover:text-fx-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AmountInput amount={amount} onChange={setAmount} currency="USD" />

          {error && <div className="text-fx-red text-xs">{error}</div>}
          {message && <div className="text-fx-teal text-xs">{message}</div>}

          <button type="submit" disabled={loading} className="btn-teal">
            {loading ? "Submitting…" : "Deposit"}
          </button>

          <button
            type="button"
            onClick={goToFullCashier}
            className="btn-ghost w-full text-center text-xs py-1"
          >
            See all deposit options
          </button>
        </form>
      </div>
    </>
  );
}
