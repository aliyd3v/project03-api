/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'text-color': '#ffc335',
        'main-bg':'#111',
        'p-color':'#8f8f8f'
      
      },
    },
  },
  plugins: [],
}

