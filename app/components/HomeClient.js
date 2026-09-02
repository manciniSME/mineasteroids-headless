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
  // null = still checking, false = logged out, object = logged in
  const [loginInfo, setLoginInfo] = useState(null);

  // Read-only check against the SSO plugin's own headless "who am I" action
  // — same-origin, so the browser sends the WP login cookie automatically
  // once someone's signed in. This and the login/logout actions below are
  // the plugin's new headless-friendly endpoints (sme_rm_whoami /
  // sme_rm_login_headless / sme_rm_logout), added specifically because the
  // original sme_rm_login flow depends on WordPress's theme layer to
  // complete its rM-domain redirect dance, which never runs for a fully
  // static frontend like this one.
  useEffect(() => {
    fetch('/wp-admin/admin-ajax.php?action=sme_rm_whoami', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setLoginInfo(data?.success && data.data?.loggedIn ? data.data : false))
      .catch(() => setLoginInfo(false));
  }, []);

  // There used to be a silent cross-domain auto-detect here — a hidden
  // iframe checking whether the browser already carried an active
  // my.smenet.org session, so a visitor logged in elsewhere would be
  // recognized here without doing anything. Removed: confirmed via the
  // explicit-login handoff (see LoginDropdown.js) that a hidden cross-site
  // iframe can't reliably set a cookie on my.smenet.org, because of
  // third-party cookie blocking — the same restriction almost certainly
  // applies to reading an existing one, which is consistent with this
  // check having sat here doing nothing useful. The only way to make this
  // reliable is the same fix the login handoff got — a real top-level
  // redirect through my.smenet.org and back — but doing that on every
  // single page load for every visitor (nearly all of whom have never
  // logged into rM at all) is a worse trade than just not having the
  // feature. An explicit login is the only supported way to sign in here.

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

  const props = { slides, inspiringCards, newsItems, postsError, slidesError, cardsError, loginInfo, onAuthChange: setLoginInfo };

  return look === 'wireframe' ? <WireframeHome {...props} /> : <RealHome {...props} />;
}
