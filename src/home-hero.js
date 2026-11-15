const hero=document.querySelector('.future-hero'),slides=[...document.querySelectorAll('.hero-slide')],controls=[...document.querySelectorAll('[data-home-slide]')].filter(el=>el.closest('.hero-carousel-controls'));
if(hero&&slides.length&&controls.length){
 const show=index=>{const next=((index%slides.length)+slides.length)%slides.length;hero.dataset.homeSlide=String(next);slides.forEach((slide,i)=>{slide.hidden=i!==next;slide.setAttribute('aria-hidden',String(i!==next));});controls.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===next)));};
 controls.forEach((button,index)=>button.addEventListener('click',()=>show(index)));
 const group=hero.querySelector('.hero-carousel-controls');
 group.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const current=controls.findIndex(button=>button.getAttribute('aria-pressed')==='true');const next=event.key==='Home'?0:event.key==='End'?controls.length-1:(current+(event.key==='ArrowRight'?1:-1)+controls.length)%controls.length;controls[next].focus();show(next);});
}
