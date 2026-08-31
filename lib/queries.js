export const POSTS_QUERY = `
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

export const HERO_SLIDES_QUERY = `
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
              sourceUrl(size: LARGE)
            }
          }
        }
      }
    }
  }
`;

export const INSPIRING_CARDS_QUERY = `
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
              sourceUrl(size: LARGE)
            }
          }
        }
      }
    }
  }
`;

export const DEFAULT_SLIDES = [
  {
    bg: '#4a4a42',
    heading: 'Take the Next Step in Your Engineering Career',
    body: 'Our PE Review Course covers each of the examination subject topics, terminology, concepts and also provides a multitude of information and resources.',
    cta: 'Register Now',
    href: 'https://smepereviewcourse.org/',
  },
  {
    bg: '#3b4756',
    heading: 'Mark Your Calendar for MINEXCHANGE',
    body: 'Discover the resources, knowledge and people to take you to the next level at MINEXCHANGE 2027.',
    cta: 'Save the Date',
    href: 'https://smeannualconference.org/',
  },
  {
    bg: '#4d4740',
    heading: 'Discover the Latest Mineral Usage Statistics',
    body: 'The 2026 MEC Mineral Baby estimates the average American born this year will need 3.01 million pounds of minerals, metals, and fuels in their lifetime.',
    cta: 'Learn More',
    href: 'https://mineralseducationcoalition.org/mining-mineral-statistics',
  },
];

export const DEFAULT_INSPIRING_CARDS = [
  { label: 'volunteer photo', bg: '#e4edf4', heading: 'Learn how to get involved with SME.', cta: 'Volunteer Opportunities', href: 'https://www.smenet.org/volunteer' },
  { label: 'webinar photo', bg: '#e4edf4', heading: 'Search the webinar library for live online learning or on-demand.', cta: 'Shop Now', href: 'https://store.smenet.org/21qjg8c' },
  { label: 'studios photo', bg: '#e4edf4', heading: 'NEW videos added - conference lectures and podcasts now available.', cta: 'Watch Now', href: 'https://media.smenet.org' },
];

export function mapSlides(nodes) {
  return nodes.map((n) => ({
    bg: n.heroSlideFields.backgroundColor || '#c1cfe3',
    heading: n.heroSlideFields.heading,
    body: n.heroSlideFields.body,
    cta: n.heroSlideFields.ctaLabel,
    href: n.heroSlideFields.ctaUrl,
    img: n.heroSlideFields.image?.node?.sourceUrl ?? null,
  }));
}

export function mapCards(nodes) {
  return nodes.map((n) => ({
    label: n.inspiringCardFields.photoLabel || '',
    bg: '#e4edf4',
    heading: n.inspiringCardFields.heading,
    cta: n.inspiringCardFields.ctaLabel,
    href: n.inspiringCardFields.ctaUrl,
    img: n.inspiringCardFields.image?.node?.sourceUrl ?? null,
  }));
}
