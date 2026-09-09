'use client';

import UtilityBar from './UtilityBar';
import SiteMasthead from './SiteMasthead';
import SiteFooter from './SiteFooter';
import { PH, BLUE, LIME, TEXT_DARK, TEXT_BODY, ENGAGE_BG, ABOUT_BG, PROMO_BG, btnStyle, chevronLinkStyle, LazyBgImage } from './theme';

const HERO_IMG = 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/miners_hardhats.webp';
const DIVERSITY_IMG = 'https://smenet.blob.core.windows.net/smecms/sme/media/sme/homepage/about%20sme%20tiles/mine-truck-driver-acf38xs-lo.webp';

const WHAT_WE_DO = {
  color: LIME,
  heading: 'What We Do',
  body: 'Explore how SME strives to build a better world through mining, metallurgy and underground construction.',
  links: [
    { label: 'Values, Vision & Mission', href: 'https://www.smenet.org/what-we-do/our-values,-vision-and-mission' },
    { label: 'Strategic Plan', href: 'https://www.smenet.org/what-we-do/strategic-plan' },
    { label: 'Media Center', href: 'https://www.smenet.org/media-center' },
    { label: 'Annual Report', href: 'https://www.smenet.org/annual-report' },
  ],
};

const WHO_WE_ARE = {
  color: BLUE,
  heading: 'Who We Are',
  body: 'See how our members, as diverse and broad as the industry itself, make a difference in communities around the world.',
  links: [
    { label: 'SME Divisions', href: 'https://www.smenet.org/divisions' },
    { label: 'SME Foundation', href: 'https://smefoundation.org/' },
    { label: 'Why I SME', href: 'https://www.smenet.org/whyisme' },
    { label: 'Meet Our Team', href: 'https://www.smenet.org/meet-our-team' },
  ],
};

const WHERE_WE_COME_FROM = {
  color: '#6d6d64',
  heading: 'Where We Come From',
  body: 'Delve into the storied history of the Society and our advancement to reflect the ever-broadening interests of our members.',
  links: [
    { label: 'History of SME', href: 'https://www.smenet.org/history-of-sme' },
    { label: 'Past Presidents', href: 'https://www.smenet.org/past-presidents' },
    { label: 'AIME', href: 'https://www.aimehq.org/' },
  ],
};

export default function AboutUs({ loginInfo, onAuthChange, boardMembers, boardError }) {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <UtilityBar loginInfo={loginInfo} onAuthChange={onAuthChange} />

      {/* hero — static photo instead of a carousel, same masthead overlay */}
      <section style={{ position: 'relative', background: '#3a3a35', minHeight: 420, overflow: 'hidden' }}>
        <SiteMasthead />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,20,18,.35) 0%, rgba(20,20,18,.55) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '150px 15px 60px', minHeight: 420, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 'min(560px, 100%)', background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(3px)', borderTop: `4px solid ${BLUE}`, borderRadius: 10, padding: '30px 34px 34px', boxShadow: '0 6px 24px rgba(0,0,0,.28)' }}>
            <h1 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: BLUE, margin: '0 0 10px' }}>About Us</h1>
            <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: TEXT_BODY, margin: 0 }}>Inspiring Mining Professionals Worldwide</p>
          </div>
        </div>
      </section>

      {/* three-column overview */}
      <section style={{ background: PROMO_BG, padding: '48px 0 56px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
          {[WHAT_WE_DO, WHO_WE_ARE, WHERE_WE_COME_FROM].map((col) => (
            <div key={col.heading} style={{ background: '#fff', borderTop: `4px solid ${col.color}`, borderRadius: 8, padding: '28px 26px', boxShadow: '0 2px 10px rgba(0,0,0,.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 22, fontWeight: 700, color: col.color, margin: '0 0 14px' }}>{col.heading}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.5, color: TEXT_BODY, margin: '0 0 18px' }}>{col.body}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} style={{ color: BLUE, fontSize: 14, textDecoration: 'underline' }}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* diversity statement — dark photo band */}
      <LazyBgImage src={DIVERSITY_IMG} alt="" style={{ minHeight: 340 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(24,24,20,.82) 0%, rgba(24,24,20,.55) 60%, rgba(24,24,20,.3) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '56px 15px' }}>
          <div style={{ maxWidth: 620, color: '#fff' }}>
            <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 34, fontWeight: 400, margin: '0 0 18px' }}>Diversity Statement</h2>
            <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 300, margin: '0 0 14px' }}>
              In principle and in practice, SME and all its leadership value and seek diverse and inclusive participation within the mining and minerals community.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 300, margin: '0 0 14px' }}>
              SME promotes involvement and expanded access to leadership opportunity regardless of race, ethnicity, gender, religion, age, sexual orientation, nationality, or disability.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 300, margin: '0 0 26px' }}>
              SME is committed to creating an environment that draws upon the strength of the diversity of our Board and Committee leaders to meet and exceed the expectations of our members and customers.
            </p>
            <a href="https://www.smenet.org/what-we-do/diversity-statement" style={btnStyle}>Learn More</a>
          </div>
        </div>
      </LazyBgImage>

      {/* membership CTA */}
      <section style={{ background: ENGAGE_BG, padding: '46px 15px', textAlign: 'center' }}>
        <p style={{ maxWidth: 720, margin: '0 auto', color: '#fff', fontSize: 20, lineHeight: 1.4, fontFamily: 'var(--font-alegreya), serif' }}>
          Make a difference in your career when you become a member of SME. Since its inception, SME has continued to evolve over the years to stay abreast of industry changes and to reflect the ever-broadening interests of its members.
        </p>
        <a href="https://www.smenet.org/membership/benefits" style={{ ...btnStyle, marginTop: 24, display: 'inline-block' }}>Become a Member</a>
      </section>

      {/* board of directors */}
      <section
        style={{
          backgroundColor: ABOUT_BG,
          backgroundImage:
            'radial-gradient(ellipse 1100px 280px at 20% 25%, rgba(255,255,255,.55) 0 1px, transparent 1px 3px), radial-gradient(ellipse 900px 240px at 70% 60%, rgba(255,255,255,.5) 0 1px, transparent 1px 3px)',
          padding: '54px 0 60px',
        }}
      >
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px' }}>
          <h2 style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 34, fontWeight: 400, color: TEXT_DARK, margin: '0 0 32px', textAlign: 'center' }}>Our Board of Directors</h2>
          {boardError && <p style={{ color: '#900', textAlign: 'center' }}>Board of Directors: {boardError}</p>}
          {boardMembers === null ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ width: 96, height: 96, borderRadius: '50%', margin: '0 auto 12px', ...PH }} />
                  <div style={{ height: 14, width: '70%', margin: '0 auto 6px', background: 'rgba(0,0,0,.08)', borderRadius: 4 }} />
                  <div style={{ height: 11, width: '45%', margin: '0 auto', background: 'rgba(0,0,0,.06)', borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
              {boardMembers.map((m) => (
                <div key={m.name} style={{ textAlign: 'center' }}>
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} loading="lazy" decoding="async" width={96} height={96} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block' }} />
                  ) : (
                    <div style={{ width: 96, height: 96, borderRadius: '50%', margin: '0 auto 12px', ...PH }} />
                  )}
                  <div style={{ fontFamily: 'var(--font-alegreya), serif', fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>{m.name}</div>
                  <div style={{ fontSize: 12, letterSpacing: '.04em', textTransform: 'uppercase', color: BLUE, marginTop: 2 }}>{m.title}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <a href="https://community.smenet.org/network/members" style={btnStyle}>Search Membership Directory</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
