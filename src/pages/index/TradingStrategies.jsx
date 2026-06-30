import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const strategies = [
  {
    name: "Trend following",
    level: "Beginner",
    timeframe: "Daily / 4H",
    desc: "Identify the prevailing market direction using moving averages or higher-high/higher-low structure, then trade in that direction only. Simple and effective in trending markets.",
    tools: ["Moving average (50/200 EMA)", "ADX indicator", "Price action structure"],
  },
  {
    name: "Support and resistance",
    level: "Beginner",
    timeframe: "1H / 4H",
    desc: "Identify key price levels where the market has previously reversed. Buy at support, sell at resistance, with stops placed just beyond the level.",
    tools: ["Horizontal levels", "Previous highs/lows", "Volume profile"],
  },
  {
    name: "Breakout trading",
    level: "Intermediate",
    timeframe: "1H / Daily",
    desc: "Wait for price to break above a resistance level or below a support level with conviction. Enter on the breakout candle close and manage the trade with a trailing stop.",
    tools: ["Price channels", "Consolidation zones", "Volume confirmation"],
  },
  {
    name: "Mean reversion",
    level: "Intermediate",
    timeframe: "15m / 1H",
    desc: "When a market has moved sharply in one direction, look for overextension signals and trade a return to the average. Works well in ranging, choppy conditions.",
    tools: ["RSI (overbought/oversold)", "Bollinger Bands", "VWAP"],
  },
  {
    name: "News trading",
    level: "Advanced",
    timeframe: "1m / 5m",
    desc: "Position around scheduled economic releases using the Economic Calendar. Requires fast execution, strict risk management and a clear read on market expectations.",
    tools: ["Economic Calendar", "Consensus estimates", "Tight stops"],
  },
  {
    name: "Scalping",
    level: "Advanced",
    timeframe: "1m / 5m",
    desc: "Open and close many small positions throughout the day, aiming for a few pips per trade. High frequency, requires discipline and a very tight spread.",
    tools: ["Order flow", "Level 2 data", "Momentum indicators"],
  },
]

const levelColor = { Beginner: "#4fd8a8", Intermediate: "#ffc84f", Advanced: "#ff4f6f" }

export default function TradingStrategies() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 65% 30%, rgba(80,148,255,0.09), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Learn
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Trading<br />strategies.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85 }}>
              Six proven approaches to financial markets, from simple trend-following for beginners to advanced scalping techniques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Strategy cards */}
      <section style={{ padding: "60px 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
            {strategies.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", padding: "5px 12px", borderRadius: 999, background: `${levelColor[s.level]}18`, color: levelColor[s.level], fontWeight: 700, fontSize: 11 }}>
                    {s.level}
                  </span>
                  <span style={{ display: "inline-flex", padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 11 }}>
                    {s.timeframe}
                  </span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px" }}>{s.name}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: "0 0 20px" }}>{s.desc}</p>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 10px" }}>Key tools</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {s.tools.map((t) => (
                      <span key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 64 }}>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>Practice any of these strategies risk-free on a demo account.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
