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

// Matches the first entry in DEFAULT_SLIDES / HERO_IMAGES in components/RealHome.js —
// preloaded so the browser starts fetching it immediately instead of waiting on
// JS to hydrate and set the background-image via inline style.
const FIRST_HERO_IMAGE =
  'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/hero%20slider/0524_pe-review.webp';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${alegreya.variable} ${roboto.variable}`}>
      <head>
        <link rel="preload" as="image" href={FIRST_HERO_IMAGE} fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
