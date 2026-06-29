/**
 * Renders the type-specific prediction inputs for whichever contract
 * type is selected (everything except Rise/Fall, which uses the
 * dedicated Rise/Fall buttons instead -- see Contracts.jsx).
 *
 * `prediction` / `onChange` follow the same shape the backend expects
 * in OpenContractSerializer.PREDICTION_SCHEMAS, so this component's
 * output can be passed straight through to tradingAPI.openContract().
 */
export default function PredictionInput({ contractType, prediction, onChange, currentPrice }) {
  const set = (patch) => onChange({ ...prediction, ...patch });

  if (contractType === "EVEN_ODD") {
    return (
      <div>
        <label className="input-label">Predict last digit parity</label>
        <div className="grid grid-cols-2 gap-2">
          {["EVEN", "ODD"].map((parity) => (
            <button
              key={parity}
              type="button"
              onClick={() => set({ parity })}
              className="py-2 rounded-lg text-sm font-medium border transition-colors duration-150"
              style={
                prediction.parity === parity
                  ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                  : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
              }
            >
              {parity}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (contractType === "HIGHER_LOWER" || contractType === "TOUCH_NO_TOUCH") {
    const isTouch = contractType === "TOUCH_NO_TOUCH";
    const directionKey = isTouch ? "mode" : "direction";
    const options = isTouch ? ["TOUCH", "NO_TOUCH"] : ["HIGHER", "LOWER"];

    return (
      <div className="space-y-3">
        <div>
          <label className="input-label">{isTouch ? "Touch mode" : "Direction"}</label>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set({ [directionKey]: opt })}
                className="py-2 rounded-lg text-sm font-medium border transition-colors duration-150"
                style={
                  prediction[directionKey] === opt
                    ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                    : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
                }
              >
                {opt.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="input-label">Barrier price</label>
          <input
            type="number"
            step="0.000001"
            value={prediction.barrier ?? ""}
            onChange={(e) => set({ barrier: e.target.value })}
            placeholder={currentPrice ? Number(currentPrice).toFixed(2) : "e.g. 1005.00"}
            className="input-field"
          />
          {currentPrice && (
            <p className="text-fx-text-dim text-xs mt-1">
              Current price: {Number(currentPrice).toFixed(4)}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (contractType === "OVER_UNDER" || contractType === "MATCHES_DIFFERS") {
    const isMatches = contractType === "MATCHES_DIFFERS";
    const directionKey = isMatches ? "mode" : "direction";
    const options = isMatches ? ["MATCHES", "DIFFERS"] : ["OVER", "UNDER"];

    return (
      <div className="space-y-3">
        <div>
          <label className="input-label">{isMatches ? "Mode" : "Direction"}</label>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set({ [directionKey]: opt })}
                className="py-2 rounded-lg text-sm font-medium border transition-colors duration-150"
                style={
                  prediction[directionKey] === opt
                    ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                    : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="input-label">Digit (0-9)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 10 }, (_, d) => d).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => set({ digit: d })}
                className="py-2 rounded-lg text-sm font-semibold border transition-colors duration-150"
                style={
                  prediction.digit === d
                    ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
                    : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }
                }
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}