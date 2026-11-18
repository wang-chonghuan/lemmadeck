import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const expectedRoot = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d424-source187-r15-emphasis-affected-review';
if (root !== expectedRoot) throw new Error('Unexpected write root');
const parent = path.dirname(root);
const author = path.join(parent, 'd407-source187-first-author');
const prior = path.join(parent, 'd414-source187-first-independent-review');
const original = path.join(parent, 'd406-source187-first-preparation');
const expected = [
  [path.join(author, 'author-freeze.json'), '071628107a640a9850c94d9b126dd9af5f65ebf5df2b0831f8491c2dd56191e6'],
  [path.join(author, 'source-crops.py'), '3b1d9a924b26888c7b9248ad0324732c68a8c28deb0ec08a5e4f98279cc11c80'],
  [path.join(author, 'reading-crops/exercise-3-reading.png'), '33f8c00e3dda2951ea765a9627922a03befb47756ecfeb4b9794bea3f04895f5'],
  [path.join(author, 'work/10p/pages/0187/page.png'), '14fa7791cbf342bb4654bdde63239c9f2acc502c80d7e6342e5e321d5149fbcc'],
  [path.join(original, 'work/10p/pages/0187/page.png'), '14fa7791cbf342bb4654bdde63239c9f2acc502c80d7e6342e5e321d5149fbcc'],
  [path.join(original, 'manifest.json'), '03fd98f523ea7ae9de7a2e278fb59bf6d86c911113209e3f4884b5e58a1133a6'],
  [path.join(author, 'source/10p/pages/0187/page.md'), '8310dfe5708e5c3f4d831fec327b0ddd6e2a86d60757a061fe432a3327fb6b0c'],
  [path.join(author, 'source/10p/pages/0187/page.json'), '722ec6d0d20809f5fb7e7afc0514e29bc9ece2a694ba54be7532dbbfa1c9cb3a'],
  [path.join(prior, 'review-freeze.json'), '258f4f910595cd281f8bc85891394230f47dd0131d98821bc50abb2f4e6f579c']
];

function binding(file) {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0')
  };
}

function verifyInputs() {
  const records = new Map(expected);
  const priorFreezePath = path.join(prior, 'review-freeze.json');
  if (binding(priorFreezePath).sha256 !== records.get(priorFreezePath)) throw new Error('Prior freeze drift');
  const freeze = JSON.parse(fs.readFileSync(priorFreezePath, 'utf8'));
  for (const record of freeze.outputs) records.set(record.path, record.sha256);
  const verified = [...records].map(([file, expectedSha]) => {
    const actual = binding(file);
    if (actual.sha256 !== expectedSha) throw new Error(`Frozen input drift: ${file}`);
    if (file.startsWith(prior + path.sep) && actual.mode !== '0444') throw new Error(`Prior mode drift: ${file}`);
    return { ...actual, expected_sha256: expectedSha, verified: true };
  });
  const authorFreeze = JSON.parse(fs.readFileSync(path.join(author, 'author-freeze.json'), 'utf8'));
  for (const suffix of ['source-crops.py', 'reading-crops/exercise-3-reading.png']) {
    const file = path.join(author, suffix);
    const frozen = authorFreeze.outputs.find(record => record.path === file);
    if (!frozen || frozen.sha256 !== records.get(file)) throw new Error(`Author provenance missing: ${suffix}`);
  }
  const previousOpens = JSON.parse(fs.readFileSync(path.join(prior, 'actual-opens.json'), 'utf8'));
  if (previousOpens.total_images !== 4 || previousOpens.parent_images !== 24 ||
      previousOpens.events.some(event => event.path === path.join(author, 'reading-crops/exercise-3-reading.png'))) {
    throw new Error('Prior image-budget/provenance mismatch');
  }
  return verified;
}

function writeFrozen(name, value) {
  const file = path.join(root, name);
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
  fs.chmodSync(file, 0o444);
  return binding(file);
}

const stage = process.argv[2];
if (stage === 'detail') {
  const inputs = verifyInputs();
  const inventoryPath = path.join(root, 'independent-detail-inventory.json');
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  if (inventory.phase !== 'PIXEL-OBSERVATION-BEFORE-LOCAL-CANDIDATE-COMPARISON' ||
      inventory.independence.new_candidate_sentence_read_before_this_inventory ||
      inventory.actual_visual_open.opens !== 1 ||
      inventory.independence.cumulative_images_after !== 5) throw new Error('Invalid detail phase');
  fs.chmodSync(inventoryPath, 0o444);
  const freeze = writeFrozen('detail-freeze.json', {
    schema: 'source187-r15-emphasis-affected-review/detail-freeze@1',
    frozen_at: new Date().toISOString(),
    mode: '0444',
    inventory: binding(inventoryPath),
    candidate_sentence_new_read: false,
    author_semantics_used: false,
    prior_images: 4,
    new_images: 1,
    cumulative_images: 5,
    parent_images: 24,
    inputs
  });
  console.log(JSON.stringify({ inventory: binding(inventoryPath), detail_freeze: freeze }, null, 2));
} else if (stage === 'final') {
  const inputs = verifyInputs();
  const detailFreeze = JSON.parse(fs.readFileSync(path.join(root, 'detail-freeze.json'), 'utf8'));
  if (binding(detailFreeze.inventory.path).sha256 !== detailFreeze.inventory.sha256) throw new Error('Detail inventory drift');
  const inventory = JSON.parse(fs.readFileSync(detailFreeze.inventory.path, 'utf8'));
  const reportPath = path.join(root, 'report.json');
  if ((fs.statSync(reportPath).mode & 0o777) === 0o444) throw new Error('Report already frozen');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const opens = JSON.parse(fs.readFileSync(path.join(root, 'actual-opens.json'), 'utf8'));
  if (opens.events.length !== 1 || opens.total_new_images !== 1 || opens.cumulative_images !== 5 ||
      opens.parent_images !== 24 || opens.events[0].path !== inventory.actual_visual_open.path) {
    throw new Error('Affected image count mismatch');
  }
  const oldReport = JSON.parse(fs.readFileSync(path.join(prior, 'report.json'), 'utf8'));
  const oldHolds = oldReport.row_review.filter(row => row.verdict === 'HOLD');
  const oldPasses = oldReport.row_review.filter(row => row.verdict === 'PASS');
  if (oldHolds.length !== 1 || oldHolds[0].id !== 'r15' || oldPasses.length !== 22 ||
      oldReport.verdicts.RAW149PNG !== 'PASS' || oldReport.verdicts.SVG149 !== 'PASS') {
    throw new Error('Affected scope/inheritance mismatch');
  }
  const candidatePage = JSON.parse(fs.readFileSync(path.join(author, 'source/10p/pages/0187/page.json'), 'utf8'));
  const candidateRow = candidatePage.blocks[7].lines[3];
  const candidateSpan = candidateRow.match(/\*\*([^*]+)\*\*/g);
  const matching = inventory.detail_observation.strip_sufficient &&
    inventory.detail_observation.deliberate_local_bold &&
    candidateSpan?.length === 1 &&
    candidateSpan[0] === `**${inventory.detail_observation.bold_literal}**` &&
    candidateRow === '① 反射定律**就不成立了**；';
  if (!matching || report.verdicts.AFFECTED_R15 !== 'PASS') throw new Error('Unrecorded affected outcome');
  for (const record of Object.values(report.bindings)) {
    if (binding(record.path).sha256 !== record.sha256) throw new Error(`Report binding drift: ${record.path}`);
  }
  report.candidate_comparison.candidate_page_json_row = candidateRow;
  report.candidate_comparison.exact_literal_span_matches_frozen_pixel_inventory = matching;
  report.artifact_bindings = ['independent-detail-inventory.json', 'detail-freeze.json', 'actual-opens.json'].map(name => {
    const file = path.join(root, name);
    fs.chmodSync(file, 0o444);
    return binding(file);
  });
  report.sealed_at = new Date().toISOString();
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  const outputs = ['report.json', 'independent-detail-inventory.json', 'actual-opens.json', 'detail-freeze.json', 'seal-affected.mjs'].map(name => {
    const file = path.join(root, name);
    fs.chmodSync(file, 0o444);
    return binding(file);
  });
  const freeze = writeFrozen('review-freeze.json', {
    schema: 'source187-r15-emphasis-affected-review/review-freeze@1',
    frozen_at: new Date().toISOString(),
    mode: '0444',
    affected_review_complete: true,
    verdicts: report.verdicts,
    inheritance: report.inheritance,
    rows_re_reviewed_here: 1,
    inherited_row_passes: 22,
    composed_row_passes: 23,
    new_image_opens: 1,
    prior_images: 4,
    cumulative_images: 5,
    parent_images: 24,
    d414_hashes_and_modes_unchanged: true,
    detail_inventory_unchanged_after_freeze: true,
    candidate_unchanged: true,
    inputs,
    outputs,
    prohibited_actions: report.prohibited_actions,
    broader_statuses: report.broader_statuses,
    exclusion: 'No circular self-hash; final review-freeze SHA256 is returned separately.',
    stopped: true
  });
  console.log(JSON.stringify({ outputs: [...outputs, freeze], verdicts: report.verdicts, cumulative_images: 5, parent_images: 24 }, null, 2));
} else {
  throw new Error('Use detail or final');
}
