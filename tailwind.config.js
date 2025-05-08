/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // もしsrcディレクトリを使ってる場合
  ],
  theme: {
    extend: {
      colors: {
        vspoPurple: '#8B5CF6', // ぶいすぽっ！のメイン紫
        vspoLightPurple: '#D8B4FE', // 薄紫
        vspoWhite: '#FFFFFF', // 白
        vspoGray: '#F3F4F6', // 薄いグレー
        vspoDark: '#1F2937', // ダークグレー（テキスト用）
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'], // モダンなフォント
      },
      boxShadow: {
        'vspo': '0 4px 20px rgba(139, 92, 246, 0.15)', // ぶいすぽっ！風の影
        'vspo-hover': '0 8px 30px rgba(139, 92, 246, 0.25)', // ホバー時の影
      },
    },
  },
  plugins: [],
};