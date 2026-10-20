// Pass local provider settings through stdin; never print or store their values.
const fs=require('node:fs'),{spawnSync}=require('node:child_process');
const values={};for(const line of fs.readFileSync('.env','utf8').split(/\r?\n/)){const i=line.indexOf('=');if(i>0)values[line.slice(0,i)]=line.slice(i+1).trim()}
for(const key of ['AI_PROVIDER','GROQ_MODEL','GROQ_API_KEY']){
 const value=values[key];if(!value)throw Error('Missing local setting: '+key);
 const command='npx --yes vercel@latest env add '+key+' --environment production --sensitive --force --yes';
 const result=spawnSync('cmd.exe',['/d','/s','/c',command],{input:value,encoding:'utf8',windowsHide:true});
 const output=((result.stdout||'')+(result.stderr||'')).split(value).join('[redacted]');
 if(result.status!==0){console.error(output);process.exit(result.status||1)}
 console.log('Configured production secret: '+key);
}
