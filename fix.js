// Arabic/localization stability patch — loaded after app.js
(function(){
  const originalSetLang = window.setLang;
  const arDetails={
    ectopic:'٢٨ سنة • حمل ٧ أسابيع',
    normalbirth:'٢٥ سنة • ٣٩+٢ أسبوع • مخاض فعال',
    preeclampsia:'٣١ سنة • ٣٥ أسبوعًا • صداع شديد وأعراض بصرية',
    pph:'٢٩ سنة • بعد ٢٠ دقيقة من الولادة المهبلية',
    shoulder:'٣٠ سنة • حمل تام • وُلد الرأس ولم تلد الكتفين',
    abruption:'٣٤ سنة • ٣٦ أسبوعًا • نزف مؤلم',
    collapse:'٣٠ سنة • بعد الولادة • انهيار مفاجئ'
  };
  const ENQ={Arrival:'What is the first action?',Clues:'What do the vital signs indicate?',Ultrasound:'What is the most likely diagnosis?','Act now':'What is the definitive approach?','Second stage':'What is the priority?','After birth':'What should you do after birth?','Third stage':'What is the best follow-up?','Red flag':'What is the priority?','Prevent seizure':'Which medication is used for seizure prophylaxis?',Seizure:'What should you do first?','Definitive plan':'What is the correct principle?',Alarm:'What is the priority?',Tone:'What is the most likely cause?','First-line action':'What is the appropriate action?',Escalate:'What should you do?',Recognition:'What is the diagnosis?',Call:'What is the first organizational step?',Maneuver:'Which maneuver is appropriate?',Stabilize:'What is the priority?', 'Fetal status':'What principle guides management?',Bleeding:'What is important?',CPR:'What should happen next?',Cause:'What is the best approach?',Debrief:'What is important afterward?',TXA:'What important adjunct should be considered?'};
  const ARQ={Arrival:'ما الإجراء الأول؟',Clues:'ماذا تعني العلامات الحيوية؟',Ultrasound:'ما التشخيص الأكثر احتمالًا؟','Act now':'ما التوجه النهائي؟','Second stage':'ما الأولوية؟','After birth':'ماذا تفعل بعد الولادة؟','Third stage':'ما أفضل متابعة؟','Red flag':'ما الأولوية الآن؟','Prevent seizure':'ما الدواء المستخدم للوقاية من الاختلاجات؟',Seizure:'ماذا تفعل أثناء الاختلاج؟','Definitive plan':'ما المبدأ الصحيح بعد التثبيت؟',Alarm:'ما الأولوية؟',Tone:'ما السبب الأكثر احتمالًا؟','First-line action':'ما التدبير الأولي المناسب؟',Escalate:'ماذا تفعل؟',Recognition:'ما التشخيص؟',Call:'ما أول خطوة تنظيمية؟',Maneuver:'ما المناورة المناسبة؟',Stabilize:'ما الأولوية؟','Fetal status':'ما المبدأ الذي يوجه التدبير؟',Bleeding:'ما الأمر المهم؟',CPR:'ما الخطوة التالية؟',Cause:'ما أفضل نهج؟',Debrief:'ما المهم بعد ذلك؟',TXA:'ما الإضافة المهمة؟'};
  const choiceAR={
    ectopic:[['ابدأ بتقييم ABC والإنعاش واستدعاء المساعدة','انتظر نتيجة β-hCG','أعطِ ميثوتركسات فورًا','أخرج المريضة'],['عدم الاستقرار الديناميكي الدموي','حمل مبكر طبيعي','مستقرة لأن SpO₂ طبيعي','لا حاجة لأي إجراء'],['حمل هاجر متمزق','مشيمة منزاحة','فرط إقياء','حمل طبيعي'],['تدبير جراحي إسعافي مع استمرار الإنعاش','انتظر β-hCG متسلسلًا','ميثوتركسات ومراقبة','متابعة خارجية']],
    normalbirth:[['دعم المخاض والاستمرار بتقييم الأم والجنين','عملية قيصرية فورية','إيقاف كل المراقبة','إعطاء مغنزيوم سلفات'],['دعم الولادة المضبوطة ومراقبة الأم والجنين','ضغط روتيني على قاع الرحم','الشد بقوة على الرأس','مغادرة الغرفة'],['تقييم الوليد ودعم التلامس جلدًا لجلد ومراقبة الأم','تجاهل توتر الرحم','فصل الأم والوليد دون داعٍ','إعطاء أوكسيتوسين فقط عند حدوث نزف شديد'],['استمرار المراقبة بعد الولادة وتقييم النزف وتوتر الرحم','إخراج المريضة فورًا','إيقاف كل المراقبة','طلب CT']],
    preeclampsia:[['التعرف على ارتفاع الضغط الشديد وبدء خفض الضغط العاجل مع تقييم الأم والجنين','إرسالها للمنزل','الانتظار حتى الغد','إعطاء السوائل الفموية فقط'],['مغنزيوم سلفات','ميثوتركسات','أوكسيتوسين','وارفارين'],['تأمين السلامة والطريق الهوائي، استدعاء المساعدة وإعطاء مغنزيوم سلفات وفق البروتوكول','تقييدها بقوة','وضع شيء في فمها','تركها وحدها'],['تثبيت الأم أولًا ثم التخطيط للولادة بحسب الحالة السريرية وعمر الحمل','تأخير كل التدبير لأسابيع','إخراجها بعد الاختلاج','علاج الصداع فقط']],
    pph:[['استدعاء المساعدة وتقييم ABC وبدء الإنعاش وتحديد سبب النزف','الانتظار ٣٠ دقيقة','إخراج المريضة','إعطاء مسكن فقط'],['وهن الرحم','حمل هاجر','مشيمة منزاحة قبل الولادة','فرط الإقياء'],['تدليك الرحم وإعطاء قابضات الرحم وفق البروتوكول مع استمرار الإنعاش','انتظار الإيكو قبل التدخل','تجاهل النزف','إعطاء ميثوتركسات'],['إعطاء حمض الترانيكساميك وريديًا مبكرًا عند تشخيص نزف ما بعد الولادة، بأسرع وقت وخلال ٣ ساعات من الولادة وفق البروتوكول','إعطاء ميثوتركسات','تأخير العلاج حتى الغد','إيقاف الإنعاش']],
    shoulder:[['عسر ولادة الكتف','ولادة طبيعية','انفصال مشيمة','إرجاج'],['استدعاء المساعدة وإعلان الطوارئ وإيقاف الشد على الرأس','الشد بقوة أكبر على الرأس','ترك المريضة','الانتظار'],['مناورة ماكروبرتس مع الضغط فوق العانة عند اللزوم','الضغط على قاع الرحم','الشد القوي للأسفل','شق العجان وحده'],['تقييم الوليد والأم للمضاعفات وتوثيق الحالة الإسعافية','إيقاف المراقبة فورًا','تجاهل نزف الأم','افتراض عدم وجود أذية']],
    abruption:[['انفصال المشيمة المبكر','مشيمة منزاحة','حمل هاجر','مخاض طبيعي'],['تقييم ABC وتأمين خط وريدي والإنعاش وتقييم حالة الأم والجنين','انتظار التصوير قبل الإنعاش','إخراج المريضة','إعطاء ميثوتركسات'],['تسريع الولادة عند وجود تدهور أمومي أو جنيني بعد التثبيت والتصعيد المناسب','تأخير الولادة عدة أيام مهما كانت الحالة','إعطاء مثبطات المخاض وإخراج المريضة','تجاهل نبض الجنين'],['الاستعداد للنزف واضطراب التخثر وإدارة الحالة ضمن استجابة متعددة التخصصات','افتراض أن فقد الدم بسيط','إيقاف المراقبة','استخدام ميثوتركسات']],
    collapse:[['استدعاء المساعدة وبدء تقييم ABC والإنعاش فورًا عند الحاجة','انتظار نتائج المختبر','نقلها إلى غرفة هادئة','إعطاء سوائل فموية'],['بدء إنعاش قلبي رئوي عالي الجودة واتباع خوارزمية توقف القلب عند الأم','انتظار تخطيط القلب قبل الضغطات','إعطاء ميثوتركسات','ترك المريضة وحدها'],['البحث عن الأسباب القابلة للعكس مثل النزف والصمات والإرجاج والإنتان مع استمرار الإنعاش','إيقاف الإنعاش للتحري','افتراض أنها نوبة قلق','علاج الألم فقط'],['استمرار المراقبة الحرجة وتحديد السبب والتوثيق ومراجعة الحدث مع الفريق','إخراج المريضة فورًا','إيقاف المراقبة','تجاهل الحدث']]
  };
  window.renderLevels=function(){
    const max=maxLevel();
    $('levelGrid').innerHTML=Object.entries(CASES).map(([id,c],i)=>{const locked=i+1>max;return `<button class="levelCard ${locked?'locked':''}" data-id="${id}" ${locked?'disabled':''}><div class="levelNo">${T[lang].level} ${i+1}</div><div class="levelEmoji">${c.emoji}</div><h3>${lang==='ar'?c.ar:c.en}</h3><p>${lang==='ar'?(arDetails[id]||c.ar):c.details}</p><span>${locked?'🔒 '+T[lang].locked:'▶ '+T[lang].choose}</span></button>`}).join('');
    document.querySelectorAll('.levelCard:not(.locked)').forEach(b=>b.onclick=()=>startLevel(b.dataset.id));
  };
  window.renderStep=function(){
    const c=CASES[levelId],s=c.steps[step];
    $('caseTag').textContent=`${T[lang].level} ${Object.keys(CASES).indexOf(levelId)+1}`;
    $('caseTitle').textContent=lang==='ar'?c.ar:c.en;
    $('progress').textContent=`${step+1} / ${c.steps.length}`;
    $('caseBrief').textContent=lang==='ar'?(s[6]||s[1]):s[1];
    $('visualLabel').textContent=lang==='ar'?'المشهد السريري':'CLINICAL SCENE';
    $('visualArt').innerHTML=scene(c.emoji,levelId,step);
    $('patientName').textContent=c.patient;
    $('patientDetails').textContent=lang==='ar'?(arDetails[levelId]||c.ar):c.details;
    $('health').textContent=health;$('healthBar').style.width=health+'%';
    $('stability').textContent=health<60?(lang==='ar'?'حرجة':'Critical'):(health<85?(lang==='ar'?'تحتاج مراقبة':'Watch'):(lang==='ar'?'مستقرة':'Stable'));
    const question=lang==='ar'?(ARQ[s[0]]||s[2]):(ENQ[s[0]]||s[2]);
    const choices=lang==='ar'?(choiceAR[levelId]?.[step]||s[3]):s[3];
    $('choices').innerHTML=`<h3 class="question">${question}</h3>`+choices.map((x,i)=>`<button class="choice" data-i="${i}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${x}</span></button>`).join('');
    $('feedback').className='feedback hidden';$('nextBtn').classList.add('hidden');answered=false;
    document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>answer(Number(b.dataset.i)));
    renderTimeline();
  };
  window.setLang=function(){
    if(originalSetLang)originalSetLang();
    $('disclaimer').textContent=lang==='ar'?'محاكاة تعليمية فقط. اتبع البروتوكولات المحلية واستشر الفريق المسؤول عند التعامل مع المرضى الحقيقيين.':'Educational simulation only. Follow local protocols and senior clinical guidance in real patients.';
    $('levelEyebrow').textContent=lang==='ar'?'اختر الحالة الإسعافية':'CHOOSE YOUR CASE';
    $('visualLabel').textContent=lang==='ar'?'المشهد السريري':'CLINICAL SCENE';
    renderLevels();
    if(levelId!==null&&!$('game').classList.contains('hidden'))renderStep();
  };
  $('langBtn').onclick=()=>{lang=lang==='en'?'ar':'en';window.gameLang=lang;$('langBtn').textContent=lang==='ar'?'English 🇬🇧':'عربي 🇸🇾';setLang();};
  window.gameLang=lang;
  setLang();
})();
