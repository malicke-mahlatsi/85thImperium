/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'beige': '#f5f0e1',
        'light-gray': '#e5e5e5',
        'deep-teal': '#1a3c34',
        'muted-gold': '#b89c5e',
        'soft-pink': '#ffd6e0',
        'y2k-pink': '#ff69b4',
        'cyber-blue': '#4dc9ff',
        'elegant-purple': '#9d4edd',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}