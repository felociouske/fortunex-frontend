import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../../components/IndexNavbar"
import Footer from "../../components/IndexFooter"

const terms = [
  { term: "Ask price", def: "The price at which you can buy an instrument. Also called the offer price." },
  { term: "Bid price", def: "The price at which you can sell an instrument." },
  { term: "CFD", def: "Contract for Difference — a derivative that tracks the price of an underlying asset without requiring ownership of it." },
  { term: "Commission", def: "A fee charged by the broker for executing a trade. FortuNex uses spreads rather than commissions on most instruments." },
  { term: "Demo account", def: "A practice account funded with virtual money, allowing you to trade in real market conditions without financial risk." },
  { term: "Equity", def: "The value of your account balance including any unrealised profit or loss from open trades." },
  { term: "Expiry", def: "The date and time at which an options contract closes and the payout is determined." },
  { term: "Free margin", def: "The amount of money in your account not currently committed to any open positions." },
  { term: "Going long", def: "Buying an instrument in the expectation that its price will rise." },
  { term: "Going short", def: "Selling an instrument you do not own, expecting to buy it back at a lower price." },
  { term: "Hedge", def: "Opening a trade to offset the risk of another open position." },
  { term: "Indicative price", def: "A quoted price that may change before execution, typically in fast-moving market conditions." },
  { term: "Leverage", def: "The use of borrowed capital to control a larger position than your account balance would otherwise allow." },
  { term: "Liquidity", def: "The ease with which an instrument can be bought or sold without affecting its market price significantly." },
  { term: "Lot", def: "A standard unit of measurement for trade size. One standard lot in forex equals 100,000 units of the base currency." },
  { term: "Margin", def: "The amount of capital required to open or maintain a leveraged position." },
  { term: "Margin call", def: "A request from the broker to deposit additional funds when your margin falls below the required minimum." },
  { term: "Market order", def: "An instruction to buy or sell at the best currently available price." },
  { term: "Multiplier", def: "A trade type that amplifies your exposure to a price movement by a chosen factor, with capped downside." },
  { term: "Negative balance protection", def: "A safeguard that prevents your account balance from going below zero, even in extreme market conditions." },
  { term: "Open position", def: "A trade that has been executed but not yet closed." },
  { term: "Pip", def: "The smallest standard unit of price movement, typically 0.0001 for most currency pairs." },
  { term: "Position size", def: "The amount of an instrument you are buying or selling in a single trade." },
  { term: "Realised P&L", def: "The profit or loss from a trade that has been closed." },
  { term: "Requote", def: "When a broker offers a different price from the one requested, typically in fast-moving markets." },
  { term: "Rollover", def: "The process of extending an open position past its settlement date, often involving a swap fee." },
  { term: "Slippage", def: "The difference between the expected price of a trade and the price at which it actually executes." },
  { term: "Spread", def: "The difference between the bid and ask price. This is how most brokers earn revenue." },
  { term: "Stop-loss", def: "An order placed to close a trade automatically if the market moves against you by a specified amount." },
  { term: "Swap", def: "The fee or credit applied to a position held overnight, based on the interest rate differential between the two currencies." },
  { term: "Take-profit", def: "An order that closes your trade automatically when a target profit level is reached." },
  { term: "Tick", def: "The minimum price increment for an instrument. Especially relevant for Synthetic Indices." },
  { term: "Trailing stop", def: "A stop-loss order that moves with the price in your favour but stays fixed when the price moves against you." },
  { term: "Unrealised P&L", def: "The paper profit or loss on a position that is still open." },
  { term: "Volatility", def: "The degree to which an instrument's price fluctuates over a given period." },
]

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function Glossary() {
  const [activeLetter, setActiveLetter] = useState(null)

  const filteredTerms = activeLetter
    ? terms.filter((t) => t.term.toUpperCase().startsWith(activeLetter))
    : terms

  const availableLetters = new Set(terms.map((t) => t.term[0].toUpperCase()))

  return (
    <div style={{ minHeight: "100vh", background: "#050814", color: "white", paddingTop: 72 }}>
      <Navbar />
      <section style={{
        padding: "80px 28px 64px",
        background: "linear-gradient(160deg, #050814 0%, #081228 60%, #0a1a38 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 20% 40%, rgba(255,79,120,0.1), transparent 30%)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-flex", padding: "7px 14px", borderRadius: 999, background: "rgba(255,79,120,0.12)", color: "#ff9aa4", fontWeight: 700, fontSize: 12, marginBottom: 24 }}>
              Learn
            </span>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 74px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 24 }}>
              Glossary.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 520, lineHeight: 1.85 }}>
              A reference guide to the key terms used in trading and on the FortuNex platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Alpha filter */}
      <section style={{ padding: "32px 28px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <button
              onClick={() => setActiveLetter(null)}
              style={{ padding: "8px 14px", borderRadius: 10, background: activeLetter === null ? "#ff4f6f" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              All
            </button>
            {alphabet.map((l) => (
              <button
                key={l}
                onClick={() => availableLetters.has(l) && setActiveLetter(activeLetter === l ? null : l)}
                style={{
                  padding: "8px 12px", borderRadius: 10,
                  background: activeLetter === l ? "#ff4f6f" : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: availableLetters.has(l) ? "white" : "rgba(255,255,255,0.2)",
                  fontWeight: 700, fontSize: 13,
                  cursor: availableLetters.has(l) ? "pointer" : "default",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Terms */}
      <section style={{ padding: "40px 28px 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {filteredTerms.map((t, i) => (
              <motion.div
                key={t.term}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "240px 1fr",
                  gap: 24,
                  padding: "22px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  alignItems: "start",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: "white" }}>{t.term}</span>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0 }}>{t.def}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
