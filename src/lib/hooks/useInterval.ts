import { useCallback, useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null = 200) {
  const callbackRef = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!callback) return;
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, delay);

    return () => clearInterval(intervalRef.current!);
  }, [delay]);

  const stop = useCallback(() => {
    if (!delay) return;
    clearInterval(intervalRef.current!);
  }, [delay]);

  const start = useCallback(
    (delay: number | null = 200) => {
      if (!delay) return;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, delay);
    },
    [delay],
  );

  return { stop, start };
}
