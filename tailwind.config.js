/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce5cb',
          300: '#8dd1a8',
          400: '#57b67e',
          500: '#339b5e',
          600: '#26804a',
          700: '#1f653c',
          800: '#1b5132',
          900: '#003F2D',
          950: '#002419',
        },
        forest: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce5cb',
          300: '#8dd1a8',
          400: '#57b67e',
          500: '#339b5e',
          600: '#26804a',
          700: '#1f653c',
          800: '#1b5132',
          900: '#003F2D',
          950: '#002419',
        }
      }
    },
  },
  plugins: [],
};