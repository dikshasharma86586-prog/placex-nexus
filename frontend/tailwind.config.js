/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] }, colors: {
    sidebar: '#17172B', accent: '#6857E8', accentHover: '#5746D5', lavender: '#F2F0FF',
    page: '#FCFBFF', surface: '#FFFFFF', ink: '#24243A', muted: '#77788F', border: '#EAE8F2',
    success: '#159A72', warning: '#D99127', danger: '#D94C65',
  } } },
  plugins: [],
}
