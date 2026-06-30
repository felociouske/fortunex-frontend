import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, TrendingDown, ShieldCheck, BarChart3 } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const howItWorks = [
  { step: "01", title: "Choose your market", desc: "Pick from forex, stocks, commodities, crypto or synthetic indices." },
  { step: "02", title: "Go long or short", desc: "Speculate on the price going up (buy) or down (sell) without owning the asset." },
  { step: "03", title: "Set your position size", desc: "Define how much you want to trade and review your margin requirement." },
  { step: "04", title: "Manage your trade", desc: "Monitor P&L in real time, set stop-loss and take-profit levels, and close when ready." },
]

const features = [
  { icon: TrendingUp, title: "Long positions", desc: "Profit when markets rise by opening buy positions on any available asset." },
  { icon: TrendingDown, title: "Short positions", desc: "Profit when markets fall by opening sell positions — no restrictions." },
  { icon: ShieldCheck, title: "Defined risk tools", desc: "Stop-loss and take-profit orders to manage every trade automatically." },
  { icon: BarChart3, title: "Leverage", desc: "Open larger positions with a fraction of the notional value as margin." },
]

export default function CFDs() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      {/* Hero */}
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 25% 50%, rgba(255,79,120,0.1), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              CFDs
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Contracts for<br />difference.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 540, lineHeight: 1.85, marginBottom: 36 }}>
              CFDs let you trade price movements across any market — long or short — without owning the underlying asset. Access leverage, flexible sizing and global markets in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Risk warning banner */}
      <section style={{ padding: "24px 28px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ padding: "16px 22px", borderRadius: 16, background: "rgba(255,200,79,0.06)", border: "1px solid rgba(255,200,79,0.15)" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
              CFDs are complex instruments and carry a high risk of losing money due to leverage. You should consider whether you understand how CFDs work and whether you can afford the high risk of losing your money.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 12 }}>How CFD trading works</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 48, maxWidth: 520, lineHeight: 1.8 }}>
            You speculate on price direction without owning the asset. Your profit or loss is the difference between entry and exit price.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "#ff4f6f", color: "white", fontWeight: 800, fontSize: 12, marginBottom: 18 }}>
                  {step.step}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 40 }}>What you get with FortuNex CFDs</h2>
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
