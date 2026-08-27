import { Alegreya, Roboto } from 'next/font/google';
import './globals.css';

const alegreya = Alegreya({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-alegreya',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata = {
  title: 'mineasteroids.org — headless test',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${alegreya.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
