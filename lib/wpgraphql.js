const WPGRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT || 'https://mineasteroids.org/graphql';

export async function wpFetch(query, variables = {}) {
  const res = await fetch(WPGRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const raw = await res.text();

  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(
      `Non-JSON response, status ${res.status}: ${raw.slice(0, 300)}`
    );
  }

  const { data, errors } = json;

  if (errors) {
    throw new Error(errors.map((e) => e.message).join('\n'));
  }

  return data;
}
