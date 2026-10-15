import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

function Startup() {
  useEffect(() => {
    let paintFrame;
    const frame = requestAnimationFrame(() => {
      paintFrame = requestAnimationFrame(() => window.dispatchEvent(new Event('portfolio:ready')));
    });
    return () => {
      cancelAnimationFrame(frame);
      if (paintFrame !== undefined) cancelAnimationFrame(paintFrame);
    };
  }, []);
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Startup />
  </React.StrictMode>
);

