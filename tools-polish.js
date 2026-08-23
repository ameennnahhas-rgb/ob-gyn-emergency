(() => {
  'use strict';

  const labels = {
    en: {
      decision: '🎯 Thinking prompt',
      reassess: '📈 Reassess',
      assessment: '🩺 Vitals & assessment',
      history: '🗣️ History',
      examination: '🔎 Examination',
      investigation: '🔬 Investigations',
      resuscitation: '🩸 Resuscitation',
      team: '👥 Team',
      surgical: '🔪 Surgical planning',
      deterioration: '🚨 Deterioration',
      debrief: '📚 Debrief'
    },
    ar: {
      decision: '🎯 سؤال للتفكير',
      reassess: '📈 إعادة التقييم',
      assessment: '🩺 العلامات الحيوية والتقييم',
      history: '🗣️ القصة المرضية',
      examination: '🔎 الفحص السريري',
      investigation: '🔬 الاستقصاءات',
      resuscitation: '🩸 الإنعاش',
      team: '👥 الفريق',
      surgical: '🔪 التخطيط الجراحي',
      deterioration: '🚨 التدهور',
      debrief: '📚 المراجعة التعليمية'
    }
  };

  const prompts = {
    en: {
      decision: 'What is the immediate threat? Which piece of information would change your decision? Is there an action that cannot safely wait?',
      reassess: 'Recheck the patient after your last decision. Is the trajectory improving, unchanged, or deteriorating? Let the trend guide your next priority.',
      assessment: 'Start with the immediate clinical picture: airway, breathing, circulation, haemodynamic stability and overall appearance.',
      history: 'Ask only questions that can change the immediate differential, urgency or management. Focus on bleeding, pain, collapse symptoms and relevant risk factors.',
      examination: 'Choose an examination that answers the current clinical question and identifies deterioration. Do not delay time-critical treatment for a non-essential examination.',
      investigation: 'Choose investigations that can change immediate management. In an unstable patient, investigation must not become a reason to delay life-saving care.',
      resuscitation: 'Think in parallel: support circulation and prepare appropriate blood/resuscitation measures while the cause is being addressed.',
      team: 'Ask for the right help early when the situation exceeds one clinician’s capacity. Think about senior obstetrics, anaesthesia, theatre, blood bank and neonatal support as appropriate.',
      surgical: 'Think about the diagnosis, haemodynamic status, extent of disease or bleeding, available expertise, fertility considerations when relevant, and local protocol.',
      deterioration: 'Return to ABC priorities, recognize the change early, escalate help and move toward definitive control of the cause without unsafe delay.',
      debrief: 'Connect the decision to the problem you were trying to change. Ask what improved the patient trajectory and what could have caused avoidable delay or harm.'
    },
    ar: {
      decision: 'اسأل نفسك: ما الخطر الذي يهدد الحياة الآن؟ ما المعلومة التي يمكن أن تغيّر قراري؟ وهل توجد خطوة لا تحتمل التأخير؟',
      reassess: 'أعد تقييم المريضة بعد قرارك الأخير. هل تتحسن حالتها أم لا تتغير أم تتدهور؟ اجعل اتجاه الحالة يحدد أولويتك التالية.',
      assessment: 'ابدأ بالصورة السريرية المباشرة: مجرى الهواء، التنفس، الدوران، الاستقرار الديناميكي الدموي والمظهر العام للمريضة.',
      history: 'اسأل فقط عن المعلومات التي يمكن أن تغيّر التشخيص التفريقي أو درجة الاستعجال أو التدبير الفوري. ركّز على النزف والألم وأعراض الانهيار وعوامل الخطورة المهمة.',
      examination: 'اختر الفحص الذي يجيب عن السؤال السريري الحالي ويكشف التدهور. لا تؤخر التدبير الإسعافي من أجل فحص غير ضروري.',
      investigation: 'اختر الاستقصاءات التي يمكن أن تغيّر التدبير الفوري. عند عدم الاستقرار، يجب ألا تتحول الاستقصاءات إلى سبب لتأخير العلاج المنقذ للحياة.',
      resuscitation: 'فكّر بالتوازي: ادعم الدوران وابدأ إجراءات الإنعاش والتحضير المناسب للدم عند الحاجة، بالتزامن مع معالجة السبب.',
      team: 'اطلب المساعدة المناسبة مبكرًا عندما تتجاوز الحالة قدرة شخص واحد. فكّر بالفريق الخبير والتخدير وغرفة العمليات وبنك الدم وفريق حديثي الولادة حسب الحالة.',
      surgical: 'فكّر بالتشخيص والاستقرار الديناميكي الدموي وشدة المرض أو النزف والخبرة المتاحة واعتبارات الخصوبة عند اللزوم والبروتوكول المحلي.',
      deterioration: 'ارجع إلى أولويات ABC، تعرّف على التغير مبكرًا، صعّد طلب المساعدة واتجه إلى السيطرة النهائية على السبب دون تأخير غير آمن.',
      debrief: 'اربط القرار بالمشكلة التي كنت تحاول تغييرها. اسأل: ما الذي حسّن مسار المريضة؟ وما الذي كان يمكن أن يسبب تأخيرًا أو ضررًا يمكن تجنبه؟'
    }
  };

  function lang() { return document.documentElement.lang === 'ar' ? 'ar' : 'en'; }

  function polishButtons() {
    document.querySelectorAll('.clinicalTools .toolBtn').forEach(btn => {
      const type = btn.dataset.tool || 'decision';
      const text = labels[lang()][type] || labels[lang()].decision;
      btn.innerHTML = text;
      btn.setAttribute('aria-label', text.replace(/^\S+\s*/, ''));
    });
  }

  function showPrompt(type) {
    const box = document.getElementById('toolResult');
    if (!box) return;
    const l = lang();
    const text = prompts[l][type] || prompts[l].decision;
    const title = labels[l][type] || labels[l].decision;
    const usedMatch = box.querySelector('small');
    const used = usedMatch ? usedMatch.textContent : '';
    box.innerHTML = `<div class="toolResultHead"><span class="toolResultIcon">💡</span><b>${title}</b></div><p>${text}</p>${used ? `<small>${used}</small>` : ''}`;
    box.classList.remove('hidden');
    box.classList.add('toolResultVisible');
  }

  document.addEventListener('click', event => {
    const btn = event.target.closest('.clinicalTools .toolBtn');
    if (!btn) return;
    const type = btn.dataset.tool || 'decision';
    window.setTimeout(() => showPrompt(type), 0);
  });

  const observer = new MutationObserver(polishButtons);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', polishButtons);
  polishButtons();
})();
