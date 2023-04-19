import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        "layout": "auto 1fr auto",
      },
      backgroundImage: {
        "pattern1": "url('/images/ffflurry.svg')",
        "pattern2": "url('/images/sssquiggly.svg')",
      }
    },
  },
  plugins: [],
} satisfies Config;
