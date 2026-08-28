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
  '/login', // WP page hosting the [sme_rm_login_widget] SSO shortcode
];

// The SME Re:Members SSO plugin always round-trips back through home_url()
// (i.e. bare "/") with one of these query params, regardless of what path
// the login attempt started from — so path-prefix matching alone would miss
// the callback entirely and the login would silently never complete.
const SSO_QUERY_PARAMS = [
  'sso',
  'sme_rm_pre_clear',
  'sso_callback',
  'sso_check',
  'sso_revalidate',
  'rm_login_error',
  'rm_logout_check',
];

// The grey-cloud DNS record pointing straight at SiteGround.
const WP_ORIGIN_HOST = 'origin.mineasteroids.org';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isWpPath =
      WP_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix)) ||
      SSO_QUERY_PARAMS.some((param) => url.searchParams.has(param));

    if (isWpPath) {
      // Keep the original Host header (mineasteroids.org) so SiteGround
      // serves the right site, but resolve the connection to the real origin.
      return fetch(request, { cf: { resolveOverride: WP_ORIGIN_HOST } });
    }

    return env.ASSETS.fetch(request);
  },
};
