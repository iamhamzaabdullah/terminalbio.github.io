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
  bar.style.background=i%5===index?'#188648':'#6941df';
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
// Particle artwork is independent of the navigation and disclosure controls.
const canvas=document.querySelector('#biology-field');
if(canvas){
 const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),pause=document.querySelector('.motion-toggle');
 let width=0,height=0,angle=0,frame=0,paused=reduced.matches,visible=true;
 let pointerX=0,pointerY=0;
 canvas.addEventListener('pointermove',event=>{
  if(paused||reduced.matches)return;
  const box=canvas.getBoundingClientRect();
  pointerX=(event.clientX-box.left)/box.width-.5;
  pointerY=(event.clientY-box.top)/box.height-.5;
 });
 canvas.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
 function draw(){
  if(!ctx)return;
  ctx.clearRect(0,0,width,height);
  const size=Math.min(width*.42,height*.43),turn=angle*.35+pointerX*.2;
  const cx=width*.55,cy=height*.46;
  const segments=[];
  for(let ring=0;ring<40;ring++){
   const u=ring/40*Math.PI*2;
   let points=[];
   for(let step=0;step<=90;step++){
    const v=step/90*Math.PI*2;
    const wave=.065*Math.sin(u*3+angle*2);
    const radius=.67+(.24+wave)*Math.cos(v);
    const x=radius*Math.cos(u),y=radius*Math.sin(u),z=(.24+wave)*Math.sin(v)+.16*Math.sin(u*2+angle);
    const rx=x*Math.cos(turn)-z*Math.sin(turn),rz=x*Math.sin(turn)+z*Math.cos(turn);
    const tilt=.8+pointerY*.15;
    const ry=y*Math.cos(tilt)-rz*Math.sin(tilt),depth=y*Math.sin(tilt)+rz*Math.cos(tilt);
    const diagonal=-.5;
    points.push({x:cx+(rx*Math.cos(diagonal)-ry*Math.sin(diagonal))*size,y:cy+(rx*Math.sin(diagonal)+ry*Math.cos(diagonal))*size,depth});
   }
   segments.push({points,depth:points.reduce((sum,p)=>sum+p.depth,0)/points.length,ring});
  }
  segments.sort((a,b)=>a.depth-b.depth).forEach(({points,depth,ring})=>{
   const alpha=.18+(depth+1)*.27;
   ctx.strokeStyle=ring%7===0?'rgba(24,134,72,'+alpha+')':'rgba(65,73,222,'+alpha+')';
   ctx.lineWidth=ring%7===0?1.2:.8;
   ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
   if(ring%4===0){const p=points[20];ctx.fillStyle='#5938c7';ctx.beginPath();ctx.arc(p.x,p.y,1.7,0,Math.PI*2);ctx.fill();}
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
