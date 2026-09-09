'use client';

import { useEffect, useState } from 'react';

// Read-only check against the SSO plugin's own headless "who am I" action —
// same-origin, so the browser sends the WP login cookie automatically once
// someone's signed in. Every page needs this for its utility bar's login
// widget, so it's a shared hook rather than copy-pasted per page.
export function useLoginInfo() {
  // null = still checking, false = logged out, object = logged in
  const [loginInfo, setLoginInfo] = useState(null);

  useEffect(() => {
    fetch('/wp-admin/admin-ajax.php?action=sme_rm_whoami', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => setLoginInfo(data?.success && data.data?.loggedIn ? data.data : false))
      .catch(() => setLoginInfo(false));
  }, []);

  return [loginInfo, setLoginInfo];
}
