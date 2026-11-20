import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo || root !== path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author')) throw new Error('Wrong authorized root');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const preserved = [];
for (const name of ['author-result.json', 'output-index.json', 'output-index.sha256']) {
  const original = path.join(root, name);
  const targetName = name.replace(/(\.[^.]+)$/, '.before-procedural-hold$1');
  const target = path.join(root, targetName);
  fs.writeFileSync(target, fs.readFileSync(original), { flag: 'wx' });
  fs.chmodSync(target, 0o444);
  preserved.push({ original: name, preserved: targetName, sha256: sha(target), bytes: fs.statSync(target).size });
}
const resultFile = path.join(root, 'author-result.json');
const result = JSON.parse(fs.readFileSync(resultFile));
result.status = 'LOCAL_PROCEDURAL_HOLD_AUTHOR_DRAFTS_AVAILABLE_PARENT_COLLECTION_PENDING';
result.HOLDs.localProcedure = [{
  id: 'H-AUTHOR-MANIFEST-DISCOVERY-OVERBROAD',
  status: 'HOLD',
  scope: 'Both figures author provenance, not a mathematical defect or source ambiguity',
  reason: 'Before original observations, sed printed the manifest beyond original paths and 12 bindings, including inherited status/HOLD metadata and originalContract references. This was broader than the direct human discovery-only boundary. No context-file, prior spec, prior modern image or answer was opened before the two own fresh pixel FIRST inventories were sealed. The broader manifest emission is disclosed and is not procedurally approved or erased by the later fresh seals.',
  actualCalls: [
    "sed -n '1,240p' .intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author-inputs-01/manifest.json",
    "sed -n '240,400p' .intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author-inputs-01/manifest.json",
  ],
  parentDisposition: 'Parent must assess this disclosed local procedural HOLD after COLLECT+CLOSE; no author clearance or source promotion.',
}];
result.artifactRecordCorrection = {
  purpose: 'Disclosure of genuine handoff/provenance defect only; no artwork changes, native reruns, image reopen or counter reset.',
  preserved,
  actualCommandReceipt: 'commands/record-procedural-hold/{command.json,stdout.txt,stderr.txt,exit.json}',
  unchangedDrafts: ['fig-g10-87.REPAIR1', 'fig-g10-88.FIRST'],
  contentRepairCountersUnchanged: { 'fig-g10-87': 1, 'fig-g10-88': 0 },
};
fs.unlinkSync(resultFile);
fs.writeFileSync(resultFile, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
fs.chmodSync(resultFile, 0o444);
for (const name of ['output-index.json', 'output-index.sha256']) fs.unlinkSync(path.join(root, name));
console.log(JSON.stringify({ status: result.status, localProcedureHOLD: 'H-AUTHOR-MANIFEST-DISCOVERY-OVERBROAD', preserved, currentAuthorResultSha256: sha(resultFile), nativeReruns: 0, newImageLoads: 0, indexNeedsReseal: true }));
