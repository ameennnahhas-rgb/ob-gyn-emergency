/* OB/GYN Emergency Simulator layer
   Educational simulation only. Clinical decisions are simplified for learning.
*/
(function(){
  'use strict';
  let audioCtx=null, master=null, musicTimer=null, musicOn=false;
  let timer=null, seconds=45, teamOpen=false;
  const $=id=>document.getElementById(id);

  function playTone(freq,duration=0.22,delay=0){
    if(!audioCtx||!master) return;
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type='sine'; o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001,audioCtx.currentTime+delay);
    g.gain.exponentialRampToValueAtTime(0.035,audioCtx.currentTime+delay+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+delay+duration);
    o.connect(g).connect(master); o.start(audioCtx.currentTime+delay); o.stop(audioCtx.currentTime+delay+duration+0.03);
  }
  function startMusic(){
    try{
      if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==='suspended') audioCtx.resume();
      if(!master){master=audioCtx.createGain(); master.gain.value=0.16; master.connect(audioCtx.destination);}
      if(musicOn) return;
      musicOn=true;
      const melody=[261.63,329.63,392,329.63,293.66,349.23,440,349.23]; let i=0;
      const beat=()=>{ if(!musicOn) return; playTone(melody[i%melody.length],0.38); i++; musicTimer=setTimeout(beat,520); };
      beat();
      const b=$('musicBtn'); if(b) b.textContent=(window.gameLang==='ar'?'🔊 الموسيقى':'🔊 Music');
    }catch(e){ console.warn('Audio unavailable',e); }
  }
  function stopMusic(){ musicOn=false; clearTimeout(musicTimer); musicTimer=null; const b=$('musicBtn'); if(b) b.textContent=(window.gameLang==='ar'?'🔇 الموسيقى':'🔇 Music'); }
  function toggleMusic(){ if(musicOn) stopMusic(); else startMusic(); }

  function injectSimulatorUI(){
    const game=$('game'); if(!game||$('simTools')) return;
    const main=game.querySelector('.main');
    const box=document.createElement('div'); box.id='simTools'; box.className='simTools';
    box.innerHTML='<div class="simTop"><div><b id="simLabel">⏱️ Decision time</b><strong id="simTimer">45s</strong></div><div><b id="teamLabel">👥 Team</b><button class="teamBtn" data-team="senior">🩺 Senior OB</button><button class="teamBtn" data-team="anaesthesia">💉 Anaesthesia</button><button class="teamBtn" data-team="neonatal">👶 Neonatal</button><button class="teamBtn" data-team="blood">🩸 Blood bank</button></div></div><div id="teamMsg" class="teamMsg hidden"></div>';
    const choices=$('choices'); main.insertBefore(box,choices);
    box.querySelectorAll('.teamBtn').forEach(btn=>btn.addEventListener('click',()=>{
      teamOpen=true; const key=btn.dataset.team;
      const ar=window.gameLang==='ar';
      const names=ar?{senior:'تم استدعاء طبيب نسائية وتوليد أقدم.',anaesthesia:'تم استدعاء فريق التخدير.',neonatal:'تم استدعاء فريق حديثي الولادة.',blood:'تم إبلاغ بنك الدم/تفعيل الاستجابة للنزف.'}:{senior:'Senior OB/GYN has been called.',anaesthesia:'Anaesthesia team has been called.',neonatal:'Neonatal team has been called.',blood:'Blood bank / hemorrhage response has been activated.'};
      const m=$('teamMsg'); m.textContent=names[key]; m.classList.remove('hidden');
      playTone(523.25,0.12); playTone(659.25,0.12,0.14);
    }));
  }
  function updateTimer(){
    const t=$('simTimer'); if(!t) return; t.textContent=seconds+'s'; t.classList.toggle('urgent',seconds<=10);
  }
  function startTimer(){
    clearInterval(timer); seconds=45; updateTimer();
    timer=setInterval(()=>{seconds--; updateTimer(); if(seconds<=0){clearInterval(timer); timeOut();}},1000);
  }
  function timeOut(){
    const ar=window.gameLang==='ar';
    const fb=$('feedback'); if(fb){fb.className='feedback bad'; fb.textContent=ar?'⏱️ انتهى الوقت. في الطوارئ يجب إعادة التقييم والتصعيد بسرعة.':'⏱️ Time expired. In an emergency, reassess and escalate promptly.'; fb.classList.remove('hidden');}
    reduceHealth(15); playTone(130,0.25); setTimeout(()=>playTone(110,0.25),180);
  }
  function reduceHealth(amount){
    const h=$('health'); const bar=$('healthBar'); if(!h) return; const n=Math.max(0,Number(h.textContent||100)-amount); h.textContent=n; if(bar) bar.style.width=n+'%';
    const stability=$('stability'); if(stability){const ar=window.gameLang==='ar'; stability.textContent=n>=75?(ar?'مستقرة نسبيًا':'Watch'):n>=45?(ar?'تحتاج تصعيدًا':'Needs escalation'):(ar?'غير مستقرة':'Unstable');}
  }
  function observeChoices(){
    const choices=$('choices'); if(!choices||choices.dataset.simBound) return false; choices.dataset.simBound='1';
    choices.addEventListener('click',e=>{
      const btn=e.target.closest('.choice'); if(!btn) return;
      clearInterval(timer);
      // The base game marks correct/wrong. A wrong decision causes clinical deterioration.
      setTimeout(()=>{
        if(btn.classList.contains('wrong')){ reduceHealth(12); playTone(180,0.25); }
        else { playTone(660,0.1); }
      },40);
    });
    return true;
  }
  function watchGame(){
    injectSimulatorUI(); observeChoices();
    const game=$('game');
    if(game&&!game.dataset.simObserver){
      game.dataset.simObserver='1';
      const obs=new MutationObserver(()=>{injectSimulatorUI();observeChoices(); const c=$('choices'); if(c&&!c.classList.contains('hidden')) startTimer();});
      obs.observe(game,{subtree:true,childList:true});
    }
  }
  function style(){
    if(document.getElementById('simStyles')) return;
    const s=document.createElement('style'); s.id='simStyles'; s.textContent=`
      .simTools{margin:0 0 14px;padding:12px;border:1px solid #55d6ff22;background:#081a2b;border-radius:16px}
      .simTop{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.simTop>div:last-child{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
      #simTimer{margin-left:8px;color:#55d6ff;font-size:22px}.urgent{color:#ff5d73!important;animation:blink .7s infinite}@keyframes blink{50%{opacity:.45}}
      .teamBtn{border:1px solid #294560;background:#0d2236;color:#dff5ff;border-radius:10px;padding:7px 9px;cursor:pointer;font-size:11px}.teamBtn:hover{border-color:#55d6ff}.teamMsg{margin-top:9px;padding:9px;border-radius:10px;background:#42e6a410;color:#baffdf;border:1px solid #42e6a433;font-size:12px}.hidden{display:none!important}
    `; document.head.appendChild(s);
  }
  function init(){
    style();
    const b=$('musicBtn'); if(b){b.addEventListener('click',toggleMusic);}
    const start=$('startBtn'); if(start) start.addEventListener('click',()=>setTimeout(watchGame,80));
    const levels=$('levelGrid'); if(levels) levels.addEventListener('click',()=>setTimeout(watchGame,100));
    const next=$('nextBtn'); if(next) next.addEventListener('click',()=>setTimeout(watchGame,80));
    window.addEventListener('beforeunload',()=>{stopMusic();clearInterval(timer);});
    setInterval(watchGame,700);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
