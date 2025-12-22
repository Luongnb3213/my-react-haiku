import React, { useRef, useState } from 'react';
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

function App() {
  useFavicon(
    'https://tse4.mm.bing.net/th/id/OIP.YR5gTV6Eg9527yQXAIvO3AAAAA?cb=ucfimg2&ucfimg=1&utm_source=chatgpt.com&w=300&h=240&c=7&p=0',
    {
      rel: 'icon',
      type: 'image/png',
    },
  );
  return <button>Click me</button>;
}

export default App;
