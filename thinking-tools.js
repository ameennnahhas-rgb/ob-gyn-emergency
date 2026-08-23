(() => {
  'use strict';

  const LANG = {
    en: {
      title: '🧠 Think before you answer',
      subtitle: 'Use a clue to structure your clinical reasoning. It does not reveal the answer.',
      priority: '🎯 What is the priority?',
      assess: '🩺 What should I assess?',
      info: '🔬 What information do I need?',
      team: '👥 Do I need help?',
      priorityHint: 'What is the immediate threat, and what action cannot safely wait?',
      assessHint: 'Which vital sign, symptom, or examination finding could change your next decision?',
      infoHint: 'Which investigation or history point would actually change management now?',
      teamHint: 'Would early help from senior obstetrics, anaesthesia, theatre, blood bank, or neonatal support improve safety?',
      close: 'Hide hint'
    },
    ar: {
      title: '🧠 فكّر قبل أن تجيب',
      subtitle: 'استخدم التلميحات لترتيب تفكيرك السريري. لن تكشف لك الإجابة.',
      priority: '🎯 ما الأولوية الآن؟',
      assess: '🩺 ماذا يجب أن أقيّم؟',
      info: '🔬 ما المعلومات التي أحتاجها؟',
      team: '👥 هل أحتاج إلى مساعدة؟',
      priorityHint: 'ما الخطر المباشر؟ وما الخطوة التي لا تحتمل التأخير؟',
      assessHint: 'أي علامة حيوية أو عرض أو نتيجة فحص يمكن أن تغيّر قرارك التالي؟',
      infoHint: 'ما الاستقصاء أو المعلومة من القصة المرضية التي يمكن أن تغيّر التدبير الآن فعلًا؟',
      teamHint: 'هل سيحسن التصعيد المبكر إلى التوليد الخبير أو التخدير أو غرفة العمليات أو بنك الدم أو فريق حديثي الولادة أمان المريضة؟',
      close: 'إخفاء التلميح'
    }
  };

  const isAr = () => document.documentElement.lang === 'ar' || document.body.dir === 'rtl';
  const current = () => LANG[isAr() ? 'ar' : 'en'];

  function mount() {
    const host = document.getElementById('clinicalThinking');
    if (!host) return;
    const l = current();
    host.innerHTML = `<section class="thinkingPanel" aria-label="${l.title}">
      <div class="thinkingHeader"><h3>${l.title}</h3><p>${l.subtitle}</p></div>
      <div class="thinkingGrid">
        <button type="button" class="thinkingBtn" data-thinking="priority">${l.priority}</button>
        <button type="button" class="thinkingBtn" data-thinking="assess">${l.assess}</button>
        <button type="button" class="thinkingBtn" data-thinking="info">${l.info}</button>
        <button type="button" class="thinkingBtn" data-thinking="team">${l.team}</button>
      </div>
      <div class="thinkingHint hidden" aria-live="polite"></div>
    </section>`;
  }

  function refresh() {
    const host = document.getElementById('clinicalThinking');
    if (!host || document.getElementById('game')?.classList.contains('hidden')) return;
    mount();
  }

  document.addEventListener('click', (event) => {
    const tool = event.target.closest('.thinkingBtn');
    if (tool) {
      const host = tool.closest('#clinicalThinking');
      if (!host) return;
      const l = current();
      const key = tool.dataset.thinking;
      const hints = { priority:l.priorityHint, assess:l.assessHint, info:l.infoHint, team:l.teamHint };
      const hint = host.querySelector('.thinkingHint');
      if (!hint) return;
      hint.innerHTML = `<div class="hintIcon">💡</div><div><b>${tool.textContent}</b><p>${hints[key]}</p><button type="button" class="hintClose">${l.close}</button></div>`;
      hint.classList.remove('hidden');
      return;
    }

    if (event.target.closest('.hintClose')) {
      event.target.closest('.thinkingHint')?.classList.add('hidden');
      return;
    }

    const trigger = event.target.closest('#langBtn,#nextBtn,.levelCard,#replayBtn,#levelsBtn,#quitBtn');
    if (trigger) window.setTimeout(refresh, 0);
  });

  document.addEventListener('DOMContentLoaded', refresh, { once:true });
  window.addEventListener('load', refresh, { once:true });
  window.refreshThinkingTools = refresh;
  refresh();
})();