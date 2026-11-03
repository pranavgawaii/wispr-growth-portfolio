/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: '#EEF2EA',
          surface: '#FAFBF7',
          ink: '#13261D',
          mute: '#55655B',
          line: '#D3DCCD',
          hl: '#D8F26A',
          accent: '#1F6B45',
          t1: '#DDE9D6',
          t2: '#E6F2B4',
          t3: '#F1EBD0',
          t4: '#D6E6E1',
          t5: '#E7E3D6',
          flag: '#FFF1C2',
          flagBorder: '#C9A227',
        },
      },
      fontFamily: {
        grotesk: ['"Hanken Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        outfit: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        bricolage: ['"Bricolage Grotesque"', '"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        portfolio: '0 1px 2px rgba(19, 38, 29, 0.05), 0 14px 34px rgba(19, 38, 29, 0.08)',
      },
    },
  },
  plugins: [],
};
