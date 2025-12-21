import { useMemo } from 'react';

export type DeviceOS = 'iOS' | 'Android' | 'Linux' | 'Other';

export function useDeviceOS(): DeviceOS {
  const os = useMemo<DeviceOS>(() => {
    if (typeof window === 'undefined') return 'Other';

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';

    if (/android/i.test(userAgent)) {
      return 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return 'iOS';
    }

    if (/linux/i.test(userAgent)) {
      return 'Linux';
    }

    return 'Other';
  }, []);

  return os;
}
