import { wpFetch } from '../lib/wpgraphql';
import {
  POSTS_QUERY,
  HERO_SLIDES_QUERY,
  INSPIRING_CARDS_QUERY,
  DEFAULT_SLIDES,
  DEFAULT_INSPIRING_CARDS,
  mapSlides,
  mapCards,
} from '../lib/queries';
import HomeClient from './components/HomeClient';

// Fetched at build time so the static HTML ships with real content already in
// place (fast first paint / good LCP) instead of an empty shell waiting on a
// client-side fetch chain. HomeClient re-fetches on load to catch anything
// published since the last build. Every branch here degrades to a sane
// default rather than failing the build if WPGraphQL is unreachable.
export default async function Page() {
  let initialPosts = [];
  let initialSlides = DEFAULT_SLIDES;
  let initialCards = DEFAULT_INSPIRING_CARDS;
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

  try {
    const data = await wpFetch(INSPIRING_CARDS_QUERY);
    const nodes = data?.inspiringCards?.nodes ?? [];
    if (nodes.length > 0) initialCards = mapCards(nodes);
  } catch (err) {
    initialErrors.cards = err.message;
  }

  return (
    <HomeClient
      initialPosts={initialPosts}
      initialSlides={initialSlides}
      initialCards={initialCards}
      initialErrors={initialErrors}
    />
  );
}
