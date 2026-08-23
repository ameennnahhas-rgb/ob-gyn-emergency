// Arabic/localization stability patch — loaded after app.js
(function(){
  const originalRenderLevels = window.renderLevels;
  const originalRenderStep = window.renderStep;
  const originalSetLang = window.setLang;

  window.renderLevels = function(){
    const max = maxLevel();
    $('levelGrid').innerHTML = Object.entries(CASES).map(([id,c],i)=>{
      const locked=i+1>max;
      const name=lang==='ar'?c.ar:c.en;
      const details=lang==='ar' ? c.ar : c.details;
      return `<button class="levelCard ${locked?'locked':''}" data-id="${id}" ${locked?'disabled':''}>
        <div class="levelNo">${T[lang].level} ${i+1}</div>
        <div class="levelEmoji">${c.emoji}</div>
        <h3>${name}</h3><p>${details}</p>
        <span>${locked?'🔒 '+T[lang].locked:'▶ '+T[lang].choose}</span>
      </button>`;
    }).join('');
    document.querySelectorAll('.levelCard:not(.locked)').forEach(b=>b.onclick=()=>startLevel(b.dataset.id));
  };

  window.renderStep = function(){
    const c=CASES[levelId], s=c.steps[step];
    $('caseTag').textContent=`${T[lang].level} ${Object.keys(CASES).indexOf(levelId)+1}`;
    $('caseTitle').textContent=lang==='ar'?c.ar:c.en;
    $('progress').textContent=`${step+1} / ${c.steps.length}`;
    $('caseBrief').textContent=lang==='ar' ? s[1] : s[1];
    $('visualLabel').textContent=lang==='ar'?'المشهد السريري':'CLINICAL SCENE';
    $('visualArt').innerHTML=scene(c.emoji,levelId,step);
    $('patientName').textContent=c.patient;
    $('patientDetails').textContent=lang==='ar' ? ({ectopic:'٢٨ سنة • حمل ٧ أسابيع',normalbirth:'٢٥ سنة • ٣٩+٢ أسبوع • مخاض فعال',preeclampsia:'٣١ سنة • ٣٥ أسبوعًا • صداع شديد',pph:'٢٩ سنة • بعد ٢٠ دقيقة من الولادة المهبلية',shoulder:'٣٠ سنة • حمل تام • وُلد الرأس'}[levelId]) : c.details;
    $('health').textContent=health;
    $('healthBar').style.width=health+'%';
    $('stability').textContent=health<60?(lang==='ar'?'حرجة':'Critical'):(health<85?(lang==='ar'?'تحتاج مراقبة':'Watch'):(lang==='ar'?'مستقرة':'Stable'));
    const question = lang==='ar' ? s[2] : ({Arrival:'What is the first action?',Clues:'What do the vital signs indicate?',Ultrasound:'What is the most likely diagnosis?', 'Act now':'What is the definitive approach?', 'Second stage':'What is the priority?', 'After birth':'What should you do after birth?', 'Third stage':'What is the best follow-up?', 'Red flag':'What is the priority?', 'Prevent seizure':'Which medication is used for seizure prophylaxis?', Seizure:'What should you do first?', 'Definitive plan':'What is the correct principle?', Alarm:'What is the priority?', Tone:'What is the most likely cause?', 'First-line action':'What is the appropriate action?', Escalate:'What should you do?', Recognition:'What is the diagnosis?', Call:'What is the first organizational step?', Maneuver:'Which maneuver is appropriate?'}[s[0]]||s[2]);
    const choices = lang==='ar' ? s[3].map((x,i)=>c.steps[step][3][i]) : s[3];
    $('choices').innerHTML=`<h3 class="question">${question}</h3>`+choices.map((x,i)=>`<button class="choice" data-i="${i}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${lang==='ar'?translateChoice(levelId,step,i):x}</span></button>`).join('');
    $('feedback').className='feedback hidden';
    $('nextBtn').classList.add('hidden'); answered=false; 
    document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>answer(Number(b.dataset.i)));
    renderTimeline();
  };

  window.translateChoice=function(id,st,i){
    const ar={
      ectopic:[['ابدأ بتقييم ABC والإنعاش واستدعاء المساعدة','انتظر نتيجة β-hCG','أعطِ ميثوتركسات فورًا','أخرج المريضة'],['عدم الاستقرار الديناميكي الدموي','حمل مبكر طبيعي','مستقرة لأن SpO₂ طبيعي','لا حاجة لأي إجراء'],['حمل هاجر متمزق','مشيمة منزاحة','فرط إقياء','حمل طبيعي'],['تدبير جراحي إسعافي مع استمرار الإنعاش','انتظر β-hCG متسلسلًا','ميثوتركسات ومراقبة','متابعة خارجية']],
      normalbirth:[['دعم المخاض والاستمرار بتقييم الأم والجنين','عملية قيصرية فورية','إيقاف كل المراقبة','إعطاء مغنزيوم سلفات'],['دعم الولادة المضبوطة ومراقبة الأم والجنين','ضغط روتيني على قاع الرحم','الشد بقوة على الرأس','مغادرة الغرفة'],['تقييم الوليد ودعم التلامس جلدًا لجلد ومراقبة الأم','تجاهل توتر الرحم','فصل الأم والوليد دون داعٍ','إعطاء أوكسيتوسين فقط عند حدوث نزف شديد'],['استمرار المراقبة بعد الولادة وتقييم النزف وتوتر الرحم','إخراج المريضة فورًا','إيقاف كل المراقبة','طلب CT']],
      preeclampsia:[['التعرف على ارتفاع الضغط الشديد وتقييم وتثبيت المريضة بشكل عاجل','إرسالها للمنزل للراحة','الانتظار حتى الغد','إعطاء السوائل الفموية فقط'],['مغنزيوم سلفات','ميثوتركسات','أوكسيتوسين','وارفارين'],['تأمين الطريق الهوائي والسلامة واستدعاء المساعدة وإعطاء مغنزيوم سلفات وفق البروتوكول','تقييدها بقوة','وضع شيء في فمها','تركها وحدها'],['تثبيت الأم أولًا ثم التخطيط للولادة بحسب الحالة السريرية','تأخير كل التدبير لأسابيع','إخراجها بعد الاختلاج','علاج الصداع فقط']],
      pph:[['استدعاء المساعدة وتقييم ABC وقياس النزف وبدء الإنعاش','الانتظار ٣٠ دقيقة','إخراج المريضة','إعطاء مسكن فقط'],['وهن الرحم','حمل هاجر','مشيمة منزاحة قبل الولادة','فرط الإقياء'],['تدليك الرحم وإعطاء قابضات الرحم وفق البروتوكول','انتظار الإيكو قبل التدخل','تجاهل النزف','إعطاء ميثوتركسات'],['تفعيل بروتوكول النزف والتصعيد إلى التدابير النهائية','إرسال المريضة للمنزل','إيقاف المراقبة','الانتظار عدة ساعات']],
      shoulder:[['عسر ولادة الكتف','ولادة طبيعية','انفصال مشيمة','إرجاج'],['استدعاء المساعدة وإعلان الطوارئ وإيقاف الشد على الرأس','الشد بقوة أكبر على الرأس','ترك المريضة','الانتظار'],['مناورة ماكروبرتس مع الضغط فوق العانة عند اللزوم','الضغط على قاع الرحم','الشد القوي للأسفل','شق العجان وحده'],['تقييم الوليد والأم للمضاعفات وتوثيق الحالة الإسعافية','إيقاف المراقبة فورًا','تجاهل نزف الأم','افتراض عدم وجود أذية']]
    }; return ar[id]?.[st]?.[i]||CASES[id].steps[st][3][i];
  };

  window.setLang = function(){
    originalSetLang();
    $('disclaimer').textContent=lang==='ar'?'محاكاة تعليمية فقط. اتبع البروتوكولات المحلية واستشر الفريق المسؤول عند التعامل مع المرضى الحقيقيين.':'Educational simulation only. Follow local protocols and senior clinical guidance in real patients.';
    $('levelEyebrow').textContent=lang==='ar'?'اختر الحالة الإسعافية':'CHOOSE YOUR CASE';
    $('visualLabel').textContent=lang==='ar'?'المشهد السريري':'CLINICAL SCENE';
    renderLevels();
    if(levelId!==null && !$('game').classList.contains('hidden')) renderStep();
  };

  // Re-bind language button to the patched translator.
  $('langBtn').onclick=()=>{lang=lang==='en'?'ar':'en';$('langBtn').textContent=lang==='ar'?'English 🇬🇧':'عربي 🇸🇾';setLang();};
  setLang();
})();
