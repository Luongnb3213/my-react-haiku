import { useRef, useState } from 'react';
import './App.css';
import { useHover } from './lib/hooks';
import { useClickOutside } from './lib/hooks/useClickOutside';

function App() {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  const handleClickOutside = () => setCount(count + 1);

  useClickOutside(ref, handleClickOutside);

  return (
    <>
      <b>Clicked Outside {count} Times!</b>
      <button ref={ref}>Click Outside Of Me!</button>
    </>
  );
}

export default App;
