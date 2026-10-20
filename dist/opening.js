(()=>{
 'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=document.body.classList.contains('quiet');
 try{paused=paused||localStorage.getItem('nextstep-motion-v3')==='off'}catch{}
 if(reduced.matches||paused)return;
 const intro=document.createElement('section');
 intro.className='opening-scene';intro.setAttribute('role','dialog');intro.setAttribute('aria-modal','true');intro.setAttribute('aria-labelledby','opening-title');
 intro.innerHTML=`<div class="opening-atmosphere" aria-hidden="true"></div><div class="opening-orbits" aria-hidden="true"><i></i><i></i><i></i></div><svg class="opening-wave" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="opening-light"><stop stop-color="#72a4c5" stop-opacity="0"/><stop offset=".35" stop-color="#99d4e3"/><stop offset=".58" stop-color="#f0d2a5"/><stop offset="1" stop-color="#80bbd2" stop-opacity="0"/></linearGradient></defs><path d="M-100 340C140 100 270 590 510 320S850 80 1080 300 1330 440 1540 210"/><path d="M-100 370C150 130 300 550 540 330S860 110 1100 310 1320 480 1540 250"/><path d="M-100 300C160 60 260 610 510 350S890 50 1120 280 1340 410 1540 180"/></svg><div class="opening-content"><span class="opening-kicker">YOUR NEXT CHAPTER BEGINS</span><div class="opening-seal" aria-hidden="true">${window.NextStepBrand.mark()}</div><h1 id="opening-title">${window.NextStepBrand.wordmark()}</h1><p>Small steps. Extraordinary possibilities.</p><div class="opening-rule" aria-hidden="true"><span></span></div><span class="opening-footnote">LEARN WITH PURPOSE. BUILD YOUR FUTURE.</span></div><button class="opening-skip" type="button">Skip intro <span aria-hidden="true">↗</span></button><div class="opening-bottom" aria-hidden="true"><span>A FUTURE YOU CAN BUILD</span><span>01 / YOUR JOURNEY</span></div>`;
 const previous=document.activeElement;
 const siblings=[...document.body.children].filter(el=>!['SCRIPT','STYLE','LINK'].includes(el.tagName));
 const inertBefore=siblings.map(el=>[el,el.inert]);
 siblings.forEach(el=>el.inert=true);
 document.body.append(intro);document.body.classList.add('opening-active');
 const skip=intro.querySelector('button');skip.focus({preventScroll:true});
 let finished=false,exitTimer;
 function finish(immediate=false){
  if(finished)return;finished=true;clearTimeout(timer);
  document.removeEventListener('keydown',onKey,true);reduced.removeEventListener('change',onMotion);
  intro.classList.add('opening-exit');
  function cleanup(){clearTimeout(exitTimer);intro.remove();document.body.classList.remove('opening-active');document.body.classList.add('opening-finished');inertBefore.forEach(([el,value])=>el.inert=value);const target=previous&&previous!==document.body?previous:document.querySelector('#main, #app input, #app button');target?.focus({preventScroll:true});setTimeout(()=>document.body.classList.remove('opening-finished'),900)}
  if(immediate)cleanup();else exitTimer=setTimeout(cleanup,550);
 }
 function onKey(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();finish()}else if(e.key==='Tab'){e.preventDefault();skip.focus()}}
 function onMotion(e){if(e.matches)finish(true)}
 skip.onclick=()=>finish();document.addEventListener('keydown',onKey,true);reduced.addEventListener('change',onMotion);
 const timer=setTimeout(()=>finish(),2600);
})();
