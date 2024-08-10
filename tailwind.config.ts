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
      'white' : '#FFFFFF',
    },
    fontFamily: {
      'dm-sans': ['DMSans', 'sans-serif'],
      'open-sans': ['OpenSans', 'sans-serif'],
      'mobo': ['MOBO', 'sans-serif'],
    }
  },
  plugins: [],
};
export default config;
