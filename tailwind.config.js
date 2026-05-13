

/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        primary: '#0E245B',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0E245B',
        },
        highlight: '#FFE697',
        border: {
          DEFAULT: 'rgba(14, 36, 91, 0.12)',
          dark: '#333333',
        },
        endeavor: {
          blue: '#235FF8',
          blueHover: '#144CDC',
          navy: '#0E245B',
          gold: '#FFCF30',
          goldPale: '#FFE697',
          lavender: '#F3F7FF',
          ice: '#E1F5FC',
          periwinkle: '#EAF0FE',
        }
      },
      fontFamily: {
        display: ['DM Sans', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Spectral', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}

