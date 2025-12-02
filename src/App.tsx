import { useState } from 'react';
import './App.css';
import { useHover } from './lib/hooks';

function App() {
  const { ref, isHovered } = useHover<HTMLDivElement>();

  return (
    <div
      style={{
        width: 300,
        height: 300,
        backgroundColor: isHovered ? 'lightblue' : 'lightgray',
      }}
      ref={ref}
    >
      {isHovered ? 'Hovered' : 'Not hovered'}
    </div>
  );
}

export default App;
