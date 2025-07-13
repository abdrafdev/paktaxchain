/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pakistan-green': '#01411C',
        'pakistan-white': '#FFFFFF',
        'pakistan-dark': '#006A4E',
        'pakistan-light': '#B2DF8A',
        'chart-primary': '#10B981',
        'chart-secondary': '#3B82F6',
        'chart-accent': '#F59E0B',
        'chart-danger': '#EF4444',
      },
      fontFamily: {
        'urdu': ['Noto Nastaliq Urdu', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'pakistan-flag': 'linear-gradient(135deg, #01411C 0%, #006A4E 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
