(() => {
  const menu = document.querySelector('.interface-menu');
  document.addEventListener('click', event => {
    if (menu?.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false; menu.querySelector('summary').focus();
    }
  });
  const viewer = document.getElementById('home-image-viewer');
  const openers = [...document.querySelectorAll('[data-home-image]')];
  let opener;
  if (!viewer || !openers.length || typeof viewer.showModal !== 'function') return;
  openers.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault(); opener = link; viewer.showModal();
  }));
  document.querySelector('[data-close-home-image]').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => opener?.focus({preventScroll: true}));
})();
