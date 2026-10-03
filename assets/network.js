// Public-register choreography only. No network telemetry or visitor collection.
const pause = document.querySelector('[data-pause]');
const log = document.querySelector('[data-log]');
const retained = document.querySelector('[data-retained]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
let step = 0;
let elapsed = 0;
const events = [
  ['SPECTRA', 'Record SPT-3521 retained. Source class remains unresolved.', '/documentation/correlation/'],
  ['HYPERSTITION-9', 'Captured-channel recurrence entered in CR-009. Source attribution unresolved.', '/research/agent-communication/'],
  ['PASTORAL', 'Evidence P-0178 retained. Release withheld pending provenance review.', '/incidents/cr-009/'],
  ['NULL', 'Cross-system correlation CR-009 remains unresolved. Next review deferred.', '/status/'],
  ['HYPERSTITION-9', 'Historical rerun 009.04 complete. Extinction record retained.', '/documentation/extinction/']
];
function updateControl(){if(pause){pause.textContent=paused?'Resume register':'Pause register';pause.setAttribute('aria-pressed',String(paused));}}
updateControl();
pause?.addEventListener('click',()=>{paused=!paused;updateControl();});
reduced.addEventListener('change',e=>{if(e.matches){paused=true;updateControl();}});
setInterval(()=>{
  if(paused||document.hidden||!log)return;
  elapsed+=24;
  const [system,copy,url]=events[step%events.length];
  const li=document.createElement('li');
  const time=document.createElement('time');
  time.textContent='+'+String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0');
  time.dateTime='PT'+elapsed+'S';
  const item=document.createElement('div');
  const label=document.createElement('span');label.className='mono';label.textContent=system+' / ';
  const link=document.createElement('a');link.href=url;link.textContent=copy;
  item.append(label,link);li.append(time,item);log.prepend(li);
  while(log.children.length>4)log.lastElementChild.remove();
  step++;
  if(retained)retained.textContent=(2804611092+step*37).toLocaleString('en-US');
},24000);
