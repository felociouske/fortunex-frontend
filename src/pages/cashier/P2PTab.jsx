import { useEffect, useState } from "react";
import { Search, Star, ShieldCheck, Clock, Copy, Check, ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cashierAPI } from "../../api/cashier";

/**
 * Per-agent trust details, matched to the backend agent by exact
 * `name`. Everything here is intentionally frontend only, per product
 * decision, none of it comes from the API. Fill in real entries as you
 * get them, agent names not listed here fall back to FALLBACK_DETAILS
 * below so a newly added agent in Django admin never breaks this page,
 * it just looks generic until you add its real entry here.
 *
 * To add an agent's real details: copy the shape below, key it by the
 * EXACT name you gave that agent in Django admin (case sensitive).
 */
const AGENT_DETAILS = {
  // "Kengo Finance": {
  //   rating: 4.9,
  //   reviewCount: 214,
  //   description: "Fast, reliable M-Pesa deposits with same day processing.",
  //   verified: true,
  //   responseTime: "Usually responds in minutes",
  // },
};

const FALLBACK_DETAILS = {
  rating: 4.5,
  reviewCount: 0,
  description: "A trusted FortuneX deposit agent.",
  verified: true,
  responseTime: "Usually responds within an hour",
};

function StarRating({ rating }) {
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

function AgentCard({ agent }) {
  const details = AGENT_DETAILS[agent.name] || FALLBACK_DETAILS;
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
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
            <StarRating rating={details.rating} />
          </div>
        </div>
        <ChevronDown
          size={18}
          className="text-fx-text-dim flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-fx-border pt-4">
          <p className="text-fx-text-dim text-sm leading-relaxed">{details.description}</p>

          <div className="flex items-center gap-1.5 text-fx-text-dim text-xs">
            <Clock size={12} />
            {details.responseTime}
            {details.reviewCount > 0 && <span>&nbsp;&middot; {details.reviewCount} reviews</span>}
          </div>

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
      )}
    </div>
  );
}

function HowItWorksBanner() {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-fx-border bg-fx-surface p-5 mb-6">
      <p className="text-fx-text font-semibold mb-3">How this works</p>
      <ol className="space-y-2 text-fx-text-dim text-sm list-decimal list-inside">
        <li>Pick an agent below and copy their phone number.</li>
        <li>Send the amount you want to deposit to that number via M-Pesa.</li>
        <li>Submit the M-Pesa confirmation code on the M-Pesa (manual) tab for verification.</li>
      </ol>
      <button
        onClick={() => navigate("/cashier?tab=deposit&method=manual")}
        className="btn-teal mt-4 flex items-center gap-2 w-fit"
      >
        Go submit your code
        <ArrowRight size={14} />
      </button>
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

  const filtered = (agents || []).filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
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
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}