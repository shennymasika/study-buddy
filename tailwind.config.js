/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          green: '#58cc02',
          'green-dark': '#46a302',
          'green-light': '#d7ffb8',
          blue: '#1cb0f6',
          'blue-dark': '#1899d6',
          'blue-light': '#ddf4ff',
          amber: '#ff9600',
          'amber-dark': '#e08400',
          'amber-light': '#fff5d6',
          rose: '#ff4b4b',
          'rose-dark': '#ea2b2b',
          'rose-light': '#ffe5e5',
          purple: '#ce82ff',
          'purple-dark': '#a855f7',
          'purple-light': '#f3e8ff',
        }
      },
      fontFamily: {
        sans: [
          'Nunito',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out infinite alternate',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        bounceSubtle: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
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
