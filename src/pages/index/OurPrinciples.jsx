import { motion } from "framer-motion"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const principles = [
  {
    number: "01",
    title: "Client money is always protected",
    desc: "All client funds are held in segregated accounts, separate from FortuNex's own operating capital. We never use client money for any business purpose.",
  },
  {
    number: "02",
    title: "Transparency over fine print",
    desc: "Every fee, spread, and overnight swap rate is disclosed upfront. We do not use hidden markups or obscure pricing structures.",
  },
  {
    number: "03",
    title: "Access without discrimination",
    desc: "Our platform is built to serve retail traders in every country we operate, with local payment options and multilingual support.",
  },
  {
    number: "04",
    title: "Risk tools as a default, not an afterthought",
    desc: "Stop-loss, take-profit, and negative balance protection are standard features on every account, not optional add-ons.",
  },
  {
    number: "05",
    title: "We operate responsibly",
    desc: "We comply with all applicable regulations in every jurisdiction where we are licensed, and we cooperate fully with regulatory authorities.",
  },
  {
    number: "06",
    title: "Continuous improvement",
    desc: "We invest consistently in platform infrastructure, security, and product quality — not just in growth.",
  },
]

export default function OurPrinciples() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 30% 50%, rgba(255,79,120,0.09), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              About
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Our principles.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85 }}>
              These are the commitments that guide every decision we make as a company — from product design to regulatory compliance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Principles list */}
      <section style={{ padding: "60px 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {principles.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: 32,
                  padding: "36px 0",
                  borderBottom: i < principles.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  alignItems: "start",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 800, color: "#ff4f6f", paddingTop: 4 }}>{p.number}</span>
                <div>
                  <h3 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 800, marginBottom: 14, margin: "0 0 14px" }}>{p.title}</h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, margin: 0, maxWidth: 640 }}>{p.desc}</p>
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
