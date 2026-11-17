import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = '.intentfold/tickets/STEMROBIN-181/tmp';
const author = `${tmp}/d044-10p-n39-author`;
const output = `${tmp}/d044-n39-science-review-evidence`;
const expectedFreeze = 'a60f0815bd36534ca53e85a67defc588f09c50fb098ac99e45656a7358debaa2';
const abs = (file) => path.resolve(root, file);
const read = (file) => JSON.parse(fs.readFileSync(abs(file), 'utf8'));
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(abs(file))).digest('hex');
const equal = (actual, expected) => JSON.stringify(actual) === JSON.stringify(expected);
const write = (name, value) => fs.writeFileSync(
  abs(`${output}/${name}`), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' },
);
const bindings = [];
function bind(entry, role) {
  const actual = sha(entry.path);
  bindings.push({ ...entry, role, actualSha256: actual, match: actual === entry.sha256 });
  assert.equal(actual, entry.sha256, entry.path);
}

bind({ path: `${author}/author-freeze.json`, sha256: expectedFreeze }, 'requested author freeze');
const freeze = read(`${author}/author-freeze.json`);
bind(freeze.input, 'input freeze');
const input = read(freeze.input.path);
for (const item of input.inputs) {
  if (item.original) {
    bind(item.original, 'source byte integrity only; no source re-review');
    bind(item.snapshot, 'input snapshot byte integrity only');
  } else {
    bind(item, 'reused source-consumed PASS record');
  }
}
bind(input.raw, 'input raw lesson');
bind(input.exercises, 'input raw written tasks');

const require = createRequire(import.meta.url);
const { proseOutline, sectionBreakIndices } = require(abs(
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
));
const languageEvidence = [];
for (const entry of freeze.authored) {
  for (const key of ['lesson', 'exercises', 'figures', 'prose', 'questions', 'flow']) {
    bind(entry[key], `author-frozen ${entry.language} ${key}`);
  }
  for (const key of ['lesson', 'exercises', 'figures']) {
    bind({
      path: `${author}/frozen/${entry.language}/${key}.template.json`,
      sha256: entry[key].sha256,
    }, `verbatim frozen copy ${entry.language} ${key}`);
  }
  const lesson = read(entry.lesson.path);
  const exercises = read(entry.exercises.path);
  const rawPath = `${author}/${entry.language}/root/10p/${lesson.source.path}`;
  const rawExercisePath = `${author}/${entry.language}/root/10p/${exercises.source.path}`;
  bind({ path: rawPath, sha256: lesson.source.sha256 }, `${entry.language} embedded raw lesson`);
  bind({ path: rawExercisePath, sha256: exercises.source.sha256 },
    `${entry.language} embedded raw written tasks`);
  assert.deepEqual(lesson.source.data, read(rawPath));
  assert.deepEqual(exercises.source.data, read(rawExercisePath));
  assert.equal(lesson.prose.length, 12);
  assert.equal(lesson.prose.filter((block) => block.kind === 'p').length, 10);
  assert.equal(exercises.count, 6);
  assert.equal(exercises.exercises.length, 6);
  for (const [index, block] of lesson.prose.entries()) {
    const source = lesson.source.data.prose[index];
    assert.equal(block.source_text, source.text);
    for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
      assert.deepEqual(block[key], source[key]);
    }
  }
  for (const [index, item] of exercises.exercises.entries()) {
    const source = exercises.source.data.exercises[index];
    assert.equal(item.source_text, source.text);
    for (const key of [
      'number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures',
    ]) assert.deepEqual(item[key], source[key]);
    assert.deepEqual(item.lines, item.text.split('\n'));
  }
  assert.equal(fs.readFileSync(abs(entry.questions.path), 'utf8'),
    `${exercises.exercises.map((item) => item.text).join('\n\n')}\n`);
  const title = entry.language === 'zh' ? '\u6ce2\u957f\u4e0e\u6ce2\u901f' : 'Wavelength and Wave Speed';
  assert.equal(fs.readFileSync(abs(entry.prose.path), 'utf8'),
    `# 39. ${title}\n\n${lesson.prose.filter((block) => ['p', 'cap'].includes(block.kind))
      .map((block) => block.text).join('\n\n')}\n`);
  const flow = {
    paragraphs: proseOutline(lesson.prose),
    resolvedBreaks: sectionBreakIndices(lesson.prose, lesson.section_breaks),
  };
  flow.boundaries = flow.resolvedBreaks.map((index) => ({
    index, before: flow.paragraphs[index - 1].text, after: flow.paragraphs[index].text,
  }));
  const capturedFlow = read(entry.flow.path);
  assert.equal(capturedFlow.exitCode, 0);
  assert.deepEqual(flow, JSON.parse(capturedFlow.stdout));
  assert.equal(flow.paragraphs.length, entry.paragraphs);
  assert.equal(flow.resolvedBreaks.length, 5);
  const normalized = read(`${author}/normalize-${entry.language}.json`);
  assert.equal(normalized.exitCode, 0);
  const [normalizedLesson, normalizedExercises] = JSON.parse(normalized.stdout);
  const { section_breaks: ignored, ...withoutBreaks } = lesson;
  const { section_breaks: ignoredNormalized, ...normalizedWithoutBreaks } = normalizedLesson;
  assert.deepEqual(withoutBreaks, normalizedWithoutBreaks);
  assert.deepEqual(exercises, normalizedExercises);
  languageEvidence.push({
    language: entry.language,
    sourceSnapshotsEqual: true,
    sourceIdentityAndTaskConditionsPreserved: true,
    frozenMarkdownExactlyDerivedFromTemplates: true,
    capturedNormalizationMatchesFrozenText: true,
    capturedNativeFlowMatchesCurrentSharedParser: true,
    proseBlocks: 10,
    writtenTasks: exercises.exercises.map((item) => ({
      number: item.number, sourceRefs: item.pages, sourceText: item.source_text,
      frozenText: item.text, figureRefs: item.figure_refs,
    })),
    ...flow,
  });
}

// Inspect native normalization and signatures on deep copies; run no validation/finalize gate.
const pythonCode = `
import copy,json,sys
sys.path.insert(0,sys.argv[1])
import edition
documents=json.load(sys.stdin)
output=[]
for language,lesson,exercises in documents:
    normalized=copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    normalized_exercises=copy.deepcopy(exercises)
    edition.normalize_exercise_layout(normalized_exercises)
    rows=[]
    for i,block in enumerate(lesson["prose"]):
        rows.append({
            "blockIndex":i,"kind":block["kind"],"sourceRefs":block["source_refs"],
            "sourceNumbers":edition.number_signature(block["source_text"]),
            "frozenNumbers":edition.number_signature(block["text"]),
            "sourceMath":edition.math_signature(block["source_text"]),
            "frozenMath":edition.math_signature(block["text"]),
            "declaredNumericChanges":block["numeric_changes"]
        })
    output.append({"language":language,"normalizationIdempotent":normalized==lesson,
        "exerciseNormalizationIdempotent":normalized_exercises==exercises,"signatures":rows})
json.dump(output,sys.stdout,ensure_ascii=True)
`;
const documents = freeze.authored.map((entry) => [
  entry.language, read(entry.lesson.path), read(entry.exercises.path),
]);
const inspection = spawnSync(
  abs('.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  ['-B', '-c', pythonCode, abs('.claude/skills/ld-s10y-lesson/tools')],
  { cwd: root, input: JSON.stringify(documents), encoding: 'utf8', timeout: 30000 },
);
assert.equal(inspection.status, 0, inspection.stderr);
const nativeInspection = JSON.parse(inspection.stdout);
for (const entry of nativeInspection) {
  assert.equal(entry.normalizationIdempotent, true);
  assert.equal(entry.exerciseNormalizationIdempotent, true);
  for (const signature of entry.signatures) {
    assert.deepEqual(signature.sourceMath, signature.frozenMath);
    assert.deepEqual(signature.declaredNumericChanges, []);
  }
}

const nativeCommandPath = `${author}/native-text-command.json`;
const nativeCommand = read(nativeCommandPath);
const nativeReport = JSON.parse(nativeCommand.stdout);
assert.equal(nativeCommand.exitCode, 1);
assert.equal(nativeReport.status, 'fail');
assert.equal(nativeReport.errors.length, 3);
assert.equal(nativeReport.languages[0].errors.length, 0);
assert.equal(nativeReport.languages[1].errors.length, 3);
const numericMismatches = nativeInspection.flatMap((entry) => entry.signatures
  .filter((row) => !equal(row.sourceNumbers, row.frozenNumbers))
  .map((row) => ({ language: entry.language, ...row })));
assert.deepEqual(numericMismatches.map((row) => [row.language, row.blockIndex, row.frozenNumbers]),
  [['en', 2, ['70']], ['en', 7, ['72']], ['en', 9, ['72']]]);

const sourcePages = {};
for (const number of ['0110', '0111', '0112']) {
  const file = `.intentfold/tickets/STEMROBIN-181/tmp/d044-wave-preparation/root/10p/pages/${number}/page.json`;
  const page = read(file);
  sourcePages[number] = {
    path: file, sha256: sha(file), printedPage: page.meta.printed_page,
    blocks: page.blocks,
  };
}
const usedRefs = [...new Set([
  ...documents[0][1].prose.flatMap((block) => block.source_refs),
  ...documents[0][2].exercises.flatMap((item) => item.pages),
])];
const textBindings = usedRefs.map((ref) => {
  const [number, oneBased] = ref.slice(1).split('#');
  const page = sourcePages[number];
  const block = page.blocks[Number(oneBased) - 1];
  assert.ok(block, ref);
  return {
    ref, path: page.path, pageSha256: page.sha256, printedPage: page.printedPage,
    kind: block.kind, lines: block.lines, continuation: block.cont, open: block.open,
  };
});
const reused = input.inputs.filter((entry) => entry.path).map((entry) => {
  const record = read(entry.path);
  assert.equal(record.SOURCE, 'PASS');
  assert.equal(record.RAW, 'PASS');
  return { ...entry, status: record.status, SOURCE: record.SOURCE, RAW: record.RAW,
    action: 'reuse accepted record; no source review or gate replay' };
});
const inspectedFiles = [
  `${author}/author.mjs`, `${author}/check-text.py`, nativeCommandPath,
  `${author}/normalize-zh.json`, `${author}/normalize-en.json`,
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
].map((file) => ({ path: file, sha256: sha(file) }));
for (const binding of bindings) assert.equal(sha(binding.path), binding.actualSha256);

write('hash-validation.json', {
  ticket: 'STEMROBIN-181', card: freeze.card, status: 'PASS',
  checkedAt: new Date().toISOString(), expectedAuthorFreezeSha256: expectedFreeze,
  bindingCount: bindings.length, bindings, inspectedFiles,
  protectedBindingsStillMatchAfterInspection: true,
  imageIntegrityMethod: 'SHA-256 byte hashing only; no decoding, displaying or image interpretation',
  ImageOpens: 0,
});
write('source-text-bindings.json', {
  status: 'PASS-text-binding-only', reusedSourceReviews: reused,
  raw: input.raw, rawExercises: input.exercises, textBindings,
  sourceReReview: false, sourceGateReplay: false, ImageOpens: 0,
});
write('native-flow-inspection.json', {
  status: 'INSPECTED-not-native-finalized',
  method: 'Current shared proseOutline/sectionBreakIndices and pure normalization/signature functions; no gate execution',
  languages: languageEvidence, pureNativeInspection: nativeInspection,
  existingNativeCommand: { path: nativeCommandPath, sha256: sha(nativeCommandPath),
    command: nativeCommand.command, exitCode: nativeCommand.exitCode,
    status: nativeReport.status, errors: nativeReport.errors,
    stderr: nativeCommand.stderr, signatureMismatches: numericMismatches },
  nativeGateRerun: false, nativeFinalizeRun: false, renderRun: false,
  fullCardApproval: false, ImageOpens: 0,
});
console.log(JSON.stringify({
  status: 'PASS-integrity-and-inspection',
  bindingCount: bindings.length,
  paragraphs: languageEvidence.map((entry) => [entry.language, entry.paragraphs.length]),
  retainedNativeExitCode: nativeCommand.exitCode, retainedNativeErrorCount: nativeReport.errors.length,
  ImageOpens: 0,
}, null, 2));
