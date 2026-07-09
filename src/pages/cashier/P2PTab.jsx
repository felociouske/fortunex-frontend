import { useEffect, useState } from "react";
import { Search, Star, ShieldCheck, MapPin, Copy, Check, ChevronDown } from "lucide-react";
import { cashierAPI } from "../../api/cashier";
import AgentPaymentSubmitForm from "../../components/AgentPaymentSubmitForm";

/**
 * Per-agent trust details. Intentionally frontend only, per product
 * decision — none of it comes from the API.
 *
 * These are applied by ORDER, not by name: the 1st agent returned by
 * the backend gets AGENT_DETAILS[0], the 2nd gets AGENT_DETAILS[1],
 * etc. Any agent beyond this list falls back to FALLBACK_DETAILS
 * below, so a newly added agent in Django admin never breaks this page.
 *
 * To add another agent's real details, just append a new object to
 * the end of this array (it becomes the details for the next new
 * agent in the backend's ordering).
 */
const AGENT_DETAILS = [
  {
    rating: 4.9,
    reviewCount: 214,
    location: "Nairobi",
    reputation: "Long standing FortuneX agent, over 300 successful deposits processed.",
    description: "Fast, reliable M-Pesa deposits with same day processing.",
    verified: true,
  },
  {
    rating: 4.7,
    reviewCount: 132,
    location: "Nairobi",
    reputation: "Consistently fast confirmations, active FortuneX agent since early this year.",
    description: "Specialises in same hour deposit confirmations for FortuneX traders.",
    verified: true,
  },
  {
    rating: 4.6,
    reviewCount: 98,
    location: "Nairobi",
    reputation: "Handles higher value deposits regularly without issues.",
    description: "Comfortable processing both small and large deposit amounts.",
    verified: true,
  },
  {
    rating: 4.5,
    reviewCount: 61,
    location: "Nairobi",
    reputation: "Newer FortuneX agent, clean record so far.",
    description: "A straightforward, no frills deposit option.",
    verified: false,
  },
  {
    rating: 4.8,
    reviewCount: 175,
    location: "Nairobi",
    reputation: "Well known within the FortuneX trading community for responsiveness.",
    description: "Popular with traders who deposit frequently throughout the week.",
    verified: true,
  },
  {
    rating: 4.4,
    reviewCount: 47,
    location: "Nairobi",
    reputation: "Smaller volume agent, reliable for everyday deposit amounts.",
    description: "Good option for quick, everyday sized deposits.",
    verified: false,
  },
];

const FALLBACK_DETAILS = {
  rating: null,
  reviewCount: 0,
  location: "Location not listed yet",
  reputation: "Details for this agent are being added.",
  description: "A FortuneX payment agent.",
  verified: false,
};

function StarRating({ rating }) {
  if (rating === null) {
    return <span className="text-fx-text-dim text-xs">Not yet rated</span>;
  }
  const fullStars = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < fullStars ? "#f5a623" : "none"}
          stroke={i < fullStars ? "#f5a623" : "#4b5563"}
        />
      ))}
      <span className="text-fx-text-dim text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

/**
 * Each card mounts its own <AgentPaymentSubmitForm>, a separate
 * component instance per agent, so each card's amount/phone/code state
 * is completely independent of every other card's, automatically.
 *
 * `details` is now passed in as a prop (resolved by position in the
 * parent) instead of being looked up here by name.
 */
function AgentCard({ agent, details }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(agent.phone_number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-2xl border border-fx-border bg-fx-surface overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "rgba(0,194,178,0.12)", color: "#00c2b2" }}
          >
            {agent.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-fx-text font-semibold">{agent.name}</p>
              {details.verified && <ShieldCheck size={14} className="text-fx-teal" />}
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <StarRating rating={details.rating} />
              <span className="flex items-center gap-1 text-fx-text-dim text-xs">
                <MapPin size={11} />
                {details.location}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown
          size={18}
          className="text-fx-text-dim flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-6 space-y-5 border-t border-fx-border pt-4">
          {/* Agent details */}
          <div className="space-y-3">
            <p className="text-fx-text-dim text-sm leading-relaxed">{details.description}</p>

            <div className="rounded-lg px-3 py-2" style={{ background: "rgba(0,194,178,0.06)" }}>
              <p className="text-fx-text-dim text-xs leading-relaxed">{details.reputation}</p>
            </div>

            {details.reviewCount > 0 && (
              <p className="text-fx-text-dim text-xs">{details.reviewCount} reviews</p>
            )}

            <div className="flex items-center gap-3 rounded-xl border border-fx-border bg-fx-bg px-4 py-3">
              <span className="flex-1 text-fx-text font-mono text-sm">{agent.phone_number}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
                style={{ background: "rgba(0,194,178,0.1)", color: "#00c2b2", border: "1px solid rgba(0,194,178,0.25)" }}
              >
                {copied ? (<><Check size={12} />Copied</>) : (<><Copy size={12} />Copy number</>)}
              </button>
            </div>
          </div>

          {/* This agent's own dedicated submission form */}
          <div className="pt-4 border-t border-fx-border">
            <p className="text-fx-text text-sm font-semibold mb-3">Submit your payment</p>
            <AgentPaymentSubmitForm agentPhoneNumber={agent.phone_number} />
          </div>
        </div>
      )}
    </div>
  );
}

function HowItWorksBanner() {
  return (
    <div className="rounded-2xl border border-fx-border bg-fx-surface p-5 mb-6">
      <p className="text-fx-text font-semibold mb-3">How this works</p>
      <ol className="space-y-2 text-fx-text-dim text-sm list-decimal list-inside">
        <li>Pick an agent below and tap to open their card.</li>
        <li>Send the amount you want to deposit via M-Pesa Send Money.</li>
        <li>Submit your confirmation code in that same agent's card.</li>
      </ol>
    </div>
  );
}

export default function P2PTab() {
  const [agents, setAgents] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cashierAPI.paymentAgents()
      .then(({ data }) => setAgents(data))
      .catch(() => setError("Unable to load payment agents."));
  }, []);

  // Attach details by position BEFORE filtering, so the pairing stays
  // fixed to each agent regardless of what the user searches for.
  const enriched = (agents || []).map((agent, i) => ({
    agent,
    details: AGENT_DETAILS[i] || FALLBACK_DETAILS,
  }));

  const filtered = enriched.filter(({ agent }) =>
    agent.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold">Fortunex P2P</h1>
      <p className="text-fx-text-dim mt-2 text-sm sm:text-base mb-6">
        Deposit through a trusted agent using M-Pesa.
      </p>

      <HowItWorksBanner />

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fx-text-dim" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agent name"
          className="input-field pl-9"
        />
      </div>

      {error && <div className="text-fx-red text-sm mb-4">{error}</div>}

      {agents === null && !error && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "#1a1a2e" }} />
          ))}
        </div>
      )}

      {agents?.length === 0 && (
        <p className="text-fx-text-dim text-sm">No payment agents are available right now.</p>
      )}

      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(({ agent, details }) => (
            <AgentCard key={agent.id} agent={agent} details={details} />
          ))}
        </div>
      )}
    </div>
  );
}