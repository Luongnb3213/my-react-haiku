import { useRef, useState } from 'react';
import './App.css';
import { useHover } from './lib/hooks';
import { useClickOutside } from './lib/hooks/useClickOutside';
import { useToggle } from './lib/hooks/useToggle';
import { useEventListener } from './lib/hooks/useEventListener';
import { useMousePosition } from './lib/hooks/useMousePosition';

function App() {
     const { x, y } = useMousePosition();

    return (
      <div>
        <b>Hover This Container</b>
        <p>{`X: ${x} | Y: ${y}`}</p>
      </div>
    );
}

export default App;
