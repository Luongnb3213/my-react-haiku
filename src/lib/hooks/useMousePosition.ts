import { useEffect, useRef, useState } from 'react';

type MousePosition = { x: number; y: number };

export function useMousePosition(options?: {
  enabled?: boolean; // default: true
  type?: 'client' | 'page' | 'screen'; // default: "client"
  initialValue?: MousePosition; // default: {x:0,y:0}

  target?: React.RefObject<HTMLElement | null>; // default: window
  throttleMs?: number; // default: 0 (no throttle)
  usePointer?: boolean; // default: false (mousemove) | true (pointermove)
}): MousePosition {
  const {
    enabled = true,
    type = 'client',
    initialValue = { x: 0, y: 0 },
    target = window,
    throttleMs = 0,
    usePointer = false,
  } = options || {};
  const [state, setState] = useState<MousePosition>(initialValue);
  const lastPosRef = useRef<MousePosition>(initialValue);
  const rafIdRef = useRef<number | null>(null);

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExecRef = useRef<number>(0);

  function getPosition(e: MouseEvent, type: 'client' | 'page' | 'screen'): MousePosition {
    switch (type) {
      case 'page':
        return { x: e.pageX, y: e.pageY };
      case 'screen':
        return { x: e.screenX, y: e.screenY };
      default:
        return { x: e.clientX, y: e.clientY };
    }
  }

  const scheduleUpdate = () => {
    if (throttleMs <= 0) {
      if (rafIdRef.current != null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setState(lastPosRef.current);
      });

      return;
    } else {
      const now = Date.now();
      const elapsed = now - lastExecRef.current;

      if (elapsed >= throttleMs) {
        lastExecRef.current = now;
        setState(lastPosRef.current);
        return;
      }

      if (timeoutIdRef.current == null) {
        timeoutIdRef.current = setTimeout(() => {
          timeoutIdRef.current = null;
          lastExecRef.current = Date.now();
          setState(lastPosRef.current);
        }, throttleMs - elapsed);
      }
    }
  };

  useEffect(() => {
    if (!enabled) return;

    let resolvedTarget: EventTarget | null = null;

    if (typeof window !== 'undefined' && target === window) {
      resolvedTarget = window;
    } else if (target && 'current' in target) {
      resolvedTarget = target.current;
    }

    if (!resolvedTarget) return;

    // In order to resolve types (EventListener expects Event), type to Event and guard/force
    const wrappedHandleMove = (e: Event) => {
      // Only handle MouseEvent or PointerEvent instances
      if (e instanceof MouseEvent) {
        const pos = getPosition(e as MouseEvent, type);
        lastPosRef.current = pos;
        scheduleUpdate();
      }
    };

    const eventType = usePointer ? 'pointermove' : 'mousemove';

    resolvedTarget.addEventListener(eventType, wrappedHandleMove as EventListener, {
      passive: true,
    });

    return () => {
      resolvedTarget.removeEventListener(eventType, wrappedHandleMove as EventListener);
    };
  }, [enabled, type, target, throttleMs, usePointer]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      if (timeoutIdRef.current != null) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return state;
}
