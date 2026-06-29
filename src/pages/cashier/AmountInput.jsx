import { useMemo } from "react";

/**
 * Shared amount input used by Deposit and Withdrawal tabs.
 * Preset chips give one-tap common amounts; manual entry stays
 * available and stays in sync with chip selection.
 */
export default function AmountInput({
  amount,
  onChange,
  presets = [10, 50, 100, 500],
  currency = "USD",
  min = 1,
}) {
  const activePreset = useMemo(() => {
    const n = Number(amount);
    return presets.find((p) => p === n) ?? null;
  }, [amount, presets]);

  return (
    <div>
      <label className="input-label">Amount</label>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {presets.map((p) => {
          const active = activePreset === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(String(p))}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150"
              style={
                active
                  ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                  : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
              }
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Manual entry */}
      <div className="relative">
        <input
          type="number"
          min={min}
          step="0.01"
          value={amount}
          onChange={(e) => onChange(e.target.value)}
          placeholder="100.00"
          className="input-field pr-16"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-fx-text-dim text-sm font-medium pointer-events-none">
          {currency}
        </span>
      </div>
    </div>
  );
}
