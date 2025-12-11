import { useRef, useState } from 'react';
import './App.css';
import { useHover } from './lib/hooks';
import { useClickOutside } from './lib/hooks/useClickOutside';
import { useToggle } from './lib/hooks/useToggle';
import { useEventListener } from './lib/hooks/useEventListener';

function App() {
  const [countWindow, setCountWindow] = useState(0);
  const [countRef, setCountRef] = useState(0);

  // Button Ref
  const buttonRef = useRef(null);

  // Event Handlers
  const countW = () => setCountWindow(countWindow + 1);
  const countR = () => setCountRef(countRef + 1);

  // Example 1: Window Event
  useEventListener('resize', countW, window);

  // Example 2: Element Event
  useEventListener('click', countR, buttonRef);

  return (
    <>
      <b>Window Event Triggered {countWindow} Times!</b>
      <b>Ref Event Triggered {countRef} Times!</b>
      <button ref={buttonRef}>Click Me</button>
    </>
  );
}

export default App;
