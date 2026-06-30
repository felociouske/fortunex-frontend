import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, ChevronUp, Globe } from "lucide-react"

const logoSrc = "/images/logo3.png"

const navItems = [
  {
    label: "Trading",
    dropdown: {
      columns: [
        {
          heading: "Markets",
          links: [
            { label: "Forex", href: "/forex" },
            { label: "Derived Indices", href: "/derived-indices" },
            { label: "Stocks", href: "/stocks" },
            { label: "Commodities", href: "/commodities" },
            { label: "Crypto", href: "/crypto" },
          ],
        },
        {
          heading: "Trade",
          links: [
            { label: "CFDs", href: "/cfds" },
            { label: "Options", href: "/options" },
            { label: "Multipliers", href: "/multipliers" },
          ],
        },
        {
          heading: "Tools",
          links: [
            { label: "SmartTrader", href: "/smarttrader" },
            { label: "AutoTrade", href: "/autotrade" },
            { label: "Economic Calendar", href: "/economic-calendar" },
          ],
        },
      ],
    },
  },
  {
    label: "About",
    dropdown: {
      columns: [
        {
          heading: "Company",
          links: [
            { label: "Who we are", href: "/who-we-are" },
            { label: "Why choose us", href: "/why-choose-us" },
            { label: "Our principles", href: "/our-principles" },
          ],
        },
        {
          heading: "Legal",
          links: [
            { label: "Regulatory info", href: "/regulatory-info" },
            { label: "Terms & conditions", href: "/terms-conditions" },
          ],
        },
      ],
    },
  },
  {
    label: "Learning & support",
    dropdown: {
      columns: [
        {
          heading: "Learn",
          links: [
            { label: "Beginners guide", href: "/beginners-guide" },
            { label: "Trading strategies", href: "/trading-strategies" },
            { label: "Glossary", href: "/glossary" },
          ],
        },
        {
          heading: "Support",
          links: [
            { label: "Help centre", href: "#" },
            { label: "Live chat", href: "#" },
            { label: "Community", href: "#" },
          ],
        },
      ],
    },
  },
]

function DropdownPanel({ columns }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: "calc(100% + 14px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        borderRadius: 16,
        padding: "28px 32px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        display: "flex",
        gap: 40,
        minWidth: 420,
        zIndex: 200,
      }}
    >
      {columns.map((col) => (
        <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 120 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa" }}>
            {col.heading}
          </span>
          {col.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#111",
                textDecoration: "none",
                lineHeight: 1.4,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ff4f6f")}
              onMouseLeave={(e) => (e.target.style.color = "#111")}
            >
              {link.label}
            </a>
          ))}
        </div>
      ))}
    </motion.div>
  )
}

function NavItem({ item }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (!item.dropdown) {
    return (
      <a
        href={item.href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 14px",
          fontSize: 14,
          fontWeight: 500,
          color: "white",
          textDecoration: "none",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
        <span style={{ fontSize: 11, opacity: 0.7 }}>arrow_outward</span>
      </a>
    )
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "8px 14px",
          fontSize: 14,
          fontWeight: 500,
          color: "white",
          background: open ? "rgba(255,255,255,0.15)" : "transparent",
          border: "none",
          borderRadius: 999,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = "transparent" }}
      >
        {item.label}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {open && <DropdownPanel columns={item.dropdown.columns} />}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          background: scrolled ? "rgba(6,10,24,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          transition: "background 0.25s, border-color 0.25s",
        }}
      >
        {/* Logo */}
        <a style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <img
            src={logoSrc}
            alt="FortuNex"
            style={{ display: "block", width: 142, height: 40, objectFit: "contain" }}
          />
        </a>

        {/* Center pill nav */}
        <nav
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: 999,
            padding: "4px 10px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* Right side actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <button
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 14, fontWeight: 500 }}
          >
            <Globe size={16} />
            EN
          </button>
          <a
            className="desktop-nav"
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              border: "2px solid white",
              color: "white",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 14,
              background: "transparent",
            }}
          >
            Log in
          </a>
          <a
           
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: "#ff4f6f",
              color: "white",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Open account
          </a>
          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-menu-button"
            style={{ display: "none", border: "none", background: "transparent", color: "white", cursor: "pointer" }}
          >
            <Menu size={22} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(6,10,24,0.99)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <img
                src={logoSrc}
                alt="FortuNex"
                style={{ display: "block", width: 142, height: 40, objectFit: "contain" }}
              />
              <button onClick={() => setMobileOpen(false)} style={{ border: "none", background: "transparent", color: "white", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 0",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      color: "white",
                      fontSize: 17,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {item.label}
                    {item.dropdown && (
                      mobileExpanded === item.label
                        ? <ChevronUp size={16} color="rgba(255,255,255,0.5)" />
                        : <ChevronDown size={16} color="rgba(255,255,255,0.5)" />
                    )}
                  </button>

                  <AnimatePresence>
                    {mobileExpanded === item.label && item.dropdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "12px 0 16px 12px", display: "flex", flexDirection: "column", gap: 20 }}>
                          {item.dropdown.columns.map((col) => (
                            <div key={col.heading}>
                              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
                                {col.heading}
                              </p>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {col.links.map((link) => (
                                  <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, textDecoration: "none", fontWeight: 500 }}
                                  >
                                    {link.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto", paddingTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
              <a  style={{ padding: "14px 18px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.3)", color: "white", textAlign: "center", textDecoration: "none", fontWeight: 700 }}>
                Log in
              </a>
              <a  style={{ padding: "14px 18px", borderRadius: 14, background: "#ff4f6f", color: "white", textAlign: "center", textDecoration: "none", fontWeight: 700 }}>
                Open account
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-button { display: inline-flex !important; }
        }
      `}</style>
    </>
  )
}
