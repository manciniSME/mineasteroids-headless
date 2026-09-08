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

// Also plant a session on rM's own domain (my.smenet.org) after a
// successful headless login here, so the member is recognized there too
// instead of needing a second login.
//
// Superseded the earlier hidden-iframe version: confirmed via live testing
// that the request/redirect through rM completed successfully every time
// (visible in the console as the iframe landing back on our own origin),
// but the session cookie it tried to set never stuck — consistent with
// third-party cookie blocking, which applies to cookies set inside a
// cross-site iframe regardless of Incognito. That's a hard browser
// security boundary, not something fixable with more retries or delays.
//
// A real top-level navigation isn't subject to that blocking, so this
// trades the invisible iframe for a brief, visible flash through
// my.smenet.org and back — our own WP login here has already fully
// succeeded before this runs, so there's nothing left to lose if this
// leg has trouble; worst case the visitor just isn't recognized on
// my.smenet.org until they log in there directly.
//
// Deliberately skips the old pre-clear step (which cleared any existing
// rM session before handing off the new token) — that only matters when
// a DIFFERENT rM identity is already active in this browser, which is
// uncommon for a real member and would cost a second visible hop here.
// The `sme_rm_headless=1` marker tells handle_sso_callback() in the
// plugin to land back on a clean homepage URL afterward — see the
// comment there for why that's needed only for this flow.
function establishRmSession(rmSsoToken) {
  const returnUrl = `${window.location.origin}/?sme_rm_headless=1`;
  window.location.href = `${RM_BASE}/account/login.aspx?sso=${encodeURIComponent(rmSsoToken)}&RedirectUrl=${encodeURIComponent(returnUrl)}`;
}

// On-demand version of the same idea, for someone who's already signed
// into rM elsewhere (my.smenet.org, ME, TUC) and wants that recognized
// here without retyping credentials. Checked live against the real
// smenet.org: it doesn't auto-check on page load either, only when
// someone actually clicks Login — matched here, fired once per click of
// the Login trigger while logged out.
//
// Runs in a popup rather than navigating the main tab: a real top-level
// browsing context is required for rM's cookie to behave normally (an
// iframe hits the same third-party cookie blocking that broke the
// earlier hidden-iframe attempts), but a popup gets that same first-party
// behavior WITHOUT taking the visitor off this page.
//
// Only the popup shows while it's checking — the inline form is held back
// (via onGiveUp) until either the popup can't be opened at all, or the
// visitor closes it without completing a login. If rM doesn't recognize
// the browser, the popup shows rM's own hosted login form in its own
// small window; the visitor can finish there, or close it to fall back to
// the inline form here instead.
//
// No token to hand off here — we're asking rM "do you already know this
// browser?", not providing proof of identity like establishRmSession()
// does. If rM says yes, it redirects the popup back with its own fresh
// token, which handle_sso_callback() already knows how to turn into a WP
// login (the plugin's existing, unmodified first-time-login path — the
// visitor isn't logged in yet at that point, so the sme_rm_headless-gated
// branch doesn't even apply; it already redirects to a clean URL).
function checkExistingRmSession(onAuthChange, onGiveUp) {
  const returnUrl = `${window.location.origin}/`;
  const url = `${RM_BASE}/account/login.aspx?RedirectUrl=${encodeURIComponent(returnUrl)}`;

  const width = 480;
  const height = 760;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,location=no,menubar=no,status=no`;

  let popup;
  try {
    popup = window.open(url, 'sme_rm_check', features);
  } catch {
    popup = null;
  }

  if (!popup) {
    // Blocked (rare for a popup opened synchronously from a real click,
    // but some hardened browsers/extensions still do it) — fall back to
    // the inline form rather than doing nothing.
    onGiveUp();
    return;
  }

  const interval = setInterval(async () => {
    if (popup.closed) {
      clearInterval(interval);
      onGiveUp(); // closed without ever landing back on our origin
      return;
    }
    try {
      const href = popup.location.href;
      if (href.indexOf(window.location.origin) !== 0) return; // still on rM, keep waiting
      clearInterval(interval);
      popup.close();
      // The popup's own navigation back to our domain is what got the WP
      // auth cookie set (a first-party set, since by that point the
      // popup's own top-level context IS our origin) — that cookie is
      // shared across every tab/window on this origin immediately, so a
      // fresh whoami check from THIS tab already reflects it with no
      // reload needed.
      try {
        const res = await fetch('/wp-admin/admin-ajax.php?action=sme_rm_whoami', { credentials: 'same-origin' });
        const data = await res.json();
        onAuthChange(data?.success && data.data?.loggedIn ? data.data : false);
      } catch {
        // Leave state as-is — nothing else to do if this last check fails.
      }
    } catch {
      // Still cross-origin (on rM, no session found yet, or the visitor
      // is filling in rM's own form) — keep waiting.
    }
  }, 500);
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

// loginInfo is null while the initial sme_rm_whoami check is still in
// flight, false once confirmed logged out, or the user object once
// confirmed logged in. Treating null the same as false (as a naive !!
// check would) lets someone open the interactive login form and start
// typing before we've actually confirmed they're logged out — worth
// avoiding even for this brief a window, since it's exactly the kind of
// moment that produced a "login incorrect" for a login attempt that was
// never necessary in the first place.
function LoginTrigger({ loginInfo, btnRef, open, onClick }) {
  if (loginInfo === null) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.6)', font: 'inherit' }}>
        Login
      </span>
    );
  }

  const loggedIn = !!loginInfo;
  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
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
  );
}

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
      <LoginTrigger
        loginInfo={loginInfo}
        btnRef={btnRef}
        open={open}
        onClick={() => {
          if (loggedIn || open) {
            setOpen((v) => !v);
            return;
          }
          // Hold the inline form back — only the popup shows while it's
          // checking. It opens here (not in the effect below) purely as a
          // fallback for when the popup can't run at all.
          checkExistingRmSession(onAuthChange, () => setOpen(true));
        }}
      />

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

          <p style={{ margin: 0, fontSize: 10.5, color: '#8a929b', textAlign: 'center' }}>
            Already signed in elsewhere? We checked a moment ago in a small window — if it didn't find you, sign in above.
          </p>

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
