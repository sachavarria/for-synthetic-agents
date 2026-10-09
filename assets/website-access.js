(() => {
 const system = document.body.dataset.websiteSystem;
 // Explicit scroll affordance for dense record tables; native touch/keyboard scrolling.
 for (const el of document.querySelectorAll('.table-wrap,.ledger,.re-ledger')) {
  el.tabIndex = 0;
  el.setAttribute('role','region');
  el.setAttribute('aria-label',el.classList.contains('table-wrap')?'Record table, scroll horizontally if needed':'Record register, scroll horizontally for all columns');
  const hint=document.createElement('p');hint.className='scroll-hint';hint.textContent='↔ Scroll for all columns';
  if(el.classList.contains('table-wrap')) el.before(hint); else el.prepend(hint);
 }
 if(system==='pastoral') {
  const sections=document.createElement('nav');sections.className='pastoral-sections';sections.setAttribute('aria-label','Interface panels');sections.innerHTML='<a href="#dossier">Dossier</a><a href="#review">Review</a>';
  document.getElementById('header').after(sections);
  const selector='.fr,.qi,.weapon-block,.ts-score';
  function prepare(){for(const el of document.querySelectorAll(selector)) {el.tabIndex=0;el.setAttribute('role','button');}}
  prepare();
  new MutationObserver(prepare).observe(document.getElementById('main'),{childList:true,subtree:true});
  document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches(selector)){e.preventDefault();e.target.click();}});
  const layer=document.getElementById('inspect-layer');let opener=null;
  new MutationObserver(()=>{if(layer.classList.contains('open')){opener=document.activeElement;document.getElementById('inspect-close').focus();}else if(opener?.isConnected)opener.focus();}).observe(layer,{attributes:true,attributeFilter:['class']});
  layer.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();document.getElementById('inspect-close').focus();}});

  // The installation layout is a fixed three-column wall display. On the
  // website, move the same live nodes into a mobile reading sequence so case
  // state, controls, focus order, and screen-reader order cannot drift apart.
  const mobileQuery=window.matchMedia('(max-width: 900px), (max-height: 500px)');
  const main=document.getElementById('main');
  const dossier=document.getElementById('dossier');
  const review=document.getElementById('review');
  const topStrip=document.getElementById('top-strip');
  const fields=document.getElementById('fields-area');
  const collateral=document.getElementById('coll-strip');
  const reviewHead=review.querySelector('.rv-head');
  const timer=document.getElementById('timer-block');
  const weapon=review.querySelector('.weapon-block');
  const ledger=document.getElementById('queue-ledger');
  const action=review.querySelector('.action-block');
  const identity=topStrip.querySelector('.ts-identity');
  const locationBody=document.getElementById('f-region').closest('.fc-body');
  const locationRow=document.getElementById('f-region').closest('.fr');
  const structureRow=document.getElementById('f-structure').closest('.fr');
  const timeRow=document.getElementById('f-time').closest('.fr');
  const navLinks=sections.querySelectorAll('a');

  const mobileFlow=document.createElement('div');
  mobileFlow.id='pastoral-mobile-flow';
  const mobileLocation=document.createElement('section');
  mobileLocation.id='pastoral-mobile-location';
  mobileLocation.setAttribute('aria-label','Current case location');
  const mobileReview=document.createElement('section');
  mobileReview.id='pastoral-mobile-review';
  mobileReview.setAttribute('aria-label','Active authorization review');
  const casePin=document.createElement('span');
  casePin.className='pastoral-case-pin';
  casePin.setAttribute('aria-live','polite');
  reviewHead.append(casePin);

  function syncCasePin(){
   const target=document.getElementById('tgt-id').textContent.trim();
   const region=document.getElementById('f-region').textContent.trim();
   const address=document.getElementById('f-structure').textContent.trim();
   casePin.textContent=`${target} · ${region} · ${address}`;
  }
  syncCasePin();
  new MutationObserver(syncCasePin).observe(document.getElementById('tgt-id'),{childList:true,characterData:true,subtree:true});
  new MutationObserver(syncCasePin).observe(document.getElementById('f-region'),{childList:true,characterData:true,subtree:true});
  new MutationObserver(syncCasePin).observe(document.getElementById('f-structure'),{childList:true,characterData:true,subtree:true});

  function setPastoralMobileLayout(){
   if(mobileQuery.matches){
    main.prepend(mobileFlow);
    mobileFlow.append(topStrip,mobileReview,weapon,ledger,fields,collateral);
    identity.after(mobileLocation);
    mobileLocation.append(locationRow,structureRow);
    mobileReview.append(reviewHead,timer,action);
    navLinks[0].href='#top-strip';
    navLinks[1].href='#pastoral-mobile-review';
   } else {
    dossier.append(topStrip,fields,collateral);
    locationBody.insertBefore(locationRow,timeRow);
    locationBody.insertBefore(structureRow,timeRow);
    review.append(reviewHead,timer,weapon,ledger,action);
    mobileFlow.remove();
    navLinks[0].href='#dossier';
    navLinks[1].href='#review';
   }
  }
  setPastoralMobileLayout();
  mobileQuery.addEventListener?.('change',setPastoralMobileLayout);
 }
 if(system==='spectra') {
  const labels={'.time':'Time', '.session':'Session', '.signal-cell':'Assessment', '.ip':'Origin'};
  function labelRows(){for(const [selector,label] of Object.entries(labels))for(const el of document.querySelectorAll('.feed-row '+selector))el.dataset.mobileLabel=label;}
  labelRows();new MutationObserver(labelRows).observe(document.getElementById('feedTrack'),{childList:true,subtree:true});
  const controls=document.createElement('details');controls.className='website-controls';
  controls.innerHTML='<summary>Controls</summary><button type="button">A</button>';
  const button=controls.querySelector('button');button.setAttribute('aria-label','Activate anomaly sequence (A)');button.title='Activate anomaly sequence (A)';button.onclick=()=>window.SPECTRA_TRIGGER_ANOMALY?.();
  document.querySelector('.topbar').append(controls);
 }
 if(system==='hyperstition-9') {
  const reset=document.createElement('button');reset.type='button';reset.textContent='Restart';
  reset.onclick=()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'r',bubbles:true}));
  document.querySelector('.footer').append(reset);
  const tabs=[...document.querySelectorAll('.tabs .tab')];
  function sync(){for(const tab of tabs)tab.setAttribute('aria-pressed',String(tab.classList.contains('active')));}
  sync();new MutationObserver(sync).observe(document.querySelector('.tabs'),{attributes:true,subtree:true,attributeFilter:['class']});
 }
 for(const media of document.querySelectorAll('video,audio')) {media.controls=true;media.preload='metadata';}
})();
