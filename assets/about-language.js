(() => {
  const canvas = document.querySelector('.language-trace');
  const context = canvas.getContext('2d');
  if (!context) return;
  const sections = [...document.querySelectorAll('article section')];
  const passages = sections.map(section => [...section.querySelectorAll('p, dt, dd')].map(node => node.textContent.trim()).join(' '));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const location = document.querySelector('.reading-location');
  let width = 0, height = 0, current = -1, previous = -1;
  let pointer = { x: -1000, y: -1000 }, focusedSystem = '', scheduled = false;
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    schedule();
  }
  function compose(text, measure) {
    const rows = []; let row = '';
    for (const word of text.split(/\s+/)) {
      const candidate = row ? row + ' ' + word : word;
      if (row && context.measureText(candidate).width > measure) { rows.push(row); row = word; }
      else row = candidate;
    }
    if (row) rows.push(row);
    return rows;
  }
  function drawPassage(text, origin, opacity, oldWords) {
    context.font = '400 17px "Space Grotesk", sans-serif';
    const measure = Math.max(90, width - origin - width * .025);
    const rows = compose(text, measure);
    const top = 145, spacing = 28;
    for (let row = 0; row < rows.length && top + row * spacing < height - 40; row++) {
      let x = origin;
      const y = top + row * spacing;
      const words = rows[row].split(' ');
      for (const word of words) {
        const repeated = oldWords?.has(word.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, ''));
        const approached = Math.hypot(pointer.x - x, pointer.y - y) < 100;
        const linked = focusedSystem && word.includes(focusedSystem);
        // Word positions remain fixed. Only legibility changes: prior language
        // is retained, recurrence is emphasized, and pointer focus reveals it.
        context.fillStyle = `rgba(227,228,211,${Math.min(.48, opacity + (repeated ? .07 : 0) + (approached ? .19 : 0) + (linked ? .27 : 0))})`;
        context.fillText(word, x, y);
        x += context.measureText(word + ' ').width;
      }
    }
  }
  function draw() {
    scheduled = false;
    const extent = document.documentElement.scrollHeight - height;
    document.documentElement.style.setProperty('--reading-progress', String(extent > 0 ? Math.max(0, Math.min(1, scrollY / extent)) : 0));
    let active = -1;
    const threshold = height * .38;
    sections.forEach((section, index) => { if (section.getBoundingClientRect().top < threshold) active = index; });
    if (active !== current) { previous = current; current = active; }
    location.textContent = active >= 0 ? sections[active].querySelector('h2').textContent : 'ABOUT';
    context.clearRect(0, 0, width, height);
    if (reduced.matches || width < 1280 || current < 0) return;
    const origin = width * .80;
    context.save();
    context.beginPath(); context.rect(origin - 8, 90, width - origin, height - 90); context.clip();
    const oldText = previous >= 0 ? passages[previous] : '';
    // The previous and current passages share a typesetting coordinate system;
    // the faint earlier register is a memory, never invented or randomized text.
    if (oldText) drawPassage(oldText, origin, .045);
    const oldWords = new Set(oldText.toLowerCase().match(/[\p{L}\p{N}-]+/gu) || []);
    drawPassage(passages[current], origin, .095, oldWords);
    context.restore();
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(draw); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', resize);
  addEventListener('pointermove', event => { pointer = { x: event.clientX, y: event.clientY }; schedule(); }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; schedule(); });
  for (const link of document.querySelectorAll('article a')) {
    const enter = () => { focusedSystem = link.textContent.trim(); schedule(); };
    const leave = () => { focusedSystem = ''; schedule(); };
    link.addEventListener('pointerenter', enter); link.addEventListener('pointerleave', leave);
    link.addEventListener('focus', enter); link.addEventListener('blur', leave);
  }
  reduced.addEventListener('change', schedule);
  resize();
  document.fonts.ready.then(schedule);
})();
