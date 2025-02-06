/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    fontFamily: {
      'sans': ["Open Sans", "serif"],
      'serif': ["Oswald", 'serif'],
    },
    extend: {
      boxShadow: {
        'dashboard': '0 4px 24px 2px rgba(20,25,38,.05)',
        'sidebar': '0 0 24px 2px rgba(20,25,38,.05)',
        'normal': '0 4px 24px 2px rgba(20,25,38,.05)',
      },
      width: {
        'adjust-color-width': 'calc(100% - 70px)',
      },
      colors: {
        'light-blue': '#C0C6FF',
        'mid-blue': '#9199F0',
        'dark-blue': '#2131E5',
        'light-black': '#1B1B1B'
      }
    },
  },
  plugins: [
    require('preline/plugin'),
    require('@tailwindcss/forms'),
  ],
}

