import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d316-t18-second-written-answer-review`;
const reportPath = `${folder}/report.json`;
const report = await read(reportPath);
for (const binding of [
  report.baseline, report.candidate, report.authorFreeze,
  report.authorReport, report.selectedSource,
]) await verify(binding.path, binding.sha256);
await fs.chmod(absolute(reportPath), 0o444);
const freezePath = `${folder}/review-freeze.json`;
await immutableWrite(freezePath, `${JSON.stringify({
  schema: 'STEMROBIN-181/scoped-answer-first-review-freeze@1',
  ticket: 'STEMROBIN-181', frozenUtc: new Date().toISOString(),
  report: await bind(reportPath), outcome: report.outcome,
  sourceTasks: report.reviewedSourceTasks, bilingualDisplayAnswers: 8,
  imagesOpened: 0, fullGate2PASS: false, wholeCardApproved: false,
}, null, 2)}\n`);
await fs.chmod(absolute(freezePath), 0o444);
console.log(JSON.stringify({ report: await bind(reportPath), freeze: await bind(freezePath) }));
