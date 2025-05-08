/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vspoPurple: '#8B5CF6',
        vspoLightPurple: '#D8B4FE',
        vspoWhite: '#FFFFFF',
        vspoGray: '#F3F4F6',
        vspoDark: '#1F2937',
        vspoBlack: '#0F0F0F',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'vspo': '0 4px 20px rgba(139, 92, 246, 0.15)',
        'vspo-hover': '0 8px 30px rgba(139, 92, 246, 0.35)',
        'neon': '0 0 10px rgba(139, 92, 246, 0.5)',
      },
      transitionProperty: {
        'transform-glow': 'transform, box-shadow',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};