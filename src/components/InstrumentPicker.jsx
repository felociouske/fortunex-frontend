import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Compact instrument switcher shown above the chart -- click to open a
 * dropdown of active instruments fetched by the parent Dashboard.
 */
export default function InstrumentPicker({ instruments, selected, onSelect }) {
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-fx-border bg-fx-surface text-sm font-semibold text-fx-text hover:border-fx-teal transition-colors duration-150"
      >
        {selected ? selected.name : "Select instrument"}
        <ChevronDown size={16} className="text-fx-text-dim" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-64 rounded-lg border border-fx-border bg-fx-surface shadow-2xl overflow-hidden">
          {instruments.length === 0 ? (
            <div className="px-4 py-3 text-sm text-fx-text-dim">No instruments available.</div>
          ) : (
            instruments.map((inst) => (
              <button
                key={inst.id}
                type="button"
                onClick={() => {
                  onSelect(inst);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-fx-surface2 transition-colors duration-150"
                style={{ color: selected?.id === inst.id ? "#00c2b2" : "#e5e7eb" }}
              >
                <div className="font-medium">{inst.name}</div>
                <div className="text-xs text-fx-text-dim">{inst.symbol}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}