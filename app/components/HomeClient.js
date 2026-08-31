'use client';

import { useEffect, useState } from 'react';
import { wpFetch } from '../../lib/wpgraphql';
import {
  POSTS_QUERY,
  HERO_SLIDES_QUERY,
  INSPIRING_CARDS_QUERY,
  mapSlides,
  mapCards,
} from '../../lib/queries';
import RealHome from './RealHome';
import WireframeHome from './WireframeHome';

const clamp = (s, n) => (s.length > n ? s.slice(0, n).trimEnd() + '…' : s);

function getInitialLook() {
  if (typeof window === 'undefined') return 'real';
  return new URLSearchParams(window.location.search).get('look') === 'wireframe' ? 'wireframe' : 'real';
}

export default function HomeClient({ initialPosts, initialSlides, initialCards, initialErrors }) {
  const [look] = useState(getInitialLook);
  const [posts, setPosts] = useState(initialPosts);
  const [slides, setSlides] = useState(initialSlides);
  const [inspiringCards, setInspiringCards] = useState(initialCards);
  const [postsError, setPostsError] = useState(initialErrors.posts);
  const [slidesError, setSlidesError] = useState(initialErrors.slides);
  const [cardsError, setCardsError] = useState(initialErrors.cards);
  // null = still checking, false = logged out, string = display name
  const [loginName, setLoginName] = useState(null);

  // Read-only check against WP's own "who am I" endpoint — same-origin, so
  // the browser sends the WP login cookie automatically once someone's
  // signed in via /login/. We never touch credentials or the logout nonce
  // ourselves; this just decides what the header shows.
  useEffect(() => {
    fetch('/wp-json/wp/v2/users/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((user) => setLoginName(user?.name || 'Member'))
      .catch(() => setLoginName(false));
  }, []);

  // Silent cross-domain SSO check. The SME Re:Members SSO plugin normally
  // does this itself via a hidden iframe injected in wp_footer — but that
  // only fires when WordPress's PHP actually renders the page, and our
  // homepage never touches WP's theme layer (it's a static Next.js export).
  // So a visitor who's already signed in on my.smenet.org, but has never
  // explicitly logged in on THIS site, would otherwise sit stuck on "Login"
  // forever. This reproduces the plugin's own iframe check client-side:
  // point a hidden iframe at rM's login.aspx with a RedirectUrl back to our
  // own homepage. If the browser already carries an active rM session
  // cookie, rM silently redirects the iframe back to us with an ?sso=
  // token, which our Worker routes to WP, WP validates it and sets our
  // auth cookie, and we detect the iframe landing back on our own origin
  // and reload the real page to pick it up. If there's no rM session, the
  // iframe just stays cross-origin and nothing happens.
  useEffect(() => {
    if (loginName !== false) return; // only once we've confirmed no local WP session

    const params = new URLSearchParams(window.location.search);
    if (params.has('sso') || params.has('sso_check') || params.has('sme_rm_no_sso')) {
      console.log('[SME SSO] skipped: already mid-callback (sso/sso_check/sme_rm_no_sso in URL)');
      return;
    }
    if (document.cookie.includes('sme_rm_sso_checked=1')) {
      console.log('[SME SSO] skipped: already checked in the last 5 min (sme_rm_sso_checked cookie present)');
      return;
    }

    document.cookie = 'sme_rm_sso_checked=1; max-age=300; path=/';

    const returnUrl = `${window.location.origin}/?sso_check=1`;
    const ssoUrl = `https://my.smenet.org/account/login.aspx?RedirectUrl=${encodeURIComponent(returnUrl)}`;
    console.log('[SME SSO] starting silent check, iframe src =', ssoUrl);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.title = '';
    iframe.src = ssoUrl;

    let done = false;
    function finish(reason) {
      if (done) return;
      try {
        const href = iframe.contentWindow.location.href;
        console.log('[SME SSO] iframe readable (same-origin), href =', href, '| trigger:', reason);
        if (href.indexOf(window.location.origin) === 0) {
          done = true;
          console.log('[SME SSO] iframe landed back on our origin — reloading to pick up the auth cookie');
          window.location.reload();
        } else {
          console.log('[SME SSO] iframe same-origin-readable but not on our origin yet — leaving it alone');
        }
      } catch (err) {
        console.log('[SME SSO] iframe still cross-origin (no active rM session, or framing blocked) | trigger:', reason, '| error:', err && err.message);
      }
    }
    iframe.addEventListener('load', () => finish('load event'));
    document.body.appendChild(iframe);
    const timer = setTimeout(() => finish('4s timeout'), 4000);

    return () => {
      clearTimeout(timer);
      iframe.remove();
    };
  }, [loginName]);

  // The page ships with whatever was current at build time (fast first paint,
  // good LCP). This re-fetches on every load so edits made in wp-admin since
  // the last build still show up within a second of hitting the page.
  useEffect(() => {
    wpFetch(POSTS_QUERY)
      .then((data) => {
        setPosts(data?.posts?.nodes ?? []);
        setPostsError(null);
      })
      .catch((err) => setPostsError(err.message));

    wpFetch(HERO_SLIDES_QUERY)
      .then((data) => {
        const nodes = data?.heroSlides?.nodes ?? [];
        if (nodes.length > 0) {
          setSlides(mapSlides(nodes));
          setSlidesError(null);
        }
      })
      .catch((err) => setSlidesError(err.message));

    wpFetch(INSPIRING_CARDS_QUERY)
      .then((data) => {
        const nodes = data?.inspiringCards?.nodes ?? [];
        if (nodes.length > 0) {
          setInspiringCards(mapCards(nodes));
          setCardsError(null);
        }
      })
      .catch((err) => setCardsError(err.message));
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

  const props = { slides, inspiringCards, newsItems, postsError, slidesError, cardsError, loginName };

  return look === 'wireframe' ? <WireframeHome {...props} /> : <RealHome {...props} />;
}
