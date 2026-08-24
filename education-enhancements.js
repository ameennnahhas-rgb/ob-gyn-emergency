(() => {
  'use strict';
  let timer=null, seconds=35, decisions=0, correct=0, start=0, lastStepKey='', currentCaseKey='';
  let patientState={hr:0,sbp:0,dbp:0,spo2:0,health:100};
  const $=id=>document.getElementById(id);
  const game=()=> $('game') && !$('game').classList.contains('hidden');

  function addUI(){
    if(!$('game')||$('eduHud'))return;
    const head=document.querySelector('.casehead'); if(!head)return;
    const hud=document.createElement('div'); hud.id='eduHud'; hud.className='eduHud';
    hud.innerHTML='<div>⏱️ <b id="eduTimer">35</b>s</div><div>🎯 <b id="eduAccuracy">0%</b></div><div>⚡ <b id="eduPace">Ready</b></div><div>❤️ <b id="eduHealth">100</b>%</div>';
    head.appendChild(hud);
    const monitor=document.createElement('div'); monitor.id='liveVitals'; monitor.className='liveVitals';
    monitor.innerHTML='<span>❤️ HR <b id="liveHR">—</b></span><span>🩺 BP <b id="liveBP">—</b></span><span>🫁 SpO₂ <b id="liveSpO2">—</b></span>';
    const main=document.querySelector('#game .main'), visual=$('visual'); if(main&&visual)main.insertBefore(monitor,visual);
  }

  function caseType(){
    const t=`${$('caseTitle')?.textContent||''} ${$('caseBrief')?.textContent||''}`;
    if(/Ectopic|الحمل الهاجر/i.test(t))return'ectopic';
    if(/Preeclampsia|مقدمات|Eclampsia|الإرجاج/i.test(t))return'hypertension';
    if(/Haemorrhage|نزف|PPH/i.test(t))return'pph';
    if(/Normal Vaginal Birth|الولادة المهبلية الطبيعية/i.test(t))return'normal';
    return'other';
  }

  function baseline(){
    const type=caseType();
    return type==='ectopic'?{hr:128,sbp:82,dbp:50,spo2:97,health:72}:
      type==='hypertension'?{hr:104,sbp:170,dbp:112,spo2:98,health:78}:
      type==='pph'?{hr:122,sbp:88,dbp:54,spo2:95,health:70}:
      {hr:92,sbp:118,dbp:72,spo2:98,health:100};
  }

  function renderVitals(){
    const h=$('liveHR'),b=$('liveBP'),s=$('liveSpO2'); if(!h)return;
    h.textContent=Math.round(patientState.hr);
    b.textContent=`${Math.round(patientState.sbp)}/${Math.round(patientState.dbp)}`;
    s.textContent=`${Math.round(patientState.spo2)}%`;
    if($('eduHealth'))$('eduHealth').textContent=Math.max(0,Math.min(100,Math.round(patientState.health)));
  }

  function resetPatient(){patientState=baseline();renderVitals();}

  // Clinical response model: effects depend on the emergency and the selected intervention,
  // not simply on whether the answer was marked correct.
  function effectFor(choice,isCorrect){
    const c=(choice||'').toLowerCase();
    const type=caseType();
    let e={health:isCorrect?3:-7,hr:isCorrect?-2:5,sbp:isCorrect?2:-4,dbp:isCorrect?1:-3,spo2:isCorrect?.2:-.6};

    if(type==='ectopic'){
      if(/abc|haemodynamic|استقرار|إنعاش|resuscitation|iv|blood|crossmatch|operative|جراح|theatre|فريق|team/.test(c)) e={health:7,hr:-6,sbp:6,dbp:4,spo2:.4};
      if(/methotrexate|ميثوتركسات|wait|انتظار|serial|outpatient|home|منزل|discharge/.test(c)) e={health:-14,hr:10,sbp:-9,dbp:-6,spo2:-1};
    } else if(type==='hypertension'){
      if(/magnesium|مغنيسيوم|seizure|اختلاج|seizure prophylaxis/.test(c)) e={health:7,hr:-2,sbp:-4,dbp:-3,spo2:.2};
      if(/urgent|delivery|ولادة|senior|anaesthetic|anaesthet|critical|severe|تصعيد/.test(c)) e={health:5,hr:-3,sbp:-5,dbp:-4,spo2:.2};
      if(/wait|discharge|routine|home|انتظار|منزل/.test(c)) e={health:-12,hr:8,sbp:8,dbp:6,spo2:-.8};
    } else if(type==='pph'){
      if(/call|help|team|uter|massage|massage|oxytocin|uterotonic|iv|blood|resusc|نزف|إنعاش|فريق/.test(c)) e={health:8,hr:-7,sbp:7,dbp:5,spo2:.5};
      if(/wait|observe|discharge|home|انتظار|خروج/.test(c)) e={health:-15,hr:12,sbp:-10,dbp:-7,spo2:-1.2};
    } else if(type==='normal'){
      if(/support|monitor|skin-to-skin|مراقبة|دعم|جلد|reassess|تقييم/.test(c)) e={health:4,hr:-2,sbp:1,dbp:1,spo2:.2};
      if(/caesarean|fundal pressure|force|سحب|قيصرية|ضغط قاع/.test(c)) e={health:-8,hr:5,sbp:-3,dbp:-2,spo2:-.3};
    }
    if(!isCorrect && type==='other') e={health:-8,hr:6,sbp:-5,dbp:-3,spo2:-.8};
    return e;
  }

  function applyEffect(choice,isCorrect){
    const e=effectFor(choice,isCorrect);
    patientState.health=Math.max(0,Math.min(100,patientState.health+e.health));
    patientState.hr=Math.max(45,Math.min(180,patientState.hr+e.hr));
    patientState.sbp=Math.max(55,Math.min(210,patientState.sbp+e.sbp));
    patientState.dbp=Math.max(30,Math.min(140,patientState.dbp+e.dbp));
    patientState.spo2=Math.max(85,Math.min(100,patientState.spo2+e.spo2));
    renderVitals();
  }

  function tick(){
    clearInterval(timer); seconds=35; start=Date.now();
    const t=$('eduTimer'); if(!t)return;
    t.parentElement.classList.remove('danger'); t.textContent=seconds;
    if($('eduPace'))$('eduPace').textContent='Ready';
    timer=setInterval(()=>{
      if(!game()){clearInterval(timer);return;}
      seconds--;t.textContent=Math.max(0,seconds);
      if(seconds<=10&&seconds>0)t.parentElement.classList.add('danger');
      if(seconds<=0){clearInterval(timer);t.parentElement.classList.add('danger');if($('eduPace'))$('eduPace').textContent='TIME';}
    },1000);
  }

  function stepKey(){return `${$('caseTag')?.textContent||''}|${$('progress')?.textContent||''}|${$('caseBrief')?.textContent||''}|${($('choices')?.textContent||'').slice(0,180)}`;}
  function caseKey(){return `${$('caseTitle')?.textContent||''}|${$('patientName')?.textContent||''}`;}

  function observe(){
    const choices=$('choices'); if(!choices||choices.dataset.eduObserved)return;
    choices.dataset.eduObserved='1';
    new MutationObserver(()=>[...choices.querySelectorAll('button')].forEach(btn=>{
      if(btn.dataset.eduBound)return; btn.dataset.eduBound='1';
      btn.addEventListener('click',()=>{
        decisions++; const isCorrect=btn.classList.contains('correct'); if(isCorrect)correct++;
        applyEffect(btn.textContent,isCorrect);
        if($('eduAccuracy'))$('eduAccuracy').textContent=Math.round(correct/decisions*100)+'%';
        const pace=Math.round((Date.now()-start)/1000); if($('eduPace'))$('eduPace').textContent=pace<=10?'FAST':pace<=20?'GOOD':'SLOW';
      });
    })).observe(choices,{childList:true,subtree:true});
  }

  function enrichEnd(){
    const end=$('end'); if(!end||end.dataset.eduEnhanced)return; end.dataset.eduEnhanced='1';
    const box=document.createElement('div'); box.className='debriefBox';
    box.innerHTML='<h3>🧠 Clinical Debrief</h3><p>Your decisions changed the simulated patient state. Reassess the patient after every intervention and escalate early when deterioration continues.</p><div class="debriefGrid"><div><span>Decision accuracy</span><b id="finalAccuracy">0%</b></div><div><span>Patient status</span><b id="finalHealth">100%</b></div><div><span>Clinical focus</span><b>Recognition + response</b></div></div><p class="pearl"><b>💡 Clinical Pearl:</b> Use the patient’s trajectory—not a single number—to judge response, and follow your local emergency protocol for definitive management.</p>';
    const ref=$('clinicalRefs'); if(ref)end.insertBefore(box,ref);else end.insertBefore(box,end.firstChild);
  }

  function loop(){
    addUI(); observe(); enrichEnd();
    if(game()){
      const ck=caseKey(),sk=stepKey();
      if(ck&&ck!==currentCaseKey){currentCaseKey=ck;lastStepKey='';decisions=0;correct=0;if($('eduAccuracy'))$('eduAccuracy').textContent='0%';resetPatient();}
      if(sk&&sk!==lastStepKey){lastStepKey=sk;tick();}
    }else{clearInterval(timer);lastStepKey='';currentCaseKey='';}
    if($('finalAccuracy'))$('finalAccuracy').textContent=(decisions?Math.round(correct/decisions*100):0)+'%';
    if($('finalHealth'))$('finalHealth').textContent=Math.round(patientState.health)+'%';
    requestAnimationFrame(loop);
  }
  loop();
})();
