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
          dark: '#e56c00',
          light: '#FFF6EC',
        },
        secondary: {
          DEFAULT: '#0F3B63',
          dark: '#0c2f4e',
        },
        accent: {
          orange: '#FF7A00',
          orangeDark: '#e56c00',
          blue: '#0F3B63',
          blueSoft: '#F3F7FB',
          orangeSoft: '#FFF6EC',
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