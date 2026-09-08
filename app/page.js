import { wpFetch } from '../lib/wpgraphql';
import {
  POSTS_QUERY,
  HERO_SLIDES_QUERY,
  DEFAULT_SLIDES,
  mapSlides,
} from '../lib/queries';
import HomeClient from './components/HomeClient';

// Fetched at build time so the static HTML ships with real content already in
// place (fast first paint / good LCP) instead of an empty shell waiting on a
// client-side fetch chain. HomeClient re-fetches on load to catch anything
// published since the last build. Every branch here degrades to a sane
// default rather than failing the build if WPGraphQL is unreachable.
//
// Inspiring Cards are deliberately NOT fetched here — see HomeClient's own
// comment on that section. A build-time snapshot of scheduled/editorial
// content can end up ahead of what's actually published (confirmed live:
// a card scheduled for a later date got baked into a build before the
// schedule was set, then flashed on screen before the live re-fetch
// removed it), and unlike the hero slide, that section isn't part of the
// LCP calculation — so there's nothing to trade away by only ever
// rendering it from a live, always-current fetch.
export default async function Page() {
  let initialPosts = [];
  let initialSlides = DEFAULT_SLIDES;
  const initialErrors = { posts: null, slides: null, cards: null };

  try {
    const data = await wpFetch(POSTS_QUERY);
    initialPosts = data?.posts?.nodes ?? [];
  } catch (err) {
    initialErrors.posts = err.message;
  }

  try {
    const data = await wpFetch(HERO_SLIDES_QUERY);
    const nodes = data?.heroSlides?.nodes ?? [];
    if (nodes.length > 0) initialSlides = mapSlides(nodes);
  } catch (err) {
    initialErrors.slides = err.message;
  }

  return (
    <HomeClient
      initialPosts={initialPosts}
      initialSlides={initialSlides}
      initialErrors={initialErrors}
    />
  );
}
