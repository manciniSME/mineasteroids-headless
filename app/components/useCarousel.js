'use client';

import { useEffect, useRef, useState } from 'react';

export function useCarousel(count, intervalMs = 6000) {
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const countRef = useRef(count);
  countRef.current = count;

  const go = (n) => setI(((n % countRef.current) + countRef.current) % countRef.current);

  const start = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => go(i + 1), intervalMs);
  };

  useEffect(() => {
    start();
    return () => clearInterval(timer.current);
  }, [i, count]);

  return { i, go, start };
}
