import { useEffect } from 'react';

export function useConfirmExit(options?: {
  enabled?: boolean; // default false (thường)
  message?: string;
}) {
  const { enabled = false, message = 'Are you sure you want to leave?' } = options || {};

  useEffect(() => {
    if (typeof window === undefined) return;

    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, message]);
}
