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

function App() {
  const [dirty, toggleDirty] = useToggle(false, [true, false]);

  useConfirmExit({ enabled: dirty });

  return (
    <>
      <b>Try to close this tab with the window dirty!</b>
      <p>Dirty: {`${dirty}`}</p>
      <button onClick={() => toggleDirty()}>{dirty ? 'Set Clean' : 'Set Dirty'}</button>
    </>
  );
}

export default App;
