import { useCallback, useState } from 'react';

export function useToggle<T>(initialValue: T, options: [T, T]): [T, () => void] {
  if (options.length !== 2) {
    throw new Error('useToggle hook requires exactly two options to toggle between.');
  }

  if (!options.includes(initialValue)) {
    throw new Error('Initial value must be one of the provided options.');
  }

  const [state, setState] = useState<T>(initialValue);

  const [option1, option2] = options;

  const toggle = useCallback(() => {
    setState((prev: T) => {
      return prev === option1 ? option2 : option1;
    });
  }, [option1, option2]);

  return [state, toggle];
}
