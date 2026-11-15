const roadmap = document.querySelector('.kh-roadmap');
if (roadmap) {
  const phases = {
    foundation: ['01', 'PHASE 01 / FOUNDATION', 'Prove record exchange.', 'Define a minimal FHIR R4 record and test a permissioned Kuiper Chain environment with synthetic data.', 'Valid records · Reliable transactions · Queryable audit trail', 'Planned starting phase · No patient data'],
    product: ['02', 'PHASE 02 / PRODUCT', 'Connect app, card and reader.', 'Prototype mobile identity, QR sharing and an NFC Health Card. Exercise the complete request with test records.', 'Working app flow · Card reader retrieval · Recovery and security review', 'Planned prototype · Partner review required'],
    pilot: ['03', 'PHASE 03 / CLINIC PILOT', 'Evaluate a real care handoff.', 'Subject to authorization, invite one clinical partner to evaluate a limited workflow with patients and care teams.', 'Record integrity · Retrieval time · Staff usability · Patient experience', 'Future evaluation · Requires ethics, security and local approvals'],
    regional: ['04', 'PHASE 04 / REGIONAL', 'Adapt with local partners.', 'Use pilot evidence to assess Indonesia’s SATUSEHAT ecosystem and the needs of clinics with limited connectivity.', 'Local FHIR mapping · Offline workflow · Governance and operating model', 'Longer-term direction · Scope shaped by pilot evidence']
  };
  const tabs = [...roadmap.querySelectorAll('[role="tab"]')];
  const setPhase = tab => {
    const [number, kicker, title, copy, proof, status] = phases[tab.dataset.phase];
    tabs.forEach(item => item.setAttribute('aria-selected', String(item === tab)));
    roadmap.dataset.phase = tab.dataset.phase;
    roadmap.querySelector('#kh-roadmap-number').textContent = number;
    roadmap.querySelector('#kh-roadmap-kicker').textContent = kicker;
    roadmap.querySelector('#kh-roadmap-title').textContent = title;
    roadmap.querySelector('#kh-roadmap-copy').textContent = copy;
    roadmap.querySelector('#kh-roadmap-proof').textContent = proof;
    roadmap.querySelector('#kh-roadmap-status').textContent = status;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setPhase(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + tabs.length + (event.key === 'ArrowRight' ? 1 : -1)) % tabs.length;
      tabs[next].focus();
      setPhase(tabs[next]);
    });
  });
}
