'use client';

import { useEffect, useState } from 'react';
import { wpFetch } from '../lib/wpgraphql';
import RealHome from './components/RealHome';
import WireframeHome from './components/WireframeHome';

const POSTS_QUERY = `
  query GetPosts {
    posts(first: 3) {
      nodes {
        id
        title
        excerpt
        date
        link
      }
    }
  }
`;

const HERO_SLIDES_QUERY = `
  query GetHeroSlides {
    heroSlides(first: 10, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        heroSlideFields {
          heading
          body
          ctaLabel
          ctaUrl
          backgroundColor
          image {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

const INSPIRING_CARDS_QUERY = `
  query GetInspiringCards {
    inspiringCards(first: 10, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        inspiringCardFields {
          photoLabel
          heading
          ctaLabel
          ctaUrl
          image {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

const DEFAULT_SLIDES = [
  {
    bg: '#c1cfe3',
    heading: 'Take the Next Step in Your Engineering Career',
    body: 'Our PE Review Course covers each of the examination subject topics, terminology, concepts and also provides a multitude of information and resources.',
    cta: 'Register Now',
    href: 'https://smepereviewcourse.org/',
  },
  {
    bg: '#c8d6e6',
    heading: 'Celebrating National Book Lovers Day',
    body: 'Save 20% off SME Books through August 15 when you use code BookLover26 at checkout.',
    cta: 'Find Your Next Title',
    href: 'https://store.smenet.org/',
  },
  {
    bg: '#bdd0dd',
    heading: 'Discover Research and Advances at Ground Control',
    body: 'Join us at the 45th Ground Control Conference and experience an event dedicated to research and advances in ground control in mining.',
    cta: 'Register Now',
    href: 'https://groundcontrolmining.org/',
  },
  {
    bg: '#cdd8e4',
    heading: 'Discover the Latest Mineral Usage Statistics',
    body: 'The 2026 MEC Mineral Baby estimates the average American born this year will need 3.01 million pounds of minerals, metals, and fuels in their lifetime.',
    cta: 'Learn More',
    href: 'https://mineralseducationcoalition.org/mining-mineral-statistics',
  },
];

const DEFAULT_INSPIRING_CARDS = [
  { label: 'volunteer photo', bg: '#e4edf4', heading: 'Learn how to get involved with SME.', cta: 'Volunteer Opportunities', href: 'https://www.smenet.org/volunteer' },
  { label: 'webinar photo', bg: '#e4edf4', heading: 'Search the webinar library for live online learning or on-demand.', cta: 'Shop Now', href: 'https://store.smenet.org/21qjg8c' },
  { label: 'studios photo', bg: '#e4edf4', heading: 'NEW videos added - conference lectures and podcasts now available.', cta: 'Watch Now', href: 'https://media.smenet.org' },
];

const clamp = (s, n) => (s.length > n ? s.slice(0, n).trimEnd() + '…' : s);

function getInitialLook() {
  if (typeof window === 'undefined') return 'real';
  return new URLSearchParams(window.location.search).get('look') === 'wireframe' ? 'wireframe' : 'real';
}

export default function HomePage() {
  const [look] = useState(getInitialLook);
  const [posts, setPosts] = useState([]);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [inspiringCards, setInspiringCards] = useState(DEFAULT_INSPIRING_CARDS);
  const [postsError, setPostsError] = useState(null);
  const [slidesError, setSlidesError] = useState(null);
  const [cardsError, setCardsError] = useState(null);

  useEffect(() => {
    wpFetch(POSTS_QUERY)
      .then((data) => setPosts(data?.posts?.nodes ?? []))
      .catch((err) => setPostsError(err.message));

    wpFetch(HERO_SLIDES_QUERY)
      .then((data) => {
        const nodes = data?.heroSlides?.nodes ?? [];
        if (nodes.length > 0) {
          setSlides(
            nodes.map((n) => ({
              bg: n.heroSlideFields.backgroundColor || '#c1cfe3',
              heading: n.heroSlideFields.heading,
              body: n.heroSlideFields.body,
              cta: n.heroSlideFields.ctaLabel,
              href: n.heroSlideFields.ctaUrl,
              img: n.heroSlideFields.image?.node?.sourceUrl ?? null,
            }))
          );
        }
      })
      .catch((err) => setSlidesError(err.message));

    wpFetch(INSPIRING_CARDS_QUERY)
      .then((data) => {
        const nodes = data?.inspiringCards?.nodes ?? [];
        if (nodes.length > 0) {
          setInspiringCards(
            nodes.map((n) => ({
              label: n.inspiringCardFields.photoLabel || '',
              bg: '#e4edf4',
              heading: n.inspiringCardFields.heading,
              cta: n.inspiringCardFields.ctaLabel,
              href: n.inspiringCardFields.ctaUrl,
              img: n.inspiringCardFields.image?.node?.sourceUrl ?? null,
            }))
          );
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
