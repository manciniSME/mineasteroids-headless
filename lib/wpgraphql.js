const WPGRAPHQL_ENDPOINT =
  process.env.WPGRAPHQL_ENDPOINT || 'https://mineasteroids.org/graphql';

export async function wpFetch(query, variables = {}) {
  const res = await fetch(WPGRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await res.json();

  if (errors) {
    throw new Error(errors.map((e) => e.message).join('\n'));
  }

  return data;
}
