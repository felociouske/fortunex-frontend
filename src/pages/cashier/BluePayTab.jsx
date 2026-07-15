import AccountBanner from "./AccountBanner";
import BluePayDepositForm from "./BluePayDepositForm";

/**
 * Top-level Cashier sidebar tab for BluePay, replacing the old
 * "Transfer" placeholder slot. Fully separate from the Deposit tab's
 * Daraja M-Pesa flow (DepositTab.jsx / MpesaDepositForm.jsx) -- nothing
 * in this file is shared with, or required by, that flow.
 */
export default function BluePayTab() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold">Deposit via BluePay</h1>
      <p className="text-fx-text-dim mt-2 text-sm sm:text-base">
        Pay instantly with M-Pesa STK Push, processed through BluePay.
      </p>

      <div className="mt-6">
        <AccountBanner />
      </div>

      <div className="mt-6">
        <BluePayDepositForm />
      </div>
    </div>
  );
}