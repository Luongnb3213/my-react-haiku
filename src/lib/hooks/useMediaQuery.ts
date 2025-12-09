import React, { useEffect } from 'react';

export function useMediaQuery(
  query: string,
  options?: {
    defaultValue?: boolean; // dùng để tránh flicker trong SSR ( khi có SSR)
    immediate?: boolean; // đánh giá ngay khi mount
    initializeWithValue?: boolean; // (Khi không có SSR thì để UI phản hồi ngay lập tức)
  },
): boolean {
  const { defaultValue = false, immediate = true, initializeWithValue } = options || {};

  const [matches, setMatches] = React.useState(() => {
    if (typeof window === 'undefined') return defaultValue ?? false;
    if (initializeWithValue == true) return matchMedia(query).matches;
    return defaultValue ?? false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    try {
      mql.addEventListener('change', handler);
    } catch (error) {
      mql.addListener(handler);
    }

    if (immediate) {
      setMatches(mql.matches);
    }

    return () => {
      try {
        mql.removeEventListener('change', handler);
      } catch (error) {
        mql.removeListener(handler);
      }
    };
  }, [query, defaultValue, immediate, initializeWithValue]);

  return matches;
}
