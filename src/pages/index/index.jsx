import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Globe2, BarChart3, Cpu } from "lucide-react"
import Navbar from "../../components/IndexNavbar"
import Hero from "../../components/IndexHero"
import Footer from "../../components/IndexFooter"

function Products() {
  return (
    <section id="products" style={{ padding: "84px 28px 64px", background: "#050814" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: 16, marginBottom: 36, maxWidth: 640 }}>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.05, color: "white", fontWeight: 800 }}>A premium experience for modern trading.</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.85, fontSize: 17 }}>From advanced automation to mobile trading, every product is built to keep you in control with powerful execution and elegant design.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {[
            { title: "SmartTrader", description: "A fast web platform for live trading across forex, crypto and indices.", badge: "Web platform" },
            { title: "AutoTrade", description: "Automate your strategy with intelligent bots and built-in signals.", badge: "Automation" },
            { title: "Mobile Pro", description: "Trade from anywhere with a modern mobile app and instant alerts.", badge: "Mobile" },
          ].map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              style={{ padding: 28, borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div>
                <span style={{ display: "inline-flex", padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.08)", color: "#ff9aa4", fontWeight: 700, fontSize: 12 }}>{card.badge}</span>
                <h3 style={{ marginTop: 22, fontSize: 24, fontWeight: 800, color: "white" }}>{card.title}</h3>
                <p style={{ marginTop: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.85 }}>{card.description}</p>
              </div>
              <a href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, color: "#ff4f6f", fontWeight: 700, textDecoration: "none" }}>
                Learn more <ArrowRight size={16} />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section id="security" style={{ padding: "80px 28px", background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent 40%)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 30 }}>
        <div style={{ maxWidth: 640 }}>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.05, fontWeight: 800, color: "white" }}>Safe, compliant and designed to stay online.</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.85, marginTop: 18 }}>We combine secure infrastructure with transparent processes so you can trade with confidence across multiple asset classes.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: ShieldCheck, title: "Regulated & secure", desc: "Multi-layer security, account segregation and risk controls." },
            { icon: Globe2, title: "Global access", desc: "Trade forex, crypto, stocks and commodities 24/7." },
            { icon: BarChart3, title: "Transparent pricing", desc: "Tight spreads, no hidden fees and clear margin terms." },
          ].map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ padding: 26, borderRadius: 28, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 16, background: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center", marginBottom: 18 }}>
                <item.icon size={24} color="white" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: "white" }}>{item.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, margin: 0 }}>{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function MarketHighlights() {
  return (
    <section id="markets" style={{ padding: "82px 28px 100px", background: "#050814" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.1, fontWeight: 800, color: "white" }}>The markets you want, all in one boarding pass.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
          {["Forex", "Crypto", "Synthetic Indices", "Stocks", "Commodities"].map((market, index) => (
            <motion.div
              key={market}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              style={{ padding: 24, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.08)", display: "grid", placeItems: "center" }}>
                  <Cpu size={20} color="white" />
                </div>
                <h3 style={{ color: "white", fontSize: 20, margin: 0 }}>{market}</h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
                {market === "Forex" ? "Major, minor and exotic pairs with competitive spreads." : market === "Crypto" ? "Bitcoin, Ethereum and leading digital assets 24/7." : market === "Synthetic Indices" ? "Exclusive indices designed for round-the-clock volatility." : market === "Stocks" ? "Global equities with real-time access." : "Gold, oil and energy markets on one platform."}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white" }}>
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Benefits />
        <MarketHighlights />
      </main>
      <Footer />
    </div>
  )
}