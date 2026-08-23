(()=>{
function ensureAdvanced(){
 const grid=document.getElementById('levelGrid');
 if(grid && !grid.querySelector('.advancedWrap')){grid.removeAttribute('data-advanced');window.dispatchEvent(new Event('advanced:refresh'));}
}
setInterval(ensureAdvanced,1200);
})();