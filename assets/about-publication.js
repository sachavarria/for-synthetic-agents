(() => {
  const sections = [...document.querySelectorAll('article section')];
  const location = document.querySelector('.reading-location');
  let scheduled = false;
  let active = null;
  function updateReadingPosition() {
    scheduled = false;
    const extent = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--reading-progress', String(extent > 0 ? Math.min(1, Math.max(0, window.scrollY / extent)) : 0));
    const threshold = Math.min(220, window.innerHeight * .28);
    let current = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section;
    }
    if (current !== active) {
      active?.classList.remove('is-reading');
      current?.classList.add('is-reading');
      location.textContent = current?.querySelector('h2').textContent || 'ABOUT';
      active = current;
    }
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateReadingPosition); }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  updateReadingPosition();
})();
