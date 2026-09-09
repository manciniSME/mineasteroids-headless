'use client';

import { FOOTER_BG, FOOTER_TEXT, LIME } from './theme';
import { FOOTER_NAV, SOCIAL_LINKS } from './nav-data';

export default function SiteFooter() {
  return (
    <footer style={{ background: FOOTER_BG, color: FOOTER_TEXT, fontSize: 12, lineHeight: '18px', fontWeight: 300, padding: 24 }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '24px 15px', display: 'grid', gridTemplateColumns: 'minmax(260px, 1.2fr) repeat(2, minmax(200px, 1fr))', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <img src="https://smenet.blob.core.windows.net/smecms/sme/media/sme/logos/sme_full-large-min.png" alt="Society for Mining, Metallurgy, and Exploration" width={210} height={127} style={{ width: 210, maxWidth: '100%', height: 'auto' }} />
          <p style={{ margin: '0 0 8px', color: '#fff', fontFamily: 'var(--font-alegreya), serif', fontSize: 17, lineHeight: '24px', fontWeight: 400 }}>Inspiring Mining Professionals Worldwide</p>
          <div style={{ fontSize: 13.6, lineHeight: '20.4px' }}>© 2026 SME All Rights Reserved. SME is a member society of OneMine, the SME Foundation, and the American Institute of Mining, Metallurgical, and Petroleum Engineers (AIME).</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {SOCIAL_LINKS.map((s) => (
              <a key={s.aria} href={s.href} aria-label={s.aria} style={{ width: 30, height: 30, borderRadius: 4, border: `1px solid #767670`, color: FOOTER_TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{s.label}</a>
            ))}
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 20, lineHeight: '24px', fontWeight: 400, color: '#fff', margin: '0 0 8px' }}>Navigation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.6, lineHeight: '20.4px' }}>
            {FOOTER_NAV.map((l) => (
              <a key={l.label} href={l.href} style={{ color: FOOTER_TEXT }}>{l.label}</a>
            ))}
          </div>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 20, lineHeight: '24px', fontWeight: 400, color: '#fff', margin: '0 0 8px' }}>Contacts</h3>
          <p style={{ margin: '0 0 16px', color: FOOTER_TEXT, fontSize: 13.6, lineHeight: '20.4px' }}>12999 E Adam Aircraft Circle<br />Englewood, CO 80112</p>
          <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 400, margin: '0 0 8px' }}><a href="tel:+13039484200" style={{ color: '#fff' }}>+1 (303) 948 4200</a></h2>
          <p style={{ margin: '0 0 16px', fontSize: 13.6, lineHeight: '20.4px' }}><a href="mailto:cs@smenet.org" style={{ color: LIME }}>cs@smenet.org</a></p>
          <p style={{ margin: '0 0 8px', color: FOOTER_TEXT, fontSize: 13.6, lineHeight: '20.4px' }}>For book information:</p>
          <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 400, margin: '0 0 8px' }}><a href="tel:+13039484237" style={{ color: '#fff' }}>+1 (303) 948 4237</a></h2>
          <p style={{ margin: 0, fontSize: 13.6, lineHeight: '20.4px' }}><a href="mailto:books@smenet.org" style={{ color: LIME }}>books@smenet.org</a></p>
        </div>
      </div>
    </footer>
  );
}
