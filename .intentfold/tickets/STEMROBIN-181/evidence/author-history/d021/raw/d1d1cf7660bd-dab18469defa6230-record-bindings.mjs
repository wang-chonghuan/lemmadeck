import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n82-figure-review-153-154-proof';
const root = '.tmp/STEMROBIN-181/9p-d021-n82-fig153-154';
const freezePath = `${root}/author-freeze.json`;
const expectedFreeze = 'e6d5e09a53ba170f4d7507b1b688c6177f4ddd9e234925ddb7d02cb268866063';
const oldLessonSha = '8567d8ac59eb0e01467e28dfcd55e91049ff8d0bae9fa28731ff6095a65cbf76';
const liveLesson = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n82/lesson.template.json';
const archive = '.intentfold/tickets/STEMROBIN-181/tmp/d021-n82-text-correction-before/lesson.template.json';
const correctionPath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n82-prose-correction-freeze.json';
const expectedCorrection = '3e89ebe166490e4e0a634d553a3dc6a4a67791c4337ce5bcab82034d457c01be';
const resolve = file => path.resolve(repo, file.startsWith('lessons/') ? `ssot-resources/soviet10year-textbooks/artifacts/9p/${file}` : file);
const bytes = file => fs.readFileSync(resolve(file));
const sha = file => createHash('sha256').update(bytes(file)).digest('hex');
const load = file => JSON.parse(bytes(file));
const freeze = load(freezePath);
const records = [];
const failures = [];
const visited = new Set();
const seenBindings = new Set();
const queue = [{ file: freezePath, data: freeze }, { file: freeze.bindings.proseFreeze.path, data: { bindings: load(freeze.bindings.proseFreeze.path).bindings } }];

function visit(value, origin, location = '') {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
    const key = `${origin}:${location}:${value.path}:${value.sha256}`;
    if (!seenBindings.has(key)) {
      seenBindings.add(key);
      const record = { origin, location, declared: { path: value.path, sha256: value.sha256 } };
      try {
        record.currentSha256 = sha(value.path);
        const physicalPath = fs.realpathSync(resolve(value.path));
        const historicalLesson = value.sha256 === oldLessonSha && physicalPath === fs.realpathSync(resolve(liveLesson));
        if (record.currentSha256 === value.sha256) {
          record.status = 'exact-current-bytes';
        } else if (historicalLesson && sha(archive) === oldLessonSha) {
          record.status = 'exact-initial-bytes-via-declared-archive';
          record.initialEvidence = { path: archive, sha256: oldLessonSha };
          record.provenance = 'Human explicitly authorized archive substitution after the block-14 text correction; live bytes are not approved by this INITIAL review.';
        } else {
          record.status = 'mismatch';
          failures.push(record);
        }
        if (value.symlinkTarget) {
          record.symlinkTargetMatches = fs.lstatSync(resolve(value.path)).isSymbolicLink()
            && physicalPath === fs.realpathSync(resolve(value.symlinkTarget));
          if (!record.symlinkTargetMatches) failures.push(record);
        }
        if (value.path.endsWith('.json') && !value.path.endsWith('/figures.template.json') && !visited.has(physicalPath)) {
          const evidenceFile = historicalLesson ? archive : value.path;
          queue.push({ file: evidenceFile, data: load(evidenceFile) });
        }
      } catch (error) {
        record.status = 'unresolved';
        record.error = error.message;
        failures.push(record);
      }
      records.push(record);
    }
  }
  for (const [key, item] of Object.entries(value)) visit(item, origin, location ? `${location}.${key}` : key);
}

for (let index = 0; index < queue.length; index++) {
  const { file, data } = queue[index];
  const key = fs.realpathSync(resolve(file));
  if (visited.has(key)) continue;
  visited.add(key);
  visit(data, file);
}

const lesson = load(archive);
const prose = lesson.prose.filter(block => block.kind === 'p' && block.text?.trim());
const fullContext = freeze.figureEvidence.map(figure => {
  const context = load(figure.bindings.fullCurrentContext.path);
  const spec = load(figure.bindings.spec.path);
  const original = load(freeze.bindings.proseFreeze.path).bindings.sourceLesson;
  return {
    figure: figure.figure,
    fullLessonEqualsArchivedInitialTemplate: isDeepStrictEqual(context.fullLesson, lesson),
    fullProseEqualsArchivedInitialProse: isDeepStrictEqual(context.lessons[0].fullProse, lesson.prose),
    specContainsAllInitialParagraphsInOrder: isDeepStrictEqual(spec.source.authoritativeText, prose.map(block => ({ lesson: lesson.id, text: block.text }))),
    contextContainsAllInitialParagraphsInOrder: isDeepStrictEqual(context.lessons[0].authoritativeText, spec.source.authoritativeText),
    embeddedOriginalLessonEqualsOriginalSource: isDeepStrictEqual(lesson.source.data, load(original.path)),
    storedParagraphBlocks: prose.length,
  };
});
for (const item of fullContext) {
  if (Object.values(item).includes(false)) failures.push(item);
}

const result = {
  schema: 'ld-s10y-image/initial-binding-observation@1',
  ticket: 'STEMROBIN-181',
  batch: 'D021',
  scope: 'Byte hashes, symlink metadata and full frozen-text equality only. No author, renderer, native validator, browser, promotion or gate rerun; no image decode or image open.',
  authorFreeze: { path: freezePath, sha256: sha(freezePath), expectedSha256: expectedFreeze },
  textCorrectionProvenanceOnly: { path: correctionPath, sha256: sha(correctionPath), expectedSha256: expectedCorrection },
  archivedInitialLesson: { path: archive, sha256: sha(archive), expectedSha256: oldLessonSha },
  liveLesson: { path: liveLesson, sha256: sha(liveLesson), notApprovedByInitialReview: true },
  fullContext,
  bindingDeclarationsChecked: records.length,
  records,
  failures,
};
if (result.authorFreeze.sha256 !== expectedFreeze || result.textCorrectionProvenanceOnly.sha256 !== expectedCorrection || result.archivedInitialLesson.sha256 !== oldLessonSha) {
  failures.push({ kind: 'freeze-or-archive-hash-mismatch' });
}
result.status = failures.length ? 'fail' : 'pass';
fs.writeFileSync(resolve(`${own}/binding-observation-resolved.json`), `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: result.status,
  declarationsChecked: records.length,
  uniqueFilesRead: visited.size,
  archivedInitialBindingDeclarations: records.filter(record => record.status === 'exact-initial-bytes-via-declared-archive').length,
  fullContext,
  failures,
}, null, 2));
