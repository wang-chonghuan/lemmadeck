import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const out = path.join(tmp, 'd747-source225226-consume-prepare83')
const continuation = path.join(tmp, 'd748-source83-preparation-continuation')
const durable = path.join(ticket, 'evidence/reports/d747-source225226')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bind(file)
}
const indexPath = path.join(ticket, 'evidence/index.json')
const meterPath = path.join(ticket, 'production-meter.json')
const index = read(indexPath)
const meter = read(meterPath)
assert.equal(meter.sourcePagesFinalized, 455)
const consumedPath = path.join(durable, 'consumed.json')
const consumed = read(consumedPath)
assert.equal(consumed.status, 'SOURCE225226-FIRST-SOURCE-RAW-SVG-PASS-CONSUMED')
for (const item of consumed.outputs) assert.equal(sha(path.resolve(repo, item.path)), item.sha256)
const stream = [222, 223, 224, 225, 226].flatMap((number) =>
  read(path.join(root, '10p/pages', `0${number}`, 'page.json')).blocks.map((block, index) => ({
    ref: `p0${number}#${index + 1}`, ...block,
  })))
const first = stream.findIndex((block) => block.ref === 'p0222#5')
assert.equal(stream[first].kind, 'h3')
assert.match(stream[first].lines.join('\n'), /83\./)
const end = stream.findIndex((block, i) => i > first && block.kind === 'h3')
assert.match(stream[end].lines.join('\n'), /^84\./)
const blocks = stream.slice(first, end)
assert.equal(blocks.filter((block) => block.kind === 'ex').length, 3)
const frozen = write(path.join(out, 'preauthor-source-requirements.json'), {
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n83', status: 'SOURCE-CLOSED-PREAUTHOR-FROZEN',
  boundary: { first: stream[first].ref, last: stream[end - 1].ref, nextHeading: stream[end].ref },
  blocks, sourceQuestions: 3, figureIds: ['fig-196', 'fig-197'],
  externalColorPlateReferences: ['彩图 I', '彩图 II'], externalColorPlateIdentityApproved: false,
  requirements: [
    'Map every source block, formula and number/order; preserve all three written questions and original numbering, without added practice.',
    'Preserve dispersion/prism/spectral/color/filter physical meaning; distinguish source historical explanations from modern conditional explanations.',
    'Actual source color-plate references I/II need bounded identification and ownership before asset design; no silent omission, fabricated image or filename-based identity.',
    'Source83 ends before actual84 heading on225; source84 remains incomplete and unapproved.',
    'Bilingual SCI/ZHEN, figures, independently derived answers, independently authored choices and display remain pending gates.',
    'Source218 ambiguity and lost paid181 bytes remain localHOLDs; no DB/publisher/deployment/merge/closure.',
  ],
  modernAuthoringBeforeFreeze: false, wholeCardApproved: false,
})
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
for (const [verb, extra] of [
  ['assemble', ['--toc', path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json')]],
  ['adapt-prepare', ['--edition', 'modern-us-neutral', '--lesson', 'phy10-c2-s3-n83']],
]) {
  const command = [python, '-B', path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py'), verb, '--book', '10p', '--root', root, '--work', work, ...extra]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  write(path.join(continuation, `${verb}.receipt.json`), { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
assert.equal(read(path.join(root, '10p/lessons/phy10-c2-s3-n83/exercises.json')).count, 3)
const preparation = write(path.join(out, 'preparation.json'), {
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n83', status: 'SOURCE-CLOSED-FIRST-TEXT-AUTHOR-READY-PLATE-IDENTITY-PENDING',
  frozenRequirements: frozen, root, work, sourceQuestions: 3,
  rawLesson: bind(path.join(root, '10p/lessons/phy10-c2-s3-n83/lesson.json')),
  rawExercises: bind(path.join(root, '10p/lessons/phy10-c2-s3-n83/exercises.json')),
  firstTechnicalFAIL: bind(path.join(out, 'first-failure.json')),
  completedSourceCopiesReplayed: false, completeCard: false, databaseWrites: false,
})
function register(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) register(file)
    else if (!index.reports.some((item) => item.path === path.relative(repo, file))) index.reports.push({ ...bind(file), batch: 'D033' })
  }
}
register(durable)
meter.sourcePagesFinalized += 2
meter.currentCheckpoint.sourcePagesFinalized += 2
meter.currentCheckpoint.sourcePagesBasis += '; d747/748 firstSOURCE225226/RAW/SVG PASS consumed;22524/24,22627/27. Heading-schema wrapperFAIL preserved; completed copies not replayed.'
meter.activeHumanDirection.nextSourceCheckpoints.source225226 = { status: 'PASS-CONSUMED', consumed: bind(consumedPath), sourcePagesAdded: 2 }
meter.activeHumanDirection.latestOrdinaryRepairClarification = {
  recordedAt: new Date().toISOString(),
  authority: 'Direct human clarification conveyed by trusted supervisor delegation during this same production invocation.',
  instruction: 'Minimally repair ordinary reversible tool/layout/scientific wording where source is clear, FigureSpec provenance and deterministic defects without internal revision-count approval. Prior FIRST failures and revision counts remain history, not permanent stops. Reuse PASSs and review affected content only.',
  remainingBoundaries: 'Real source ambiguity, lost paid181 bytes and spending limits remain binding; no repurchase/DB/publisher/deploy/merge/closure or outgoing supervisor/worker-chat messages.',
  oldUsageOrFailureReset: false,
}
meter.activeHumanDirection.nextSourceCheckpoints.n83 = { status: preparation.status, preparation, sourceQuestions: 3, completeCard: false }
meter.currentCheckpoint.nextBatch.latestSourceConsumption = bind(consumedPath)
meter.currentCheckpoint.nextBatch.latestN83Preparation = preparation
meter.currentCheckpoint.nextBatch.sourceTotals.pages = meter.sourcePagesFinalized
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
fs.writeFileSync(meterPath, `${JSON.stringify(meter, null, 2)}\n`)
console.log(JSON.stringify({ preparation, sourcePages: meter.sourcePagesFinalized, priorCompletedStagesReplayed: false }))
