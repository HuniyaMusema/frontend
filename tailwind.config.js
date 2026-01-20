/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e1e9ff',
          200: '#cbd9ff',
          300: '#a3bcff',
          400: '#7395ff',
          500: '#1e3a8a',
          600: '#1e3a8a',
          700: '#172e6e',
          800: '#112252',
          900: '#0c183b',
        },
        emerald: {
          500: '#10b981', // Approved
        },
        amber: {
          500: '#f59e0b', // Pending
        },
        rose: {
          500: '#f43f5e', // Denied
        },
        slate: {
          50: '#f8fafc',
          900: '#0f172a',
        }
      },
    },
  },
  plugins: [],
}
// Triggering reload for custom colors fix


