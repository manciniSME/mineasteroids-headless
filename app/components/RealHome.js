'use client';

import { useEffect, useState } from 'react';
import { useCarousel } from './useCarousel';
import UtilityBar from './UtilityBar';
import SiteMasthead from './SiteMasthead';
import SiteFooter from './SiteFooter';
import {
  PH, BLUE, LIME, TEXT_DARK, TEXT_BODY,
  ENGAGE_BG, NEWS_BG, ABOUT_BG, PROMO_BG, PROMO_PANEL,
  btnStyle, chevronLinkStyle, photoBox, LazyBgImage,
} from './theme';

const HERO_IMAGE_BASE = 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/hero%20slider/';
const HERO_IMAGES = [
  { match: 'Engineering Career', url: `${HERO_IMAGE_BASE}0524_pe-review.webp` },
  { match: 'Book Lovers Day', url: `${HERO_IMAGE_BASE}0826_sme_books.webp` },
  { match: 'Ground Control', url: `${HERO_IMAGE_BASE}0526_sme_groundcontrol.webp` },
  { match: 'Mineral Usage Statistics', url: `${HERO_IMAGE_BASE}0826_sme_mineralbaby.webp` },
];
function heroImageFor(heading) {
  return HERO_IMAGES.find((h) => heading && heading.includes(h.match))?.url ?? null;
}

const CARD_IMAGES = {
  'volunteer photo': 'https://smenet.blob.core.windows.net/smecms/sme/media/smeazurestorage/homepage/sme_volunteer1.png',
  'webinar photo': 'https://smenet.blob.core.windows.net/smecms/sme/media/smeazurestorage/homepage/sme_webinars.png',
  'studios photo': 'https://www.smenet.org/getattachment/01f7274a-e8a7-40d3-af2e-834c4c093d44/SME-Studios.png?lang=en-US&width=300&height=250&ext=.png',
};

const SPLIT_CARDS = [
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/miners_hardhats.webp', heading: 'About SME', body: 'Discover an association committed to the mining, mineral and underground construction industries.', href: 'https://www.smenet.org/aboutus' },
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/mine-truck-driver-acf38xs-lo.webp', heading: 'Become a Member', body: 'Learn how you can meet your career goals with a membership in SME.', href: 'https://www.smenet.org/membership/benefits' },
];

const SMALL_CARDS = [
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/dallin-holding-saovgeqmo00-unsplash.webp', heading: 'Mentor Students & Young Professionals', body: 'Make a positive impact the future generation of mining professionals.', cta: 'Find Out How', href: 'https://bit.ly/SMEMentoring' },
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/sparks.webp', heading: 'Connect on the SME Community', body: 'Communicate, share ideas, find resources, and talk to industry experts online.', cta: 'Connect Online', href: 'https://community.smenet.org/' },
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/mine_worker.webp', heading: 'Why I SME', body: 'Meet the unique and varied members who comprise our industry.', cta: 'Read More', href: 'https://www.smenet.org/whyisme' },
];

export default function RealHome({ slides, inspiringCards, newsItems, slidesError, cardsError, postsError, loginInfo, onAuthChange }) {
  const carousel = useCarousel(slides.length);

  // Only fetch the background photo for a slide once it's actually been shown,
  // instead of loading all of them up front — this is what was blowing up LCP.
  const [loadedSlides, setLoadedSlides] = useState(() => new Set([0]));
  useEffect(() => {
    setLoadedSlides((prev) => (prev.has(carousel.i) ? prev : new Set(prev).add(carousel.i)));
  }, [carousel.i]);

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <UtilityBar loginInfo={loginInfo} onAuthChange={onAuthChange} />

      {/* hero carousel with mega-menu masthead overlaid on top */}
      <section style={{ position: 'relative', background: '#3a3a35', minHeight: 600, overflow: 'hidden' }}>
        <SiteMasthead />

        {slidesError && <p style={{ position: 'relative', zIndex: 11, color: '#900', background: '#fff', padding: 8, marginTop: 120 }}>Hero slides: {slidesError}</p>}
        {slides.map((slide, n) => (
          <div key={n} style={{ position: 'absolute', inset: 0, opacity: n === carousel.i ? 1 : 0, transition: 'opacity 600ms ease', pointerEvents: n === carousel.i ? 'auto' : 'none', zIndex: n === carousel.i ? 2 : 1 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: slide.bg, ...(loadedSlides.has(n) ? photoBox(slide.img || heroImageFor(slide.heading)) : {}) }} />
            <div style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '128px 15px 56px', height: '100%', minHeight: 600, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 'min(560px, 100%)', background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(3px)', borderTop: `4px solid ${BLUE}`, borderRadius: 10, padding: '30px 34px 34px', boxShadow: '0 6px 24px rgba(0,0,0,.28)' }}>
                <h1 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 32, lineHeight: 1.15, fontWeight: 700, color: BLUE, margin: '0 0 16px' }}>{slide.heading}</h1>
                <p style={{ fontSize: 17, lineHeight: 1.42, color: TEXT_BODY, margin: '0 0 24px' }}>{slide.body}</p>
                <a href={slide.href} style={btnStyle}>{slide.cta}</a>
              </div>
            </div>
          </div>
        ))}

        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', gap: 12, zIndex: 5 }}>
          {slides.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Slide ${n + 1}`}
              onClick={() => carousel.go(n)}
              style={{ width: 15, height: 15, borderRadius: '50%', border: 0, padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.35)', cursor: 'pointer' }}
            >
              {n === carousel.i && <span style={{ width: 7, height: 7, borderRadius: '50%', background: LIME, display: 'block' }} />}
            </button>
          ))}
        </div>
        <button type="button" aria-label="Previous slide" onClick={() => carousel.go(carousel.i - 1)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 38, height: 38, border: '1px solid rgba(255,255,255,.7)', borderRadius: 4, background: 'rgba(0,0,0,.25)', color: '#fff', fontSize: 18, cursor: 'pointer' }}>&#8249;</button>
        <button type="button" aria-label="Next slide" onClick={() => carousel.go(carousel.i + 1)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 38, height: 38, border: '1px solid rgba(255,255,255,.7)', borderRadius: 4, background: 'rgba(0,0,0,.25)', color: '#fff', fontSize: 18, cursor: 'pointer' }}>&#8250;</button>
      </section>

      {/* inspiring band + 3 promo tiles */}
      <section style={{ background: PROMO_BG, padding: '48px 0 56px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px' }}>
          <h3 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 30, fontWeight: 400, color: BLUE, margin: '0 0 30px', textAlign: 'center' }}>SME. Inspiring Mining Professionals Worldwide.</h3>
          {cardsError && <p style={{ color: '#900' }}>Inspiring cards: {cardsError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
            {inspiringCards === null
              ? // Deliberately no build-time content to show here yet — see
                // HomeClient's note on this section. A same-sized skeleton
                // avoids a layout jump once the live data replaces it a
                // moment later, without ever risking showing a card that
                // isn't actually published yet.
                [0, 1, 2].map((i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 240, ...PH }} />
                    <div style={{ background: PROMO_PANEL, padding: '26px 26px 30px', height: 104 }} />
                  </div>
                ))
              : inspiringCards.map((card, idx) => (
                  <article key={idx} style={{ borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <LazyBgImage src={card.img || CARD_IMAGES[card.label]} alt={card.heading} style={{ height: 240, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 }}>
                      {!card.img && !CARD_IMAGES[card.label] && <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#666' }}>{card.label}</span>}
                    </LazyBgImage>
                    <div style={{ background: PROMO_PANEL, padding: '26px 26px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, flex: 1 }}>
                      <h4 style={{ fontSize: 19, lineHeight: 1.32, fontWeight: 700, color: '#fff', textAlign: 'center', margin: 0 }}>{card.heading}</h4>
                      <a href={card.href} style={{ ...btnStyle, marginTop: 'auto' }}>{card.cta}</a>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* latest news — real WPGraphQL content, restyled onto the tan band */}
      <section
        style={{
          backgroundColor: NEWS_BG,
          backgroundImage:
            'radial-gradient(ellipse 900px 220px at 12% 40%, rgba(255,255,255,.30) 0 1px, transparent 1px 3px), radial-gradient(ellipse 1200px 300px at 55% 65%, rgba(255,255,255,.26) 0 1px, transparent 1px 3px), radial-gradient(ellipse 700px 180px at 85% 30%, rgba(255,255,255,.28) 0 1px, transparent 1px 3px)',
          padding: '54px 0 60px',
        }}
      >
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px' }}>
          <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 36, fontWeight: 400, color: TEXT_DARK, margin: '0 0 30px', textAlign: 'center' }}>Latest News</h2>
          {postsError && <p style={{ color: TEXT_DARK, textAlign: 'center' }}>Couldn't reach WPGraphQL: {postsError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
            {newsItems.map((post) => (
              <article key={post.url} style={{ background: '#fff', borderRadius: 10, minHeight: 300, overflow: 'hidden', boxShadow: '0 3px 12px rgba(0,0,0,.14)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ ...PH, height: 170, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#666' }}>featured image</span>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <a href={post.url} style={{ fontSize: 13.6, lineHeight: '20.4px', fontWeight: 300, color: TEXT_DARK }}>{post.date}</a>
                  <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, margin: '0 0 8px' }}>
                    <a href={post.url} style={{ color: BLUE }}>{post.title}</a>
                  </h2>
                  <p style={{ margin: '0 0 16px', color: TEXT_DARK, fontSize: 16, lineHeight: '24px', flex: 1 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <a href={post.url} style={btnStyle}>Read More</a>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a href={post.tweetUrl} aria-label="Share on X" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${TEXT_DARK}`, color: TEXT_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>X</a>
                      <a href={post.linkedInUrl} aria-label="Share on LinkedIn" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${TEXT_DARK}`, color: TEXT_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>in</a>
                      <a href={post.facebookUrl} aria-label="Share on Facebook" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${TEXT_DARK}`, color: TEXT_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>f</a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!postsError && newsItems.length === 0 && <p style={{ color: TEXT_DARK, textAlign: 'center' }}>No posts yet.</p>}
        </div>
      </section>

      {/* about / member split — dark photo cards on a cream textured band */}
      <section
        style={{
          backgroundColor: ABOUT_BG,
          backgroundImage:
            'radial-gradient(ellipse 1100px 280px at 20% 25%, rgba(255,255,255,.55) 0 1px, transparent 1px 3px), radial-gradient(ellipse 900px 240px at 70% 60%, rgba(255,255,255,.5) 0 1px, transparent 1px 3px)',
          padding: '48px 0 56px',
        }}
      >
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
          {SPLIT_CARDS.map((card) => (
            <LazyBgImage
              key={card.heading}
              src={card.img}
              alt={card.heading}
              style={{ position: 'relative', minHeight: 380, borderRadius: 12, borderTop: `7px solid ${LIME}`, boxShadow: '0 3px 12px rgba(0,0,0,.18)' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(24,24,20,.78) 0%, rgba(24,24,20,.45) 55%, rgba(24,24,20,.18) 100%)' }} />
              <div style={{ position: 'relative', padding: '40px 44px', maxWidth: 420, color: '#fff' }}>
                <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 36, fontWeight: 400, margin: '0 0 20px' }}>{card.heading}</h2>
                <p style={{ fontSize: 19, lineHeight: 1.36, fontWeight: 300, margin: '0 0 26px' }}>{card.body}</p>
                <a href={card.href} style={chevronLinkStyle()}>Read More <span style={{ color: LIME, fontSize: 18 }}>&#8250;</span></a>
              </div>
            </LazyBgImage>
          ))}
        </div>
      </section>

      {/* three engagement cards on a dark band */}
      <section style={{ background: ENGAGE_BG, padding: '46px 0 56px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
          {SMALL_CARDS.map((card) => (
            <LazyBgImage
              key={card.heading}
              src={card.img}
              alt={card.heading}
              style={{ position: 'relative', minHeight: 300, borderRadius: 12 }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(20,20,18,.62) 0%, rgba(20,20,18,.34) 100%)' }} />
              <div style={{ position: 'relative', padding: '30px 30px 34px', color: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h5 style={{ fontSize: 22, lineHeight: 1.24, fontWeight: 400, margin: '0 0 14px' }}>{card.heading}</h5>
                <p style={{ fontSize: 15, lineHeight: 1.5, fontWeight: 300, margin: '0 0 22px' }}>{card.body}</p>
                <a href={card.href} style={{ ...chevronLinkStyle(), marginTop: 'auto' }}>{card.cta} <span style={{ color: LIME, fontSize: 17 }}>&#8250;</span></a>
              </div>
            </LazyBgImage>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
