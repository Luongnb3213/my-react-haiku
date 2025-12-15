import { useCallback, useRef, useState } from 'react';
import { useEventListener } from './useEventListener';

type WindowSize = { width: number; height: number };

export function useWindowSize(options?: {
  enabled?: boolean; // default true
  initialValue?: WindowSize; // default {width: 0, height: 0} (SSR-safe)
  throttleMs?: number; // default 0 (RAF batching hoặc throttle giống bạn vừa làm)
}): WindowSize {
  const { enabled = true, initialValue = { width: 0, height: 0 }, throttleMs = 0 } = options || {};
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth || initialValue.width,
    height: window.innerHeight || initialValue.height,
  });
  const rafIdRef = useRef<number | null>(null); // this will for the requestAnimationFrame id ( max 60 render / 1s)

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExecRef = useRef<number>(0);

  const handler = useCallback(
    (e: Event) => {
      if (!enabled) return;
      if (throttleMs <= 0) {
        if (rafIdRef.current != null) return;

        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        });
      } else {
        const now = Date.now();
        const difference = now - lastExecRef.current;
        console.log('resized');

        if (difference >= throttleMs) {
          lastExecRef.current = now;
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        } else {
          if (timeoutIdRef.current == null) {
            timeoutIdRef.current = setTimeout(() => {
              timeoutIdRef.current = null;
              lastExecRef.current = Date.now();
              setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
              });
            }, throttleMs - difference);
          }
        }
      }
    },
    [enabled, throttleMs, initialValue],
  );

  useEventListener('resize', handler, window);

  return windowSize;
}
