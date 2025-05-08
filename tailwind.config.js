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
        vspoDarkOverlay: 'rgba(15, 15, 15, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'vspo': '0 4px 20px rgba(139, 92, 246, 0.15)',
        'vspo-hover': '0 8px 30px rgba(139, 92, 246, 0.35)',
        'neon': '0 0 10px rgba(139, 92, 246, 0.5)',
        'neon-strong': '0 0 8px rgba(139, 92, 246, 0.5)', // さらに弱める
      },
      transitionProperty: {
        'transform-glow': 'transform, box-shadow',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'wave': 'wave 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.7)' },
          '100%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.3)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'vspo-texture': 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 1px, transparent 1px)',
        'title-underline': 'linear-gradient(to right, #8B5CF6, transparent)',
      },
      backgroundSize: {
        'vspo-texture-size': '20px 20px',
      },
    },
  },
  plugins: [],
};