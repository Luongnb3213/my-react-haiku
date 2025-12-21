import { useRef, useState } from 'react';
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

function App() {
  const isFirst = useFirstRender();

  return (
    <>
      <b>First Render? - {isFirst ? 'Yes' : 'No'}</b>
    </>
  );
}

export default App;
