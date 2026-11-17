import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, evidence, indexPath, absolute, read, bytes, bind, verify,
  exists, immutableWrite, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const receiptPath = `${evidence}/reports/d031-n113-template-aliases.json`;
assert.ok(!await exists(receiptPath));
const sciencePath = `${ticket}/tmp/9p-n113-science-review.json`;
await verify(sciencePath, 'a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7');
const science = await read(sciencePath);
const before = await bytes(indexPath);
const index = JSON.parse(before);
const aliases = [];
for (const name of ['lesson', 'exercises']) {
  const source = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n113/${name}.template.json`;
  const approved = science.reviewedTextFiles.find(row => row.path.endsWith(`/${name}.template.json`));
  assert.ok(approved);
  await verify(source, approved.sha256);
  const retainedApproved = lookup(index, approved.path, approved.sha256);
  assert.ok(retainedApproved);
  await verify(retainedApproved, approved.sha256);
  const destination = `${evidence}/author-history/d031/n113/current-template-aliases/${name}.template.json`;
  await immutableWrite(destination, await bytes(source));
  index.reports.push({ ...await bind(destination), originalPath: source,
    batch: 'D-031', deliveryClaim: false });
  aliases.push({ current: await bind(source), retained: await bind(destination),
    approved: { path: retainedApproved, sha256: approved.sha256 } });
}
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-n113',
  status: 'exact-approved-standard-template-aliases-retained',
  aliases,
  originalRebindingFailure: {
    command: ['node', `${ticket}/tmp/rebind-d031-n113-figure-metadata.mjs`,
      '--execute', 'fig-229', 'fig-230'],
    exitCode: 1,
    message: 'Historical reference not retained: /Users/yong/.codex/worktrees/00b1/lemmadeck/.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n113/lesson.template.json',
    sidecarWritesBeforeFailure: 0,
  },
  limits: 'Current standard aliases verified byte-exact against retained SCI-approved author templates. No text/media/spec/native/SCI/figure/pixel change or replay.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(receiptPath), batch: 'D-031', deliveryClaim: false });
const helperPath = `${ticket}/tmp/retain-d031-n113-template-aliases.mjs`;
const retainedHelper = `${evidence}/author-history/d031/retain-d031-n113-template-aliases.mjs`;
await immutableWrite(retainedHelper, await bytes(helperPath));
index.reports.push({ ...await bind(retainedHelper), originalPath: helperPath,
  batch: 'D-031', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), before);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ aliases: aliases.length, receipt: await bind(receiptPath) }));
