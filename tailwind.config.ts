import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'bg-main' : '#F6F6F6',
      'font-main' : '#1A1C1A',
    },
    fontFamily: {
      'mobo': ['MOBO', 'sans-serif'],
      'dm-sans': ['DMSans', 'sans-serif'],
      'stick': ['Stick', 'sans-serif'],
    }
  },
  plugins: [],
};
export default config;
