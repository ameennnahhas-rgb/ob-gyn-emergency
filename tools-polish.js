(() => {
  'use strict';

  const labels = {
    en: { decision:'🎯 Thinking prompt', reassess:'📈 Reassess', assessment:'🩺 Vitals & assessment', history:'🗣️ History', examination:'🔎 Examination', investigation:'🔬 Investigations', resuscitation:'🩸 Resuscitation', team:'👥 Team', surgical:'🔪 Surgical planning', deterioration:'🚨 Deterioration', debrief:'📚 Debrief' },
    ar: { decision:'🎯 سؤال للتفكير', reassess:'📈 إعادة التقييم', assessment:'🩺 العلامات الحيوية والتقييم', history:'🗣️ القصة المرضية', examination:'🔎 الفحص السريري', investigation:'🔬 الاستقصاءات', resuscitation:'🩸 الإنعاش', team:'👥 الفريق', surgical:'🔪 التخطيط الجراحي', deterioration:'🚨 التدهور', debrief:'📚 المراجعة التعليمية' }
  };
  const prompts = {
    en: { decision:'What is the immediate threat? Which information would change your decision? Is there an action that cannot safely wait?', reassess:'Recheck the patient. Is the trajectory improving, unchanged, or deteriorating?', assessment:'Start with airway, breathing, circulation, haemodynamic stability and overall appearance.', history:'Ask only questions that can change the differential, urgency or immediate management.', examination:'Choose the examination that answers the current clinical question. Do not delay time-critical treatment.', investigation:'Choose investigations that can change immediate management. Do not let testing delay life-saving care.', resuscitation:'Think in parallel: support circulation and prepare appropriate blood/resuscitation measures while addressing the cause.', team:'Call the right help early: senior obstetrics, anaesthesia, theatre, blood bank and neonatal support as appropriate.', surgical:'Consider diagnosis, stability, bleeding, expertise, fertility considerations and local protocol.', deterioration:'Return to ABC priorities, recognize deterioration early, escalate help and move toward definitive control.', debrief:'Connect the decision to the problem you were trying to change. What improved the trajectory and what could have caused harm?' },
    ar: { decision:'ما الخطر المباشر؟ ما المعلومة التي قد تغيّر قرارك؟ وهل توجد خطوة لا تحتمل التأخير؟', reassess:'أعد تقييم المريضة. هل تتحسن حالتها أم لا تتغير أم تتدهور؟', assessment:'ابدأ بمجرى الهواء والتنفس والدوران والاستقرار الديناميكي الدموي والمظهر العام.', history:'اسأل فقط عن المعلومات التي يمكن أن تغيّر التشخيص التفريقي أو الاستعجال أو التدبير الفوري.', examination:'اختر الفحص الذي يجيب عن السؤال السريري الحالي. لا تؤخر العلاج الإسعافي من أجل فحص غير ضروري.', investigation:'اختر الاستقصاءات التي يمكن أن تغيّر التدبير الفوري. لا تسمح للفحوص بتأخير العلاج المنقذ للحياة.', resuscitation:'فكّر بالتوازي: ادعم الدوران وحضّر إجراءات الإنعاش والدم المناسب عند الحاجة مع معالجة السبب.', team:'اطلب المساعدة المناسبة مبكرًا: التوليد الخبير والتخدير وغرفة العمليات وبنك الدم وفريق حديثي الولادة حسب الحالة.', surgical:'فكّر بالتشخيص والاستقرار وشدة النزف والخبرة المتاحة واعتبارات الخصوبة والبروتوكول المحلي.', deterioration:'ارجع إلى أولويات ABC، تعرّف على التدهور مبكرًا، صعّد طلب المساعدة واتجه للسيطرة النهائية على السبب.', debrief:'اربط القرار بالمشكلة التي تحاول تغييرها. ما الذي حسّن مسار المريضة؟ وما الذي قد يسبب ضررًا أو تأخيرًا؟' }
  };
  const getLang = () => document.documentElement.lang === 'ar' ? 'ar' : 'en';
  function polishButtons() {
    const l = getLang();
    document.querySelectorAll('.clinicalTools .toolBtn').forEach(btn => {
      const type = btn.dataset.tool || 'decision';
      const text = labels[l][type] || labels[l].decision;
      if (btn.textContent !== text) btn.textContent = text;
      btn.setAttribute('aria-label', text.replace(/^\S+\s*/, ''));
    });
  }
  function showPrompt(type) {
    const box = document.getElementById('toolResult'); if (!box) return;
    const l = getLang(); const title = labels[l][type] || labels[l].decision; const text = prompts[l][type] || prompts[l].decision;
    const used = box.querySelector('small')?.textContent || '';
    box.innerHTML = `<div class="toolResultHead"><span class="toolResultIcon">💡</span><b>${title}</b></div><p>${text}</p>${used ? `<small>${used}</small>` : ''}`;
    box.classList.remove('hidden'); box.classList.add('toolResultVisible');
  }
  document.addEventListener('click', e => { const btn = e.target.closest('.clinicalTools .toolBtn'); if (btn) showPrompt(btn.dataset.tool || 'decision'); });
  window.addEventListener('load', polishButtons, { once:true });
  window.addEventListener('languagechange', polishButtons);
  window.polishClinicalTools = polishButtons;
  polishButtons();
})();