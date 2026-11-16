import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { ticket, read, bytes, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d025-source248-251-correction`;
const freezePath = `${folder}/author-freeze.json`;
assert.ok(!await exists(freezePath));
const reviewPath = `${tmp}/d025-source248-251-source-review.json`;
await verify(reviewPath, 'f5e7c823738a6ae379d739d3d2515dd9b49832200af7c66c9fdb51796c6d8a06');
const review = await read(reviewPath);
const authorPath = `${tmp}/d025-source248-251-author/author-freeze.json`;
await verify(authorPath, 'b438f7c22df62734ff90910eea073b429e151090fe5e6f007f252ffcb064d669');
const author = await read(authorPath);
const candidates = [];
const changes = [];
for (const page of [248, 250]) {
  const original = author.pages.find(row => row.physicalPage === page);
  await verify(original.candidate.path, original.candidate.sha256);
  const before = (await bytes(original.candidate.path)).toString('utf8');
  const front = /^---\n([\s\S]*?)\n---\n/.exec(before);
  assert.ok(front);
  const meta = JSON.parse(front[1]);
  let body = before.slice(front[0].length);
  if (page === 248) {
    const emphasis = review.findings.find(row => row.fid === 'D025-SOURCE-248-F01');
    const from = emphasis.before.join('\n');
    const to = emphasis.after.join('\n');
    assert.equal(body.split(from).length, 2);
    body = body.replace(from, () => to);
    assert.equal(meta.counting, undefined);
    const proposal = review.pages.find(row => row.pdf_page === page)
      .independent_count_diagnosis.counter_override_proposal;
    assert.equal(proposal.source_printed_content_excluded, false);
    assert.equal(proposal.value.edge_margin_px, 100);
    meta.counting = proposal.value;
    changes.push({ page, finding: emphasis.fid, from, to },
      { page, finding: 'D025-SOURCE-248-F02', counting: meta.counting });
  } else {
    const finding = review.findings.find(row => row.fid === 'D025-SOURCE-250-F01');
    for (const replacement of finding.replacements) {
      const from = replacement.before.join('\n');
      const to = replacement.after_one_stored_body_line;
      assert.equal(body.split(from).length, 2);
      body = body.replace(from, () => to);
      changes.push({ page, finding: finding.fid, ref: replacement.ref, from, to });
    }
  }
  const after = `---\n${JSON.stringify(meta, null, 2)}\n---\n${body}`;
  await immutableWrite(`${folder}/before/${page}.page.md`, before);
  const destination = `${folder}/${page}.page.md`;
  await immutableWrite(destination, after);
  candidates.push({ page, candidate: await bind(destination), originalInputs: original.files,
    before: { originalPath: original.candidate.path, ...await bind(`${folder}/before/${page}.page.md`) } });
}
await immutableWrite(freezePath, `${JSON.stringify({
  status: 'sole-affected-correction-frozen-awaiting-review', ticket: 'STEMROBIN-181',
  batch: 'D025', initialReview: await bind(reviewPath), initialAuthor: await bind(authorPath),
  candidates, changes, affectedCountPages: [248, 250], repairCalls: 1,
  independentExpectedRows: { 248: 25, 250: 22 },
  reusedPages: [249, 251].map(page => ({
    page, candidate: author.pages.find(row => row.physicalPage === page).candidate,
    expectedRows: review.pages.find(row => row.pdf_page === page).source_expected_rows,
    status: 'pass-reused',
  })),
  source244StillExhausted: true, sourceFinalizations: 0,
  limits: 'Exact emphasis, page-only edge exclusion and duplicate wrap repairs; no source pixel, figure box, historical text, passed observation, assembly or persistent source changes.',
}, null, 2)}\n`);
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const counter = `${tmp}/d025-source240-count.py`;
const command = [python, '-B', counter];
const counterInputs = [];
for (const item of candidates) {
  const source = item.originalInputs['page.png'];
  await verify(source.path, source.sha256);
  counterInputs.push({ page: item.page, candidate: item.candidate.path, source: source.path });
}
await immutableWrite(`${folder}/count-started.json`, `${JSON.stringify({
  command, candidates: counterInputs, freeze: await bind(freezePath),
  helper: await bind(`${tmp}/correct-d025-source248-250.mjs`), counter: await bind(counter),
}, null, 2)}\n`);
const result = spawnSync(python, command.slice(1), {
  input: JSON.stringify({ pages: counterInputs }), encoding: 'utf8', timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/count-stdout.json`, result.stdout ?? '');
await immutableWrite(`${folder}/count-stderr.txt`, result.stderr ?? '');
await immutableWrite(`${folder}/count-command.json`, `${JSON.stringify({
  command, exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  started: await bind(`${folder}/count-started.json`),
  stdout: await bind(`${folder}/count-stdout.json`), stderr: await bind(`${folder}/count-stderr.txt`),
  nativeCountInvocations: 1, sourceImageOpens: 0, sourceFinalizations: 0,
}, null, 2)}\n`);
assert.equal(result.status, 0);
console.log(JSON.stringify({
  freeze: await bind(freezePath), receipt: await bind(`${folder}/count-command.json`),
  pages: JSON.parse(result.stdout).pages.map(row => ({
    page: row.pdf_page, candidateRows: row.candidate_rows, nativeRows: row.native_masked_rows,
    delta: row.native_minus_candidate,
  })),
}));
