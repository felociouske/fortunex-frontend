/**
 * Shared amount input used by Deposit and Withdrawal tabs.
 * No preset chips, the user always types their own amount. `presets`
 * is still accepted as a prop (but unused) so existing call sites like
 * <AmountInput presets={[...]} /> keep working without needing to be
 * edited too, React just ignores props a component does not read.
 */
export default function AmountInput({
  amount,
  onChange,
  currency = "USD",
  min = 1,
}) {
  return (
    <div>
      <label className="input-label">Amount</label>

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