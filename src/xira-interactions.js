// Enhance the research pages while leaving their complete content in the HTML.
(() => {
 const root=document.querySelector('.xira-page');
 if(!root)return;
 const flow=root.querySelector('.xira-flow');
 if(flow){
  const articles=[...flow.querySelectorAll('article')];
  const controls=document.createElement('div');
  controls.className='arc-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Research arc stages');
  const panel=document.createElement('div');panel.className='arc-panel';panel.setAttribute('aria-live','polite');
  const select=index=>{
   controls.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
   panel.replaceChildren();
   const number=document.createElement('span');number.className='arc-number';number.textContent='0'+(index+1);
   const copy=document.createElement('div');copy.append(...[...articles[index].children].map(el=>el.cloneNode(true)));
   const next=document.createElement('button');next.type='button';next.className='arc-next';next.textContent=index===articles.length-1?'Back to observation ↗':'Next stage →';next.addEventListener('click',()=>select((index+1)%articles.length));
   panel.append(number,copy,next);
  };
  articles.forEach((article,i)=>{const button=document.createElement('button');button.type='button';button.textContent='0'+(i+1)+' / '+article.querySelector('h3').textContent;button.addEventListener('click',()=>select(i));controls.append(button);});
  flow.before(controls,panel);select(0);flow.hidden=true;
 }
 const search=root.querySelector('#study-search'),studies=[...root.querySelectorAll('.xira-study')];
 if(search){
  let category='all';
  const update=()=>{
   const query=search.value.toLowerCase().trim();let visible=0;
   studies.forEach(study=>{study.hidden=!((category==='all'||study.dataset.category===category)&&study.textContent.toLowerCase().includes(query));if(!study.hidden)visible++;});
   root.querySelector('#xira-count').textContent='Showing '+visible+' of '+studies.length+' planned studies';
   root.querySelector('.search-empty').hidden=visible!==0;
   root.querySelectorAll('.xira-filter').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===category)));
  };
  root.querySelectorAll('.xira-filter').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;update();}));
  search.addEventListener('input',update);
  root.querySelector('.clear-search').addEventListener('click',()=>{search.value='';category='all';update();search.focus();});
  update();
 }
 const chapters=[...root.querySelectorAll('.xira-chapters a')],sections=[...root.querySelectorAll('.xira-section[id]')];
 if(chapters.length&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){
    chapters.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    const progress=root.querySelector('.chapter-progress');
    progress.style.width=((sections.indexOf(entry.target)+1)/sections.length*100)+'%';
   }});
  },{rootMargin:'-12% 0px -55% 0px',threshold:0});
  sections.forEach(section=>observer.observe(section));
 }
})();
