(() => {
  'use strict';

  const LANG = {
    en: {
      title: '🧠 Think before you answer',
      subtitle: 'Use a clue to organize your clinical reasoning — not to reveal the answer.',
      priority: '🎯 What is the priority?',
      assess: '🩺 What should I assess?',
      info: '🔬 What information do I need?',
      team: '👥 Do I need help?',
      priorityHint: 'What is the immediate threat to the patient right now?',
      assessHint: 'Which finding, examination or vital sign could change your next decision?',
      infoHint: 'Which investigation or piece of history would actually change management now?',
      teamHint: 'Would early escalation to senior, anaesthesia, theatre, blood bank or neonatal support change safety?',
      close: 'Close'
    },
    ar: {
      title: '🧠 فكّر قبل أن تجيب',
      subtitle: 'استخدم التلميحة لترتيب تفكيرك السريري — وليس لكشف الإجابة.',
      priority: '🎯 ما الأولوية الآن؟',
      assess: '🩺 ماذا يجب أن أقيّم؟',
      info: '🔬 ما المعلومات التي أحتاجها؟',
      team: '👥 هل أحتاج إلى مساعدة؟',
      priorityHint: 'ما الخطر المباشر الذي يهدد المريضة الآن؟',
      assessHint: 'أي علامة أو فحص أو قيمة حيوية يمكن أن تغيّر قرارك التالي؟',
      infoHint: 'ما الاستقصاء أو المعلومة من القصة المرضية التي يمكن أن تغيّر التدبير الآن فعلًا؟',
      teamHint: 'هل سيؤدي التصعيد المبكر إلى الطبيب الخبير أو التخدير أو غرفة العمليات أو بنك الدم أو فريق حديثي الولادة إلى تحسين الأمان؟',
      close: 'إغلاق'
    }
  };

  function isAr() { return document.documentElement.lang === 'ar' || document.body.dir === 'rtl'; }
  function L() { return LANG[isAr() ? 'ar' : 'en']; }

  function mount() {
    const host = document.getElementById('clinicalThinking');
    if (!host) return;
    const l = L();
    host.innerHTML = `
      <section class="thinkingPanel" aria-label="${l.title}">
        <div class="thinkingHeader">
          <div><h3>${l.title}</h3><p>${l.subtitle}</p></div>
        </div>
        <div class="thinkingGrid">
          <button class="thinkingBtn" data-thinking="priority">${l.priority}</button>
          <button class="thinkingBtn" data-thinking="assess">${l.assess}</button>
          <button class="thinkingBtn" data-thinking="info">${l.info}</button>
          <button class="thinkingBtn" data-thinking="team">${l.team}</button>
        </div>
        <div id="thinkingHint" class="thinkingHint hidden"></div>
      </section>`;

    host.querySelectorAll('.thinkingBtn').forEach(btn => btn.addEventListener('click', () => {
      const key = btn.dataset.thinking;
      const hint = host.querySelector('#thinkingHint');
      const hints = {priority:l.priorityHint,assess:l.assessHint,info:l.infoHint,team:l.teamHint};
      hint.innerHTML = `<div class="hintIcon">💡</div><div><b>${btn.textContent}</b><p>${hints[key]}</p></div>`;
      hint.classList.remove('hidden');
    }));
  }

  function ensureHost() {
    let host = document.getElementById('clinicalThinking');
    if (!host) {
      host = document.createElement('div');
      host.id = 'clinicalThinking';
      const choices = document.getElementById('choices');
      if (choices && choices.parentNode) choices.parentNode.insertBefore(host, choices);
    }
    mount();
  }

  document.addEventListener('DOMContentLoaded', ensureHost, {once:true});
  window.addEventListener('load', ensureHost, {once:true});
  window.addEventListener('languagechange', ensureHost);
  window.refreshThinkingTools = ensureHost;
})();
