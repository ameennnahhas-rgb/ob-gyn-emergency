(()=>{
let seed=0, observer;
function shuffleVisible(){
 const box=document.getElementById('choices'); if(!box)return;
 const btns=[...box.querySelectorAll('.advChoice')]; if(btns.length!==4)return;
 const patterns=[[1,0,3,2],[2,3,0,1],[3,2,1,0],[1,3,0,2],[2,0,3,1],[3,1,2,0]];
 const by=[...btns],p=patterns[seed++%patterns.length];
 observer?.disconnect();
 p.forEach(oldIndex=>box.appendChild(by[oldIndex]));
 observer?.observe(box,{childList:true});
}
function observe(){
 const c=document.getElementById('choices');if(!c)return;
 observer=new MutationObserver(()=>{observer.disconnect();setTimeout(()=>{shuffleVisible();},0);});
 observer.observe(c,{childList:true});
 document.addEventListener('click',e=>{
   const b=e.target.closest('.advChoice');if(!b)return;
   setTimeout(()=>{
     const q=document.querySelectorAll('.advChoice');
     q.forEach(x=>x.classList.remove('correct','wrong'));
     if(b.classList.contains('wrong'))b.classList.add('wrong');
     q.forEach(x=>{if(x.dataset.i==='0')x.classList.add('correct');});
   },0);
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe);else observe();
})();