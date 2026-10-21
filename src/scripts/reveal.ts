// Small, once-only reveal effects. Nothing is hidden unless <html> has .motion-ready
// (set in BaseLayout only when reduced motion is not requested), so no-JS and
// reduced-motion visitors always see the finished state.
const root = document.documentElement;

if (root.classList.contains('motion-ready')) {
  // T∆RS's lines type in, one character at a time, when they scroll into view.
  // Screen readers get the whole line from a visually hidden copy.
  for (const el of document.querySelectorAll<HTMLElement>('.book-page-machine')) {
    const text = el.textContent ?? '';
    const spoken = document.createElement('span');
    spoken.className = 'sr-only';
    spoken.textContent = text;
    const typed = document.createElement('span');
    typed.setAttribute('aria-hidden', 'true');
    [...text].forEach((char, i) => {
      const c = document.createElement('span');
      c.className = 'type-char';
      c.style.setProperty('--i', String(i));
      c.textContent = char;
      typed.append(c);
    });
    el.replaceChildren(spoken, typed);
    el.setAttribute('data-reveal', '');
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.35, rootMargin: '0px 0px -12% 0px' },
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
