import { useEffect, useMemo, useRef, useState } from 'react';

export type UseGeolocationOptions = {
  enableHighAccuracy?: boolean; // default false
  timeout?: number; // default 5000
  maximumAge?: number; // default 0
  watch?: boolean; // default false
};

type GeoError = {
  code: number;
  message: string;
};

export type UseGeolocationResult = {
  latitude: number | null;
  longitude: number | null;
  error: GeoError | null;
  loading: boolean;
};

const DEFAULTS: Required<UseGeolocationOptions> = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
  watch: false,
};

function errorFunctionMessage(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'User denied the request for geolocation.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable.';
    case error.TIMEOUT:
      return 'The request to get user location timed out.';
    default:
      return 'An unknown error occurred.';
  }
}

function normalizeError(err: unknown): GeoError {
  // GeolocationPositionError in browsers typically has { code, message }
  if (
    err &&
    typeof err === 'object' &&
    'code' in err &&
    'message' in err &&
    typeof (err as any).code === 'number' &&
    typeof (err as any).message === 'string'
  ) {
    return {
      code: (err as any).code,
      message: errorFunctionMessage(err as GeolocationPositionError),
    };
  }
  return { code: -1, message: 'Unknown geolocation error' };
}

export function useGeolocation(options?: UseGeolocationOptions): UseGeolocationResult {
  const opts = useMemo(() => ({ ...DEFAULTS, ...(options ?? {}) }), [options]);

  const [state, setState] = useState<UseGeolocationResult>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const watchIdRef = useRef<number | null>(null);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    const seq = ++requestSeqRef.current;

    if (typeof navigator === 'undefined') {
      setState({
        latitude: null,
        longitude: null,
        error: { code: -1, message: 'Geolocation is not available (SSR).' },
        loading: false,
      });
      return;
    }

    const geo = navigator.geolocation;
    if (!geo) {
      setState({
        latitude: null,
        longitude: null,
        error: { code: -1, message: 'Geolocation is not supported by this browser.' },
        loading: false,
      });
      return;
    }

    setState(prev => ({
      latitude: prev.latitude,
      longitude: prev.longitude,
      error: null,
      loading: true,
    }));

    const onSuccess = (pos: GeolocationPosition) => {
      // ignore stale callbacks (StrictMode / options changes / unmount)
      if (requestSeqRef.current !== seq) return;

      setState({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      if (requestSeqRef.current !== seq) return;

      setState(prev => ({
        latitude: prev.latitude,
        longitude: prev.longitude,
        error: normalizeError(err),
        loading: false,
      }));
    };

    const positionOptions: PositionOptions = {
      enableHighAccuracy: opts.enableHighAccuracy,
      timeout: opts.timeout,
      maximumAge: opts.maximumAge,
    };

    if (opts.watch) {
      const id = geo.watchPosition(onSuccess, onError, positionOptions);
      watchIdRef.current = id;
    } else {
      geo.getCurrentPosition(onSuccess, onError, positionOptions);
    }

    return () => {
      if (watchIdRef.current != null) {
        try {
          geo.clearWatch(watchIdRef.current);
        } finally {
          watchIdRef.current = null;
        }
      }
    };
  }, [opts]);

  return state;
}
