import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const preparedPath = `${ticket}/tmp/d1816-d1013-n64-first-missing-en/prepared.json`;
const prepared = read(preparedPath);
const failedReceipt = `${ticket}/tmp/d1816-recovery/native/d1014-n64-first-missing-en-author-native/receipt.json`;
const receipt = read(failedReceipt);
assert.equal(receipt.exitCode, 1);
assert.equal(bind(receipt.streams.stdout.path).sha256, receipt.streams.stdout.sha256);
const failed = JSON.parse(fs.readFileSync(receipt.streams.stdout.path, 'utf8'));
const affected = [2, 6, 20, 26, 28, 30, 32];
assert.deepEqual(failed.errors, affected.map(index => `en.prose[${index}] \u672a\u6539\u5199\u4f46 changes \u975e\u7a7a`));
const lesson = structuredClone(failed.lesson);
for (const index of affected) lesson.prose[index].changes = [];
const comparison = structuredClone(lesson);
for (const index of affected) comparison.prose[index].changes = failed.lesson.prose[index].changes;
assert.deepEqual(comparison, failed.lesson);
const out = `${ticket}/tmp/d1816-d1019-n64-unchanged-block-metadata`;
copy(`${ticket}/tmp/d1816-d1014-n64-first-missing-en/first-helper-failure.json`, `${out}/first-helper-failure.original.json`);
save(`${out}/first-native-failure.json`, {
  task: 'D1014', status: 'FIRST_AUTHOR_NATIVE_FAIL_UNCHANGED_BLOCK_CHANGE_MARKERS',
  execChunk: '4d0d06', receipt: bind(failedReceipt),
  candidateBeforeNative: bind(`${ticket}/tmp/d1816-d1014-n64-first-missing-en/en.before-native.json`),
  actualNativeOutput: receipt.streams.stdout, actualNativeErrors: failed.errors,
  allFirstAuthorBlocksVisited: true, firstAuthorHelperNativePassClaimed: false,
  mathematicalSignatureAssertionsPassedBeforeMetadataFailure: true,
  affectedRecoveryChangesOnly: affected, semanticHold: false,
});
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, lesson);
save(`${out}/en.prose-flow.json`, failed.flow);
const nativeReceipt = run('d1019-n64-seven-unchanged-metadata-affected-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(draftPath)}))
prepared=edition.load(Path(${JSON.stringify(preparedPath)}))
raw=edition.load(Path(prepared["source"]["path"]))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
errors=[]
for i in [2,6,20,26,28,30,32]:
    modern,approved,source=lesson["prose"][i],zh["prose"][i],raw["prose"][i]
    assert edition.math_signature(modern["text"])==edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],f"en.prose[{i}]"))
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"status":"PASS" if not errors else "FAIL","affectedIndices":[2,6,20,26,28,30,32],"errors":errors}))
assert not errors,errors`,
]);
save(`${out}/authored.json`, {
  task: 'D1019', card: prepared.card, status: 'AFFECTED_ONLY_SEVEN_UNCHANGED_BLOCK_METADATA_NATIVE_PASS',
  prepared: bind(preparedPath), source: prepared.source, approvedZh: prepared.approvedZh,
  historicalZhNative: prepared.completeChineseHistoricalNative,
  historicalZhScience: prepared.historicalZhScience,
  englishToc: bind(`${repo}/ssot-resources/soviet10year-textbooks/toc/9p/en.json`),
  englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  firstFailure: bind(`${out}/first-native-failure.json`), nativeReceipt,
  affectedIndices: affected, onlyChangeMarkersCorrected: true, errors: [],
  unchangedFirstNativeBlocksReplayed: false, wholeAuthorHelperNativePassClaimed: false,
  flowAndEnglishTextUnchangedFromFirstNativeOutput: true,
  originalObjects: 42, originalTasks: 0, originalFigures: 2,
  flowParagraphs: failed.flow.paragraphs.length, derivedConceptBoundaries: 4,
  workedExamplesRemainProse: 4, sourceSectionIdentityRetained: true,
  descriptiveMathTextTranslation: 'Chinese elastic-force descriptors become tension; mathematical atoms and numerical givens are unchanged.',
  spacedSourceFigureLabelsUseSupportedEnglishAliases: true,
  originalSourceZhAndFigureReviewReplayed: false, alreadyCountedInD018: true,
  officialFinalizeAndIndependentEnglishReview: 'pending', fullCourseApproval: false,
  parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), candidate: bind(draftPath),
  paragraphs: failed.flow.paragraphs.length, affected }));
