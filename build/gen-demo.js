/* Régénère demo/velisafe-fichier-unique.html à partir des sources.
   À relancer après toute modification de index.html, css/, js/ ou assets/. */
const fs=require('fs'), path=require('path');
const R='/home/claude/velisafe';
const lire=f=>fs.readFileSync(path.join(R,f),'utf8');
const b64=f=>fs.readFileSync(path.join(R,f)).toString('base64');

let html = lire('index.html');

const mime = {'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
// 1. images -> data URI
html = html.replace(/(src|href)="(assets\/[^"]+)"/g, (m,attr,f)=>{
  const ext = path.extname(f).toLowerCase();
  return `${attr}="data:${mime[ext]||'application/octet-stream'};base64,${b64(f)}"`;
});
// 2. feuilles de style -> <style>
html = html.replace(/<link rel="stylesheet" href="(vendor\/leaflet\.css|css\/style\.css)">/g,
  (m,f)=>`<style>\n/* ===== ${f} ===== */\n${lire(f)}\n</style>`);
// 3. scripts -> <script> en ligne
html = html.replace(/<script src="(vendor\/leaflet\.js|vendor\/jspdf\.js|js\/[a-z0-9]+\.js)"><\/script>/g,
  (m,f)=>`<script>\n/* ===== ${f} ===== */\n${lire(f)}\n</script>`);
// 3 bis. chemins d'images dans le JavaScript (vignettes des vélos) -> data URI
html = html.replace(/assets\/velos\/([a-z]+)\.(?:svg|jpg)/g,
  m=>`data:${m.endsWith('jpg')?'image/jpeg':'image/svg+xml'};base64,${b64(m)}`);
// 3 ter. images référencées dans le CSS en ligne (fonds de sections) -> data URI
html = html.replace(/url\(['"]?\.\.\/(assets\/[a-zA-Z0-9_.\/-]+)['"]?\)/g,
  (m,f)=>`url(data:${mime[path.extname(f).toLowerCase()]||'application/octet-stream'};base64,${b64(f)})`);
// 4. marque le fichier
html = html.replace('<title>', '<!-- Fichier unique, généré le ' + new Date().toISOString().slice(0,10) +
  ' par build/gen-demo.js. Ne pas modifier à la main : régénérer depuis les sources. -->\n<title>');

const reste = [...html.matchAll(/(?:src|href)="(?!data:|#|tel:|https?:|\$\{)([a-zA-Z0-9_.\/-]+)"/g)].map(m=>m[1]);
if(reste.length){ console.error('RESSOURCES NON INTÉGRÉES :', [...new Set(reste)]); process.exit(1); }

fs.mkdirSync(path.join(R,'demo'),{recursive:true});
fs.writeFileSync(path.join(R,'demo/velisafe-fichier-unique.html'), html);
console.log('demo/velisafe-fichier-unique.html régénéré :', Math.round(html.length/1024), 'Ko');
