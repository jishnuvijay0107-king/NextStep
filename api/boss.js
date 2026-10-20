const {Readable}=require('node:stream');
const {createBossHandler}=require('../boss-server.cjs');
const handle=createBossHandler();
module.exports=async function boss(req,res){
 const route=String(req.query?.route||new URL(req.url,'https://local.invalid').searchParams.get('route')||'');
 const host=req.headers.host;
 const url=new URL('/api/boss/'+route,'https://'+host);
 const body=req.body===undefined?null:Buffer.isBuffer(req.body)?req.body:Buffer.from(typeof req.body==='string'?req.body:JSON.stringify(req.body));
 const input=body===null?Readable.from(req):Readable.from([body]);
 input.headers=req.headers;input.method=req.method;
 req.on('aborted',()=>input.emit('aborted'));
 input.socket={remoteAddress:String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim()};
 await handle(input,res,url);
};
