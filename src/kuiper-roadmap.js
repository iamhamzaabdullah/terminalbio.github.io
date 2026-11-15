const roadmap = document.querySelector('.kh-full-roadmap');
if (roadmap) {
  const stages = {
    foundation: ['01','MONTHS 1–6 / FOUNDATION','Build the technical base.','Define the first FHIR record, stand up the Kuiper Chain test network, and document the API using synthetic data.','FHIR record schema · Test network · API v1 · Clinic letters of intent','Records validate, transactions run reliably, and audit events can be queried.','Planned phase · synthetic records only'],
    product: ['02','MONTHS 7–12 / PRODUCT','Make the patient workflow tangible.','Prototype the mobile app, QR sharing, NFC card and clinic reader, then connect them to the test network.','Patient app alpha · 200 card prototypes · Clinic readers · Security review','A patient can start a sharing request and an authorized clinic can retrieve the test record.','Planned prototype · partner and security review required'],
    pilot: ['03','MONTHS 13–18 / CLINIC PILOT','Test a care handoff in practice.','If approvals and partners are in place, evaluate a focused workflow with clinic staff and patients.','Limited clinic pilot · Staff training · Usability feedback · Integrity review','The workflow meets agreed retrieval, integrity, safety and usability criteria.','Future evaluation · subject to ethics, security and local approvals'],
    scale: ['04','MONTHS 19+ / REGIONAL SCALE','Adapt the model with local partners.','Use pilot evidence to assess regional integrations, lower-connectivity workflows and the operating model for expansion.','Malaysia: MySejahtera pathway · Indonesia: SATUSEHAT mapping · Offline access research','Local technical fit, governance and partner readiness are demonstrated before expansion.','Longer-term direction · timing and scope remain to be established']
  };
  const tabs = [...roadmap.querySelectorAll('[role="tab"]')];
  const choose = tab => {
    const [number,kicker,title,description,items,gate,status] = stages[tab.dataset.stage];
    tabs.forEach(item => item.setAttribute('aria-selected',String(item===tab)));
    roadmap.dataset.stage=tab.dataset.stage;
    roadmap.querySelector('#kh-stage-number').textContent=number;
    roadmap.querySelector('#kh-stage-kicker').textContent=kicker;
    roadmap.querySelector('#kh-stage-title').textContent=title;
    roadmap.querySelector('#kh-stage-description').textContent=description;
    roadmap.querySelector('#kh-stage-items').textContent=items;
    roadmap.querySelector('#kh-stage-gate').textContent=gate;
    roadmap.querySelector('#kh-stage-status').textContent=status;
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>choose(tab));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+tabs.length+(event.key==='ArrowRight'?1:-1))%tabs.length;
      tabs[next].focus();choose(tabs[next]);
    });
  });
}
