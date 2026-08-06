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

const LOGO_SRC =
  'https://smenet.blob.core.windows.net/smecms/sme/media/sme/logos/sme-horz-white.png';

const TOP_LINKS = [
  'Visit UCA',
  'Community',
  'Join',
  'Store',
  'Events',
  'Publications',
  'Career Center',
  'SME Foundation',
];

const NAV_LINKS = [
  'About Us',
  'Membership',
  'Who We Serve',
  'Professional Development',
  'Student Resources',
];

const FEATURE_CARDS = [
  { title: 'About SME', body: 'An overview of the association and the industries it serves.' },
  { title: 'Become a Member', body: 'Membership options and the benefits of joining.' },
  { title: 'Mentor a Student', body: 'Ways to support the next generation of professionals.' },
  { title: 'Join the Community', body: 'Connect with peers and share resources online.' },
  { title: 'Member Stories', body: 'Profiles from across the membership.' },
];

const FOOTER_COLUMNS = [
  { heading: 'Explore', links: ['Navigation', 'Donate', 'Newsletter Signup', 'Advertise'] },
  { heading: 'Resources', links: ['Government Affairs', 'Directory', 'Brand Store', 'Careers'] },
  { heading: 'Legal', links: ['Privacy Policy', 'Consent Preferences'] },
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
      <div style={{ background: '#000', color: '#fff', fontSize: '0.75rem' }}>
        <div
          className="wf-container"
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem', padding: '0.4rem 1.5rem' }}
        >
          {TOP_LINKS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      {/* Header: logo + primary nav, dark overlay */}
      <header style={{ background: 'rgba(0,0,0,0.85)' }}>
        <div
          className="wf-container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}
        >
          <img src={LOGO_SRC} alt="Logo" style={{ height: 48 }} />
          <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>
            {NAV_LINKS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero carousel */}
      <section
        style={{
          height: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '0.75rem',
          background: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), #444',
          color: '#fff',
        }}
      >
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Headless Test Build</h1>
        <div style={{ maxWidth: 480 }}>
          A working preview of the WordPress + WPGraphQL + Cloudflare stack.
        </div>
        <span className="wf-btn">Learn More</span>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.4rem' }}>
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              style={{ width: 8, height: 8, borderRadius: '50%', background: n === 1 ? '#fff' : 'rgba(255,255,255,0.4)' }}
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
                style={{
                  width: 64,
                  height: 64,
                  margin: '0 auto 0.75rem',
                  borderRadius: '50%',
                  background: 'rgb(191, 215, 48)',
                }}
              />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{card.title}</h3>
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
              <div key={post.id} style={{ background: '#fff', border: '1px solid #ddd', padding: '1rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#111' }}>
                  {post.title}
                </h3>
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
          <img src={LOGO_SRC} alt="Logo" style={{ height: 40 }} />
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.6rem', color: '#fff' }}>{col.heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                {col.links.map((label) => (
                  <span key={label}>{label}</span>
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
          Headless test build — not for public indexing.
        </div>
      </footer>
    </div>
  );
}
