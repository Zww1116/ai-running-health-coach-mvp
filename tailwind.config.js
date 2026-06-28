/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172019',
        moss: '#60745b',
        coral: '#e8715c',
        skysoft: '#d9ecf2',
        blush: '#f8d7d2',
      },
      boxShadow: {
        soft: '0 14px 40px rgba(23, 32, 25, 0.08)',
      },
    },
  },
  plugins: [],
};
