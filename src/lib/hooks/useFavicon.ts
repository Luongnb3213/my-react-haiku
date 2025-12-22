import { useEffect, useRef } from 'react';

export function useFavicon(
  href: string | null,
  options?: {
    rel?: string;
    type?: string;
  },
) {
  const { rel = 'icon', type = 'image/png' } = options || {};
  const prevHrefRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (href === null) return;
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

    if (!prevHrefRef.current && link) {
      prevHrefRef.current = link.href;
    }

    if (!link) {
      link = document.createElement('link') as HTMLLinkElement;
      link.rel = rel;
      link.type = type;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = href + '?v=' + Date.now() || '';

    return () => {
      if (prevHrefRef.current !== null && link) {
        link.href = prevHrefRef.current;
      }
    };
  }, [href, rel, type]);
}
