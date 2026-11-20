import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const out = `${ticket}/tmp/d1816-d289-n19-table-author`;
const sourceFile = 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/tbl-p0053-01.png';
const retainedProseFile = `${ticket}/evidence/reports/10p-n19-prose-freeze.json`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const source = bind(sourceFile);
const pairs = [
  { mechanics: 'Coordinate x', electrical: 'Charge q',
    labels: ['Coordinate', 'Charge'], math: ['x', 'q'] },
  { mechanics: "Velocity v_x", electrical: 'Current i',
    labels: ['Velocity', 'Current'], math: ['v\u2093', 'i'] },
  { mechanics: "Acceleration a_x=v'_x", electrical: "Rate of current change i'",
    labels: ['Acceleration', 'Rate of current change'], math: ['a\u2093 = v\u2032\u2093', 'i\u2032'] },
  { mechanics: 'Mass m', electrical: 'Self-inductance L',
    labels: ['Mass', 'Self-inductance'], math: ['m', 'L'] },
  { mechanics: 'Spring stiffness k', electrical: 'Reciprocal capacitance 1/C',
    labels: ['Spring stiffness', 'Reciprocal capacitance'], math: ['k', '1/C'] },
  { mechanics: 'Potential energy (1/2)kx^2', electrical: 'Electric-field energy q^2/(2C)',
    labels: ['Potential energy', 'Electric-field energy'], math: ['(1/2)kx\u00b2', 'q\u00b2/(2C)'] },
  { mechanics: 'Kinetic energy mv_x^2/2', electrical: 'Magnetic-field energy Li^2/2',
    labels: ['Kinetic energy', 'Magnetic-field energy'], math: ['mv\u2093\u00b2/2', 'Li\u00b2/2'] },
];
const inventory = {
  batch: 'D289', source, sourceViewedBeforeAuthoring: true,
  sourceImageOpens: 1, parentContinuationImageOpens: 16,
  sourceFacts: {
    columns: 2, headerRows: 1, bodyRows: 7,
    headers: ['Mechanical quantities', 'Electrical quantities'], pairs,
    borders: 'Top and bottom horizontal border; one central vertical divider; header separator. No body-row dividers or outside vertical borders.',
    otherObjects: 'No arrows, plots, illustrations, values or worked example.',
    visualMeaning: 'Seven one-to-one mechanical/electrical correspondences; no equality of physical dimensions or numerical values.',
  },
  deliberateModernChanges: [
    'English visible labels; conventional subscript and prime typography.',
    'Uniform rows with faint full table lattice and outside borders for scanning.',
    'Two text lines per body cell separate quantity name from its unchanged expression.',
    'The lattice measures table layout only; no added physical coordinate grid or calibration.',
  ],
  oldProseRetained: bind(retainedProseFile),
  approval: false, fullBilingualTextPendingD287: true,
};
save(`${out}/source-inventory.json`, inventory);
const objects = [{
  id: 'table-lattice', type: 'grid', xStep: 420, yStep: 110,
  xOffset: 60, yOffset: 60, bounds: [60, 940, 900, 60],
  stroke: 'grid', strokeWidth: 1,
}];
const assertions = [{
  id: 'table-two-columns-eight-rows', type: 'gridDimensions',
  grid: 'table-lattice', columns: 2, rows: 8,
}];
const groups = [{
  id: 'source-table-structure',
  description: 'Two columns; one header plus seven body rows. Original header separator/central divider/top/bottom borders are regularized into a faint 2x8 lattice, with body-row and external side borders explicitly modern additions.',
  requires: ['gridDimensions'], objects: ['table-lattice'],
  assertions: ['table-two-columns-eight-rows'],
}];
for (let row = 0; row < 8; row++) {
  for (let column = 0; column < 2; column++) {
    const cellId = `table-r${row}-c${column}`;
    const x = 60 + column * 420;
    const top = 940 - row * 110;
    const center = [x + 210, top - 55];
    objects.push({
      id: cellId, type: 'polygon',
      points: [[x, top], [x + 420, top], [x + 420, top - 110], [x, top - 110]],
      stroke: 'grid', strokeWidth: 1, fill: 'paper', fillOpacity: 0,
    });
    const texts = row === 0
      ? [[column === 0 ? 'Mechanical quantities' : 'Electrical quantities', center[1], 32]]
      : [[pairs[row - 1].labels[column], center[1] + 21, 30],
        [pairs[row - 1].math[column], center[1] - 24, 32]];
    const group = {
      id: `source-pair-r${row}-c${column}`,
      description: row === 0 ? inventory.sourceFacts.headers[column]
        : pairs[row - 1][column === 0 ? 'mechanics' : 'electrical'],
      objects: [cellId], assertions: [],
    };
    for (const [index, [text, y, fontSize]] of texts.entries()) {
      const id = `${cellId}-text-${index}`;
      const assertionId = `${id}-within-cell`;
      objects.push({
        id, type: 'text', at: [center[0], y], text, fill: 'ink',
        fontSize, fontWeight: row === 0 ? 600 : 400,
        labelPlacement: { position: 'CENTER' },
      });
      assertions.push({ id: assertionId, type: 'inside', point: id, container: cellId });
      group.objects.push(id);
      group.assertions.push(assertionId);
    }
    groups.push(group);
  }
}
const retained = read(retainedProseFile);
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'tbl-p0053-01', mode: 'deterministic',
  description: 'Complete two-column, seven-pair mechanical/electrical correspondence table. Expressions and pair order retained; English quantity names, uniform rows and faint body grid are modern readability additions, not numerical or dimensional equalities.',
  source: {
    image: { path: sourceFile, sha256: source.sha256 },
    authoritativeText: [{
      lesson: 'phy10-c1-s3-n19', locale: 'zh',
      text: retained.proseFlow.paragraphs.map(paragraph => paragraph.text).join('\n\n'),
    }],
    inventory: groups,
  },
  canvas: { width: 960, height: 1000, boundingBox: [0, 1000, 960, 0],
    keepAspectRatio: true, background: 'paper' },
  display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
  objects, assertions,
};
save(`${out}/geometry-draft.json`, spec);
console.log(JSON.stringify({
  inventory: bind(`${out}/source-inventory.json`), draft: bind(`${out}/geometry-draft.json`),
  fullBilingualBindingPending: true, renderingNotRun: true, completeCoursesAdded: 0,
}));
