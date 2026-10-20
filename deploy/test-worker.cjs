const assert=require('node:assert/strict'),path=require('node:path');const {pathToFileURL}=require('node:url');
(async()=>{const worker=(await import(pathToFileURL(path.resolve('dist/server/index.js')))).default;
const env={AI_PROVIDER:'groq',GROQ_API_KEY:'synthetic-test-value'};let r=await worker.fetch(new Request('https://example.test/'),env);assert.equal(r.status,200);assert.match(await r.text(),/NextStep/);
r=await worker.fetch(new Request('https://example.test/api/boss/status'),env);assert.equal((await r.json()).configured,true);
r=await worker.fetch(new Request('https://example.test/api/boss/chat',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}),env);assert.equal(r.status,401);
r=await worker.fetch(new Request('https://example.test/api/boss/chat',{method:'POST',headers:{'content-type':'application/json',origin:'https://evil.test'},body:'{}'}),env);assert.equal(r.status,403);
const headers={'content-type':'application/json','oai-authenticated-user-id':'test-owner'};
r=await worker.fetch(new Request('https://example.test/api/boss/chat',{method:'POST',headers,body:JSON.stringify({message:'How do I start my projects here?'})}),env);const guide=await r.json();assert.equal(r.status,200);assert.equal(guide.answerSource,'site-guide');assert.match(guide.reply,/My projects/);
const original=global.fetch;global.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:'A variable stores a value.'},finish_reason:'stop'}]}),{headers:{'content-type':'application/json'}});
try{r=await worker.fetch(new Request('https://example.test/api/boss/chat',{method:'POST',headers,body:JSON.stringify({message:'What is a variable?'})}),env);assert.equal((await r.json()).reply,'A variable stores a value.')}finally{global.fetch=original}
console.log('Hosted Worker checks passed: assets, configuration, authentication, origin, site guide, and AI round-trip.');})().catch(e=>{console.error(e.message);process.exitCode=1});
