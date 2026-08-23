(() => {
  'use strict';

  // Lightweight Arabic UI patch. The game engine already owns the clinical
  // content translations; this file only fills static labels that may remain
  // in English. No MutationObserver and no full-document TreeWalker are used.
  const T = {
    ar: {
      subtitle:'تحدي اتخاذ القرار السريري', scoreLabel:'النتيجة', patientLabel:'المريضة',
      eyebrow:'قسم الطوارئ • المناوبة الليلية', heroTitle:'هل تستطيع <span>إنقاذ</span> المريضة؟',
      heroText:'اختر حالة سريرية، قيّم المريضة، تعرّف على الطارئ واتخذ القرار المناسب تحت الضغط.',
      missionTitle:'🎯 مهمتك', mission:'تعلّم من خلال الممارسة — كل قرار تتخذه يؤثر في مسار المريضة.',
      startBtn:'ابدأ التحدي ←', disclaimer:'محاكاة تعليمية فقط.', levelEyebrow:'اختر حالتك',
      levelsTitle:'مستويات الطوارئ', levelsText:'اختر سيناريو سريريًا.', backHome:'← الرئيسية',
      visualLabel:'المشهد السريري', statusTitle:'حالة المريضة', stabilityLabel:'الاستقرار',
      timelineTitle:'تقدم الحالة', quitBtn:'↩ خروج من المستوى', complete:'اكتمل المستوى',
      outcome:'🏆 نتيجة المريضة', correctLabel:'القرارات الصحيحة', errorsLabel:'الأخطاء الحرجة',
      healthLabel:'حالة المريضة', nameLabel:'اسمك', saveScoreBtn:'حفظ النتيجة',
      privacyNote:'يتم حفظ نتيجتك محليًا على هذا الجهاز.', replayBtn:'العب مرة أخرى ↻',
      levelsBtn:'اختر مستوى آخر', creditsRole:'طبيب مقيم نسائية وتوليد • مُعلّم طبي',
      creditsText:'تم إنشاء وتصميم اللعبة للتعليم الطبي والتدرب على اتخاذ القرارات السريرية.',
      continue:'متابعة →'
    },
    en: {
      subtitle:'Clinical Decision Challenge', scoreLabel:'Score', patientLabel:'Patient',
      eyebrow:'EMERGENCY DEPARTMENT • NIGHT SHIFT', heroTitle:'Can you <span>save</span> the patient?',
      heroText:'Choose a clinical scenario, assess the patient, recognize the emergency and make the right decision under pressure.',
      missionTitle:'🎯 Your mission', mission:'Learn by doing — every choice changes the patient outcome.',
      startBtn:'START CHALLENGE →', disclaimer:'Educational simulation only.', levelEyebrow:'CHOOSE YOUR CASE',
      levelsTitle:'Emergency Levels', levelsText:'Choose a scenario.', backHome:'← Home', visualLabel:'Clinical scene',
      statusTitle:'Patient status', stabilityLabel:'Stability', timelineTitle:'Case progress', quitBtn:'↩ Exit level',
      complete:'LEVEL COMPLETE', outcome:'🏆 Patient outcome', correctLabel:'Correct decisions', errorsLabel:'Critical errors',
      healthLabel:'Patient health', nameLabel:'Your name', saveScoreBtn:'SAVE SCORE',
      privacyNote:'Your score is saved locally on this device.', replayBtn:'PLAY AGAIN ↻',
      levelsBtn:'CHOOSE ANOTHER LEVEL', creditsRole:'OB/GYN Resident • Medical Educator',
      creditsText:'Created and designed for medical education and clinical decision-making practice.',
      continue:'CONTINUE →'
    }
  };

  function isArabic(){ return document.documentElement.lang === 'ar' || document.body.dir === 'rtl'; }
  function applyStatic(){
    const l = isArabic() ? 'ar' : 'en';
    const t = T[l];
    Object.keys(t).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 'heroTitle') el.innerHTML = t[id];
      else el.textContent = t[id];
    });
    const input = document.getElementById('playerName');
    if (input) input.placeholder = isArabic() ? 'أدخل اسمك' : 'Enter your name';
    document.documentElement.dir = isArabic() ? 'rtl' : 'ltr';
    document.body.dir = isArabic() ? 'rtl' : 'ltr';
    document.title = isArabic() ? 'تحدي طوارئ النسائية والتوليد' : 'OB/GYN Emergency Challenge';
    if (window.polishClinicalTools) window.polishClinicalTools();
  }

  // app-v2.js owns the actual language toggle. We only refresh the small
  // static shell after it has changed; this never scans or observes the DOM.
  function refresh(){ window.setTimeout(applyStatic, 0); }
  document.addEventListener('DOMContentLoaded', applyStatic, {once:true});
  document.addEventListener('click', event => {
    if (event.target.closest('#langBtn')) refresh();
  }, {passive:true});
  window.addEventListener('load', applyStatic, {once:true});
})();