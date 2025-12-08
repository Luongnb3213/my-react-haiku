import React from 'react';

export type ClickOutsideEvent = MouseEvent | TouchEvent;

export type ClickOutsideHandler = (event: ClickOutsideEvent) => void;

type MaybeRefElement = HTMLElement | null | undefined | React.RefObject<HTMLElement | null>;

export type UseClickOutsideOptions = {
  enabled?: boolean;
  events?: Array<'mousedown' | 'mouseup' | 'click' | 'touchstart' | 'pointerdown'>;
  ignore?: MaybeRefElement[];
  capture?: boolean;
};

export function useClickOutside(
  target: React.RefObject<HTMLElement | null> | Array<React.RefObject<HTMLElement | null>>,
  handler: ClickOutsideHandler,
  options: UseClickOutsideOptions = {},
) {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const {
      enabled = true,
      events = ['mousedown', 'touchstart'],
      ignore = [],
      capture = false,
    } = options;

    if (!enabled) return;

    const targetRefs = Array.isArray(target) ? target : [target];

    const resolveElement = (maybe: MaybeRefElement): HTMLElement | null => {
      if (!maybe) return null;
      if (Object.prototype.hasOwnProperty.call(maybe, 'current')) {
        return (maybe as React.RefObject<HTMLElement | null>).current;
      }
      return maybe as HTMLElement;
    };

    const getTargetElements = (): HTMLElement[] =>
      targetRefs.map(ref => ref.current).filter((el): el is HTMLElement => Boolean(el));

    const getIgnoreElements = (): HTMLElement[] =>
      ignore.map(item => resolveElement(item)).filter((el): el is HTMLElement => Boolean(el));

    const listener = (event: ClickOutsideEvent) => {
      const eventTarget = event.target as Node | null;
      if (!eventTarget) return;

      const targets = getTargetElements();
      if (!targets.length) return;

      if (targets.some(el => el.contains(eventTarget))) {
        return;
      }

      const ignored = getIgnoreElements();
      if (ignored.some(el => el.contains(eventTarget))) {
        return;
      }

      handler(event);
    };

    const uniqueEvents = Array.from(new Set(events));

    uniqueEvents.forEach(eventName => {
      document.addEventListener(eventName, listener, capture);
    });

    return () => {
      uniqueEvents.forEach(eventName => {
        document.removeEventListener(eventName, listener, capture);
      });
    };
  }, [target, handler, options]);
}
