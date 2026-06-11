/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0D14',
          card: '#0F1318',
          lighter: '#141820',
          surface: '#1A1F2A',
        },
        cyan: {
          DEFAULT: '#00C2FF',
          glow: '#00C2FF',
        },
        gold: {
          DEFAULT: '#C9A84C',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'flow': 'flow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 194, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 194, 255, 0.6)' },
        },
        'flow': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(10px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
