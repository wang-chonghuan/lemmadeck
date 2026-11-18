import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const out = path.join(tmp, 'd768-n79-n82-promotion')
const durable = path.join(ticket, 'evidence/reports/d768-n79-n82')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const modern = path.join(raw, 'editions/modern-us-neutral')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bind(file)
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
  return bind(to)
}
const indexPath = path.join(ticket, 'evidence/index.json')
const meterPath = path.join(ticket, 'production-meter.json')
const index = read(indexPath)
const meter = read(meterPath)
assert.equal(meter.imageCalls, 12)
assert.equal(meter.sourcePagesFinalized, 459)
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, ['phy10-c2-s2-n76', 'phy10-c2-s2-n77'])
const byHash = new Map(index.reports.map((item) => [item.sha256, item]))
function retain(file, relative) {
  const hash = sha(file)
  const existing = byHash.get(hash)
  if (existing && fs.existsSync(path.resolve(repo, existing.path))) return existing
  const item = { ...copy(file, path.join(durable, relative)), originalPath: path.relative(repo, file), batch: 'D033' }
  index.reports.push(item)
  byHash.set(hash, item)
  return item
}
const verify = (item) => assert.equal(sha(path.resolve(repo, item.path)), item.sha256)
const sourceIndex = read(path.join(raw, 'book.json'))
const modernBefore = read(path.join(modern, 'book.json'))
const profile = path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
function run(name, command) {
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  write(path.join(out, `${name}.receipt.json`), { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
const cards = [
  { card: 'phy10-c2-s2-n79', number: 79, nativeFolder: 'd761-n79-english-native-continuation', visualFolder: 'd764-n79-first-display-review' },
  { card: 'phy10-c2-s3-n82', number: 82, nativeFolder: 'd760-n82-bilingual-native', visualFolder: 'd765-n82-first-display-review' },
]
const rows = []
const readiness = []
for (const { card, number, nativeFolder, visualFolder } of cards) {
  const nativeFile = path.join(tmp, nativeFolder, 'report.json')
  const visualFile = path.join(tmp, visualFolder, 'report.json')
  const native = read(nativeFile)
  const visual = read(visualFile)
  assert.equal(native.status, 'BILINGUAL-NATIVE-FINALIZE-RENDER-PASS-FIRST-DISPLAY-PENDING')
  assert.equal(visual.status, 'PASS')
  assert.ok(!fs.existsSync(path.join(modern, 'lessons', card)))
  assert.ok(!fs.existsSync(path.join(raw, 'lessons', card)))
  for (const packet of native.outputs) {
    for (const item of [...packet.nativeFiles, ...packet.html]) verify(item)
    for (const figure of packet.figures) for (const item of figure.files) verify(item)
  }
  const independentDisplay = retain(visualFile, `${card}/independent-display.json`)
  for (const entry of fs.readdirSync(path.join(tmp, visualFolder), { withFileTypes: true })) {
    if (entry.isFile()) retain(path.join(tmp, visualFolder, entry.name), `${card}/display-review/${entry.name}`)
  }
  const zh = native.outputs.find((packet) => packet.locale === 'zh')
  const outputs = []
  write(path.join(out, `${card}-started.json`), {
    native: bind(nativeFile), display: independentDisplay,
    sourceAndNativeBytesVerified: true, scientificOrDisplayGatesReplayed: false,
    metadataOnlyPromotionPathsChanged: true,
  })
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    outputs.push(copy(path.join(zh.root, '10p/lessons', card, name), path.join(raw, 'lessons', card, name)))
  }
  for (const item of zh.nativeFiles) outputs.push(copy(path.resolve(repo, item.path), path.join(modern, 'lessons', card, path.basename(item.path))))
  for (const figure of zh.figures) {
    const find = (suffix) => figure.files.find((item) => item.path.endsWith(`.${suffix}`))
    const spec = path.join(modern, 'figures', `${figure.id}.spec.json`)
    const svg = path.join(modern, 'figures', `${figure.id}.svg`)
    const render = path.join(modern, 'figures', `${figure.id}.render.json`)
    const review = path.join(modern, 'figures', `${figure.id}.review.json`)
    outputs.push(copy(path.resolve(repo, find('spec.json').path), spec))
    outputs.push(copy(path.resolve(repo, find('svg').path), svg))
    const payload = read(path.resolve(repo, find('render.json').path))
    assert.equal(payload.status, 'pass')
    payload.spec.path = path.relative(repo, spec)
    payload.output.svg.path = path.relative(repo, svg)
    assert.equal(payload.spec.sha256, sha(spec))
    assert.equal(payload.output.svg.sha256, sha(svg))
    outputs.push(write(render, payload))
    run(`${card}-${figure.id}-record-review`, [
      python, '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', spec, '--render', render, '--output', review, '--status', 'pass',
      '--notes', `Exact independently reviewed source/spec/SVG and owning bilingual native/display PASS transferred without geometry, text or SVG changes. Only durable edition metadata paths rebound. Durable production evidence ${byHash.get(sha(nativeFile)).path}; owning display ${independentDisplay.path} SHA256 ${independentDisplay.sha256}.`,
    ])
    outputs.push(bind(review))
  }
  const rawLesson = read(path.join(raw, 'lessons', card, 'lesson.json'))
  const rawExercises = read(path.join(raw, 'lessons', card, 'exercises.json'))
  const lesson = read(path.join(modern, 'lessons', card, 'lesson.json'))
  const exercises = read(path.join(modern, 'lessons', card, 'exercises.json'))
  const figures = read(path.join(modern, 'lessons', card, 'figures.json'))
  const audit = read(path.join(modern, 'lessons', card, 'adaptation.audit.json'))
  assert.equal(rawExercises.count, 0)
  assert.equal(exercises.count, 0)
  assert.equal(audit.status, 'pass')
  assert.ok(!sourceIndex.lessons.some((item) => item.id === card))
  sourceIndex.lessons.push({
    id: card, card_id: card, title: rawLesson.title, number: rawLesson.number,
    start_printed: rawLesson.start_printed, prose_blocks: rawLesson.prose.length,
    exercises: 0, figures: rawLesson.figures.length,
  })
  rows.push({
    id: card, number: lesson.number, title: lesson.title,
    prose_blocks: lesson.prose.length, exercises: 0, figures: figures.figures.length,
    source_lesson_sha256: audit.sourceLessonSha256, source_exercises_sha256: audit.sourceExercisesSha256,
  })
  run(`${card}-affected-canonical-review-bindings`, [
    python, '-B', '-c',
    [
      'import sys,json',
      'from pathlib import Path',
      'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
      'from edition import validate_review',
      'edition=Path(sys.argv[1]); figures=json.loads(Path(sys.argv[2]).read_text())["figures"]',
      'errors=[]',
      'for f in figures:',
      ' errors+=validate_review(edition/f["review"],edition/f["spec"],"render",edition/f["render"],{"svg":edition/f["svg"]},f["id"])',
      'assert not errors,errors',
      'print("PASS canonical metadata-only current review bindings; unchanged lesson/native/HTML gates reused")',
    ].join('\n'),
    modern, path.join(modern, 'lessons', card, 'figures.json'),
  ])
  for (const packet of native.outputs) {
    for (const item of packet.html) retain(path.resolve(repo, item.path), `${card}/${packet.locale}/html/${path.basename(item.path)}`)
    if (packet.locale === 'en') for (const item of packet.nativeFiles) retain(path.resolve(repo, item.path), `${card}/en/native/${path.basename(item.path)}`)
  }
  const ready = {
    ticket: 'STEMROBIN-181', batch: 'D033', card, status: 'complete-unbatched-local-only',
    SOURCE: 'PASS-CLOSED-COMPOSED', SCI: 'PASS-EFFECTIVE', ZHEN: 'PASS-EFFECTIVE',
    FIG: 'PASS-EFFECTIVE', DISPLAY: 'PASS-FIRST-REPRESENTATIVE-EIGHT-IMAGES-AND-EIGHT-SURFACE-DOM',
    ANSWER: 'N/A-ZERO-SOURCE-QUESTIONS', CHOICE: 'N/A-ZERO-SOURCE-QUESTIONS',
    native: byHash.get(sha(nativeFile)), independentDisplay, outputs,
    counts: { sourceQuestions: 0, sharedModernFigures: figures.figures.length },
    displayScope: 'Eight actual representative screenshots plus complete DOM on all eight native text/exercise surfaces, with prior whole text/science and complete native figure visual reviews. Not exhaustive full-page tiles.',
    sourceSnapshotsAndNativeLessonBytesUnchanged: true,
    originalFAILsAndCumulativeUsagePreserved: true,
    englishNativeAndHTMLRetained: true, nativeFinalizeOrHTMLRepeated: false,
    affectedCanonicalMetadataReviewOnly: true, paidCalls: 0, databaseWrites: false,
    commitPushPendingBatch: true,
  }
  const readyFile = path.join(durable, `${card}-readiness.json`)
  const binding = write(readyFile, ready)
  index.reports.push({ ...binding, batch: 'D033' })
  readiness.push({ card, binding })
  meter.currentCheckpoint.completeUnbatchedCards.push(card)
  meter.currentCheckpoint.modernReadyArtifacts += 1
  Object.assign(meter.activeHumanDirection.nextSourceCheckpoints[`n${number}`], {
    status: 'COMPLETE-OFFLINE-UNBATCHED-PENDING-COMMIT-PUSH',
    completeCard: true, readiness: binding, DISPLAY: ready.DISPLAY,
  })
}
sourceIndex.audit.exercise_count = sourceIndex.lessons.reduce((sum, item) => sum + item.exercises, 0)
fs.writeFileSync(path.join(raw, 'book.json'), `${JSON.stringify(sourceIndex, null, 2)}\n`)
write(path.join(out, 'modern-rows.json'), rows)
run('modern-index', [
  python, '-B', '-c',
  'import sys,json; from pathlib import Path; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); from edition import update_book_index; update_book_index(Path(sys.argv[1]),Path(sys.argv[2]),Path(sys.argv[3]),json.loads(Path(sys.argv[4]).read_text()))',
  raw, modern, profile, path.join(out, 'modern-rows.json'),
])
assert.deepEqual(
  read(path.join(modern, 'book.json')).lessons.filter((item) => !cards.some((card) => card.card === item.id)),
  modernBefore.lessons,
)
for (const entry of fs.readdirSync(out, { withFileTypes: true })) {
  if (entry.isFile()) retain(path.join(out, entry.name), `promotion/${entry.name}`)
}
meter.currentCheckpoint.indexedSourceCards['10p'] = sourceIndex.lessons.length
meter.currentCheckpoint.nextBatch.completeCards = [...meter.currentCheckpoint.completeUnbatchedCards]
meter.currentCheckpoint.nextBatch.latestReadiness = readiness
meter.currentCheckpoint.readyDoesNotMeanDelivered = '98 pushed complete offline cards; four complete offline cards n76/n77/n79/n82 are unbatched, not committed or published.'
for (const batch of [
  { id: '01a1f0c4-0531-70e3-b87c-c503439af1b6', batch: 'd764', actualImages: 8 },
  { id: '01a1f0c6-63fd-76b1-ab05-f5a3c2ce3908', batch: 'd765', actualImages: 8 },
]) {
  meter.activeHumanDirection.ephemeralImageBatches.push({
    ...batch, status: 'COMPLETED-CLOSED', maximumImages: 8, contextLimit: 24, imagesReturnedToParent: 0,
  })
}
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
fs.writeFileSync(meterPath, `${JSON.stringify(meter, null, 2)}\n`)
console.log(JSON.stringify({ readiness, completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards, paidCalls: 12, sourcePages: 459 }))
