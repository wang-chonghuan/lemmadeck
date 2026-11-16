import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { ticket, read, bytes, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d025-source236-239-correction`;
assert.ok(!await exists(`${folder}/author-freeze.json`) && !await exists(`${folder}/started.json`));
const initialReview = `${tmp}/d025-source236-239-source-review.json`;
await verify(initialReview, '57bbcc09ffd3934ef4778eef7a76bbfdc3f3291311d716dc273d67441b2b9c3d');
const initial = await read(`${tmp}/d025-source236-239-author/author-freeze.json`);
const review = await read(initialReview);
assert.equal(review.status, 'fail');
const candidates = [];
for (const page of [236, 238, 239]) {
  const source = initial.pages.find(row => row.pdfPage === page).candidate;
  await verify(source.path, source.sha256);
  const before = (await bytes(source.path)).toString('utf8');
  await immutableWrite(`${folder}/before/${page}.page.md`, before);
  const match = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/.exec(before);
  assert.ok(match);
  const meta = JSON.parse(match[1]);
  let body = match[2];
  const changes = [];
  const replaceOne = (from, to) => {
    assert.equal(body.split(from).length, 2);
    body = body.replace(from, to);
    changes.push({ from, to });
  };
  if (page === 236) {
    replaceOne('$\\varepsilon>$\n$0$', '$\\varepsilon>↵0$');
    meta.counting = { edge_margin_px: 64,
      reason: 'Independent INITIAL source236 review maps all19 printed rows; native band20 is only lower scan-edge dirt at x5-60 and x1460-1503. Both64px margins contain no printed text. Counting-only exclusion; source and figure pixels unchanged.' };
  } else if (page === 238) {
    replaceOne('<!-- exhead -->', '<!-- h3 -->');
    replaceOne('泡的功率是多少？', '泡的功率是多大？');
    meta.counting = { edge_margin_px: 120,
      reason: 'Independent INITIAL source238 review maps all19 printed rows; native band20 is only lower scan-edge dirt at x17-75 and x1390-1503. Both120px margins contain no printed text. Counting-only exclusion; source and figure pixels unchanged.' };
  } else replaceOne('电解液，电离', '电解液. 电离');
  let reversed = body;
  for (const change of changes.toReversed()) reversed = reversed.replace(change.to, change.from);
  assert.equal(reversed, match[2], 'Only listed text changes permitted.');
  const candidatePath = `${folder}/${page}.page.md`;
  await immutableWrite(candidatePath, `---\n${JSON.stringify(meta, null, 2)}\n---\n${body}`);
  candidates.push({ page, before: { originalPath: source.path,
    ...await bind(`${folder}/before/${page}.page.md`) },
  candidate: await bind(candidatePath), changes, counting: meta.counting ?? null });
}
const initialCounts = `${tmp}/d025-source236-239-native/stdout.json`;
const countHelper = `${tmp}/d025-source236-238-affected-count.py`;
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const command = [python, '-B', countHelper];
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  initialReview: await bind(initialReview), initialCounts: await bind(initialCounts), candidates,
  command, helper: await bind(`${tmp}/correct-d025-source236-239.mjs`),
  countHelper: await bind(countHelper), affectedCountPages: [236, 238],
  unchanged239CountReused: true, unchanged237SourcePassReused: true, allowedCorrection: 1,
}, null, 2)}\n`);
const result = spawnSync(python, command.slice(1), {
  encoding: 'utf8', input: JSON.stringify({
    initialCounts, pages: candidates.filter(row => row.page !== 239)
      .map(row => ({ page: row.page, candidate: row.candidate.path })),
  }), timeout: 180000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/affected-counts.json`, result.stdout ?? '');
await immutableWrite(`${folder}/affected-counts.stderr.txt`, result.stderr ?? '');
await immutableWrite(`${folder}/affected-count-command.json`, `${JSON.stringify({
  command, exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  started: await bind(`${folder}/started.json`),
  stdout: await bind(`${folder}/affected-counts.json`),
  stderr: await bind(`${folder}/affected-counts.stderr.txt`), calls: 1, processesFinished: true,
}, null, 2)}\n`);
assert.equal(result.status, 0);
const counts = JSON.parse(result.stdout);
await immutableWrite(`${folder}/author-freeze.json`, `${JSON.stringify({
  batch: 'D025', stage: 'sole-affected-correction-frozen-awaiting-review',
  initialReview: await bind(initialReview), candidates,
  countCommand: await bind(`${folder}/affected-count-command.json`),
  counts: await bind(`${folder}/affected-counts.json`), initialCounts: await bind(initialCounts),
  sourceBindings: initial.pages.filter(row => row.pdfPage !== 237).map(row => ({
    page: row.pdfPage, source: `.tmp/ld-s10y-lesson/9p/pages/${String(row.pdfPage).padStart(4, '0')}/page.png`,
    sourceSha256: row.inputHashes['page.png'], gridSha256: row.inputHashes['page.grid.png'],
  })),
  unchanged237: initial.pages.find(row => row.pdfPage === 237),
  addressedFindingIds: review.findings.map(row => row.id),
  imageOpens: 0, repairCalls: 1, glyphCorrectionOnlyNotScienceRewrite: true,
  geometrySnapReplays: 0, cropWrites: 0, sourceFinalization: false,
}, null, 2)}\n`);
console.log(JSON.stringify({
  freeze: await bind(`${folder}/author-freeze.json`),
  counts: counts.pages.map(row => ({
    page: row.pdf_page, candidateRows: row.candidate_rows, nativeRows: row.native_masked_rows,
  })),
}));
