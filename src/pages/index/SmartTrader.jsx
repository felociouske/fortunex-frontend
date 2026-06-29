import { motion } from "framer-motion"
import { ArrowRight, Monitor, BarChart3, Layers } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const capabilities = [
  { icon: BarChart3, title: "400+ indicators", desc: "Technical analysis tools from moving averages to Bollinger Bands, RSI, MACD and beyond." },
  { icon: Monitor, title: "Multiple chart types", desc: "Candlestick, OHLC, line and area charts with customizable timeframes from 1 second to monthly." },
  { icon: Layers, title: "All trade types", desc: "CFDs, options and multipliers all accessible from the same interface." },
]

const steps = [
  { step: "01", title: "Log in to SmartTrader", desc: "Access via web — no download or installation required." },
  { step: "02", title: "Select your market", desc: "Choose from forex, crypto, indices, stocks and synthetic indices." },
  { step: "03", title: "Configure your trade", desc: "Set your stake, duration and risk parameters." },
  { step: "04", title: "Place and monitor", desc: "Execute with one click and track your position in real time." },
]

export default function SmartTrader() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 20% 40%, rgba(80,148,255,0.1), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Web platform
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              SmartTrader.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85, marginBottom: 36 }}>
              A professional-grade web trading platform with advanced charting, 400+ technical indicators and one-click execution across all markets.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 999, background: "#ff4f6f", color: "white", fontWeight: 700, textDecoration: "none", boxShadow: "0 16px 44px rgba(255,79,120,0.28)" }}>
                Launch platform <ArrowRight size={18} />
              </a>
              <a href="/register" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", color: "white", fontWeight: 700, textDecoration: "none" }}>
                Open free account
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform screenshot */}
      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, margin: "-20px auto 0 auto", borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <img
              src="/images/smarttrader-placeholder.png"
              alt="SmartTrader platform screenshot"
              style={{ width: "100%", height: "auto", maxHeight: 400, objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 40 }}>Built for serious traders</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {capabilities.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,79,120,0.12)", display: "grid", placeItems: "center", marginBottom: 20 }}>
                  <c.icon size={22} color="#ff4f6f" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 40 }}>Getting started</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {steps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }} style={{ padding: 28, borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "#ff4f6f", color: "white", fontWeight: 800, fontSize: 12, marginBottom: 16 }}>
                  {s.step}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
