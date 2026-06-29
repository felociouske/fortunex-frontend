import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const licences = [
  {
    entity: "FortuNex (FX) Ltd",
    regulator: "Labuan Financial Services Authority",
    jurisdiction: "Malaysia",
    licenceType: "Money Broker Licence",
  },
  {
    entity: "FortuNex (BVI) Ltd",
    regulator: "British Virgin Islands Financial Services Commission",
    jurisdiction: "British Virgin Islands",
    licenceType: "Investment Business Licence",
  },
  {
    entity: "FortuNex Investments (Cayman) Limited",
    regulator: "Cayman Islands Monetary Authority",
    jurisdiction: "Cayman Islands",
    licenceType: "Securities Investment Business",
  },
  {
    entity: "FortuNex (Mauritius) Ltd",
    regulator: "Financial Services Commission, Mauritius",
    jurisdiction: "Mauritius",
    licenceType: "Investment Dealer Licence",
  },
  {
    entity: "FortuNex (V) Ltd",
    regulator: "Vanuatu Financial Services Commission",
    jurisdiction: "Vanuatu",
    licenceType: "Dealer in Securities",
  },
]

const protections = [
  { title: "Segregated client funds", desc: "All client money is held separately from company operating funds in designated trust accounts." },
  { title: "Negative balance protection", desc: "You cannot lose more than your account balance. No debt to the platform." },
  { title: "Regulated entities only", desc: "All trading activity is conducted through one of our five licensed and regulated entities." },
]

export default function RegulatoryInfo() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 70% 40%, rgba(80,148,255,0.08), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Legal
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Regulatory<br />information.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85 }}>
              FortuNex operates through five licensed entities across four jurisdictions, each regulated by their respective financial authority.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Licences */}
      <section style={{ padding: "60px 28px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, marginBottom: 32 }}>Licensed entities</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {licences.map((l, i) => (
              <motion.div
                key={l.entity}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  padding: "28px 0",
                  borderBottom: i < licences.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px" }}>{l.entity}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>{l.jurisdiction}</p>
                </div>
                <div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: "0 0 4px" }}>{l.regulator}</p>
                  <span style={{ display: "inline-flex", padding: "4px 10px", borderRadius: 999, background: "rgba(255,79,120,0.1)", color: "#ff9aa4", fontWeight: 700, fontSize: 11 }}>
                    {l.licenceType}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client protections */}
      <section style={{ padding: "0 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, marginBottom: 32 }}>Client protections</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {protections.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} style={{ padding: 28, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,79,120,0.12)", display: "grid", placeItems: "center", marginBottom: 20 }}>
                  <ShieldCheck size={22} color="#ff4f6f" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: 48, padding: "24px 28px", borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, margin: 0 }}>
              The entity you trade with depends on your country of residence. Not all products and services are available in all jurisdictions. Trading in complex financial instruments involves significant risk of loss. Please refer to our Terms and Conditions for full details.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
