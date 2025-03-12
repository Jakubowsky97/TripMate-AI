import type { Config } from "tailwindcss";

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', 
    './src/components/**/*.{js,ts,jsx,tsx}',
    "./node_modules/flyonui/dist/js/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require("flyonui"),
    require("flyonui/plugin"),
  ],
} satisfies Config;
