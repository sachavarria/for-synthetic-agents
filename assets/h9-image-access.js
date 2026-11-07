// Navigation and unchanged-image access only. The research instrument owns its data and views.
(() => {
  const panel = document.querySelector('.object-card');
  if (!panel) return;
  const viewer = document.createElement('dialog');
  viewer.className = 'h9-source-image';
  viewer.setAttribute('aria-labelledby', 'h9-source-image-label');
  viewer.innerHTML = '<nav><span id="h9-source-image-label">HYPERSTITION-9 / Field 09 / 09-4417-03</span><button type="button" autofocus>← Observation record</button></nav><img alt="">';
  document.body.append(viewer);
  let opener;
  function prepareImages() {
    panel.querySelectorAll('.evidence-frames img').forEach(image => {
      if (image.closest('a')) return;
      const link = document.createElement('a');
      link.href = image.src;
      link.className = 'h9-source-image-link';
      link.setAttribute('aria-label', 'View unchanged image: ' + image.alt);
      image.before(link); link.append(image);
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || typeof viewer.showModal !== 'function') return;
        event.preventDefault(); opener = link;
        const full = viewer.querySelector('img'); full.src = image.src; full.alt = image.alt;
        viewer.showModal();
      });
    });
  }
  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => opener?.focus({preventScroll: true}));
  new MutationObserver(prepareImages).observe(panel, {childList: true, subtree: true});
  prepareImages();
  function openAddressedRecord() {
    if (location.hash !== '#relations/09-4417-03') return;
    document.querySelector('.tab[data-view="relations"]')?.click();
    document.querySelector('#relationCards [data-i="6"]')?.click();
    const evidence = panel.querySelector('details.evidence');
    if (evidence) evidence.open = true;
    // Follow the existing instrument's responsive placement; retain its field and event data.
    panel.scrollIntoView({block: 'start'});
  }
  openAddressedRecord();
  addEventListener('hashchange', openAddressedRecord);
})();
