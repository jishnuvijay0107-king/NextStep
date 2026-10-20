const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'.openai/hosting.json'),'utf8'));delete manifest.static;
fs.writeFileSync(path.join(root,'.openai/hosting.json'),JSON.stringify(manifest,null,2)+'\n');
const knowledge=vm.runInNewContext(fs.readFileSync(path.join(root,'dist/catalog.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'dist/project-help.js'),'utf8')+';({GUIDES,COURSES,OVERVIEWS,PROJECT_HELP})',{}, {timeout:1000});
let source=fs.readFileSync(path.join(root,'boss-server.cjs'),'utf8');
source=source.slice(source.indexOf('const instructions'),source.indexOf('function createBossHandler'));
source=source.replace(/let knowledge;[\s\S]*?(?=function safeContext)/,'const knowledge='+JSON.stringify(knowledge)+';\nfunction getKnowledge(){return knowledge;}\n');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
const assets={};
function walk(dir,base=''){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.name==='server'||item.name==='.openai')continue;const name=base+'/'+item.name,full=path.join(dir,item.name);if(item.isDirectory())walk(full,name);else if(mime[path.extname(name)])assets[name]={type:mime[path.extname(name)],data:fs.readFileSync(full).toString('base64')};}}
walk(path.join(root,'dist'));
const out=path.join(root,'dist/server');fs.mkdirSync(out,{recursive:true});fs.mkdirSync(path.join(root,'dist/.openai'),{recursive:true});
fs.writeFileSync(path.join(out,'index.js'),source+'\nconst assets='+JSON.stringify(assets)+';\n'+fs.readFileSync(path.join(__dirname,'worker-runtime.js'),'utf8'));
fs.writeFileSync(path.join(out,'package.json'),'{"type":"module"}\n');
fs.writeFileSync(path.join(root,'dist/.openai/hosting.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Built hosted Worker with '+Object.keys(assets).length+' assets; no environment values included.');
