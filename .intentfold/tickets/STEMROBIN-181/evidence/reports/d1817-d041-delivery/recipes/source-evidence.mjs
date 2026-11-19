import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

export function verifyPhaseEvidence(phase) {
  const bindings = new Map();
  function retain(path, sha256) {
    assert.equal(typeof path, 'string');
    assert.match(sha256, /^[0-9a-f]{64}$/);
    if (bindings.has(path)) assert.equal(bindings.get(path), sha256, `Conflicting evidence: ${path}`);
    bindings.set(path, sha256);
  }
  function collect(value) {
    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }
    if (!value || typeof value !== 'object') return;
    if ('path' in value || 'sha256' in value) retain(value.path, value.sha256);
    for (const prefix of ['source', 'crop', 'initial_snapshot']) {
      if (`${prefix}_path` in value || `${prefix}_sha256` in value) {
        retain(value[`${prefix}_path`], value[`${prefix}_sha256`]);
      }
    }
    Object.values(value).forEach(collect);
  }
  for (const key of ['initial_snapshots', 'clarification_snapshots', 'correction_snapshots', 'evidence', 'bindings']) {
    collect(phase[key] || []);
  }
  for (const page of phase.pages || phase.phase1?.pages || []) {
    for (const key of ['source', 'initial', 'corrections', 'crop']) collect(page[key]);
  }
  for (const [path, sha256] of bindings) assert.equal(hash(path), sha256, path);
  return [...bindings].map(([path, sha256]) => ({ path, sha256 }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [file, expectedHash] = process.argv.slice(2);
  assert.equal(hash(file), expectedHash);
  const phase = JSON.parse(fs.readFileSync(file));
  const bindings = verifyPhaseEvidence(phase);
  console.log(JSON.stringify({
    phase: { path: file, sha256: expectedHash }, bindings: bindings.length,
    pages: (phase.pages || phase.phase1?.pages).map(page => page.physical_page),
    imageOpens: phase.image_usage?.total_opens ?? phase.image_usage?.local_images_opened_total ??
      phase.image_usage?.total ?? phase.image_usage_ledger?.actual_total,
    parserRecoveryOnly: true, parentNewImageOpens: 0, sourceCardApproval: false,
  }));
}
