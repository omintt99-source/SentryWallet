/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#38BDF8',
        accent: '#1E293B',
        background: '#F9FAFB',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-delayed-2': 'float 6s ease-in-out infinite 4s',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-up': 'slideInUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        }
      },
      boxShadow: {
        'neumorphic': '0 20px 40px rgba(31, 38, 135, 0.12), 0 8px 32px rgba(31, 38, 135, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        '3xl': '0 35px 70px rgba(0, 0, 0, 0.12), 0 15px 30px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};