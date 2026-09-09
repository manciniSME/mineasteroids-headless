import AboutUsClient from '../components/AboutUsClient';

// No build-time fetch here — the Board of Directors section is the only
// dynamic content on this page, and it's deliberately live-only (see
// AboutUsClient), so there's nothing to fetch at build time.
export default function Page() {
  return <AboutUsClient />;
}
