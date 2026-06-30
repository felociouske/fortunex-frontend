import { motion } from "framer-motion"
import { ArrowRight, Layers, TrendingUp, ShieldCheck } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const commodities = [
  { name: "Gold", symbol: "XAU/USD", category: "Metals" },
  { name: "Silver", symbol: "XAG/USD", category: "Metals" },
  { name: "Crude Oil (WTI)", symbol: "WTI/USD", category: "Energy" },
  { name: "Crude Oil (Brent)", symbol: "BRENT/USD", category: "Energy" },
  { name: "Natural Gas", symbol: "NGAS/USD", category: "Energy" },
  { name: "Platinum", symbol: "XPT/USD", category: "Metals" },
]

const features = [
  { icon: Layers, title: "Metals & energy", desc: "Gold, silver, oil and gas — the commodities that move global markets." },
  { icon: TrendingUp, title: "Leverage available", desc: "Control larger positions with a smaller capital outlay, with defined risk parameters." },
  { icon: ShieldCheck, title: "Transparent pricing", desc: "Spreads and overnight swap rates are always visible before you place a trade." },
]

export default function Commodities() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 20% 60%, rgba(255,200,79,0.06), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Commodities
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Gold, oil and more.<br />On one platform.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85, marginBottom: 36 }}>
              Trade CFDs on precious metals and energy markets with competitive spreads and flexible position sizing.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, margin: "-20px auto 0 auto", borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <img
              src="/images/commodities-placeholder.png"
              alt="Commodities chart gold and oil visual"
              style={{ width: "100%", height: "auto", maxHeight: 400, objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 36 }}>Available commodities</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {commodities.map((c, i) => (
              <motion.div
                key={c.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{ padding: "20px 24px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{c.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>{c.category}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{c.symbol}</span>
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
