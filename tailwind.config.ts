import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        ink: "var(--color-ink)",
        accent: "var(--color-accent)",
        mist: "var(--color-mist)"
      }
    }
  },
  plugins: []
} satisfies Config;
