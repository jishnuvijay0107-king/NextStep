(function(scope){
 'use strict';
 function createBossVoice({Recognition,synth,Utterance,language=()=> 'en-IN',onWake=()=>{},onQuestion=()=>{},onDictation=()=>{},onState=()=>{},onError=()=>{},schedule=setTimeout,unschedule=clearTimeout}={}){
  let recognition=null,conversation=false,mode=null,pending=null,speechRun=0,currentUtterance=null,emptySessions=0;
  const report=(phase)=>onState({phase,conversation,mode});
  function clearPending(){if(pending!==null){unschedule(pending);pending=null}}
  function stopRecognition(){clearPending();const r=recognition;recognition=null;mode=null;if(r){r.onstart=r.onresult=r.onerror=r.onend=null;try{r.abort()}catch{}}}
  function cancelSpeech(){speechRun++;currentUtterance=null;synth?.cancel?.()}
  function stop(){conversation=false;stopRecognition();cancelSpeech();report('idle')}
  function pause(){stopRecognition();cancelSpeech();report('waiting')}
  function resume(){if(conversation){clearPending();pending=schedule(()=>{pending=null;if(conversation)listen('conversation')},350)}}
  function speak(text,{resumeAfter=conversation}={}){
   stopRecognition();cancelSpeech();const token=speechRun;
   if(!synth||!Utterance){onError('Spoken audio is unavailable in this browser. The answer is still shown in chat.');if(resumeAfter)resume();return false}
   const clean=String(text).replace(/```[\s\S]*?```/g,' A code example is shown in the chat. ').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[*#`]/g,'').trim();
   const chunks=clean.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g)||[clean];let queue=[],part='';for(const c of chunks){if(part.length+c.length>280&&part){queue.push(part);part=''}if(c.length>400){if(part){queue.push(part);part=''}for(let i=0;i<c.length;i+=260)queue.push(c.slice(i,i+260))}else part+=c}if(part)queue.push(part);queue=queue.filter(x=>x.trim());
   if(!queue.length){if(resumeAfter)resume();return true}
   const next=()=>{if(token!==speechRun)return;const segment=queue.shift();if(!segment){currentUtterance=null;report('idle');if(resumeAfter)resume();return}const u=new Utterance(segment.trim());currentUtterance=u;u.lang=language();u.rate=1;u.pitch=1;const voices=synth.getVoices?.()||[],wanted=u.lang.toLowerCase();u.voice=voices.find(v=>v.lang?.toLowerCase()===wanted)||voices.find(v=>v.lang?.split('-')[0]===wanted.split('-')[0])||null;u.onstart=()=>{if(token===speechRun)report('speaking')};u.onend=next;u.onerror=event=>{if(token!==speechRun)return;currentUtterance=null;conversation=false;report('idle');onError(event.error==='not-allowed'?'Audio playback was blocked. Tap Play last answer to hear it.':'Audio could not be played. Tap Play last answer, or read the reply in chat.')};try{synth.speak(u)}catch{u.onerror({error:'unavailable'})}};
   report('speaking');next();return true;
  }
  function listen(kind){
   stopRecognition();cancelSpeech();if(!Recognition){conversation=false;onError('Speech recognition is unavailable in this browser. Type a question instead.');report('idle');return false}
   let r;try{r=new Recognition()}catch{conversation=false;onError('Voice recognition could not start. You can still type.');return false}recognition=r;mode=kind;r.lang=language();r.continuous=kind==='wake';r.interimResults=false;let gotResult=false;
   r.onstart=()=>report(kind==='wake'?'wake':'listening');
   r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){if(!e.results[i].isFinal)continue;let text=e.results[i][0].transcript.trim();if(!text)continue;if(kind==='wake'){if(!/\bboss\b/i.test(text))continue;text=text.replace(/^.*?\bboss\b[,.!?\s]*/i,'').trim();gotResult=true;emptySessions=0;stopRecognition();conversation=true;onWake();if(text){report('waiting');onQuestion(text)}else speak('I’m listening. Ask your question.',{resumeAfter:true});return}gotResult=true;emptySessions=0;stopRecognition();if(kind==='dictate'){conversation=false;report('idle');onDictation(text)}else{text=text.replace(/^(?:hey\s+)?boss[,.!?\s]*/i,'').trim();if(!text){speak('I’m listening.',{resumeAfter:true});return}report('waiting');onQuestion(text)}return}};
   r.onerror=e=>{if(recognition!==r)return;stopRecognition();if(e.error==='no-speech'&&conversation&&emptySessions++<2){report('listening');resume();return}conversation=false;report('idle');onError(e.error==='not-allowed'||e.error==='service-not-allowed'?'Microphone access was not granted. Enable it in your browser, or type your question.':e.error==='no-speech'?'No speech was detected. Tap Talk to Boss when you are ready.':'Voice recognition stopped. Tap Talk to Boss to retry, or type your question.')};
   r.onend=()=>{if(recognition!==r)return;stopRecognition();if(conversation&&!gotResult&&emptySessions++<2)resume();else{conversation=false;report('idle')}};
   try{r.start();return true}catch{stopRecognition();conversation=false;report('idle');onError('Could not start the microphone. Please type or try again.');return false}
  }
  return {startWake(){stop();return listen('wake')},startConversation(){stop();conversation=true;emptySessions=0;return listen('conversation')},dictate(){stop();return listen('dictate')},speak,pause,stop,cancelSpeech,get active(){return !!recognition||conversation||!!currentUtterance},get conversation(){return conversation},get mode(){return mode}};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={createBossVoice};else scope.BossVoice={createBossVoice};
})(typeof globalThis!=='undefined'?globalThis:this);
