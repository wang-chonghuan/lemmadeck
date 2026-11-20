import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const repairs = {
  '89': {
    A: {position: 'N', gap: 38},
    O: {position: 'SW', gap: 28},
    B: {position: 'S', gap: 36},
    M: {position: 'E', gap: 24, offset: [0, 16]}
  },
  '90': {
    'left-A': {position: 'N', gap: 42},
    'left-O': {position: 'E', gap: 22},
    'left-B': {position: 'S', gap: 38},
    'right-A': {position: 'E', gap: 22, offset: [0, 20]},
    'right-O': {position: 'W', gap: 22},
    'right-B': {position: 'E', gap: 22, offset: [0, -20]}
  }
};
for (const [number, placements] of Object.entries(repairs)) {
  const id = `fig-g10-${number}`, first = path.join(root, `${id}.FIRST.spec.json`);
  const spec = JSON.parse(fs.readFileSync(first));
  const reportFile = path.join(root, `${id}.FIRST.render.json`);
  const report = JSON.parse(fs.readFileSync(reportFile));
  assert.equal(report.status, 'fail');
  assert.ok(report.collisions.length);
  assert.ok(report.displayChecks.every(c=>c.status==='pass'));
  const changes = [];
  for (const object of spec.objects) if (placements[object.id]) {
    changes.push({id: object.id, before: object.labelPlacement, after: placements[object.id]});
    object.labelPlacement = placements[object.id];
  }
  const repaired = path.join(root, `${id}.REPAIR1.spec.json`);
  fs.writeFileSync(repaired, JSON.stringify(spec,null,2)+'\n', {flag:'wx'});
  const original=JSON.parse(fs.readFileSync(first));
  const withoutPlacement = value => ({
    ...value, objects: value.objects.map(({labelPlacement, ...rest})=>rest)
  });
  assert.deepEqual(withoutPlacement(spec), withoutPlacement(original));
  const geometryReceiptFile=path.join(root, `${id}.FIRST.relationship-receipt.json`);
  const receipt = {
    schema: 'sole-targeted-content-repair@1', id, initialContentRepairCounter: 0, contentRepairCounter: 1,
    defectClass: 'CONTENT_LABEL_LAYOUT', failedStage: 'FIRST native render',
    diagnosis: 'Renderer reports text/point and text/stroke collisions. Text size passes at both declared widths. FIRST geometry mapping and source relationships passed and are unchanged.',
    repair: 'Move only renderer-owned labels to clear source marks/strokes, maintaining their source association. No point, incidence, arc, stroke, text glyph, font size, or edition text change.',
    changes, nativeFirstCollisions: report.collisions,
    FIRSTFailure: {path: path.relative(repo,reportFile), sha256:sha(reportFile), bytes:fs.statSync(reportFile).size},
    FIRSTSpec: {path:path.relative(repo,first), sha256:sha(first), bytes:fs.statSync(first).size},
    changedSpec: {path:path.relative(repo,repaired), sha256:sha(repaired), bytes:fs.statSync(repaired).size},
    retainedGeometryReceipt: {path:path.relative(repo,geometryReceiptFile), sha256:sha(geometryReceiptFile), bytes:fs.statSync(geometryReceiptFile).size},
    geometryMappingReplayed: false, geometryUnchangedByExecutableComparison: true,
    imageUnitsForDiagnosis: 0, remainingImageUnits: 6,
    afterSecondContentFailure: 'STOP dependent stages; no further content repair',
    semanticApproval: false, independentReview: false
  };
  fs.writeFileSync(path.join(root, `${id}.REPAIR1.repair-receipt.json`), JSON.stringify(receipt,null,2)+'\n', {flag:'wx'});
}
console.log(JSON.stringify({contentRepairCounters:{'fig-g10-89':1,'fig-g10-90':1}, geometryChanged:false, FIRSTFailuresPreserved:true, imageUnits:2}));
