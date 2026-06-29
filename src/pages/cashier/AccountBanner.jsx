import { Info } from "lucide-react";
import useAuthStore from "../../store/authStore";

/**
 * "This is your USD account CR2664..." banner.
 * Reads from the authenticated user's wallet when the backend provides
 * account_number / currency; falls back to sane placeholders otherwise
 * so the UI doesn't break before those fields exist.
 */
export default function AccountBanner() {
  const user = useAuthStore((s) => s.user);
  const wallet = user?.wallet;

  const currency = wallet?.currency || "USD";
  const accountNumber = wallet?.account_number || "—";

  return (
    <div
      className="flex items-start sm:items-center gap-3 rounded-lg px-4 py-3 mb-6"
      style={{ background: "rgba(26,58,92,0.5)", border: "1px solid rgba(26,58,92,0.8)" }}
    >
      <Info size={18} className="text-sky-400 flex-shrink-0 mt-0.5 sm:mt-0" />
      <p className="text-sm text-fx-text-dim">
        This is your <span className="font-semibold text-fx-text">{currency}</span> account{" "}
        {accountNumber !== "—" ? (
          <span className="font-semibold text-fx-text">{accountNumber}</span>
        ) : (
          <span className="italic">unavailable</span>
        )}
        .
      </p>
    </div>
  );
}
