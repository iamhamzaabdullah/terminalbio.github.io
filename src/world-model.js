const root = document.querySelector('.world-system-section');
if (root) {
  const stages = {
    observe: ['01 / OBSERVE','Begin with biological evidence.','Bring together sequence, structure, assays and context to describe the state you want to understand.',['SEQUENCE','STRUCTURE','ASSAY'],'◌'],
    model: ['02 / MODEL','Find the relationships that matter.','Connect measurements to mechanisms and outcomes across the biological context you care about.',['STATE','MECHANISM','RESPONSE'],'⌘'],
    simulate: ['03 / SIMULATE','Explore the possible futures.','Compare plausible responses before committing to an intervention or experiment.',['OUTCOMES','UNCERTAINTY','SCENARIOS'],'◉'],
    design: ['04 / DESIGN','Choose a deliberate intervention.','Search molecules, sequences, edits and programs against a defined biological goal.',['TARGET','CANDIDATES','TRADE-OFFS'],'✳'],
    experiment: ['05 / EXPERIMENT','Test the most useful question.','Select an assay that distinguishes competing explanations and improves what the model can predict.',['HYPOTHESIS','ASSAY','READOUT'],'⌁'],
    learn: ['06 / LEARN','Let evidence change the model.','Return each result, context and limitation to the loop, informing the next decision.',['RESULT','UPDATE','NEXT QUESTION'],'↻']
  };
  const tabs=[...root.querySelectorAll('[data-world-step]')];
  function activateStep(tab){
    const [label,title,copy,tags,symbol]=stages[tab.dataset.worldStep];
    tabs.forEach(item=>item.setAttribute('aria-selected',String(item===tab)));
    root.querySelector('.world-machine').dataset.worldStep=tab.dataset.worldStep;
    root.querySelector('#world-readout-label').textContent=label;
    root.querySelector('#world-readout-title').textContent=title;
    root.querySelector('#world-readout-copy').textContent=copy;
    root.querySelector('#world-readout-symbol').textContent=symbol;
    root.querySelector('#world-readout-tags').replaceChildren(...tags.map(tag=>{const node=document.createElement('span');node.textContent=tag;return node;}));
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activateStep(tab));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+tabs.length+(event.key==='ArrowRight'?1:-1))%tabs.length;
      tabs[next].focus();activateStep(tabs[next]);
    });
  });
}
const scales={
 molecular:'Molecular interactions set the conditions for what a cell can do.',
 cellular:'Cell states emerge from interacting pathways, signals and perturbations.',
 tissue:'Local cellular neighborhoods shape tissue level behavior over time.',
 patient:'Biology meets individual context, care decisions and measured outcomes.'
};
const scaleTabs=[...document.querySelectorAll('[data-world-scale]')];
scaleTabs.forEach((tab,index)=>{
 const activate=()=>{
  scaleTabs.forEach(item=>item.setAttribute('aria-selected',String(item===tab)));
  const art=document.querySelector('.world-scale-visual');
  art.dataset.scale=tab.dataset.worldScale;
  document.querySelector('#world-scale-caption').textContent=scales[tab.dataset.worldScale];
 };
 tab.addEventListener('click',activate);
 tab.addEventListener('keydown',event=>{
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?scaleTabs.length-1:(index+scaleTabs.length+(event.key==='ArrowRight'?1:-1))%scaleTabs.length;
  scaleTabs[next].focus();scaleTabs[next].click();
 });
});
