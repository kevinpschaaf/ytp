export function importScript(href, onload, onerror) {
  return importModule(href, onload, onerror, true, 'application/javascript');
}

let importGuid = 0;
const ims = window.__$importModules$ = new Map();

export function importModule(href, onload, onerror, async, type) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const remove = _ => s.parentNode.removeChild(s);
    const guid = importGuid++;
    s.type = type || 'module';
    if (s.type == 'module') {
      s.textContent = `
        import * as module from '${href}';
        window.__$importModules$.set(${guid}, module);`;
    } else {
      s.src = href;
    }
    s.onload = _ => {
      remove();
      onload && onload();
      let module = ims.get(guid);
      ims.delete(guid);
      resolve(module);
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