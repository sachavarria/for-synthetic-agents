(() => {
  const routes = new Set(['/spectra/', '/pastoral/', '/hyperstition-9/']);
  const links = [...document.querySelectorAll('article a')].filter(link => routes.has(link.getAttribute('href')));
  if (!links.length) return;
  const opening = document.createElement('div');
  opening.className = 'system-opening';
  opening.setAttribute('aria-hidden', 'true');
  document.body.append(opening);
  const frames = new Map();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pointer = null, focused = null, selected = null, currentRoute = null;
  let desired = 0, strength = 0, animation = 0, lastTime = 0;
  const approachDistance = 100;

  function sizeSystemViewport() {
    // Preserve the system's full composition even when ABOUT is in a narrow
    // browser pane. This scales the containing viewport, never its document.
    const nativeWidth = Math.max(innerWidth, 1440);
    const scale = innerWidth / nativeWidth;
    opening.style.setProperty('--system-width', nativeWidth + 'px');
    opening.style.setProperty('--system-height', (innerHeight / scale) + 'px');
    opening.style.setProperty('--system-scale', String(scale));
  }
  sizeSystemViewport();

  function frameFor(link) {
    const route = link.getAttribute('href');
    if (frames.has(route)) return frames.get(route);
    const iframe = document.createElement('iframe');
    iframe.src = route;
    iframe.title = link.textContent.trim() + ' live interface';
    iframe.tabIndex = -1;
    iframe.setAttribute('aria-hidden', 'true');
    const entry = { iframe, ready: false };
    frames.set(route, entry);
    iframe.addEventListener('load', () => {
      entry.ready = true;
      if (currentRoute === route) opening.classList.add('is-ready');
    }, { once: true });
    opening.append(iframe);
    return entry;
  }

  function choose(link, amount) {
    if (link !== selected) {
      selected?.classList.remove('system-is-open');
      selected = link;
      selected?.classList.add('system-is-open');
    }
    desired = amount;
    if (link) {
      const route = link.getAttribute('href');
      const entry = frameFor(link);
      if (route !== currentRoute) {
        for (const item of frames.values()) item.iframe.classList.remove('is-current');
        entry.iframe.classList.add('is-current');
        currentRoute = route;
        strength = 0;
      }
      opening.classList.toggle('is-ready', entry.ready);
    }
    if (!animation) { lastTime = performance.now(); animation = requestAnimationFrame(render); }
  }

  function distanceToLink(link, point) {
    // Use each line box, so wrapped names do not activate from empty rectangles.
    let distance = Infinity;
    for (const rect of link.getClientRects()) {
      if (rect.bottom < 0 || rect.top > innerHeight) continue;
      const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
      const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
      distance = Math.min(distance, Math.hypot(dx, dy));
    }
    return distance;
  }

  function approach() {
    if (focused) {
      const rect = focused.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) return choose(focused, 1);
    }
    if (!pointer) return choose(null, 0);
    let nearest = null, distance = approachDistance;
    for (const link of links) {
      const candidate = distanceToLink(link, pointer);
      if (candidate < distance) { distance = candidate; nearest = link; }
    }
    choose(nearest, nearest ? Math.pow(1 - distance / approachDistance, 1.5) : 0);
  }

  function render(now) {
    animation = 0;
    const elapsed = Math.min(64, now - lastTime); lastTime = now;
    strength += (desired - strength) * (reduced.matches ? 1 : 1 - Math.exp(-elapsed / 150));
    if (Math.abs(desired - strength) < .002) strength = desired;
    if (selected) {
      const rect = selected.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const blend = strength * .65;
      opening.style.setProperty('--opening-x', (x * (1 - blend) + innerWidth * .5 * blend) + 'px');
      opening.style.setProperty('--opening-y', (y * (1 - blend) + innerHeight * .5 * blend) + 'px');
    }
    opening.style.setProperty('--opening-rx', (innerWidth * .68 * strength) + 'px');
    opening.style.setProperty('--opening-ry', (innerHeight * .8 * strength) + 'px');
    opening.style.setProperty('--opening-strength', String(strength));
    if (strength !== desired) animation = requestAnimationFrame(render);
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    approach();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { pointer = null; approach(); });
  for (const link of links) {
    link.addEventListener('focus', () => { focused = link; approach(); });
    link.addEventListener('blur', () => { focused = null; approach(); });
    // Native link navigation is preserved, including Enter, modifiers, and touch.
    // No input is injected into or intercepted from the system documents.
  }
  addEventListener('scroll', approach, { passive: true });
  addEventListener('resize', () => { sizeSystemViewport(); approach(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pointer = null; focused = null; choose(null, 0); }
  });
  addEventListener('pageshow', event => {
    if (event.persisted) { pointer = null; focused = null; choose(null, 0); }
  });
})();
