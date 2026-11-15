
document.querySelectorAll('.model-card:not([data-model="xuzu"]) .model-reveal').forEach(button=>{
 const extra=button.nextElementSibling;
 button.addEventListener('click',()=>{
  const open=button.getAttribute('aria-expanded')!=='true';
  button.setAttribute('aria-expanded',String(open));
  extra.hidden=!open;
  const name=button.closest('.model-card').querySelector('h3').textContent;
  button.firstChild.textContent=open?'Close '+name:'Explore '+name;
  button.querySelector('span').textContent=open?'−':'＋';
 });
});
