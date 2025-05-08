import { Inter } from 'next/font/google';
import './globals.css'; // グローバルCSSをインポート

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ぶいすぽっ！ライブ配信トラッカー',
  description: 'ぶいすぽっ！VTuberのライブ配信をトラックするアプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}