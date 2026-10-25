// build-static.js: builds a server-free copy of the site in docs/ for GitHub Pages.
// The same logic.js and traits.js run in the browser instead of behind Express.
// Usage: node build-static.js   (re-run after changing logic.js, traits.js or public/index.html)
const fs = require('fs');
const path = require('path');

const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const wrap = (src, req) => `(()=>{const module={exports:{}};const exports=module.exports;${req}\n${src}\nreturn module.exports;})()`;

const traits = wrap(read('traits.js'), '');
const logic = wrap(read('logic.js').replace("require('./traits')", '__traits'), '');
const bundle = `<script>\nconst __traits=${traits};\nconst __L=${logic.replace(/<\/script/g, '<\\/script')};\n</script>\n`;

let html = read('public/index.html');

const apiStart = html.indexOf('async function api(path,body){');
const apiEnd = html.indexOf('const pct=x=>');
if (apiStart < 0 || apiEnd < 0) throw new Error('index.html changed: could not find the api block');

const local = `const ROUTES={'/api/cross':__L.crossHandler,'/api/height':__L.heightHandler,'/api/rh':__L.rhHandler,'/api/summary':__L.summaryHandler};
async function api(path,body){
  const r=ROUTES[path](body);
  if(r.status!==200)throw new Error(r.body.error);
  return r.body;
}
const T=__L.listTraits();
`;
html = html.slice(0, apiStart) + local + html.slice(apiEnd);
html = html.replace('<script type="module">', bundle + '<script type="module">');
html = html.replace("Your selections are sent to this site’s server to work out the odds. They are not stored.",
  'Everything is calculated in your browser. Nothing is sent or stored.');

fs.mkdirSync(path.join(__dirname, 'docs'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'docs/index.html'), html);
fs.writeFileSync(path.join(__dirname, 'docs/.nojekyll'), '');
console.log('Built docs/index.html');
