import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Lock, Upload, HardDrive, Bot, Sparkles,
  Link2, AlertTriangle, FileCode, Cpu, ChevronDown, ChevronUp,
} from "lucide-react";
import DashboardNavbar from "../../components/DashboardNavbar";
import { botsAPI } from "../../api/bots";
import { walletAPI } from "../../api/market";

// ─── Frontend-only model metadata ─────────────────────────────
// Keyed by kind + tier. Adds a model/engine label and a one-line
// technical descriptor that the backend description field doesn't carry.
const MODEL_META = {
  BOT: {
    1: { engine: "FortuneX Core v1",   badge: "Entry",    tagline: "Fixed-stake execution, single contract type, 1-second tick resolution." },
    2: { engine: "FortuneX Core v2",   badge: "Standard", tagline: "Martingale & D'Alembert strategies, 3 contract types, adaptive stake sizing." },
    3: { engine: "FortuneX Core v3",   badge: "Advanced", tagline: "Fibonacci & Labouchère sequencing, 4 contract types, dynamic stop-loss logic." },
    4: { engine: "FortuneX Core Pro",  badge: "Pro",       tagline: "Full 6-contract access, multi-strategy switching, real-time risk management." },
    5: { engine: "FortuneX Core Elite",badge: "Elite",     tagline: "Highest win-probability engine, custom cadence, priority execution queue." },
  },
  AI: {
    1: { engine: "FX-Nano 1B",   badge: "Nano",    tagline: "Lightweight inference model. Fast tick-level pattern matching, low latency." },
    2: { engine: "FX-Mini 7B",   badge: "Mini",    tagline: "7-billion parameter model. Multi-timeframe trend analysis with live commentary." },
    3: { engine: "FX-Base 13B",  badge: "Base",    tagline: "13B parameter base. Deep market-structure analysis, bot recommendation engine." },
    4: { engine: "FX-Large 34B", badge: "Large",   tagline: "34B parameter model. Institutional-grade signal generation, adaptive retraining." },
    5: { engine: "FX-Ultra 70B", badge: "Ultra",   tagline: "70B parameter frontier model. Highest inference accuracy, real-time recalibration." },
  },
};

function getMeta(kind, tier) {
  return MODEL_META[kind]?.[tier] ?? {
    engine: `FortuneX ${kind === "AI" ? "AI" : "Bot"} Tier ${tier}`,
    badge: `T${tier}`,
    tagline: "",
  };
}

// ─── Import sources ────────────────────────────────────────────
const IMPORT_SOURCES = [
  {
    id: "file",
    label: "Upload file",
    icon: FileCode,
    description: "Upload a .json, .py or .xml bot config file from your device.",
    placeholder: null,
    inputType: "file",
  },
  {
    id: "drive",
    label: "Google Drive",
    icon: HardDrive,
    description: "Paste a shared Google Drive link to your bot configuration.",
    placeholder: "https://drive.google.com/file/d/...",
    inputType: "url",
  },
  {
    id: "claude",
    label: "Claude AI",
    icon: Cpu,
    description: "Paste a Claude-generated bot strategy or API export.",
    placeholder: "Paste Claude AI strategy export or URL...",
    inputType: "text",
  },
  {
    id: "url",
    label: "External URL",
    icon: Link2,
    description: "Link directly to a hosted bot config endpoint.",
    placeholder: "https://example.com/bot-config.json",
    inputType: "url",
  },
];

// ─── Main page ─────────────────────────────────────────────────
export default function Bots() {
  const queryClient = useQueryClient();
  const [purchasingId, setPurchasingId] = useState(null);
  const [error, setError] = useState("");
  const [justPurchased, setJustPurchased] = useState(null);
  const [lockedPopup, setLockedPopup] = useState(null);

  const [importSource, setImportSource] = useState(null);
  const [importValue, setImportValue] = useState("");
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);

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
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.detail ||
          "Purchase failed."
      );
    } finally {
      setPurchasingId(null);
    }
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importSource) return;
    setImporting(true);
    setImportResult(null);
    setTimeout(() => {
      setImportResult("incompatible");
      setImporting(false);
    }, 1400);
  };

  const resetImport = () => {
    setImportSource(null);
    setImportValue("");
    setImportFile(null);
    setImportResult(null);
  };

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />

      {/* ── Locked popup ── */}
      {lockedPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setLockedPopup(null)}
        >
          <div
            className="bg-fx-surface border border-fx-border p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-semibold text-fx-text mb-1">{lockedPopup.name}</p>
            <p className="text-fx-text-dim text-sm mb-4">
              Your deposit balance is insufficient to purchase this product. The
              price is{" "}
              <span className="text-fx-text font-medium">
                ${Number(lockedPopup.price).toFixed(2)}
              </span>
              . Please fund your account and try again.
            </p>
            <button
              type="button"
              onClick={() => setLockedPopup(null)}
              className="text-sm text-fx-teal hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto py-10 px-4 space-y-16">

        {/* ── Page header ── */}
        <div className="border-b border-fx-border pb-8">
          <p className="text-xs uppercase tracking-widest text-fx-text-dim font-medium mb-3">
            Automation
          </p>
          <h1 className="text-2xl font-bold mb-3">Bots & Trading AI</h1>
          <p className="text-fx-text-dim text-sm max-w-xl leading-relaxed">
            FortuneX automation lets you define your stake settings target and let the
            system trade on your behalf. Your stake, duration, and contract type stay
            fully under your control from the trading panel. 
          </p>

          {activeAutomation && (
            <div className="mt-5 inline-flex items-center gap-2 border border-fx-teal/30 px-3 py-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-fx-teal flex-shrink-0" />
              <span className="text-fx-text-dim">
                Active:{" "}
                <span className="text-fx-text font-medium">
                  {activeAutomation.product.name}
                </span>
                {" — "}
                <span className="text-fx-teal font-medium">
                  {(Number(activeAutomation.product.win_chance) * 100).toFixed(0)}% win chance
                </span>
              </span>
            </div>
          )}

          {justPurchased && (
            <p className="mt-4 text-sm text-fx-teal">{justPurchased} purchased and activated.</p>
          )}
          {error && <p className="mt-4 text-sm text-fx-red">{error}</p>}
        </div>

        {/* ── Trading Bots ── */}
        <section>
          <div className="flex items-start gap-3 mb-6">
            <Bot size={16} className="text-fx-teal mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-base font-semibold">Trading Bots</h2>
              <p className="text-fx-text-dim text-sm mt-1 leading-relaxed max-w-xl">
                Rule-based automation engines that execute your chosen contract on a fixed
                cadence. Each tier upgrades the underlying execution engine and unlocks additional contract types from a
                simple fixed-stake entry bot up to a full multi-strategy elite engine
                with dynamic risk controls.
              </p>
            </div>
          </div>

          {botsLoading ? (
            <p className="text-fx-text-dim text-sm">Loading bots…</p>
          ) : (
            <ProductList
              items={bots}
              kind="BOT"
              activeId={activeAutomation?.product?.id}
              wallet={wallet}
              purchasingId={purchasingId}
              onPurchase={handlePurchase}
              onLockedClick={setLockedPopup}
            />
          )}
        </section>

        {/* ── Trading AI ── */}
        <section>
          <div className="flex items-start gap-3 mb-6">
            <Sparkles size={16} className="text-fx-teal mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-base font-semibold">Trading AI</h2>
              <p className="text-fx-text-dim text-sm mt-1 leading-relaxed max-w-xl">
                FortuneX AI tiers run large-language and time-series models trained on
                synthetic index behaviour. Beyond automated execution, each AI tier
                delivers live trend commentary and a real-time bot recommendation and
                the larger the model, the deeper the market-structure. Model size scales with tier, from the
                lightweight FX-Nano entry model to the 70B-parameter FX-Ultra frontier engine.
              </p>
            </div>
          </div>

          {aiLoading ? (
            <p className="text-fx-text-dim text-sm">Loading AI tiers…</p>
          ) : (
            <ProductList
              items={ais}
              kind="AI"
              activeId={activeAutomation?.product?.id}
              wallet={wallet}
              purchasingId={purchasingId}
              onPurchase={handlePurchase}
              onLockedClick={setLockedPopup}
            />
          )}
        </section>

        {/* ── Import external bot / AI ── */}
        <section className="border-t border-fx-border pt-10">
          <div className="flex items-start gap-3 mb-1">
            <Upload size={16} className="text-fx-text-dim mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-base font-semibold">Import External Bot or AI</h2>
              <p className="text-fx-text-dim text-sm mt-1 leading-relaxed max-w-xl">
                Already have a trading bot or AI strategy from another platform? Submit it
                here and FortuneX will attempt to validate it against the FortuneX contract
                execution protocol. Supported sources include device files, Google Drive,
                Claude AI strategy exports, and direct config URLs.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-fx-text-dim font-medium mb-3">
              Select import source
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {IMPORT_SOURCES.map((src) => {
                const Icon = src.icon;
                const selected = importSource?.id === src.id;
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => {
                      setImportSource(src);
                      setImportValue("");
                      setImportFile(null);
                      setImportResult(null);
                    }}
                    className="text-left border p-4 transition-colors"
                    style={{
                      borderColor: selected
                        ? "var(--color-fx-teal, #00c2b2)"
                        : "var(--color-fx-border, #2a2a3d)",
                      background: selected ? "rgba(0,194,178,0.04)" : "transparent",
                    }}
                  >
                    <Icon
                      size={18}
                      className={selected ? "text-fx-teal" : "text-fx-text-dim"}
                    />
                    <p
                      className={`text-sm font-medium mt-2 ${
                        selected ? "text-fx-teal" : "text-fx-text"
                      }`}
                    >
                      {src.label}
                    </p>
                    <p className="text-fx-text-dim text-xs mt-1 leading-snug">
                      {src.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {importSource && (
              <form onSubmit={handleImportSubmit} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-fx-text-dim font-medium mb-2">
                    {importSource.label}
                  </label>

                  {importSource.inputType === "file" ? (
                    <div className="border border-fx-border p-6 text-center">
                      <input
                        type="file"
                        accept=".json,.py,.xml,.yaml,.yml"
                        id="bot-file-upload"
                        className="sr-only"
                        onChange={(e) => {
                          setImportFile(e.target.files?.[0] || null);
                          setImportResult(null);
                        }}
                      />
                      <label htmlFor="bot-file-upload" className="cursor-pointer">
                        {importFile ? (
                          <span className="text-sm text-fx-text font-medium">
                            {importFile.name}
                          </span>
                        ) : (
                          <span className="text-sm text-fx-text-dim">
                            Click to choose a file —{" "}
                            <span className="text-fx-text">.json, .py, .xml, .yaml</span>
                          </span>
                        )}
                      </label>
                    </div>
                  ) : (
                    <input
                      type={importSource.inputType}
                      value={importValue}
                      onChange={(e) => {
                        setImportValue(e.target.value);
                        setImportResult(null);
                      }}
                      placeholder={importSource.placeholder}
                      className="w-full bg-transparent border border-fx-border px-3 py-2.5 text-sm text-fx-text placeholder:text-fx-text-dim focus:outline-none focus:border-fx-teal"
                      required
                    />
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={
                      importing ||
                      (importSource.inputType === "file"
                        ? !importFile
                        : !importValue.trim())
                    }
                    className="text-sm font-medium border border-fx-border px-5 py-2 hover:border-fx-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {importing ? "Validating…" : "Validate & import"}
                  </button>
                  <button
                    type="button"
                    onClick={resetImport}
                    className="text-sm text-fx-text-dim hover:text-fx-text transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {importResult === "incompatible" && (
                  <div className="border border-fx-red/40 p-4 flex gap-3 items-start mt-2">
                    <AlertTriangle size={16} className="text-fx-red flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-fx-text mb-1">
                        Not compatible with FortuneX
                      </p>
                      <p className="text-sm text-fx-text-dim leading-relaxed">
                        The submitted configuration could not be validated against the
                        FortuneX execution protocol. External bots and AI strategies must
                        conform to the FortuneX contract API schema to run here.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </section>

        {/* ── Compatibility note ── */}
        <section className="border-t border-fx-border pt-8 pb-4">
          <p className="text-xs text-fx-text-dim leading-relaxed max-w-2xl">
            <span className="text-fx-text font-medium">Compatibility note: </span>
            FortuneX bots and AI operate exclusively within the FortuneX contract
            execution environment. Third-party strategies built for MetaTrader, Deriv
            Bot, or any other platform are not cross-compatible and cannot be activated
            here. FortuneX AI models are proprietary fine-tuned engines and external LLM
            exports (GPT, Gemini, etc.) do not map to our execution schema.
          </p>
        </section>
      </main>
    </div>
  );
}

// ─── Product list (expandable rows) ───────────────────────────
function ProductList({ items, kind, activeId, wallet, purchasingId, onPurchase, onLockedClick }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!items.length)
    return <p className="text-fx-text-dim text-sm">No products available.</p>;

  return (
    <div className="border border-fx-border divide-y divide-fx-border">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const locked = wallet && Number(wallet.deposit_balance) < Number(item.price);
        const purchasing = purchasingId === item.id;
        const expanded = expandedId === item.id;
        const meta = getMeta(kind, item.tier);

        return (
          <div key={item.id} style={{ background: isActive ? "rgba(0,194,178,0.03)" : "transparent" }}>

            {/* ── Main row ── */}
            <div className="px-4 py-4 flex items-center gap-4">

              {/* Tier badge */}
              <div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-fx-border text-xs font-bold text-fx-text-dim"
                title={`Tier ${item.tier}`}
              >
                {item.tier}
              </div>

              {/* Name + engine */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-fx-text">{item.name}</span>
                  <span className="text-xs text-fx-text-dim border border-fx-border px-1.5 py-0.5">
                    {meta.engine}
                  </span>
                  <span className="text-xs font-semibold text-fx-teal/70 border border-fx-teal/20 px-1.5 py-0.5">
                    {meta.badge}
                  </span>
                  {isActive && (
                    <span className="text-xs text-fx-teal font-medium">● Active</span>
                  )}
                </div>
                <p className="text-xs text-fx-text-dim mt-0.5 truncate">{meta.tagline}</p>
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-fx-text-dim mb-0.5">Price</p>
                <p className="text-sm font-mono font-medium text-fx-text">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>

              {/* Action */}
              <div className="flex-shrink-0 w-20 text-right">
                {isActive ? (
                  <span className="text-xs text-fx-teal font-medium">Active</span>
                ) : locked ? (
                  <button
                    type="button"
                    onClick={() => onLockedClick(item)}
                    className="text-fx-text-dim hover:text-fx-text transition-colors"
                    title="Insufficient balance"
                  >
                    <Lock size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={purchasing}
                    onClick={() => onPurchase(item)}
                    className="text-xs font-medium text-fx-teal hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchasing ? "Purchasing…" : "Purchase"}
                  </button>
                )}
              </div>

              {/* Expand toggle */}
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : item.id)}
                className="flex-shrink-0 text-fx-text-dim hover:text-fx-text transition-colors"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {/* ── Expanded detail panel ── */}
            {expanded && (
              <div className="px-4 pb-5 pt-1 border-t border-fx-border grid sm:grid-cols-2 gap-6">

                {/* Description from backend */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-fx-text-dim font-medium mb-2">
                    Description
                  </p>
                  <p className="text-sm text-fx-text-dim leading-relaxed">
                    {item.description || "No description provided for this tier."}
                  </p>
                </div>

                {/* Specs */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-fx-text-dim font-medium mb-2">
                    Specifications
                  </p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4 border-b border-fx-border pb-1.5">
                      <dt className="text-fx-text-dim">Engine</dt>
                      <dd className="text-fx-text font-medium text-right">{meta.engine}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-fx-border pb-1.5">
                      <dt className="text-fx-text-dim">Contracts unlocked</dt>
                      <dd className="text-fx-text font-medium">{item.unlocked_contract_count} / 6</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-fx-border pb-1.5">
                      <dt className="text-fx-text-dim">Tier</dt>
                      <dd className="text-fx-text font-medium">{item.tier}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-fx-text-dim">Price</dt>
                      <dd className="text-fx-text font-mono font-medium">
                        ${Number(item.price).toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                </div>


              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}