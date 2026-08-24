(() => {
  'use strict';
  let timer = null, seconds = 35, decisions = 0, correct = 0, start = 0, lastStepKey = '', currentCaseKey = '';
  const $ = id => document.getElementById(id);
  const game = () => $('game') && !$('game').classList.contains('hidden');

  function addUI(){
    if(!$('game') || $('eduHud')) return;
    const head = document.querySelector('.casehead');
    if(!head) return;
    const hud = document.createElement('div');
    hud.id = 'eduHud';
    hud.className = 'eduHud';
    hud.innerHTML = '<div>⏱️ <b id="eduTimer">35</b>s</div><div>🎯 <b id="eduAccuracy">0%</b></div><div>⚡ <b id="eduPace">Ready</b></div>';
    head.appendChild(hud);

    const monitor = document.createElement('div');
    monitor.id = 'liveVitals';
    monitor.className = 'liveVitals';
    monitor.innerHTML = '<span>❤️ HR <b id="liveHR">—</b></span><span>🩺 BP <b id="liveBP">—</b></span><span>🫁 SpO₂ <b id="liveSpO2">—</b></span>';
    const main = document.querySelector('#game .main');
    const visual = $('visual');
    if(main && visual) main.insertBefore(monitor, visual);
  }

  function setVitals(){
    const h = $('liveHR'), b = $('liveBP'), s = $('liveSpO2');
    if(!h) return;
    const n = $('caseTitle')?.textContent || '';
    const brief = $('caseBrief')?.textContent || '';
    const text = `${n} ${brief}`;
    let v = /Ectopic|الحمل الهاجر/i.test(text)
      ? ['128','82/50','97%']
      : /Preeclampsia|مقدمات|Eclampsia|الإرجاج/i.test(text)
        ? ['104','170/112','98%']
        : /Haemorrhage|نزف|PPH/i.test(text)
          ? ['122','88/54','95%']
          : ['92','118/72','98%'];
    h.textContent = v[0];
    b.textContent = v[1];
    s.textContent = v[2];
  }

  function tick(){
    clearInterval(timer);
    seconds = 35;
    start = Date.now();
    const t = $('eduTimer');
    if(!t) return;
    t.parentElement.classList.remove('danger');
    t.textContent = seconds;
    if($('eduPace')) $('eduPace').textContent = 'Ready';
    timer = setInterval(() => {
      if(!game()) { clearInterval(timer); return; }
      seconds--;
      t.textContent = Math.max(0, seconds);
      if(seconds <= 10 && seconds > 0) t.parentElement.classList.add('danger');
      if(seconds <= 0){
        clearInterval(timer);
        t.parentElement.classList.add('danger');
        if($('eduPace')) $('eduPace').textContent = 'TIME';
      }
    }, 1000);
  }

  function getStepKey(){
    const tag = $('caseTag')?.textContent || '';
    const progress = $('progress')?.textContent || '';
    const brief = $('caseBrief')?.textContent || '';
    const choices = $('choices')?.textContent || '';
    return `${tag}|${progress}|${brief}|${choices.slice(0,120)}`;
  }

  function getCaseKey(){
    return `${$('caseTitle')?.textContent || ''}|${$('patientName')?.textContent || ''}`;
  }

  function observe(){
    const choices = $('choices');
    if(!choices || choices.dataset.eduObserved) return;
    choices.dataset.eduObserved = '1';
    new MutationObserver(() => {
      [...choices.querySelectorAll('button')].forEach(btn => {
        if(btn.dataset.eduBound) return;
        btn.dataset.eduBound = '1';
        btn.addEventListener('click', () => {
          decisions++;
          const wasCorrect = btn.classList.contains('correct');
          if(wasCorrect) correct++;
          const acc = Math.round(correct / decisions * 100);
          if($('eduAccuracy')) $('eduAccuracy').textContent = acc + '%';
          const pace = Math.round((Date.now() - start) / 1000);
          if($('eduPace')) $('eduPace').textContent = pace <= 10 ? 'FAST' : pace <= 20 ? 'GOOD' : 'SLOW';
          setTimeout(setVitals, 120);
        });
      });
    }).observe(choices, {childList:true, subtree:true});
  }

  function enrichEnd(){
    const end = $('end');
    if(!end || end.dataset.eduEnhanced) return;
    end.dataset.eduEnhanced = '1';
    const box = document.createElement('div');
    box.className = 'debriefBox';
    box.innerHTML = '<h3>🧠 Clinical Debrief</h3><p>Strong emergency decision-making means recognizing deterioration early, prioritizing ABCs, reassessing after every intervention, escalating to the right team and avoiding dangerous delay.</p><div class="debriefGrid"><div><span>Decision accuracy</span><b id="finalAccuracy">0%</b></div><div><span>Response style</span><b id="finalPace">—</b></div><div><span>Clinical focus</span><b>Recognition + escalation</b></div></div><p class="pearl"><b>💡 Clinical Pearl:</b> Stabilize first when unstable, reassess continuously, and use local guidelines/protocols for definitive management.</p>';
    const ref = $('clinicalRefs');
    if(ref) end.insertBefore(box, ref); else end.insertBefore(box, end.firstChild);
  }

  function loop(){
    addUI();
    observe();
    setVitals();
    enrichEnd();

    if(game()){
      const caseKey = getCaseKey();
      const stepKey = getStepKey();

      if(caseKey && caseKey !== currentCaseKey){
        currentCaseKey = caseKey;
        lastStepKey = '';
        decisions = 0;
        correct = 0;
        if($('eduAccuracy')) $('eduAccuracy').textContent = '0%';
      }

      if(stepKey && stepKey !== lastStepKey){
        lastStepKey = stepKey;
        tick();
      }
    } else {
      clearInterval(timer);
      lastStepKey = '';
      currentCaseKey = '';
    }

    if($('finalAccuracy')) $('finalAccuracy').textContent = (decisions ? Math.round(correct / decisions * 100) : 0) + '%';
    if($('finalPace')) $('finalPace').textContent = seconds > 20 ? 'Calm & fast' : seconds > 0 ? 'Focused under pressure' : 'Time expired';
    requestAnimationFrame(loop);
  }

  loop();
})();