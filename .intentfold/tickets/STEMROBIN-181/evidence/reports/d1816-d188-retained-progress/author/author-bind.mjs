import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd, 'This author task requires the exact assigned cwd')
const output = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d188-n20-text-author')
const sourceDir = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s3-n20')
const work = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d188/work/adapt/10p')
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
const preparedPath = path.join(output, 'prepared.json')
const failurePath = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/d188-first-preparation-failure.json')
const proseTool = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const sha = (data) => crypto.createHash('sha256').update(data).digest('hex')
const receipt = (p) => {
  const data = fs.readFileSync(p)
  return { path: path.resolve(p), bytes: data.length, sha256: sha(data) }
}
const textReceipt = (text) => ({ text, bytes: Buffer.byteLength(text), sha256: sha(text) })
const workPath = (edition, name) => path.join(work, edition, 'lessons/phy10-c1-s3-n20', name)
const frozenPath = (edition, name) => path.join(output, 'frozen', edition, name)
const math = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((m) => m[1])
const digits = (text) => text.match(/\d+(?:\.\d+)?/g) ?? []
const prepared = read(preparedPath)
assert.equal(prepared.book, '10p')
assert.equal(prepared.batch, 'D188')
assert.equal(prepared.lesson, 'phy10-c1-s3-n20')
assert.equal(prepared.sourceBlocks, 22)
assert.equal(prepared.originalTasks, 4)
assert.equal(prepared.status, 'FIRST_N20_BILINGUAL_TEXT_PREPARED_FIGURES_NOT_AUTHORED')
const sourceLesson = read(path.join(sourceDir, 'lesson.json'))
const sourceExercises = read(path.join(sourceDir, 'exercises.json'))
const figureInputHashes = {
  'modern-us-neutral': '9abc94a5a6c5b1c6e39eba2b72f97db26f91ed2b8a929b2a6d869c501b171222',
  'modern-us-neutral-en': 'd8cb9fb3b4659ec5d0a66816840300836b4dc59e41dccfeb5368f03bbba591af',
}
const preparationTemplateInputs = [
  ['modern-us-neutral', 'lesson.template.json', 26979, 'c608af59f3f3a179848b44279b0ae034a7462781999b6154a012247b77eb59cb'],
  ['modern-us-neutral', 'exercises.template.json', 5356, '9a5d8bfa015bb884c0c6347c9e128b7d2d867e6d24f25b9e78c813637f6a6e3a'],
  ['modern-us-neutral', 'figures.template.json', 1128, figureInputHashes['modern-us-neutral']],
  ['modern-us-neutral-en', 'lesson.template.json', 26982, '55faf9c221d5a33064116e30d81a5c9bb281537982a0576c3108c2e51a51a13b'],
  ['modern-us-neutral-en', 'exercises.template.json', 5359, 'a673e31f93056164d1d7d54f1869bcfce03512927a3cbb9b699b9d63380e6d74'],
  ['modern-us-neutral-en', 'figures.template.json', 1131, figureInputHashes['modern-us-neutral-en']],
].map(([edition, name, bytes, sha256]) => ({
  edition, path: workPath(edition, name), bytes, sha256,
  bindingOrigin: 'Read-only template receipt before first author edits',
}))

const originalSourceInputs = ['lesson.json', 'lesson.md', 'exercises.json'].map((name) => {
  const actual = receipt(path.join(sourceDir, name))
  const prior = prepared.reused.find((r) => path.resolve(cwd, r.path) === actual.path)
  assert.ok(prior, `Missing prepared binding for ${name}`)
  assert.equal(actual.sha256, prior.sha256, `Original input changed: ${name}`)
  assert.equal(actual.bytes, prior.bytes, `Original input size changed: ${name}`)
  return actual
})
const failureInput = receipt(failurePath)
const failure = read(failurePath)
assert.equal(failure.status, 'FAILED_TECHNICAL_BOOK_BINDING')
assert.equal(failure.sourceFilesChanged, false)
assert.equal(failure.nativePrepareCallsBeforeFailure, 0)
assert.equal(failure.imagesOpened, 0)

function annotate() {
  for (const edition of editions) {
    for (const name of names.slice(0, 2)) {
      const filename = workPath(edition, name)
      const before = fs.readFileSync(filename)
      const document = JSON.parse(before.toString('utf8'))
      const isLesson = name === 'lesson.template.json'
      const blocks = isLesson ? document.prose : document.exercises
      for (const block of blocks) {
        assert.deepEqual(block.numeric_changes, [])
        assert.deepEqual(block.historical_entities, [])
        const changed = block.text !== block.source_text
        const labelChanged = edition.endsWith('-en') && ['fig', 'cap'].includes(block.kind)
        block.changes = [...new Set([
          ...block.changes,
          ...(changed && !['fig', 'cap'].includes(block.kind) ? ['modernized', 'layout'] : []),
          ...(edition.endsWith('-en') && (changed || labelChanged) ? ['translation'] : []),
        ])]
        if (block.source_text.includes('汤姆生')) {
          block.historical_entities.push({
            term: edition.endsWith('-en') ? 'Thomson' : '汤姆生',
            ...(edition.endsWith('-en') ? { source_term: '汤姆生' } : {}),
            reason: `Retains the source's named formula or attributed physicist at ${block.source_refs.join(', ')}; this is source-bound attribution, not independent historical certification.`,
          })
        }
        if (block.source_text.includes('英国')) {
          block.historical_entities.push({
            term: edition.endsWith('-en') ? 'British' : '英国',
            ...(edition.endsWith('-en') ? { source_term: '英国' } : {}),
            reason: `Retains the nationality in the source's attribution at ${block.source_refs.join(', ')} without independently certifying that attribution.`,
          })
        }
      }
      assert.equal(sha(fs.readFileSync(filename)), sha(before), 'Concurrent template change')
      fs.writeFileSync(filename, `${JSON.stringify(document, null, 2)}\n`)
    }
    assert.equal(receipt(workPath(edition, names[2])).sha256, figureInputHashes[edition])
  }
  console.log('Author metadata recorded in four text templates; figure templates unchanged.')
}

const blockNotes = [
  'Introduces quantitative circuit analysis and states fixed positive L and C, linearity, negligible resistance and other losses, and absence of external periodic drive; the final resistance paragraph is explicitly outside the undamped idealization.',
  'Retains the spring angular frequency, all parameter correspondences, and equation (2.3); the oscillator correspondence is exact within ideal linear undamped models, with derivation still to follow.',
  'Retains the complete period expression and equation (2.4), explicitly for the ideal circuit.',
  'Retains Thomson and British nationality as the source attribution and retains the source priority claim only as a statement credited by the source; no fresh historical certification.',
  'Retains the distinction between a motivating analogy and a derivation; equality of quantitative laws is limited to the respective ideal linear models.',
  'Retains Figure 30 and the energy-conservation derivation task with fixed inductance and capacitance and negligible resistance.',
  'Retains total electromagnetic energy, both electric and magnetic contributions, and the full equation (2.5).',
  'Retains the empty Figure 30 placeholder, original identity, printed page and source reference; English changes only its descriptive lesson label. No figure authoring, opening or approval.',
  'Retains R=0 and energy constancy with no other losses or external energy input.',
  'Retains the Figure 30 caption and its number and source reference; English translates the descriptive word only. No image operation.',
  'Retains both equivalent energy-derivative equations and (2.6), separating them with prose outside the math.',
  'Retains equal-magnitude opposite-sign energy rates and conservation of total energy.',
  'Explains evaluation of the existing energy derivatives by the chain rule with fixed parameters, rather than taking an additional derivative of (2.6); equation (2.7) is unchanged.',
  'Defines signed charge on one selected plate and positive current into that plate, consistently with q prime equals i; retains the substitution and equation (2.8).',
  'Retains i prime equals q double-prime, the mechanical derivative analogy, Li divisor and equation (2.9); division occurs only on nonzero-current intervals, and continuity extends the equation through current zeros without division by zero.',
  'Retains the complete q/x, q double-prime/x double-prime, reciprocal capacitance/spring constant, and inductance/mass correspondences and all equation (1.11)/(2.9) references; spring equivalence is exact within the model, while pendulum equivalence requires the small-angle approximation.',
  'Retains both squared-frequency coefficients, formulas (2.3)/(2.4), increasing-period dependencies and both qualitative explanations; holds the other parameter fixed and distinguishes qualitative intuition from the full expression.',
  'Retains t=0, both complete cosine expressions, equation (2.10), and charge amplitude; specifies maximum positive displacement and zero velocity, and maximum positive initial charge and zero current. Descriptive Cyrillic amplitude subscripts are explicitly preserved.',
  'Retains the complete derivative equation including its minus sign, cosine phase shift, (2.11), current-amplitude expression, both pi/2 references and Figure 31; sign and phase language follows the positive-current-into-plate convention. Cyrillic subscripts unchanged.',
  'Retains the empty Figure 31 placeholder, identity, printed page and source reference; English changes only its descriptive lesson label. No figure authoring, opening or approval.',
  'Retains the Figure 31 caption and its number and source reference; English translates the descriptive word only. No image operation.',
  'Retains real energy loss and damping; increasing R lengthens the period only with fixed L and C in the underdamped regime. For initially charged capacitor and zero coil current, large R prevents polarity-reversing recharge while discharge continues toward zero; it does not imply no discharge or a permanent remaining charge.',
]
const questionNotes = [
  {
    task: 'Distinguish free electrical oscillations from forced electrical oscillations.',
    zh: '完整保留自由电振荡与受迫电振荡的区别这一任务。',
    en: 'Retains the complete free-versus-forced distinction task.',
  },
  {
    task: 'Analyze the full electrical-circuit/simple-pendulum analogy, not just the period.',
    zh: '保留全面类比任务，明确要求对应物理量、能量转化、振动过程及周期，并说明小角度近似和理想模型条件；不给对应答案。',
    en: 'Requests corresponding quantities, energy transformations, the oscillation process and period, with small-angle and ideal-model limits; supplies no correspondences or solutions.',
  },
  {
    task: 'Replace one capacitor C with two capacitors each C and determine the period change for both parallel and series connections.',
    zh: '原电容及两个替代电容的 C 全部保留，保持电感不变，分别分析并联和串联，询问周期变化而不提供结果。',
    en: 'Preserves C for the original capacitor and each of the two replacements, fixes inductance, and separately requests parallel and series period changes without results.',
  },
  {
    task: 'Relate the charge-oscillation and current-oscillation amplitudes during discharge through the coil.',
    zh: '保留通过线圈放电的情境及电荷振幅与电流振幅关系的完整提问；不在题面中写出关系式。',
    en: 'Preserves discharge through the coil and asks for the full amplitude relationship without including the relationship in the question.',
  },
]

function freeze() {
  assert.equal(blockNotes.length, sourceLesson.prose.length)
  assert.equal(questionNotes.length, sourceExercises.exercises.length)
  const documents = {}
  const flowReceipts = []
  const workingOutputs = []
  const frozenOutputs = []
  for (const edition of editions) {
    const lesson = read(workPath(edition, names[0]))
    const exercises = read(workPath(edition, names[1]))
    assert.equal(lesson.prose.length, 22)
    assert.equal(lesson.exercise_count, 4)
    assert.equal(exercises.exercises.length, 4)
    assert.equal(exercises.count, 4)
    assert.equal(lesson.edition, edition)
    assert.equal(exercises.edition, edition)
    assert.equal(lesson.status, 'draft')
    assert.equal(exercises.status, 'draft')
    assert.deepEqual(lesson.source.data, sourceLesson)
    assert.deepEqual(exercises.source.data, sourceExercises)
    assert.equal(lesson.source.sha256, originalSourceInputs.find((r) => r.path.endsWith('/lesson.json')).sha256)
    assert.equal(exercises.source.sha256, originalSourceInputs.find((r) => r.path.endsWith('/exercises.json')).sha256)
    assert.deepEqual(lesson.errata, [])
    assert.deepEqual(lesson.figures.map(({ id, page }) => ({ id, page })), sourceLesson.figures.map(({ id, page }) => ({ id, page })))
    for (let i = 0; i < lesson.prose.length; i++) {
      const block = lesson.prose[i]
      const original = sourceLesson.prose[i]
      for (const key of ['kind', 'id', 'printed_page', 'source_refs']) assert.deepEqual(block[key], original[key])
      assert.equal(block.source_text, original.text)
      assert.deepEqual(math(block.text), math(original.text), `Math sequence changed in ${edition} block ${i + 1}`)
      assert.deepEqual(digits(block.text), digits(original.text), `Numbers changed in ${edition} block ${i + 1}`)
      assert.deepEqual(block.numeric_changes, [])
      assert.ok(!block.changes.includes('notation'))
      assert.ok(!block.changes.includes('math-correction'))
      assert.ok(!block.text.includes('<span'))
      if (block.kind === 'fig') assert.equal(block.text, '')
      if (edition.endsWith('-en')) assert.ok(!/\p{Script=Han}/u.test(block.text), `Untranslated visible prose ${i + 1}`)
    }
    for (let i = 0; i < exercises.exercises.length; i++) {
      const question = exercises.exercises[i]
      const original = sourceExercises.exercises[i]
      for (const key of ['number', 'source_number', 'group_id', 'pages', 'figure_refs', 'figures']) assert.deepEqual(question[key], original[key])
      assert.equal(question.source_text, original.text)
      assert.deepEqual(math(question.text), math(original.text))
      assert.deepEqual(digits(question.text), digits(original.text))
      assert.equal(question.lines.join('\n'), question.text)
      assert.deepEqual(question.numeric_changes, [])
      assert.ok(!question.text.includes('<span'))
      for (const key of ['answer', 'choices', 'correct_index', 'solution']) assert.ok(!(key in question))
      if (edition.endsWith('-en')) assert.ok(!/\p{Script=Han}/u.test(question.text))
    }
    assert.equal(receipt(workPath(edition, names[2])).sha256, figureInputHashes[edition])
    const flowRaw = execFileSync(process.execPath, [proseTool, '--json', workPath(edition, names[0])], {
      cwd, encoding: 'utf8', maxBuffer: 1024 * 1024,
    })
    const flow = JSON.parse(flowRaw)
    assert.equal(flow.resolvedBreaks.length, 3)
    assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), lesson.section_breaks)
    const flowPath = path.join(output, `prose-flow-${edition}.json`)
    fs.writeFileSync(flowPath, flowRaw, { flag: 'wx' })
    flowReceipts.push({ edition, ...receipt(flowPath), paragraphCount: flow.paragraphs.length, resolvedBreaks: flow.resolvedBreaks })
    documents[edition] = { lesson, exercises }
    fs.mkdirSync(path.join(output, 'frozen', edition), { recursive: true })
    for (const name of names) {
      const from = workPath(edition, name)
      const to = frozenPath(edition, name)
      const input = receipt(from)
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(to, 0o444)
      const frozen = receipt(to)
      assert.equal(frozen.sha256, input.sha256)
      assert.equal(frozen.bytes, input.bytes)
      assert.equal(fs.statSync(to).mode & 0o777, 0o444)
      assert.equal(receipt(from).sha256, input.sha256, 'Concurrent edit during freeze')
      workingOutputs.push({ edition, name, ...input })
      frozenOutputs.push({ edition, name, ...frozen, mode: '0444', unchangedFigures: name === names[2] })
    }
  }
  assert.equal(receipt(failurePath).sha256, failureInput.sha256)
  for (const original of originalSourceInputs) assert.deepEqual(receipt(original.path), original)
  const perBlock = sourceLesson.prose.map((block, i) => ({
    sourceBlock: i + 1,
    kind: block.kind,
    figureId: block.id,
    printedPage: block.printed_page,
    source_refs: block.source_refs,
    source: { file: originalSourceInputs.find((r) => r.path.endsWith('/lesson.json')), jsonPointer: `/prose/${i}`, ...textReceipt(block.text) },
    scientificAuthoringNote: blockNotes[i],
    bilingualCoverage: Object.fromEntries(editions.map((edition) => [edition, {
      file: frozenOutputs.find((r) => r.edition === edition && r.name === names[0]),
      jsonPointer: `/prose/${i}`,
      ...textReceipt(documents[edition].lesson.prose[i].text),
      originalMathTokensPreservedExactlyInOrder: true,
      originalNumbersAndFigureReferencesPreserved: true,
      originalSourceRefsAndSourceTextPreserved: true,
      independentScienceAndLanguageReview: 'PENDING',
    }])),
  }))
  const perQuestion = sourceExercises.exercises.map((question, i) => ({
    number: question.number,
    source_number: question.source_number,
    group_id: question.group_id,
    pages: question.pages,
    figure_refs: question.figure_refs,
    source: { file: originalSourceInputs.find((r) => r.path.endsWith('/exercises.json')), jsonPointer: `/exercises/${i}`, ...textReceipt(question.text) },
    completeOriginalTask: questionNotes[i].task,
    bilingualCoverage: Object.fromEntries(editions.map((edition) => [edition, {
      file: frozenOutputs.find((r) => r.edition === edition && r.name === names[1]),
      jsonPointer: `/exercises/${i}`,
      ...textReceipt(documents[edition].exercises.exercises[i].text),
      coverage: edition.endsWith('-en') ? questionNotes[i].en : questionNotes[i].zh,
      originalMathNumbersIdentityAndReferencesPreserved: true,
      solutionWritten: false,
      answerKeysOrChoicesRead: false,
      independentScienceAndLanguageReview: 'PENDING',
    }])),
  }))
  const counters = {
    actualImageOpens: 0, repairsTOTAL: 0, paidCalls: 0,
    sourceReviewsReplayed: 0, nativePrepareCalls: 0, nativeFinalizeCalls: 0,
    nativeRenderCalls: 0, sourceRepairs: 0, errataRegistrations: 0,
    figureAuthoringCalls: 0, databaseWrites: 0, publisherCalls: 0,
    browserCalls: 0, networkCalls: 0, modelApiCalls: 0,
    supervisorMessages: 0, peerMessages: 0, gitCommands: 0,
    canonicalWrites: 0, completeCoursesAdded: 0,
  }
  const report = {
    schema: 'd188-n20-bilingual-text-author-report@1',
    batch: 'D188', ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s3-n20',
    cwd,
    status: 'AUTHOR_READY_INDEPENDENT_REVIEW_PENDING_FIGURES_UNAPPROVED',
    role: 'FIRST bilingual lesson and original-question text author only',
    authorReady: true,
    independentAcceptance: false, productAcceptance: false, courseComplete: false,
    independentScienceAndLanguageReviewPending: true,
    figures: {
      ids: ['fig-30', 'fig-31'], status: 'UNAPPROVED_UNCHANGED',
      templatesByteIdenticalToPreparation: true, assetsOpened: false,
      inheritedModernizedFlagsAreNotApproval: true,
      englishProseCaptionsAndLessonLabelsTranslatedOnly: true,
    },
    prepared: receipt(preparedPath),
    firstPreparationFailure: {
      ...failureInput,
      preserved: true, classification: 'technical pre-native book-binding error, not content failure',
      diagnosis: failure.diagnosis,
      correction: failure.correction,
      retainedPassPolicy: 'Reuse the already passed source/native preparation and explicit 10p finalization hashes. No source/native stage was replayed by this author.',
      contentRepairCountImpact: 0,
    },
    originalSourceInputs,
    inheritedPreparedSourceBindings: prepared.reused.map((r) => ({
      ...r, path: path.resolve(cwd, r.path), bindingOrigin: 'Inherited from prepared.json; no source/native review replay or image open',
    })),
    sourcePassComposition: prepared.sourcePassComposition,
    preparationTemplateInputs,
    workingOutputs, frozenOutputs,
    sectionBreaks: {
      tool: receipt(proseTool), anchorMethod: 'Adjacent final paragraphs reported by prose_flow.mjs; no handwritten indices',
      outputs: flowReceipts, renderPerformed: false,
    },
    counts: {
      sourceBlocks: 22, entriesPerLocale: 22, narrativeBlocksPerLocale: 18,
      figurePlaceholdersPerLocale: 2, captionsPerLocale: 2,
      originalQuestionsPerLocale: 4, frozenTemplatesPerLocale: 3,
      sectionBreaksPerLocale: 3, perBlockCoverageRecords: perBlock.length,
      perQuestionCoverageRecords: perQuestion.length,
    },
    scientificScope: {
      newEquations: 0, changedMathTokens: 0, changedNumbers: 0,
      normalizedCyrillicSubscripts: false,
      sourceThomsonAttributionOnly: true,
      signsConsistentWithQPrimeEqualsI: true,
      divisionByZeroClaimed: false,
      cosineInitialConditionsSpecified: true,
      underdampedPeriodLimitSpecified: true,
      largeResistanceStillAllowsDischargeTowardZero: true,
      questionsRemainUnsolved: true,
      notesAreAuthorCoverageNotIndependentReview: true,
    },
    perBlock, perQuestion,
    ...counters, counters,
    nextAuthorizedOwner: 'Parent collection and sole independent review; this package does not finalize, render, publish, accept or complete a course.',
  }
  const reportPath = path.join(output, 'report.json')
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
  const authorFreeze = {
    schema: 'd188-n20-bilingual-author-freeze@1',
    batch: 'D188', ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s3-n20', cwd,
    status: report.status,
    frozenOutputs, originalSourceInputs,
    inheritedSourceInputs: report.inheritedPreparedSourceBindings,
    workingOutputs,
    prepared: receipt(preparedPath),
    firstPreparationFailure: failureInput,
    report: receipt(reportPath),
    proseFlow: flowReceipts,
    authorBindingHelper: receipt(path.join(output, 'author-bind.mjs')),
    counters,
    figuresApproved: false,
    independentAcceptance: false, productAcceptance: false, courseComplete: false,
    originalSourceInputsUnchanged: true, figuresTemplatesUnchanged: true,
    onlyNewFrozenCopiesChmodReadOnly: true,
  }
  const freezePath = path.join(output, 'author-freeze.json')
  fs.writeFileSync(freezePath, `${JSON.stringify(authorFreeze, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify({ report: receipt(reportPath), authorFreeze: receipt(freezePath), frozenOutputs, counters }, null, 2))
}

const mode = process.argv[2]
if (mode === '--annotate') annotate()
else if (mode === '--freeze') freeze()
else throw new Error('Use --annotate once for mechanical metadata or --freeze once for bound output copies.')
