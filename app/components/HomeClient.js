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

  const props = { slides, inspiringCards, newsItems, postsError, slidesError, cardsError };

  return look === 'wireframe' ? <WireframeHome {...props} /> : <RealHome {...props} />;
}
