(() => {
  const viewer = document.getElementById('installation-viewer');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const image = document.getElementById('installation-viewer-image');
  const caption = document.getElementById('installation-viewer-caption');
  let opener;
  document.querySelectorAll('.installation-enlarge').forEach((link, index) => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); opener = link;
      image.src = link.href; image.alt = link.querySelector('img').alt;
      caption.textContent = `${String(index + 1).padStart(2, '0')} / Tunis · Installation photograph © Mehdi Ben Temessek`;
      viewer.showModal();
    });
  });
  document.getElementById('installation-viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => opener?.focus({preventScroll: true}));
})();
