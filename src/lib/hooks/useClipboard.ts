import React, { useEffect } from 'react';

type UseClipboardOptions = {
  timeout?: number; // ms, thời gian giữ state `copied = true`
};

type UseClipboardResult = {
  copy: (value: string) => Promise<boolean>; // true nếu copy thành công
  copied: boolean; // đã copy gần đây hay chưa
  error: Error | null; // lỗi gần nhất (nếu có)
  isSupported: boolean; // browser hỗ trợ clipboard API không
};

export const useClipboard = (options?: UseClipboardOptions): UseClipboardResult => {
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const copy = React.useCallback(
    async (value: string): Promise<boolean> => {
      if (!navigator.clipboard) {
        const err = new Error('Clipboard API not supported');
        setError(err);
        return Promise.resolve(false);
      }

      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setError(null);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, options?.timeout || 2000);

        return true;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return false;
      }
    },
    [options?.timeout],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isSupported = typeof navigator !== 'undefined' && !!navigator.clipboard?.writeText;
  return { copy, copied, error, isSupported };
};
