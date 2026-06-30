import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Clock, ShieldCheck } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const pairs = [
  { pair: "EUR/USD", spread: "0.6", sessions: "24/5" },
  { pair: "GBP/USD", spread: "0.9", sessions: "24/5" },
  { pair: "USD/JPY", spread: "0.7", sessions: "24/5" },
  { pair: "USD/CHF", spread: "1.1", sessions: "24/5" },
  { pair: "AUD/USD", spread: "0.8", sessions: "24/5" },
  { pair: "USD/CAD", spread: "1.0", sessions: "24/5" },
]

const features = [
  { icon: TrendingUp, title: "Tight spreads", desc: "Trade major pairs from 0.6 pips with no hidden markups on pricing." },
  { icon: Clock, title: "24/5 markets", desc: "Forex markets are open Sunday through Friday, giving you consistent access." },
  { icon: ShieldCheck, title: "Regulated execution", desc: "All positions are executed through regulated entities with segregated accounts." },
]

export default function Forex() {
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
          background: "radial-gradient(circle at 15% 40%, rgba(255,79,120,0.1), transparent 30%)",
        }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              The world's largest<br />financial market.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85, marginBottom: 36 }}>
              Trade major, minor and exotic currency pairs with competitive spreads, fast execution and deep liquidity — all from one platform.
            </p>
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
              src="/images/forex-placeholder.png"
              alt="Forex Chart Platform"
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



      {/* Live pairs table */}
      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 36 }}>Popular pairs</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {pairs.map((p, i) => (
              <motion.div
                key={p.pair}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{
                  padding: "22px 24px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>{p.pair}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>{p.sessions}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>From</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#4fd8a8", margin: 0 }}>{p.spread} pips</p>
                </div>
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
                style={{
                  padding: 28, borderRadius: 24,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 16,
                  background: "rgba(255,79,120,0.12)",
                  display: "grid", placeItems: "center", marginBottom: 20,
                }}>
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
