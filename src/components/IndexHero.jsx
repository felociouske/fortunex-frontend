import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const tickerItems = [
  { pair: "EUR/USD", price: "1.0847", change: "+0.15%", up: true },
  { pair: "BTC/USD", price: "67,420", change: "+2.31%", up: true },
  { pair: "XAU/USD", price: "2,341", change: "-0.08%", up: false },
  { pair: "GBP/USD", price: "1.2691", change: "+0.22%", up: true },
  { pair: "ETH/USD", price: "3,512", change: "+1.87%", up: true },
  { pair: "US100", price: "18,962", change: "-0.14%", up: false },
]

// Rotating words in the headline
const rotatingWords = ["Anyone", "Anywhere", "Anytime"]

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let width = canvas.offsetWidth
    let height = canvas.offsetHeight
    let animationFrame
    const particles = []

    const initParticles = () => {
      particles.length = 0
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          alpha: Math.random() * 0.28 + 0.1,
        })
      }
    }

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      initParticles()
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((other) => {
          const dx = p.x - other.x
          const dy = p.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(255,79,120,${(1 - dist / 110) * 0.1})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,79,120,${p.alpha})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      })
      animationFrame = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener("resize", resize)
    render()
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }}
    />
  )
}

export default function Hero() {
  return (
    <>
      {/* ---- Hero section ---- */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: 72,
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        overflow: "hidden",
      }}>
        {/* Radial glows */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(circle at 18% 30%, rgba(255,79,120,0.13), transparent 28%), radial-gradient(circle at 75% 20%, rgba(80,148,255,0.09), transparent 22%)",
        }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <ParticleCanvas />

        {/* Ticker */}
        <div style={{
          position: "absolute", top: 72, left: 0, right: 0,
          padding: "11px 0",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          zIndex: 10,
          overflow: "hidden",
        }}>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", whiteSpace: "nowrap" }}
          >
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "0 24px", borderRight: "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{item.pair}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{item.price}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: item.up ? "#4fd8a8" : "#ff6b73" }}>{item.change}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Main hero content */}
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: 1180, margin: "0 auto",
          padding: "100px 28px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "center",
          minHeight: "calc(100vh - 72px)",
        }}>
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 style={{
              fontSize: "clamp(52px, 7vw, 90px)",
              lineHeight: 1.0,
              fontWeight: 800,
              color: "white",
              marginBottom: 28,
            }}>
              {rotatingWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 * i }}
                  style={{ display: "block" }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: "rgba(255,255,255,0.72)", maxWidth: 480, marginBottom: 36 }}>
              Access forex, crypto, stocks, commodities and synthetic indices from one secure platform with clear pricing and powerful tools.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 52 }}>
              <a href="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "15px 28px", borderRadius: 999,
                background: "#ff4f6f", color: "white", fontWeight: 700, textDecoration: "none",
                boxShadow: "0 16px 44px rgba(255,79,120,0.28)",
              }}>
                Open account <ArrowRight size={18} />
              </a>
              <a href="#products" style={{
                display: "inline-flex", alignItems: "center",
                padding: "15px 28px", borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white", fontWeight: 700, textDecoration: "none",
              }}>
                Trade now
              </a>
            </div>
          </motion.div>

          {/* Right: hero image stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ position: "relative", height: 560 }}
          >
            {/* Background city/abstract image */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 32, overflow: "hidden",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <img
                src="/images/1.jpg"
                alt="Trading background"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
                onError={(e) => { e.target.style.display = "none" }}
              />
              {/* Fallback gradient if image missing */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(circle at 30% 40%, rgba(80,148,255,0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,79,120,0.12), transparent 40%)",
              }} />
            </div>

            {/* Person image */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              style={{
                position: "absolute", bottom: 0, left: "10%",
                width: "55%", height: "90%",
              }}
            >
              <img
                src="/images/2.png"
                alt="Trader"
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }}
                onError={(e) => { e.target.style.display = "none" }}
              />
            </motion.div>

            {/* Device / platform mockup image */}
            <motion.div
              initial={{ opacity: 0, x: 24, y: -12 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                position: "absolute", top: 32, right: -20,
                width: "52%",
                borderRadius: 20, overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <img
                src="/images/3.png"
                alt="Trading platform"
                style={{ width: "100%", display: "block" }}
                onError={(e) => {
                  // Fallback card if image is missing
                  e.target.parentElement.innerHTML = `
                    <div style="background:rgba(255,255,255,0.06);padding:24px;border-radius:20px;">
                      <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0 0 8px">Live market</p>
                      <p style="color:white;font-weight:800;font-size:22px;margin:0 0 16px">EUR/USD</p>
                      <div style="display:flex;gap:12px;margin-bottom:16px">
                        <div style="flex:1;background:rgba(255,255,255,0.06);padding:12px;border-radius:12px">
                          <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0 0 4px">Bid</p>
                          <p style="color:white;font-weight:700;margin:0">1.08471</p>
                        </div>
                        <div style="flex:1;background:rgba(255,255,255,0.06);padding:12px;border-radius:12px">
                          <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:0 0 4px">Ask</p>
                          <p style="color:white;font-weight:700;margin:0">1.08474</p>
                        </div>
                      </div>
                      <div style="background:#4fd8a820;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px">
                        <span style="width:8px;height:8px;border-radius:50%;background:#4fd8a8;display:inline-block"></span>
                        <span style="color:#4fd8a8;font-weight:700;font-size:13px">+0.29% today</span>
                      </div>
                    </div>
                  `
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-image-col { display: none !important; }
            .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* ---- Markets strip section ---- */}
      <MarketsStrip />

      {/* ---- Platforms feature section ---- */}
      <PlatformsSection />

      {/* ---- Get started steps section ---- */}
      <GetStartedSection />
    </>
  )
}

// ---------------------------------------------------------------
// Markets strip — horizontal scrollable pills
// ---------------------------------------------------------------
const markets = [
  { name: "Forex", desc: "Major, minor and exotic pairs with tight spreads.", img: "/images/4.jpg" },
  { name: "Crypto", desc: "Bitcoin, Ethereum and leading digital assets, 24/7.", img: "/images/5.jpg" },
  { name: "Synthetic Indices", desc: "Exclusive indices designed for round-the-clock volatility.", img: "/images/6.jpg" },
  { name: "Stocks", desc: "Global equities: Apple, Tesla, NVIDIA and more.", img: "/images/7.jpg" },
  { name: "Commodities", desc: "Gold, oil and energy markets on one platform.", img: "/images/8.jpg" },
]

function MarketsStrip() {
  return (
    <section id="markets" style={{ padding: "80px 28px", background: "#050814" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.08, fontWeight: 800, color: "white", margin: 0 }}>
              All your markets in one place
            </h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {markets.map((market, i) => (
            <motion.div
              key={market.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              whileHover={{ y: -4 }}
            >
              {/* Image area */}
              <div style={{ height: 140, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                <img
                  src={market.img}
                  alt={market.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                  onError={(e) => { e.target.style.display = "none" }}
                />
                {/* Gradient overlay on image */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(5,8,20,0.7), transparent 60%)",
                }} />
              </div>
              <div style={{ padding: "18px 20px 22px" }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 8, margin: "0 0 8px" }}>{market.name}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>{market.desc}</p>
                <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, color: "#ff4f6f", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                  Learn more <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------
// Platforms section — alternating image + text rows
// ---------------------------------------------------------------
const platforms = [
  {
    badge: "Web platform",
    title: "World-class charts, 24/7 trading",
    description: "Analyse markets with 400+ indicators, multiple chart types, and powerful drawing tools. Trade global financial markets and exclusive 24/7 Synthetic Indices from one clean interface.",
    cta: "Explore SmartTrader",
    href: "/login",
    img: "/images/9.jpg",
    imgAlt: "SmartTrader platform screenshot",
  },
  {
    badge: "Automation",
    title: "Automate your trades with bots",
    description: "FortuNex Bot keeps your strategies running on 24/7 exclusive indices and traditional markets. Set your rules, define your risk, and let the bot trade for you — no coding required.",
    cta: "Explore AutoTrade",
    href: "/login",
    img: "/images/10.jpg",
    imgAlt: "AutoTrade bot interface",
    reverse: true,
  },
  {
    badge: "Mobile",
    title: "Trade anywhere, anytime",
    description: "A fully featured mobile app so your portfolio is always in your pocket. Real-time alerts, instant deposits, and the same tight spreads as the web platform.",
    cta: "Download the app",
    href: "#",
    img: "/images/11.jpg",
    imgAlt: "Mobile trading app",
  },
]

function PlatformsSection() {
  return (
    <section id="products" style={{ padding: "80px 28px", background: "linear-gradient(180deg, #050814 0%, #060d1e 100%)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.08, fontWeight: 800, color: "white", margin: "0 auto", maxWidth: 640 }}>
            Trade the way you want
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 56,
                alignItems: "center",
                direction: platform.reverse ? "rtl" : "ltr",
              }}
            >
              {/* Text side */}
              <div style={{ direction: "ltr" }}>
                <span style={{
                  display: "inline-flex", padding: "7px 14px", borderRadius: 999,
                  background: "rgba(255,79,120,0.12)", color: "#ff9aa4",
                  fontWeight: 700, fontSize: 12, marginBottom: 20,
                }}>
                  {platform.badge}
                </span>
                <h3 style={{ fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.12, fontWeight: 800, color: "white", marginBottom: 18, margin: "0 0 18px" }}>
                  {platform.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.85, color: "rgba(255,255,255,0.68)", marginBottom: 28, margin: "0 0 28px" }}>
                  {platform.description}
                </p>
                <a href={platform.href} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 24px", borderRadius: 999,
                  background: "#ff4f6f", color: "white", fontWeight: 700,
                  textDecoration: "none", fontSize: 14,
                }}>
                  {platform.cta} <ArrowRight size={16} />
                </a>
              </div>

              {/* Image side */}
              <div style={{
                direction: "ltr",
                borderRadius: 28,
                overflow: "hidden",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: 340,
                position: "relative",
              }}>
                <img
                  src={platform.img}
                  alt={platform.imgAlt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.parentElement.style.background = "rgba(255,255,255,0.04)"
                  }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "linear-gradient(135deg, rgba(255,79,120,0.08), rgba(80,148,255,0.06))",
                }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .platform-row { grid-template-columns: 1fr !important; direction: ltr !important; }
        }
      `}</style>
    </section>
  )
}

// ---------------------------------------------------------------
// Get started section — 3 steps with images
// ---------------------------------------------------------------
const steps = [
  {
    number: "01",
    title: "Sign up",
    description: "Create an account in minutes. Start with a zero-risk demo account before trading real money.",
    img: "/images/12.jpg",
  },
  {
    number: "02",
    title: "Deposit",
    description: "Use your preferred local payment method to fund your account quickly and securely.",
    img: "/images/13.jpg",
  },
  {
    number: "03",
    title: "Trade",
    description: "Choose your market, set your position, and start your trading journey with FortuNex.",
    img: "/images/14.jpg",
  },
]

function GetStartedSection() {
  return (
    <section id="security" style={{ padding: "80px 28px 100px", background: "#050814" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.08, fontWeight: 800, color: "white", margin: "0 auto", maxWidth: 560 }}>
            Up and trading in 3 simple steps
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              style={{
                borderRadius: 28,
                overflow: "hidden",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Step image */}
              <div style={{ height: 220, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                <img
                  src={step.img}
                  alt={step.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(5,8,20,0.8), transparent 50%)",
                }} />
                {/* Step number badge */}
                <div style={{
                  position: "absolute", top: 16, left: 16,
                  background: "#ff4f6f", color: "white",
                  fontWeight: 800, fontSize: 13,
                  padding: "6px 12px", borderRadius: 999,
                }}>
                  {step.number}
                </div>
              </div>

              <div style={{ padding: "22px 24px 28px" }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 10, margin: "0 0 10px" }}>{step.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.62)", margin: 0 }}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginTop: 52 }}
        >
          <a href="/register" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 34px", borderRadius: 999,
            background: "#ff4f6f", color: "white", fontWeight: 700,
            textDecoration: "none", fontSize: 15,
            boxShadow: "0 16px 44px rgba(255,79,120,0.26)",
          }}>
            Open a free account <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}