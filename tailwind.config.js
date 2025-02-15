/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5f27ca',   // Main brand color
          light: '#b4a4e3',     // Lighter variant for backgrounds or highlights
          soft: '#e0daf2',      // Soft tint for subtle UI elements
        },
  
      },
    },
  },
  plugins: [],
}

