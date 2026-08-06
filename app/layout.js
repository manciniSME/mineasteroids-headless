import './globals.css';

export const metadata = {
  title: 'mineasteroids.org — headless test',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
