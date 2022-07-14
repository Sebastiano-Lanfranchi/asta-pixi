/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}",],
  theme: {
    screens: {
      'sm': {'max': '639px'},
    },
    extend: {
      backgroundImage: {
        'fut-card': "url('src/assets/gold1.png')"
      }
    },
  },
  plugins: [],
}
