import type { Config } from 'tailwindcss'
import type { PluginAPI } from 'tailwindcss/types/config'

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
        teal: {
          DEFAULT: '#008080',
          50: '#E0F2F1',
          100: '#B2DFDB',
          200: '#80CBC4',
          300: '#4DB6AC',
          400: '#26A69A',
          500: '#008080',
          600: '#00695C',
          700: '#004D40',
          800: '#00695C',
          900: '#004D40',
        },
        orange: '#FF8C00',
      },
      animation: {
        'fade-in': 'fadeIn 10s ease-in-out',
        'fade-in-up': 'fadeInUp 1s ease-in-out',
        'cloud-move-1': 'cloudMove1 30s linear infinite',
        'cloud-move-2': 'cloudMove2 35s linear infinite',
        'cloud-move-3': 'cloudMove3 40s linear infinite',
        'cloud-move-4': 'cloudMove4 45s linear infinite',
        'twinkle-1': 'twinkle 4s ease-in-out infinite',
        'twinkle-2': 'twinkle 4s ease-in-out infinite 0.5s',
        'twinkle-3': 'twinkle 4s ease-in-out infinite 1s',
        'twinkle-4': 'twinkle 4s ease-in-out infinite 1.5s',
        'twinkle-5': 'twinkle 4s ease-in-out infinite 2s',
        'shooting-star-1': 'shootingStar1 6s ease-out infinite',
        'shooting-star-2': 'shootingStar2 8s ease-out infinite 3s',
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
        cloudMove1: {
          '0%': { transform: 'translateX(-100%) scale(1.2)' },
          '100%': { transform: 'translateX(100vw) scale(1.2)' },
        },
        cloudMove2: {
          '0%': { transform: 'translateX(100vw) scale(0.8)' },
          '100%': { transform: 'translateX(-100%) scale(0.8)' },
        },
        cloudMove3: {
          '0%': { transform: 'translateX(-100%) translateY(20px) scale(1.5)' },
          '100%': { transform: 'translateX(100vw) translateY(-20px) scale(1.5)' },
        },
        cloudMove4: {
          '0%': { transform: 'translateX(100vw) translateY(-20px) scale(1)' },
          '100%': { transform: 'translateX(-100%) translateY(20px) scale(1)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        shootingStar1: {
          '0%': {
            transform: 'translateX(100px) translateY(-100px) rotate(-45deg)',
            opacity: '0',
          },
          '10%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'translateX(-500px) translateY(500px) rotate(-45deg)',
            opacity: '0',
          },
        },
        shootingStar2: {
          '0%': {
            transform: 'translateX(150px) translateY(-150px) rotate(-45deg)',
            opacity: '0',
          },
          '10%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': {
            transform: 'translateX(-500px) translateY(500px) rotate(-45deg)',
            opacity: '0',
          },
        },
      },
      fontSize: {
        xxs: '0.625rem',
      },
      backgroundImage: {
        'sky-mobile': 'linear-gradient(to bottom, rgb(134, 179, 224), rgb(134, 179, 224))',
        'night-mobile': 'linear-gradient(to bottom, #2E2E3F, #2E2E3F)',
      },
    },
  },
  plugins: [
    function({ addComponents }: PluginAPI) {
      addComponents({
        '.cloud': {
          position: 'absolute',
          width: '60px',
          height: '20px',
          backgroundColor: 'rgba(246, 246, 246, 0.8)',
          borderRadius: '20px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10px',
            left: '10px',
            width: '30px',
            height: '30px',
            backgroundColor: 'rgba(246, 246, 246, 0.8)',
            borderRadius: '50%',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-5px',
            right: '10px',
            width: '20px',
            height: '20px',
            backgroundColor: 'rgba(246, 246, 246, 0.8)',
            borderRadius: '50%',
          },
          '.dark &': {
            backgroundColor: 'rgba(200, 200, 200, 0.25)',
            '&::before, &::after': {
              backgroundColor: 'rgba(200, 200, 200, 0.25)',
            },
          },
          '&.animate-cloud-move-1': {
            top: '15%',
            left: '10%',
          },
          '&.animate-cloud-move-2': {
            top: '35%',
            right: '10%',
          },
          '&.animate-cloud-move-3': {
            top: '55%',
            left: '20%',
          },
          '&.animate-cloud-move-4': {
            top: '75%',
            right: '20%',
          },
        },
        '.star': {
          position: 'absolute',
          width: '4px',
          height: '4px',
          backgroundColor: 'rgba(255, 250, 200, 0.8)',
          borderRadius: '50%',
          '&.animate-twinkle-1': {
            top: '10%',
            left: '20%',
            width: '6px',
            height: '6px',
          },
          '&.animate-twinkle-2': {
            top: '30%',
            left: '70%',
            width: '3px',
            height: '3px',
          },
          '&.animate-twinkle-3': {
            top: '50%',
            left: '40%',
            width: '5px',
            height: '5px',
          },
          '&.animate-twinkle-4': {
            top: '70%',
            left: '85%',
            width: '4px',
            height: '4px',
          },
          '&.animate-twinkle-5': {
            top: '85%',
            left: '15%',
            width: '3px',
            height: '3px',
          },
        },
        '.shooting-star': {
          position: 'absolute',
          width: '40px',
          height: '1px',
          backgroundColor: 'rgba(255, 250, 200, 0.8)',
          borderRadius: '1px',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '3px',
            height: '3px',
            backgroundColor: 'rgba(255, 250, 200, 0.8)',
            borderRadius: '50%',
            left: '0',
            top: '-1px',
          },
          '&.animate-shooting-star-1': {
            top: '5%',
            right: '-5%',
          },
          '&.animate-shooting-star-2': {
            top: '65%',
            right: '-5%',
          },
        },
      })
    }
  ],
}
export default config
