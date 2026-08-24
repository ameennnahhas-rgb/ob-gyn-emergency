(() => {
  'use strict';

  // Educational/demo mode: keep all levels available so learners can move
  // between cases without being blocked by a score threshold or stale localStorage.
  const UNLOCK_ALL = 999;
  localStorage.setItem('obgynUnlocked', String(UNLOCK_ALL));

  function unlockVisibleLevels() {
    document.querySelectorAll('.levelCard').forEach(card => {
      card.disabled = false;
      card.classList.remove('locked');
      const strong = card.querySelector('strong');
      if (strong && strong.textContent.includes('🔒')) {
        strong.textContent = '10 decisions';
      }
    });
  }

  const start = () => {
    unlockVisibleLevels();
    const grid = document.getElementById('levelGrid');
    if (grid) new MutationObserver(unlockVisibleLevels).observe(grid, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
