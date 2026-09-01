'use client';

import { useEffect, useState } from 'react';
import { useCarousel } from './useCarousel';
import LoginDropdown from './LoginDropdown';

const PH = { backgroundImage: 'repeating-linear-gradient(135deg, rgba(33,37,41,.08) 0 8px, rgba(33,37,41,.03) 8px 16px)' };
const BLUE = '#1b75bb';
const BLUE_DARK = '#135a91';
const LIME = '#a9ce3a';
const LIME_DARK = '#97ba28';
const NAV_LIME = '#b9d22c';
const TEXT_DARK = '#23231f';
const TEXT_BODY = '#2c2c28';
const UTILITY_BG = '#6d6d64';
const UTILITY_TEXT = '#f2f2ee';
const FOOTER_BG = '#4a4a44';
const FOOTER_TEXT = '#dcdcd6';
const ENGAGE_BG = '#66665e';
const NEWS_BG = '#c8c1aa';
const ABOUT_BG = '#ece8da';
const PROMO_BG = '#e6e9f4';
const PROMO_PANEL = '#0d8ecf';

const btnStyle = {
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

function chevronLinkStyle(color = '#fff') {
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

const UTILITY_FLAT_LINKS = [
  { label: 'Visit UCA', href: 'https://www.smenet.org/uca' },
  { label: 'Community', href: 'https://community.smenet.org/home' },
  { label: 'Join', href: 'https://www.smenet.org/membership/types' },
  { label: 'Store', href: 'https://store.smenet.org/' },
];

const UTILITY_FLAT_LINKS_2 = [
  { label: 'Career Center', href: 'https://miningjobs.smenet.org' },
  { label: 'SME Foundation', href: 'https://smefoundation.org/' },
];

const EVENTS_ITEMS = [
  { label: 'Industry Events Calendar', href: 'https://www.smenet.org/events' },
  { label: 'MINEXCHANGE - SME Annual Conference & Expo', href: 'https://www.smeannualconference.org/' },
  { label: 'CMSP Review Course', href: 'https://smecmsp.org/cmsp-review-course/' },
  { label: 'CMSP Exam', href: 'https://www.smecmsp.org/' },
  { label: 'SME Arizona Section Conference', href: 'https://www.smeaz.org' },
  { label: 'FGIM | Forum on the Geology of Industrial Minerals', href: 'https://smefgim.org' },
  { label: 'International Conference on Ground Control in Mining', href: 'http://www.groundcontrolmining.com' },
  { label: 'PE Review Course', href: 'https://www.smepereviewcourse.org/' },
  { label: 'RETC (Rapid Excavation & Tunneling Conference)', href: 'https://www.retc.org/' },
  { label: 'SME Minerals Forum Latin America', href: 'https://smemineralsforum.org/' },
  { label: 'SME Minnesota Section Conference', href: 'http://www.smemnconference.org' },
  { label: 'UCA Cutting Edge Conference', href: 'https://www.ucaofsmecuttingedge.com/' },
  { label: 'UCA George Fox Conference', href: 'https://www.georgefoxconference.com/' },
  { label: 'UCA North American Tunneling Conference', href: 'https://www.natconference.com/' },
];

const PUBLICATIONS_ITEMS = [
  { label: 'Mining Engineering Magazine', href: 'https://me.smenet.org' },
  { label: 'Mining, Metallurgy & Exploration Journal', href: 'https://www.smenet.org/professional-development/publications/mining-metallurgy-exploration' },
  { label: 'Mining Directory', href: 'https://miningdirectory.org' },
  { label: 'Tunneling & Underground Construction Magazine', href: 'https://www.tucmagazine.org' },
  { label: 'OneMine Digital Library', href: 'https://www.smenet.org/professional-development/publications/onemine-org' },
  { label: 'Advertising Opportunities', href: 'https://www.smenet.org/professional-development/publications/advertising-opportunities' },
];

const MEMBERSHIP_LOOKUP_ITEMS = [
  { label: 'Member Lookup Overview', href: 'https://www.smenet.org/membership-benefits/membership-lookup' },
  { label: 'All SME Member Lookup', href: 'https://community.smenet.org/network/members' },
  { label: 'Registered Member Lookup', href: 'https://www.smenet.org/registeredmembers' },
  { label: 'CMSP Lookup', href: 'https://www.smenet.org/cmspmembers' },
];

const MEMBERSHIP_ITEMS = [
  { label: 'Membership Overview', href: 'https://www.smenet.org/membership/overview' },
  { label: 'Membership Benefits', href: 'https://www.smenet.org/membership/benefits' },
  { label: 'Membership Types', href: 'https://www.smenet.org/membership/types' },
  { label: 'Strategic Partnerships', href: 'https://www.smenet.org/membership-benefits/strategic-partnerships' },
  { label: 'Industry Insights Guide', href: 'https://www.smenet.org/industryinsights' },
  { label: 'Why I SME', href: 'https://www.smenet.org/whyisme' },
];

const WHO_WE_SERVE_ITEMS = [
  { label: 'Our Divisions', href: 'https://www.smenet.org/divisions' },
  { label: 'Coal & Energy', href: 'https://www.smenet.org/divisions/coal-energy-division' },
  { label: 'Environmental', href: 'https://www.smenet.org/divisions/environmental-division' },
  { label: 'Health & Safety', href: 'https://www.smenet.org/divisions/health-safety-division' },
  { label: 'Industrial Minerals & Aggregates', href: 'https://www.smenet.org/divisions/industrial-minerals-aggregates-division' },
  { label: 'Mineral & Metallurgical Processing', href: 'https://www.smenet.org/divisions/mineral-metallurgical-processing-division' },
  { label: 'Mining & Exploration', href: 'https://www.smenet.org/divisions/mining-exploration-division' },
  { label: 'Underground Construction', href: 'https://www.smenet.org/uca' },
  { label: 'WAAIME', href: 'https://www.smenet.org/divisions/waaime-division' },
  { label: 'Our Committees', href: 'https://www.smenet.org/committees' },
  { label: 'Volunteer Opportunities', href: 'https://www.smenet.org/volunteer' },
];

const PROFESSIONAL_DEV_ITEMS = [
  { label: 'Professional Development Overview', href: 'https://www.smenet.org/professional-development' },
  { label: 'Tailings Portal', href: 'https://www.smenet.org/tailings' },
  { label: 'ESG Portal', href: 'https://www.smenet.org/esg' },
  { label: 'Technical Briefings', href: 'https://www.smenet.org/what-we-do/technical-briefings' },
  { label: 'Continuing Education', href: 'https://www.smenet.org/professional-development/continuing-education' },
  { label: 'Upcoming Webinars', href: 'https://www.smenet.org/sme-store/webinars' },
  { label: 'Webinar Library', href: 'https://store.smenet.org/21qjg8c' },
  { label: 'Find Mining Jobs', href: 'https://miningjobs.smenet.org/' },
  { label: 'Publishing & Peer Review', href: 'https://www.smenet.org/professional-development/publishing-with-sme' },
  { label: 'Certifications & Standards', href: 'https://www.smenet.org/professional-development/certifications-standards' },
  { label: 'SME Valuation Standards & Tutorials', href: 'https://www.smenet.org/professional-development/sme-valuation-standards-tutorials' },
  { label: 'Young Leaders Committee', href: 'https://www.smenet.org/professional-development/young-leaders-committee' },
  { label: 'Awards & Competitions', href: 'https://www.smenet.org/awards-recognition' },
];

const STUDENT_RESOURCES_ITEMS = [
  { label: 'Student Resources Overview', href: 'https://www.smenet.org/student-resources' },
  { label: 'Grants & Scholarships', href: 'https://www.smenet.org/scholarships' },
  { label: 'Schools & Programs', href: 'https://www.smenet.org/student-resources/accredited-schools-programs' },
  { label: 'Competitions & Awards', href: 'https://www.smenet.org/professional-development/awards-competitions' },
  { label: 'Student Chapters & Involvement', href: 'https://www.smenet.org/membership-benefits/sections-and-chapters' },
  { label: 'Student Membership & Privileges', href: 'https://www.smenet.org/membership-benefits/membership-categories/student-membership-benefits' },
  { label: 'Publishing & Peer Review', href: 'https://www.smenet.org/professional-development/publishing-with-sme' },
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

// Below-the-fold sections use a real <img loading="lazy"> instead of a CSS
// background-image, so the browser natively defers the fetch until the
// element is about to scroll into view.
function LazyBgImage({ src, alt = '', style, children }) {
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

// Hover-opened mega-menu item, used in both the utility bar and the header
// nav. Renders a plain link when `items` is omitted.
function NavItem({ label, href, items, color, fontSize = 14, padding = '0 16px', ddWidth = 300, align = 'left' }) {
  const [open, setOpen] = useState(false);

  if (!items) {
    return (
      <a href={href} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', padding, color, fontSize }}>
        {label}
      </a>
    );
  }

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'stretch' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', padding, color, fontSize, cursor: 'default' }}
      >
        {label} <span style={{ fontSize: 9, marginLeft: 7 }}>&#9660;</span>
      </a>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            [align]: 0,
            width: ddWidth,
            background: '#fff',
            boxShadow: '0 10px 26px rgba(0,0,0,.24)',
            padding: '6px 0',
            zIndex: 70,
          }}
        >
          {items.map((it) => (
            <a
              key={it.label}
              href={it.href}
              style={{ display: 'block', padding: '8px 18px', fontSize: 13.5, lineHeight: 1.35, color: '#3f3f3a', borderBottom: '1px solid #ecece7' }}
            >
              {it.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

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
      {/* utility bar */}
      <div style={{ background: UTILITY_BG, color: UTILITY_TEXT, fontSize: 13.5 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', flexWrap: 'wrap', minHeight: 42 }}>
          <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
            {UTILITY_FLAT_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', padding: '0 16px', color: UTILITY_TEXT, fontSize: 13.5 }}>{l.label}</a>
            ))}
            <NavItem label="Events" items={EVENTS_ITEMS} color={UTILITY_TEXT} fontSize={13.5} ddWidth={340} />
            <NavItem label="Publications" items={PUBLICATIONS_ITEMS} color={UTILITY_TEXT} fontSize={13.5} ddWidth={345} />
            {UTILITY_FLAT_LINKS_2.map((l) => (
              <a key={l.label} href={l.href} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', padding: '0 16px', color: UTILITY_TEXT, fontSize: 13.5 }}>{l.label}</a>
            ))}
            <NavItem label="Membership Lookup" items={MEMBERSHIP_LOOKUP_ITEMS} color={UTILITY_TEXT} fontSize={13.5} ddWidth={285} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '8px 0' }}>
            <a href="https://my.smenet.org/my-account/shopping-cart" title="Shopping Cart" style={{ color: UTILITY_TEXT, fontSize: 15 }}>&#128722;</a>
            <LoginDropdown loginInfo={loginInfo} onAuthChange={onAuthChange} />
          </div>
        </div>
      </div>

      {/* hero carousel with mega-menu masthead overlaid on top */}
      <section style={{ position: 'relative', background: '#3a3a35', minHeight: 600, overflow: 'hidden' }}>
        <header
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: 'linear-gradient(180deg, rgba(38,38,34,.82) 0%, rgba(38,38,34,.55) 70%, rgba(38,38,34,0) 100%)',
          }}
        >
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '16px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <a href="https://www.smenet.org/" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
              <img src="https://smenet.blob.core.windows.net/smecms/sme/media/sme/logos/sme-horz-white.png" alt="Society for Mining, Metallurgy, and Exploration" width={214} height={52} style={{ display: 'block', height: 52, width: 'auto' }} />
            </a>
            <nav style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', fontSize: 14 }}>
              <NavItem label="About Us" href="https://www.smenet.org/aboutus" color={NAV_LIME} />
              <NavItem label="Membership" items={MEMBERSHIP_ITEMS} color={NAV_LIME} ddWidth={300} />
              <NavItem label="Who We Serve" items={WHO_WE_SERVE_ITEMS} color={NAV_LIME} ddWidth={340} />
              <NavItem label="Professional Development" items={PROFESSIONAL_DEV_ITEMS} color={NAV_LIME} ddWidth={375} />
              <NavItem label="Student Resources" items={STUDENT_RESOURCES_ITEMS} color={NAV_LIME} ddWidth={350} align="right" />
              <NavItem label="SME Studios" href="https://media.smenet.org/" color={NAV_LIME} />
              <a href="#" title="Search" style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 14px', color: NAV_LIME, fontSize: 17 }}>&#128269;</a>
            </nav>
          </div>
        </header>

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
            {inspiringCards.map((card, idx) => (
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

      {/* footer */}
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
    </div>
  );
}
