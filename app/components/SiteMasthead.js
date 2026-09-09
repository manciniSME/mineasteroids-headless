'use client';

import NavItem from './NavItem';
import { NAV_LIME } from './theme';
import {
  MEMBERSHIP_ITEMS,
  WHO_WE_SERVE_ITEMS,
  PROFESSIONAL_DEV_ITEMS,
  STUDENT_RESOURCES_ITEMS,
} from './nav-data';

// The logo + mega-menu nav, absolutely positioned over a dark gradient so it
// overlays whatever hero content (carousel, static photo, etc.) the page
// renders behind it. The parent hero section must be `position: relative`.
export default function SiteMasthead() {
  return (
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
  );
}
