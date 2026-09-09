'use client';

import { useState } from 'react';

// Hover-opened mega-menu item, used in both the utility bar and the header
// nav. Renders a plain link when `items` is omitted.
export default function NavItem({ label, href, items, color, fontSize = 14, padding = '0 16px', ddWidth = 300, align = 'left' }) {
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
