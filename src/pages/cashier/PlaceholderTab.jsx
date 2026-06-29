import { Construction } from "lucide-react";

/**
 * Polished "coming soon" state for cashier tabs not yet wired to a backend
 * endpoint (Payment agents, Transfer, Deriv P2P).
 */
export default function PlaceholderTab({ title, description }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold">{title}</h1>
      <p className="text-fx-text-dim mt-2 text-sm sm:text-base">{description}</p>

      <div className="card-elevated mt-8 flex flex-col items-center justify-center text-center py-16 px-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(0,194,178,0.1)" }}
        >
          <Construction size={24} className="text-fx-teal" />
        </div>
        <h2 className="text-lg font-semibold text-fx-text">Coming soon</h2>
        <p className="text-fx-text-dim text-sm mt-2 max-w-sm">
          We're putting the finishing touches on this feature. Check back shortly.
        </p>
      </div>
    </div>
  );
}
