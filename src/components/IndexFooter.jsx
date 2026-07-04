import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa"

const socialLinks = [
  { icon: FaFacebook, label: "Facebook", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
  { icon: FaLinkedin, label: "LinkedIn", href: "#" },
]

const footerCols = [
  {
    heading: "Trade",
    links: [
      { label: "CFDs", to: "/cfds" },
      { label: "Options", to: "/options" },
      { label: "Multipliers", to: "/multipliers" },
    ],
  },
  {
    heading: "Markets",
    links: [
      { label: "Forex", to: "/forex" },
      { label: "Derived Indices", to: "/derived-indices" },
      { label: "Stocks", to: "/stocks" },
      { label: "Commodities", to: "/commodities" },
      { label: "Crypto", to: "/crypto" },
    ],
  },
  {
    heading: "Platforms",
    links: [
      { label: "SmartTrader", to: "/smarttrader" },
      { label: "AutoTrade", to: "/autotrade" },
      { label: "Economic Calendar", to: "/economic-calendar" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Who we are", to: "/who-we-are" },
      { label: "Why choose us", to: "/why-choose-us" },
      { label: "Our principles", to: "/our-principles" },
      { label: "Regulatory info", to: "/regulatory-info" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Beginners guide", to: "/beginners-guide" },
      { label: "Trading strategies", to: "/trading-strategies" },
      { label: "Glossary", to: "/glossary" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms & conditions", to: "/terms-conditions" },
      { label: "Privacy policy", to: "/" },
      { label: "Cookie policy", to: "/" },
    ],
  },
]

const logoSrc = "/images/logo3.png"

export default function Footer() {
  return (
    <footer style={{ background: "#0e0e1a", color: "#c2c9d6", borderTop: "1px solid rgba(255,255,255,0.07)" }}>

      {/* ── Row 1: Logo | Socials ── */}
      <div style={{
        maxWidth: 1180, margin: "0 auto",
        padding: "40px 28px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <img
            src={logoSrc}
            alt="FortuNex"
            style={{ height: 36, width: "auto", objectFit: "contain", display: "block" }}
            onError={(e) => {
              e.target.style.display = "none"
              e.target.parentElement.innerHTML = `<span style="font-size:22px;font-weight:800;color:white;letter-spacing:-0.5px">FortuNex</span>`
            }}
          />
        </Link>

        {/* Social icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "white" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)" }}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>

      {/* ── Row 2: Link columns grid ── */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 28px 48px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="fx-footer-cols" style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "32px 24px",
        }}>
          {footerCols.map((col) => (
            <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                marginBottom: 4,
              }}>
                {col.heading}
              </span>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    lineHeight: 1.5,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => { e.target.style.color = "white" }}
                  onMouseLeave={(e) => { e.target.style.color = "rgba(255,255,255,0.55)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 3: Regulatory text ── */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 28px 40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
          {[
            "FortuNex (FX) Ltd is licensed and regulated by the Labuan Financial Services Authority.",
            "FortuNex (BVI) Ltd is licensed and regulated by the British Virgin Islands Financial Services Commission.",
            "FortuNex Investments (Cayman) Limited, registered office at Campbells Corporate Services Limited, Floor 4, Willow House, Cricket Square, Grand Cayman, Cayman Islands, is regulated by the Cayman Islands Monetary Authority.",
            "FortuNex (Mauritius) Ltd is regulated by the Financial Services Commission, Mauritius.",
            "FortuNex (V) Ltd is licensed and regulated by the Vanuatu Financial Services Commission.",
          ].map((text, i) => (
            <p key={i} style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.9 }}>
              {text}
            </p>
          ))}
        </div>

        {/* Risk warning box — matches Deriv's shaded block */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 32,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>
            The products offered on our website are complex derivative products that carry a significant risk of potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money.
          </p>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} FortuNex. All rights reserved.
          </p>
        </div>
      </div>

      {/* Responsive: collapse 6 cols → 3 → 2 */}
      <style>{`
        @media (max-width: 900px) {
          .fx-footer-cols { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .fx-footer-cols { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </footer>
  )
}