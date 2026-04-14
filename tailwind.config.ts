/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* SHUDDHAM M3 Palette */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#17281a",
          foreground: "#ffffff",
          container: "#2c3e2f",
          fixed: "#d3e8d3",
          "fixed-dim": "#b7ccb7",
        },
        secondary: {
          DEFAULT: "#4c644d",
          foreground: "#ffffff",
          container: "#cbe7ca",
          fixed: "#ceeacd",
          "fixed-dim": "#b2ceb2",
        },
        tertiary: {
          DEFAULT: "#322106",
          container: "#4a3619",
          fixed: "#feddb4",
          "fixed-dim": "#e0c29a",
        },
        destructive: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          DEFAULT: "#fbf9f4",
          dim: "#dbdad5",
          bright: "#fbf9f4",
          container: "#f0eee9",
          "container-low": "#f5f3ee",
          "container-high": "#eae8e3",
          "container-highest": "#e4e2dd",
          "container-lowest": "#ffffff",
          variant: "#e4e2dd",
        },
        outline: {
          DEFAULT: "#737872",
          variant: "#c3c8c0",
        },
        "on-surface": "#1b1c19",
        "on-surface-variant": "#434842",
        "on-primary-container": "#94a995",
        "on-secondary-container": "#506951",
        "on-tertiary-container": "#bb9f7a",
        "on-secondary-fixed-variant": "#3f4b2c",
        "on-tertiary-fixed-variant": "#574500",
        "inverse-surface": "#30312e",
        "inverse-on-surface": "#f2f1ec",
        "inverse-primary": "#b7ccb7",
        gold: "#D4AF37",
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        display: ["var(--font-display)"],
        headline: ["var(--font-display)"],
        body: ["var(--font-body)"],
        label: ["var(--font-body)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
