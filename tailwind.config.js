/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fortunex design system
        fx: {
          bg:        "#0d0d14",   // main dark background
          surface:   "#13131f",   // card/panel surface
          surface2:  "#1a1a2e",   // elevated surface
          border:    "#2a2a3d",   // subtle borders
          teal:      "#00c2b2",   // primary accent (teal/cyan)
          "teal-dk": "#009e90",   // teal hover
          red:       "#e8404a",   // danger / Fall button
          "red-dk":  "#c93039",   // red hover
          muted:     "#6b7280",   // muted text
          text:      "#e5e7eb",   // primary text
          "text-dim":"#9ca3af",   // secondary text
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0d0d14 0%, #1a1a2e 50%, #0d1a2e 100%)",
      },
    },
  },
  plugins: [],
}
