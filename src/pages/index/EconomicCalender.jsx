import { motion } from "framer-motion"
import { Calendar, Bell, TrendingUp } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const upcomingEvents = [
  { time: "08:30", currency: "USD", event: "Non-Farm Payrolls", impact: "High" },
  { time: "10:00", currency: "EUR", event: "CPI Flash Estimate", impact: "High" },
  { time: "13:30", currency: "GBP", event: "Bank of England Rate Decision", impact: "High" },
  { time: "15:00", currency: "USD", event: "ISM Manufacturing PMI", impact: "Medium" },
  { time: "18:00", currency: "JPY", event: "Tokyo Core CPI", impact: "Medium" },
  { time: "20:00", currency: "AUD", event: "RBA Meeting Minutes", impact: "Low" },
]

const impactColor = {
  High: "#ff4f6f",
  Medium: "#ffc84f",
  Low: "#4fd8a8",
}

const features = [
  { icon: Calendar, title: "All major events", desc: "Track central bank decisions, employment data, inflation reports and more in one view." },
  { icon: Bell, title: "Real-time updates", desc: "Events update with actual figures the moment they are released." },
  { icon: TrendingUp, title: "Market impact ratings", desc: "Each event is rated by expected market impact — High, Medium or Low." },
]

export default function EconomicCalendar() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden", 
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 70% 50%, rgba(80,148,255,0.08), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Tools
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Economic<br />Calendar.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85, marginBottom: 36 }}>
              Stay ahead of market-moving events. Track central bank decisions, employment reports and inflation data — all in one place with real-time updates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calendar table */}
      <section style={{ padding: "0 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{
            borderRadius: 28,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginTop: -20,
          }}>
            {/* Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "80px 80px 1fr 100px",
              gap: 16,
              padding: "16px 28px",
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              {["Time", "Ccy", "Event", "Impact"].map((h) => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{h}</span>
              ))}
            </div>

            {upcomingEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 80px 1fr 100px",
                  gap: 16,
                  padding: "18px 28px",
                  borderBottom: i < upcomingEvents.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{event.time}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>{event.currency}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{event.event}</span>
                <span style={{
                  display: "inline-flex", padding: "5px 12px", borderRadius: 999,
                  background: `${impactColor[event.impact]}18`,
                  color: impactColor[event.impact],
                  fontWeight: 700, fontSize: 12, width: "fit-content",
                }}>
                  {event.impact}
                </span>
              </motion.div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 14, paddingLeft: 4 }}>
            Events shown are illustrative. Live data loads when logged in.
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 28px 100px" }}>
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
