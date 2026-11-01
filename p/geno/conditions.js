(function (root) {
  'use strict';
  const fields = [
    ['additionalCondition', 'additionalStatus'],
    ['condition3', 'condition3Status'],
    ['condition4', 'condition4Status']
  ];
  function additional(person) {
    return fields.map(([name, status]) => ({
      name: typeof person[name] === 'string' ? person[name].trim() : '',
      status: person[status] || ''
    })).filter(item => item.name && ['affected', 'carrier'].includes(item.status));
  }
  function label(person) {
    const primary = person.affectedStatus === 'affected' || (!person.affectedStatus && person.affected)
      ? (person.condition || 'affected, condition unspecified')
      : 'not marked affected';
    return (person.name || 'Unnamed') + ': 1 ' + primary + '; ' +
      additional(person).map((item, index) => (index + 2) + ' ' + item.name + ' (' + item.status + ')').join('; ');
  }
  function wrap(text, limit = 85) {
    const lines = [];
    let line = '';
    for (const word of String(text).split(/\s+/).filter(Boolean)) {
      if (line && (line.length + 1 + word.length) > limit) { lines.push(line); line = ''; }
      let rest = word;
      while (rest.length > limit) { lines.push(rest.slice(0, limit)); rest = rest.slice(limit); }
      line = line ? line + ' ' + rest : rest;
    }
    if (line) lines.push(line);
    return lines;
  }
  root.genoConditions = { additional, label, fields, wrap };
  if (typeof module !== 'undefined') module.exports = root.genoConditions;
})(typeof window === 'undefined' ? globalThis : window);
