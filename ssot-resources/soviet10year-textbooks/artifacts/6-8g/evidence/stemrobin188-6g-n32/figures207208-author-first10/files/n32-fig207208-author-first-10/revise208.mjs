import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const owned = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n32-fig207208-author-first-10';
const input = path.join(owned, 'fig-208.spec.json');
const output = path.join(owned, 'fig-208.r1.spec.json');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if (fs.existsSync(output)) throw new Error('Do not overwrite revision evidence');
const spec = JSON.parse(fs.readFileSync(input, 'utf8'));
for (const level of ['upper', 'lower']) {
  const group = spec.source.inventory.find(g => g.id === `208-${level}-arcs`);
  const endpointAssertions = spec.assertions.filter(a =>
    a.id.startsWith(`208-${level}-`) && /-(start|end)-(radius|ray)$/.test(a.id)).map(a => a.id);
  if (endpointAssertions.length !== 24) throw new Error('Incomplete arc endpoint coverage');
  group.assertions.push(...endpointAssertions);
}
fs.writeFileSync(output, `${JSON.stringify(spec, null, 2)}\n`);
const revision = {
  schema: 'same188-6/content-revision@1', figure: 'fig-208', number: 1,
  reason: 'Arc groups must map their 24 executable radius/ray endpoint assertions each, rather than only objectCount.',
  original: { path: input, sha256: sha(input) },
  revised: { path: output, sha256: sha(output) },
  geometryObjectsUnchanged: true, authoritativeTextUnchanged: true,
  sourceFirstUnchanged: true, originalFailure: 'Author found incomplete arc source-inventory assertion mapping; first machine validation/render did not fail.',
  status: 'AUTHOR_ONLY', technicalRecovery: false, approval: false,
};
fs.writeFileSync(path.join(owned, 'fig-208.revision.json'), `${JSON.stringify(revision, null, 2)}\n`);
console.log(JSON.stringify(revision, null, 2));
