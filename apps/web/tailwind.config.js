/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0E14',
        surface: {
          50: '#1A202C',
          100: '#141824',
          200: '#0F121C',
          300: '#0B0E14'
        },
        brand: {
          primary: '#6366F1',
          accent: '#06B6D4',
          glow: '#3B82F6',
          danger: '#F43F5E',
          warning: '#F59E0B',
          success: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
