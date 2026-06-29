import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { tradingAPI } from "../api/trading";
import ContractTypePicker from "./ContractTypePicker";
import PredictionInput from "./PredictionInput";
import BotRunPanel from "./BotRunPanel";

const TICK_PRESETS = [1, 5, 10, 20];
const SECOND_PRESETS = [15, 30, 60, 120];
const STAKE_PRESETS = [5, 10, 25, 50];

/**
 * Order-entry panel covering all 6 contract types. Rise/Fall keeps its
 * dedicated Rise/Fall buttons (direction IS the submit action); every
 * other type collects its prediction via PredictionInput first, then
 * submits through a single "Place trade" button, since the direction
 * is already chosen before the click.
 *
 * `wallet` is passed down from Dashboard (kept fresh via its own React
 * Query cache, refetched on settlement) rather than read from the auth
 * store, which only updates on login/profile fetch.
 */
export default function Contracts({ instrument, wallet, onOpened }) {
  const queryClient = useQueryClient();

  const { data: tierData } = useQuery({
    queryKey: ["myTier"],
    queryFn: tradingAPI.getMyTier,
    staleTime: 30000,
  });
  const tier = tierData?.data;
  const unlockedContracts = tier?.unlocked_contracts || ["RISE_FALL"];

  const [contractType, setContractType] = useState("RISE_FALL");
  const [prediction, setPrediction] = useState({});
  const [side, setSide] = useState("RISE"); // only meaningful for RISE_FALL; used by BotRunPanel, not manual submit
  const [durationUnit, setDurationUnit] = useState("ticks");
  const [durationValue, setDurationValue] = useState(5);
  const [stake, setStake] = useState(10);
  const [submitting, setSubmitting] = useState(null); // "RISE" | "FALL" | "SUBMIT" | null
  const [error, setError] = useState("");

  // Reset prediction params whenever the contract type changes, so
  // stale values from a previous type (e.g. a barrier price) can't
  // leak into a request for a different type.
  useEffect(() => {
    setPrediction({});
  }, [contractType]);

  const durationPresets = durationUnit === "ticks" ? TICK_PRESETS : SECOND_PRESETS;
  const payoutRatio = 0.95; // mirrors the backend default; shown for the potential-payout preview only
  const potentialPayout = (Number(stake || 0) * (1 + payoutRatio)).toFixed(2);

  const validatePredictionComplete = () => {
    switch (contractType) {
      case "EVEN_ODD":
        return Boolean(prediction.parity);
      case "HIGHER_LOWER":
        return Boolean(prediction.direction) && prediction.barrier !== undefined && prediction.barrier !== "";
      case "TOUCH_NO_TOUCH":
        return Boolean(prediction.mode) && prediction.barrier !== undefined && prediction.barrier !== "";
      case "OVER_UNDER":
        return Boolean(prediction.direction) && prediction.digit !== undefined;
      case "MATCHES_DIFFERS":
        return Boolean(prediction.mode) && prediction.digit !== undefined;
      default:
        return true; // RISE_FALL doesn't use `prediction`
    }
  };

  const submit = async (clickedSide) => {
    if (!instrument) return;
    setError("");

    if (!stake || Number(stake) <= 0) {
      setError("Enter a valid stake.");
      return;
    }
    if (contractType !== "RISE_FALL" && !validatePredictionComplete()) {
      setError("Complete your prediction before placing the trade.");
      return;
    }

    const hasReal = wallet && Number(wallet.real_balance) > 0;
    const available = wallet ? Number(wallet.real_balance) + Number(wallet.deposit_balance) : Infinity;
    if (wallet && Number(stake) > available) {
      setError("Insufficient funds. Please top up your balance.");
      return;
    }

    setSubmitting(clickedSide || "SUBMIT");
    try {
      const payload = {
        instrument_id: instrument.id,
        contract_type: contractType,
        duration_unit: durationUnit,
        duration_value: durationValue,
        stake,
      };
      if (contractType === "RISE_FALL") {
        payload.side = clickedSide;
      } else {
        payload.prediction = prediction;
      }

      const { data } = await tradingAPI.openContract(payload);
      queryClient.invalidateQueries({ queryKey: ["openPositions"] });
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
      onOpened?.(data);
    } catch (err) {
      const detail =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.prediction?.[0] ||
        err.response?.data?.side?.[0] ||
        "Unable to open contract.";
      setError(detail);
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="rounded-2xl border border-fx-border bg-fx-surface p-5 space-y-5">
      <ContractTypePicker
        selected={contractType}
        onSelect={setContractType}
        unlockedContracts={unlockedContracts}
      />

      {tier?.active_automation?.kind === "AI" && (
        <div className="flex items-start gap-2 rounded-lg bg-fx-surface2 px-3 py-2.5 text-xs text-fx-text-dim">
          <Sparkles size={14} className="text-fx-teal flex-shrink-0 mt-0.5" />
          <span>
            <span className="text-fx-teal font-medium">{tier.active_automation.name}</span> is active —
            your win chance is currently {tier.win_chance_percent.toFixed(0)}%.
          </span>
        </div>
      )}

      {/* Type-specific prediction inputs (Rise/Fall skips this, uses buttons below instead) */}
      {contractType !== "RISE_FALL" && (
        <PredictionInput
          contractType={contractType}
          prediction={prediction}
          onChange={setPrediction}
          currentPrice={instrument?.base_price}
        />
      )}

      {/* Duration unit toggle */}
      <div>
        <label className="input-label">Duration</label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {["ticks", "seconds"].map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => {
                setDurationUnit(unit);
                setDurationValue(unit === "ticks" ? 5 : 30);
              }}
              className="py-2 rounded-lg text-sm font-medium capitalize border transition-colors duration-150"
              style={
                durationUnit === unit
                  ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                  : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
              }
            >
              {unit}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {durationPresets.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setDurationValue(v)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150"
              style={
                durationValue === v
                  ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                  : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
              }
            >
              {v} {durationUnit === "ticks" ? "ticks" : "sec"}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          value={durationValue}
          onChange={(e) => setDurationValue(Math.max(1, Number(e.target.value) || 1))}
          className="input-field"
        />
      </div>

      {/* Stake */}
      <div>
        <label className="input-label">Stake</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {STAKE_PRESETS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setStake(v)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150"
              style={
                Number(stake) === v
                  ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                  : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
              }
            >
              {v}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            className="input-field pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-fx-text-dim text-sm font-medium pointer-events-none">
            {wallet?.currency || "USD"}
          </span>
        </div>
        <p className="text-fx-text-dim text-xs mt-1.5">
          Funded from your real balance first, then your deposit balance if needed.
        </p>
      </div>

      {/* Payout preview */}
      <div className="rounded-lg bg-fx-surface2 px-4 py-3 flex items-center justify-between text-sm">
        <span className="text-fx-text-dim">Potential payout</span>
        <span className="text-fx-text font-semibold tabular-nums">
          {potentialPayout} {wallet?.currency || "USD"}
        </span>
      </div>

      {error && <div className="text-fx-red text-sm">{error}</div>}

      {/* Submit: Rise/Fall gets dedicated buttons, everything else gets one Place trade button */}
      {contractType === "RISE_FALL" ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!instrument || submitting !== null}
            onClick={() => {
              setSide("RISE");
              submit("RISE");
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#00c2b2" }}
          >
            <TrendingUp size={18} />
            {submitting === "RISE" ? "Opening…" : "Rise"}
          </button>
          <button
            type="button"
            disabled={!instrument || submitting !== null}
            onClick={() => {
              setSide("FALL");
              submit("FALL");
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#e8404a" }}
          >
            <TrendingDown size={18} />
            {submitting === "FALL" ? "Opening…" : "Fall"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={!instrument || submitting !== null}
          onClick={() => submit(null)}
          className="btn-teal w-full"
        >
          {submitting === "SUBMIT" ? "Opening…" : "Place trade"}
        </button>
      )}

      {/* Rise/Fall direction toggle for bot automation -- manual trading
          uses the dedicated buttons above directly; this toggle exists
          purely so BotRunPanel knows which direction to freeze into a run. */}
      {contractType === "RISE_FALL" && (
        <div className="grid grid-cols-2 gap-2 -mt-2">
          {["RISE", "FALL"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className="py-1.5 rounded-md text-xs font-medium border transition-colors duration-150"
              style={
                side === s
                  ? { background: "rgba(0,194,178,0.12)", borderColor: "#00c2b2", color: "#00c2b2" }
                  : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
              }
            >
              Bot direction: {s}
            </button>
          ))}
        </div>
      )}

      {!instrument && (
        <p className="text-fx-text-dim text-xs text-center">
          Select an instrument to start trading.
        </p>
      )}

      {/* Bot automation -- only when the active automation is a BOT.
          AIs are advisory-only and never auto-submit trades. */}
      {tier?.active_automation?.kind === "BOT" && (
        <BotRunPanel
          instrument={instrument}
          contractType={contractType}
          side={side}
          prediction={prediction}
          durationUnit={durationUnit}
          durationValue={durationValue}
        />
      )}
    </div>
  );
}