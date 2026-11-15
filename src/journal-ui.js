const journalCards=[...document.querySelectorAll('.journal-card[data-topic]')];
if(journalCards.length){
 const filters=[...document.querySelectorAll('[data-filter]')];
 const search=document.querySelector('[data-journal-search]');
 const empty=document.querySelector('.journal-no-results');
 let active='all';
 const run=()=>{
  const term=(search?.value||'').trim().toLocaleLowerCase();let visible=0;
  for(const card of journalCards){
   const matchesTopic=active==='all'||card.dataset.topic===active;
   const matchesTerm=!term||(card.dataset.search||'').includes(term);
   card.hidden=!(matchesTopic&&matchesTerm);if(!card.hidden)visible++;
  }
  if(empty)empty.hidden=visible!==0;
 };
 filters.forEach(button=>button.addEventListener('click',()=>{
  active=button.dataset.filter;
  filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  run();
 }));
 search?.addEventListener('input',run);
}
