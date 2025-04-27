/**
 * Tailwind CSS v4 TypeScript Configuration
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  // Note: In Tailwind CSS v4, content detection is automatic
  // You can still specify content paths if needed
  content: [
    './src/**/*.{ts,tsx,js,jsx,html}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
  ],
  darkMode: 'class',

  // Theme customization (optional in v4)
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },

  // Plugins (optional)
  plugins: [],
}
