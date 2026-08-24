(() => {
  'use strict';
  let timer = null, seconds = 35, decisions = 0, correct = 0, start = 0, lastStepKey = '', currentCaseKey = '';
  let patientState = { hr: 0, sbp: 0, dbp: 0, spo2: 0, health: 100 };
  const $ = id => document.getElementById(id);
  const game = () => $('game') && !$('game').classList.contains('hidden');

  function addUI(){
    if(!$('game') || $('eduHud')) return;
    const head = document.querySelector('.casehead');
    if(!head) return;
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
    if(main && visual) main.insertBefore(monitor, visual);
  }

  function baselineForCase(text){
    if(/Ectopic|الحمل الهاجر/i.test(text)) return {hr:128,sbp:82,dbp:50,spo2:97,health:72};
    if(/Preeclampsia|مقدمات|Eclampsia|الإرجاج/i.test(text)) return {hr:104,sbp:170,dbp:112,spo2:98,health:78};
    if(/Haemorrhage|نزف|PPH/i.test(text)) return {hr:122,sbp:88,dbp:54,spo2:95,health:70};
    return {hr:92,sbp:118,dbp:72,spo2:98,health:100};
  }

  function renderVitals(){
    const h=$('liveHR'),b=$('liveBP'),s=$('liveSpO2');
    if(!h) return;
    h.textContent=Math.round(patientState.hr);
    b.textContent=`${Math.round(patientState.sbp)}/${Math.round(patientState.dbp)}`;
    s.textContent=`${Math.round(patientState.spo2)}%`;
    if($('eduHealth')) $('eduHealth').textContent=Math.max(0,Math.min(100,Math.round(patientState.health)));
  }

  function resetPatientState(){
    const text=`${$('caseTitle')?.textContent||''} ${$('caseBrief')?.textContent||''}`;
    patientState=baselineForCase(text);
    renderVitals();
  }

  function applyDecisionEffect(isCorrect){
    if(isCorrect){
      patientState.health=Math.min(100,patientState.health+4);
      if(patientState.sbp<100) patientState.sbp+=3;
      if(patientState.dbp<65) patientState.dbp+=2;
      if(patientState.hr>100) patientState.hr-=3;
      if(patientState.spo2<98) patientState.spo2=Math.min(98,patientState.spo2+0.5);
    } else {
      patientState.health=Math.max(0,patientState.health-8);
      patientState.hr=Math.min(160,patientState.hr+7);
      patientState.sbp=Math.max(60,patientState.sbp-5);
      patientState.dbp=Math.max(35,patientState.dbp-3);
      patientState.spo2=Math.max(88,patientState.spo2-1);
    }
    renderVitals();
  }

  function tick(){
    clearInterval(timer);
    seconds=35;
    start=Date.now();
    const t=$('eduTimer');
    if(!t) return;
    t.parentElement.classList.remove('danger');
    t.textContent=seconds;
    if($('eduPace')) $('eduPace').textContent='Ready';
    timer=setInterval(()=>{
      if(!game()){clearInterval(timer);return;}
      seconds--;
      t.textContent=Math.max(0,seconds);
      if(seconds<=10&&seconds>0)t.parentElement.classList.add('danger');
      if(seconds<=0){
        clearInterval(timer);
        t.parentElement.classList.add('danger');
        if($('eduPace')) $('eduPace').textContent='TIME';
      }
    },1000);
  }

  function getStepKey(){
    const tag=$('caseTag')?.textContent||'';
    const progress=$('progress')?.textContent||'';
    const brief=$('caseBrief')?.textContent||'';
    const choices=$('choices')?.textContent||'';
    return `${tag}|${progress}|${brief}|${choices.slice(0,120)}`;
  }

  function getCaseKey(){
    return `${$('caseTitle')?.textContent||''}|${$('patientName')?.textContent||''}`;
  }

  function observe(){
    const choices=$('choices');
    if(!choices||choices.dataset.eduObserved)return;
    choices.dataset.eduObserved='1';
    new MutationObserver(()=>{
      [...choices.querySelectorAll('button')].forEach(btn=>{
        if(btn.dataset.eduBound)return;
        btn.dataset.eduBound='1';
        btn.addEventListener('click',()=>{
          decisions++;
          const wasCorrect=btn.classList.contains('correct');
          if(wasCorrect)correct++;
          applyDecisionEffect(wasCorrect);
          const acc=Math.round(correct/decisions*100);
          if($('eduAccuracy')) $('eduAccuracy').textContent=acc+'%';
          const pace=Math.round((Date.now()-start)/1000);
          if($('eduPace')) $('eduPace').textContent=pace<=10?'FAST':pace<=20?'GOOD':'SLOW';
        });
      });
    }).observe(choices,{childList:true,subtree:true});
  }

  function enrichEnd(){
    const end=$('end');
    if(!end||end.dataset.eduEnhanced)return;
    end.dataset.eduEnhanced='1';
    const box=document.createElement('div');
    box.className='debriefBox';
    box.innerHTML='<h3>🧠 Clinical Debrief</h3><p>Strong emergency decision-making means recognizing deterioration early, prioritizing ABCs, reassessing after every intervention, escalating to the right team and avoiding dangerous delay.</p><div class="debriefGrid"><div><span>Decision accuracy</span><b id="finalAccuracy">0%</b></div><div><span>Patient status</span><b id="finalHealth">100%</b></div><div><span>Clinical focus</span><b>Recognition + escalation</b></div></div><p class="pearl"><b>💡 Clinical Pearl:</b> Stabilize first when unstable, reassess continuously, and use local guidelines/protocols for definitive management.</p>';
    const ref=$('clinicalRefs');
    if(ref)end.insertBefore(box,ref);else end.insertBefore(box,end.firstChild);
  }

  function loop(){
    addUI();
    observe();
    enrichEnd();
    if(game()){
      const caseKey=getCaseKey();
      const stepKey=getStepKey();
      if(caseKey&&caseKey!==currentCaseKey){
        currentCaseKey=caseKey;
        lastStepKey='';
        decisions=0;
        correct=0;
        if($('eduAccuracy'))$('eduAccuracy').textContent='0%';
        resetPatientState();
      }
      if(stepKey&&stepKey!==lastStepKey){
        lastStepKey=stepKey;
        tick();
      }
    }else{
      clearInterval(timer);
      lastStepKey='';
      currentCaseKey='';
    }
    if($('finalAccuracy'))$('finalAccuracy').textContent=(decisions?Math.round(correct/decisions*100):0)+'%';
    if($('finalHealth'))$('finalHealth').textContent=Math.round(patientState.health)+'%';
    requestAnimationFrame(loop);
  }

  loop();
})();
