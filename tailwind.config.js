/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html",
    "./node_modules/preline/dist/*.js",
  ],
  theme: {
    fontFamily: {
      'sans': ["Roboto", "serif"],
      'serif': ["Oswald", 'serif'],
    },
    extend: {
      screens: {
        '2xl': '1366px',
        '3xl': '1536px',
      },
      boxShadow: {
        'dashboard': '0 4px 24px 2px rgba(20,25,38,.05)',
        'sidebar': '0 0 24px 2px rgba(20,25,38,.05)',
        'normal': '0 4px 24px 2px rgba(20,25,38,.05)',
        'bookmark': '0 0 12px 0 #A3ABFE',
        'home-bookmark': '0px 4px 44px 0px #2131E533'
      },
      backgroundImage: {
        'pattern': "url('/public/background.svg')",
      },
      width: {
        'adjust-color-width': 'calc(100% - 70px)',
      },
      colors: {
        'lighter-blue': '#E3E6FF',
        'light-blue': '#C0C6FF',
        'mid-blue': '#9199F0',
        'dark-blue': '#2131E5',
        'light-black': '#1B1B1B',
        'navy': '#191D50',
        'tabs': '#EFF0FF'
      }
    },
  },
  plugins: [
    require('preline/plugin'),
    require('@tailwindcss/forms'),
  ],
}

