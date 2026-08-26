// Worker entry: routes mineasteroids.org/*
// - WP admin/API paths -> SiteGround origin, unchanged
// - everything else -> the static Next.js export (bound as ASSETS)

const WP_PATH_PREFIXES = [
  '/wp-admin',
  '/wp-login.php',
  '/wp-json',
  '/wpapi-4f2a',
  '/wp-content',
  '/wp-includes',
  '/xmlrpc.php',
];

// The grey-cloud DNS record pointing straight at SiteGround.
const WP_ORIGIN_HOST = 'origin.mineasteroids.org';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isWpPath = WP_PATH_PREFIXES.some((prefix) =>
      url.pathname.startsWith(prefix)
    );

    if (isWpPath) {
      // Keep the original Host header (mineasteroids.org) so SiteGround
      // serves the right site, but resolve the connection to the real origin.
      return fetch(request, { cf: { resolveOverride: WP_ORIGIN_HOST } });
    }

    return env.ASSETS.fetch(request);
  },
};
