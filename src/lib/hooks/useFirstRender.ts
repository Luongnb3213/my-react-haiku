import React from 'react';

export const useFirstRender = (): boolean => {
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return isFirstRender.current;
};
