// Lightweight header search: clicking the search icon reveals an inline
// search box overlay instead of navigating to a separate page.
(() => {
  const icon = document.querySelector('.nav-icons a[aria-label="Search"]');
  if (!icon) return;

  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="search-overlay-inner" role="search">
      <form class="search-overlay-form">
        <input type="search" name="q" placeholder="SEARCH" aria-label="Search keyword" autocomplete="off" />
        <button type="submit" aria-label="Search">&rarr;</button>
      </form>
      <button type="button" class="search-overlay-close" aria-label="Close search">&times;</button>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('input');
  const form = overlay.querySelector('.search-overlay-form');
  const closeBtn = overlay.querySelector('.search-overlay-close');
  let isOpen = false;

  const open = () => {
    isOpen = true;
    overlay.hidden = false;
    // Force a reflow so the slide-in transition runs from the off-screen
    // state without relying on requestAnimationFrame.
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    input.focus();
  };
  const close = () => {
    isOpen = false;
    overlay.classList.remove('is-open');
    // Hide after the slide-out finishes; works even if transitionend
    // doesn't fire (reduced motion, throttled tabs).
    setTimeout(() => { if (!isOpen) overlay.hidden = true; }, 450);
  };

  icon.addEventListener('click', event => {
    event.preventDefault();
    isOpen ? close() : open();
  });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen) close();
  });
  // No separate results page — just surface the box.
  form.addEventListener('submit', event => event.preventDefault());
})();
