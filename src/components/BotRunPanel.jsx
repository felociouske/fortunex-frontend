import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, Square, Play } from "lucide-react";
import { tradingAPI } from "../api/trading";
import useBotRunSocket from "../hooks/useBotRunSocket";

const STATUS_LABELS = {
  RUNNING: "Running",
  STOPPED_MANUAL: "Stopped",
  STOPPED_STOP_LOSS: "Stopped — stop-loss hit",
  STOPPED_TAKE_PROFIT: "Stopped — take-profit hit",
  STOPPED_INSUFFICIENT_FUNDS: "Stopped — insufficient funds",
};

/**
 * Bot automation control panel, shown below the manual Rise/Fall (or
 * other contract type) buttons in Contracts.jsx -- ONLY when the
 * user's active automation is a BOT (never an AI; AIs are
 * advisory-only and never auto-submit trades, per product decision).
 *
 * Starting a run freezes whatever contract config is currently chosen
 * in the parent Contracts panel (instrument, contract_type,
 * side/prediction, duration) plus a stake/stop-loss/take-profit the
 * user sets here. That config stays frozen for the run's lifetime --
 * changing the contract panel afterwards has no effect on an
 * already-running bot.
 */
export default function BotRunPanel({ instrument, contractType, side, prediction, durationUnit, durationValue }) {
  const queryClient = useQueryClient();
  const { lastEvent } = useBotRunSocket();

  const [stake, setStake] = useState(10);
  const [stopLoss, setStopLoss] = useState(50);
  const [takeProfit, setTakeProfit] = useState(50);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["myBotRun"],
    queryFn: tradingAPI.getMyBotRun,
    refetchInterval: 15000, // light periodic resync; the WS is the primary live source
  });
  const current = data?.data?.current;

  // Refresh from the server whenever a live event arrives, so the
  // panel's numbers reflect the authoritative state rather than
  // trusting the WS payload alone for anything beyond a quick flash.
  useEffect(() => {
    if (lastEvent) {
      refetch();
      if (lastEvent.event === "stopped") {
        queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
        queryClient.invalidateQueries({ queryKey: ["openPositions"] });
      }
    }
  }, [lastEvent, refetch, queryClient]);

  const canStart = contractType === "RISE_FALL" ? Boolean(side) : true;

  const handleStart = async () => {
    if (!instrument) return;
    setError("");

    if (!canStart) {
      setError("Choose Rise or Fall before starting automation.");
      return;
    }
    if (!stake || Number(stake) <= 0 || !stopLoss || Number(stopLoss) <= 0 || !takeProfit || Number(takeProfit) <= 0) {
      setError("Enter valid stake, stop-loss, and take-profit amounts.");
      return;
    }

    setStarting(true);
    try {
      const payload = {
        instrument_id: instrument.id,
        contract_type: contractType,
        duration_unit: durationUnit,
        duration_value: durationValue,
        stake,
        stop_loss: stopLoss,
        take_profit: takeProfit,
      };
      if (contractType === "RISE_FALL") {
        payload.side = side;
      } else {
        payload.prediction = prediction;
      }

      await tradingAPI.startBotRun(payload);
      queryClient.invalidateQueries({ queryKey: ["myBotRun"] });
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.detail ||
          "Unable to start automation."
      );
    } finally {
      setStarting(false);
    }
  };

  const handleStop = async () => {
    setStopping(true);
    setError("");
    try {
      await tradingAPI.stopBotRun();
      queryClient.invalidateQueries({ queryKey: ["myBotRun"] });
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to stop automation.");
    } finally {
      setStopping(false);
    }
  };

  if (current) {
    const pl = Number(current.cumulative_profit_loss);
    return (
      <div className="rounded-2xl border border-fx-border bg-fx-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-fx-text flex items-center gap-2">
            <Bot size={16} className="text-fx-teal" /> Bot automation
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-fx-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-fx-teal animate-pulse" />
            Running
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-fx-surface2 px-3 py-2.5">
            <div className="text-fx-text-dim text-xs">Trades</div>
            <div className="font-semibold text-fx-text mt-0.5">{current.trades_count}</div>
          </div>
          <div className="rounded-lg bg-fx-surface2 px-3 py-2.5">
            <div className="text-fx-text-dim text-xs">Cumulative P/L</div>
            <div className={`font-semibold mt-0.5 ${pl < 0 ? "text-fx-red" : "text-fx-teal"}`}>
              {pl >= 0 ? "+" : ""}{pl.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="text-xs text-fx-text-dim">
          Stop-loss: {Number(current.stop_loss).toFixed(2)} · Take-profit: {Number(current.take_profit).toFixed(2)}
        </div>

        <button
          type="button"
          onClick={handleStop}
          disabled={stopping}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white transition-all duration-150 disabled:opacity-50"
          style={{ background: "#e8404a" }}
        >
          <Square size={14} />
          {stopping ? "Stopping…" : "Stop automation"}
        </button>

        {error && <div className="text-fx-red text-xs">{error}</div>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-fx-border bg-fx-surface p-5 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-fx-text flex items-center gap-2">
          <Bot size={16} className="text-fx-teal" /> Bot automation
        </h3>
        <p className="text-fx-text-dim text-xs mt-1">
          Repeats your current contract setup automatically until stopped, stop-loss, or take-profit is hit.
        </p>
      </div>

      <div>
        <label className="input-label">Stake per trade</label>
        <input
          type="number" min="0.01" step="0.01" value={stake}
          onChange={(e) => setStake(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="input-label">Stop-loss</label>
          <input
            type="number" min="0.01" step="0.01" value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">Take-profit</label>
          <input
            type="number" min="0.01" step="0.01" value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {error && <div className="text-fx-red text-xs">{error}</div>}

      <button
        type="button"
        onClick={handleStart}
        disabled={!instrument || starting}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "#00c2b2" }}
      >
        <Play size={14} />
        {starting ? "Starting…" : "Start automation"}
      </button>
    </div>
  );
}