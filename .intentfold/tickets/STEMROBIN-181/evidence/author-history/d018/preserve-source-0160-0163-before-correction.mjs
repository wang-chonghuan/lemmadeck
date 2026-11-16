import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const reportPath = `${work}/source-review-9p-0160-0163.json`;
const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
assert.equal(report.status, 'blocked');
assert.deepEqual(report.findings.map(item => item.id), ['F1', 'F2']);
const directory = `${work}/9p-next-source-0160-0163/before-review-correction`;
await fs.mkdir(directory);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const files = [];
for (const page of report.pages) {
  const bytes = await fs.readFile(page.draft.path);
  assert.equal(hash(bytes), page.draft.sha256);
  const path = `${directory}/${String(page.pdf_page).padStart(4, '0')}.page.md`;
  await fs.writeFile(path, bytes, { flag: 'wx' });
  files.push({ path, originalPath: page.draft.path, sha256: hash(bytes) });
}
await fs.writeFile(`${directory}/preservation.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181',
  initialReport: { path: reportPath, sha256: hash(await fs.readFile(reportPath)) },
  initialAuthorFreeze: report.author_freeze,
  files, scope: 'F1 bold delimiter and F2 independent-card marker only; no metadata changes.',
}, null, 2)}\n`, { flag: 'wx' });
console.log(directory);
