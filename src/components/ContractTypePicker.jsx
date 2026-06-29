import { useState, useRef, useEffect } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { CONTRACT_TYPES } from "../utils/contractTypes";

/**
 * Segmented dropdown for choosing one of the 6 contract types. Locked
 * types (not yet unlocked by the user's active bot/AI tier) are shown
 * greyed out with a lock icon and a tooltip, rather than hidden --
 * this is a deliberate upsell signal, not a real restriction (the
 * backend doesn't enforce unlocks; this is UI-only encouragement).
 */
export default function ContractTypePicker({ selected, onSelect, unlockedContracts }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectedMeta = CONTRACT_TYPES.find((c) => c.code === selected);
  const isUnlocked = (code) => unlockedContracts.includes(code);

  return (
    <div className="relative" ref={ref}>
      <label className="input-label">Contract type</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input-field flex items-center justify-between text-left"
      >
        <span>{selectedMeta?.label || "Select contract type"}</span>
        <ChevronDown size={16} className="text-fx-text-dim flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-fx-border bg-fx-surface shadow-2xl overflow-hidden">
          {CONTRACT_TYPES.map((type) => {
            const unlocked = isUnlocked(type.code);
            return (
              <button
                key={type.code}
                type="button"
                disabled={!unlocked}
                title={!unlocked ? "Purchase a bot or AI to unlock this contract type" : undefined}
                onClick={() => {
                  if (!unlocked) return;
                  onSelect(type.code);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between gap-2"
                style={{
                  color: !unlocked ? "#6b7280" : selected === type.code ? "#00c2b2" : "#e5e7eb",
                  cursor: unlocked ? "pointer" : "not-allowed",
                  background: selected === type.code && unlocked ? "rgba(0,194,178,0.08)" : "transparent",
                }}
              >
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs opacity-70">{type.short}</div>
                </div>
                {!unlocked && <Lock size={14} className="flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}