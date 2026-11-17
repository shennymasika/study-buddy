/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        figma: {
          blue: '#2563eb',
          'blue-dark': '#1e40af',
          'blue-navy': '#1e3a8a',
          'blue-border': '#dbeafe',
          'blue-light': '#eff6ff',
          yellow: '#eaa400',
          'yellow-light': '#fff8dc',
          'yellow-badge': '#fef3c7',
          coral: '#ffe4e6',
          'coral-text': '#e11d48',
          red: '#ef4444',
          'red-dark': '#991b1b',
          'red-light': '#fef2f2',
          gray: {
            title: '#1f2937',
            body: '#374151',
            muted: '#6b7280',
            bg: '#f3f4f6',
          }
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      animation: {
        'robot-float': 'robotFloat 3s ease-in-out infinite',
        'robot-wave': 'robotWave 1.5s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        robotFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        robotWave: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(5deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-3px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(3px, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}
