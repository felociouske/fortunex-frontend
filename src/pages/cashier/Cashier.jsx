import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Wallet,
  Banknote,
  Handshake,
  ArrowLeftRight,
  Users,
} from "lucide-react";
import DashboardNavbar from "../../components/DashboardNavbar";
import DepositTab from "./DepositTab";
import WithdrawalTab from "./WithdrawalTab";
import PlaceholderTab from "./PlaceholderTab";

const TABS = [
  { key: "deposit", label: "Deposit", icon: Wallet },
  { key: "withdrawal", label: "Withdrawal", icon: Banknote },
  { key: "payment-agents", label: "Payment agents", icon: Handshake },
  { key: "transfer", label: "Transfer", icon: ArrowLeftRight },
  { key: "p2p", label: "Deriv P2P", icon: Users },
];

export default function Cashier() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = TABS.some((t) => t.key === searchParams.get("tab"))
    ? searchParams.get("tab")
    : "deposit";
  const [activeTab, setActiveTab] = useState(initialTab);

  const selectTab = (key) => {
    setActiveTab(key);
    setSearchParams({ tab: key });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "deposit":
        return <DepositTab />;
      case "withdrawal":
        return <WithdrawalTab />;
      case "payment-agents":
        return (
          <PlaceholderTab
            title="Payment agents"
            description="Deposit and withdraw through a trusted local agent."
          />
        );
      case "transfer":
        return (
          <PlaceholderTab
            title="Transfer"
            description="Move funds between your FortuNex accounts and wallets."
          />
        );
      case "p2p":
        return (
          <PlaceholderTab
            title="Deriv P2P"
            description="Trade directly with other users using your preferred payment method."
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold mb-8">Cashier</h1>

        <div className="rounded-2xl border border-fx-border bg-fx-surface overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar tabs */}
            <nav
              className="
                flex md:flex-col
                overflow-x-auto md:overflow-x-visible
                gap-1 md:gap-0
                p-3 md:p-4
                md:w-60 md:flex-shrink-0
                border-b md:border-b-0 md:border-r border-fx-border
              "
            >
              {TABS.map(({ key, label, icon: Icon }) => {
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectTab(key)}
                    className="
                      flex items-center gap-3
                      px-4 py-3 rounded-lg
                      text-sm font-medium
                      whitespace-nowrap
                      transition-colors duration-150
                      flex-shrink-0
                    "
                    style={
                      active
                        ? { background: "rgba(0,194,178,0.1)", color: "#00c2b2" }
                        : { color: "#9ca3af" }
                    }
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {label}
                  </button>
                );
              })}
            </nav>

            {/* Tab content */}
            <div className="flex-1 p-5 sm:p-8 min-w-0">{renderTab()}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
