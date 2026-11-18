import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const own = path.join(tmp, 'd628-n76-first-native-contract-affected-review');
const script = fileURLToPath(import.meta.url);
assert.equal(path.dirname(script), own);
assert.deepEqual(process.argv.slice(2), ['--execute']);
assert.equal(process.cwd(), repo);
for (const name of ['report.json', 'review-freeze.json']) {
  assert.equal(fs.existsSync(path.join(own, name)), false, 'Bounded review already recorded');
}

const absolute = p => path.resolve(repo, p);
const bytes = p => fs.readFileSync(absolute(p));
const sha = p => crypto.createHash('sha256').update(bytes(p)).digest('hex');
const read = p => JSON.parse(bytes(p).toString('utf8'));
const bind = p => ({
  path: absolute(p),
  sha256: sha(p),
  bytes: fs.statSync(absolute(p)).size,
  mode: (fs.statSync(absolute(p)).mode & 0o777).toString(8).padStart(4, '0'),
});
const inputs = new Map();
const pin = (p, expected, frozen = false) => {
  const row = bind(p);
  if (expected) assert.equal(row.sha256, expected, row.path);
  if (frozen) assert.equal(row.mode, '0444', row.path);
  if (inputs.has(row.path)) assert.equal(inputs.get(row.path).sha256, row.sha256);
  inputs.set(row.path, row);
  return row;
};

const authorRoot = path.join(tmp, 'd627-n76-first-native-contract-repair');
const authorReportPin = pin(path.join(authorRoot, 'report.json'),
  'dbcf48420766e764921657a7ad5fdbaf4faf062643212b04dd6dfac334599e99', true);
const authorFreezePin = pin(path.join(authorRoot, 'author-freeze.json'),
  'fa1a658327937cae443008e3b22b95452cca99d80d0f28888ea5d3633de7502a', true);
const authorReport = read(authorReportPin.path);
const authorFreeze = read(authorFreezePin.path);
for (const row of [...authorFreeze.files,
  ...authorReport.inputs, ...authorReport.outputs]) pin(row.path, row.sha256, true);
const authorProducerPin = pin(authorFreeze.producer.path, authorFreeze.producer.sha256);

const reusedRoot = path.join(tmp, 'd598-n76-r08-first-affected-text-review');
const reuseFreezePin = pin(path.join(reusedRoot, 'review-freeze.json'), undefined, true);
const reuseFreeze = read(reuseFreezePin.path);
for (const row of reuseFreeze.files) pin(row.path, row.sha256, true);
const reuseReportPin = bind(path.join(reusedRoot, 'report.json'));
const reuseReport = read(reuseReportPin.path);
assert.equal(reuseReport.status, 'FIRST-AFFECTED-R08-PASS-EFFECTIVE-COMPOSED-TEXT-PASS');
assert.equal(reuseReport.affected_requirement.SCI, 'PASS');
assert.equal(reuseReport.affected_requirement.ZHEN, 'PASS');
assert.equal(reuseReport.first_HOLD_retention.original_status, 'HOLD');
const firstHold = reuseReport.first_HOLD_retention;
for (const row of [firstHold.original_report, firstHold.first_findings]) {
  pin(row.path, row.sha256, true);
}
const sourceSnapshots = reuseReport.pins.source_snapshots.map(row =>
  pin(row.path, row.sha256, true));
const rawSource = read(sourceSnapshots.find(row => row.path.endsWith('/source/lesson.json')).path);
const criterionPin = bind(path.join(reusedRoot, 'affected-criterion.json'));
const criterion = read(criterionPin.path).criterion;
assert.equal(criterion.id, 'N76-R08');

const requirementPin = pin(path.join(tmp, 'd580-n76-source203-requirement-extension/report.json'),
  undefined, true);
const extension = read(requirementPin.path);
const requirement = extension.requirements.find(row => row.id === 'N76-R08');
assert.equal(requirement.id, 'N76-R08');
pin(extension.page.path, extension.page.sha256);
const baselinePin = pin(extension.baseline.path, extension.baseline.sha256, true);
const baseline = read(baselinePin.path);
const specialRaysRequirement = baseline.requirements.find(row => row.id === 'N76-R04');
assert.equal(specialRaysRequirement.id, 'N76-R04');

const expectedPointers = {
  zh: ['/prose/3/changes', '/prose/4/changes', '/prose/6/text', '/prose/10/text'],
  en: ['/title', '/printed_title', '/prose/6/text', '/prose/7/text', '/prose/10/text'],
};
const changedPointers = (a, b, pointer = '') => {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object'
    && !Array.isArray(a) && !Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .flatMap(key => changedPointers(a[key], b[key], `${pointer}/${key}`));
  }
  if (Array.isArray(a) && Array.isArray(b) && pointer === '/prose') {
    assert.equal(a.length, b.length);
    return a.flatMap((item, i) => changedPointers(item, b[i], `${pointer}/${i}`));
  }
  return [pointer];
};

const candidates = {};
const textRows = [];
const deltas = [];
const preservedClauses = [];
for (const locale of ['zh', 'en']) {
  const oldRoot = path.join(tmp, 'd597-n76-r08-first-text-repair/candidate', locale);
  const newRoot = path.join(authorRoot, 'candidate', locale);
  const old = read(path.join(oldRoot, 'lesson.template.json'));
  const current = read(path.join(newRoot, 'lesson.template.json'));
  candidates[locale] = { old, current };
  assert.deepEqual(current.source, old.source);
  assert.deepEqual(current.source.data, rawSource);
  assert.equal(current.source.sha256,
    sourceSnapshots.find(row => row.path.endsWith('/source/lesson.json')).sha256);
  assert.deepEqual(current.errata, old.errata);
  assert.deepEqual(current.errata, [], 'This restoration has no bound math corrections');
  const actual = changedPointers(old, current);
  assert.deepEqual(actual, expectedPointers[locale]);
  assert.deepEqual(actual, authorReport.deltas.find(row => row.locale === locale).changedPointers);
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    assert.equal(Buffer.compare(bytes(path.join(oldRoot, name)), bytes(path.join(newRoot, name))), 0);
  }
  const indices = locale === 'zh' ? [3, 4, 6, 10] : [6, 7, 10];
  for (const index of indices) {
    const before = old.prose[index];
    const after = current.prose[index];
    const source = rawSource.prose[index];
    assert.equal(after.source_text, source.text);
    for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
      assert.deepEqual(after[field], source[field]);
    }
    textRows.push({ locale, index, source: source.text, before, after });
  }
  assert.equal(current.prose[6].text, old.prose[6].text.replace(/^[123]\) /gm, ''));
  const beforeLines = old.prose[10].text.split('\n');
  const afterLines = current.prose[10].text.split('\n');
  assert.equal(afterLines.length, beforeLines.length);
  for (const i of [0, 1, 6]) assert.equal(afterLines[i], beforeLines[i]);
  const marker = locale === 'zh' ? '再在透镜的出射光一侧' : '; on the outgoing-light side';
  const beforeClause = beforeLines[3].slice(beforeLines[3].indexOf(marker));
  const afterClause = afterLines[3].slice(afterLines[3].indexOf(marker));
  assert.ok(beforeLines[3].includes(marker));
  assert.equal(beforeClause, afterClause);
  preservedClauses.push({
    locale,
    pointer: '/prose/10/text',
    focalPlaneClauseByteIdentical: true,
    focalPlaneClause: afterClause,
    backwardExtensionWarningByteIdentical: true,
    backwardExtensionWarning: afterLines[6],
    interpretation: 'Preservation proof only; d598 accepted R08 is reused, not re-reviewed.',
  });
  deltas.push({ locale, actualChangedPointers: actual, noOtherChangedPointers: true,
    exercisesByteIdentical: true, figuresTemplateByteIdentical: true,
    embeddedSourceSnapshotDeepEqual: true,
    changedBlocks: indices.map(index => ({
      index, sourceRefs: current.prose[index].source_refs,
      sourceTextUnchanged: true,
      beforeText: old.prose[index].text,
      afterText: current.prose[index].text,
      sourceText: rawSource.prose[index].text,
      beforeChanges: old.prose[index].changes,
      afterChanges: current.prose[index].changes,
    })),
  });
}
assert.equal(candidates.en.current.prose[7].text,
  candidates.en.old.prose[7].text.replace(
    'The ray $AOA_1$ through the optical center $O$ also reaches $A_1$.',
    'The ray through the optical center $O$, namely $AOA_1$, also reaches $A_1$.'));
const titleMapping = authorReport.titleMappings[0];
assert.equal(authorReport.titleMappings.length, 1);
assert.equal(titleMapping.locale, 'en');
assert.equal(titleMapping.nativeTitle, rawSource.title);
assert.equal(titleMapping.nativePrintedTitle, rawSource.printed_title);
assert.equal(titleMapping.displayTitle, candidates.en.old.title);
assert.equal(titleMapping.displayPrintedTitle, candidates.en.old.printed_title);
assert.equal(candidates.en.current.title, titleMapping.nativeTitle);
assert.equal(candidates.en.current.printed_title, titleMapping.nativePrintedTitle);

const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools');
const editionPin = pin(path.join(tools, 'edition.py'));
const assemblePin = pin(path.join(tools, 'assemble.py'));
const profilePin = pin(path.join(repo,
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'));
const profile = read(profilePin.path);
const pythonCode = [
  'import sys,json',
  'sys.path.insert(0,sys.argv[1])',
  'import edition',
  'data=json.load(sys.stdin)',
  'rows=[]',
  'for row in data["rows"]:',
  ' out={"locale":row["locale"],"index":row["index"],"sourceMathSignature":edition.math_signature(row["source"])}',
  ' for phase in ("before","after"):',
  '  block=row[phase]',
  '  canonical=edition.normalize_numbered_subparts(block["text"])',
  '  nums,refs=edition.prose_number_signature(canonical)',
  '  out[phase]={"mathSignature":edition.math_signature(canonical),"nonFormulaNumbers":nums,"references":{k:sorted(v) for k,v in refs.items()},"validateTextErrors":edition.validate_text(row["source"],block["text"],block.get("changes"),block.get("numeric_changes"),"lesson.prose["+str(row["index"])+"]",data["forbidden"],block.get("historical_entities"),None,block.get("notation_changes"))}',
  ' rows.append(out)',
  'identities={phase:edition.validate_identity_fields(data["sourceIdentity"],data[phase+"Identity"],("title","printed_title"),"lesson") for phase in ("before","after")}',
  'print(json.dumps({"blocks":rows,"englishTitleIdentity":identities},ensure_ascii=False))',
].join('\n');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const validation = spawnSync(python, ['-B', '-c', pythonCode, tools], {
  cwd: repo,
  encoding: 'utf8',
  input: JSON.stringify({ rows: textRows,
    forbidden: [...profile.forbidden_terms, ...profile.forbidden_person_names],
    sourceIdentity: rawSource,
    beforeIdentity: candidates.en.old,
    afterIdentity: candidates.en.current,
  }),
});
assert.equal(validation.status, 0, validation.stderr);
const proof = JSON.parse(validation.stdout);
for (const row of proof.blocks) {
  assert.deepEqual(row.after.validateTextErrors, []);
  assert.deepEqual(row.after.mathSignature, row.sourceMathSignature);
}
assert.deepEqual(proof.englishTitleIdentity.after, []);

const verdicts = [
  ['zh', '/prose/3/changes', 'METADATA-ONLY',
    'Declares existing caption spacing as layout. Caption text, figure 177 identity, labels and source refs do not change. No new scientific statement or translation.'],
  ['zh', '/prose/4/changes', 'METADATA-ONLY',
    'Declares existing caption spacing as layout. Caption text, figure 178 identity, labels and source refs do not change. No new scientific statement or translation.'],
  ['zh', '/prose/6/text', 'FRESH-AFFECTED-TEXT',
    'Only author-added 1), 2), 3) are removed. The same three rules remain in the same order; far-focus refraction, object-side-focus reversibility and nonzero real-lens translation neglected under the thin-lens approximation are unchanged. The source has no numeric list markers.'],
  ['zh', '/prose/10/text', 'FRESH-AFFECTED-TEXT',
    'B before SB restores source order and its arbitrary lens-point identity. SB then PQ retains the same parallel secondary axis through the optical center. Restored S occurrences identify the common emitting object point and that same point whose virtual image is S_1, not new objects. BC through C and the axial second ray retain the same two-ray construction. Accepted outgoing/image-side focal-plane and virtual-extension clauses are preserved.'],
  ['en', '/title', 'NATIVE-IDENTITY-ONLY',
    'Restores the exact Chinese source title required by native identity validation. Constructing Lens Images is retained unchanged as displayTitle in the frozen author report mapping; it denotes the same lesson, not a new topic. Display projection was not run.'],
  ['en', '/printed_title', 'NATIVE-IDENTITY-ONLY',
    'Restores exact source printed_title including 76. The prior English display translation 76. Constructing Lens Images remains unchanged in the frozen mapping. Number and lesson identity are preserved. Display projection was not run.'],
  ['en', '/prose/6/text', 'FRESH-AFFECTED-TEXT',
    'Only author-added 1), 2), 3) are removed, exactly matching the Chinese delta. Every optical rule, near/far distinction and approximation remains unchanged; the source has no numeric list markers.'],
  ['en', '/prose/7/text', 'FRESH-AFFECTED-TEXT',
    'The sole changed sentence names optical center O before ray AOA_1, matching source token order, and retains arrival at A_1. O is still the center and AOA_1 the same ray. Chinese prose7 is unchanged; both describe the identical optical path. The source-backed numbered enumeration here remains unchanged.'],
  ['en', '/prose/10/text', 'FRESH-AFFECTED-TEXT',
    'The same arbitrary B, arriving SB, parallel SB/PQ secondary-axis construction, emitting S and virtual image of S at S_1 correspond to the changed Chinese phrases and the source. Repeated S restores the same source-point identity rather than adding another object. Accepted image-side focal-plane and virtual-ray meaning remains unchanged; no guessed distances, scale or actual backward propagation is added.'],
].map(([locale, pointer, kind, rationale]) => ({
  locale, pointer, kind, SCI: 'PASS', ZHEN: 'PASS',
  sameOpticalMeaning: true, sourceMathLabelIdentitiesPreserved: true, rationale,
}));
assert.equal(verdicts.length, 9);
for (const locale of ['zh', 'en']) {
  assert.deepEqual(verdicts.filter(row => row.locale === locale).map(row => row.pointer),
    expectedPointers[locale]);
}

for (const row of inputs.values()) {
  assert.equal(sha(row.path), row.sha256, 'Input changed during bounded review');
  assert.equal(bind(row.path).mode, row.mode, 'Input mode changed during bounded review');
}
const status = 'FIRST-NATIVE-CONTRACT-AFFECTED-SCI-ZHEN-PASS';
const report = {
  schema: 'd628/n76-first-native-contract-affected-review@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76', batch: 'd628',
  ownedRoot: own, recordedAtUTC: new Date().toISOString(), status,
  role: 'Single short-lived independent text-only reviewer; latest human resume active.',
  reviewKind: 'First native-contract affected review, not a second whole-lesson review.',
  SCI: 'PASS', ZHEN: 'PASS', blockingList: [],
  scope: { actualChangedPointersOnly: true, textPointerCount: 5,
    metadataPointerCount: 2, nativeIdentityPointerCount: 2,
    wholeLessonReReview: false, candidatesModified: false },
  frozenInputVerification: { status: 'PASS', authorReport: authorReportPin,
    authorFreeze: authorFreezePin, allFrozenFilesMatch: true,
    producer: authorProducerPin,
    producerModeNote: 'Producer script is hash-bound but mode 0644; only author-freeze.files, candidates and reports are required frozen. No input mode was changed.' },
  affectedPointerVerdicts: verdicts,
  deltas,
  currentEditionContractProof: {
    status: 'PASS', method: 'Direct current edition.math_signature/validate_text on affected blocks only, using the actual complete modern-us-neutral forbidden-term profile. No math corrections or notation aliases supplied.',
    executable: python, argv: ['-B', '-c', pythonCode, tools],
    pythonExitCode: validation.status, stderr: validation.stderr,
    edition: editionPin, assemble: assemblePin, profile: profilePin,
    validatorsModified: false, validatorsWeakened: false,
    nativeAdaptFinalizeRun: false, ...proof,
  },
  bilingualAffectedCorrespondence: {
    status: 'PASS',
    prose6: 'Both locales remove only the same three added list prefixes, preserving all accepted prose.',
    prose7: 'Only the English sentence order changes; O, AOA_1 and A_1 retain the source and unchanged Chinese identities.',
    prose10: 'Both locales restore B/SB/SB/PQ/F/C/BC/C/S/S/S_1 in source order; the same secondary-axis, lens-point, emitting-point and virtual-image roles remain. No numerical or optical relationship changes.',
    titles: { mapping: titleMapping, mappingMatchesOriginalDisplayTranslations: true,
      nativeIdentityMatchesSource: true, displayProjectionVerified: false },
  },
  unchangedSourceSnapshots: { status: 'PASS-BYTE-BINDINGS-ONLY',
    snapshots: sourceSnapshots, embeddedSourceMatchesFrozenRawLesson: true,
    bothCandidateSourcesUnchangedFromD597: true,
    changedSourceTextRefsAndIdentitiesUnchanged: true,
    sourceWholePageReReview: false, sourceMutation: false },
  r08Reuse: { status: 'D598-ACCEPTED-R08-REUSED-NOT-RE-REVIEWED',
    acceptedSCI: 'PASS', acceptedZHEN: 'PASS',
    report: reuseReportPin, freeze: reuseFreezePin,
    acceptedEvidence: bind(path.join(reusedRoot, 'affected-r08-evidence.json')),
    sourceBoundRequirement: { file: requirementPin, excerpt: requirement },
    immutableCriterion: { file: criterionPin, excerpt: criterion },
    preservedClauses,
    firstHOLD: { finding: firstHold.finding, originalStatus: 'HOLD',
      report: bind(firstHold.original_report.path),
      findings: bind(firstHold.first_findings.path),
      retainedUnchanged0444: true, supersededOrDeleted: false,
      historyOnlyNotCurrentAffectedVerdict: true },
    wholesaleR08ReviewCount: 0,
    otherAcceptedRequirementsNotReReviewed: true,
  },
  prose6SourceRequirement: { file: baselinePin, excerpt: specialRaysRequirement },
  inputs: [...inputs.values()],
  constraints: { imageOpens: 0, imagesOpened: [], networkCalls: 0, DBCalls: 0,
    publishCalls: 0, branchOrWorktreeCreated: false, newModelSelected: false,
    figureReReviews: 0, newFigureRenders: 0, candidatesModified: false,
    completeCard: false, nativeAttempt: false, oldBudgetReset: false,
    parentImageCount: 24, newParentImages: 0, FIG: 'NOT-REVIEWED',
    DISPLAY: 'NOT-RUN', DBMergeDeploy: false },
  terminal: { boundedReportComplete: true, permanentWorker: false,
    furtherWorkDispatched: false, reviewOutputsFrozen0444: true },
};
const immutableWrite = (name, value) => {
  const output = path.join(own, name);
  assert.equal(path.dirname(output), own);
  fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
  fs.chmodSync(output, 0o444);
  return bind(output);
};
fs.chmodSync(script, 0o444);
const reportPin = immutableWrite('report.json', report);
const freezePin = immutableWrite('review-freeze.json', {
  schema: 'd628/n76-first-native-contract-affected-review-freeze@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76', batch: 'd628', status,
  ownedRoot: own, SCI: 'PASS', ZHEN: 'PASS', imageOpens: 0,
  files: [reportPin, bind(script)],
  inputPins: [...inputs.values()],
  self: { path: path.join(own, 'review-freeze.json'), mode: '0444',
    sha256Policy: 'Returned separately; not self-referential.' },
  boundedBatchEnded: true, completeCard: false,
});
assert.equal(reportPin.mode, '0444');
assert.equal(freezePin.mode, '0444');
console.log(JSON.stringify({ status, report: reportPin, freeze: freezePin }));
