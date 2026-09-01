'use client';

import { useEffect, useRef, useState } from 'react';

const AJAX_URL = '/wp-admin/admin-ajax.php';
const RM_BASE = 'https://my.smenet.org';
const POPUP_WIDTH = 260;

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

const popupBaseStyle = {
  position: 'fixed',
  width: POPUP_WIDTH,
  background: '#fff',
  color: '#212529',
  borderRadius: 6,
  boxShadow: '0 4px 20px rgba(0,0,0,.25)',
  zIndex: 200,
};

export default function LoginDropdown({ loginInfo, onAuthChange }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
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
    body.append('action', 'sme_rm_login_headless');
    body.append('nonce', nonce || '');
    body.append('email', email.trim());
    body.append('password', password);

    try {
      const res = await fetch(AJAX_URL, { method: 'POST', body });
      const data = await res.json();

      if (data?.success && data?.data?.loggedIn) {
        setLoading(false);
        setEmail('');
        setPassword('');
        setOpen(false);
        onAuthChange(data.data);
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

  async function handleLogout() {
    setSigningOut(true);
    const nonce = await fetchFreshNonce();
    const body = new FormData();
    body.append('action', 'sme_rm_logout');
    body.append('nonce', nonce || '');

    try {
      await fetch(AJAX_URL, { method: 'POST', body });
    } catch {
      // Best-effort — if the request itself fails, still drop the visible
      // logged-in state so the header isn't stuck showing stale info.
    }
    setSigningOut(false);
    setOpen(false);
    onAuthChange(false);
  }

  const loggedIn = !!loginInfo;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#fff', font: 'inherit', padding: 0, cursor: 'pointer' }}
      >
        {loggedIn ? (
          <>
            {loginInfo.avatarUrl ? (
              <img src={loginInfo.avatarUrl} alt="" width={24} height={24} style={{ borderRadius: '50%', display: 'block' }} />
            ) : (
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                {loginInfo.displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <span style={{ fontWeight: 'bold' }}>Hi, {loginInfo.displayName}</span>
          </>
        ) : (
          'Login'
        )}
      </button>

      {open && pos && loggedIn && (
        <div
          role="dialog"
          aria-label="Account"
          style={{ ...popupBaseStyle, top: pos.top, left: pos.left, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <a
            href={`${RM_BASE}/my-account/my-profile/`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#212529' }}
          >
            {loginInfo.avatarUrl ? (
              <img src={loginInfo.avatarUrl} alt="" width={36} height={36} style={{ borderRadius: '50%', display: 'block' }} />
            ) : (
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: '#e4edf4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }}>
                {loginInfo.displayName.charAt(0).toUpperCase()}
              </span>
            )}
            <span>
              <span style={{ display: 'block', fontWeight: 'bold', fontFamily: 'var(--font-alegreya), serif', fontSize: 16 }}>{loginInfo.displayName}</span>
              {loginInfo.memberType && <span style={{ display: 'block', fontSize: 12, color: '#5c6570' }}>{loginInfo.memberType}</span>}
            </span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#a9ce3a',
              color: '#23231f',
              border: 'none',
              borderRadius: 4,
              padding: '8px 12px',
              fontWeight: 'bold',
              fontFamily: 'var(--font-alegreya), serif',
              textTransform: 'uppercase',
              fontSize: 13,
              cursor: signingOut ? 'default' : 'pointer',
              opacity: signingOut ? 0.7 : 1,
            }}
          >
            {signingOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      )}

      {open && pos && !loggedIn && (
        <form
          onSubmit={handleSubmit}
          role="dialog"
          aria-label="Member login"
          style={{ ...popupBaseStyle, top: pos.top, left: pos.left, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}
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
