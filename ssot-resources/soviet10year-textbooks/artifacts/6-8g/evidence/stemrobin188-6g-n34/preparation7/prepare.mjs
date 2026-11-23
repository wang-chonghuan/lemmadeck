import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), repo)
const base = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g')
const own = path.join(base, 'evidence/stemrobin188-6g-n34/preparation7')
const book = path.join(own, 'artifacts/6-8g')
const work = path.join(own, 'work')
const requestedLesson = 'geo68-c3-s2-n34'
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
assert.ok(!fs.existsSync(book), 'Do not replace an existing preparation')
assert.ok(!fs.existsSync(work), 'Do not replace existing work')
assert.ok(!fs.existsSync(path.join(own, 'manifest.json')))

const retentionFiles = [
  'evidence/stemrobin188-6g-source149150/author-first06/retention.json',
  'evidence/stemrobin188-6g-source149150/independent-source08/retention.json',
  'evidence/stemrobin188-6g-source159160/author-first09/retention.json',
  'evidence/stemrobin188-6g-source159160/period-affected-review11/retention.json',
  'evidence/stemrobin188-6g-source161162/two-affected-repairs11/retention.json',
].map(relative => path.join(base, relative))
const retentions = retentionFiles.map(file => ({ file, document: read(file) }))
const mappings = retentions.flatMap(({ file, document }) => document.mappings
  .filter(item => typeof item.path === 'string')
  .map(item => ({ ...item, retention: file })))
const inputs = []
function mapped(suffix, expected) {
  const item = mappings.find(item => item.path.endsWith(suffix)
    && (!expected || item.sha256 === expected))
  assert.ok(item, `Missing retained binding: ${suffix}`)
  const file = path.resolve(base, item.path)
  assert.ok(file.startsWith(base + path.sep))
  assert.ok(fs.realpathSync(file).startsWith(base + path.sep))
  assert.equal(hash(file), item.sha256)
  inputs.push({ ...bind(file), retention: item.retention })
  return file
}
const commands = []
const outputs = []
const sourcePages = []
const figureBindings = []
let nativeLesson = null
let counts = null
let preparationError = null
let report149 = null
let reportAuthor = null
let report159 = null
let report161 = null
let repair161 = null
let selectedRefs = []
function run(stage, argv) {
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
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
  console.log(result.stdout)
  if (result.stderr) console.error(result.stderr)
  return command
}
try {
  report149 = mapped('source149150-and147-glyph-independent-review-08/report.json')
  reportAuthor = mapped('source6g159160-author-first-09/Report.json')
  report159 = mapped('source159-period-affected-review-11/report.json')
  report161 = mapped('source161162-independent-review-11/report.json')
  repair161 = mapped('source161-two-affected-repairs-11/record.json')
  const affected159 = read(report159)
  const repair = read(repair161)
  const sources = [
    [149, path.join(base, 'pages/0149/page.json'),
      read(report149).pages.find(item => item.physical === 149).pageJsonSHA256,
      'Canonical ancestor; existing source149 report binding'],
    [159, path.join(base, 'pages/0159/page.json'),
      affected159.affectedRepair.after.sha256,
      'Canonical page159; existing period-only repair binding, outside N34'],
    [160, mapped('source6g159160-author-first-09/artifacts/6-8g/pages/0160/page.json'),
      null, 'Retained author source160; native glyph failure remains'],
    [161, mapped('source161-two-affected-repairs-11/artifacts/6-8g/pages/0161/page.json',
      repair.after.sha256), null, 'Retained repaired source161; affected review pending'],
  ]
  fs.mkdirSync(owned(book), { recursive: true })
  fs.mkdirSync(owned(work), { recursive: true })
  for (const [physical, file, expected, status] of sources) {
    if (expected) assert.equal(hash(file), expected)
    const document = read(file)
    assert.equal(document.meta.book, '6-8g')
    assert.equal(document.meta.page, physical)
    const target = owned(path.join(book, 'pages', String(physical).padStart(4, '0'), 'page.json'))
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.symlinkSync(path.relative(path.dirname(target), file), target)
    sourcePages.push({ physical, ...bind(file), link: target, status })
    if (physical === 149) selectedRefs.push('p0149#2')
    else {
      const first = physical === 159 ? 5 : 1
      const last = physical === 161 ? 6 : document.blocks.length
      for (let number = first; number <= last; number++)
        selectedRefs.push(`p${String(physical).padStart(4, '0')}#${number}`)
    }
  }
  const page160 = read(sources.find(item => item[0] === 160)[1])
  const figureIds = page160.blocks.filter(block => block.kind === 'fig').map(block => block.id)
  assert.deepEqual(figureIds, ['tbl-p0160-01', 'fig-213'])
  const author160 = read(reportAuthor).pages.find(item => item.page === 160)
  fs.mkdirSync(owned(path.join(book, 'figures')), { recursive: true })
  for (const id of figureIds) {
    const prior = author160.figures.find(item => item.id === id)
    assert.ok(prior)
    const file = mapped(`source6g159160-author-first-09/${prior.path}`, prior.sha256)
    const target = owned(path.join(book, 'figures', `${id}.png`))
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
    figureBindings.push({ id, source: bind(file), output: bind(target), mode: 'OPAQUE_BYTES_ONLY' })
  }
  const toc = path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json')
  const card = read(toc).contents.flatMap(chapter => chapter.lessons ?? [])
    .flatMap(section => section.topics ?? []).find(item => item.id === requestedLesson)
  assert.equal(card.printedNumber, 34)
  assert.equal(card.page, 149)
  inputs.push(bind(toc), bind(path.join(own, 'assemble-scoped.py')))
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
    const raw = path.join(book, 'lessons', nativeLesson)
    for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
      outputs.push(bind(path.join(raw, name)))
    const lesson = read(path.join(raw, 'lesson.json'))
    const exercises = read(path.join(raw, 'exercises.json'))
    assert.deepEqual(exercises.exercises.map(item => item.number), ['446', '447', '448', '449'])
    assert.deepEqual(lesson.figures.map(item => item.id), figureIds)
    assert.ok(lesson.prose.every(item => item.source_refs.every(ref =>
      selectedRefs.includes(ref))))
    assert.ok(lesson.prose.some(item => item.source_refs.includes('p0160#7')
      && item.source_refs.includes('p0161#1')))
    counts = {
      nativePagesIncludingAncestor: index.pages,
      nativeLessons: index.lessons.length,
      proseBlocks: lesson.prose.length,
      textProseBlocks: lesson.prose.filter(item => item.kind === 'p').length,
      exercises: exercises.exercises.length,
      originalFigureObjects: lesson.figures.length,
      numberedFigures: index.audit.figure_numbers.length,
      nativeAuditErrors: index.audit.errors,
      nativeAuditWarnings: index.audit.warnings,
    }
    if (assembly.exitCode === 0) {
      const adapted = run('adapt-prepare', [
        python, '-B', path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py'),
        'adapt-prepare', '--book', '6-8g', '--root', path.join(own, 'artifacts'),
        '--work', work, '--edition', 'modern-us-neutral', '--lesson', nativeLesson,
      ])
      const templates = path.join(work, 'adapt/6-8g/modern-us-neutral/lessons', nativeLesson)
      const templateNames = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
      const existing = templateNames.filter(name => fs.existsSync(path.join(templates, name)))
      for (const name of existing) outputs.push(bind(path.join(templates, name)))
      counts.nativeLessonTemplatesWritten = existing.length
      if (adapted.exitCode === 0) {
        assert.equal(existing.length, 3)
        counts.templateProseBlocks = read(path.join(templates, templateNames[0])).prose.length
        counts.templateExercises = read(path.join(templates, templateNames[1])).exercises.length
        counts.templateFigures = read(path.join(templates, templateNames[2])).figures.length
      }
    }
  }
} catch (error) {
  preparationError = { name: error.name, message: error.message }
  console.error(error)
}
const affected159 = report159 ? read(report159) : null
const source161 = report161 ? read(report161) : null
const repaired161 = repair161 ? read(repair161) : null
const manifest = {
  status: !preparationError && commands.length === 2 && commands.every(item => item.exitCode === 0)
    ? 'N34_NATIVE_RAW_AND_ADAPT_TEMPLATES_PREPARED_SOURCE_READINESS_PENDING'
    : 'N34_PARTIAL_PREPARATION_WITH_FAILURE',
  ticket: 'STEMROBIN-188', role: 'BOUNDED_SOURCE_PREPARATION_ONLY',
  requestedLesson, nativeLesson, nativeCardBound: nativeLesson === requestedLesson, counts,
  boundary: {
    leftInclusive: 'p0159#5', rightExclusive: 'p0161#7', ancestorRefs: ['p0149#2'],
    sourcePhysicalPages: [159, 160, 161], printedPages: [149, 150, 151],
    selectedRefs, exercises: ['446', '447', '448', '449'],
    originalFigureIds: ['tbl-p0160-01', 'fig-213'],
    continuation: {
      open: 'p0160#7', cont: 'p0161#1',
      retainedLocalObservation: source161?.local_boundaries,
      disposition: 'Native text join only; no new source or whole-N34 approval',
    },
    N35SourceBlocksIncludedInAssemblyOrLessonOutputs: false,
    fullPageJsonLinks: 'Unmodified JSON links retain block ordinals; native adapt may reconstruct source identities from those links',
  },
  inputs, sourcePages, figureBindings,
  retentionBindings: retentions.map(({ file, document }) => ({ ...bind(file), status: document.status })),
  reportsReusedNotCopiedOrRerun: [report149, reportAuthor, report159, report161, repair161]
    .filter(Boolean).map(bind),
  sourceReadiness: {
    status: 'PENDING_AFFECTED_SOURCE_REVIEW_AS_NEEDED',
    source160: {
      nativeFailure: affected159?.preservedEvidence.mechanical160.verdict,
      originalFailuresAndHolds: report159,
      holds: affected159?.preservedEvidence.allOriginalHolds,
      outgoing160HistoricalUnknownNotCleared: true,
    },
    source161: {
      retainedRepairStatus: repaired161?.status,
      changedSourceLeaf: repaired161?.changedSourceLeaf,
      retainedErrors: repaired161?.errors,
      independentAffectedReviewPending: repaired161?.independentAffectedReviewPending,
      nativePageApproved: repaired161?.nativePageApproved,
      originalSourceIdentities: source161?.source_verdicts
        .find(item => item.physical_page === 161)?.source_identity,
      repairReviewScope: 'Punctuation repair p0161#8 lies outside N34; counting-copy repair is page-level. No newly granted affected approval.',
      sourceReview: report161, repairRecord: repair161,
    },
    noSourceGlyphPrintingHoldOrRepairApprovalGranted: true,
  },
  commands, outputs, preparationError,
  failedDiscoveryCalls: [
    {
      command: "rg --files -g '*production*resume*' -g '*SOP*' -g '*contract*' -g 'assemble-scoped.py' -g 'AGENTS.md' .claude .agents ssot-resources/soviet10year-textbooks scripts",
      exitCode: 2, error: 'scripts: No such file or directory',
    },
    {
      command: 'rg --files ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n34 ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n33/preparation7 ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source159160/author-first09 ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source161162/two-affected-repairs11',
      exitCode: 2, error: 'N34 evidence root did not yet exist',
    },
    {
      command: "rg -n 'adapt-prepare|def run|def load_stream|--root|--work|source_refs|figures' .claude/skills/ld-s10y-lesson/tools/p2c.py .claude/skills/ld-s10y-lesson/tools/adapt.py .claude/skills/ld-s10y-lesson/tools/assemble.py .claude/skills/ld-s10y-lesson/SKILL.md",
      exitCode: 2, error: 'tools/adapt.py: No such file or directory; actual native edition contract subsequently read from edition.py',
    },
  ],
  sourceProducerReplays: 0, nativeProducerRetries: 0,
  imageLoads: 0, imageDecodes: 0, modernImagesGenerated: 0,
  authored: false, independentReviewPerformed: false, wholeLessonApproved: false,
  finalized: false, published: false, newPASSGranted: false,
  networkDbEnvGitMessagesSubagents: 0,
  nativeP2cGitRootProbe: 'Allowed indirectly; no sandbox-exec or explicit Git calls',
  canonicalIndexesLessonsAndN33RussellTouched: false,
  writesOnlyWithin: own,
}
save(path.join(own, 'manifest.json'), manifest)
console.log(JSON.stringify({ manifest: bind(path.join(own, 'manifest.json')), status: manifest.status, nativeLesson, counts }))
if (manifest.status === 'N34_PARTIAL_PREPARATION_WITH_FAILURE') process.exitCode = 1
