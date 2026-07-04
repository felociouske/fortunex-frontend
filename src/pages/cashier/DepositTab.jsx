import { useState } from "react";
import { CreditCard, Building2, Wallet as WalletIcon, Banknote, Bitcoin, Smartphone } from "lucide-react";
import AccountBanner from "./AccountBanner";
import MpesaDepositForm from "./MpesaDepositForm";
import ManualMpesaDepositForm from "../../components/ManualMpesaDepositForm";

const paymentMethods = [
  { label: "Credit / Debit", icon: CreditCard },
  { label: "Instant Bank Transfer", icon: Building2 },
  { label: "E-wallet", icon: WalletIcon },
  { label: "Local Payment Methods", icon: Banknote },
];

const cryptoMethods = ["Bitcoin", "Ethereum", "Litecoin", "USD Coin", "Tether"];

export default function DepositTab() {
  const [method, setMethod] = useState("mpesa"); // "mpesa" | "manual"

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold">Deposit funds</h1>
      <p className="text-fx-text-dim mt-2 text-sm sm:text-base">
        Submit a deposit request and top up your wallet.
      </p>

      <div className="mt-6">
        <AccountBanner />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMethod("mpesa")}
          className="px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2"
          style={method === "mpesa"
            ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
            : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }}
        >
          <Smartphone size={16} /> M-Pesa (instant)
        </button>
        <button
          type="button"
          onClick={() => setMethod("manual")}
          className="px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2"
          style={method === "manual"
            ? { background: "#00c2b2", borderColor: "#00c2b2", color: "#0d0d14" }
            : { background: "transparent", borderColor: "#2a2a3d", color: "#9ca3af" }}
        >
          <Smartphone size={16} /> M-Pesa (manual)
        </button>
      </div>

      {method === "mpesa" ? <MpesaDepositForm /> : <ManualMpesaDepositForm />}

      {/* Reference: other payment methods (static for now, not yet functional) */}
      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Deposit via bank wire, credit card, and e-wallet
          </h2>
          <div className="card-elevated flex flex-wrap gap-x-8 gap-y-4">
            {paymentMethods.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5 text-fx-text-dim">
                <Icon size={20} className="text-fx-teal flex-shrink-0" />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Deposit cryptocurrencies</h2>
          <div className="card-elevated flex flex-wrap gap-x-8 gap-y-4">
            {cryptoMethods.map((label) => (
              <div key={label} className="flex items-center gap-2.5 text-fx-text-dim">
                <Bitcoin size={20} className="text-fx-teal flex-shrink-0" />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}