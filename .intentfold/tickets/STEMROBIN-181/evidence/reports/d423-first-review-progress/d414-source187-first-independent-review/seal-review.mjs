import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const expectedRoot = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d414-source187-first-independent-review';
if (root !== expectedRoot) throw new Error('Unexpected write root');
const parent = path.dirname(root);
const prep = path.join(parent, 'd406-source187-first-preparation/manifest.json');
const author = path.join(parent, 'd407-source187-first-author/author-freeze.json');
const expected = new Map([
  [prep, '03fd98f523ea7ae9de7a2e278fb59bf6d86c911113209e3f4884b5e58a1133a6'],
  [author, '071628107a640a9850c94d9b126dd9af5f65ebf5df2b0831f8491c2dd56191e6']
]);

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
  const records = new Map();
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
      const file = path.resolve(value.path);
      const previous = records.get(file);
      if (previous && previous.sha256 !== value.sha256) throw new Error(`Conflicting binding: ${file}`);
      records.set(file, { path: file, sha256: value.sha256, bytes: value.bytes });
    }
    for (const child of Object.values(value)) visit(child);
  }
  for (const [file, sha256] of expected) {
    const actual = binding(file);
    if (actual.sha256 !== sha256) throw new Error(`Root binding drift: ${file}`);
    visit(JSON.parse(fs.readFileSync(file, 'utf8')));
    records.set(file, { path: file, sha256, bytes: actual.bytes });
  }
  return [...records.values()].map(record => {
    const actual = binding(record.path);
    if (actual.sha256 !== record.sha256 || (record.bytes !== undefined && actual.bytes !== record.bytes)) {
      throw new Error(`Frozen input drift: ${record.path}`);
    }
    return { ...actual, expected_sha256: record.sha256, verified: true };
  });
}

function writeFrozen(name, value) {
  const target = path.join(root, name);
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
  fs.chmodSync(target, 0o444);
  return binding(target);
}

const stage = process.argv[2];
if (stage === 'precomparison') {
  const inputs = verifyInputs();
  const inventoryPath = path.join(root, 'independent-text-inventory.json');
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  if (inventory.phase !== 'SOURCE-ONLY-PRECOMPARISON' || inventory.row_count !== 23 || inventory.rows.length !== 23 ||
      inventory.precomparisonfreeze.images_seen !== 2 ||
      inventory.precomparisonfreeze.candidate_report_content_read ||
      inventory.precomparisonfreeze.candidate_page_md_content_read ||
      inventory.precomparisonfreeze.candidate_page_json_content_read ||
      inventory.precomparisonfreeze.author_semantic_inventory_content_read) {
    throw new Error('Invalid independent inventory phase');
  }
  fs.chmodSync(inventoryPath, 0o444);
  const freeze = writeFrozen('precomparison-freeze.json', {
    schema: 'source187-first-independent-review/precomparison-freeze@1',
    frozen_at: new Date().toISOString(),
    mode: '0444',
    inventory: binding(inventoryPath),
    source_image_events: inventory.source_images,
    source_open_count: 2,
    initial_images: 0,
    parent_images: 24,
    candidate_content_read: false,
    author_semantic_inventory_content_read: false,
    author_freeze_metadata_used_as_source_truth: false,
    all_frozen_inputs_verified: true,
    unique_bound_inputs: inputs.length,
    inputs
  });
  console.log(JSON.stringify({ inventory: binding(inventoryPath), precomparison_freeze: freeze }, null, 2));
} else if (stage === 'final') {
  const inputs = verifyInputs();
  const pre = JSON.parse(fs.readFileSync(path.join(root, 'precomparison-freeze.json'), 'utf8'));
  if (binding(pre.inventory.path).sha256 !== pre.inventory.sha256) throw new Error('Independent inventory edited after freeze');
  const reportPath = path.join(root, 'report.json');
  if ((fs.statSync(reportPath).mode & 0o777) === 0o444) throw new Error('Report already frozen');
  const draft = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(pre.inventory.path, 'utf8'));
  const page = JSON.parse(fs.readFileSync(draft.bindings.candidate_page_json.path, 'utf8'));
  const candidateRows = page.blocks.flatMap((block, index) => block.kind === 'fig' ? [] :
    block.lines.map((text, line) => ({ source_ref: `p0187#${index + 1}`, candidate_line: line + 1, text })));
  if (candidateRows.length !== inventory.rows.length || draft.row_review.length !== inventory.rows.length) {
    throw new Error('Independent and candidate row membership mismatch');
  }
  // Compare frozen strings only; punctuation/markup equivalence never resolves emphasis.
  function glyphSequence(text) {
    const punctuation = { '，': ',', '？': '?', '（': '(', '）': ')', '：': ':', '；': ';', '·': '•' };
    return [...text].map(glyph => punctuation[glyph] ?? glyph).join('').replace(/[$*\s]/g, '');
  }
  draft.row_review = draft.row_review.map((review, index) => {
    const source = inventory.rows[index];
    const candidate = candidateRows[index];
    if (review.id !== source.id || review.source_ref !== candidate.source_ref ||
        review.candidate_line !== candidate.candidate_line) throw new Error(`Row binding mismatch: ${review.id}`);
    const match = glyphSequence(source.text) === glyphSequence(candidate.text);
    if (!match) throw new Error(`Unrecorded wording difference: ${source.id}`);
    return { ...review, independent_frozen_text: source.text, candidate_text: candidate.text, glyph_sequence_match: match };
  });
  draft.artifact_bindings = ['independent-text-inventory.json', 'precomparison-freeze.json', 'actual-opens.json']
    .map(name => {
      const file = path.join(root, name);
      fs.chmodSync(file, 0o444);
      return binding(file);
    });
  for (const record of Object.values(draft.bindings)) {
    if (binding(record.path).sha256 !== record.sha256) throw new Error(`Report binding drift: ${record.path}`);
  }
  draft.sealed_at = new Date().toISOString();
  fs.writeFileSync(reportPath, JSON.stringify(draft, null, 2) + '\n');
  const names = ['report.json', 'independent-text-inventory.json', 'actual-opens.json', 'precomparison-freeze.json', 'seal-review.mjs'];
  const outputs = names.map(name => {
    const file = path.join(root, name);
    fs.chmodSync(file, 0o444);
    return binding(file);
  });
  const report = JSON.parse(fs.readFileSync(path.join(root, 'report.json'), 'utf8'));
  const opens = JSON.parse(fs.readFileSync(path.join(root, 'actual-opens.json'), 'utf8'));
  if (opens.events.length !== 4 || opens.total_images !== 4 || opens.parent_images !== 24 ||
      opens.reopens !== 0 || opens.new_crops !== 0 || opens.new_resizes !== 0 ||
      opens.events.some((event, index) => event.sequence !== index + 1 || event.opens !== 1) ||
      report.rows.compared !== 23) throw new Error('Review count mismatch');
  for (const event of opens.events) {
    if (binding(event.path).sha256 !== event.sha256) throw new Error(`Opened input drift: ${event.path}`);
  }
  const freeze = writeFrozen('review-freeze.json', {
    schema: 'source187-first-independent-review/review-freeze@1',
    frozen_at: new Date().toISOString(),
    mode: '0444',
    finite_review_complete: true,
    verdicts: report.verdicts,
    rows: report.rows,
    initial_images: 0,
    cumulative_images: 4,
    batch_images: 4,
    maximum_batch_images: 8,
    maximum_context_images: 24,
    parent_images: 24,
    no_compaction_budget_reset: true,
    precomparison_inventory_unchanged: true,
    all_frozen_inputs_verified: true,
    unique_bound_inputs: inputs.length,
    inputs,
    outputs,
    exclusion: 'No circular self-hash: review-freeze.json SHA256 is returned in terminal output and final text.',
    old_FAIL_HOLD: 'unchanged',
    SOURCE186: 'old holds unchanged; hash verification is not review',
    SOURCE188: 'unread and not unblocked',
    broader_approval: false,
    source_or_candidate_writes: false,
    native_reruns: 0,
    browser_native_actions: 0,
    paid_generation: 0,
    descendants_worktrees_branches: 0,
    DB_git_index_meter_canonical_actions: 0,
    stopped: true
  });
  console.log(JSON.stringify({ outputs: [...outputs, freeze], verdicts: report.verdicts, rows: report.rows }, null, 2));
} else {
  throw new Error('Use precomparison or final');
}
