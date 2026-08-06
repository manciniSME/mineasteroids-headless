'use client';

import { useEffect, useState } from 'react';
import { wpFetch } from '../lib/wpgraphql';

const POSTS_QUERY = `
  query GetPosts {
    posts(first: 10) {
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
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem' }}>
      <h1>mineasteroids.org — headless test</h1>
      <p>Pulled from WPGraphQL in the browser, client-side.</p>
      {loading && <p>Loading…</p>}
      {fetchError && <p>Couldn't reach WPGraphQL: {fetchError}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '1.5rem' }}>
            <h2>{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          </li>
        ))}
      </ul>
      {!loading && !fetchError && posts.length === 0 && (
        <p>No posts yet — publish something in WP admin.</p>
      )}
    </main>
  );
}
