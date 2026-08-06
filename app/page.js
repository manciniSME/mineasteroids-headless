'use client';

import { useEffect, useRef, useState } from 'react';
import { wpFetch } from '../lib/wpgraphql';

const POSTS_QUERY = `
  query GetPosts {
    posts(first: 3) {
      nodes {
        id
        title
        excerpt
        date
        link
      }
    }
  }
`;

const PH = { backgroundImage: 'repeating-linear-gradient(135deg, rgba(94,127,177,.10) 0 8px, rgba(94,127,177,.04) 8px 16px)' };
const BLUE = '#5e7fb1';
const BLUE_DARK = '#45618c';

const btnStyle = {
  display: 'inline-block',
  textAlign: 'center',
  color: '#fff',
  background: BLUE,
  border: `1px solid ${BLUE}`,
  borderRadius: 4,
  padding: '6px 24px',
  fontSize: 16,
  lineHeight: '24px',
};

const SLIDES = [
  {
    bg: '#c1cfe3',
    heading: 'Take the Next Step in Your Engineering Career',
    body: 'Our PE Review Course covers each of the examination subject topics, terminology, concepts and also provides a multitude of information and resources.',
    cta: 'Register Now',
    href: 'https://smepereviewcourse.org/',
  },
  {
    bg: '#c8d6e6',
    heading: 'Celebrating National Book Lovers Day',
    body: 'Save 20% off SME Books through August 15 when you use code BookLover26 at checkout.',
    cta: 'Find Your Next Title',
    href: 'https://store.smenet.org/',
  },
  {
    bg: '#bdd0dd',
    heading: 'Discover Research and Advances at Ground Control',
    body: 'Join us at the 45th Ground Control Conference and experience an event dedicated to research and advances in ground control in mining.',
    cta: 'Register Now',
    href: 'https://groundcontrolmining.org/',
  },
  {
    bg: '#cdd8e4',
    heading: 'Discover the Latest Mineral Usage Statistics',
    body: 'The 2026 MEC Mineral Baby estimates the average American born this year will need 3.01 million pounds of minerals, metals, and fuels in their lifetime.',
    cta: 'Learn More',
    href: 'https://mineralseducationcoalition.org/mining-mineral-statistics',
  },
];

const INSPIRING_CARDS = [
  { label: 'volunteer photo', bg: '#e4edf4', heading: 'Learn how to get involved with SME.', cta: 'Volunteer Opportunities', href: 'https://www.smenet.org/volunteer' },
  { label: 'webinar photo', bg: '#e4edf4', heading: 'Search the webinar library for live online learning or on-demand.', cta: 'Shop Now', href: 'https://store.smenet.org/21qjg8c' },
  { label: 'studios photo', bg: '#e4edf4', heading: 'NEW videos added - conference lectures and podcasts now available.', cta: 'Watch Now', href: 'https://media.smenet.org' },
];

const SPLIT_CARDS = [
  { bg: '#c1cfe3', heading: 'About SME', body: 'Discover an association committed to the mining, mineral and underground construction industries.', href: 'https://www.smenet.org/aboutus', align: 'flex-end' },
  { bg: '#cdd8e4', heading: 'Become a Member', body: 'Learn how you can meet your career goals with a membership in SME.', href: 'https://www.smenet.org/membership/benefits', align: 'flex-start' },
];

const SMALL_CARDS = [
  { heading: 'Mentor Students & Young Professionals', body: 'Make a positive impact the future generation of mining professionals.', cta: 'Find Out How', href: 'https://bit.ly/SMEMentoring' },
  { heading: 'Connect on the SME Community', body: 'Communicate, share ideas, find resources, and talk to industry experts online.', cta: 'Connect Online', href: 'https://community.smenet.org/' },
  { heading: 'Why I SME', body: 'Meet the unique and varied members who comprise our industry.', cta: 'Read More', href: 'https://www.smenet.org/whyisme' },
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

const clamp = (s, n) => (s.length > n ? s.slice(0, n).trimEnd() + '…' : s);

function useCarousel(count, intervalMs = 6000) {
  const [i, setI] = useState(0);
  const timer = useRef(null);

  const go = (n) => setI(((n % count) + count) % count);

  const start = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => go(i + 1), intervalMs);
  };

  useEffect(() => {
    start();
    return () => clearInterval(timer.current);
  }, [i]);

  return { i, go, start };
}

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const carousel = useCarousel(SLIDES.length);

  useEffect(() => {
    wpFetch(POSTS_QUERY)
      .then((data) => setPosts(data?.posts?.nodes ?? []))
      .catch((err) => setFetchError(err.message));
  }, []);

  const newsItems = posts.map((p) => ({
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    title: clamp(p.title, 58),
    excerpt: p.excerpt.replace(/<[^>]+>/g, ''),
    url: p.link,
    tweetUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(p.link)}&text=${encodeURIComponent(p.title)}`,
    linkedInUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(p.link)}`,
    facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(p.link)}`,
  }));

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* utility bar */}
      <div style={{ background: BLUE_DARK, color: '#fff' }}>
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
            <button type="submit" style={{ fontSize: 12.8, color: '#fff', background: BLUE, border: '1px solid #fff', borderLeft: 0, borderRadius: '0 4px 4px 0', padding: '5px 14px', height: 30, cursor: 'pointer' }}>Go</button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12.8, lineHeight: '19.2px' }}>
            {UTILITY_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{ color: '#fff' }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* masthead */}
      <header style={{ background: BLUE }}>
        <nav style={{ maxWidth: 1140, margin: '0 auto', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <a href="https://www.smenet.org/" style={{ flex: '0 0 auto', padding: '6px 0' }}>
            <img src="https://smenet.blob.core.windows.net/smecms/sme/media/sme/logos/sme-horz-white.png" alt="Society for Mining, Metallurgy, and Exploration" style={{ display: 'block', height: 52, width: 'auto' }} />
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

      {/* hero carousel */}
      <section style={{ position: 'relative', background: '#c1cfe3', minHeight: 480, overflow: 'hidden' }}>
        {SLIDES.map((slide, n) => (
          <div key={n} style={{ position: 'absolute', inset: 0, opacity: n === carousel.i ? 1 : 0, transition: 'opacity 600ms ease', pointerEvents: n === carousel.i ? 'auto' : 'none', zIndex: n === carousel.i ? 2 : 1 }}>
            <div style={{ ...PH, position: 'absolute', inset: 0, backgroundColor: slide.bg }} />
            <div style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '56px 15px', height: '100%', minHeight: 480, display: 'flex', alignItems: 'center' }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 40, maxWidth: 620, boxShadow: '0 2px 12px rgba(94,127,177,.18)' }}>
                <h1 style={{ fontFamily: 'Alegreya, serif', fontSize: 32, lineHeight: '38.4px', fontWeight: 500, color: BLUE, margin: '0 0 8px' }}>{slide.heading}</h1>
                <h3 style={{ fontFamily: 'Alegreya, serif', fontSize: 20, lineHeight: '24px', fontWeight: 500, color: BLUE, margin: '0 0 20px' }}>{slide.body}</h3>
                <a href={slide.href} style={btnStyle}>{slide.cta}</a>
              </div>
            </div>
          </div>
        ))}

        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, display: 'flex', justifyContent: 'center', gap: 10, zIndex: 5 }}>
          {SLIDES.map((_, n) => (
            <button key={n} type="button" aria-label={`Slide ${n + 1}`} onClick={() => carousel.go(n)} style={{ width: 30, height: 4, border: 0, padding: 0, background: n === carousel.i ? BLUE : 'rgba(94,127,177,.35)', cursor: 'pointer' }} />
          ))}
        </div>
        <button type="button" aria-label="Previous slide" onClick={() => carousel.go(carousel.i - 1)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 38, height: 38, border: `1px solid ${BLUE}`, borderRadius: 4, background: 'rgba(255,255,255,.8)', color: BLUE, fontSize: 18, cursor: 'pointer' }}>&#8249;</button>
        <button type="button" aria-label="Next slide" onClick={() => carousel.go(carousel.i + 1)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 5, width: 38, height: 38, border: `1px solid ${BLUE}`, borderRadius: 4, background: 'rgba(255,255,255,.8)', color: BLUE, fontSize: 18, cursor: 'pointer' }}>&#8250;</button>
      </section>

      {/* inspiring band + 3 link cards */}
      <section style={{ background: '#f6fbfd', padding: '48px 0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px' }}>
          <h3 style={{ fontFamily: 'Alegreya, serif', fontSize: 20, lineHeight: '24px', fontWeight: 500, color: BLUE, margin: '0 0 24px', textAlign: 'center' }}>SME. Inspiring Mining Professionals Worldwide.</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
            {INSPIRING_CARDS.map((card) => (
              <article key={card.heading} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ ...PH, height: 180, backgroundColor: card.bg, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#7a90b2' }}>{card.label}</span>
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                  <h4 style={{ fontFamily: 'Alegreya, serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, color: BLUE, margin: 0 }}>{card.heading}</h4>
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
          <h1 style={{ fontFamily: 'Alegreya, serif', fontSize: 32, lineHeight: '38.4px', fontWeight: 500, color: BLUE, margin: '0 0 24px' }}>Latest News</h1>
          {fetchError && <p style={{ color: BLUE }}>Couldn't reach WPGraphQL: {fetchError}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
            {newsItems.map((post) => (
              <article key={post.url} style={{ background: '#fff', borderRadius: 10, minHeight: 300, overflow: 'hidden', border: '1px solid rgba(94,127,177,.2)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ ...PH, height: 170, backgroundColor: '#e4edf4', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 8 }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#7a90b2' }}>featured image</span>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <a href={post.url} style={{ fontSize: 13.6, lineHeight: '20.4px', fontWeight: 300, color: BLUE }}>{post.date}</a>
                  <h2 style={{ fontFamily: 'Alegreya, serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, margin: '0 0 8px' }}>
                    <a href={post.url} style={{ color: BLUE }}>{post.title}</a>
                  </h2>
                  <p style={{ margin: '0 0 16px', color: BLUE, fontSize: 16, lineHeight: '24px', flex: 1 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <a href={post.url} style={btnStyle}>Read More</a>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <a href={post.tweetUrl} aria-label="Share on X" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${BLUE}`, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>X</a>
                      <a href={post.linkedInUrl} aria-label="Share on LinkedIn" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${BLUE}`, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>in</a>
                      <a href={post.facebookUrl} aria-label="Share on Facebook" style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${BLUE}`, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>f</a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!fetchError && newsItems.length === 0 && <p style={{ color: BLUE }}>No posts yet.</p>}
        </div>
      </section>

      {/* about / member split */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        {SPLIT_CARDS.map((card) => (
          <div key={card.heading} style={{ position: 'relative', minHeight: 340, display: 'flex', alignItems: 'center' }}>
            <div style={{ ...PH, position: 'absolute', inset: 0, backgroundColor: card.bg }} />
            <div style={{ position: 'relative', padding: '48px 40px', maxWidth: 540, marginLeft: card.align === 'flex-end' ? 'auto' : undefined, marginRight: card.align === 'flex-start' ? 'auto' : undefined }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 32 }}>
                <h1 style={{ fontFamily: 'Alegreya, serif', fontSize: 32, lineHeight: '38.4px', fontWeight: 500, color: BLUE, margin: '0 0 8px' }}>{card.heading}</h1>
                <p style={{ margin: '0 0 16px', color: BLUE, fontSize: 16, lineHeight: '24px' }}>{card.body}</p>
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
            <article key={card.heading} style={{ background: '#fff', borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h5 style={{ fontFamily: 'Alegreya, serif', fontSize: 17.6, lineHeight: '21.12px', fontWeight: 500, color: BLUE, margin: '0 0 8px' }}>{card.heading}</h5>
              <p style={{ margin: '0 0 16px', color: BLUE, fontSize: 16, lineHeight: '24px', flex: 1 }}>{card.body}</p>
              <a href={card.href} style={{ ...btnStyle, alignSelf: 'flex-start' }}>{card.cta}</a>
            </article>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer style={{ backgroundImage: 'linear-gradient(90deg, #e7faf5 0%, #d6ecf8 100%)', color: BLUE, fontSize: 12, lineHeight: '18px', fontWeight: 300, padding: 24 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '24px 15px', display: 'grid', gridTemplateColumns: 'minmax(260px, 1.2fr) repeat(2, minmax(200px, 1fr))', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <img src="https://smenet.blob.core.windows.net/smecms/sme/media/sme/logos/sme_full-large-min.png" alt="Society for Mining, Metallurgy, and Exploration" style={{ width: 210, maxWidth: '100%', height: 'auto' }} />
            <p style={{ margin: '0 0 8px', color: BLUE, fontSize: 16, lineHeight: '24px', fontWeight: 400 }}>Inspiring Mining Professionals Worldwide</p>
            <div style={{ fontSize: 13.6, lineHeight: '20.4px' }}>© 2026 SME All Rights Reserved. SME is a member society of OneMine, the SME Foundation, and the American Institute of Mining, Metallurgical, and Petroleum Engineers (AIME).</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.aria} href={s.href} aria-label={s.aria} style={{ width: 30, height: 30, borderRadius: 4, border: `1px solid ${BLUE}`, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{s.label}</a>
              ))}
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'Alegreya, serif', fontSize: 20, lineHeight: '24px', fontWeight: 500, color: BLUE, margin: '0 0 8px' }}>Navigation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.6, lineHeight: '20.4px' }}>
              {FOOTER_NAV.map((l) => (
                <a key={l.label} href={l.href} style={{ color: BLUE }}>{l.label}</a>
              ))}
            </div>
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: 'Alegreya, serif', fontSize: 20, lineHeight: '24px', fontWeight: 500, color: BLUE, margin: '0 0 8px' }}>Contacts</h3>
            <p style={{ margin: '0 0 16px', color: BLUE, fontSize: 13.6, lineHeight: '20.4px' }}>12999 E Adam Aircraft Circle<br />Englewood, CO 80112</p>
            <h2 style={{ fontFamily: 'Alegreya, serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, margin: '0 0 8px' }}><a href="tel:+13039484200" style={{ color: BLUE }}>+1 (303) 948 4200</a></h2>
            <p style={{ margin: '0 0 16px', fontSize: 13.6, lineHeight: '20.4px' }}><a href="mailto:cs@smenet.org" style={{ color: BLUE }}>cs@smenet.org</a></p>
            <p style={{ margin: '0 0 8px', color: BLUE, fontSize: 13.6, lineHeight: '20.4px' }}>For book information:</p>
            <h2 style={{ fontFamily: 'Alegreya, serif', fontSize: 24, lineHeight: '28.8px', fontWeight: 500, margin: '0 0 8px' }}><a href="tel:+13039484237" style={{ color: BLUE }}>+1 (303) 948 4237</a></h2>
            <p style={{ margin: 0, fontSize: 13.6, lineHeight: '20.4px' }}><a href="mailto:books@smenet.org" style={{ color: BLUE }}>books@smenet.org</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
