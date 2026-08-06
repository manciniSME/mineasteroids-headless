'use client';

import { useEffect, useState } from 'react';
import { wpFetch } from '../lib/wpgraphql';

const POSTS_QUERY = `
  query GetPosts {
    posts(first: 6) {
      nodes {
        id
        title
        slug
        excerpt
        date
      }
    }
  }
`;

const TOP_LINKS = ['Link', 'Link', 'Link', 'Link', 'Link', 'Link', 'Link', 'Link', 'Link'];
const NAV_LINKS = ['Nav 1', 'Nav 2', 'Nav 3', 'Nav 4', 'Nav 5', 'Nav 6'];

const FEATURE_CARDS = [
  { title: 'Card 1', body: 'Placeholder copy describing this section.' },
  { title: 'Card 2', body: 'Placeholder copy describing this section.' },
  { title: 'Card 3', body: 'Placeholder copy describing this section.' },
  { title: 'Card 4', body: 'Placeholder copy describing this section.' },
  { title: 'Card 5', body: 'Placeholder copy describing this section.' },
];

const FOOTER_COLUMNS = [
  { heading: 'Column 1', links: ['Link', 'Link', 'Link', 'Link'] },
  { heading: 'Column 2', links: ['Link', 'Link', 'Link', 'Link'] },
  { heading: 'Column 3', links: ['Link', 'Link'] },
];

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wpFetch(POSTS_QUERY)
      .then((data) => setPosts(data?.posts?.nodes ?? []))
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Top utility bar */}
      <div style={{ background: '#333', color: '#fff', fontSize: '0.75rem' }}>
        <div
          className="wf-container"
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '0.4rem 1.5rem' }}
        >
          {TOP_LINKS.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>

      {/* Header: logo + primary nav */}
      <header style={{ borderBottom: '1px solid #ccc' }}>
        <div
          className="wf-container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}
        >
          <div
            className="wf-box"
            style={{ width: 160, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Logo
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {NAV_LINKS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero carousel */}
      <section
        className="wf-box"
        style={{
          height: 360,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '0.75rem',
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Heading</div>
        <div style={{ maxWidth: 480 }}>Placeholder copy for the hero slide goes here.</div>
        <span className="wf-btn">Button</span>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.4rem' }}>
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              style={{ width: 8, height: 8, borderRadius: '50%', background: n === 1 ? '#333' : '#bbb' }}
            />
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="wf-container" style={{ padding: '3rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {FEATURE_CARDS.map((card) => (
            <div key={card.title} style={{ textAlign: 'center' }}>
              <div
                className="wf-box"
                style={{ width: 64, height: 64, margin: '0 auto 0.75rem', borderRadius: '50%' }}
              />
              <div style={{ fontWeight: 'bold', marginBottom: '0.4rem' }}>{card.title}</div>
              <p style={{ fontSize: '0.85rem', color: '#555' }}>{card.body}</p>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'underline' }}>
                Read More
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News — real WPGraphQL content */}
      <section style={{ background: '#f5f5f5', padding: '3rem 1.5rem' }}>
        <div className="wf-container">
          <h2 style={{ marginTop: 0 }}>Latest News</h2>
          {loading && <p>Loading…</p>}
          {fetchError && <p>Couldn't reach WPGraphQL: {fetchError}</p>}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {posts.map((post) => (
              <div key={post.id} className="wf-box" style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#111' }}>
                  {post.title}
                </div>
                <div
                  style={{ fontSize: '0.85rem' }}
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              </div>
            ))}
          </div>
          {!loading && !fetchError && posts.length === 0 && <p>No posts yet.</p>}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#222', color: '#ccc', padding: '3rem 1.5rem 1.5rem' }}>
        <div
          className="wf-container"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem' }}
        >
          <div
            className="wf-box"
            style={{ width: 140, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Logo
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.6rem', color: '#fff' }}>{col.heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                {col.links.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.6rem', color: '#fff' }}>Contact</div>
            <div>Address line</div>
            <div>Phone number</div>
            <div>Email address</div>
          </div>
        </div>
        <div className="wf-container" style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#888' }}>
          Copyright placeholder.
        </div>
      </footer>
    </div>
  );
}
