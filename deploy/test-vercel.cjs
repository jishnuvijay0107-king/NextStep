const assert=require('node:assert/strict'),http=require('node:http');
const handler=require('../api/boss.js');
const server=http.createServer(async(req,res)=>{
 req.query={route:new URL(req.url,'http://local').searchParams.get('route')};
 const chunks=[];for await(const chunk of req)chunks.push(chunk);
 if(chunks.length)req.body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
 await handler(req,res);
});
server.listen(0,'127.0.0.1',async()=>{try{
 const base='http://127.0.0.1:'+server.address().port;
 let r=await fetch(base+'/?route=status');assert.equal(r.status,200);assert.equal(typeof (await r.json()).configured,'boolean');
 r=await fetch(base+'/?route=chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'How do I start my projects here?'})});assert.equal(r.status,200);assert.equal((await r.json()).answerSource,'site-guide');
 r=await fetch(base+'/?route=chat',{method:'POST',headers:{'content-type':'application/json',origin:'https://other.invalid'},body:JSON.stringify({message:'Hello'})});assert.equal(r.status,403);
 console.log('Vercel API checks passed: status, parsed body, project guidance, and origin protection.');
 }catch(e){console.error(e.message);process.exitCode=1}finally{server.close()}});
