import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        slate: "#475569",
        mist: "#f8fafc",
        line: "#dbe4f0",
        brand: {
          DEFAULT: "#2563eb",
          soft: "#dbeafe",
          dark: "#1d4ed8"
        },
        aqua: "#0ea5e9",
        mint: "#10b981"
      },
      boxShadow: {
        panel: "0 18px 40px rgba(15, 23, 42, 0.08)",
        soft: "0 10px 24px rgba(37, 99, 235, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(37,99,235,0.14), transparent 34%), radial-gradient(circle at 85% 15%, rgba(14,165,233,0.16), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fbff 54%, #eef6ff 100%)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        rise: "rise 700ms ease forwards"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        rise: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: [typography]
};
