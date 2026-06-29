import { motion } from "framer-motion"
import { ArrowRight, BookOpen, BarChart3, Shield, Wallet } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const chapters = [
  {
    icon: BookOpen,
    number: "01",
    title: "What is trading?",
    desc: "Trading is the buying and selling of financial instruments — currencies, stocks, commodities or derivatives — with the aim of making a profit from price movements.",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "Understanding markets",
    desc: "Markets move due to supply and demand, economic data, central bank decisions and geopolitical events. Learning to read market structure is your foundation.",
  },
  {
    icon: Shield,
    number: "03",
    title: "Managing risk",
    desc: "Risk management is the most important skill in trading. Always use a stop-loss, never risk more than you can afford to lose, and define your position size before entering.",
  },
  {
    icon: Wallet,
    number: "04",
    title: "Your first trade",
    desc: "Start with a demo account. Get comfortable with the platform, practice reading charts, and develop a repeatable process before committing real funds.",
  },
]

const concepts = [
  { term: "Pip", def: "The smallest price move in a currency pair, typically 0.0001 for most pairs." },
  { term: "Spread", def: "The difference between the buy (ask) price and the sell (bid) price." },
  { term: "Leverage", def: "The ability to control a large position with a smaller amount of capital." },
  { term: "Margin", def: "The deposit required to open a leveraged position." },
  { term: "Stop-loss", def: "An order that automatically closes your trade if it moves against you by a set amount." },
  { term: "Take-profit", def: "An order that closes your trade automatically when it reaches your target price." },
]

export default function BeginnersGuide() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 20% 40%, rgba(255,79,120,0.1), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Learn
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Beginner's<br />guide.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85, marginBottom: 36 }}>
              Everything you need to understand trading from the ground up — markets, risk, execution and your first trade.
            </p>
            <a href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 999, background: "#ff4f6f", color: "white", fontWeight: 700, textDecoration: "none", boxShadow: "0 16px 44px rgba(255,79,120,0.28)" }}>
              Start with a demo <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Image placeholder */}
      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, margin: "-20px auto 0 auto", borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <img
              src="/images/beginners-guide-placeholder.png"
              alt="Trading education beginner visual"
              style={{ width: "100%", height: "auto", maxHeight: 400, objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 40 }}>Core concepts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {chapters.map((c, i) => (
              <motion.div key={c.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,79,120,0.12)", display: "grid", placeItems: "center" }}>
                    <c.icon size={22} color="#ff4f6f" />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,79,120,0.6)" }}>{c.number}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Glossary mini */}
      <section style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, margin: 0 }}>Key terms</h2>
            <a href="/index/support/glossary" style={{ color: "#ff4f6f", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Full glossary <ArrowRight size={14} />
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {concepts.map((c, i) => (
              <motion.div key={c.term} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }} style={{ padding: "20px 24px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#ff4f6f", display: "block", marginBottom: 6 }}>{c.term}</span>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: 0 }}>{c.def}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
