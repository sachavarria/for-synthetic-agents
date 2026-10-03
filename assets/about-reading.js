(() => {
  const sections = [...document.querySelectorAll('article section')];
  const location = document.querySelector('.reading-location');
  let scheduled = false;
  function update() {
    scheduled = false;
    const extent = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--reading-progress', String(extent > 0 ? Math.min(1, Math.max(0, scrollY / extent)) : 0));
    let current = null;
    for (const section of sections) if (section.getBoundingClientRect().top < innerHeight * .3) current = section;
    location.textContent = current?.querySelector('h2').textContent || 'ABOUT';
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  update();
})();
