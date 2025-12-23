import { useCallback, useEffect, useState } from 'react';

export function useFullscreen<T extends HTMLElement = HTMLElement>() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enter = useCallback((element?: T | null) => {
    if (typeof document === 'undefined') return;

    if (!element) {
      element = document.documentElement as T;
    }

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }, []);

  const exit = useCallback(() => {
    if (typeof document === 'undefined') return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  const toggle = useCallback(
    (element?: T | null) => {
      setIsFullscreen(prev => {
        if (prev) {
          exit();
        } else {
          enter(element);
        }
        return !prev;
      });
    },
    [isFullscreen],
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return {
    isFullscreen,
    enter,
    exit,
    toggle,
  };
}
