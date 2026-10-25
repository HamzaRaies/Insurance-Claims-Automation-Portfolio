/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E0E0F',
        panel: '#171717',
        raised: '#1F1F20',
        edge: 'rgba(255, 255, 255, 0.09)',
        soft: '#C9C9C9',
        dim: '#9C9C9C',
        flame: {
          DEFAULT: '#FF5B1A',
          hot: '#FF7A2E',
          deep: '#C2380E',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      screens: {
        // Desktop screens with little height, like 1366x768 laptops
        short: { raw: '(min-width: 1024px) and (max-height: 820px)' },
      },
      maxWidth: {
        page: '72rem',
        frame: '84rem',
      },
    },
  },
  plugins: [],
};
