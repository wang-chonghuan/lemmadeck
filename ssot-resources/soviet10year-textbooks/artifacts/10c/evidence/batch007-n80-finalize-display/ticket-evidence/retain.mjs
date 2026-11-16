import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-184/tmp')
const scratch = path.join(ticket, 'n80-finalize-display')
const book = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10c')
const edition = path.join(book, 'editions/modern-us-neutral')
const lesson = 'ana10-c6-s2-n80'
const archive = path.join(book, 'evidence/batch007-n80-finalize-display')
const report = path.join(ticket, 'ana10-n80-finalize-display-author.md')
const manifest = path.join(ticket, 'ana10-n80-finalize-display-author.manifest.json')
assert(!fs.existsSync(archive), 'Existing retention must not be overwritten')
assert(!fs.existsSync(manifest), 'Existing manifest must not be overwritten')
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const describe = file => ({ path: file, bytes: fs.statSync(file).size, sha256: sha(file) })
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
function list(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${file}`)
    return entry.isDirectory() ? list(file) : [file]
  }).sort()
}
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const commands = ['bind-approved-first', 'adapt-finalize-first', 'render-first', 'offline-first']
for (const name of commands) assert.equal(json(path.join(scratch, `${name}.result.json`)).exit, 0)
const offline = json(path.join(scratch, 'offline-first-output/report.json'))
assert.equal(offline.status, 'pass')
assert.equal(offline.results.length, 4)
const loadedNames = [
  'text-1440.png', 'exercises-1440.png', 'text-390.png', 'exercises-390.png',
  'text-390-scroll-0-end.png', 'text-390-scroll-1-end.png',
]
const screenshots = list(path.join(scratch, 'offline-first-output')).filter(file => file.endsWith('.png'))
assert.equal(screenshots.length, 12)
const screenshotDisposition = screenshots.map(file => ({
  ...describe(file), loaded: loadedNames.includes(path.basename(file)),
  basis: loadedNames.includes(path.basename(file))
    ? 'First whole offline-display visual observation; no semantic figure re-review.'
    : 'Generated and retained; not loaded into visual context.',
}))
assert.equal(screenshotDisposition.filter(row => row.loaded).length, 6)
const display = offline.results.map(result => ({
  kind: result.kind, viewport: result.viewport, count: result.count,
  docWidth: result.geometry.docWidth, sections: result.geometry.sections,
  media: result.geometry.figures.map((figure, index) => ({
    id: ['fig-10', 'fig-11'][index], width: figure.width, height: figure.height,
    labels: figure.labels.length,
    minScreenTextPx: Math.min(...figure.labels.map(label => label.pixels)),
    maxScreenTextPx: Math.max(...figure.labels.map(label => label.pixels)),
    allLabelsFit: figure.labels.every(label => label.fits),
  })),
  scroll: result.scrollScreenshots.map(row => ({
    index: row.index, clientWidth: row.clientWidth, scrollWidth: row.scrollWidth,
    actualScrollLeft: row.actualScrollLeft, maxScrollLeft: row.maxScrollLeft,
  })),
}))
const prior = ['batch007-n80-figures', 'batch007-n80-approved-text'].map(name => describe(path.join(book, 'evidence', name, 'retention.json')))
const stagePaths = [
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(name => path.join(edition, 'lessons', lesson, name)),
  path.join(edition, 'book.json'),
]
const evidenceFiles = [...list(scratch), report]
const copied = evidenceFiles.map(source => {
  const relative = source === report ? path.basename(report) : path.join('ticket-evidence', path.relative(scratch, source))
  const destination = path.join(archive, relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(source), sha(destination))
  return { source: describe(source), retained: describe(destination), relative }
})
const retentionFile = path.join(archive, 'retention.json')
write(retentionFile, {
  schema: 'STEMROBIN-184/n80-finalize-display-retention@1',
  book: '10c', edition: 'modern-us-neutral', lesson,
  disposition: {
    approvedText: 'Reuse sole parent 32-source-object / 8-task TEXT PASS.',
    approvedFigures: 'Reuse sole independent limited PASS 006a9454da2230c1e57dc160a78f7378969bd69bb2807228ed69bb784d69eadd.',
    offlineDisplay: 'PASS', wholeLesson: 'NOT_COMPLETE',
    source55: 'UNKNOWN / parse and interpretation HOLD',
    original0O: 'UNKNOWN; modern 0 explicitly text-derived',
  },
  commandInvocationCounts: Object.fromEntries(commands.map(name => [name, 1])),
  priorRetentionUnmodified: prior,
  copied,
  runtimeStage: stagePaths.map(describe),
  screenshots: screenshotDisposition,
  display,
  limits: 'First read-only isolated headless offline-display observation only; no new text/math/figure gate, answers, choices, input, DB, app, dependencies, stable tools, publication, other chat or Git.',
})
write(manifest, {
  schema: 'STEMROBIN-184/n80-finalize-display-author@1',
  observedAt: offline.observedAt,
  workspace: repo, ticket: 'STEMROBIN-184', lesson,
  disposition: { offlineDisplay: 'PASS', wholeLesson: 'NOT_COMPLETE', source55: 'HOLD', original0O: 'UNKNOWN' },
  report: describe(report),
  retainedReport: copied.find(row => row.source.path === report).retained,
  priorRetentionUnmodified: prior,
  retention: describe(retentionFile),
  runtimeStage: stagePaths.map(describe),
  scratchTemplates: ['lesson', 'exercises', 'figures'].map(name => describe(path.join(repo, '.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons', lesson, `${name}.template.json`))),
  commands: commands.map(name => ({
    name, invocationCount: 1,
    argv: describe(path.join(scratch, `${name}.argv.json`)),
    result: describe(path.join(scratch, `${name}.result.json`)),
    stdout: describe(path.join(scratch, `${name}.stdout.txt`)),
    stderr: describe(path.join(scratch, `${name}.stderr.txt`)),
  })),
  evidence: evidenceFiles.map(describe),
  screenshots: screenshotDisposition,
  imageBudget: { loaded: 6, generatedDistinctScreenshots: 12, retainedButUnloaded: 6, maximumBatch: 8, maximumContext: 24, remainingAllowedLoadsUnused: 2, crops: 0, reopened: 0 },
  display,
  stageOperation: 'Content-file staging and retention only. No Git/index operation performed.',
  limitations: [
    'Source55 HOLD blocks full completion; no answer keys, choices or count-complete.',
    'Original0/O UNKNOWN; modern0 remains text-derived, schematic regularization unmeasured.',
    'Offline headless only; not headed/OS, app card paging, quiz judging or persistence.',
    'Six generated screenshots explicitly not loaded; no whole-batch reopens.',
  ],
})
const retainedManifest = path.join(archive, path.basename(manifest))
fs.copyFileSync(manifest, retainedManifest, fs.constants.COPYFILE_EXCL)
assert.equal(sha(manifest), sha(retainedManifest))
console.log(JSON.stringify({
  report: describe(report), manifest: describe(manifest),
  retention: describe(retentionFile), retainedManifest: describe(retainedManifest),
}, null, 2))
