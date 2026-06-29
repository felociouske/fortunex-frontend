import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const values = [
  { title: "Transparency", desc: "Every fee, spread and condition is visible before you trade. No surprises." },
  { title: "Access", desc: "We believe financial markets should be open to everyone, not just institutions." },
  { title: "Reliability", desc: "Our infrastructure is built for uptime and consistent execution under all conditions." },
]

const milestones = [
  { year: "2015", event: "FortuNex founded with a focus on accessible derivatives trading." },
  { year: "2017", event: "Launched Synthetic Indices — our first proprietary market product." },
  { year: "2019", event: "Expanded into 50+ countries, growing to over 500,000 registered clients." },
  { year: "2021", event: "Introduced AutoTrade — no-code trading automation for retail traders." },
  { year: "2023", event: "Surpassed 1 million active clients across 190 countries." },
  { year: "2024", event: "Launched FortuNex Mobile Pro and expanded regulatory coverage." },
]

export default function WhoWeAre() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      {/* Hero */}
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 20% 40%, rgba(255,79,120,0.1), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              About
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Who we are.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 560, lineHeight: 1.85 }}>
              FortuNex is a regulated trading platform serving over one million clients across 190 countries. We were built on the conviction that world-class trading tools should be accessible to anyone, anywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team / office image placeholder */}
      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, margin: "-20px auto 0 auto", borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <img
              src="/images/who-we-are-placeholder.png"
              alt="FortuNex team and office"
              style={{ width: "100%", height: "auto", maxHeight: 400, objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ maxWidth: 760 }}>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 24 }}>
              Our mission is to democratise trading for the world.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              For too long, sophisticated financial markets were walled off behind institutional barriers. FortuNex was built to change that — providing individuals with the same tools, execution quality and market access previously reserved for professional traders.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "0 28px 80px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 36 }}>What we stand for</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px" }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 48 }}>Our journey</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ display: "flex", gap: 28, paddingBottom: i < milestones.length - 1 ? 36 : 0 }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 999, background: "#ff4f6f", flexShrink: 0 }} />
                  {i < milestones.length - 1 && <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.1)", marginTop: 8 }} />}
                </div>
                <div style={{ paddingBottom: i < milestones.length - 1 ? 0 : 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#ff4f6f", display: "block", marginBottom: 6 }}>{m.year}</span>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
