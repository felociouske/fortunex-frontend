import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Globe2, BarChart3, Zap, HeadphonesIcon, Users } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const reasons = [
  { icon: ShieldCheck, title: "Regulated across 5 jurisdictions", desc: "Licensed by Labuan FSA, BVI FSC, Cayman CIMA, Mauritius FSC and Vanuatu FSC — so your funds are always protected." },
  { icon: Globe2, title: "190 countries served", desc: "We operate globally with local payment methods, multilingual support and region-specific market access." },
  { icon: BarChart3, title: "1M+ active traders", desc: "A proven platform trusted by retail and professional traders across every major region." },
  { icon: Zap, title: "Fast, reliable execution", desc: "Low-latency infrastructure with 99.9% platform uptime and no requotes on standard market conditions." },
  { icon: HeadphonesIcon, title: "24/7 customer support", desc: "Live chat and email support available around the clock in multiple languages." },
  { icon: Users, title: "Active community", desc: "Join thousands of traders in our community forum, strategy groups and weekly webinars." },
]

const stats = [
  { value: "1M+", label: "Active traders" },
  { value: "190", label: "Countries" },
  { value: "5", label: "Regulatory licences" },
  { value: "24/7", label: "Customer support" },
]

export default function WhyChooseUs() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 75% 30%, rgba(80,148,255,0.09), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              About
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Why choose<br />FortuNex.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85 }}>
              There are many trading platforms. Here is why over one million traders chose ours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats row */}
      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 1,
            borderRadius: 28,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            marginTop: -20,
          }}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  padding: "36px 28px",
                  background: "rgba(255,255,255,0.04)",
                  textAlign: "center",
                  borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <p style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "white", margin: "0 0 8px" }}>{s.value}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reasons grid */}
      <section style={{ padding: "80px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {reasons.map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,79,120,0.12)", display: "grid", placeItems: "center", marginBottom: 20 }}>
                  <r.icon size={22} color="#ff4f6f" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}>{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", padding: "64px 28px", borderRadius: 32, background: "rgba(255,79,120,0.06)", border: "1px solid rgba(255,79,120,0.15)" }}>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800, marginBottom: 16 }}>Ready to get started?</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
              Open a demo account in minutes and explore the platform with no risk.
            </p>
            <a href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 999, background: "#ff4f6f", color: "white", fontWeight: 700, textDecoration: "none", boxShadow: "0 16px 44px rgba(255,79,120,0.28)" }}>
              Open free account <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
