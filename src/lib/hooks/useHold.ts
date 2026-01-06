import { useCallback, useEffect, useMemo, useRef } from 'react';

export type UseHoldOptions = {
  doPreventDefault?: boolean;
  delay?: number; // ms
};

type AnyEvent =
  | React.MouseEvent<HTMLElement>
  | React.TouchEvent<HTMLElement>
  | React.PointerEvent<HTMLElement>
  | React.KeyboardEvent<HTMLElement>;

type Bindings = {
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;

  onTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchCancel: (e: React.TouchEvent<HTMLElement>) => void;

  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel: (e: React.PointerEvent<HTMLElement>) => void;

  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  onKeyUp: (e: React.KeyboardEvent<HTMLElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
  onContextMenu: (e: React.MouseEvent<HTMLElement>) => void;
};

/**
 * useHold(callback, { delay, doPreventDefault })
 * - Trigger callback after holding press for `delay` ms while still pressed.
 * - Returns bindings to spread onto a target element: <button {...bindings} />
 */

export function useHold(callback: () => void, options?: UseHoldOptions): Bindings {
  const opts = useMemo(() => {
    return {
      ...options,
      delay: options?.delay ?? 500,
      doPreventDefault: options?.doPreventDefault ?? true,
    };
  }, [options]);

  const cbRef = useRef(callback);
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  const timerRef = useRef<number | null>(null);
  // this will prevent multiple starts
  const holdingRef = useRef(false);
  // this will make sure callback fires only once per hold, avoid race condition
  const firedRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    holdingRef.current = false;
    firedRef.current = false;
  }, []);

  const stop = useCallback(() => {
    // Stop cancels pending timer; if already fired we still reset state to allow next hold
    if (!holdingRef.current && timerRef.current == null) return;
    clear();
  }, [clear]);

  const start = useCallback(
    (e: AnyEvent) => {
      if (holdingRef.current) return;
      holdingRef.current = true;
      firedRef.current = false;

      if (opts.doPreventDefault && e.cancelable) {
        e.preventDefault();
      }

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        if (!holdingRef.current || firedRef.current) return;
        firedRef.current = true;
        cbRef.current();
      }, opts.delay);
    },
    [opts],
  );

  useEffect(() => clear, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // only primary button; ignore right click / secondary
      if (typeof e.button === 'number' && e.button !== 0) return;
      // ignore non-primary pointer when multi-touch
      if (typeof e.isPrimary === 'boolean' && !e.isPrimary) return;
      start(e);
    },
    [start],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // If pointer events exist, this might still fire in some environments;
      // the internal holdingRef prevents double start.
      if (e.button !== 0) return;
      start(e);
    },
    [start],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLElement>) => {
      // multi-touch: ignore if >1 touches (common source of false holds)
      if (e.touches && e.touches.length > 1) return;
      start(e);
    },
    [start],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      // Optional: allow "hold" by keyboard (Space/Enter) for accessibility
      if (e.key !== ' ' && e.key !== 'Enter') return;
      // avoid repeating keydown events
      if (e.repeat) return;
      start(e);
    },
    [start],
  );

  const onContextMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (opts.doPreventDefault) e.preventDefault();
    },
    [opts.doPreventDefault],
  );

  return {
    // Mouse
    onMouseDown,
    onMouseUp: () => stop(),
    onMouseLeave: () => stop(),

    // Touch
    onTouchStart,
    onTouchEnd: () => stop(),
    onTouchCancel: () => stop(),

    // Pointer (best coverage)
    onPointerDown,
    onPointerUp: () => stop(),
    onPointerCancel: () => stop(),

    // Keyboard
    onKeyDown,
    onKeyUp: () => stop(),

    onBlur: () => stop(),

    // Prevent long-press menu (best effort)
    onContextMenu,
  };
}
