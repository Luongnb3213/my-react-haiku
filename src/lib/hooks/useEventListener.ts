import { useEffect, RefObject, useRef } from 'react';

export function useEventListener(
  event: string,
  handler: EventListener,
  target?: EventTarget | RefObject<EventTarget> | null | RefObject<null>,
  options?: AddEventListenerOptions,
) {
  const currentHandle = useRef<EventListener>(handler);

  useEffect(() => {
    currentHandle.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!target) return;
    let eventTarget: EventTarget | null;

    if (target && 'current' in target) {
      eventTarget = target.current;
    } else {
      eventTarget = target;
    }

    if (!eventTarget) return;

    const handler = (event: Event) => currentHandle.current(event);

    eventTarget.addEventListener(event, handler, options);

    return () => {
      eventTarget?.removeEventListener(event, handler, options);
    };
  }, [event, target, options]);
}
