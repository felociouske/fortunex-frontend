import { motion } from "framer-motion"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const sections = [
  {
    title: "1. Agreement to terms",
    content: "By accessing or using the FortuNex platform, you agree to be bound by these Terms and Conditions. If you do not agree, you must discontinue use of the platform immediately. These terms constitute a binding legal agreement between you and the relevant FortuNex entity for your jurisdiction.",
  },
  {
    title: "2. Eligibility",
    content: "You must be at least 18 years of age to open an account and trade on FortuNex. By registering, you confirm that you meet the minimum age requirement and that trading in complex financial instruments is legal in your jurisdiction.",
  },
  {
    title: "3. Risk acknowledgement",
    content: "Trading in CFDs, options, multipliers and other derivative instruments carries a high level of risk and may not be suitable for all investors. You should not invest money you cannot afford to lose. The high degree of leverage available can work against you as well as for you.",
  },
  {
    title: "4. Account registration",
    content: "You may only hold one real account on the FortuNex platform. You are responsible for maintaining the confidentiality of your login credentials and for all activity conducted through your account. You must notify us immediately if you suspect unauthorised access.",
  },
  {
    title: "5. Deposits and withdrawals",
    content: "All deposits must originate from a payment method in your own name. Withdrawals will be processed back to the original funding source where possible. FortuNex reserves the right to request documentation to verify source of funds in line with our Anti-Money Laundering obligations.",
  },
  {
    title: "6. Prohibited conduct",
    content: "You may not use the platform for any unlawful purpose, engage in market manipulation, operate multiple accounts, or use any automated or unauthorised means to access the platform's systems. FortuNex reserves the right to close accounts engaged in prohibited conduct.",
  },
  {
    title: "7. Amendments",
    content: "FortuNex reserves the right to amend these Terms and Conditions at any time. Material changes will be communicated via email or in-platform notification. Continued use of the platform after notice of changes constitutes acceptance of the updated terms.",
  },
  {
    title: "8. Governing law",
    content: "These Terms and Conditions are governed by the laws of the jurisdiction in which the relevant FortuNex entity is incorporated. Any disputes shall be subject to the exclusive jurisdiction of the courts in that territory.",
  },
]

export default function TermsConditions() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 50% 40%, rgba(255,79,120,0.07), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Legal
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Terms &amp; conditions.
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              Last updated: January 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms content */}
      <section style={{ padding: "60px 28px 100px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                style={{
                  padding: "36px 0",
                  borderBottom: i < sections.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px", color: "white" }}>{s.title}</h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.85, margin: 0 }}>{s.content}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: "24px 28px", borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, margin: 0 }}>
              This is a summary version of our Terms and Conditions. The full legal document is available on request. For questions, please contact our compliance team at legal@fortunex.com.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
