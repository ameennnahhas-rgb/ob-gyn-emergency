(() => {
  'use strict';

  const COPY = {
    en: {
      heading: '🧠 Think before you answer',
      sub: 'Use a prompt to structure your clinical reasoning. It will not reveal the answer.',
      priority: ['🎯 What is the priority now?', 'What is the immediate threat, and what cannot safely wait?'],
      assessment: ['🩺 What should I assess?', 'Which vital sign, symptom or examination finding could change your next decision?'],
      investigation: ['🔬 What information do I need?', 'Which investigation or result would actually change management right now?'],
      team: ['👥 Do I need help?', 'Should you call senior obstetrics, anaesthesia, theatre, blood bank or neonatal support?'],
      close: 'Hide hint'
    },
    ar: {
      heading: '🧠 فكّر قبل أن تجيب',
      sub: 'استخدم التلميحات لتنظيم تفكيرك السريري. لن تكشف لك الإجابة.',
      priority: ['🎯 ما الأولوية الآن؟', 'ما الخطر المباشر؟ وما الخطوة التي لا تحتمل التأخير؟'],
      assessment: ['🩺 ماذا يجب أن أقيّم؟', 'أي علامة حيوية أو عرض أو نتيجة فحص يمكن أن تغيّر قرارك التالي؟'],
      investigation: ['🔬 ما المعلومات التي أحتاجها؟', 'أي استقصاء أو نتيجة ستغيّر التدبير الآن فعلًا؟'],
      team: ['👥 هل أحتاج إلى مساعدة؟', 'هل يجب استدعاء التوليد الخبير أو التخدير أو غرفة العمليات أو بنك الدم أو فريق حديثي الولادة؟'],
      close: 'إخفاء التلميح'
    }
  };

  const getLang = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';

  function contextHint() {
    const existing = document.querySelector('.clinicalTools .toolBtn[data-tool-context]');
    return existing?.dataset.toolContext || document.querySelector('.clinicalTools .toolBtn')?.dataset.tool || 'decision';
  }

  function render() {
    const host = document.querySelector('.clinicalTools');
    if (!host || host.dataset.unified === '1') return;
    host.dataset.unified = '1';
    const l = getLang();
    const c = COPY[l];
    host.innerHTML = `
      <div class="ctHeading"><span class="ctIcon">🧠</span><div><strong>${c.heading}</strong><small>${c.sub}</small></div></div>
      <div class="ctGrid">
        <button class="ctBtn" data-ct="priority">${c.priority[0]}</button>
        <button class="ctBtn" data-ct="assessment">${c.assessment[0]}</button>
        <button class="ctBtn" data-ct="investigation">${c.investigation[0]}</button>
        <button class="ctBtn" data-ct="team">${c.team[0]}</button>
      </div>
      <div class="ctHint" hidden aria-live="polite"></div>`;
  }

  function updateLanguage() {
    const host = document.querySelector('.clinicalTools');
    if (!host) return;
    host.dataset.unified = '';
    render();
  }

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('.ctBtn');
    if (!btn) return;
    const host = btn.closest('.clinicalTools');
    if (!host) return;
    const l = getLang();
    const item = COPY[l][btn.dataset.ct];
    const hint = host.querySelector('.ctHint');
    if (!item || !hint) return;
    const isSame = hint.dataset.key === btn.dataset.ct && !hint.hidden;
    if (isSame) {
      hint.hidden = true;
      hint.innerHTML = '';
      return;
    }
    hint.dataset.key = btn.dataset.ct;
    hint.innerHTML = `<span class="ctHintIcon">💡</span><div><strong>${item[0]}</strong><p>${item[1]}</p><button class="ctClose" type="button">${COPY[l].close}</button></div>`;
    hint.hidden = false;
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.ctClose')) return;
    const hint = event.target.closest('.ctHint');
    if (hint) hint.hidden = true;
  });

  const observer = new MutationObserver(() => {
    const host = document.querySelector('.clinicalTools');
    if (host && host.dataset.unified !== '1') render();
  });
  observer.observe(document.getElementById('game') || document.body, { childList: true, subtree: true });

  window.addEventListener('languagechange', updateLanguage);
  window.addEventListener('load', render, { once: true });
  render();
})();