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
      <div className="rounded-xl border border-fx-border bg-[#11131f] p-4 text-sm text-fx-text-dim">
        <p className="font-medium text-fx-text mb-2 text-center">Bluepay is the fastest deposit route for Mpesa Users</p>
        <ol className="list-decimal list-inside space-y-1 text-center">
          <li>Enter the amount in USD and your M-Pesa phone number.</li>
          <li>You will receive an STK push prompt on your phone.</li>
          <li>Enter your M-Pesa PIN to approve the payment.</li>
          <li>Your wallet balance updates automatically once confirmed.</li>
        </ol>
      </div>
      <div className="mt-6">
        <BluePayDepositForm />
      </div>
    </div>
  );
}