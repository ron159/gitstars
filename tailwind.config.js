/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'apple-gray': {
          50: '#f5f5f7',
          100: '#e6e6e6',
          200: '#d2d2d7',
          300: '#b8b8c3',
          400: '#86868b',
          500: '#6e6e73',
          600: '#424245',
          700: '#333336',
          800: '#262629',
          900: '#1d1d1f',
        },
        'apple-blue': {
          500: '#0071e3',
          600: '#0066cc',
        },
        'apple-purple': {
          500: '#6e6cc2',
          600: '#5856d6',
        },
      },
      fontFamily: {
        'sf-pro': ['SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'sf-pro-display': ['SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'sf-mono': ['SF Mono', 'monospace'],
      },
      boxShadow: {
        'apple-card': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'apple-button': '0 1px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
