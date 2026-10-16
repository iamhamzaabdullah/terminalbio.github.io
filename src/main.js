const detail = [
['Observe','Start with the evidence.','Integrate molecular assays, sequence, structure, and contextual data into a coherent biological starting state.'],
['Model','Connect state to response.','Learn relationships between biological state, mechanism, and outcome across available evidence.'],
['Simulate','Explore possible futures.','Compare plausible responses and expose uncertainty before committing experimental resources.'],
['Design','Give the hypothesis a form.','Generate interventions against explicit biological objectives and constraints.'],
['Experiment','Ask the most useful question.','Select measurements for information gain, then test the hypothesis in the laboratory.'],
['Learn','Let evidence change the model.','Return every readout and its context to the model, improving the next hypothesis and experiment.']
];
document.querySelectorAll('.loop-node').forEach(button => button.addEventListener('click', () => {
  const index=Number(button.dataset.detail)-1, [name,title,copy]=detail[index];
  document.querySelectorAll('.loop-node').forEach(node => {
    node.classList.toggle('selected',node===button);
    node.setAttribute('aria-pressed',String(node===button));
  });
  document.querySelector('.loop-stage').dataset.stage=String(index+1);
  document.querySelector('.loop-detail').innerHTML='<span>0'+(index+1)+' / '+name.toUpperCase()+'</span><h3>'+title+'</h3><p>'+copy+'</p>';
}));
const models={
bindfm:['BindFM','Molecular interaction intelligence.','BindFM represents proteins, nucleic acids, small molecules, and cofactors in one interaction-aware space—so teams can rank candidates and decide what to test next.','Binder discovery & interface design','Ranks candidates for validation'],
xuzu:['XUZU','Generative aptamer design.','XUZU generates focused sequence libraries under explicit target and diversity constraints, then learns directly from experimental readouts.','Aptamer discovery','Generates information-rich libraries'],
rnx:['RNJ / RNX','RNA structure intelligence.','RNJ / RNX connects RNA sequence and structural reasoning to context, function, and the measurements that resolve uncertainty.','RNA therapeutics','Links structure to experimental response'],
biocompute:['TB Biocompute','Composable biological infrastructure.','TB Biocompute makes models, data, evaluations, and experimental outputs interoperable and traceable across a research program.','Model operations & evaluation','Connects the complete learning loop']
};
const drawer=document.querySelector('.model-drawer');
if(drawer) drawer.id='home-model-details';
document.querySelectorAll('[data-model]').forEach(button=>{
  button.setAttribute('aria-controls','home-model-details');
  button.addEventListener('click',()=>{
    const open=button.getAttribute('aria-expanded')!=='true';
    document.querySelectorAll('[data-model]').forEach(b=>{
      const active=open && b===button;
      b.setAttribute('aria-expanded',String(active));
      b.setAttribute('aria-label',(active?'Hide ':'Show ')+models[b.dataset.model][0]+' details');
      b.textContent=active?'−':'+';
    });
    drawer.hidden=!open;
    if(!open)return;
    const [name,title,copy,use,role]=models[button.dataset.model];
    drawer.innerHTML='<div><span class="drawer-index">'+name+'</span><h3>'+title+'</h3><p>'+copy+'</p></div><div class="drawer-meta"><span>USE CASE</span><strong>'+use+'</strong><span>LOOP ROLE</span><strong>'+role+'</strong></div>';
    button.closest('article').after(drawer);
  });
});
const apps=[
['MOLECULAR INTERACTIONS','Find the right interaction.','Connect target interface features to candidate sequence diversity. Generate and rank binders, then validate their behavior experimentally.','Sequence context and structural compatibility shape what deserves a test.'],
['EVOLUTION & RESPONSE','Understand the escape routes.','Explore how biological systems adapt under selective pressure. Prioritize experiments that distinguish plausible resistance mechanisms.','Sequence variation, clonal context, and fitness trade-offs inform resistance hypotheses.'],
['RNA STRUCTURE & FUNCTION','Design with RNA context.','Connect RNA sequence, folding, stability, and function to the measurements that resolve therapeutic design questions.','Sequence motifs, splice context, and secondary structure can change how an RNA intervention behaves.'],
['PROGRAMMABLE BIOLOGY','Test a deliberate change.','Explore CRISPR edits, engineered proteins, and synthetic circuits as interventions within a larger biological system.','An edit or construct must be understood in its regulatory, pathway, and cellular context.']
];
const art=document.querySelector('.sequence-art');
function sequence(index){
 if(!art)return;
 art.replaceChildren();
 for(let i=0;i<30;i++){
  const bar=document.createElement('i');
  bar.style.height=(18+Math.abs(Math.sin(i*.37+index*.8))*68)+'px';
  bar.style.background=i%5===index?'#b53a26':'#ec977b';
  art.append(bar);
 }
}
sequence(0);
document.querySelectorAll('[data-application]').forEach(button=>button.addEventListener('click',()=>{
 const i=Number(button.dataset.application),a=apps[i];
 document.querySelectorAll('[data-application]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelector('#application-label').textContent='0'+(i+1)+' / '+a[0];
 document.querySelector('#application-title').textContent=a[1];
 document.querySelector('#application-copy').textContent=a[2];
 document.querySelector('#application-signal').textContent=a[3];
 sequence(i);
}));
document.querySelectorAll('.application-list article').forEach((article,i)=>{
 if(!apps[i])return;
 const button=document.createElement('button'),panel=document.createElement('p');
 button.className='insight-toggle';button.type='button';button.textContent='Explore genetic insight +';
 button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','insight-'+i);
 panel.id='insight-'+i;panel.className='inline-insight';panel.hidden=true;panel.textContent=apps[i][3];
 article.append(button,panel);
 button.addEventListener('click',()=>{
  panel.hidden=!panel.hidden;
  button.setAttribute('aria-expanded',String(!panel.hidden));
  button.textContent=panel.hidden?'Explore genetic insight +':'Close insight −';
 });
});
const header=document.querySelector('.site-header'),menu=header?.querySelector('.menu'),nav=header?.querySelector('nav');
if(menu&&nav){
 nav.id='site-navigation';menu.setAttribute('aria-controls',nav.id);menu.setAttribute('aria-expanded','false');
 const toggle=(open)=>{header.classList.toggle('nav-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');};
 menu.addEventListener('click',()=>toggle(!header.classList.contains('nav-open')));
 nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>toggle(false)));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){toggle(false);if(document.activeElement.closest('nav'))menu.focus();}});
}
// Preserve the XIRA portfolio and its existing category counts.
document.querySelectorAll('.xira-filter').forEach(button=>button.addEventListener('click',()=>{
 const category=button.dataset.filter;
 document.querySelectorAll('.xira-filter').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 let count=0;
 document.querySelectorAll('.xira-study').forEach(study=>{study.hidden=category!=='all'&&study.dataset.category!==category;if(!study.hidden)count++;});
 const output=document.querySelector('#xira-count');if(output)output.textContent='Showing '+count+' planned studies';
}));
// Original, lightweight point-cloud artwork. Illustrative only; no fabricated model metrics.
const canvas=document.querySelector('#biology-field');
if(canvas){
 const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),pause=document.querySelector('.motion-toggle');
 let width=0,height=0,angle=0,frame=0,paused=reduced.matches,visible=true;
 const points=[];
 for(let i=0;i<1100;i++){
  const y=1-2*(i+.5)/1100,r=Math.sqrt(1-y*y),theta=i*2.3999632297;
  points.push([Math.cos(theta)*r,y,Math.sin(theta)*r]);
 }
 function draw(){
  if(!ctx)return;
  ctx.clearRect(0,0,width,height);
  const size=Math.min(width*.3,height*.34),cos=Math.cos(angle),sin=Math.sin(angle);
  const sorted=points.map(([x,y,z],i)=>{
   const ripple=1+.11*Math.sin(y*12+angle*2)+.06*Math.cos(i*.09);
   return {x:(x*cos-z*sin)*ripple,y:y*ripple,z:x*sin+z*cos,i};
  }).sort((a,b)=>a.z-b.z);
  sorted.forEach(p=>{
   const perspective=2.8/(2.8-p.z*.35),x=width*.5+p.x*size*1.55*perspective,y=height*.49+p.y*size*perspective;
   ctx.fillStyle='rgba(204,59,32,'+(.2+(p.z+1)*.34)+')';
   ctx.beginPath();ctx.arc(x,y,(p.z+2)*.65,0,Math.PI*2);ctx.fill();
   if(p.i%6===0){ctx.strokeStyle='rgba(193,53,28,.09)';ctx.beginPath();ctx.moveTo(width*.5,height*.49);ctx.lineTo(x,y);ctx.stroke();}
  });
 }
 function tick(){frame=0;draw();if(!paused&&visible&&!document.hidden){angle+=.0025;frame=requestAnimationFrame(tick);}}
 function start(){if(!frame)tick();}
 function resize(){const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);width=box.width;height=box.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0);draw();}
 function sync(){pause.textContent=paused?'Play motion':'Pause motion';pause.setAttribute('aria-pressed',String(paused));if(paused){cancelAnimationFrame(frame);frame=0;draw();}else start();}
 pause.addEventListener('click',()=>{paused=!paused;sync();});
 reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});
 new ResizeObserver(resize).observe(canvas);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}}).observe(canvas);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
 resize();sync();
}
