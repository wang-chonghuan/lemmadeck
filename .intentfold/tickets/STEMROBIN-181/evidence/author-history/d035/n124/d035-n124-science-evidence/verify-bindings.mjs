import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const author = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-prose-author`;
const freezePath = `${author}/9p-n124-prose-freeze.json`;
const expectedFreeze = '252e902b86a0216b1d48901f88102891750e50fcd33c84c266daf9b28da2c156';
const rawPath = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d035-source307-exact-crop-review.json`;
const expectedRaw = '3707e22a832bc7d1a496236735516b7024f6f8f487f694c4fcb3e351204b12e4';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const freeze = readJson(freezePath);
const checked = new Map();
const skippedMedia = new Set();
const failures = [];

// Hash text bindings only. Never open or hash PNG, SVG, PDF or other media.
function check(binding, group) {
  if (!binding?.path || !binding.sha256) return;
  const path = resolve(repo, binding.path);
  if (/\.(png|svg|pdf|jpe?g|webp|gif)$/i.test(path)) {
    skippedMedia.add(path);
    return;
  }
  let observed;
  try {
    observed = hash(readFileSync(path));
  } catch (error) {
    failures.push({ group, path, error: error.code });
    return;
  }
  const record = { path, expectedSha256: binding.sha256, observedSha256: observed };
  if (observed !== binding.sha256) failures.push({ group, ...record });
  checked.set(path, record);
}

check({ path: freezePath, sha256: expectedFreeze }, 'supplied-freeze');
check({ path: rawPath, sha256: expectedRaw }, 'supplied-raw-review-text-only');
for (const binding of Object.values(freeze.frozenFiles)) {
  check(binding, 'frozenFiles');
  check({ path: binding.originalPath, sha256: binding.sha256 }, 'current-counterparts');
}
for (const binding of Object.values(freeze.bindings)) check(binding, 'bindings');
for (const binding of freeze.sourceAndContractSnapshots) check(binding, 'source-and-contract-snapshots');
for (const binding of freeze.originalNativeTemplates) check(binding, 'original-native-template-snapshots');
for (const binding of freeze.immutableOriginalBindings) check(binding, 'immutableOriginalBindings');
for (const binding of freeze.helpers) check(binding, 'helpers');
check(freeze.report, 'author-report-binding-not-approval');
const receipts = [];
for (const binding of freeze.commands) {
  check(binding, 'command-receipts');
  const receipt = readJson(binding.path);
  for (const key of ['stdin', 'stdout', 'stderr']) check(receipt[key], `receipt-${key}`);
  receipts.push({ path: binding.path, sha256: binding.sha256, recordedExitCode: receipt.exitCode });
}

const source = readJson(`${author}/inputs/source/lesson.json`);
const zh = readJson(freeze.frozenFiles.lessonTemplate.path);
const en = readJson(freeze.frozenFiles.englishLesson.path);
const alignment = readJson(freeze.bindings['translation-alignment.json'].path);
const flow = readJson(freeze.bindings['native-flow.json'].path);
const before = {
  zh: readJson(`${author}/authored-before-normalization.lesson.json`),
  en: readJson(`${author}/authored-before-normalization.english.json`),
};
const objects = [];
for (let index = 0; index < source.prose.length; index += 1) {
  const original = source.prose[index];
  const chinese = zh.prose[index];
  const english = en.prose[index];
  const mapped = alignment.objects[index];
  const bodies = {
    sourceTextSha256: hash(original.text),
    chineseBodySha256: hash(chinese.text),
    englishBodySha256: hash(english.text),
  };
  if (JSON.stringify(original.source_refs) !== JSON.stringify(chinese.source_refs)
      || JSON.stringify(original.source_refs) !== JSON.stringify(english.source_refs)
      || chinese.source_text !== original.text || english.source_text !== original.text) {
    failures.push({ kind: 'source-body-binding', index });
  }
  if (mapped.source_text_sha256 !== bodies.sourceTextSha256
      || mapped.chinese_text_sha256 !== bodies.chineseBodySha256
      || mapped.english_text_sha256 !== bodies.englishBodySha256
      || mapped.chineseText !== chinese.text || mapped.englishText !== english.text) {
    failures.push({ kind: 'alignment-body-binding', index });
  }
  for (const [language, lesson] of [['zh', zh], ['en', en]]) {
    if (before[language].prose[index].text.replace(/\s/g, '') !== lesson.prose[index].text.replace(/\s/g, '')) {
      failures.push({ kind: 'normalization-non-whitespace-delta', language, index });
    }
  }
  objects.push({ index, kind: original.kind, sourceRefs: original.source_refs, ...bodies });
}
for (const [language, lesson] of [['zh', zh], ['en', en]]) {
  const complete = lesson.prose.filter((block) => block.kind === 'p').map((block) => block.text).join('');
  const emitted = flow[language].paragraphs.map((paragraph) => paragraph.text).join('');
  if (complete.replace(/\s/g, '') !== emitted.replace(/\s/g, '')) {
    failures.push({ kind: 'stored-native-paragraph-body-mismatch', language });
  }
}

console.log(JSON.stringify({
  status: failures.length ? 'FAIL' : 'PASS',
  freezeSha256: hash(readFileSync(freezePath)),
  rawReviewSha256: hash(readFileSync(rawPath)),
  uniqueTextBindingsChecked: checked.size,
  mediaPathsExcludedWithoutReading: skippedMedia.size,
  failures,
  receipts,
  objects,
  beforeNormalizationHashes: {
    zh: hash(readFileSync(`${author}/authored-before-normalization.lesson.json`)),
    en: hash(readFileSync(`${author}/authored-before-normalization.english.json`)),
  },
  nativeParagraphCountsRead: {
    zh: flow.zh.paragraphs.length,
    en: flow.en.paragraphs.length,
  },
  checksAreReadOnlyAndNotNativeValidationOrSemanticApproval: true,
  checkedTextBindings: [...checked.values()],
}, null, 2));
if (failures.length) process.exitCode = 1;
