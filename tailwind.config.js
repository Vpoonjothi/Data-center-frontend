/** @type {import('tailwindcss').Config} */
export default {
  // Force tailwind rebuild
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#1A801D',
        accent: '#166E18',
        background: '#FFFFFF',
        sectionBg: '#F8FAFC',
        emerald: {
          50: '#edf9ef',
          100: '#d3f0d8',
          200: '#aee1b8',
          300: '#7ccb8d',
          400: '#4dae63',
          500: '#1A801D', // Brand logo exact green
          600: '#166E18',
          700: '#125A14',
          800: '#0F4711',
          900: '#0B360E',
          950: '#051D07',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
