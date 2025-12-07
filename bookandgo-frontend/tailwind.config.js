/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A00',
          dark: '#d96400',
          light: '#ff9a3a',
        },
        secondary: {
          DEFAULT: '#0F3B63',
          dark: '#0b2d4b',
        },
        accent: {
          yellow: '#FF7A00',
          gold: '#d96400',
          mustard: '#ff9a3a',
          orange: '#FF7A00',
          darkOrange: '#d96400',
          white: '#FFFFFF',
          black: '#000000',
          gray: {
            100: '#F7FAFC',
            200: '#EDF2F7',
            300: '#E2E8F0',
            400: '#CBD5E0',
            500: '#A0AEC0',
            600: '#718096',
            700: '#4A5568',
            800: '#2D3748',
            900: '#1A202C',
            50: '#FFF6EC',
            150: '#F3F7FB',
          },
        },
      },
    },
    fontFamily: {
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
    },
  },
  plugins: [],
}