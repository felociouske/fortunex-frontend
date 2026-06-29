import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, X } from "lucide-react";
import { notificationsAPI } from "../api/notifications";

/**
 * Pop-up modal shown on top of the dashboard whenever the logged-in
 * user's KYC isn't verified yet. Reappears every login/page-load as
 * long as `should_prompt` is true (KYC-status-derived, not tied to
 * whether the user has dismissed it before) -- per product decision,
 * dismissing closes it for THIS session only, it isn't a permanent
 * opt-out.
 */
export default function KYCPromptModal() {
  const navigate = useNavigate();
  const [dismissedThisSession, setDismissedThisSession] = useState(false);

  const { data } = useQuery({
    queryKey: ["kycStatus"],
    queryFn: notificationsAPI.getKycStatus,
    staleTime: 60000,
  });

  const shouldPrompt = data?.data?.should_prompt;

  useEffect(() => {
    if (!shouldPrompt) setDismissedThisSession(false);
  }, [shouldPrompt]);

  if (!shouldPrompt || dismissedThisSession) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-md rounded-2xl border border-fx-border bg-fx-surface p-6 relative">
        <button
          onClick={() => setDismissedThisSession(true)}
          className="absolute top-4 right-4 text-fx-text-dim hover:text-fx-text transition-colors"
        >
          <X size={18} />
        </button>

        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(232,64,74,0.12)" }}
        >
          <ShieldAlert size={22} className="text-fx-red" />
        </div>

        <h2 className="text-lg font-semibold text-fx-text">Verify your account</h2>
        <p className="text-fx-text-dim text-sm mt-2">
          You need to complete KYC verification before you can trade or withdraw funds.
          It only takes a couple of minutes.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setDismissedThisSession(true)}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-fx-text-dim border border-fx-border hover:bg-fx-surface2 transition-colors duration-150"
          >
            Later
          </button>
          <button
            onClick={() => navigate("/kyc")}
            className="flex-1 btn-teal"
          >
            Verify now
          </button>
        </div>
      </div>
    </div>
  );
}