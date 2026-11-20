import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const output = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d183-n21-text-author')
const work = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d183/work/adapt/10p')
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const sourcePath = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s3-n21/lesson.json')
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, sha256: hash(bytes), bytes: bytes.length }
}
const template = (edition, name = 'lesson.template.json') =>
  path.join(work, edition, 'lessons/phy10-c1-s3-n21', name)
const createJSON = (file, value) => {
  assert.ok(file.startsWith(`${output}/`))
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const originalInputs = read(path.join(output, 'input-bindings.json'))
const notes = read(path.join(output, 'author-notes.json'))
const source = read(sourcePath)
const require = createRequire(import.meta.url)
const parserPath = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js')
const { proseOutline, sectionBreakIndices } = require(parserPath)
const maths = (text) => [...text.matchAll(/\$[^$]+\$/g)].map((match) => match[0])
const digits = (text) => text.match(/[0-9]+(?:\.[0-9]+)?/g) ?? []
const orderedSubset = (expected, actual) => {
  let next = 0
  for (const token of actual) {
    if (next < expected.length && token === expected[next]) next += 1
  }
  return next === expected.length
}
const withoutMath = (text) => text.replace(/\$[^$]+\$/g, '')
const counters = {
  repairsUsed: 0,
  imagesOpened: 0,
  imageBytesRead: 0,
  screenshots: 0,
  browsers: 0,
  networkCalls: 0,
  paidCalls: 0,
  modelAPICalls: 0,
  sourceReviewReplays: 0,
  setupReplays: 0,
  freshnessReplays: 0,
  grillReplays: 0,
  proseFlowCalls: 2,
  nativeFinalizers: 0,
  nativeRenders: 0,
  independentReviews: 0,
  databaseAccesses: 0,
  publisherCalls: 0,
  gitCalls: 0,
  otherChatMessages: 0,
  courseApprovals: 0,
}

try {
  assert.equal(source.prose.length, 21)
  assert.equal(source.exercise_count, 0)
  assert.equal(notes.perBlockSemanticCoverage.length, 21)
  const changedWorkingPaths = editions.map((edition) => template(edition))
  const unchangedInputs = originalInputs.bindings.filter((entry) => !changedWorkingPaths.includes(entry.path))
  const currentUnchangedInputs = unchangedInputs.map((entry) => {
    const current = binding(entry.path)
    assert.equal(current.sha256, entry.sha256, `Unchanged input hash: ${entry.path}`)
    assert.equal(current.bytes, entry.bytes, `Unchanged input bytes: ${entry.path}`)
    return current
  })
  const mechanical = {}
  const coverage = notes.perBlockSemanticCoverage.map((entry) => ({
    ...entry,
    sourceRefs: source.prose[entry.blockPosition - 1].source_refs,
    kind: source.prose[entry.blockPosition - 1].kind,
    id: source.prose[entry.blockPosition - 1].id,
    printedPage: source.prose[entry.blockPosition - 1].printed_page,
    coverageStatus: {
      ZH: source.prose[entry.blockPosition - 1].kind === 'fig'
        ? 'IMMUTABLE_SLOT_RETAINED_FIGURE_UNAPPROVED'
        : 'FIRST_AUTHORED_AWAITING_INDEPENDENT_REVIEW',
      EN: source.prose[entry.blockPosition - 1].kind === 'fig'
        ? 'IMMUTABLE_SLOT_RETAINED_FIGURE_UNAPPROVED'
        : 'FIRST_AUTHORED_AWAITING_INDEPENDENT_REVIEW',
    },
    mechanicalPreservationEvidence: {},
  }))
  const flowBindings = []
  for (const edition of editions) {
    const lessonPath = template(edition)
    const lesson = read(lessonPath)
    const original = originalInputs.originalWorkingLessons[edition]
    const language = edition.endsWith('-en') ? 'EN' : 'ZH'
    assert.equal(lesson.prose.length, 21)
    assert.equal(lesson.edition, edition)
    assert.equal(lesson.status, 'draft')
    assert.equal(lesson.exercise_count, 0)
    assert.deepEqual(lesson.source, original.source)
    assert.deepEqual(lesson.source.data, source)
    assert.equal(lesson.source.sha256, binding(sourcePath).sha256)
    assert.deepEqual(lesson.figures, original.figures)
    assert.deepEqual(lesson.errata, original.errata)
    assert.deepEqual(lesson.errata, [])
    const mutableTop = new Set(['prose', 'section_breaks'])
    if (language === 'EN') {
      for (const key of ['chapter', 'section', 'title', 'printed_title']) mutableTop.add(key)
    }
    assert.deepEqual(Object.keys(lesson).sort(), Object.keys(original).sort())
    for (const key of Object.keys(original)) {
      if (!mutableTop.has(key)) assert.deepEqual(lesson[key], original[key], `${edition} top-level ${key}`)
    }
    const blocks = []
    lesson.prose.forEach((block, index) => {
      const raw = source.prose[index]
      const old = original.prose[index]
      assert.deepEqual(Object.keys(block).sort(), Object.keys(old).sort())
      const mutableBlock = new Set(['text', 'changes', 'historical_entities'])
      if (language === 'EN' && raw.kind === 'cap') mutableBlock.add('label')
      for (const key of Object.keys(old)) {
        if (!mutableBlock.has(key)) assert.deepEqual(block[key], old[key], `${edition} block ${index + 1} ${key}`)
      }
      assert.deepEqual(block.source_refs, raw.source_refs)
      assert.equal(block.source_text, raw.text)
      assert.deepEqual(block.numeric_changes, [])
      assert.ok(!block.changes.includes('math-correction'))
      assert.ok(!block.changes.includes('context-number'))
      if (raw.kind === 'fig') assert.deepEqual(block, old)
      if (language === 'EN' && raw.kind !== 'fig') {
        assert.ok(block.changes.includes('translation'))
        assert.ok(!/[\u3400-\u9fff]/u.test(block.text), `${edition} block ${index + 1} contains untranslated Chinese`)
      }
      assert.ok(!/<\/?span\b/i.test(block.text))
      assert.ok(!/[\u0400-\u04ff]/u.test(withoutMath(block.text)), 'Cyrillic outside exact formulas')
      const sourceMath = maths(raw.text)
      const authoredMath = maths(block.text)
      assert.ok(orderedSubset(sourceMath, authoredMath), `${edition} block ${index + 1}: ordered source math retained`)
      const sourceEquations = sourceMath.filter((token) => token.includes('='))
      const authoredEquations = authoredMath.filter((token) => token.includes('='))
      assert.deepEqual(authoredEquations, sourceEquations, `${edition} block ${index + 1}: exact equations`)
      assert.deepEqual(digits(block.text), digits(raw.text), `${edition} block ${index + 1}: exact ordered numbers`)
      assert.equal((block.text.match(/_м/g) ?? []).length, (raw.text.match(/_м/g) ?? []).length)
      for (const entity of block.historical_entities) {
        assert.ok(block.text.includes(entity.term))
        assert.ok(raw.text.includes(entity.source_term ?? entity.term))
        assert.ok(entity.reason.length > 0)
      }
      const retained = [...sourceMath]
      const addedSymbolMentions = authoredMath.filter((token) => {
        const found = retained.indexOf(token)
        if (found === -1) return true
        retained.splice(found, 1)
        return false
      })
      assert.ok(addedSymbolMentions.every((token) => token === '$\\omega$'), 'Only an explanatory angular-frequency symbol mention is added')
      const result = {
        sourceRefs: block.source_refs,
        kind: block.kind,
        id: block.id,
        printedPage: block.printed_page,
        sourceTextSHA256: hash(raw.text),
        authoredTextSHA256: hash(block.text),
        exactOrderedSourceMathTokens: sourceMath,
        exactOrderedAuthoredMathTokens: authoredMath,
        exactOrderedEquations: sourceEquations,
        addedExplanatorySymbolMentions: addedSymbolMentions,
        exactOrderedNumericTokens: digits(raw.text),
        bareCyrillicAmplitudeSubscriptsRetained: (block.text.match(/_м/g) ?? []).length,
        sourceRefsUnchanged: true,
        sourceTextUnchanged: true,
        numericChanges: block.numeric_changes,
        historicalEntities: block.historical_entities,
        result: 'MECHANICAL_BINDING_PRESERVATION_ONLY_NOT_CONTENT_APPROVAL',
      }
      blocks.push(result)
      coverage[index].mechanicalPreservationEvidence[language] = result
    })
    const footnote = lesson.prose.find((block) => block.source_refs.includes('p0060#14'))
    assert.equal(footnote.label, 'footnote')
    assert.ok(footnote.text.includes('①'))
    assert.ok(footnote.text.includes('$\\frac{\\pi}{2}$'))
    assert.equal(lesson.prose.at(-1).source_refs[0], 'p0060#8')
    assert.ok(!lesson.prose.some((block) => block.source_refs.includes('p0060#9')))
    const exercises = read(template(edition, 'exercises.template.json'))
    assert.equal(exercises.count, 0)
    assert.deepEqual(exercises.exercises, [])
    const receiptPath = path.join(output, `prose-flow-${edition}.json`)
    const receipt = read(receiptPath)
    assert.equal(receipt.cwd, cwd)
    assert.equal(receipt.exitCode, 0)
    assert.equal(receipt.error, null)
    assert.equal(receipt.stderr, '')
    const actualBoundaries = receipt.stdout.split('\n')
      .filter((line) => line.startsWith('    break: '))
      .map((line) => JSON.parse(line.slice('    break: '.length)))
    assert.equal(lesson.section_breaks.length, notes.sectionBreakConcepts.length)
    for (const boundary of lesson.section_breaks) {
      assert.deepEqual(Object.keys(boundary).sort(), ['after', 'before'])
      assert.ok(actualBoundaries.some((candidate) => candidate.before === boundary.before && candidate.after === boundary.after))
    }
    const resolvedBreaks = sectionBreakIndices(lesson.prose, lesson.section_breaks)
    assert.equal(resolvedBreaks.length, 3)
    flowBindings.push(binding(receiptPath))
    mechanical[edition] = {
      finalLesson: binding(lessonPath),
      sourceProseBlocks: source.prose.length,
      retainedProseBlocks: lesson.prose.length,
      exercises: 0,
      equationsUnchanged: true,
      orderedSourceNumbersUnchanged: true,
      bareCyrillicSubscriptsUnchanged: true,
      sourceRefsAndSourceSnapshotUnchanged: true,
      entireFigureSlotsAndTopLevelFigureMetadataUnchanged: true,
      sectionBreaks: {
        evidence: binding(receiptPath),
        selection: 'COPIED_ACTUAL_PROSE_FLOW_BOUNDARY_OBJECTS_FROM_FULL_FINAL_PROSE',
        paragraphs: proseOutline(lesson.prose),
        parserResolvedIndices: resolvedBreaks,
        authoredBoundaryObjects: lesson.section_breaks,
        concepts: notes.sectionBreakConcepts,
        manualParagraphIndicesUsed: false,
      },
      blocks,
    }
  }
  const mechanicalPath = path.join(output, 'mechanical-evidence.json')
  createJSON(mechanicalPath, {
    schema: 'STEMROBIN-181/D183-text-only-mechanical-evidence@1',
    cwd,
    status: 'MECHANICAL_PRESERVATION_CHECKS_SATISFIED_NOT_INDEPENDENT_REVIEW',
    editions: mechanical,
    currentUnchangedInputs,
    imagesOpened: 0,
    repairsUsed: 0,
    actualToolFailures: [],
    nativeFinalizationOrRender: false,
  })
  const frozenBindings = []
  for (const edition of editions) {
    const destination = path.join(output, 'frozen', edition)
    fs.mkdirSync(destination, { recursive: true })
    for (const name of ['lesson.template.json', 'exercises.template.json']) {
      const input = template(edition, name)
      const frozen = path.join(destination, name)
      fs.copyFileSync(input, frozen, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(frozen, 0o444)
      const before = binding(input)
      const after = binding(frozen)
      assert.equal(after.sha256, before.sha256)
      assert.equal(after.bytes, before.bytes)
      assert.equal(fs.statSync(frozen).mode & 0o777, 0o444)
      frozenBindings.push({ ...after, mode: '0444', copiedFrom: before })
    }
  }
  const contentOutputs = [
    ...editions.map((edition) => binding(template(edition))),
    ...frozenBindings,
  ]
  const evidenceOutputs = [
    'input-bindings.json', 'author-notes.json', 'receipts.mjs',
    'freeze-author.mjs', 'mechanical-evidence.json',
  ].map((name) => binding(path.join(output, name))).concat(flowBindings)
  const reportPath = path.join(output, 'report.json')
  const report = {
    schema: 'STEMROBIN-181/D183-first-bilingual-text-author-report@1',
    ticket: 'STEMROBIN-181',
    batch: 'D183',
    authorRole: 'FIRST_GENUINE_N21_BILINGUAL_TEXT_AUTHOR_ONLY',
    date: '2026-11-20',
    cwd,
    book: '10p',
    lesson: 'phy10-c1-s3-n21',
    status: 'FIRST_BILINGUAL_TEXT_AUTHOR_FROZEN_PENDING_PARENT_INDEPENDENT_REVIEWS',
    authorization: {
      scope: 'Two editable lesson templates and this output directory only.',
      setupFreshnessGrillReplay: false,
      priorN21TextAuthorOrReview: 'NONE_FOUND_IN_PREPARED_ASSIGNMENT; no author/review reused',
      firstIndependentSCI_ZH_ENReviewOwner: 'parent',
      zeroImageOpens: true,
    },
    prepared: binding(path.join(output, 'prepared.json')),
    perBlockSemanticCoverage: coverage,
    sourceQualifications: notes.sourceQualifications,
    boundary: read(path.join(output, 'prepared.json')).boundary,
    originalTasks: 0,
    retainedTasks: 0,
    exerciseTemplatesChanged: false,
    sourceProseBlocks: 21,
    retainedBlocksPerEdition: 21,
    repairsUsed: 0,
    imagesOpened: 0,
    actualToolFailures: [],
    actualToolFailuresPolicy: 'No tool call failed during this author run. Successful output truncation is not misclassified as a tool or content failure. Any later failure must remain new evidence, not overwrite this record.',
    counters,
    bindings: {
      originalInputs: originalInputs.bindings,
      currentUnchangedInputs,
      currentContentOutputs: contentOutputs,
      currentEvidenceOutputs: evidenceOutputs,
      inheritedSourceImages: originalInputs.inheritedSourceImageBindingsNotOpenedOrRehashed,
    },
    modernFigures: {
      pending: ['fig-32', 'fig-33'],
      imagesOpened: 0,
      imageBytesRead: 0,
      figureTemplatesChanged: false,
      figureSlotsChanged: false,
      approved: false,
      inheritedImageHashVerification: 'Prepared provenance only; images were not opened or rehashed.',
      immutableEnglishFigureLabels: 'Original Chinese binding labels in figure metadata and empty slots remain unchanged; separate caption prose is fully translated.',
    },
    sectionBreakPolicy: 'Three concept transitions per edition use actual prose_flow.mjs before/after objects. No paragraph indices were manually authored.',
    exactFormulaPolicy: 'Every source equation and ordered numeric token is retained; bare Cyrillic _м remains exact. Native syntax/finalization checks were not executed and no formula was normalized for them.',
    noNewErrata: true,
    noSourceChanges: true,
    noSourceScientificNumberChanges: true,
    noHandSpans: true,
    firstIndependentReviews: notes.unresolvedStages,
    approvalClaims: {
      independentSCI: false,
      independentZH: false,
      independentEN: false,
      figureApproval: false,
      courseApproval: false,
      completeCoursesAdded: 0,
      productAcceptance: false,
      formalHandoff: false,
      ticketClosure: false,
    },
    changedWorkingPaths,
    writtenOutputs: [
      ...evidenceOutputs.map((entry) => entry.path),
      ...frozenBindings.map((entry) => entry.path),
      reportPath,
      path.join(output, 'author-freeze.json'),
      path.join(output, 'final-bindings.json'),
    ],
    bindingPolicy: 'Report cannot hash itself. author-freeze.json binds this report and every preceding output; final-bindings.json seals report and author-freeze without a self-hash cycle.',
  }
  createJSON(reportPath, report)
  const freezePath = path.join(output, 'author-freeze.json')
  createJSON(freezePath, {
    schema: 'STEMROBIN-181/D183-first-author-freeze@1',
    ticket: 'STEMROBIN-181',
    batch: 'D183',
    book: '10p',
    lesson: 'phy10-c1-s3-n21',
    date: '2026-11-20',
    cwd,
    status: 'AUTHOR_BYTES_FROZEN_ONLY_FIRST_INDEPENDENT_REVIEWS_PENDING',
    originalInputs: originalInputs.bindings,
    currentUnchangedInputs,
    currentOutputs: [...contentOutputs, ...evidenceOutputs, binding(reportPath)],
    frozenCopies: frozenBindings,
    inheritedSourceImagesNotOpenedOrRehashed: originalInputs.inheritedSourceImageBindingsNotOpenedOrRehashed,
    sourceQualifications: notes.sourceQualifications,
    unresolvedStages: notes.unresolvedStages,
    repairsUsed: 0,
    imagesOpened: 0,
    actualToolFailures: [],
    counters,
    independentReview: false,
    figureApproval: false,
    courseCompletionOrApprovalClaim: false,
    productAcceptance: false,
    formalHandoff: false,
    parentCollectionRequiredBeforeFirstIndependentReview: true,
    immutableInputPermissionsChanged: false,
    readOnlyPolicy: 'Only the four new frozen lesson/exercise copies have mode 0444; original and working inputs are not chmod-ed.',
    hashCyclePolicy: 'This record is hashed externally by final-bindings.json, not by itself.',
  })
  const sealPath = path.join(output, 'final-bindings.json')
  createJSON(sealPath, {
    schema: 'STEMROBIN-181/D183-final-author-evidence-bindings@1',
    cwd,
    status: 'AUTHOR_ONLY_NO_REVIEW_OR_COURSE_APPROVAL',
    bindings: [binding(reportPath), binding(freezePath), ...contentOutputs, ...evidenceOutputs],
    repairsUsed: 0,
    imagesOpened: 0,
    actualToolFailures: [],
  })
  console.log(JSON.stringify({
    report: binding(reportPath),
    authorFreeze: binding(freezePath),
    finalBindings: binding(sealPath),
    frozen: frozenBindings,
  }, null, 2))
} catch (error) {
  const failurePath = path.join(output, `tool-failure-freeze-${Date.now()}.json`)
  createJSON(failurePath, {
    schema: 'STEMROBIN-181/D183-actual-tool-failure@1',
    cwd,
    stage: 'TEXT_ONLY_MECHANICAL_BINDING_AND_COPY_FREEZE',
    error: String(error),
    stack: error.stack,
    existingOutputBytesPreserved: true,
    independentScienceOrLanguageVerdict: false,
    imagesOpened: 0,
    repairsUsed: 0,
  })
  console.error(JSON.stringify({ failurePreserved: binding(failurePath), error: String(error) }, null, 2))
  process.exitCode = 1
}
