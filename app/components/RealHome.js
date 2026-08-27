'use client';

import { useEffect, useState } from 'react';
import { useCarousel } from './useCarousel';

const PH = { backgroundImage: 'repeating-linear-gradient(135deg, rgba(33,37,41,.08) 0 8px, rgba(33,37,41,.03) 8px 16px)' };
const TEXT = '#212529';
const LIME = 'rgb(191, 215, 48)';

const btnStyle = {
  display: 'inline-block',
  textAlign: 'center',
  color: '#000',
  background: LIME,
  border: `1px solid ${LIME}`,
  borderRadius: 4,
  padding: '6px 24px',
  fontSize: 16,
  lineHeight: '24px',
  fontFamily: 'var(--font-alegreya), serif',
  fontWeight: 700,
  textTransform: 'uppercase',
};

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
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/miners_hardhats.webp', heading: 'About SME', body: 'Discover an association committed to the mining, mineral and underground construction industries.', href: 'https://www.smenet.org/aboutus', align: 'flex-end' },
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/mine-truck-driver-acf38xs-lo.webp', heading: 'Become a Member', body: 'Learn how you can meet your career goals with a membership in SME.', href: 'https://www.smenet.org/membership/benefits', align: 'flex-start' },
];

const SMALL_CARDS = [
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/dallin-holding-saovgeqmo00-unsplash.webp', heading: 'Mentor Students & Young Professionals', body: 'Make a positive impact the future generation of mining professionals.', cta: 'Find Out How', href: 'https://bit.ly/SMEMentoring' },
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/sparks.webp', heading: 'Connect on the SME Community', body: 'Communicate, share ideas, find resources, and talk to industry experts online.', cta: 'Connect Online', href: 'https://community.smenet.org/' },
  { img: 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/mine_worker.webp', heading: 'Why I SME', body: 'Meet the unique and varied members who comprise our industry.', cta: 'Read More', href: 'https://www.smenet.org/whyisme' },
];

const UTILITY_LINKS = [
  { label: 'Visit UCA', href: 'https://www.smenet.org/uca' },
  { label: 'Community', href: 'https://community.smenet.org/home' },
  { label: 'Join', href: 'https://www.smenet.org/membership/types' },
  { label: 'Store', href: 'https://store.smenet.org/' },
  { label: 'Events', href: 'https://www.smenet.org/events' },
  { label: 'Publications', href: 'https://me.smenet.org' },
  { label: 'Career Center', href: 'https://miningjobs.smenet.org' },
  { label: 'SME Foundation', href: 'https://smefoundation.org/' },
  { label: 'Membership Lookup', href: 'https://www.smenet.org/membership-benefits/membership-lookup' },
  { label: 'Cart', href: 'https://my.smenet.org/my-account/shopping-cart' },
  { label: 'Login', href: 'https://www.smenet.org/Account/SignIn' },
];

const NAV_LINKS = [
  { label: 'About Us', href: 'https://www.smenet.org/aboutus' },
  { label: 'Membership', href: 'https://www.smenet.org/membership/overview' },
  { label: 'Who We Serve', href: 'https://www.smenet.org/divisions' },
  { label: 'Professional Development', href: 'https://www.smenet.org/professional-development' },
  { label: 'Student Resources', href: 'https://www.smenet.org/studentresources' },
  { label: 'SME Studios', href: 'https://media.smenet.org/' },
];

const FOOTER_NAV = [
  { label: 'Donate', href: 'https://www.smenet.org/donate' },
  { label: 'Sign Up for eNews', href: 'https://www.smenet.org/enews-sign-up-form' },
  { label: 'Advertise/Sponsor', href: 'https://www.smenet.org/professional-development/publications/advertising-opportunities' },
  { label: 'Government Affairs', href: 'https://www.smenet.org/what-we-do/government-affairs' },
  { label: 'Mining Directory', href: 'https://miningdirectory.org' },
  { label: 'SME Brand Store', href: 'https://business.landsend.com/store/sme_apparel' },
  { label: 'Work for SME', href: 'https://www.smenet.org/what-we-do/our-values,-vision-and-mission/sme-career-opportunities' },
  { label: 'Privacy Policy', href: 'https://www.smenet.org/what-we-do/privacy-policy' },
  { label: 'Consent Preferences', href: '#' },
  { label: 'Contact Us', href: 'https://www.smenet.org/contact-us' },
];

const SOCIAL_LINKS = [
  { label: 'in', aria: 'LinkedIn', href: 'https://www.linkedin.com/company/society-for-mining-metallurgy-and-exploration' },
  { label: '●', aria: 'Flickr', href: 'https://flickr.com/photos/societyformining/albums' },
  { label: 'X', aria: 'X', href: 'https://twitter.com/smecommunity' },
  { label: 'f', aria: 'Facebook', href: 'https://www.facebook.com/SocietyForMining' },
  { label: '▶', aria: 'YouTube', href: 'https://www.youtube.com/user/SMESocietyForMining' },
  { label: '◎', aria: 'Instagram', href: 'https://www.instagram.com/smecommunity/' },
];

function photoBox(imgUrl, extraStyle) {
  return imgUrl
    ? { backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', ...extraStyle }
    : { ...PH, ...extraStyle };
}

export default function RealHome({ slides, inspiringCards, newsItems, slidesError, cardsError, postsError }) {
  const carousel = useCarousel(slides.length);

  // Only fetch the background photo for a slide once it's actually been shown,
  // instead of loading all of them up front — this is what was blowing up LCP.
  const [loadedSlides, setLoadedSlides] = useState(() => new Set([0]));
  useEffect(() => {
    setLoadedSlides((prev) => (prev.has(carousel.i) ? prev : new Set(prev).add(carousel.i)));
  }, [carousel.i]);

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* utility bar */}
      <div style={{ background: '#000', color: '#fff' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', minHeight: 44 }}>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: 'auto' }}>
            <select style={{ fontSize: 12.8, color: '#212529', border: '1px solid #fff', borderRight: 0, borderRadius: '4px 0 0 4px', padding: '5px 8px', background: '#fff', height: 30 }}>
              <option>All Types</option>
              <option>Books</option>
              <option>eBooks</option>
              <option>Videos</option>
              <option>Audio</option>
              <option>Podcasts</option>
              <option>Recorded Webinars</option>
              <option>Articles</option>
            </select>
            <input type="search" placeholder="Search" style={{ fontSize: 12.8, color: '#212529', border: '1px solid #fff', borderRadius: 0, padding: '5px 10px', height: 30, width: 150, outline: 'none' }} />
            <button type="submit" style={{ fontSize: 12.8, color: '#000', background: LIME, border: '1px solid #fff', borderLeft: 0, borderRadius: '0 4px 4px 0', padding: '5px 14px', height: 30, cursor: 'pointer', fontWeight: 'bold' }}>Go</button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12.8, lineHeight: '19.2px' }}>
            {UTILITY_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{ color: '#fff' }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* hero carousel with masthead overlaid on top, matching the real site's layered header */}
      <section style={{ position: 'relative', background: '#c1cfe3', minHeight: 480, overflow: 'hidden' }}>
        <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(0,0,0,0.5)' }}>
          <nav style={{ maxWidth: 1140, margin: '0 auto', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <a href="https://www.smenet.org/" style={{ flex: '0 0 auto', padding: '6px 0' }}>
              <img src="https://smenet.blob.core.windows.net/smecms/sme/media/sme/logos/sme-horz-white.png" alt="Society for Mining, Metallurgy, and Exploration" width={214} height={52} style={{ display: 'block', height: 52, width: 'auto' }} />
            </a>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', flex: '1 1 auto' }}>
              {NAV_LINKS.map((l) => (
                <li key={l.label} style={{ padding: '10px clamp(10px, 1.6vw, 20px)' }}>
                  <a href={l.href} style={{ color: '#fff', fontSize: 12.8, lineHeight: '19.2px' }}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {slidesError && <p style={{ position: 'relative', zIndex: 11, color: '#900', background: '#fff', padding: 8, marginTop: 98 }}>Hero slides: {slidesError}</p>}
        {slides.map((slide, n) => (
          <div key={n} style={{ position: 'absolute', inset: 0, opacity: n === carousel.i ? 1 : 0, transition: 'opacity 600ms ease', pointerEvents: n === carousel.i ? 'auto' : 'none', zIndex: n === carousel.i ? 2 : 1 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: slide.bg, ...(loadedSlides.has(n) ? photoBox(slide.img || heroImageFor(slide.heading)) : {}) }} />
            <div style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '56px 15px', height: '100%', minHeight: 480, display: 'flex', alignItems: 'center' }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 40, maxWidth: 620, boxShadow: '0 2px 12px rgba(0,0,0,.18)' }}>
                <h1 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 32, lineHeight: '38.4px', fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>{slide.heading}</h1>
                <h3 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 20, lineHeight: '24px', fontWeight: 500, color: TEXT, margin: '0 0 20px' }}>{slide.body}</h3>
                <a href={slide.href} style={btnStyle}>{slide.cta}</a>
              </div>
            </div>
          </div>
        ))}

        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, display: 'flex', justifyContent: 'center', gap: 10, zIndex: 5 }}>
          {slides.map((_, n) => (
            <button key={n} type="button" aria-label={`Slide ${n + 1}`} onClick={() => carousel.go(n)} style={{ width: 30, height: 4, border: 0, padding: 0, background: n === carousel.i ? LIME : 'rgba(255,255,255,.6)', cursor: 'pointer' }} />
          ))}
        </div>
        <button type="button" aria-label="Previous slide" onClick={() => carousel.go(carousel.i - 1)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 38, height: 38, border: `1px solid ${TEXT}`, borderRadius: 4, background: 'rgba(255,255,255,.8)', color: TEXT, fontSize: 18, cursor: 'pointer' }}>&#8249;</button>
        <button type="button" aria-label="Next slide" onClick={() => carousel.go(carousel.i + 1)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 38, height: 38, border: `1px solid ${TEXT}`, borderRadius: 4, background: 'rgba(255,255,255,.8)', color: TEXT, fontSize: 18, cursor: 'pointer' }}>&#8250;</button>
      </section>

      {/* inspiring band + 3 link cards */}
      <section style={{ background: '#f6fbfd', padding: '48px 0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px' }}>
          <h3 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 20, lineHeight: '24px', fontWeight: 500, color: TEXT, margin: '0 0 24px', textAlign: 'center' }}>SME. Inspiring Mining Professionals Worldwide.</h3>
          {cardsError && <p style={{ color: '#900' }}>Inspiring cards: {cardsError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
            {inspiringCards.map((card, idx) => (
              <article key={idx} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={photoBox(card.img || CARD_IMAGES[card.label], { height: 180, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 })}>
                  {!card.img && !CARD_IMAGES[card.label] && <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#666' }}>{card.label}</span>}
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                  <h4 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, color: TEXT, margin: 0 }}>{card.heading}</h4>
                  <a href={card.href} style={{ ...btnStyle, alignSelf: 'flex-start', marginTop: 'auto' }}>{card.cta}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* latest news — real WPGraphQL content */}
      <section style={{ background: '#fff', padding: '48px 0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px' }}>
          <h1 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 32, lineHeight: '38.4px', fontWeight: 500, color: TEXT, margin: '0 0 24px' }}>Latest News</h1>
          {postsError && <p style={{ color: TEXT }}>Couldn't reach WPGraphQL: {postsError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
            {newsItems.map((post) => (
              <article key={post.url} style={{ background: '#fff', borderRadius: 10, minHeight: 300, overflow: 'hidden', border: '1px solid rgba(0,0,0,.12)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ ...PH, height: 170, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#666' }}>featured image</span>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <a href={post.url} style={{ fontSize: 13.6, lineHeight: '20.4px', fontWeight: 300, color: TEXT }}>{post.date}</a>
                  <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, margin: '0 0 8px' }}>
                    <a href={post.url} style={{ color: TEXT }}>{post.title}</a>
                  </h2>
                  <p style={{ margin: '0 0 16px', color: TEXT, fontSize: 16, lineHeight: '24px', flex: 1 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <a href={post.url} style={btnStyle}>Read More</a>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a href={post.tweetUrl} aria-label="Share on X" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${TEXT}`, color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>X</a>
                      <a href={post.linkedInUrl} aria-label="Share on LinkedIn" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${TEXT}`, color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>in</a>
                      <a href={post.facebookUrl} aria-label="Share on Facebook" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${TEXT}`, color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>f</a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!postsError && newsItems.length === 0 && <p style={{ color: TEXT }}>No posts yet.</p>}
        </div>
      </section>

      {/* about / member split */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        {SPLIT_CARDS.map((card) => (
          <div key={card.heading} style={{ position: 'relative', minHeight: 340, display: 'flex', alignItems: 'center' }}>
            <div style={photoBox(card.img, { position: 'absolute', inset: 0 })} />
            <div style={{ position: 'relative', padding: '48px 40px', maxWidth: 540, marginLeft: card.align === 'flex-end' ? 'auto' : undefined, marginRight: card.align === 'flex-start' ? 'auto' : undefined }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 32 }}>
                <h1 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 32, lineHeight: '38.4px', fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>{card.heading}</h1>
                <p style={{ margin: '0 0 16px', color: TEXT, fontSize: 16, lineHeight: '24px' }}>{card.body}</p>
                <a href={card.href} style={btnStyle}>Read More</a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* three small cards */}
      <section style={{ background: '#f6fbfd', padding: '48px 0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
          {SMALL_CARDS.map((card) => (
            <article key={card.heading} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={photoBox(card.img, { height: 140 })} />
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <h5 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 17.6, lineHeight: '21.12px', fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>{card.heading}</h5>
                <p style={{ margin: '0 0 16px', color: TEXT, fontSize: 16, lineHeight: '24px', flex: 1 }}>{card.body}</p>
                <a href={card.href} style={{ ...btnStyle, alignSelf: 'flex-start' }}>{card.cta}</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer style={{ backgroundImage: 'linear-gradient(90deg, #e7faf5 0%, #d6ecf8 100%)', color: TEXT, fontSize: 12, lineHeight: '18px', fontWeight: 300, padding: 24 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '24px 15px', display: 'grid', gridTemplateColumns: 'minmax(260px, 1.2fr) repeat(2, minmax(200px, 1fr))', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <img src="https://smenet.blob.core.windows.net/smecms/sme/media/sme/logos/sme_full-large-min.png" alt="Society for Mining, Metallurgy, and Exploration" width={210} height={127} style={{ width: 210, maxWidth: '100%', height: 'auto' }} />
            <p style={{ margin: '0 0 8px', color: TEXT, fontSize: 16, lineHeight: '24px', fontWeight: 400 }}>Inspiring Mining Professionals Worldwide</p>
            <div style={{ fontSize: 13.6, lineHeight: '20.4px' }}>© 2026 SME All Rights Reserved. SME is a member society of OneMine, the SME Foundation, and the American Institute of Mining, Metallurgical, and Petroleum Engineers (AIME).</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.aria} href={s.href} aria-label={s.aria} style={{ width: 30, height: 30, borderRadius: 4, border: `1px solid ${TEXT}`, color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{s.label}</a>
              ))}
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 20, lineHeight: '24px', fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>Navigation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.6, lineHeight: '20.4px' }}>
              {FOOTER_NAV.map((l) => (
                <a key={l.label} href={l.href} style={{ color: TEXT }}>{l.label}</a>
              ))}
            </div>
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 20, lineHeight: '24px', fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>Contacts</h3>
            <p style={{ margin: '0 0 16px', color: TEXT, fontSize: 13.6, lineHeight: '20.4px' }}>12999 E Adam Aircraft Circle<br />Englewood, CO 80112</p>
            <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, margin: '0 0 8px' }}><a href="tel:+13039484200" style={{ color: TEXT }}>+1 (303) 948 4200</a></h2>
            <p style={{ margin: '0 0 16px', fontSize: 13.6, lineHeight: '20.4px' }}><a href="mailto:cs@smenet.org" style={{ color: TEXT }}>cs@smenet.org</a></p>
            <p style={{ margin: '0 0 8px', color: TEXT, fontSize: 13.6, lineHeight: '20.4px' }}>For book information:</p>
            <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, margin: '0 0 8px' }}><a href="tel:+13039484237" style={{ color: TEXT }}>+1 (303) 948 4237</a></h2>
            <p style={{ margin: 0, fontSize: 13.6, lineHeight: '20.4px' }}><a href="mailto:books@smenet.org" style={{ color: TEXT }}>books@smenet.org</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
