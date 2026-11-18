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
const durable = path.join(ticket, 'evidence/reports/d747-source225226')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const author = path.join(tmp, 'd731-source225226-first-author')
const reviewPath = path.join(tmp, 'd739-source225226-first-review/source225226-review-report.json')
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
assert.equal(sha(reviewPath), '971b650260cd69e7eaa2b7d2e65b4135b96061cf8d8c1ea1a47824e4230fa1dc')
const review = read(reviewPath)
assert.equal(review.status, 'PASS')
assert.equal(review.findings.length, 0)
for (const item of review.hash_binding.inputs) assert.equal(sha(item.path), item.sha256)
const indexPath = path.join(ticket, 'evidence/index.json')
const meterPath = path.join(ticket, 'production-meter.json')
const index = read(indexPath)
const meter = read(meterPath)
assert.equal(meter.sourcePagesFinalized, 455)
assert.equal(meter.imageCalls, 12)
assert.ok(!fs.existsSync(path.join(durable, 'consumed.json')))
const outputs = []
for (const number of [225, 226]) {
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    outputs.push(copy(path.join(author, 'root/10p/pages', `0${number}`, name), path.join(raw, 'pages', `0${number}`, name)))
  }
  const id = number === 225 ? 'fig-198' : 'tbl-p0226-01'
  for (const extension of ['png', 'svg']) {
    outputs.push(copy(path.join(author, 'work/10p/pages', `0${number}`, 'figures', `${id}.${extension}`), path.join(raw, 'figures', `${id}.${extension}`)))
  }
}
const byHash = new Map(index.reports.map((item) => [item.sha256, item]))
function retain(from, relative) {
  const hash = sha(from)
  const existing = byHash.get(hash)
  if (existing && fs.existsSync(path.resolve(repo, existing.path))) return existing
  const item = { ...copy(from, path.join(durable, relative)), originalPath: path.relative(repo, from), batch: 'D033' }
  index.reports.push(item)
  byHash.set(hash, item)
  return item
}
for (const [folder, prefix] of [
  ['d731-source225226-first-author', 'first-author'],
  ['d739-source225226-first-review', 'first-review'],
  ['d732-n82-first-bilingual-text-author', 'n82-first-text-author'],
]) {
  const base = path.join(tmp, folder)
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (!['work', 'node_modules', '.venv', '.git'].includes(entry.name)) walk(file)
      } else if (!['page.png', 'page.grid.png', 'page.template.md'].includes(entry.name)) {
        retain(file, `${prefix}/${path.relative(base, file)}`)
      }
    }
  }
  walk(base)
}
const consumed = write(path.join(durable, 'consumed.json'), {
  ticket: 'STEMROBIN-181', status: 'SOURCE225226-FIRST-SOURCE-RAW-SVG-PASS-CONSUMED',
  firstReview: byHash.get(sha(reviewPath)), outputs, sourcePagesAdded: 2,
  nativeRows: { 225: '24/24', 226: '27/27' }, completeCardsAdded: 0,
  source83Questions: 3, source84Complete: false, nativeReplays: 0,
  source218LocalHOLDUnchanged: true, paidImageCalls: 12, parentNewImages: 0,
  databaseWrites: false,
})
index.reports.push({ ...consumed, batch: 'D033' })
meter.sourcePagesFinalized += 2
meter.currentCheckpoint.sourcePagesFinalized += 2
meter.currentCheckpoint.sourcePagesBasis += '; d747 SOURCE225226 firstSOURCE/RAW/SVG PASS consumed; native22524/24,22627/27; source83 ends before actual84 heading.'
meter.activeHumanDirection.nextSourceCheckpoints.source225226 = { status: 'PASS-CONSUMED', consumed, sourcePagesAdded: 2 }
meter.activeHumanDirection.latestOrdinaryRepairClarification = {
  recordedAt: new Date().toISOString(),
  authority: 'Direct human clarification conveyed by trusted supervisor delegation during this same production invocation.',
  instruction: 'Minimally repair ordinary reversible tool/layout/scientific wording where the source is clear, FigureSpec provenance and deterministic figure defects without internal revision-count approval. Earlier FIRST failures and prior repair counts remain history, not permanent stops. Reuse PASSs; review affected content only.',
  remainingBoundaries: 'Real source ambiguity, lost paid fig181 bytes and spending limits remain binding; no repurchase. No DB/publisher/deploy/merge/closure or outgoing supervisor/worker-chat messages.',
  priorFailuresAndUsageReset: false,
}
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const pages = []
for (const number of [222, 223, 224, 225, 226]) {
  for (const name of ['page.md', 'page.json', 'audit.json']) copy(path.join(raw, 'pages', `0${number}`, name), path.join(root, '10p/pages', `0${number}`, name))
  pages.push(read(path.join(raw, 'pages', `0${number}`, 'page.json')))
}
for (const id of ['fig-196', 'fig-197', 'fig-198', 'tbl-p0226-01']) {
  for (const extension of ['png', 'svg']) copy(path.join(raw, 'figures', `${id}.${extension}`), path.join(root, '10p/figures', `${id}.${extension}`))
}
const stream = pages.flatMap((page) => page.blocks.map((block, index) => ({
  ref: `p${String(page.meta.page).padStart(4, '0')}#${index + 1}`, ...block,
})))
const first = stream.findIndex((block) => block.ref === 'p0222#5')
assert.equal(stream[first].kind, 'h3')
assert.match(stream[first].text, /^83\./)
const last = stream.findIndex((block, i) => i > first && block.kind === 'h3')
assert.match(stream[last].text, /^84\./)
const blocks = stream.slice(first, last)
assert.equal(blocks.filter((block) => block.kind === 'ex').length, 3)
const frozen = write(path.join(out, 'preauthor-source-requirements.json'), {
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n83', status: 'SOURCE-CLOSED-PREAUTHOR-FROZEN',
  boundary: { first: stream[first].ref, last: stream[last - 1].ref, nextHeading: stream[last].ref },
  blocks, sourceQuestions: 3, figureIds: ['fig-196', 'fig-197'],
  externalColorPlateReferences: ['彩图 I', '彩图 II'],
  externalColorPlateIdentityApproved: false,
  requirements: [
    'Map every source block, formula and number/order. Preserve all three written questions and their original numbering; do not invent or omit practice.',
    'Preserve dispersion and prism/spectral/color/filter physical meaning; distinguish source historical explanations from modern conditional explanations.',
    'Actual source color-plate references I and II require bounded identification and ownership before modern assets are designed; do not silently omit, fabricate or infer artwork from filenames.',
    'Source83 stops before the actual source84 heading on225; source84 remains incomplete and unapproved.',
    'Bilingual prose, SCI/ZHEN, figures, answers, independently authored choices and display are separate pending gates.',
    'Source218 glyph ambiguity and lost paid181 bytes remain local HOLDs. No DB/publisher/deployment/merge/closure.',
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
  write(path.join(out, `${verb}.receipt.json`), { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
assert.equal(read(path.join(root, '10p/lessons/phy10-c2-s3-n83/exercises.json')).count, 3)
const preparation = write(path.join(out, 'preparation.json'), {
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n83', status: 'SOURCE-CLOSED-FIRST-TEXT-AUTHOR-READY-PLATE-IDENTITY-PENDING',
  frozenRequirements: frozen, root, work, sourceQuestions: 3,
  rawLesson: bind(path.join(root, '10p/lessons/phy10-c2-s3-n83/lesson.json')),
  rawExercises: bind(path.join(root, '10p/lessons/phy10-c2-s3-n83/exercises.json')),
  completeCard: false, databaseWrites: false,
})
meter.activeHumanDirection.nextSourceCheckpoints.n83 = { status: 'SOURCE-CLOSED-FIRST-TEXT-AUTHOR-READY-PLATE-IDENTITY-PENDING', preparation, sourceQuestions: 3, completeCard: false }
meter.currentCheckpoint.nextBatch.latestSourceConsumption = consumed
meter.currentCheckpoint.nextBatch.latestN83Preparation = preparation
meter.currentCheckpoint.nextBatch.sourceTotals.pages = meter.sourcePagesFinalized
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
fs.writeFileSync(meterPath, `${JSON.stringify(meter, null, 2)}\n`)
console.log(JSON.stringify({ consumed, preparation, sourcePages: meter.sourcePagesFinalized }))
