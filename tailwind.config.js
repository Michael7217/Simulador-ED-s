/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azul: '#023047',
        amarelo: '#FFB703',
        ciano: '#8ECAE6',
        laranja: '#FB8500',
        branco: '#FFFFFF',
        preto: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}