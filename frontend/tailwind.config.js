/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#38bdf8',
          green: '#34d399',
          dark: '#0f172a',
          card: '#1e293b',
        },
      },
    },
  },
  plugins: [],
};
