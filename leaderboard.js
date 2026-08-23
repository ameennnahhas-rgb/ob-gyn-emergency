(() => {
  const KEY = 'obgynLeaderboard';
  const $ = id => document.getElementById(id);
  const getBoard = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  };
  const saveBoard = board => localStorage.setItem(KEY, JSON.stringify(board.slice(0,10)));
  const labels = () => location && document.documentElement.lang === 'ar'
    ? {title:'🏆 أعلى النتائج',save:'حفظ النتيجة',placeholder:'اكتب اسمك',saved:'تم حفظ نتيجتك في قائمة المتصدرين',privacy:'يتم حفظ النتيجة محليًا على هذا الجهاز.'}
    : {title:'🏆 High Scores',save:'SAVE SCORE',placeholder:'Enter your name',saved:'Your score has been added to the leaderboard',privacy:'Your score is saved locally on this device.'};

  function render() {
    const box = $('leaderboard');
    if (!box) return;
    const l = labels();
    const board = getBoard();
    box.innerHTML = `<div class="leaderboardTitle">${l.title}</div>` +
      (board.length ? board.map((x,i)=>`<div class="leaderRow ${i<3?'top':''}"><span class="leaderRank">${i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)}</span><span class="leaderName">${escapeHtml(x.name)}</span><span class="leaderScore">${x.score}</span></div>`).join('') : `<div class="disclaimer">${document.documentElement.lang==='ar'?'لا توجد نتائج بعد — كن أول متصدر!':'No scores yet — be the first to lead!'}</div>`);
  }
  function escapeHtml(s) { return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function syncLabels() {
    const l=labels();
    if ($('nameLabel')) $('nameLabel').textContent=document.documentElement.lang==='ar'?'اسمك':'Your name';
    if ($('playerName')) $('playerName').placeholder=l.placeholder;
    if ($('saveScoreBtn')) $('saveScoreBtn').textContent=l.save;
    if ($('privacyNote')) $('privacyNote').textContent=l.privacy;
  }
  function saveScore() {
    const input=$('playerName');
    const name=(input?.value||'').trim().slice(0,30);
    if (!name) { input?.focus(); return; }
    const score=Number($('finalScore')?.textContent||0);
    const board=getBoard();
    board.push({name,score,date:Date.now()});
    board.sort((a,b)=>b.score-a.score || a.date-b.date);
    saveBoard(board);
    if(input) input.value='';
    render();
    const btn=$('saveScoreBtn'); if(btn){const old=btn.textContent;btn.textContent=labels().saved;setTimeout(()=>btn.textContent=labels().save,1800);}
  }
  function init(){
    const btn=$('saveScoreBtn'); if(btn) btn.addEventListener('click',saveScore);
    $('playerName')?.addEventListener('keydown',e=>{if(e.key==='Enter')saveScore();});
    render(); syncLabels();
    const originalLang=$('langBtn');
    originalLang?.addEventListener('click',()=>setTimeout(()=>{syncLabels();render();},0));
    const originalFinishObserver=new MutationObserver(()=>{if(!$('end')?.classList.contains('hidden')){render();syncLabels();}});
    if($('end')) originalFinishObserver.observe($('end'),{attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();