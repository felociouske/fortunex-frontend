import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, Sparkles, Check, Lock } from "lucide-react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { botsAPI } from "../../api/bots";
import { walletAPI } from "../../api/market";

/**
 * Bot/AI marketplace -- browse both catalogs, see win-chance and
 * unlocked-contract-count per tier, and purchase. Purchasing always
 * deducts from deposit_balance and immediately deactivates whatever
 * automation (bot OR AI) was previously active -- the backend enforces
 * this; this page just reflects it back via my-automation after a
 * purchase succeeds.
 */
export default function Bots() {
  const queryClient = useQueryClient();
  const [purchasingId, setPurchasingId] = useState(null);
  const [error, setError] = useState("");
  const [justPurchased, setJustPurchased] = useState(null);

  const { data: botsData, isLoading: botsLoading } = useQuery({
    queryKey: ["botCatalog"],
    queryFn: botsAPI.getCatalog,
  });
  const { data: aiData, isLoading: aiLoading } = useQuery({
    queryKey: ["aiCatalog"],
    queryFn: botsAPI.getAICatalog,
  });
  const { data: myAutomationData } = useQuery({
    queryKey: ["myAutomation"],
    queryFn: botsAPI.getMyAutomation,
  });
  const { data: walletData } = useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletAPI.getBalance,
  });

  const bots = botsData?.data || [];
  const ais = aiData?.data || [];
  const activeAutomation = myAutomationData?.data?.active;
  const wallet = walletData?.data;

  const handlePurchase = async (product) => {
    setError("");
    setJustPurchased(null);
    setPurchasingId(product.id);
    try {
      await botsAPI.purchase(product.id);
      setJustPurchased(product.name);
      queryClient.invalidateQueries({ queryKey: ["myAutomation"] });
      queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
      queryClient.invalidateQueries({ queryKey: ["myTier"] });
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || "Purchase failed.");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Bots & Trading AI</h1>
            <p className="text-fx-text-dim text-sm mt-1">
              Automate your trades and boost your win chance. Only one bot or AI is active at a
              time — buying a new one replaces whatever's currently active.
            </p>
          </div>
          {wallet && (
            <div className="rounded-lg bg-fx-surface2 px-4 py-2 text-sm text-fx-text-dim flex-shrink-0">
              Deposit balance:{" "}
              <span className="text-fx-teal font-semibold">
                {Number(wallet.deposit_balance).toFixed(2)} {wallet.currency}
              </span>
            </div>
          )}
        </div>

        {activeAutomation && (
          <div className="rounded-xl border border-fx-teal/30 bg-fx-surface2 px-4 py-3 flex items-center gap-3 text-sm">
            <Check size={16} className="text-fx-teal flex-shrink-0" />
            <span>
              Currently active: <span className="font-semibold text-fx-teal">{activeAutomation.product.name}</span>
              {" — "}
              {(Number(activeAutomation.product.win_chance) * 100).toFixed(0)}% win chance
            </span>
          </div>
        )}

        {justPurchased && (
          <div className="rounded-xl bg-fx-surface2 px-4 py-3 text-sm text-fx-teal">
            {justPurchased} purchased and activated.
          </div>
        )}
        {error && <div className="rounded-xl bg-fx-surface2 px-4 py-3 text-sm text-fx-red">{error}</div>}

        {/* Bots */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Bot size={18} className="text-fx-teal" /> Trading Bots
          </h2>
          {botsLoading ? (
            <p className="text-fx-text-dim">Loading bots…</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bots.map((bot) => (
                <ProductCard
                  key={bot.id}
                  product={bot}
                  isActive={activeAutomation?.product?.id === bot.id}
                  onPurchase={() => handlePurchase(bot)}
                  purchasing={purchasingId === bot.id}
                  insufficientFunds={wallet && Number(wallet.deposit_balance) < Number(bot.price)}
                />
              ))}
            </div>
          )}
        </section>

        {/* AIs */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-fx-teal" /> Trading AI
          </h2>
          <p className="text-fx-text-dim text-sm mb-4 -mt-2">
            AIs do everything a bot does, plus give live trend commentary and a bot recommendation.
          </p>
          {aiLoading ? (
            <p className="text-fx-text-dim">Loading AI tiers…</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ais.map((ai) => (
                <ProductCard
                  key={ai.id}
                  product={ai}
                  isActive={activeAutomation?.product?.id === ai.id}
                  onPurchase={() => handlePurchase(ai)}
                  purchasing={purchasingId === ai.id}
                  insufficientFunds={wallet && Number(wallet.deposit_balance) < Number(ai.price)}
                  accent
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ProductCard({ product, isActive, onPurchase, purchasing, insufficientFunds, accent }) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{
        borderColor: isActive ? "#00c2b2" : "#2a2a3d",
        background: accent ? "rgba(0,194,178,0.03)" : "#13131f",
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-fx-text">{product.name}</h3>
          {isActive && (
            <span className="text-xs font-semibold text-fx-teal flex items-center gap-1">
              <Check size={12} /> Active
            </span>
          )}
        </div>
        <p className="text-fx-text-dim text-xs mt-1">Tier {product.tier}</p>
      </div>

      <div className="text-2xl font-bold text-fx-text tabular-nums">
        ${Number(product.price).toFixed(2)}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-fx-text-dim">Win chance</span>
          <span className="font-semibold text-fx-teal">{product.win_chance_percent.toFixed(0)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-fx-text-dim">Contracts unlocked</span>
          <span className="font-semibold text-fx-text">{product.unlocked_contract_count} / 6</span>
        </div>
      </div>

      <button
        type="button"
        disabled={isActive || purchasing || insufficientFunds}
        onClick={onPurchase}
        className="btn-teal w-full mt-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isActive ? (
          "Active"
        ) : insufficientFunds ? (
          <>
            <Lock size={14} /> Insufficient deposit balance
          </>
        ) : purchasing ? (
          "Purchasing…"
        ) : (
          "Purchase"
        )}
      </button>
    </div>
  );
}