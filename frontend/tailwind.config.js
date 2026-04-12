/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#121212',
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        accent: '#60a5fa',
      },
    },
  },
  plugins: [],
}
