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

export default async function HomePage() {
  const data = await wpFetch(POSTS_QUERY);
  const posts = data?.posts?.nodes ?? [];

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem' }}>
      <h1>mineasteroids.org — headless test</h1>
      <p>Pulled from WPGraphQL at build time.</p>
      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '1.5rem' }}>
            <h2>{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          </li>
        ))}
      </ul>
      {posts.length === 0 && (
        <p>No posts yet — publish something in WP admin and rebuild.</p>
      )}
    </main>
  );
}
