import React, { useCallback, useEffect } from 'react';

export function useCookie<T = string>(
  key: string,
  options?: {
    defaultValue?: T;
    path?: string;
    expires?: Date | number; // days
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
  },
) {
  const [value, setValue] = React.useState<T | undefined>(options?.defaultValue);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const parseCookies = () => {
      const cookies: Record<string, string> = {};
      const all = document.cookie;
      if (!all) return cookies;
      const list = all.split('; ');
      for (let i = 0; i < list.length; i++) {
        const cookie = list[i];
        const p = cookie.indexOf('=');
        const name = cookie.substring(0, p);
        const value = cookie.substring(p + 1);
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
      return cookies;
    };

    const cookies = parseCookies();
    if (cookies[key]) {
      setValue(decodeURIComponent(cookies[key]) as T);
    }
  }, [key]);

  const updateCookie = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (typeof document === 'undefined') return;

      let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(
        String(newValue),
      )}; path=${options?.path || '/'}`;

      if (options?.expires) {
        if (typeof options.expires === 'number') {
          const date = new Date();
          date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
          cookieString += `; expires=${date.toUTCString()}`;
        } else if (options.expires instanceof Date) {
          cookieString += `; expires=${options.expires.toUTCString()}`;
        }
      }

      if (options?.secure) {
        cookieString += '; secure';
      }

      if (options?.sameSite) {
        cookieString += `; samesite=${options.sameSite}`;
      }

      document.cookie = cookieString;
    },
    [key, options],
  );

  const removeCookie = useCallback(() => {
    setValue(undefined);
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(key)}=; path=${
      options?.path || '/'
    }; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }, [key, options]);

  return {
    value,
    set: updateCookie,
    remove: removeCookie,
  };
}
