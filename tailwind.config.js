/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}",],
  theme: {
    screens: {
      'sm': {'max': '639px'},

    },
    extend: {},
  },
  plugins: [],
}
