import { motion } from "framer-motion"
import { ArrowRight, Zap, BarChart3, Lock } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const indices = [
  { name: "Volatility 10 Index", symbol: "V10", desc: "Simulates a market with constant 10% volatility." },
  { name: "Volatility 25 Index", symbol: "V25", desc: "Simulates a market with constant 25% volatility." },
  { name: "Volatility 50 Index", symbol: "V50", desc: "Higher volatility for active short-term traders." },
  { name: "Volatility 75 Index", symbol: "V75", desc: "High-frequency synthetic index, 24/7 availability." },
  { name: "Crash 300 Index", symbol: "CR300", desc: "Spike down once every 300 ticks on average." },
  { name: "Boom 300 Index", symbol: "BM300", desc: "Spike up once every 300 ticks on average." },
]

const features = [
  { icon: Zap, title: "Always open", desc: "Derived indices trade 24/7, including weekends and public holidays." },
  { icon: BarChart3, title: "Predictable behavior", desc: "Volatility parameters are fixed — no surprise fundamentals or news events." },
  { icon: Lock, title: "Exclusive to FortuNex", desc: "These indices are proprietary and only available on our platform." },
]

export default function DerivedIndices() {
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
          background: "radial-gradient(circle at 80% 20%, rgba(80,148,255,0.1), transparent 30%)",
        }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{
              display: "inline-flex", padding: "7px 14px", borderRadius: 999,
              background: "rgba(255,79,120,0.12)", color: "#ff9aa4",
              fontWeight: 700, fontSize: 12, marginBottom: 24,
            }}>
              Derived Indices
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Markets that never<br />close.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85, marginBottom: 36 }}>
              Exclusive synthetic indices with fixed volatility parameters. Trade any hour of the day, any day of the year — no news, no gaps.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 28px", borderRadius: 999,
                background: "#ff4f6f", color: "white", fontWeight: 700, textDecoration: "none",
                boxShadow: "0 16px 44px rgba(255,79,120,0.28)",
              }}>
                Start trading <ArrowRight size={18} />
              </a>
              <a href="/login" style={{
                display: "inline-flex", alignItems: "center",
                padding: "14px 28px", borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white", fontWeight: 700, textDecoration: "none",
              }}>
                Try on demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image placeholder */}
      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{
            maxWidth: 800,
            margin: "-20px auto 0 auto",
            borderRadius: 28,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}>
            <img
              src="/images/derived-indices-placeholder.png"
              alt="Derived indices chart visualization"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 400,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>
      </section>

      {/* Index cards */}
      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 36 }}>Available indices</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {indices.map((idx, i) => (
              <motion.div
                key={idx.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  padding: "22px 24px", borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{
                  display: "inline-flex", padding: "5px 10px", borderRadius: 999,
                  background: "rgba(80,148,255,0.1)", color: "#7ab8ff",
                  fontWeight: 700, fontSize: 11, marginBottom: 12,
                }}>
                  {idx.symbol}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>{idx.name}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{idx.desc}</p>
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
