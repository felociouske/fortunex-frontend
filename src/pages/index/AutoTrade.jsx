import { motion } from "framer-motion"
import { ArrowRight, Cpu, BarChart3, ShieldCheck } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const features = [
  { icon: Cpu, title: "No coding required", desc: "Build trading bots visually with a drag-and-drop block editor — no programming knowledge needed." },
  { icon: BarChart3, title: "Backtested strategies", desc: "Test your bot against historical data before committing any real funds." },
  { icon: ShieldCheck, title: "Built-in risk controls", desc: "Set loss limits and position sizes so your bot always trades within your defined parameters." },
]

const botTypes = [
  { name: "Trend follower", desc: "Automatically enters trades in the direction of the prevailing trend using moving averages." },
  { name: "Range trader", desc: "Buys at support and sells at resistance within a defined price range." },
  { name: "Martingale", desc: "Increases stake after each loss, aiming to recover with the next winning trade." },
  { name: "Custom logic", desc: "Build entirely custom entry and exit logic using the block editor." },
]

export default function AutoTrade() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 65% 35%, rgba(80,255,148,0.06), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Automation
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              AutoTrade.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85, marginBottom: 36 }}>
              Automate your trading strategies with smart bots that run 24/7. No coding required — define your rules visually and let the bot execute.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 999, background: "#ff4f6f", color: "white", fontWeight: 700, textDecoration: "none", boxShadow: "0 16px 44px rgba(255,79,120,0.28)" }}>
                Launch AutoTrade <ArrowRight size={18} />
              </a>
              <a href="/register" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", color: "white", fontWeight: 700, textDecoration: "none" }}>
                Open free account
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, margin: "-20px auto 0 auto", borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <img
              src="/images/autotrade-placeholder.png"
              alt="AutoTrade bot builder interface"
              style={{ width: "100%", height: "auto", maxHeight: 400, objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 36 }}>Pre-built strategies</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {botTypes.map((b, i) => (
              <motion.div key={b.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }} style={{ padding: 24, borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 10px" }}>{b.name}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,79,120,0.12)", display: "grid", placeItems: "center", marginBottom: 20 }}>
                  <f.icon size={22} color="#ff4f6f" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
