'use client';

import { useEffect, useRef, useState } from 'react';

const AJAX_URL = '/wp-admin/admin-ajax.php';
const RM_BASE = 'https://my.smenet.org';

async function fetchFreshNonce() {
  try {
    const res = await fetch(`${AJAX_URL}?action=sme_rm_fresh_nonce&_=${Date.now()}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return data?.success && data?.data?.nonce ? data.data.nonce : null;
  } catch {
    return null;
  }
}

const POPUP_WIDTH = 260;

export default function LoginDropdown({ loginName }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pos, setPos] = useState(null);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  // The utility bar's mega-menu is dense enough to wrap at some viewport
  // widths, which moves this trigger around unpredictably — a CSS anchor
  // like `right: 0` on the popup assumes it always sits near the page's
  // right edge, and silently renders off-screen (invisible, unclickable)
  // whenever that assumption breaks. Computing the position from the
  // trigger's actual on-screen location, clamped to the viewport, avoids
  // that regardless of how the bar above it wraps.
  useEffect(() => {
    if (!open || !btnRef.current) return;
    function place() {
      const r = btnRef.current.getBoundingClientRect();
      const left = Math.min(Math.max(8, r.right - POPUP_WIDTH), window.innerWidth - POPUP_WIDTH - 8);
      setPos({ top: r.bottom + 8, left });
    }
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open]);

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Already signed in — no form needed, just hand off to the WP-rendered
  // /login/ page for account management / sign out (it already has a
  // correctly-generated logout nonce; we don't try to reconstruct one here).
  if (loginName) {
    return (
      <a href="/login/" style={{ color: '#fff', fontWeight: 'bold' }}>
        Hi, {loginName}
      </a>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    const nonce = await fetchFreshNonce();
    const body = new FormData();
    body.append('action', 'sme_rm_login');
    body.append('nonce', nonce || '');
    body.append('email', email.trim());
    body.append('password', password);
    body.append('returnUrl', window.location.href);

    try {
      const res = await fetch(AJAX_URL, { method: 'POST', body });
      const data = await res.json();

      if (data?.success && data?.data?.redirectUrl) {
        window.location.href = data.data.redirectUrl;
        return;
      }

      setLoading(false);
      setError(data?.data?.message || 'Login failed. Please try again.');
      setPassword('');
    } catch {
      setLoading(false);
      setError('A network error occurred. Please try again.');
    }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        style={{ background: 'none', border: 'none', color: '#fff', font: 'inherit', padding: 0, cursor: 'pointer' }}
      >
        Login
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          role="dialog"
          aria-label="Member login"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            width: 260,
            background: '#fff',
            color: '#212529',
            borderRadius: 6,
            boxShadow: '0 4px 20px rgba(0,0,0,.25)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            zIndex: 50,
          }}
        >
          <div style={{ fontWeight: 'bold', fontFamily: 'var(--font-alegreya), serif', fontSize: 16 }}>
            Member Login
          </div>

          <label style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            Email
            <input
              type="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
            />
          </label>

          <label style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4, fontSize: 14 }}
            />
          </label>

          {error && (
            <div role="alert" style={{ color: '#b00020', fontSize: 12 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#a9ce3a',
              color: '#23231f',
              border: 'none',
              borderRadius: 4,
              padding: '8px 12px',
              fontWeight: 'bold',
              fontFamily: 'var(--font-alegreya), serif',
              textTransform: 'uppercase',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <a href={`${RM_BASE}/account/login.aspx`} target="_blank" rel="noopener noreferrer" style={{ color: '#1b75bb' }}>
              Forgot password?
            </a>
            <a href={`${RM_BASE}/account/createaccount.aspx`} target="_blank" rel="noopener noreferrer" style={{ color: '#1b75bb' }}>
              Join SME
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
