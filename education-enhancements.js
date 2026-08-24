(() => {
  'use strict';

  let timer = null, seconds = 35, start = 0;
  let decisions = 0, correct = 0, fastCorrect = 0;
  let lastStepKey = '', currentCaseKey = '';
  let patientState = { hr: 92, sbp: 118, dbp: 72, spo2: 98, health: 100 };
  let skill = { recognition: 0, prioritization: 0, safety: 0 };

  const $ = id => document.getElementById(id);
  const game = () => $('game') && !$('game').classList.contains('hidden');

  function addUI() {
    if (!$('game') || $('eduHud')) return;
    const head = document.querySelector('.casehead');
    if (!head) return;

    const hud = document.createElement('div');
    hud.id = 'eduHud';
    hud.className = 'eduHud';
    hud.innerHTML = '<div>⏱️ <b id="eduTimer">35</b>s</div><div>🎯 <b id="eduAccuracy">0%</b></div><div>⚡ <b id="eduPace">Ready</b></div><div>❤️ <b id="eduHealth">100</b>%</div>';
    head.appendChild(hud);

    const monitor = document.createElement('div');
    monitor.id = 'liveVitals';
    monitor.className = 'liveVitals';
    monitor.innerHTML = '<span>❤️ HR <b id="liveHR">—</b></span><span>🩺 BP <b id="liveBP">—</b></span><span>🫁 SpO₂ <b id="liveSpO2">—</b></span>';
    const main = document.querySelector('#game .main');
    const visual = $('visual');
    if (main && visual) main.insertBefore(monitor, visual);
  }

  function caseType() {
    const t = `${$('caseTitle')?.textContent || ''} ${$('caseBrief')?.textContent || ''}`;
    if (/Ectopic|الحمل الهاجر/i.test(t)) return 'ectopic';
    if (/Preeclampsia|مقدمات|Eclampsia|الإرجاج/i.test(t)) return 'hypertension';
    if (/Haemorrhage|نزف|PPH/i.test(t)) return 'pph';
    if (/Normal Vaginal Birth|الولادة المهبلية الطبيعية/i.test(t)) return 'normal';
    if (/Shoulder Dystocia|عسر ولادة الكتف/i.test(t)) return 'shoulder';
    if (/Operating Room|Obstetric Surgical Emergency|غرفة العمليات|طوارئ جراحية/i.test(t)) return 'or';
    return 'other';
  }

  function baseline() {
    switch (caseType()) {
      case 'ectopic': return { hr: 128, sbp: 82, dbp: 50, spo2: 97, health: 100 };
      case 'hypertension': return { hr: 104, sbp: 170, dbp: 112, spo2: 98, health: 100 };
      case 'pph': return { hr: 122, sbp: 88, dbp: 54, spo2: 95, health: 100 };
      case 'shoulder': return { hr: 96, sbp: 120, dbp: 76, spo2: 98, health: 100 };
      case 'or': return { hr: 126, sbp: 88, dbp: 54, spo2: 94, health: 100 };
      default: return { hr: 92, sbp: 118, dbp: 72, spo2: 98, health: 100 };
    }
  }

  function renderVitals() {
    if (!$('liveHR')) return;
    $('liveHR').textContent = Math.round(patientState.hr);
    $('liveBP').textContent = `${Math.round(patientState.sbp)}/${Math.round(patientState.dbp)}`;
    $('liveSpO2').textContent = `${Math.round(patientState.spo2)}%`;
    if ($('eduHealth')) $('eduHealth').textContent = Math.max(0, Math.min(100, Math.round(patientState.health)));
  }

  function resetPatient() {
    patientState = baseline();
    renderVitals();
  }

  function effectFor(choice, isCorrect) {
    const c = (choice || '').toLowerCase();
    const type = caseType();
    let e = isCorrect
      ? { health: 3, hr: -2, sbp: 2, dbp: 1, spo2: 0.2 }
      : { health: -7, hr: 5, sbp: -4, dbp: -3, spo2: -0.6 };

    if (type === 'ectopic') {
      if (/abc|haemodynamic|استقرار|إنعاش|resuscitation|iv|blood|crossmatch|operative|جراح|theatre|فريق|team/.test(c)) e = { health: 7, hr: -6, sbp: 6, dbp: 4, spo2: 0.4 };
      if (/methotrexate|ميثوتركسات|wait|انتظار|serial|outpatient|home|منزل|discharge/.test(c)) e = { health: -14, hr: 10, sbp: -9, dbp: -6, spo2: -1 };
    } else if (type === 'hypertension') {
      if (/magnesium|مغنيسيوم|seizure|اختلاج/.test(c)) e = { health: 7, hr: -2, sbp: -4, dbp: -3, spo2: 0.2 };
      if (/urgent|delivery|ولادة|senior|anaesthetic|critical|severe|تصعيد|labetalol|nifedipine|hydralazine/.test(c)) e = { health: 5, hr: -3, sbp: -5, dbp: -4, spo2: 0.2 };
      if (/wait|discharge|routine|home|انتظار|منزل/.test(c)) e = { health: -12, hr: 8, sbp: 8, dbp: 6, spo2: -0.8 };
    } else if (type === 'pph') {
      if (/call|help|team|uter|massage|oxytocin|uterotonic|iv|blood|resusc|نزف|إنعاش|فريق|tranexamic|txa/.test(c)) e = { health: 8, hr: -7, sbp: 7, dbp: 5, spo2: 0.5 };
      if (/wait|observe|discharge|home|انتظار|خروج/.test(c)) e = { health: -15, hr: 12, sbp: -10, dbp: -7, spo2: -1.2 };
    } else if (type === 'normal') {
      if (/support|monitor|skin-to-skin|مراقبة|دعم|جلد|reassess|تقييم/.test(c)) e = { health: 4, hr: -2, sbp: 1, dbp: 1, spo2: 0.2 };
      if (/caesarean|fundal pressure|force|سحب|قيصرية|ضغط قاع/.test(c)) e = { health: -8, hr: 5, sbp: -3, dbp: -2, spo2: -0.3 };
    } else if (type === 'shoulder') {
      if (/mcc?robert|suprapubic|فوق العانة|help|call|مساعدة|فريق/.test(c)) e = { health: 7, hr: -2, sbp: 1, dbp: 1, spo2: 0.2 };
      if (/fundal|شد|traction|pull|ضغط قاع/.test(c)) e = { health: -12, hr: 6, sbp: -4, dbp: -2, spo2: -0.5 };
    } else if (type === 'or') {
      if (/resusc|haemorrhage|blood|anaesth|team|surgeon|operate|surgery|إنعاش|دم|فريق|جراح|نزف/.test(c)) e = { health: 7, hr: -6, sbp: 6, dbp: 4, spo2: 0.5 };
      if (/wait|ward|closure|routine|انتظار|جناح|خياطة/.test(c)) e = { health: -14, hr: 10, sbp: -10, dbp: -7, spo2: -1.2 };
    }
    return e;
  }

  function classifySkill(choice, isCorrect, elapsed) {
    const c = (choice || '').toLowerCase();
    const recognition = /(abc|stabil|unstable|instability|deterior|red flag|تدهور|غير مستقر|استقرار|نزف|bleed|seizure|اختلاج|shoulder|كتف)/.test(c);
    const priority = /(first|urgent|immediate|call|help|resusc|iv|blood|team|operative|theatre|magnesium|labetalol|nifedipine|hydralazine|uterotonic|oxytocin|txa|mcc?robert|suprapubic|أول|فورًا|عاجل|فريق|إنعاش|جراح|مغنيسيوم)/.test(c);
    const unsafe = /(wait|delay|discharge|home|routine|fundal|traction|pull|methotrexate|انتظار|خروج|منزل)/.test(c);
    if (isCorrect && recognition) skill.recognition += 1;
    if (isCorrect && priority) skill.prioritization += 1;
    if (isCorrect && !unsafe) skill.safety += 1;
    if (isCorrect && elapsed <= 10) fastCorrect += 1;
  }

  function applyEffect(choice, isCorrect) {
    const e = effectFor(choice, isCorrect);
    patientState.health = Math.max(0, Math.min(100, patientState.health + e.health));
    patientState.hr = Math.max(45, Math.min(180, patientState.hr + e.hr));
    patientState.sbp = Math.max(55, Math.min(210, patientState.sbp + e.sbp));
    patientState.dbp = Math.max(30, Math.min(140, patientState.dbp + e.dbp));
    patientState.spo2 = Math.max(85, Math.min(100, patientState.spo2 + e.spo2));
    renderVitals();
  }

  function tick() {
    clearInterval(timer);
    seconds = 35;
    start = Date.now();
    const t = $('eduTimer');
    if (!t) return;
    t.parentElement.classList.remove('danger');
    t.textContent = seconds;
    if ($('eduPace')) $('eduPace').textContent = 'Ready';
    timer = setInterval(() => {
      if (!game()) { clearInterval(timer); return; }
      seconds--;
      t.textContent = Math.max(0, seconds);
      if (seconds <= 10 && seconds > 0) t.parentElement.classList.add('danger');
      if (seconds <= 0) {
        clearInterval(timer);
        t.parentElement.classList.add('danger');
        if ($('eduPace')) $('eduPace').textContent = 'TIME';
      }
    }, 1000);
  }

  function stepKey() {
    return `${$('caseTag')?.textContent || ''}|${$('progress')?.textContent || ''}|${$('caseBrief')?.textContent || ''}|${($('choices')?.textContent || '').slice(0, 180)}`;
  }

  function caseKey() {
    return `${$('caseTitle')?.textContent || ''}|${$('patientName')?.textContent || ''}`;
  }

  function bindChoiceButtons() {
    const choices = $('choices');
    if (!choices) return;
    choices.querySelectorAll('button.choice').forEach(btn => {
      if (btn.dataset.eduBound) return;
      btn.dataset.eduBound = '1';
      btn.addEventListener('click', () => {
        const isCorrect = btn.classList.contains('correct');
        const elapsed = Math.max(0, Math.round((Date.now() - start) / 1000));
        decisions++;
        if (isCorrect) correct++;
        classifySkill(btn.textContent, isCorrect, elapsed);
        applyEffect(btn.textContent, isCorrect);
        if ($('eduAccuracy')) $('eduAccuracy').textContent = Math.round(correct / decisions * 100) + '%';
        if ($('eduPace')) $('eduPace').textContent = elapsed <= 10 ? 'FAST' : elapsed <= 20 ? 'GOOD' : 'SLOW';
      });
    });
  }

  function observe() {
    const choices = $('choices');
    if (!choices) return;
    bindChoiceButtons();
    if (choices.dataset.eduObserved) return;
    choices.dataset.eduObserved = '1';
    new MutationObserver(bindChoiceButtons).observe(choices, { childList: true, subtree: true });
  }

  function enrichEnd() {
    const end = $('end');
    if (!end || end.dataset.eduEnhanced) return;
    end.dataset.eduEnhanced = '1';
    const box = document.createElement('div');
    box.className = 'debriefBox';
    box.innerHTML = '<h3>🧠 Clinical Performance Report</h3><p>Your choices changed the simulated patient state. Reassess after every intervention and escalate early when deterioration continues.</p><div class="debriefGrid"><div><span>Decision accuracy</span><b id="finalAccuracy">0%</b></div><div><span>Recognition</span><b id="finalRecognition">0%</b></div><div><span>Prioritization</span><b id="finalPriority">0%</b></div><div><span>Safety</span><b id="finalSafety">0%</b></div><div><span>Speed</span><b id="finalSpeed">0%</b></div><div><span>Overall</span><b id="finalOverall">0%</b></div></div><p class="pearl"><b>💡 Clinical Pearl:</b> Judge response by the patient’s trajectory, reassess continuously, and follow your local emergency protocol for definitive management.</p>';
    const ref = $('clinicalRefs');
    if (ref) end.insertBefore(box, ref); else end.insertBefore(box, end.firstChild);
  }

  function report() {
    const accuracy = decisions ? Math.round(correct / decisions * 100) : 0;
    const recognition = decisions ? Math.min(100, Math.round(skill.recognition / decisions * 100)) : 0;
    const priority = decisions ? Math.min(100, Math.round(skill.prioritization / decisions * 100)) : 0;
    const safety = decisions ? Math.min(100, Math.round(skill.safety / decisions * 100)) : 0;
    const speed = decisions ? Math.round(fastCorrect / decisions * 100) : 0;
    const overall = Math.round((accuracy + recognition + priority + safety + speed) / 5);
    if ($('finalAccuracy')) $('finalAccuracy').textContent = accuracy + '%';
    if ($('finalRecognition')) $('finalRecognition').textContent = recognition + '%';
    if ($('finalPriority')) $('finalPriority').textContent = priority + '%';
    if ($('finalSafety')) $('finalSafety').textContent = safety + '%';
    if ($('finalSpeed')) $('finalSpeed').textContent = speed + '%';
    if ($('finalOverall')) $('finalOverall').textContent = overall + '%';
  }

  function loop() {
    addUI();
    observe();
    enrichEnd();

    if (game()) {
      const ck = caseKey();
      const sk = stepKey();
      if (ck && ck !== currentCaseKey) {
        currentCaseKey = ck;
        lastStepKey = '';
        decisions = 0;
        correct = 0;
        fastCorrect = 0;
        skill = { recognition: 0, prioritization: 0, safety: 0 };
        if ($('eduAccuracy')) $('eduAccuracy').textContent = '0%';
        resetPatient();
      }
      if (sk && sk !== lastStepKey) {
        lastStepKey = sk;
        tick();
      }
    } else {
      clearInterval(timer);
      lastStepKey = '';
      currentCaseKey = '';
    }

    report();
    requestAnimationFrame(loop);
  }

  loop();
})();