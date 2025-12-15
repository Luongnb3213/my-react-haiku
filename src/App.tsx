import { useRef, useState } from 'react';
import './App.css';
import { useHover } from './lib/hooks';
import { useClickOutside } from './lib/hooks/useClickOutside';
import { useToggle } from './lib/hooks/useToggle';
import { useEventListener } from './lib/hooks/useEventListener';
import { useMousePosition } from './lib/hooks/useMousePosition';
import { useWindowSize } from './lib/hooks/useWindowSize';

function App() {
  const { height, width } = useWindowSize({ enabled: true, throttleMs: 200 });

  return (
    <div>
      <b>Resize Your Window!</b>

      <p>
        Window Height: <span>{height}</span>
      </p>
      <p>
        Window Width: <span>{width}</span>
      </p>
    </div>
  );
}

export default App;
