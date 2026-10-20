const limits=new Map();let active=0;
function json(status,data){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}})}
async function chat(request,env,url){
 if(request.headers.get('origin')&&request.headers.get('origin')!==url.origin||request.headers.get('sec-fetch-site')==='cross-site')return json(403,{error:{code:'ORIGIN_BLOCKED',message:'Open Boss from this website.'}});
 const provider=env.AI_PROVIDER||'groq',name=provider==='groq'?'Groq':'OpenAI',key=provider==='groq'?env.GROQ_API_KEY:env.OPENAI_API_KEY,model=provider==='groq'?(env.GROQ_MODEL||'openai/gpt-oss-120b'):(env.OPENAI_MODEL||'gpt-5-mini');
 if(url.pathname==='/api/boss/status'&&request.method==='GET')return json(200,{configured:!!key,provider:name,model:key?model:null});
 if(url.pathname!=='/api/boss/chat')return json(404,{error:{code:'NOT_FOUND',message:'Unknown assistant endpoint.'}});
 if(request.method!=='POST')return json(405,{error:{code:'METHOD_NOT_ALLOWED',message:'Send a POST request.'}});
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))return json(415,{error:{code:'JSON_REQUIRED',message:'Use JSON for chat requests.'}});
 // Sites validates identity before forwarding private requests.
 const user=request.headers.get('oai-authenticated-user-id');
 if(!user)return json(401,{error:{code:'SIGN_IN_REQUIRED',message:'Sign in to use Boss on the hosted site.'}});
 try{
 const reader=request.body?.getReader();if(!reader)return json(400,{error:{code:'INVALID_JSON',message:'A question is required.'}});
 let size=0,chunks=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>48000){await reader.cancel();return json(413,{error:{code:'TOO_LARGE',message:'This conversation is too large. Start a new chat.'}})}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
 let body;try{body=JSON.parse(new TextDecoder().decode(bytes))}catch{return json(400,{error:{code:'INVALID_JSON',message:'Use valid JSON.'}})}
 const data=validate(body),verified=siteAnswer(data);if(verified)return json(200,{reply:verified,incomplete:false,provider:'NextStep',answerSource:'site-guide'});
 if(!key)return json(503,{error:{code:'AI_NOT_CONFIGURED',message:'Live AI has not been connected by the site owner yet.'}});
 const now=Date.now(),recent=(limits.get(user)||[]).filter(t=>now-t<60000);if(recent.length>=10||active>=2)return json(429,{error:{code:'RATE_LIMIT',message:'Boss is busy. Wait a moment and try again.'}});limits.set(user,[...recent,now]);if(limits.size>500)for(const [id,times] of limits)if(times.every(t=>now-t>60000))limits.delete(id);
 active++;try{
 const response=await fetch(provider==='groq'?'https://api.groq.com/openai/v1/chat/completions':'https://api.openai.com/v1/responses',{method:'POST',headers:{authorization:'Bearer '+key,'content-type':'application/json'},body:JSON.stringify(buildRequest(data,model,provider)),signal:AbortSignal.any([request.signal,AbortSignal.timeout(60000)])});
 if(!response.ok)return json(response.status===429?429:502,{error:{code:response.status===429?'PROVIDER_LIMIT':'PROVIDER_ERROR',message:response.status===429?'The AI provider reached a usage limit. Please try later.':'The AI service could not answer. Please try again later.'}});
 const result=await response.json(),reply=extractText(result,provider);if(!reply)return json(502,{error:{code:'EMPTY_RESPONSE',message:'No answer was returned. Please try again.'}});
 return json(200,{reply,incomplete:provider==='groq'?result.choices?.[0]?.finish_reason==='length':result.status==='incomplete',provider:name});
 }finally{active--}
 }catch(e){return json(e.status||502,{error:{code:e.status===400?'INVALID_REQUEST':'CONNECTION_ERROR',message:e.status?e.message:'Boss could not connect. Please try again later.'}})}
}
export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname.startsWith('/api/boss'))return chat(request,env,url);if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});const asset=assets[url.pathname==='/'?'/index.html':url.pathname];if(!asset)return new Response('Not found',{status:404});const body=request.method==='HEAD'?null:Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));return new Response(body,{headers:{'content-type':asset.type,'cache-control':'no-cache','x-content-type-options':'nosniff'}})}};
