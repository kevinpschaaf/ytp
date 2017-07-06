export function importScript(href, onload, onerror) {
  return importModule(href, onload, onerror, true, 'application/javascript');
}

export function importModule(href, onload, onerror, async, type) {
  return new Promise((resolve, reject) => {
    let s = document.createElement('script');
    let remove = _ => s.parentNode.removeChild(s);
    s.type = type || 'module';
    s.src = href;
    s.onload = _ => {
      remove();
      onload && onload();
      resolve();
    }
    s.onerror = _ => {
      remove();
      onerror && onerror();
      console.warn('Error loading lazy import; ensure you have a <link rel="lazy-import"> for this file:', href);
      reject();
    };
    document.head.appendChild(s);
  });
};