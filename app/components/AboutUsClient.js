'use client';

import { useEffect, useState } from 'react';
import { wpFetch } from '../../lib/wpgraphql';
import { BOARD_MEMBERS_QUERY, mapBoardMembers } from '../../lib/queries';
import { useLoginInfo } from './useLoginInfo';
import AboutUs from './AboutUs';

export default function AboutUsClient() {
  const [loginInfo, setLoginInfo] = useLoginInfo();
  // null = not yet loaded — same reasoning as Inspiring Cards on the
  // homepage: board composition changes periodically, so this only ever
  // renders from a live fetch, never from stale build-time content.
  const [boardMembers, setBoardMembers] = useState(null);
  const [boardError, setBoardError] = useState(null);

  useEffect(() => {
    wpFetch(BOARD_MEMBERS_QUERY)
      .then((data) => {
        setBoardMembers(mapBoardMembers(data?.boardMembers?.nodes ?? []));
        setBoardError(null);
      })
      .catch((err) => {
        setBoardMembers([]);
        setBoardError(err.message);
      });
  }, []);

  return (
    <AboutUs
      loginInfo={loginInfo}
      onAuthChange={setLoginInfo}
      boardMembers={boardMembers}
      boardError={boardError}
    />
  );
}
