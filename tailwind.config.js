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
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
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


