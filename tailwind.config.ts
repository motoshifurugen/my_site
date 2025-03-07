import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-white': '#F6F6F6',
        'main-black': '#4A4A4A',
        'night-white': '#E0E0E0',
        'night-black': '#2E2E3F',
        'night-teal': '#388E8E',
        'night-gray': '#4B4B5A',
        'night-orange': '#E69500',
        'like-pink': '#E95B6B',
        white: '#FFFFFF',
        gray: '#E5E7E6',
        teal: '#008080',
        orange: '#FF8C00',
      },
      animation: {
        'fade-in': 'fadeIn 10s ease-in-out',
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
      fontSize: {
        xxs: '0.625rem',
      },
    },
  },
  plugins: [],
}
export default config
