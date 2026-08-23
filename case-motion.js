(() => {
  'use strict';

  function findScene() { return document.querySelector('.sceneCard'); }
  function applyMotion() {
    const scene = findScene();
    if (!scene) return;
    const title = (document.getElementById('caseTitle')?.textContent || '').toLowerCase();
    const brief = (document.getElementById('caseBrief')?.textContent || '').toLowerCase();
    scene.classList.remove('motion-urgent','motion-stable','motion-birth','motion-seizure','motion-bleed','motion-surgical','motion-deteriorating','motion-improving');
    if (title.includes('ectopic') || title.includes('eclampsia') || brief.includes('seizure') || brief.includes('اختلاج') || brief.includes('إرجاج')) scene.classList.add('motion-urgent');
    else if (title.includes('shoulder') || title.includes('dystocia') || title.includes('عسر ولادة الكتف')) scene.classList.add('motion-urgent');
    else if (title.includes('postpartum') || title.includes('نزف ما بعد الولادة') || brief.includes('bleeding') || brief.includes('النزف')) scene.classList.add('motion-bleed');
    else if (title.includes('operating') || title.includes('غرفة العمليات')) scene.classList.add('motion-surgical');
    else if (title.includes('normal vaginal') || title.includes('الولادة المهبلية الطبيعية')) scene.classList.add('motion-birth');
    else scene.classList.add('motion-stable');
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-level], #nextBtn, #replayBtn, #quitBtn, #levelsBtn');
    if (!target) return;
    window.setTimeout(applyMotion, 40);
  });

  // React to the existing game's language/case updates without observing the whole DOM.
  document.addEventListener('click', event => {
    if (event.target.closest('#langBtn')) window.setTimeout(applyMotion, 90);
  });

  window.addEventListener('load', applyMotion, { once: true });
  window.refreshCaseMotion = applyMotion;
})();
