import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type UseIdleOptions = {
  events?: (keyof WindowEventMap | string)[];
  initialState?: boolean;
};

const DEFAULT_EVENTS: (keyof WindowEventMap)[] = [
  'keypress',
  'mousemove',
  'touchmove',
  'click',
  'scroll',
];

export function useIdle(timeout: number, options?: UseIdleOptions): boolean {
  const [isIdle, setIsIdle] = useState(options?.initialState ?? false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const seqRef = useRef(0);
  const opts = useMemo(
    () => ({
      events: options?.events ?? DEFAULT_EVENTS,
      initialState: options?.initialState ?? true,
    }),
    [options?.events, options?.initialState],
  );

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeout);
  }, [opts.events, timeout]);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsIdle(opts.initialState);
      return;
    }

    const seq = ++seqRef.current;

    const onActivity = () => {
      if (seqRef.current !== seq) return;
      setIsIdle(false);
      // Restart idle countdown
      startTimer();
    };

    startTimer();

    const listenerOptions: AddEventListenerOptions = { passive: true };

    for (const ev of opts.events) {
      window.addEventListener(ev as string, onActivity, listenerOptions);
    }

    return () => {
      clearTimer();
      for (const ev of opts.events) {
        window.removeEventListener(ev as string, onActivity, listenerOptions);
      }
    };
  }, [opts.events, timeout]);

  return isIdle;
}
