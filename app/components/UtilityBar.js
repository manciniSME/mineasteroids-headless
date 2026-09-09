'use client';

import NavItem from './NavItem';
import LoginDropdown from './LoginDropdown';
import { UTILITY_BG, UTILITY_TEXT } from './theme';
import {
  UTILITY_FLAT_LINKS,
  UTILITY_FLAT_LINKS_2,
  EVENTS_ITEMS,
  PUBLICATIONS_ITEMS,
  MEMBERSHIP_LOOKUP_ITEMS,
} from './nav-data';

// The gray bar at the very top of every page — same on every page, so it's
// its own component rather than duplicated per-page.
export default function UtilityBar({ loginInfo, onAuthChange }) {
  return (
    <div style={{ background: UTILITY_BG, color: UTILITY_TEXT, fontSize: 13.5 }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 15px', display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', minHeight: 42 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', minWidth: 0 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '8px 0', flexShrink: 0 }}>
          <a href="https://my.smenet.org/my-account/shopping-cart" title="Shopping Cart" style={{ color: UTILITY_TEXT, fontSize: 15 }}>&#128722;</a>
          <LoginDropdown loginInfo={loginInfo} onAuthChange={onAuthChange} />
        </div>
      </div>
    </div>
  );
}
