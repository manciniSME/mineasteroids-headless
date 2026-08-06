const WPGRAPHQL_ENDPOINT =
  process.env.WPGRAPHQL_ENDPOINT || 'https://mineasteroids.org/graphql';

export async function wpFetch(query, variables = {}) {
  const url = new URL(WPGRAPHQL_ENDPOINT);
  url.searchParams.set('query', query);
  if (Object.keys(variables).length > 0) {
    url.searchParams.set('variables', JSON.stringify(variables));
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
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
