(() => {
  'use strict';

  const T = {
    ar: {
      subtitle:'تحدي اتخاذ القرار السريري', scoreLabel:'النتيجة', patientLabel:'المريضة', eyebrow:'قسم الطوارئ • المناوبة الليلية',
      heroTitle:'هل تستطيع <span>إنقاذ</span> المريضة؟', heroText:'اختر حالة سريرية، قيّم المريضة، تعرّف على الطارئ واتخذ القرار المناسب تحت الضغط.',
      missionTitle:'🎯 مهمتك', mission:'تعلّم من خلال الممارسة — كل قرار تتخذه يؤثر في مسار المريضة.', startBtn:'ابدأ التحدي ←', disclaimer:'محاكاة تعليمية فقط.',
      levelEyebrow:'اختر حالتك', levelsTitle:'مستويات الطوارئ', levelsText:'اختر سيناريو سريريًا.', backHome:'← الرئيسية', visualLabel:'المشهد السريري',
      statusTitle:'حالة المريضة', stabilityLabel:'الاستقرار', stability:'مستقرة', timelineTitle:'تقدم الحالة', quitBtn:'↩ خروج من المستوى', complete:'اكتمل المستوى',
      outcome:'🏆 نتيجة المريضة', correctLabel:'القرارات الصحيحة', errorsLabel:'الأخطاء الحرجة', healthLabel:'حالة المريضة', nameLabel:'اسمك', playerPlaceholder:'أدخل اسمك',
      saveScoreBtn:'حفظ النتيجة', privacyNote:'يتم حفظ نتيجتك محليًا على هذا الجهاز.', replayBtn:'العب مرة أخرى ↻', levelsBtn:'اختر مستوى آخر',
      creditsRole:'طبيب مقيم نسائية وتوليد • مُعلّم طبي', creditsText:'تم إنشاء وتصميم اللعبة للتعليم الطبي والتدرب على اتخاذ القرارات السريرية.',
      continue:'متابعة →', correct:'صحيح', incorrect:'غير صحيح', home:'الرئيسية'
    },
    en: {
      subtitle:'Clinical Decision Challenge', scoreLabel:'Score', patientLabel:'Patient', eyebrow:'EMERGENCY DEPARTMENT • NIGHT SHIFT',
      heroTitle:'Can you <span>save</span> the patient?', heroText:'Choose a clinical scenario, assess the patient, recognize the emergency and make the right decision under pressure.',
      missionTitle:'🎯 Your mission', mission:'Learn by doing — every choice changes the patient outcome.', startBtn:'START CHALLENGE →', disclaimer:'Educational simulation only.',
      levelEyebrow:'CHOOSE YOUR CASE', levelsTitle:'Emergency Levels', levelsText:'Choose a scenario.', backHome:'← Home', visualLabel:'Clinical scene',
      statusTitle:'Patient status', stabilityLabel:'Stability', stability:'Stable', timelineTitle:'Case progress', quitBtn:'↩ Exit level', complete:'LEVEL COMPLETE',
      outcome:'🏆 Patient outcome', correctLabel:'Correct decisions', errorsLabel:'Critical errors', healthLabel:'Patient health', nameLabel:'Your name', playerPlaceholder:'Enter your name',
      saveScoreBtn:'SAVE SCORE', privacyNote:'Your score is saved locally on this device.', replayBtn:'PLAY AGAIN ↻', levelsBtn:'CHOOSE ANOTHER LEVEL',
      creditsRole:'OB/GYN Resident • Medical Educator', creditsText:'Created and designed for medical education and clinical decision-making practice.', continue:'CONTINUE →', correct:'Correct', incorrect:'Incorrect', home:'Home'
    }
  };

  const exact = {
    'Clinical Tools':'🧠 أدوات التفكير السريري','Clinical Thinking Tools':'🧠 أدوات التفكير السريري','Use a tool to help you think before making your decision.':'استخدم أداة لمساعدتك على التفكير قبل اتخاذ القرار.',
    'Patient status':'حالة المريضة','Case progress':'تقدم الحالة','Clinical scene':'المشهد السريري','Stable':'مستقرة','Unstable':'غير مستقرة',
    'Correct':'صحيح','Incorrect':'غير صحيح','WHY?':'لماذا؟','Clinical consequence':'النتيجة السريرية','CONTINUE →':'متابعة →','Continue →':'متابعة →',
    'START CHALLENGE →':'ابدأ التحدي →','SAVE SCORE':'حفظ النتيجة','PLAY AGAIN ↻':'العب مرة أخرى ↻','CHOOSE ANOTHER LEVEL':'اختر مستوى آخر','Home':'الرئيسية','Exit level':'خروج من المستوى',
    'Emergency case':'حالة إسعافية','Question':'السؤال','Level':'المستوى','Score':'النتيجة','Patient':'المريضة','Correct decisions':'القرارات الصحيحة','Critical errors':'الأخطاء الحرجة','Patient health':'حالة المريضة',
    'Your name':'اسمك','Enter your name':'أدخل اسمك','Your score is saved locally on this device.':'يتم حفظ نتيجتك محليًا على هذا الجهاز.',
    'LEVEL COMPLETE':'اكتمل المستوى','Patient outcome':'نتيجة المريضة','CHOOSE YOUR CASE':'اختر حالتك','Emergency Levels':'مستويات الطوارئ','Choose a scenario.':'اختر سيناريو سريريًا.',
    'Clinical Decision Challenge':'تحدي اتخاذ القرار السريري','Educational simulation only.':'محاكاة تعليمية فقط.','EMERGENCY DEPARTMENT • NIGHT SHIFT':'قسم الإسعاف • المناوبة الليلية'
  };

  function arabic(){ return document.documentElement.lang === 'ar' || document.body.dir === 'rtl'; }
  function tr(key){ return (T[arabic()?'ar':'en'][key] || key); }

  function applyStatic(){
    const ids=['subtitle','scoreLabel','patientLabel','eyebrow','heroText','missionTitle','mission','startBtn','disclaimer','levelEyebrow','levelsTitle','levelsText','backHome','visualLabel','statusTitle','stabilityLabel','timelineTitle','quitBtn','complete','outcome','correctLabel','errorsLabel','healthLabel','nameLabel','saveScoreBtn','privacyNote','replayBtn','levelsBtn','creditsRole','creditsText'];
    ids.forEach(id=>{ const el=document.getElementById(id); if(!el) return; if(id==='heroTitle'){ const h=document.getElementById('heroTitle'); if(h) h.innerHTML=tr('heroTitle'); return; } el.textContent=tr(id); });
    const input=document.getElementById('playerName'); if(input) input.placeholder=tr('playerPlaceholder');
    document.documentElement.dir=arabic()?'rtl':'ltr'; document.body.dir=arabic()?'rtl':'ltr';
    document.title=arabic()?'تحدي طوارئ النسائية والتوليد':'OB/GYN Emergency Challenge';
  }

  function translateNew(root){
    if(!arabic() || !root) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n=>{ const s=n.nodeValue.trim(); const replacement=exact[s]; if(replacement && replacement!==s) n.nodeValue=n.nodeValue.replace(s,replacement); });
  }

  function applyAll(){ applyStatic(); translateNew(document.body); if(window.polishClinicalTools) window.polishClinicalTools(); }

  // IMPORTANT: never observe the whole DOM continuously. The old observer repeatedly
  // rewrote text nodes, which could lock the page when switching to Arabic.
  document.addEventListener('DOMContentLoaded', applyAll, {once:true});
  window.addEventListener('load', applyAll, {once:true});
  const langBtn=document.getElementById('langBtn');
  if(langBtn) langBtn.addEventListener('click', () => setTimeout(applyAll, 80), {passive:true});
  window.addEventListener('languagechange', () => setTimeout(applyAll, 30));

  // Translate only newly inserted game content, with a short debounce.
  let pending=false;
  const observer=new MutationObserver(mutations=>{
    if(!arabic() || pending) return;
    const added=mutations.some(m=>m.type==='childList' && m.addedNodes.length);
    if(!added) return;
    pending=true;
    requestAnimationFrame(()=>{ pending=false; mutations.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1) translateNew(n); })); });
  });
  observer.observe(document.body,{childList:true,subtree:true});
})();