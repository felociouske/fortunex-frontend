import { motion } from "framer-motion"
import { ArrowRight, Globe2, BarChart3, TrendingUp } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const stocks = [
  { name: "Apple Inc.", ticker: "AAPL", region: "US" },
  { name: "Tesla Inc.", ticker: "TSLA", region: "US" },
  { name: "NVIDIA Corp.", ticker: "NVDA", region: "US" },
  { name: "Microsoft Corp.", ticker: "MSFT", region: "US" },
  { name: "Amazon.com Inc.", ticker: "AMZN", region: "US" },
  { name: "Alphabet Inc.", ticker: "GOOGL", region: "US" },
]

const features = [
  { icon: Globe2, title: "Global equities", desc: "Access US, European and Asian stocks from one unified account." },
  { icon: BarChart3, title: "CFD trading", desc: "Trade stock price movements long or short without owning the underlying asset." },
  { icon: TrendingUp, title: "Real-time data", desc: "Live quotes and charts so you can act on market movements as they happen." },
]

export default function Stocks() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      {/* Hero */}
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(circle at 70% 30%, rgba(80,148,255,0.09), transparent 30%)",
        }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Stocks
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              World equities,<br />one account.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85, marginBottom: 36 }}>
              Trade CFDs on hundreds of global stocks — from US tech giants to European blue chips — with flexible leverage and real-time pricing.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image placeholder */}
      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, margin: "-20px auto 0 auto", borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <img
              src="/images/stocks-placeholder.png"
              alt="Stock market chart platform screenshot"
              style={{ width: "100%", height: "auto", maxHeight: 400, objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* Stock list */}
      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 36 }}>Popular stocks</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {stocks.map((s, i) => (
              <motion.div
                key={s.ticker}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{ padding: "20px 24px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{s.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>{s.region}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#4fd8a8" }}>{s.ticker}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
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
