'use client';

import { useCarousel } from './useCarousel';

const boxStyle = { background: '#eee', border: '1px solid #999', color: '#666' };
const btnStyle = {
  display: 'inline-block',
  padding: '0.5rem 1.25rem',
  background: '#ddd',
  border: '1px solid #333',
  color: '#111',
  fontWeight: 'bold',
  fontSize: '0.85rem',
};

const TOP_LINKS = ['Link', 'Link', 'Link', 'Link', 'Link', 'Link', 'Link', 'Link', 'Link'];
const NAV_LINKS = ['Nav 1', 'Nav 2', 'Nav 3', 'Nav 4', 'Nav 5', 'Nav 6'];
const FOOTER_COLUMNS = [
  { heading: 'Column 1', links: ['Link', 'Link', 'Link', 'Link'] },
  { heading: 'Column 2', links: ['Link', 'Link', 'Link', 'Link'] },
  { heading: 'Column 3', links: ['Link', 'Link'] },
];

export default function WireframeHome({ slides, inspiringCards, newsItems, slidesError, cardsError, postsError }) {
  const carousel = useCarousel(slides.length);

  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#111', background: '#fff' }}>
      {/* top utility bar */}
      <div style={{ background: '#333', color: '#fff', fontSize: '0.75rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '0.4rem 1.5rem' }}>
          {TOP_LINKS.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>

      {/* header */}
      <header style={{ borderBottom: '1px solid #ccc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <div style={{ ...boxStyle, width: 160, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Logo</div>
          <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {NAV_LINKS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* hero carousel — real slide content, wireframe chrome */}
      <section style={{ ...boxStyle, position: 'relative', minHeight: 360, overflow: 'hidden' }}>
        {slidesError && <p style={{ position: 'relative', color: '#900', padding: '0.5rem 1.5rem' }}>Hero slides: {slidesError}</p>}
        {slides.map((slide, n) => (
          <div key={n} style={{ position: 'absolute', inset: 0, opacity: n === carousel.i ? 1 : 0, transition: 'opacity 600ms ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.75rem', padding: '0 2rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{slide.heading}</div>
            <div style={{ maxWidth: 480, color: '#555' }}>{slide.body}</div>
            <span style={btnStyle}>{slide.cta}</span>
          </div>
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, display: 'flex', justifyContent: 'center', gap: '0.4rem', zIndex: 5 }}>
          {slides.map((_, n) => (
            <button key={n} type="button" onClick={() => carousel.go(n)} style={{ width: 8, height: 8, borderRadius: '50%', border: 0, padding: 0, background: n === carousel.i ? '#333' : '#bbb', cursor: 'pointer' }} />
          ))}
        </div>
      </section>

      {/* inspiring cards */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {cardsError && <p style={{ color: '#900' }}>Inspiring cards: {cardsError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {inspiringCards.map((card, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ ...boxStyle, width: 64, height: 64, margin: '0 auto 0.75rem', borderRadius: '50%' }} />
                <div style={{ fontWeight: 'bold', marginBottom: '0.4rem' }}>{card.heading}</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'underline' }}>{card.cta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* latest news — real WPGraphQL content */}
      <section style={{ background: '#f5f5f5', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ marginTop: 0 }}>Latest News</h2>
          {postsError && <p>Couldn't reach WPGraphQL: {postsError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {newsItems.map((post) => (
              <div key={post.url} style={{ ...boxStyle, padding: '1rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#111' }}>{post.title}</div>
                <div style={{ fontSize: '0.85rem' }}>{post.excerpt}</div>
              </div>
            ))}
          </div>
          {!postsError && newsItems.length === 0 && <p>No posts yet.</p>}
        </div>
      </section>

      {/* footer */}
      <footer style={{ background: '#222', color: '#ccc', padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}>
          <div style={{ ...boxStyle, width: 140, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Logo</div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.6rem', color: '#fff' }}>{col.heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                {col.links.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.6rem', color: '#fff' }}>Contact</div>
            <div>Address line</div>
            <div>Phone number</div>
            <div>Email address</div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '2rem auto 0', fontSize: '0.75rem', color: '#888' }}>
          Headless test build — wireframe mode.
        </div>
      </footer>
    </div>
  );
}
