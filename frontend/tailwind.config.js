/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050505',
          900: '#09090b',
          800: '#141417',
          700: '#1e1e24',
          600: '#2a2a32',
        },
        slate: {
          850: '#111827',
        },
        brand: {
          white: '#ffffff',
          silver: '#e4e4e7',
          muted: '#9ca3af',
          emerald: '#10b981',
          gold: '#f59e0b',
          crimson: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-white': '0 0 25px -5px rgba(255, 255, 255, 0.12)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
