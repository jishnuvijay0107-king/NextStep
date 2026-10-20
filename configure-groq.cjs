// Receives a credential on hidden stdin. Never prints or puts it in process arguments.
const fs=require('node:fs');
const path=require('node:path');
const target=path.join(__dirname,'.env');
if(process.stdin.isTTY)process.stdin.setRawMode(true);
process.stdout.write('Ready for API key on hidden stdin.\n');
let input='';
process.stdin.on('data',chunk=>{input+=chunk.toString();if(input.includes('\u0003'))process.exit(1);if(!/[\r\n]/.test(input))return;const key=input.trim();if(!/^gsk_[A-Za-z0-9]+$/.test(key)){process.stdout.write('Invalid Groq credential format.\n');process.exit(1)}let current=fs.existsSync(target)?fs.readFileSync(target,'utf8'):'';const values={AI_PROVIDER:'groq',GROQ_API_KEY:key,GROQ_MODEL:'openai/gpt-oss-120b'};for(const [name,value]of Object.entries(values)){const pattern=new RegExp('^'+name+'=.*$','m');if(pattern.test(current))current=current.replace(pattern,name+'='+value);else current+=(current.endsWith('\n')||!current?'':'\n')+name+'='+value+'\n'}fs.writeFileSync(target,current,{mode:0o600});process.stdout.write('Groq configuration saved locally.\n');process.exit(0)});
