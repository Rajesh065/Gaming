/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0b10',
          darker: '#06070a',
          card: '#121420',
          border: '#1f2438',
          neon: '#00ffcc',
          pink: '#ff007f',
          purple: '#8b5cf6',
          yellow: '#ffd000',
          blue: '#0099ff'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
