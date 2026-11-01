(function (root) {
  'use strict';
  // Descriptive checks only. The output is never an inheritance classification.
  function review(people, relationships, record) {
    const notes = [], summary = [];
    const affected = people.filter(p => p.affectedStatus === 'affected' || (!p.affectedStatus && p.affected));
    const unknown = people.filter(p => p.affectedStatus === 'unknown' || (!p.affectedStatus && !p.affected));
    summary.push(people.length + ' people recorded; ' + affected.length + ' marked affected; ' + unknown.length + ' with unknown status.');
    const byId = new Map(people.map(p => [p.id, p]));
    function level(p, seen = new Set()) {
      if (!p || seen.has(p.id)) return 0;
      const next = new Set(seen); next.add(p.id);
      const parents = [p.parent1, p.parent2].map(id => byId.get(id)).filter(Boolean);
      return parents.length ? 1 + Math.max(...parents.map(parent => level(parent, next))) : 0;
    }
    if (affected.length) {
      const counts = new Map();
      for (const p of affected) { const n = level(p) + 1; counts.set(n, (counts.get(n) || 0) + 1); }
      summary.push('Affected entries by inferred generation: ' + [...counts].sort((a,b) => a[0]-b[0]).map(([n,count]) => n + ': ' + count).join('; ') + '. Generations depend on the genetic links entered and may be incomplete.');
    }
    const labels = new Map();
    for (const p of people) {
      const label = (p.name || '').trim();
      if (!label) notes.push('A person has no identifier.');
      else labels.set(label.toLowerCase(), (labels.get(label.toLowerCase()) || 0) + 1);
      if ((p.affectedStatus === 'affected' || (!p.affectedStatus && p.affected)) && !(p.condition || '').trim())
        notes.push((label || 'A person') + ': affected status has no condition recorded.');
      if (Boolean(p.parent1) !== Boolean(p.parent2)) notes.push((label || 'A person') + ': only one genetic parent is recorded.');
      const adoptiveParents = [p.adoptiveParent1, p.adoptiveParent2].filter(Boolean);
      if (new Set(adoptiveParents).size !== adoptiveParents.length) notes.push((label || 'A person') + ': the same adoptive parent was entered twice.');
      for (const id of adoptiveParents) {
        const parent = byId.get(id);
        if (!parent || parent.id === p.id || level(parent) >= level(p))
          notes.push((label || 'A person') + ': an adoptive parent is missing or not in an earlier inferred generation; the dotted line is not drawn. Check placement and record the relationship in notes.');
      }
      if (p.parentageType || p.twinType || p.pregnancyOutcome)
        notes.push((label || 'A person') + ': verify parentage, multiple-birth and pregnancy details; some contexts remain text annotations and genetic parent lines do not represent adoptive relationships.');
      if (p.twinType || p.twinGroup) {
        const group = (p.twinGroup || '').trim();
        const peers = people.filter(q => group && (q.twinGroup || '').trim() === group);
        const parents = q => [q.parent1, q.parent2].filter(Boolean).sort().join('|');
        if (!group || peers.length !== 2 || peers.some(q => !q.twinType || parents(q) !== parents(p)) || !parents(p))
          notes.push((label || 'A person') + ': a paired twin branch requires exactly two entries with the same group ID, recorded genetic parents and twin type.');
        else if (peers.some(q => q.twinType !== p.twinType))
          notes.push((label || 'A person') + ': multiple-birth entries have different twin types; verify zygosity.');
      }
    }
    for (const [label, count] of labels) if (count > 1) notes.push('Identifier "' + label + '" is used more than once.');
    if (people.length && !people.some(p => p.proband)) notes.push('No proband is marked.');
    if (people.filter(p => p.proband).length > 1) notes.push('More than one proband is marked; verify the intended index person.');
    if (people.length && !record?.source) notes.push('Family history source is not recorded.');
    const conditions = [...new Set(affected.map(p => (p.condition || '').trim()).filter(Boolean))];
    if (conditions.length) summary.push('Recorded affected conditions: ' + conditions.join('; ') + '.');
    if (relationships.some(r => r.consanguinity)) notes.push('A relationship is recorded as consanguineous; verify the relationship and diagram.');
    summary.push('Inheritance patterns and risk are not inferred. Status and condition labels may reflect different conditions or incomplete information.');
    return { summary, notes };
  }
  root.genoReview = review;
  if (typeof module !== 'undefined') module.exports = review;
})(typeof window === 'undefined' ? globalThis : window);
