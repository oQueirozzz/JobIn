/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vinho': '#7B2D26',
        'branco': '#FFFFFF',
        'cinza': '#F5F5F5',
        'cinza-escuro': '#333333',
        'bege': '#D7C9AA',
      },
      animation: {
        'loadingBar': 'loadingBar 1.5s ease-in-out infinite',
        'pulse': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin': 'spin 3s linear infinite',
        'dots': 'dots 1.5s infinite',
      },
      keyframes: {
        loadingBar: {
          '0%': { width: '0%', marginLeft: '0%' },
          '50%': { width: '70%', marginLeft: '30%' },
          '100%': { width: '0%', marginLeft: '100%' },
        },
        dots: {
          '0%, 20%': { content: '""' },
          '40%': { content: '"."' },
          '60%': { content: '".."' },
          '80%, 100%': { content: '"..."' },
        },
      },
    },
  },
  plugins: [],
}