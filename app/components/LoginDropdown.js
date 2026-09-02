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

// Fire-and-forget: also plant a session on rM's own domain (my.smenet.org)
// after a successful headless login here, so the member is recognized
// there too instead of needing a second login. Two hidden iframes, in
// sequence — first clear any existing rM session in this browser (rM's
// login.aspx honors an already-active session cookie over an incoming
// token, so skipping this could silently hand the session to whoever was
// ALREADY logged into rM in this browser, not the person who just
// authenticated here), then hand off the token for who actually just
// logged in. Neither result is observed or waited on — our own WP login
// already fully succeeded independently of whatever happens with these.
function establishRmSession(rmSsoToken) {
  console.log('[SME SSO handoff] starting — clearing any existing rM session first');
  const clearFrame = document.createElement('iframe');
  clearFrame.style.display = 'none';
  clearFrame.setAttribute('aria-hidden', 'true');
  clearFrame.title = '';
  clearFrame.src = `${RM_BASE}/account/logout.aspx`;

  let fired = false;
  function fireLogin(reason) {
    if (fired) return;
    fired = true;
    console.log('[SME SSO handoff] clear step done (' + reason + '), handing off token to rM login.aspx');

    const returnUrl = `${window.location.origin}/`;
    const loginFrame = document.createElement('iframe');
    loginFrame.style.display = 'none';
    loginFrame.setAttribute('aria-hidden', 'true');
    loginFrame.title = '';
    loginFrame.src = `${RM_BASE}/account/login.aspx?sso=${encodeURIComponent(rmSsoToken)}&RedirectUrl=${encodeURIComponent(returnUrl)}`;

    // Purely diagnostic — same readability trick as the silent-detect check.
    // Landing back on our own origin proves rM received the token and chose
    // to redirect (the request/redirect itself worked); it does NOT prove
    // the session cookie it tried to set on my.smenet.org actually stuck —
    // that part is invisible to us either way, since a cookie on rM's own
    // domain can never be read from our JS regardless of outcome. The only
    // real way to confirm the cookie stuck is opening my.smenet.org (or ME,
    // or TUC) directly in a normal tab afterward and checking it shows
    // logged in there.
    let checked = false;
    function checkLanding(trigger) {
      if (checked) return;
      checked = true;
      try {
        const href = loginFrame.contentWindow.location.href;
        console.log('[SME SSO handoff] loginFrame same-origin-readable, href =', href, '| trigger:', trigger, '— request/redirect completed; whether the my.smenet.org cookie actually stuck can only be confirmed by visiting my.smenet.org directly');
      } catch (err) {
        console.log('[SME SSO handoff] loginFrame still cross-origin | trigger:', trigger, '| error:', err && err.message, '— rM never redirected back, so the handoff request itself did not complete');
      }
    }
    loginFrame.addEventListener('load', () => checkLanding('load event'));
    setTimeout(() => checkLanding('4s timeout'), 4000);

    document.body.appendChild(loginFrame);
    setTimeout(() => loginFrame.remove(), 8000);
    clearFrame.remove();
  }

  clearFrame.addEventListener('load', () => fireLogin('load event'));
  document.body.appendChild(clearFrame);
  setTimeout(() => fireLogin('2.5s timeout'), 2500); // safety net in case the load event never fires
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
        if (data.data.rmSsoToken) establishRmSession(data.data.rmSsoToken);
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
