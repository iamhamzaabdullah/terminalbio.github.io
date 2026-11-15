const demo = document.querySelector('.kh-platform-demo');
if (demo) {
  const steps = {
    identity: {
      label: 'PATIENT ACCESS',
      title: 'Tap a card or share a QR.',
      text: 'The patient presents an NFC Health Card at the clinic, or opens a QR handoff in the Patient App. Either route begins a record request.',
      context: 'NFC credential · Patient App'
    },
    permission: {
      label: 'PATIENT PERMISSION',
      title: 'Choose what the clinic can see.',
      text: 'The patient reviews the provider and requested information, then grants time-limited access.',
      context: 'Verified provider · Scoped access'
    },
    record: {
      label: 'DIGITAL HEALTH EXCHANGE',
      title: 'Retrieve a structured summary.',
      text: 'The FHIR bridge retrieves the permitted record from encrypted storage. Kuiper Chain records the access event and an integrity reference, not clinical details.',
      context: 'HL7 FHIR R4 · Encrypted record · Audit event'
    },
    care: {
      label: 'CONTINUITY OF CARE',
      title: 'Continue the visit with context.',
      text: 'The provider reviews the summary and records the new encounter. AI assisted summaries are a possible later phase for clinical evaluation.',
      context: 'Care-team review · AI is future work'
    }
  };

  const tabs = [...demo.querySelectorAll('.kh-journey [role="tab"]')];
  const panel = demo.querySelector('[role="tabpanel"]');
  const setStep = tab => {
    const key = tab.dataset.step;
    const step = steps[key];
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    demo.dataset.demo = key;
    panel.setAttribute('aria-labelledby', tab.id);
    demo.querySelector('#kh-demo-kicker').textContent = step.label;
    demo.querySelector('#kh-demo-title').textContent = step.title;
    demo.querySelector('#kh-demo-text').textContent = step.text;
    demo.querySelector('#kh-demo-context').textContent = step.context;
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setStep(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      setStep(tabs[next]);
    });
  });

  const layers = {
    access: ['PATIENT CONTROL', 'A card and an app open the door.', 'NFC at the clinic. QR from the patient’s phone. Two simple ways to start the same authorized exchange.'],
    records: ['DIGITAL HEALTH', 'One structured record can travel.', 'The FHIR bridge connects provider systems. Clinical details stay in encrypted storage and return only within the approved request.'],
    trust: ['BLOCKCHAIN', 'Kuiper Chain records the exchange.', 'A permissioned ledger stores integrity references and access events. Health record details stay off-chain.']
  };
  const layerTabs = [...document.querySelectorAll('.kh-layer-switch [role="tab"]')];
  const layerPanel = document.querySelector('.kh-layer-panel');
  if (layerPanel) {
    layerTabs.forEach(tab => tab.addEventListener('click', () => {
      const [label, title, copy] = layers[tab.dataset.layer];
      layerTabs.forEach(item => item.setAttribute('aria-selected', String(item === tab)));
      layerPanel.dataset.layer = tab.dataset.layer;
      document.querySelector('#kh-layer-kicker').textContent = label;
      document.querySelector('#kh-layer-title').textContent = title;
      document.querySelector('#kh-layer-copy').textContent = copy;
      document.querySelector('.kh-layer-symbol').textContent = tab.dataset.layer === 'access' ? '◉' : tab.dataset.layer === 'records' ? '▤' : '⌘';
    }));
  }
}
