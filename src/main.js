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
if (!document.querySelector('link[href="src/visual-reset.css"]')) {
  const resetStyles = document.createElement('link');
  resetStyles.rel = 'stylesheet';
  resetStyles.href = 'src/visual-reset.css';
  document.head.append(resetStyles);
}
if (!document.querySelector('link[href="src/precision-fixes.css"]')) {
  const precisionStyles = document.createElement('link');
  precisionStyles.rel = 'stylesheet';
  precisionStyles.href = 'src/precision-fixes.css';
  document.head.append(precisionStyles);
}
if (!document.querySelector('link[href="src/rebuild.css"]')) {
  const rebuildStyles = document.createElement('link');
  rebuildStyles.rel = 'stylesheet';
  rebuildStyles.href = 'src/rebuild.css';
  document.head.append(rebuildStyles);
}
if (!document.querySelector('link[href="src/site-refinement.css"]')) {
  const siteStyles = document.createElement('link');
  siteStyles.rel = 'stylesheet';
  siteStyles.href = 'src/site-refinement.css';
  document.head.append(siteStyles);
}
if (document.querySelector('.xira-page')) {
  const existingXiraStyles = document.querySelector('link[href="src/xira.css"]');
  if (existingXiraStyles) existingXiraStyles.remove();
  const xiraStyles = document.createElement('link');
  xiraStyles.rel = 'stylesheet';
  xiraStyles.href = 'src/xira.css';
  document.head.append(xiraStyles);
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

const models = {
  bindfm: ['01 / BINDFM', 'Molecular interaction intelligence.', 'BindFM represents proteins, nucleic acids, small molecules, and cofactors in one interaction-aware space—so teams can rank candidates and decide what to test next.', 'Binder discovery & interface design', 'Ranks candidates for validation'],
  xuzu: ['02 / XUZU', 'Generative aptamer design.', 'XUZU generates focused sequence libraries under explicit target and diversity constraints, then learns directly from experimental readouts.', 'Aptamer discovery', 'Generates information-rich libraries'],
  rnx: ['03 / RNJ / RNX', 'RNA structure intelligence.', 'RNJ / RNX connects RNA sequence and structural reasoning to context, function, and the measurements that resolve uncertainty.', 'RNA therapeutics', 'Links structure to experimental response'],
  biocompute: ['04 / TB BIOCOMPUTE', 'Composable biological infrastructure.', 'TB Biocompute makes models, data, evaluations, and experimental outputs interoperable and traceable across a research program.', 'Model operations & evaluation', 'Connects the complete learning loop']
};
const drawer = document.querySelector('.model-drawer');
if (drawer) drawer.id = 'home-model-details';
document.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => {
  if (!drawer) return;
  const [index, title, copy, useCase, loopRole] = models[button.dataset.model];
  drawer.innerHTML = `<div><span class="drawer-index">${index}</span><h3>${title}</h3><p>${copy}</p></div><div class="drawer-meta"><span>USE CASE</span><strong>${useCase}</strong><span>LOOP ROLE</span><strong>${loopRole}</strong></div>`;
  drawer.classList.add('open');
  document.querySelectorAll('[data-model]').forEach(item => {
    const active = item === button;
    item.setAttribute('aria-expanded', String(active));
    item.setAttribute('aria-controls', drawer.id);
    item.setAttribute('aria-label', `${active ? 'Hide' : 'Show'} ${models[item.dataset.model][0].replace(/^\d+ \/ /, '')} details`);
    item.textContent = active ? '−' : '+';
  });
}));

const applicationList = document.querySelector('.application-list');
if (applicationList) {
  const insight = document.createElement('div');
  insight.className = 'genetic-insight';
  insight.innerHTML = '<span>GENETIC INSIGHT</span><h3>Design with sequence context, not sequence alone.</h3><p>Select an application to see the biological signal each program is designed to resolve.</p>';
  applicationList.after(insight);
  const insights = [
    ['Binder & aptamer discovery', 'Map target interface features and candidate sequence diversity before committing laboratory cycles.'],
    ['Resistance prediction', 'Track evolutionary pressure, escape routes, and fitness trade-offs as an explicit intervention constraint.'],
    ['RNA therapeutics', 'Connect sequence motifs and secondary-structure constraints to expression, stability, and function.'],
    ['Programmable biology', 'Relate edits and constructs to pathway-level behavior rather than optimizing a single isolated readout.']
  ];
  applicationList.querySelectorAll('article').forEach((item, index) => item.addEventListener('click', () => {
    const [title, copy] = insights[index];
    insight.innerHTML = `<span>GENETIC INSIGHT / 0${index + 1}</span><h3>${title}</h3><p>${copy}</p>`;
    applicationList.querySelectorAll('article').forEach(card => card.classList.toggle('selected', card === item));
  }));
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

const menuButton = document.querySelector('.menu');
const siteHeader = document.querySelector('.site-header');
document.querySelectorAll('footer div').forEach(footerLinks => {
  if (footerLinks.querySelector('a[href="xira40/"]')) return;
  const researchLink = footerLinks.querySelector('a[href="research/"]');
  if (!researchLink) return;
  const strategyLink = document.createElement('a');
  strategyLink.href = 'xira40/';
  strategyLink.textContent = 'XIRA 2040';
  const portfolioLink = document.createElement('a');
  portfolioLink.href = 'xira3/';
  portfolioLink.textContent = 'XIRA3';
  researchLink.after(strategyLink, portfolioLink);
});
if (menuButton && siteHeader) {
  const siteNav = siteHeader.querySelector('nav');
  if (siteNav) {
    if (!siteNav.id) siteNav.id = 'site-navigation';
    menuButton.setAttribute('aria-controls', siteNav.id);
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => {
      const open = siteHeader.classList.toggle('nav-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      siteHeader.classList.remove('nav-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        siteHeader.classList.remove('nav-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
      }
    });
  }
}
