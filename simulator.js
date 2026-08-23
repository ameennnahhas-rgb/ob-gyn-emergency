/* OB/GYN Emergency Simulator — lightweight mode
   Audio intentionally disabled to keep the game fast and reliable. */
(function(){
'use strict';
let timer=null,seconds=45,timerStep='';
const $=id=>document.getElementById(id);
function injectUI(){
  const game=$('game'); if(!game||$('simTools')) return;
  const main=game.querySelector('.main'); if(!main) return;
  const box=document.createElement('div');
  box.id='simTools';
  box.className='simTools';
  box.innerHTML='<div class="simTop"><div><b id="simLabel">⏱️ Decision time</b> <strong id="simTimer">45s</strong></div><div class="teamWrap"><b id="teamLabel">👥 Team</b><button class="teamBtn" data-team="senior">🩺 Senior OB</button><button class="teamBtn" data-team="anaesthesia">💉 Anaesthesia</button><button class="teamBtn" data-team="neonatal">👶 Neonatal</button><button class="teamBtn" data-team="blood">🩸 Blood bank</button></div></div><div id="teamMsg" class="teamMsg hidden"></div>';
  main.insertBefore(box,$('choices'));
  box.querySelectorAll('.teamBtn').forEach(btn=>btn.addEventListener('click',function(){
    const ar=window.gameLang==='ar'||window.lang==='ar';
    const msg={senior:ar?'تم استدعاء طبيب نسائية وتوليد أقدم.':'Senior OB/GYN has been called.',anaesthesia:ar?'تم استدعاء فريق التخدير.':'Anaesthesia team has been called.',neonatal:ar?'تم استدعاء فريق حديثي الولادة.':'Neonatal team has been called.',blood:ar?'تم إبلاغ بنك الدم/تفعيل استجابة النزف.':'Blood bank / hemorrhage response has been activated.'}[this.dataset.team];
    const m=$('teamMsg'); if(m){m.textContent=msg;m.classList.remove('hidden');}
  }));
}
function updateTimer(){const t=$('simTimer');if(t){t.textContent=seconds+'s';t.classList.toggle('urgent',seconds<=10)}}
function startTimer(){
  const c=$('choices'); if(!c||c.classList.contains('hidden')) return;
  const marker=(window.levelId||'')+'-'+(window.step||'')+'-'+c.innerHTML.length;
  if(marker===timerStep) return;
  timerStep=marker; clearInterval(timer); seconds=45; updateTimer();
  timer=setInterval(()=>{
    if(!$('game')||$('game').classList.contains('hidden')){clearInterval(timer);return;}
    seconds--; updateTimer();
    if(seconds<=0){
      clearInterval(timer);
      const ar=window.gameLang==='ar'||window.lang==='ar',f=$('feedback');
      if(f){f.className='feedback bad';f.textContent=ar?'⏱️ انتهى الوقت. أعد تقييم المريضة وصعّد التدبير بسرعة.':'⏱️ Time expired. Reassess the patient and escalate promptly.';f.classList.remove('hidden');}
      const h=$('health'); if(h){const n=Math.max(0,Number(h.textContent||100)-15);h.textContent=n;const bar=$('healthBar');if(bar)bar.style.width=n+'%';}
    }
  },1000);
}
function refresh(){injectUI();startTimer();}
function init(){
  const s=$('startBtn');if(s)s.addEventListener('click',()=>setTimeout(refresh,250));
  const n=$('nextBtn');if(n)n.addEventListener('click',()=>setTimeout(refresh,250));
  const l=$('levelGrid');if(l)l.addEventListener('click',()=>setTimeout(refresh,300));
  const r=$('replayBtn');if(r)r.addEventListener('click',()=>setTimeout(refresh,300));
  const lb=$('levelsBtn');if(lb)lb.addEventListener('click',()=>setTimeout(refresh,300));
  const q=$('quitBtn');if(q)q.addEventListener('click',()=>clearInterval(timer));
  refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
