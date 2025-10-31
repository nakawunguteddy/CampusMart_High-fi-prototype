<<<<<<< HEAD
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// add debug banner for entry identification (harmless, idempotent for HMR)
if (typeof document !== 'undefined' && !document.getElementById('debug-entry-project')) {
  const el = document.createElement('div');
  el.id = 'debug-entry-project';
  el.textContent = 'Loaded from: project/src/main.tsx';
=======
// add debug banner for entry identification (harmless, idempotent for HMR)
if (typeof document !== 'undefined' && !document.getElementById('debug-entry-src')) {
  const el = document.createElement('div');
  el.id = 'debug-entry-src';
  el.textContent = 'Loaded from: src/main.tsx';
>>>>>>> 362b35682c9f0b210142ef2199fce0406d64762f
  Object.assign(el.style, {
    position: 'fixed',
    top: '8px',
    right: '8px',
    background: '#064e3b',
    color: '#ecfdf5',
    padding: '6px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    zIndex: '99999',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
  });
  document.body.appendChild(el);
  // eslint-disable-next-line no-console
<<<<<<< HEAD
  console.log('Debug: app entry = project/src/main.tsx');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
=======
  console.log('Debug: app entry = src/main.tsx');
}
>>>>>>> 362b35682c9f0b210142ef2199fce0406d64762f
