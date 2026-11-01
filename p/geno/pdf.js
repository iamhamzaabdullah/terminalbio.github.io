/* The diagram and visible text are rendered locally; a text layer supports search. */
window.genoExportPDF = async function (svg, people, relationships, record = {}, diagramWarning = '') {
  if (!window.jspdf?.jsPDF) throw Error('The PDF component could not be loaded.');
  const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
  const W = 1754, H = 1240, M = 90, bottom = H - 100;
  const response = await fetch('vendor/DejaVuSans.ttf');
  if (!response.ok) throw Error('The report font could not be loaded.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 16384) binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
  pdf.addFileToVFS('DejaVuSans.ttf', btoa(binary));
  pdf.addFont('DejaVuSans.ttf', 'DejaVu', 'normal');
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const image = src => new Promise((resolve, reject) => {
    const img = new Image(); img.onload = () => resolve(img);
    img.onerror = () => reject(Error('Unable to render the pedigree image.')); img.src = src;
  });
  const logo = await image('../../src/assets/terminalbio-wordmark.svg');
  let page = 0, y = 0, layer = [];
  function start(continuation = false) {
    layer = [];
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#343c70'; ctx.fillRect(0, 0, W, 7);
    ctx.fillStyle = '#343c70'; ctx.font = '700 32px sans-serif'; ctx.fillText('geno', M, 62);
    const wordWidth = ctx.measureText('geno').width;
    ctx.fillStyle = '#bb5142'; ctx.fillText('.', M + wordWidth, 62);
    ctx.fillStyle = '#718087'; ctx.textAlign = 'right'; ctx.font = '600 15px sans-serif';
    ctx.fillText('PEDIGREE REPORT', W - M, 57); ctx.textAlign = 'left';
    ctx.strokeStyle = '#dce3e4'; ctx.beginPath(); ctx.moveTo(M, 83); ctx.lineTo(W - M, 83); ctx.stroke();
    y = 122;
    if (continuation) heading('Pedigree report · continued');
  }
  function finish() {
    ctx.strokeStyle = '#dce3e4'; ctx.beginPath(); ctx.moveTo(M, H - 70); ctx.lineTo(W - M, H - 70); ctx.stroke();
    ctx.drawImage(logo, M, H - 57, 108, 19);
    ctx.fillStyle = '#343c70'; ctx.font = '600 16px sans-serif';
    ctx.fillText('/ geno', M + 118, H - 42);
    ctx.fillStyle = '#718087'; ctx.font = '15px sans-serif';
    ctx.fillText('For professional review', M + 205, H - 42);
    ctx.textAlign = 'right'; ctx.fillText(String(page + 1), W - M, H - 42); ctx.textAlign = 'left';
    if (page++) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210);
    pdf.setFont('DejaVu'); pdf.setFontSize(9.4);
    for (const item of layer) pdf.text(item.text, item.x * 297 / W, item.y * 210 / H, { renderingMode: 'invisible' });
  }
  function ensure(space) { if (y + space > bottom) { finish(); start(true); } }
  function wrap(value, maxWidth) {
    const lines = [];
    for (const part of String(value).split(/\r?\n/)) {
      let line = '';
      for (const word of part.split(/\s+/)) {
        if (ctx.measureText(word).width > maxWidth) {
          if (line) { lines.push(line); line = ''; }
          for (const ch of word) {
            if (ctx.measureText(line + ch).width > maxWidth) { lines.push(line); line = ''; }
            line += ch;
          }
        } else {
          const next = line ? line + ' ' + word : word;
          if (line && ctx.measureText(next).width > maxWidth) { lines.push(line); line = word; }
          else line = next;
        }
      }
      lines.push(line || ' ');
    }
    return lines;
  }
  function text(value, options = {}) {
    const size = options.size || 20, leading = size + 9;
    ctx.font = (options.bold ? '600 ' : '') + size + 'px sans-serif';
    const lines = wrap(value, W - 2 * M);
    for (const line of lines) {
      ensure(leading);
      ctx.font = (options.bold ? '600 ' : '') + size + 'px sans-serif';
      ctx.fillStyle = options.color || '#33434a'; ctx.fillText(line, M, y);
      layer.push({ text: line, x: M, y }); y += leading;
    }
    y += options.after ?? 5;
  }
  function heading(title) {
    ensure(62); y += 9;
    text(title, { size: 23, bold: true, color: '#343c70', after: 8 });
  }
  const filled = value => value !== undefined && value !== null && String(value).trim() !== '';
  const get = id => people.find(person => person.id === id);
  const name = id => get(id)?.name || id || 'Unknown';
  start();
  text('Pedigree report', { size: 31, bold: true, color: '#263748', after: 7 });
  const metadata = [['Prepared by', record.author], ['Updated', record.date], ['Family history source', record.source]]
    .filter(([, value]) => filled(value)).map(([label, value]) => label + ': ' + value);
  text(metadata.length ? metadata.join('   |   ') : 'Record details not provided', { size: 18, color: '#67777c', after: 8 });
  heading('Pedigree');
  if (diagramWarning) text('Review: ' + diagramWarning, { size: 18, color: '#945140', after: 8 });
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const bounds = svg.getBBox();
  const view = svg.viewBox.baseVal;
  const left = Math.max(view.x, bounds.x - 55), topEdge = Math.max(view.y, bounds.y - 55);
  const right = Math.min(view.x + view.width, bounds.x + bounds.width + 55);
  const bottomEdge = Math.min(view.y + view.height, bounds.y + bounds.height + 55);
  const cropped = bounds.width > 0 && bounds.height > 0 && right > left && bottomEdge > topEdge;
  const originX = cropped ? left : view.x, originY = cropped ? topEdge : view.y;
  const diagramWidth = cropped ? right - left : view.width, diagramHeight = cropped ? bottomEdge - topEdge : view.height;
  clone.setAttribute('viewBox', [originX, originY, diagramWidth, diagramHeight].join(' '));
  clone.setAttribute('width', diagramWidth); clone.setAttribute('height', diagramHeight);
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
  try {
    const picture = await image(url);
    const available = Math.max(300, bottom - y - 25);
    const scale = Math.min((W - 2 * M) / picture.width, available / picture.height, 1.5);
    const x = (W - picture.width * scale) / 2, top = y;
    ctx.drawImage(picture, x, top, picture.width * scale, picture.height * scale);
    clone.querySelectorAll('text').forEach(t => {
      const tx = Number(t.getAttribute('x')), ty = Number(t.getAttribute('y'));
      if (Number.isFinite(tx) && Number.isFinite(ty) && t.textContent) layer.push({ text: t.textContent, x: x + (tx - originX) * scale, y: top + (ty - originY) * scale });
    });
    y += picture.height * scale + 25;
    // For large diagrams, include overlapping detail views in addition to the complete overview.
    if (scale < 0.65) {
      finish();
      const tileW = 1000, tileH = 650, stepX = 900, stepY = 550;
      const cols = Math.max(1, Math.ceil((picture.width - tileW) / stepX) + 1);
      const rows = Math.max(1, Math.ceil((picture.height - tileH) / stepY) + 1);
      for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
        start(); heading('Pedigree detail ' + (row + 1) + '.' + (col + 1) + ' of ' + rows + '.' + cols);
        const sx = Math.min(col * stepX, Math.max(0, picture.width - tileW));
        const sy = Math.min(row * stepY, Math.max(0, picture.height - tileH));
        const sw = Math.min(tileW, picture.width - sx), sh = Math.min(tileH, picture.height - sy);
        const factor = Math.min((W - 2 * M) / sw, (bottom - y) / sh, 1.5);
        ctx.drawImage(picture, sx, sy, sw, sh, M, y, sw * factor, sh * factor);
        finish();
      }
      start(true);
    }
  } finally { URL.revokeObjectURL(url); }
  heading('Person details');
  const fields = [['Sex assigned at birth','sexAtBirth'], ['Gender identity','genderIdentity'],
    ['Parentage / relationship context','parentageContext'], ['Twin / pregnancy context','twinContext'],
    ['Age / age at death','age'], ['Diagnosis','diagnosis'], ['Genetic test results','testResults'],
    ['Ancestry','ancestry'], ['Pregnancy / birth history','pregnancy'], ['Source and verification','source'],
    ['ISCN finding','iscn'], ['Notes','notes']];
  const known = new Set(['id','name','sex','affectedStatus','affected','deceased','proband','parent1','parent2','condition', ...fields.map(([, key]) => key)]);
  for (const person of people) {
    ensure(100);
    text(person.name || person.id || 'Unnamed person', { bold: true, size: 20, color: '#283d49', after: 2 });
    const status = ['Symbol: ' + (person.sex || 'unknown'), 'Status: ' + (person.affectedStatus || (person.affected ? 'affected' : 'unknown'))];
    if (person.deceased) status.push('Deceased'); if (person.proband) status.push('Proband');
    if (filled(person.condition)) status.push('Condition: ' + person.condition);
    text(status.join('  ·  '), { size: 18, after: 2 });
    if (person.parent1 || person.parent2) text('Genetic parents: ' + [person.parent1, person.parent2].filter(Boolean).map(name).join(' / '), { size: 18, after: 2 });
    for (const [label, key] of fields) if (filled(person[key])) text(label + ': ' + person[key], { size: 18, after: 2 });
    const extra = Object.fromEntries(Object.entries(person).filter(([key, value]) => !known.has(key) && filled(value)));
    if (Object.keys(extra).length) text('Additional record fields: ' + JSON.stringify(extra), { size: 18, after: 2 });
    y += 9;
  }
  if (relationships.length) {
    heading('Couple relationships');
    for (const rel of relationships) text(name(rel.a) + ' + ' + name(rel.b) + '  ·  ' + String(rel.status || 'unspecified').replaceAll('-', ' '), { size: 18, after: 2 });
  }
  const recordExtra = Object.fromEntries(Object.entries(record).filter(([key, value]) => !['author','date','source'].includes(key) && filled(value)));
  if (Object.keys(recordExtra).length) text('Additional record fields: ' + JSON.stringify(recordExtra), { size: 18 });
  heading('Notes and references');
  text('Citation: Abdullah H. geno: Pedigree documentation workspace [software]. terminalbio.', { size: 17, after: 1 });
  text('Zenodo (latest DOI): https://zenodo.org/badge/latestdoi/1441464136', { size: 17, after: 4 });
  text('Reference: Hastings RJ, Moore S, Chia N, editors. ISCN 2024. Karger; 2024. doi:10.1159/isbn.978-3-318-07331-7. See also the published erratum (2025).', { size: 17, after: 4 });
  text('Geno supports pedigree documentation; it does not validate ISCN nomenclature, interpret genetic findings or provide a diagnosis. Verify the pedigree and findings against the source report and current professional guidance. Clinical decisions remain the responsibility of qualified professionals.', { size: 17 });
  finish(); pdf.save('geno-pedigree.pdf');
};
