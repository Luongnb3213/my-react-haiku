import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { useHover } from './lib/hooks';
import { useClickOutside } from './lib/hooks/useClickOutside';
import { useToggle } from './lib/hooks/useToggle';
import { useEventListener } from './lib/hooks/useEventListener';
import { useMousePosition } from './lib/hooks/useMousePosition';
import { useWindowSize } from './lib/hooks/useWindowSize';
import { useBatteryStatus } from './lib/hooks/useBatteryStatus';
import { useConfirmExit } from './lib/hooks/useConfirmExit';
import { useFirstRender } from './lib/hooks/useFirstRender';
import { useFavicon } from './lib/hooks/useFavicon';
import { useFullscreen } from './lib/hooks/useFullscreen';
import { useInterval } from './lib/hooks/useInterval';

function App() {
  const [count, setCount] = useState(0);
  const { start, stop } = useInterval(() => {
    setCount(c => c + 1);
  }, 1000);

  const handleRestart = () => {
    stop();
    setTimeout(() => {
      setCount(0);
      start(1000);
    }, 50);
  };

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={stop}>Stop Counter</button>
      <button onClick={() => handleRestart()}>Restart Counter</button>
    </>
  );
}

export default App;
