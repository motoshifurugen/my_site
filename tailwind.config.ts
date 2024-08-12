import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main' : '#F6F6F6',
        'font-main' : '#1A1C1A',
        'white' : '#FFFFFF',
        'gray' : '#E5E7E6',
        'teal' : '#008080',
      },
      fontFamily: {
        'mobo': ['MOBO', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 2s ease-in-out',
        'fade-in-up': 'fadeInUp 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.5' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
