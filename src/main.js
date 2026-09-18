if (!document.querySelector('link[href="src/pages.css"]')) {
  const pageStyles = document.createElement('link');
  pageStyles.rel = 'stylesheet';
  pageStyles.href = 'src/pages.css';
  document.head.append(pageStyles);
}
if (!document.querySelector('link[href="src/refine.css"]')) {
  const refineStyles = document.createElement('link');
  refineStyles.rel = 'stylesheet';
  refineStyles.href = 'src/refine.css';
  document.head.append(refineStyles);
}
if (!document.querySelector('link[href="src/refine2.css"]')) {
  const finalStyles = document.createElement('link');
  finalStyles.rel = 'stylesheet';
  finalStyles.href = 'src/refine2.css';
  document.head.append(finalStyles);
}
if (!document.querySelector('link[href="src/visual-system.css"]')) {
  const visualStyles = document.createElement('link');
  visualStyles.rel = 'stylesheet';
  visualStyles.href = 'src/visual-system.css';
  document.head.append(visualStyles);
}

const detail = {
  1: ['01 / OBSERVE', 'Integrate multimodal evidence—from molecular assays to longitudinal clinical signals—into a coherent starting state.'],
  2: ['02 / MODEL', 'Learn the relationships between biological state, mechanism, and outcome across every available source of evidence.'],
  3: ['03 / SIMULATE', 'Explore possible futures in silico and make uncertainty visible before resources are committed.'],
  4: ['04 / DESIGN', 'Generate interventions with explicit objectives, constraints, and predicted system-level consequences.'],
  5: ['05 / EXPERIMENT', 'Select the experiments that maximize information gain and execute them in the laboratory.'],
  6: ['06 / LEARN', 'Close the loop: turn every readout into better predictions, better designs, and sharper questions.']
};
const output = document.querySelector('.loop-detail');
document.querySelectorAll('.loop-node').forEach(node => node.addEventListener('click', () => {
  const [label, copy] = detail[node.dataset.detail];
  output.innerHTML = `<span>${label}</span><p>${copy}</p>`;
  document.querySelectorAll('.loop-node').forEach(n => n.classList.toggle('selected', n === node));
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelector('.menu').addEventListener('click', () => document.querySelector('header').classList.toggle('nav-open'));
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => document.querySelector('header').classList.remove('nav-open')));
