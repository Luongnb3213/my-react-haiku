import { useRef, useState } from 'react';
import './App.css';
import { useHover } from './lib/hooks';
import { useClickOutside } from './lib/hooks/useClickOutside';
import { useToggle } from './lib/hooks/useToggle';
import { useEventListener } from './lib/hooks/useEventListener';
import { useMousePosition } from './lib/hooks/useMousePosition';
import { useWindowSize } from './lib/hooks/useWindowSize';
import { useBatteryStatus } from './lib/hooks/useBatteryStatus';

function App() {
  const { level, isCharging } = useBatteryStatus();
  
  return (
    <div>
      <p>Battery Level: {level}</p>
      <p>Is Battery Charging: {isCharging ? 'True' : 'False'}</p>
    </div>
  );
}

export default App;
