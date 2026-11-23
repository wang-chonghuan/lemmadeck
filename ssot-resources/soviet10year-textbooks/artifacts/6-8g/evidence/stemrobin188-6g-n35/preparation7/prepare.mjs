import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), repo)
const base = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g')
const own = path.join(base, 'evidence/stemrobin188-6g-n35/preparation7')
const book = path.join(own, 'artifacts/6-8g')
const work = path.join(own, 'work')
const requestedLesson = 'geo68-c3-s2-n35'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
function owned(file) {
  assert.ok(file.startsWith(own + path.sep), `Outside owned preparation: ${file}`)
  return file
}
function save(file, value) {
  fs.writeFileSync(owned(file), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
assert.ok(!fs.existsSync(book), 'No preparation replay or replacement')
assert.ok(!fs.existsSync(work), 'No preparation replay or replacement')
assert.ok(!fs.existsSync(path.join(own, 'manifest.json')))

const retentionFiles = [
  'evidence/stemrobin188-6g-source161162/author-first10/retention.json',
  'evidence/stemrobin188-6g-source161162/independent-review11/retention.json',
  'evidence/stemrobin188-6g-source163164/author-first11/retention.json',
  'evidence/stemrobin188-6g-source163164/affected-repair12/retention.json',
  'evidence/stemrobin188-6g-source163164/independent-review12/retention.json',
  'evidence/stemrobin188-6g-source165166/author-first12/retention.json',
  'evidence/stemrobin188-6g-source165166/independent-review13/retention.json',
].map(relative => path.join(base, relative))
const retentions = retentionFiles.map(file => ({ file, document: read(file) }))
const mappings = retentions.flatMap(({ file, document }) => document.mappings
  .filter(item => typeof item.path === 'string')
  .map(item => ({ ...item, retention: file })))
const inputs = []
function retained(relative, expected) {
  const item = mappings.find(item => item.path === relative)
  assert.ok(item, `Missing retained binding: ${relative}`)
  if (expected) assert.equal(item.sha256, expected)
  const file = path.join(base, relative)
  assert.ok(fs.realpathSync(file).startsWith(base + path.sep))
  assert.equal(hash(file), item.sha256)
  inputs.push({ ...bind(file), retention: item.retention })
  return file
}
const sourcePages = []
const figureBindings = []
const commands = []
const outputs = []
let nativeLesson = null
let counts = null
let preparationError = null
let selectedRefs = []
let reports = null
function run(stage, argv) {
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  })
  const streams = {}
  for (const kind of ['stdout', 'stderr']) {
    const file = owned(path.join(own, `${stage}.${kind}`))
    fs.writeFileSync(file, result[kind] ?? '', { flag: 'wx' })
    streams[kind] = bind(file)
  }
  const command = {
    stage, cwd: repo, argv, exitCode: result.status, signal: result.signal,
    error: result.error?.message ?? null, streams,
  }
  commands.push(command)
  console.log(JSON.stringify(command))
  if (result.stdout) console.log(result.stdout)
  if (result.stderr) console.error(result.stderr)
  return command
}
try {
  const report161162 = retained(
    'evidence/stemrobin188-6g-source161162/independent-review11/files/source161162-independent-review-11/report.json',
  )
  const report163164 = retained(
    'evidence/stemrobin188-6g-source163164/independent-review12/files/source163164-first-and161-affected-review-12/report.json',
  )
  const first163164 = retained(
    'evidence/stemrobin188-6g-source163164/independent-review12/files/source163164-first-and161-affected-review-12/FIRST.md',
  )
  const report165AndRepairs = retained(
    'evidence/stemrobin188-6g-source165166/independent-review13/files/source165166-first-and163164-affected-review-12/report.json',
  )
  const prior161162 = read(report161162)
  const prior163164 = read(report163164)
  const affected = read(report165AndRepairs)
  assert.ok(affected.scopeB.disposition.startsWith('PASS_AFFECTED_ONLY'))
  assert.equal(affected.scopeB.checks.length, 5)
  assert.equal(hash(first163164), affected.scopeB.reusedFIRST.sha256)
  assert.equal(hash(report163164), affected.scopeB.reusedReport.sha256)
  reports = {
    source161162: bind(report161162),
    source163164FIRST: bind(first163164),
    source163164FirstReviewAnd161Affected: bind(report163164),
    source165ObservationAnd163164AffectedApproval: bind(report165AndRepairs),
  }
  const sources = [
    [149, path.join(base, 'pages/0149/page.json'), 2, 2,
      '1dd3b3eb0fc3c41b1f004b76d8895601c326ceb6075297b8ed26ab1f8c27b1a5'],
    [159, path.join(base, 'pages/0159/page.json'), 5, 5,
      '1fe4a3200ddbc9c3de9e136fcd36e825a2acf2e12cf86dec69dae29b03e46d61'],
    [161, path.join(base, 'pages/0161/page.json'), 7, null,
      '2877a95fe2408f66f26f153ec5c3184e9e2b085eb71d77ed2f3e4c43dd153ccf'],
    [162, retained(
      'evidence/stemrobin188-6g-source161162/author-first10/files/source6g161162-author-first-10/artifacts/6-8g/pages/0162/page.json',
    ), 1, null, null],
    [163, retained(
      'evidence/stemrobin188-6g-source163164/affected-repair12/files/source163164-affected-repair-12/artifacts/6-8g/pages/0163/page.json',
      'f3e0e4e2a77b97e23459b1c6b053fcef32e7661825b05ef362fea4c3be7ef4de',
    ), 1, null, null],
    [164, retained(
      'evidence/stemrobin188-6g-source163164/affected-repair12/files/source163164-affected-repair-12/artifacts/6-8g/pages/0164/page.json',
      '5d10fce0f2a8ab63d20560d4cf9d2e4a4295f43dd85db0123889ecc64e77d824',
    ), 1, null, null],
    [165, retained(
      'evidence/stemrobin188-6g-source165166/author-first12/files/source6g165166-author-first-11/artifacts/6-8g/pages/0165/page.json',
    ), 1, 6, null],
  ]
  fs.mkdirSync(owned(book), { recursive: true })
  fs.mkdirSync(owned(work), { recursive: true })
  const selectedSourceBlocks = []
  for (const [physical, file, first, last, expected] of sources) {
    if (expected) assert.equal(hash(file), expected)
    const document = read(file)
    assert.equal(document.meta.book, '6-8g')
    assert.equal(document.meta.page, physical)
    const target = owned(path.join(book, 'pages', String(physical).padStart(4, '0'), 'page.json'))
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.symlinkSync(path.relative(path.dirname(target), file), target)
    const pageRefs = []
    for (let number = first; number <= (last ?? document.blocks.length); number++) {
      const ref = `p${String(physical).padStart(4, '0')}#${number}`
      selectedRefs.push(ref)
      pageRefs.push(ref)
      selectedSourceBlocks.push({ ref, block: document.blocks[number - 1] })
    }
    sourcePages.push({
      physical, printed: document.meta.printed_page,
      ...bind(file), link: target, selectedRefs: pageRefs,
      mode: 'UNMODIFIED_RETAINED_JSON_LINK_PRESERVES_NATIVE_BLOCK_ORDINALS',
    })
  }
  const nativeFigureSources = selectedSourceBlocks
    .filter(item => item.block.kind === 'fig')
    .map(item => ({ ref: item.ref, id: item.block.id }))
  fs.mkdirSync(owned(path.join(book, 'figures')), { recursive: true })
  for (const { id, ref } of nativeFigureSources) {
    const number = Number(id.replace('fig-', ''))
    let file, expected, cropDisposition
    if (number <= 216) {
      const prior = prior161162.source_figure_crop_review.find(item => item.figure === number)
      assert.ok(prior?.source_crop_fidelity.startsWith('PASS'))
      expected = prior.sha256
      cropDisposition = prior.source_crop_fidelity
      file = retained(
        `evidence/stemrobin188-6g-source161162/author-first10/files/source6g161162-author-first-10/work/6-8g/pages/0162/figures/${id}.png`,
        expected,
      )
    } else {
      assert.ok(number === 217 || number === 218)
      const prior = prior163164.scopeA.figures.find(item => item.figure === number)
      assert.ok(prior?.status.startsWith('PASS'))
      expected = affected.scopeB.crop217218PASSReused[String(number)]
      assert.equal(prior.crop.sha256, expected)
      cropDisposition = prior.status
      const physical = number === 217 ? '0163' : '0164'
      file = retained(
        `evidence/stemrobin188-6g-source163164/author-first11/files/source6g163164-author-first-11/work/6-8g/pages/${physical}/figures/${id}.png`,
        expected,
      )
    }
    const target = owned(path.join(book, 'figures', `${id}.png`))
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(target), expected)
    figureBindings.push({
      id, sourceBlock: ref, source: bind(file), output: bind(target),
      reusedDisposition: cropDisposition, mode: 'OPAQUE_BYTES_ONLY',
    })
  }
  const toc = path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json')
  const card = read(toc).contents.flatMap(chapter => chapter.lessons ?? [])
    .flatMap(section => section.topics ?? []).find(item => item.id === requestedLesson)
  assert.equal(card.printedNumber, 35)
  assert.equal(card.page, 151)
  const nativeToolNames = ['p2c.py', 'assemble.py', 'edition.py', 'production.py', 'mathcheck.py']
  inputs.push(bind(toc))
  for (const name of nativeToolNames)
    inputs.push(bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tools', name)))
  for (const name of ['soviet-cn.json', 'modern-us-neutral.json'])
    inputs.push(bind(path.join(repo, '.claude/skills/ld-s10y-lesson/profiles', name)))
  for (const name of ['assemble-scoped.py', 'adapt-scoped.py', 'prepare.mjs'])
    inputs.push(bind(path.join(own, name)))
  const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const assembly = run('assemble', [
    python, '-B', path.join(own, 'assemble-scoped.py'), repo, book, path.join(work, '6-8g'),
  ])
  const indexPath = path.join(book, 'book.json')
  if (fs.existsSync(indexPath)) {
    const index = read(indexPath)
    outputs.push(bind(indexPath))
    assert.equal(index.lessons.length, 1)
    nativeLesson = index.lessons[0].id
    assert.equal(nativeLesson, requestedLesson)
    const raw = path.join(book, 'lessons', nativeLesson)
    for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
      outputs.push(bind(path.join(raw, name)))
    const lesson = read(path.join(raw, 'lesson.json'))
    const exercises = read(path.join(raw, 'exercises.json'))
    counts = {
      nativePagesIncludingAncestors: index.pages,
      nativeLessons: index.lessons.length,
      proseBlocks: lesson.prose.length,
      textProseBlocks: lesson.prose.filter(item => item.kind === 'p').length,
      exercises: exercises.exercises.length,
      sourceExerciseNumbers: exercises.exercises.map(item => item.number),
      originalFigureObjects: lesson.figures.length,
      sourceFigureIds: lesson.figures.map(item => item.id),
      numberedFigures: index.audit.figure_numbers.length,
      nativeAuditErrors: index.audit.errors,
      nativeAuditWarnings: index.audit.warnings,
      joins: {
        source162To163: lesson.prose.filter(item => item.source_refs.includes('p0162#7')
          && item.source_refs.includes('p0163#1')).map(item => item.source_refs),
        exercise451: exercises.exercises.filter(item => item.number === '451').map(item => item.pages),
      },
    }
    assert.deepEqual(counts.sourceExerciseNumbers, Array.from({ length: 10 }, (_, i) => String(450 + i)))
    assert.deepEqual(counts.sourceFigureIds, Array.from({ length: 5 }, (_, i) => `fig-${214 + i}`))
    assert.equal(counts.exercises, 10)
    assert.equal(counts.originalFigureObjects, 5)
    assert.equal(counts.joins.source162To163.length, 1)
    assert.deepEqual(counts.joins.exercise451, [['p0164#6', 'p0164#8']])
    const outputRefs = [
      ...lesson.prose.flatMap(item => item.source_refs),
      ...exercises.exercises.flatMap(item => item.pages),
    ]
    assert.ok(outputRefs.every(ref => selectedRefs.includes(ref)))
    assert.ok(!outputRefs.includes('p0165#7'))
    for (const figure of figureBindings) {
      const native = lesson.figures.find(item => item.id === figure.id)
      assert.ok(native)
      figure.nativeBinding = native
    }
    if (assembly.exitCode === 0) {
      const adapted = run('adapt-prepare', [
        python, '-B', path.join(own, 'adapt-scoped.py'), 'adapt-prepare',
        '--book', '6-8g', '--root', path.join(own, 'artifacts'),
        '--work', work, '--edition', 'modern-us-neutral', '--lesson', nativeLesson,
      ])
      const templateRoot = path.join(work, 'adapt/6-8g/modern-us-neutral')
      const templates = path.join(templateRoot, 'lessons', nativeLesson)
      const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
      const existing = names.filter(name => fs.existsSync(path.join(templates, name)))
      if (fs.existsSync(path.join(templateRoot, 'book.template.json')))
        outputs.push(bind(path.join(templateRoot, 'book.template.json')))
      for (const name of existing) outputs.push(bind(path.join(templates, name)))
      counts.nativeLessonTemplatesWritten = existing.length
      if (adapted.exitCode === 0) {
        assert.equal(existing.length, 3)
        const templateLesson = read(path.join(templates, names[0]))
        const templateExercises = read(path.join(templates, names[1]))
        const templateFigures = read(path.join(templates, names[2]))
        counts.templateProseBlocks = templateLesson.prose.length
        counts.templateExercises = templateExercises.exercises.length
        counts.templateFigures = templateFigures.figures.length
        assert.deepEqual(templateLesson.source.data, lesson)
        assert.deepEqual(templateExercises.source.data, exercises)
        assert.deepEqual(templateFigures.figures.map(item => item.id), counts.sourceFigureIds)
        for (const item of templateFigures.figures) {
          const binding = figureBindings.find(figure => figure.id === item.id)
          assert.equal(item.source.png.sha256, binding.output.sha256)
        }
      }
    }
  }
} catch (error) {
  preparationError = { name: error.name, message: error.message }
  console.error(error)
}
const prior163164 = reports ? read(reports.source163164FirstReviewAnd161Affected.path) : null
const prior161162 = reports ? read(reports.source161162.path) : null
const latest = reports ? read(reports.source165ObservationAnd163164AffectedApproval.path) : null
const manifest = {
  status: !preparationError && commands.length === 2 && commands.every(item => item.exitCode === 0)
    ? 'N35_NATIVE_RAW_AND_ADAPT_TEMPLATES_PREPARED_ONLY'
    : 'N35_PARTIAL_PREPARATION_WITH_FAILURE',
  ticket: 'STEMROBIN-188', role: 'BOUNDED_SHARED_SOURCE_PREPARATION_ONLY',
  requestedLesson, nativeLesson, nativeCardBound: nativeLesson === requestedLesson,
  edition: 'modern-us-neutral', counts,
  boundary: {
    leftInclusive: 'p0161#7', rightExclusive: 'p0165#7',
    ancestorRefs: ['p0149#2', 'p0159#5'],
    sourcePhysicalPages: [161, 162, 163, 164, 165],
    sourcePrintedPages: [151, 152, 153, 154, 155],
    selectedRefs,
    source165SelectedRefs: sourcePages.find(item => item.physical === 165)?.selectedRefs ?? [],
    excludedFromNativeStreamAndLessonOutputs: ['p0165#7 and later', 'unit36', 'fig-219', 'page166 and later'],
    fullPageLinks: 'Unmodified retained page JSON preserves original block ordinals; only selected blocks enter scoped assembly.',
    nativeOnlyJoins: [
      { open: 'p0162#7', cont: 'p0163#1', transparent: ['p0162#8', 'p0162#9', 'p0162#10'] },
      { open: 'p0164#6', cont: 'p0164#8', exercise: '451', samePageCaption: 'p0164#7' },
    ],
  },
  sourcePages, figureBindings, inputs,
  retentionBindings: retentions.map(({ file, document }) => ({ ...bind(file), status: document.status })),
  reportsReusedNotCopiedOrRerun: reports,
  existingSourceDispositions: {
    source161AffectedRepair: prior163164?.scopeB.status,
    source161RemainingNativeFailure: prior163164?.scopeB.retainedActualExecution,
    source161IdentityUnknowns: prior161162?.source_verdicts
      .find(item => item.physical_page === 161)?.source_identity,
    source162ReadableAndCropDisposition: prior161162?.source_verdicts
      .find(item => item.physical_page === 162)?.source_verdict,
    source163164FiveRepairs: latest?.scopeB.disposition,
    source163164NativeResults: latest?.scopeB.native,
    source163164OriginalWrapperFailure: latest?.scopeB.wrapperFailure,
    source165SelectedContentObservation: latest?.scopeA.page165,
    identityApproval: false,
    historicalPendingAndOpenTailMetadataNotReplayed: true,
  },
  nativeRouting: {
    assemble: 'assemble.run(..., stream=[h1,h2,*intactSelectedBlocks], strict=True, exercise_numbering=book)',
    adapt: 'p2c.cmd_adapt_prepare -> actual child process -> edition.cmd_prepare; edition.common supplies the argument contract.',
    workspace: 'Exact authorized cwd and native non-Git ownership/book/lesson checks; CLI-only Git root probes not invoked.',
    childProcesses: 'Native KaTeX child uses authorized repo cwd. Python child uses -B, with no environment changes.',
    nativeToolFilesModified: false,
    scientificChecksChanged: false,
  },
  commands, outputs, preparationError,
  failedDiscoveryCalls: [
    { exitCode: 2, error: 'Initial rg: N35 evidence directory did not yet exist.' },
    { exitCode: 2, error: 'Initial contract rg included nonexistent tools/adapt.py; actual edition.py contract subsequently read.' },
  ],
  sourceProducerReplays: 0, nativeAssembleCalls: commands.filter(item => item.stage === 'assemble').length,
  nativeAdaptPrepareCalls: commands.filter(item => item.stage === 'adapt-prepare').length,
  nativeProducerRetries: 0, sourceRepairs: 0, sourceFinalizers: 0,
  imageLoads: 0, imageDecodes: 0, imageResnaps: 0, vectorizations: 0, modernImagesGenerated: 0,
  textRewritingByAgent: false, lessonAuthoring: false, answerOrChoiceAuthoring: false,
  newSourceFidelityOrIdentityApproval: false, wholeLessonApproved: false,
  finalized: false, published: false, newPASSGranted: false,
  networkCalls: 0, dbActions: 0, envChanges: 0, installs: 0, gitCalls: 0,
  peerMessages: 0, newWorktreesBranchesChats: 0,
  canonicalPagesLessonsFiguresBookIndexesModified: false,
  N34FilesModified: false,
  writesOnlyWithin: own,
}
save(path.join(own, 'manifest.json'), manifest)
console.log(JSON.stringify({
  manifest: bind(path.join(own, 'manifest.json')), status: manifest.status,
  nativeLesson, counts, preparationError,
}))
if (manifest.status === 'N35_PARTIAL_PREPARATION_WITH_FAILURE') process.exitCode = 1
