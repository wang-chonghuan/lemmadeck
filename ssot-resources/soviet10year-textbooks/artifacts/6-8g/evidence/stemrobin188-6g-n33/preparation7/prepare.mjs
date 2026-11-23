import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), repo)
const base = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g')
const own = path.join(base, 'evidence/stemrobin188-6g-n33/preparation7')
const book = path.join(own, 'artifacts/6-8g')
const work = path.join(own, 'work')
const requestedLesson = 'geo68-c3-s1-n33'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
assert.ok(!fs.existsSync(book) || fs.readdirSync(book).length === 0, 'Do not replace an existing preparation')
fs.mkdirSync(book, { recursive: true })

const retentionFiles = [
  'evidence/stemrobin188-6g-source149150/author-first06/retention.json',
  'evidence/stemrobin188-6g-source149150/independent-source08/retention.json',
  'evidence/stemrobin188-6g-source155156/author-first09/retention.json',
  'evidence/stemrobin188-6g-source155157158/affected-review10/retention.json',
  'evidence/stemrobin188-6g-source159160/period-affected-review11/retention.json',
].map(relative => path.join(base, relative))
const mappings = retentionFiles.flatMap(file => read(file).mappings
  .filter(item => typeof item.path === 'string').map(item => ({ ...item, retention: file })))
const inputs = []
function mapped(suffix, expected) {
  const candidates = mappings.filter(item => item.path.endsWith(suffix) && (!expected || item.sha256 === expected))
  assert.ok(candidates.length, `Missing durable retention mapping: ${suffix}`)
  const item = candidates[0]
  const file = path.resolve(base, item.path)
  assert.ok(file.startsWith(base + path.sep))
  assert.equal(fs.realpathSync(file), file)
  assert.equal(hash(file), item.sha256)
  const binding = { ...bind(file), retention: item.retention }
  inputs.push(binding)
  return file
}
const report149 = mapped('source149150-and147-glyph-independent-review-08/report.json')
const report156 = mapped('source155156-and151-affected-independent-review-09/report.json')
const reportAffected = mapped('source155157158-affected-review-10/report.json')
const report159 = mapped('source159-period-affected-review-11/report.json')
const affected = read(reportAffected)
assert.equal(affected.affected_status, 'PASS')
for (const id of ['D157-01', 'D158-01', '155-count-separator', '155-footnote-owner438'])
  assert.equal(affected.changes.find(item => item.id === id).verdict, 'PASS')
const source156 = read(report156)
const page156Review = source156.pages.find(item => item.physical === 156)
assert.equal(page156Review.source, 'PASS')
const rightReview = read(report159)
assert.ok(rightReview.affectedRepair.verdict.startsWith('PASS'))
assert.equal(rightReview.preservedEvidence.actual33RightBoundary.verdict, 'PASS')

const sourcePages = [
  [149, mapped('source6g149150-author-first-06/artifacts/6-8g/pages/0149/page.json')],
  [155, mapped('source155-footnote-owner-repair-09/artifacts/6-8g/pages/0155/page.json',
    affected.changes.find(item => item.id === '155-footnote-owner438').after_candidate_sha256)],
  [156, mapped('source6g155156-author-first-08/artifacts/6-8g/pages/0156/page.json',
    page156Review.candidateBindings.pageJsonSha256)],
  [157, mapped('source157158-literal-repair-10/artifacts/6-8g/pages/0157/page.json',
    affected.changes.find(item => item.id === 'D157-01').after_candidate_sha256)],
  [158, mapped('source157158-literal-repair-10/artifacts/6-8g/pages/0158/page.json',
    affected.changes.find(item => item.id === 'D158-01').after_candidate_sha256)],
  [159, mapped('source159-period-repair-11/artifacts/6-8g/pages/0159/page.json',
    rightReview.affectedRepair.after.sha256)],
]
for (const [number, file] of sourcePages) {
  const target = path.join(book, 'pages', String(number).padStart(4, '0'), 'page.json')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.symlinkSync(path.relative(path.dirname(target), file), target)
}
fs.mkdirSync(path.join(book, 'figures'), { recursive: true })
for (const [number, sourcePage] of [[209, 156], [210, 156], [211, 156], [212, 157]]) {
  const suffix = sourcePage === 156
    ? `source6g155156-author-first-08/work/6-8g/pages/0156/figures/fig-${number}.png`
    : 'source6g157158-author-first-09/work/6-8g/pages/0157/figures/fig-212.png'
  const source = mapped(suffix)
  const expected = sourcePage === 156
    ? source156.figures.find(item => item.id === `fig-${number}`).cropSha256
    : affected.changes.find(item => item.id === 'D157-01').repair_crop_actual_sha256
  assert.equal(hash(source), expected)
  fs.copyFileSync(source, path.join(book, 'figures', `fig-${number}.png`), fs.constants.COPYFILE_EXCL)
}
const toc = path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json')
const card = read(toc).contents.flatMap(chapter => chapter.lessons ?? [])
  .flatMap(section => section.topics ?? []).find(item => item.id === requestedLesson)
assert.equal(card.printedNumber, 33)
assert.equal(card.page, 145)
inputs.push(bind(toc), ...retentionFiles.map(bind), bind(path.join(own, 'assemble-scoped.py')))

const commands = []
function run(stage, argv) {
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  for (const kind of ['stdout', 'stderr']) {
    const file = path.join(own, `${stage}.${kind}`)
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
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const assembly = run('assemble', [
  python, '-B', path.join(own, 'assemble-scoped.py'), repo, book, path.join(work, '6-8g'),
])
let nativeLesson = null
let counts = null
let preparation = null
const outputs = []
if (fs.existsSync(path.join(book, 'book.json'))) {
  const index = read(path.join(book, 'book.json'))
  outputs.push(bind(path.join(book, 'book.json')))
  assert.equal(index.lessons.length, 1)
  nativeLesson = index.lessons[0].id
  const raw = path.join(book, 'lessons', nativeLesson)
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) outputs.push(bind(path.join(raw, name)))
  const lesson = read(path.join(raw, 'lesson.json'))
  const exercises = read(path.join(raw, 'exercises.json'))
  assert.deepEqual(exercises.exercises.map(item => item.number), ['441', '442', '443', '444', '445'])
  assert.deepEqual(lesson.figures.map(item => item.id), ['fig-209', 'fig-210', 'fig-211', 'fig-212'])
  assert.ok(!lesson.prose.some(item => (item.source_refs ?? []).includes('p0155#8')))
  assert.ok(!lesson.prose.some(item => (item.source_refs ?? []).some(ref =>
    /^p0160#/.test(ref) || (/^p0159#/.test(ref) && Number(ref.split('#')[1]) >= 5))))
  counts = {
    proseBlocks: lesson.prose.length,
    textProseBlocks: lesson.prose.filter(item => item.kind === 'p').length,
    exercises: exercises.exercises.length, figures: lesson.figures.length,
  }
  if (assembly.exitCode === 0) {
    preparation = run('adapt-prepare', [
      python, '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
      '--book', '6-8g', '--root', path.join(own, 'artifacts'), '--work', work,
      '--edition', 'modern-us-neutral', '--lesson', nativeLesson,
    ])
    const templates = path.join(work, 'adapt/6-8g/modern-us-neutral/lessons', nativeLesson)
    for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json'])
      if (fs.existsSync(path.join(templates, name))) outputs.push(bind(path.join(templates, name)))
  }
}
for (const number of [209, 210, 211, 212]) outputs.push(bind(path.join(book, 'figures', `fig-${number}.png`)))
const nativeCardBound = nativeLesson === requestedLesson
const manifest = {
  status: assembly.exitCode === 0 && preparation?.exitCode === 0
    ? (nativeCardBound ? 'N33_RAW_AND_MODERN_TEMPLATES_PREPARED_NOT_APPROVED'
      : 'N33_BOUNDED_NATIVE_RAW_AND_TEMPLATES_PREPARED_TOC_ID_HOLD')
    : 'N33_PARTIAL_PREPARATION_WITH_NATIVE_FAILURE',
  requestedLesson, nativeLesson, nativeCardBound, counts,
  boundary: {
    leftInclusive: 'p0155#6', rightExclusive: 'p0159#5',
    physicalPages: [155, 156, 157, 158, 159], printedPages: [145, 146, 147, 148, 149],
    ancestorRefs: ['p0149#2', 'p0149#3'],
    excludedOwnedFootnote: { ref: 'p0155#8', ownerExercise: '438', reason: 'Outside N33 object ownership' },
    exercises: ['441', '442', '443', '444', '445'], figureIds: ['fig-209', 'fig-210', 'fig-211', 'fig-212'],
    rightBoundaryReview: bind(report159),
    N34And160IncludedInOutputs: false,
  },
  inputs, sourcePageLinks: sourcePages.map(([physical, file]) => ({ physical, ...bind(file) })),
  reportsReusedNotCopiedOrRerun: [report149, report156, reportAffected, report159].map(bind),
  commands, outputs,
  firstTechnicalFailure: {
    argv: ['node', path.join(own, 'prepare.mjs')], cwd: repo, exitCode: 1,
    error: "TypeError: Cannot read properties of undefined (reading 'endsWith')",
    location: 'prepare.mjs mapped(): historicalContractOrRuntime hash-only mapping has no path',
    nativeProducerCallsBeforeFailure: 0,
    recovery: 'Select only mappings with a string path; preserve historical hash-only entries in their original retention files.',
  },
  holds: [
    ...affected.preserved_holds_and_failures,
    ...page156Review.findings.filter(item => item.disposition === 'HOLD'),
    {
      id: '445-raised-stars', sourceIdentity: 'UNKNOWN', sourceRole: 'UNKNOWN',
      sourceCount: rightReview.preservedEvidence.raised445StarCount,
      review: bind(report159),
    },
    ...(nativeCardBound ? [] : [{
      id: 'native-N33-TOC-id-binding', status: 'HOLD',
      exactGap: 'Unchanged assemble.SEC_NUM does not accept the saved U+25BC in p0155#6; number remains null and native TOC claiming cannot bind geo68-c3-s1-n33.',
      disposition: 'Native generated id used only for bounded draft templates; no forced id, heading substitution, policy edit or whole-lesson approval.',
    }]),
  ],
  imageLoads: 0, imageDecodes: 0, modernImagesGenerated: 0,
  rawFigureReuse: 'Opaque bytes from saved, hash-bound reviewed PNGs only',
  wholeLessonApproved: false, independentReviewPerformed: false,
  authored: false, finalized: false, published: false,
  networkPaidDependenciesGitMessagesSubagents: 0,
  writesOnlyWithin: own,
}
save(path.join(own, 'manifest.json'), manifest)
console.log(JSON.stringify({ manifest: bind(path.join(own, 'manifest.json')), status: manifest.status, nativeLesson, counts }))
