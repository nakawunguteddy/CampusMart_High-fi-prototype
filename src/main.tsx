// add debug banner for entry identification (harmless, idempotent for HMR)
if (typeof document !== 'undefined' && !document.getElementById('debug-entry-src')) {
  const el = document.createElement('div');
  el.id = 'debug-entry-src';
  el.textContent = 'Loaded from: src/main.tsx';
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
  console.log('Debug: app entry = src/main.tsx');
}