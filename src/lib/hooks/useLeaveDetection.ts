import { useEffect, useRef } from 'react';

export function useLeaveDetection(options: { enabled?: boolean; onLeave: () => void }) {
  const { enabled = true, onLeave } = options;

  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const triggerOnce = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      onLeave();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') triggerOnce();
      if (document.visibilityState === 'visible') {
        // Reset the trigger when the document becomes visible again
        triggeredRef.current = false;
      }
    };

    const handleBlur = () => {
      triggerOnce();
    };

    const handleFocus = () => {
      // Reset the trigger when the window regains focus
      if (!triggeredRef.current) return;
      triggeredRef.current = false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      triggeredRef.current = false;
    };
  }, [enabled, onLeave]);
}
