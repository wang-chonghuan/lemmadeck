import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const out = path.dirname(fileURLToPath(import.meta.url))
const candidate = path.join(ticket, 'tmp/d919-n88-three-field-repair')
const review = path.join(ticket, 'tmp/d920-n88-first-independent-text-review')
const first = path.join(ticket, 'tmp/d907-n88-first-bilingual-text-author')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const status = 'AUTHOR-AFFECTED-NATIVE-PASS-INDEPENDENT-AFFECTED-REVIEW-PENDING'
assert.equal(process.cwd(), repo)
assert.equal(out, path.join(ticket, 'tmp/d928-n88-two-finding-repair'))

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (name, value) => {
  const file = path.join(out, name)
  assert.ok(file.startsWith(out + path.sep))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const specs = [
  {
    locale: 'zh', index: 2, finding: 'd920-F02',
    before: '图中的弧线表示波面，不是许多根可以抓住的细光线。',
    after: '图中的弧线表示波面的截面，波面是在同一时刻相位相同的位置组成的面，不是许多根细光线。',
  },
  {
    locale: 'en', index: 2, finding: 'd920-F02',
    before: 'The curved lines in the diagram represent wavefronts, not many separate thin rays.',
    after: 'The curved lines show sections of wavefronts, surfaces whose points are at the same phase at one instant, not many separate thin rays.',
  },
  {
    locale: 'en', index: 17, finding: 'd920-F01',
    before: 'how much light is collected',
    after: 'the range of angles over which light is collected',
  },
]

if (process.argv[2] === 'prepare') {
  const required = [
    [path.join(candidate, 'report.json'), 'c26eccbd54526a28a6e079fa1f9346ff597ba2363fe0867eae48e10bcae2a312'],
    [path.join(review, 'report.json'), '3cbff007125aeec361fb0c7700f742bd802bf2ec450c59d26c553fb2bb6459b8'],
    [path.join(review, 'findings.json'), '636333783463eae6fe104a3e63b8af5fd50501de4b55640601f50ae505e99363'],
  ]
  for (const [file, expected] of required) assert.equal(sha(file), expected)
  const base = read(path.join(candidate, 'report.json'))
  const findings = read(path.join(review, 'findings.json'))
  assert.equal(findings.findingCount, 2)
  assert.deepEqual(findings.findings.map(f => f.id), ['d920-F01', 'd920-F02'])
  assert.equal(findings.candidateReportSha256, required[0][1])
  assert.equal(findings.findings[0].minimalRecommendation.replace, specs[2].before)
  assert.equal(findings.findings[0].minimalRecommendation.with, specs[2].after)
  assert.equal(read(path.join(review, 'freeze.json')).artifacts[0].sha256, required[1][1])
  for (const locale of ['zh', 'en']) {
    for (const kind of ['lesson', 'exercises']) {
      const source = path.join(candidate, locale, `${kind}.template.json`)
      assert.equal(sha(source), base.candidates[locale][kind].sha256)
      const target = path.join(out, locale, `${kind}.template.json`)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(target, 0o644)
      assert.equal(sha(target), base.candidates[locale][kind].sha256)
    }
  }
  const historical = read(path.join(first, 'report.json'))
  const inputs = [
    ...required.map(([file]) => file),
    path.join(candidate, 'freeze.json'), path.join(candidate, 'changed-fields.json'),
    path.join(candidate, 'affected-failure.json'), path.join(candidate, 'FIRST-failed-check-script.mjs'),
    path.join(candidate, 'native/affected-text.receipt.json'),
    path.join(candidate, 'native/recovery-affected-text.receipt.json'),
    ...['zh', 'en'].flatMap(locale => [
      path.join(candidate, locale, 'lesson.template.json'),
      path.join(candidate, locale, 'exercises.template.json'),
      path.join(candidate, `native/recovery-affected-flow-${locale}.receipt.json`),
    ]),
    path.join(review, 'freeze.json'), path.join(review, 'usage.json'),
    path.join(first, 'report.json'), historical.nativeTextEvidence.path, historical.usage.path,
    historical.inheritedHold.evidence.path,
    path.join(repo, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
    ...['edition.py', 'mathcheck.py', 'prose_flow.mjs', 'htmlfrag.js'].map(name => path.join(tools, name)),
    path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
  ].map(bind)
  save('prepared.json', {
    ticket: 'STEMROBIN-181', successor: 'successor181-3', card: 'phy10-c2-s3-n88',
    status: 'FRESH-WRITABLE-COPIES-READY-FOR-APPLY-PATCH', onlyWriteRoot: out,
    inputs, exactAuthorizedReplacements: specs, imagesLoaded: 0, paidCalls: 0,
    productionResumeRead: true, inputVerificationPasses: 1,
  })
  console.log('Prepared four byte-identical writable copies; required input hashes match.')
} else if (process.argv[2] === 'check') {
  const prepared = read(path.join(out, 'prepared.json'))
  const baseReport = read(path.join(candidate, 'report.json'))
  const reviewReport = read(path.join(review, 'report.json'))
  const firstReport = read(path.join(first, 'report.json'))
  const changes = []
  const paragraphChanges = []
  const current = {}
  for (const locale of ['zh', 'en']) {
    const original = read(path.join(candidate, locale, 'lesson.template.json'))
    const revised = read(path.join(out, locale, 'lesson.template.json'))
    const restored = structuredClone(revised)
    let expectedBytes = fs.readFileSync(path.join(candidate, locale, 'lesson.template.json'), 'utf8')
    for (const spec of specs.filter(spec => spec.locale === locale)) {
      const oldBlock = original.prose[spec.index]
      const newBlock = revised.prose[spec.index]
      assert.equal(oldBlock.text.split(spec.before).length, 2, 'Unique replacement required')
      assert.equal(newBlock.text, oldBlock.text.replace(spec.before, spec.after))
      assert.ok(newBlock.changes.includes('explanation'))
      restored.prose[spec.index].text = oldBlock.text
      expectedBytes = expectedBytes.replace(JSON.stringify(oldBlock.text), JSON.stringify(newBlock.text))
      const oldParagraphs = oldBlock.text.split('\n\n')
      const newParagraphs = newBlock.text.split('\n\n')
      assert.equal(newParagraphs.length, oldParagraphs.length)
      let changedParagraphs = 0
      for (let i = 0; i < oldParagraphs.length; i++) {
        assert.equal(newParagraphs[i], oldParagraphs[i].replace(spec.before, spec.after))
        assert.equal(newParagraphs[i].split('\n').length, oldParagraphs[i].split('\n').length)
        if (newParagraphs[i] !== oldParagraphs[i]) {
          changedParagraphs++
          paragraphChanges.push({
            locale, pointer: `/prose/${spec.index}/text`, paragraphInBlock: i,
            before: oldParagraphs[i], after: newParagraphs[i],
          })
        }
      }
      assert.equal(changedParagraphs, 1)
      changes.push({
        locale, pointer: `/prose/${spec.index}/text`, finding: spec.finding,
        sourceRefs: newBlock.source_refs, before: oldBlock.text, after: newBlock.text,
        replacement: { before: spec.before, after: spec.after },
        declarationAlreadyPresent: 'explanation',
        singleSentenceAtExistingPosition: spec.index === 2,
        paragraphCountBefore: oldParagraphs.length, paragraphCountAfter: newParagraphs.length,
      })
    }
    assert.deepEqual(restored, original, 'No other JSON field may change')
    assert.equal(fs.readFileSync(path.join(out, locale, 'lesson.template.json'), 'utf8'), expectedBytes,
      'No other bytes or formatting may change')
    assert.deepEqual(revised.section_breaks, original.section_breaks)
    const exercise = read(path.join(out, locale, 'exercises.template.json'))
    assert.equal(sha(path.join(out, locale, 'exercises.template.json')),
      baseReport.candidates[locale].exercises.sha256)
    assert.equal(exercise.count, 0)
    assert.deepEqual(exercise.exercises, [])
    assert.equal(revised.exercise_count, 0)
    current[locale] = revised
  }
  assert.equal(changes.length, 3)
  assert.equal(paragraphChanges.length, 3)
  const startedAt = new Date().toISOString()
  const nativeCalls = []
  save('check-started.json', {
    stage: 'AFFECTED-ONLY-ONCE', startedAt, changedFields: changes.map(c => `${c.locale}${c.pointer}`),
    expectedNativeProcesses: 3, proseFlowPerLocale: 1, paidCalls: 0, imagesLoaded: 0,
  })
  const native = (name, executable, args, input) => {
    const began = new Date().toISOString()
    const result = spawnSync(executable, args, {
      cwd: repo, input, encoding: 'utf8', timeout: 60000, maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(out, 'runtime-tmp') },
    })
    const receipt = save(`native/${name}.receipt.json`, {
      command: [executable, ...args], cwd: repo, startedAt: began, finishedAt: new Date().toISOString(),
      exit: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
      error: result.error?.message ?? null, affectedOnly: true,
    })
    nativeCalls.push({ name, receipt, exit: result.status })
    assert.equal(result.status, 0, result.stderr || result.stdout)
    return JSON.parse(result.stdout)
  }
  fs.mkdirSync(path.join(out, 'runtime-tmp'), { recursive: true })
  try {
    const code = `
import json, re, sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
import edition as e
import mathcheck
p = json.load(sys.stdin)
profile = e.load(Path(p["profile"]))
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
results = []
assert len(p["affected"]) == 3
for item in p["affected"]:
    b, old = item["current"], item["previous"]
    label = f'{item["locale"]}.prose[{item["index"]}]'
    errors = e.validate_text(b["source_text"], b["text"], b["changes"], b["numeric_changes"],
        label, forbidden, b["historical_entities"], None, b.get("notation_changes"))
    delimiter_errors = mathcheck.check_delimiters(b["text"])
    math = lambda s: [m.group(0) for m in e.MATH.finditer(s)]
    numbers = lambda s: re.findall(r"\\d+(?:\\.\\d+)?", e.MATH.sub("", s))
    assert math(b["source_text"]) == math(old["text"]) == math(b["text"])
    assert numbers(b["source_text"]) == numbers(old["text"]) == numbers(b["text"])
    assert b["numeric_changes"] == []
    assert not errors and not delimiter_errors, errors + delimiter_errors
    results.append({"locale":item["locale"],"index":item["index"],"sourceRefs":b["source_refs"],
        "orderedMathTokens":math(b["text"]),"orderedNumericTokens":numbers(b["text"]),
        "validateTextErrors":errors,"delimiterErrors":delimiter_errors,"status":"PASS"})
print(json.dumps({"status":"PASS","affectedFields":results,"validateTextCalls":3,
    "delimiterCalls":3,"orderedMathComparisons":3,"orderedNumericComparisons":3}))
`
    const text = native('affected-text', python, ['-B', '-c', code, tools], JSON.stringify({
      profile: path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
      affected: specs.map(spec => ({
        locale: spec.locale, index: spec.index, current: current[spec.locale].prose[spec.index],
        previous: read(path.join(candidate, spec.locale, 'lesson.template.json')).prose[spec.index],
      })),
    }))
    const layout = {}
    for (const locale of ['zh', 'en']) {
      const flow = native(`prose-flow-${locale}`, process.execPath,
        [path.join(tools, 'prose_flow.mjs'), '--json', path.join(out, locale, 'lesson.template.json')])
      const previousFile = path.join(candidate, `native/recovery-affected-flow-${locale}.receipt.json`)
      const previous = JSON.parse(read(previousFile).stdout)
      assert.equal(flow.paragraphs.length, previous.paragraphs.length)
      const actualChangedParagraphs = []
      for (let i = 0; i < flow.paragraphs.length; i++) {
        const before = previous.paragraphs[i]
        const after = flow.paragraphs[i]
        const expected = specs.filter(spec => spec.locale === locale && spec.index === before.blockIndex)
          .reduce((text, spec) => text.replace(spec.before, spec.after), before.text)
        assert.deepEqual(after, { ...before, text: expected }, 'Only intended paragraph strings change')
        if (before.text !== after.text) actualChangedParagraphs.push(after)
      }
      assert.equal(actualChangedParagraphs.length, locale === 'zh' ? 1 : 2)
      assert.deepEqual(flow.boundaries, previous.boundaries, 'Literal conceptual boundaries unchanged')
      assert.deepEqual(flow.resolvedBreaks, previous.resolvedBreaks)
      layout[locale] = {
        status: 'PASS', reusedPriorFlow: bind(previousFile),
        paragraphsBefore: previous.paragraphs.length, paragraphsAfter: flow.paragraphs.length,
        actualChangedParagraphs, exactLiteralBoundaries: flow.boundaries,
        resolvedBreaks: flow.resolvedBreaks, sectionBreaksUnchanged: true,
        normalizationNeeded: false, normalizationCalls: 0, layoutDependencyChanges: [],
      }
    }
    for (const input of prepared.inputs) assert.equal(sha(input.path), input.sha256, 'Read-only input changed')
    const changedFields = save('changed-fields.json', {
      schema: 'STEMROBIN-181/d928-two-finding-changed-fields@1',
      ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n88',
      candidateReport: bind(path.join(candidate, 'report.json')),
      firstIndependentFindings: bind(path.join(review, 'findings.json')),
      changedFieldCount: 3, changedParagraphCount: 3, changes, paragraphChanges,
      exactDiff: {
        onlyThreeTextFields: true, onlyThreeParagraphStrings: true,
        allOtherBytesAndFieldsUnchanged: true, sourceFirstMetadataUnchanged: true,
        sourceRefsEntityIdentityNumericAndMathOrderUnchanged: true,
        paragraphCountsLineCountsAndBoundariesUnchanged: true, sectionBreaksUnchanged: true,
        exercisesByteIdentical: true, zeroTasks: true,
      },
      layoutDependencyChanges: [],
    })
    const usage = save('usage.json', {
      schema: 'STEMROBIN-181/d928-author-affected-usage@1',
      ticket: 'STEMROBIN-181', successor: 'successor181-3', card: 'phy10-c2-s3-n88',
      stage: 'TWO-FINDING-THREE-FIELD-AUTHOR-REPAIR', startedAt, finishedAt: new Date().toISOString(),
      actualThisRun: {
        candidateCopies: 4, contentRepairRounds: 1, contentFieldEdits: 3, paragraphStringEdits: 3,
        nativeProcesses: nativeCalls.length, successfulNativeProcesses: nativeCalls.filter(c => c.exit === 0).length,
        validateTextCalls: 3, delimiterCalls: 3, orderedMathComparisons: 3, orderedNumericComparisons: 3,
        proseFlowCalls: { zh: 1, en: 1 }, normalizeTextLayoutCalls: 0, katexChecks: 0,
        imagesLoaded: 0, newImages: 0, imageBatches: 0, paidCalls: 0,
        independentReviewPasses: 0, tokens: null, costUsd: null,
      },
      inheritedUsageNotReset: {
        FIRSTAuthor: { evidence: bind(firstReport.usage.path), actualUsage: read(firstReport.usage.path) },
        d919: { evidence: bind(path.join(candidate, 'report.json')), nativeCalls: baseReport.nativeCalls,
          successfulNativeCalls: baseReport.successfulNativeCalls, firstCheckCalls: baseReport.firstCheckCalls,
          recoveryCalls: baseReport.recoveryCalls, usage: baseReport.usage },
        FIRSTIndependentReview: { evidence: bind(path.join(review, 'usage.json')),
          actualUsage: reviewReport.actualUsage, reviewPasses: reviewReport.reviewPasses },
      },
      nativeCalls,
      forbiddenCalls: {
        fullSourceOrTextReview: 0, assembly: 0, adaptFinalize: 0, render: 0, testsBuild: 0,
        canonicalPromotionIndexMeter: 0, git: 0, database: 0, publisher: 0, deploy: 0,
        backendNetworkBrowserSupervisorOtherChatNewBranchWorktree: 0,
      },
    })
    const candidates = Object.fromEntries(['zh', 'en'].map(locale => [locale, {
      lesson: bind(path.join(out, locale, 'lesson.template.json')),
      exercises: bind(path.join(out, locale, 'exercises.template.json')), writableMode: '0644',
    }]))
    const report = save('report.json', {
      schema: 'STEMROBIN-181/d928-two-finding-author-affected-repair@1',
      ticket: 'STEMROBIN-181', successor: 'successor181-3', card: 'phy10-c2-s3-n88',
      date: '2026-11-19', status, authorOnly: true, independentApproval: false,
      offlineOnly: true, cwd: repo, onlyWriteRoot: out,
      currentInputCandidateReport: bind(path.join(candidate, 'report.json')),
      FIRSTIndependentReview: bind(path.join(review, 'report.json')),
      FIRSTIndependentFindings: bind(path.join(review, 'findings.json')),
      FIRSTIndependentFreeze: bind(path.join(review, 'freeze.json')),
      findingsAddressedByAuthor: ['d920-F01', 'd920-F02'],
      affectedIndependentReview: 'PENDING-NOT-SELF-APPROVED',
      changedFields, candidates, nativeText: text, nativeLayout: layout, usage, nativeCalls,
      reusedUnaffectedPASS: {
        candidateEvidence: bind(path.join(candidate, 'report.json')),
        reviewEvidence: bind(path.join(review, 'report.json')),
        firstAuthorTextEvidence: bind(firstReport.nativeTextEvidence.path),
        allUnchangedSourceCoverageOrderIdentityMathNumericAndTextChecks: 'REUSED-NOT-RERUN',
        unaffectedIndependentReviewStatements: 'REUSED-WITHIN-ORIGINAL-SCOPE-NOT-NEW-APPROVAL',
        changedFindingsAreStillPendingIndependentAffectedReview: true,
        unchangedKaTeXTokens: 'PRIOR-EVIDENCE-REUSED-NO-REPEATED-CHECK',
      },
      firstFailuresPreserved: {
        FIRSTAuthor: { report: bind(path.join(first, 'report.json')),
          evidence: bind(firstReport.nativeTextEvidence.path), errors: firstReport.nativeTextErrors },
        d919ExecutionFailure: baseReport.executionFailure,
        d919FIRSTFailedScript: bind(path.join(candidate, 'FIRST-failed-check-script.mjs')),
        d919FIRSTFailedReceipt: bind(path.join(candidate, 'native/affected-text.receipt.json')),
        FIRSTIndependentReview: { findings: bind(path.join(review, 'findings.json')),
          status: reviewReport.status, independentApproval: false },
        overwrittenOrReset: false, recoveryCountedAsApproval: false,
      },
      originalQuestions: 0, authoredExercisesAnswersChoicesReadChecksPractice: 0,
      historicalSource235HelperBoundary: { ...firstReport.inheritedHold, waived: false },
      modernFiguresAndPortraitApproval: 'PENDING-NOT-REVIEWED',
      sourceTranscriptionApproval: false, externalFactVerification: false,
      completeCard: false, fullcardOrDisplayPass: false,
      canonicalPromotionIndexMeterGitDatabasePublisherDeployTestsBuild: false,
      backendSupervisorOtherChatBrowserNewBranchWorktree: false,
      inputsUnchanged: true, sourceFirstMetadataUnchanged: true, layoutDependencyChanges: [],
      freezeCount: 1,
      stop: 'Bounded text repair only. Independent affected review pending; no promotion or dependent stages.',
    })
    const artifacts = [
      report, changedFields, usage, bind(path.join(out, 'prepared.json')),
      bind(path.join(out, 'check-started.json')), bind(fileURLToPath(import.meta.url)),
      ...Object.values(candidates).flatMap(c => [c.lesson, c.exercises]),
      ...nativeCalls.map(c => c.receipt),
    ]
    const freeze = save('freeze.json', {
      schema: 'STEMROBIN-181/d928-two-finding-author-freeze@1',
      ticket: 'STEMROBIN-181', successor: 'successor181-3', card: 'phy10-c2-s3-n88',
      status, freezeCount: 1, artifacts, inputs: prepared.inputs, independentApproval: false,
      imagesLoaded: 0, paidCalls: 0, tokens: null, costUsd: null,
      completeCard: false, fullcardOrDisplayPass: false,
      historicalSource235HelperBoundaryHOLDWaived: false,
      meaning: 'Hash-bound author repair only; prior candidates/review/failures unchanged. No independent affected approval.',
    })
    console.log(JSON.stringify({ status, changedFields, report, usage, freeze, candidates }, null, 2))
  } catch (error) {
    save('affected-failure.json', {
      status: 'AUTHOR-AFFECTED-NATIVE-FAIL-DEPENDENT-STAGES-STOPPED',
      error: error.stack, nativeCalls, imagesLoaded: 0, paidCalls: 0,
      firstFailuresPreserved: true, independentApproval: false,
    })
    throw error
  }
} else {
  throw new Error('Choose prepare or check; each stage is single-use.')
}
