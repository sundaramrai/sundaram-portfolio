/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './js/**/*.js',
    './css/**/*.css'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F5FF', 100: '#CCE9FF', 200: '#99D3FF', 300: '#66BDFF', 400: '#33A7FF',
          500: '#0091FF', 600: '#0074CC', 700: '#005799', 800: '#003A66', 900: '#001D33'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite'
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } }
      },
      textColor: { 'gradient': 'transparent' },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.content-auto': { 'content-visibility': 'auto' },
        '.text-gradient': { 'background-clip': 'text', 'background-image': 'linear-gradient(to right, #3b82f6, #a855f7)', 'color': 'transparent' },
        '.card-hover-effect': { 'transition': 'all 300ms', 'transform': 'translateY(0)' },
        '.card-hover-effect:hover': { 'transform': 'translateY(-8px)' },
        '.nav-link': { 'position': 'relative' },
        '.nav-link::after': {
          'content': '""',
          'position': 'absolute',
          'width': '100%',
          'transform': 'scaleX(0)',
          'height': '2px',
          'bottom': '0',
          'left': '0',
          'background-color': '#3b82f6',
          'transition': 'transform 300ms'
        },
        '.nav-link:hover::after': { 'transform': 'scaleX(1)' },
        '.section-divider': {
          'position': 'relative',
          'overflow': 'hidden',
          'padding-top': '3rem',
          'padding-bottom': '3rem'
        },
        '.section-divider::before': {
          'content': '""',
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'width': '100%',
          'height': '4px',
          'background-image': 'linear-gradient(to right, transparent, #3b82f6, transparent)'
        }
      };
      addUtilities(newUtilities);
    }
  ]
}
