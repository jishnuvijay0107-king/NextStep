const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const envFile=path.join(__dirname,'.env');
if(fs.existsSync(envFile))process.loadEnvFile(envFile);
const {createBossHandler}=require('./boss-server.cjs');
const bossHandler=createBossHandler();
const root = path.join(__dirname, 'dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server = http.createServer(async (req, res) => {
  const host=req.headers.host||'';
  if(!/^(?:127\.0\.0\.1|localhost):4173$/.test(host)){res.writeHead(403);return res.end('Use localhost:4173');}
  const url=new URL(req.url,`http://${host}`);
  if(await bossHandler(req,res,url))return;
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); return res.end(); }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(data);
  });
});
server.listen(4173, '127.0.0.1', () => console.log('NextStep running at http://127.0.0.1:4173'));
