const fs = require('fs');
const path = require('path');
const express = require('express');
const { JSDOM, VirtualConsole } = require('jsdom');

const app = express();
const virtualConsole = new VirtualConsole();

const debug = Boolean(process.argv[3]);
const modulifiedSet = new Set();

function noteModulified(baseFile, file) {
  if (file) {
    const impt = path.normalize(path.join(path.dirname(baseFile), file));
    modulifiedSet.add(impt);
    return true;
  }
}

function modulifyHTML(file, html) {
  debug && console.log('modulifying import: ', file);
  const base = path.dirname(file);
  const doc = new JSDOM(html, {virtualConsole}).window.document;
  const scripts = Array.from(doc.querySelectorAll('script'));
  let scriptText = scripts
    .filter(s => !s.src)
    .map((s, i) => `// script ${i} -----\n${s.textContent}`)
    .join('\n');
  const ihRegex = /\w+\.importHref/g;
  if (ihRegex.test(scriptText)) {
    scriptText = `function $importHref$(href, onload, onerror) {
      let s = document.createElement('script');
      let remove = _ => s.parentNode.removeChild(s);
      s.type = 'module';
      s.src = href;
      s.onload = _ => {remove(); onload();};
      s.onerror = _ => {remove(); onerror(); console.warn('Error loading lazy import; ensure you have a <link rel="lazy-import"> for this file:', href)};
      document.head.appendChild(s);
    };\n` + scriptText.replace(ihRegex, '$importHref$');
  }
  let importText = scripts
    .filter(s => noteModulified(file, s.src))
    .map(s => s.src ? `import './${s.src}';` : '')
    .join('\n');
  scripts.forEach(s => s.remove());
  const imports = Array.from(doc.querySelectorAll('link[rel=import],link[rel=lazy-import]'));
  importText += '\n' + imports
    .map(i => `import './${i.href}';`)
    .join('\n');
  imports.forEach(i => {
    noteModulified(file, i.href);
    i.remove()
  });
  const htmlText = doc.head.innerHTML.trim() + doc.body.innerHTML.trim();
  const insertHtml = htmlText ? `
    (function() {
      if (!window.__mh__) {
        const mh = document.createElement('div');
        mh.hidden = true;
        mh.id = '__mh__';
        document.head.appendChild(mh);
      }
      const wrapper = document.createElement('div');
      wrapper.setAttribute('link', '${file}');
      window.__mh__.appendChild(wrapper);
      wrapper.innerHTML = \`${htmlText.replace(/`/g, '\\`')}\`;
    })();` : '';
  const content = `${importText}\n${insertHtml}\n${scriptText}`;
  return content;
}

const importRegex = /\s*import\s+['"]([^'"]+\.html)['"]/g;

function modulifyJS(file, data) {
  if (modulifiedSet.has(path.normalize(file))) {
    return `(function() {\n${data}\n}).call(window);`
  } else {
    let matched;
    while (matched = importRegex.exec(data)) {
      noteModulified(file, matched[1]);
    };
    return data;
  }
}

// app.use('/', express.static(__dirname));

app.get(/.*\.js/, function(req, res) {
  fs.readFile(path.join(__dirname, req.path), (err, data) => {
    res.contentType('application/javascript');
    res.send(modulifyJS(req.path, data));
  });
});

app.get(/.*\.html/, function(req, res) {
  const file = path.join(__dirname, req.path);
  if (modulifiedSet.has(path.normalize(req.path))) {
    fs.readFile(file, (err, data) => {
      res.contentType('application/javascript');
      res.send(modulifyHTML(req.path, data));
    });
  } else {
    debug && console.log('passing thru html:', file);
    res.sendFile(file);
  }
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, req.path), err => {
    if (err) {
      if (err.status == '404' && !(/.*\/.+\..{1,}$/.test(req.path))) {
        const file = path.join(__dirname, 'index.html');
        modulifiedSet.clear();
        res.sendFile(file, err => {
          if (err) {
            debug && console.log('could not find fallback', err.message);
            res.statusCode = err.status || 500;
            res.end(err.message);
          }
        });
      } else {
        res.statusCode = err.status || 500;
        res.end(err.message);
      }
    }
  });
});

const port = process.argv[2] || 8080;
app.listen(port);

console.log(`Listening on port ${port}...`);