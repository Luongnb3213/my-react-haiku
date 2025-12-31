import { useEffect, useRef } from 'react';

export function useCookieListener(
  callback: (value: string | undefined, key: string) => void,
  keys?: string[],
) {
  const prevCookiesRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const parseCookies = () => {
      return document.cookie
        .split('; ')
        .map(cookieStr => cookieStr.split('='))
        .reduce((acc, [key, ...valParts]) => {
          acc[key] = valParts.join('=');
          return acc;
        }, {} as Record<string, string>);
    };

    prevCookiesRef.current = parseCookies();

    const intervalId = window.setInterval(() => {
      const nextCookies = parseCookies();
      const prevCookies = prevCookiesRef.current;

      const allKeys = new Set<string>([...Object.keys(prevCookies), ...Object.keys(nextCookies)]);

      allKeys.forEach(key => {
        if (keys && !keys.includes(key)) return;
        const prevValue = prevCookies[key];
        const nextValue = nextCookies[key];
        if (prevValue !== nextValue) {
          callback(nextValue, key);
        }
      });

      prevCookiesRef.current = nextCookies;
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [callback, keys]);
}
