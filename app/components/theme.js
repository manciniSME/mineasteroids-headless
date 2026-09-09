// Shared design tokens and small style helpers used across every page —
// extracted from RealHome.js once a second page (About Us) needed the same
// palette/utilities instead of copy-pasting them.

export const PH = { backgroundImage: 'repeating-linear-gradient(135deg, rgba(33,37,41,.08) 0 8px, rgba(33,37,41,.03) 8px 16px)' };
export const BLUE = '#1b75bb';
export const BLUE_DARK = '#135a91';
export const LIME = '#a9ce3a';
export const LIME_DARK = '#97ba28';
export const NAV_LIME = '#b9d22c';
export const TEXT_DARK = '#23231f';
export const TEXT_BODY = '#2c2c28';
export const UTILITY_BG = '#6d6d64';
export const UTILITY_TEXT = '#f2f2ee';
export const FOOTER_BG = '#4a4a44';
export const FOOTER_TEXT = '#dcdcd6';
export const ENGAGE_BG = '#66665e';
export const NEWS_BG = '#c8c1aa';
export const ABOUT_BG = '#ece8da';
export const PROMO_BG = '#e6e9f4';
export const PROMO_PANEL = '#0d8ecf';

export const btnStyle = {
  display: 'inline-block',
  textAlign: 'center',
  color: TEXT_DARK,
  background: LIME,
  border: 'none',
  borderRadius: 6,
  padding: '13px 26px',
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 700,
  letterSpacing: '.05em',
  textTransform: 'uppercase',
  cursor: 'pointer',
};

export function chevronLinkStyle(color = '#fff') {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    color,
    fontWeight: 500,
    fontSize: 13.5,
    letterSpacing: '.09em',
    textTransform: 'uppercase',
  };
}

export function photoBox(imgUrl, extraStyle) {
  return imgUrl
    ? { backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', ...extraStyle }
    : { ...PH, ...extraStyle };
}

// Below-the-fold sections use a real <img loading="lazy"> instead of a CSS
// background-image, so the browser natively defers the fetch until the
// element is about to scroll into view.
export function LazyBgImage({ src, alt = '', style, children }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...(src ? {} : PH), ...style }}>
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      {children}
    </div>
  );
}
