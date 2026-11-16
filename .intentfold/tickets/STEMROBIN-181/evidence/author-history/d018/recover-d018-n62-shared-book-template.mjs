import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const folder = `${work}/d018-n62-shared-book-template-recovery`;
const baselinePath = `${work}/9p-n62-prepared-baseline.json`;
const priorIndexRecoveryPath = `${work}/d018-n63-prior-index-archival-recovery.json`;
const expected = '7eca60bf1b0954650c66a86f247f37442194913bd05c9a2aa4fe1b3f09a0f2e7';
const expectedBefore = '0d515454df454094537e3be30ba55db31785452e16e0122ff468f77e50f800c4';
const expectedIndex = 'f52a9fddb9a9c9382cc77a740cabf3495c43e199a4aecb1725aac66a5db4a91c';
const absolute = file => path.isAbsolute(file) ? file : path.join(root, file);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const bind = file => ({ path: path.relative(root, absolute(file)), sha256: hash(fs.readFileSync(absolute(file))) });
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const verify = binding => assert.equal(bind(binding.path).sha256, binding.sha256);

assert.equal(process.cwd(), root);
assert.equal(fs.existsSync(absolute(folder)), false, 'Never overwrite archival recovery.');
const baseline = read(baselinePath);
const indexRecovery = read(priorIndexRecoveryPath);
assert.equal(baseline.sharedBookTemplateBefore.sha256, expectedBefore);
assert.equal(baseline.sharedBookTemplateAfterPrepare.sha256, expected);
assert.equal(indexRecovery.recovered.sha256, expectedIndex);
verify(baseline.sharedBookTemplateBefore);
verify(indexRecovery.recovered);
verify(baseline.tools['edition.py']);
const before = read(baseline.sharedBookTemplateBefore.path);
const historicalIndex = read(indexRecovery.recovered.path);
assert.equal(historicalIndex.status, 'ready');
assert.equal(before.schema, historicalIndex.schema);
assert.equal(before.edition, historicalIndex.edition);
assert.equal(before.profile.path, baseline.tools.profile.path);
assert.equal(before.profile.sha256, baseline.tools.profile.sha256);
const candidate = {
  schema: before.schema,
  edition: before.edition,
  status: 'draft',
  profile: before.profile,
  lessons: historicalIndex.lessons,
};
const data = `${JSON.stringify(candidate, null, 2)}\n`;
assert.equal(hash(data), expected, 'No approximate reconstruction or current-template substitution.');
const originalPath = path.relative(root, baseline.sharedBookTemplateAfterPrepare.path);
const current = fs.readFileSync(absolute(originalPath));
fs.mkdirSync(absolute(folder));
const recoveredPath = `${folder}/book.template.json`;
fs.writeFileSync(absolute(recoveredPath), data, { flag: 'wx' });
assert.equal(bind(recoveredPath).sha256, expected);
assert.deepEqual(fs.readFileSync(absolute(originalPath)), current);
const manifest = {
  status: 'recovered-history-only',
  role: 'Exact n62 shared book template after the recorded prepare; no prepare, author check or approval repeated',
  files: [{
    ...bind(recoveredPath), originalPath,
    role: 'Original prepared-baseline after-template SHA matched in full',
  }],
  bindings: {
    preparedBaseline: bind(baselinePath),
    beforeTemplate: baseline.sharedBookTemplateBefore,
    historicalEditionIndex: indexRecovery.recovered,
    historicalIndexRecovery: bind(priorIndexRecoveryPath),
    nativeEdition: baseline.tools['edition.py'],
    recoveryTool: bind(fileURLToPath(import.meta.url)),
  },
  construction: {
    nativeFunction: 'edition.cmd_prepare',
    header: 'schema/edition/profile from the exact frozen before-template; status draft',
    lessonList: 'Exact complete historical durable edition index lessons, copied without adding n62',
    beforeLessonCount: before.lessons.length,
    recoveredLessonCount: candidate.lessons.length,
    lastLessonId: candidate.lessons.at(-1).id,
    newN62SummaryInventedOrAppended: false,
    serializer: 'UTF-8, preserved field order, two-space JSON indentation and final LF',
    recoveredBytes: Buffer.byteLength(data),
    expectedFullSha256: expected,
  },
  currentSharedTemplateUntouched: true,
  currentSharedTemplateUsedAsHistoricalInput: false,
  nativePrepareOrGateCalls: 0,
  approvalClaimed: false,
};
const manifestPath = `${folder}/aliases.json`;
fs.writeFileSync(absolute(manifestPath), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ recovery: bind(manifestPath), alias: manifest.files[0] }, null, 2));
