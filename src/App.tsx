import { useRef, useState } from 'react';
import './App.css';
import { useHover } from './lib/hooks';
import { useClickOutside } from './lib/hooks/useClickOutside';
import { useToggle } from './lib/hooks/useToggle';

function App() {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  const handleClickOutside = () => setCount(count + 1);

  useClickOutside(ref, handleClickOutside);

  const [theme, toggleTheme] = useToggle('dark', ['dark', 'light']);

  return (
    <>
      <b>Current {theme} Theme</b>
      <button onClick={toggleTheme} ref={ref}>
        Click to change theme!
      </button>
    </>
  );
}

export default App;
