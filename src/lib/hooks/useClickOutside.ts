import React from 'react';

type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: ClickOutsideHandler,
  enabled: boolean = true,
) {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
