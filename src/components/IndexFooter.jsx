
import { MessageCircle, DownloadCloud } from "lucide-react"
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa"

const socialLinks = [
  { icon: FaFacebook, label: "Facebook", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
  { icon: FaLinkedin, label: "LinkedIn", href: "#" },
]

const appStores = [
  { label: "Download on the App Store", href: "#" },
  { label: "Get it on Google Play", href: "#" },
]

export default function Footer() {
  return (
    <footer style={{ background: "#050814", color: "#e8edf9" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 24px 24px", display: "grid", gap: 30 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 28, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #ff4f6f, #d13651)", display: "grid", placeItems: "center", color: "white", fontWeight: 800 }}>F</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>FortuNex</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}>Trade simply, globally</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label} style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", color: "#c8d1ea", textDecoration: "none" }}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 22 }}>
          <div style={{ display: "grid", gap: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 24 }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.74)", lineHeight: 1.8, fontSize: 14 }}>
              This website may use automated translations for your convenience. However, the English version is the definitive version and will prevail in the event of any discrepancy.
            </p>
            <div style={{ display: "grid", gap: 8, color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}>FortuNex (FX) Ltd is licensed and regulated by the Labuan Financial Services Authority.</p>
              <p style={{ margin: 0 }}>FortuNex (BVI) Ltd is licensed and regulated by the British Virgin Islands Financial Services Commission.</p>
              <p style={{ margin: 0 }}>FortuNex Investments (Cayman) Limited, registered office at Campbells Corporate Services Limited, Floor 4, Willow House, Cricket Square, Grand Cayman, Cayman Islands, is regulated by the Cayman Islands Monetary Authority.</p>
              <p style={{ margin: 0 }}>FortuNex (Mauritius) Ltd is regulated by the Financial Services Commission, Mauritius.</p>
              <p style={{ margin: 0 }}>FortuNex (V) Ltd is licensed and regulated by the Vanuatu Financial Services Commission.</p>
            </div>
          </div>

          <div style={{ borderRadius: 24, padding: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.76)", marginBottom: 14 }}>
              The products offered on our website are complex derivative products that carry a significant risk of potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 18, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.72)", fontSize: 13 }}>
              <MessageCircle size={18} />
              Trading involves risk and is not suitable for everyone.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
