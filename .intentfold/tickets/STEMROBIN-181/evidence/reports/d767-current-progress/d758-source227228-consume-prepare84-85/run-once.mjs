import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const out = path.join(tmp, 'd758-source227228-consume-prepare84-85')
const durable = path.join(ticket, 'evidence/reports/d758-source227228')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const author = path.join(tmp, 'd741-source227228-first-author')
const reviewPath = path.join(tmp, 'd749-source227228-first-review/report.json')
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
assert.equal(sha(reviewPath), '6edcd42b2b8bff08f59165485497289dde001251cab78ff94ff7ec78c4ca3def')
const review = read(reviewPath)
assert.equal(review.status, 'PASS')
for (const page of review.pages) {
  for (const item of Object.values(page.inputs)) if (item.path && item.sha256) assert.equal(sha(item.path), item.sha256)
}
const indexPath = path.join(ticket, 'evidence/index.json')
const meterPath = path.join(ticket, 'production-meter.json')
const index = read(indexPath)
const meter = read(meterPath)
assert.equal(meter.sourcePagesFinalized, 457)
const outputs = []
for (const number of [227, 228]) {
  for (const name of ['page.md', 'page.json', 'audit.json']) outputs.push(copy(path.join(author, 'root/10p/pages', `0${number}`, name), path.join(raw, 'pages', `0${number}`, name)))
  for (const extension of ['png', 'svg']) outputs.push(copy(path.join(author, 'work/10p/pages', `0${number}`, 'figures', `fig-${number - 28}.${extension}`), path.join(raw, 'figures', `fig-${number - 28}.${extension}`)))
}
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
for (const [folder, prefix] of [['d741-source227228-first-author', 'first-author'], ['d749-source227228-first-review', 'first-review']]) {
  const base = path.join(tmp, folder)
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (!['work', 'node_modules', '.venv', '.git'].includes(entry.name)) walk(file)
      } else if (!['page.png', 'page.grid.png', 'page.template.md'].includes(entry.name)) retain(file, `${prefix}/${path.relative(base, file)}`)
    }
  }
  walk(base)
}
const consumed = write(path.join(durable, 'consumed.json'), {
  ticket: 'STEMROBIN-181', status: 'SOURCE227228-FIRST-SOURCE-RAW199200-SVG-PASS-CONSUMED',
  firstReview: byHash.get(sha(reviewPath)), outputs, nativeRows: { 227: '25/25', 228: '25/25' },
  sourcePagesAdded: 2, completeCardsAdded: 0, source86Complete: false,
  nativeReplays: 0, parentNewImages: 0, paidImageCalls: 12, databaseWrites: false,
})
index.reports.push({ ...consumed, batch: 'D033' })
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const stream = []
for (const number of [222, 223, 224, 225, 226, 227, 228]) {
  for (const name of ['page.md', 'page.json', 'audit.json']) copy(path.join(raw, 'pages', `0${number}`, name), path.join(root, '10p/pages', `0${number}`, name))
  read(path.join(raw, 'pages', `0${number}`, 'page.json')).blocks.forEach((block, i) => stream.push({ ref: `p0${number}#${i + 1}`, ...block }))
}
for (const id of ['fig-196', 'fig-197', 'fig-198', 'tbl-p0226-01', 'fig-199', 'fig-200']) {
  for (const extension of ['png', 'svg']) copy(path.join(raw, 'figures', `${id}.${extension}`), path.join(root, '10p/figures', `${id}.${extension}`))
}
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
function run(name, args) {
  const command = [python, '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args, '--book', '10p', '--root', root, '--work', work]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  write(path.join(out, `${name}.receipt.json`), { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
run('assemble', ['assemble', '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json'])
const preparations = []
for (const [number, first, next] of [[84, 'p0225#5', 'p0227#2'], [85, 'p0227#2', 'p0228#3']]) {
  const card = `phy10-c2-s3-n${number}`
  const lessonFile = path.join(root, '10p/lessons', card, 'lesson.json')
  const exercisesFile = path.join(root, '10p/lessons', card, 'exercises.json')
  const lesson = read(lessonFile)
  const sourceRefs = new Set(lesson.prose.flatMap((block) => block.source_refs || []))
  const begin = stream.findIndex((block) => block.ref === first)
  const end = stream.findIndex((block) => block.ref === next)
  assert.match(stream[begin].lines.join('\n'), new RegExp(`${number}\\.`))
  assert.match(stream[end].lines.join('\n'), new RegExp(`${number + 1}\\.`))
  const core = stream.slice(begin, end)
  const attached = stream.filter((block) => sourceRefs.has(block.ref) && !core.some((item) => item.ref === block.ref))
  const frozen = write(path.join(out, `n${number}-preauthor-source-requirements.json`), {
    ticket: 'STEMROBIN-181', card, status: 'SOURCE-CLOSED-PREAUTHOR-FROZEN',
    boundary: { first, last: stream[end - 1].ref, nextHeading: next },
    blocks: [...core, ...attached], attachedSourceRefsOutsideBodyBoundary: attached.map((block) => block.ref),
    sourceQuestions: read(exercisesFile).count, figureIds: lesson.figures.map((figure) => figure.id),
    requirements: [
      'Map every faithful source block, exact formula token, number and source order; no invented exercise or historical identity.',
      'Attached footnotes follow actual printed markers even below the next heading; preserve their conditions and separate prose identity.',
      'Explain wave interference with fixed phase, relevant path difference, reflection phase changes and stated model conditions; historical discoveries remain historical.',
      'Do not invent, omit or silently approve externally referenced color plates. Source85 references actual plateIII panels1/2/3; identity and ownership remain pending.',
      'Native source assembly is not modern SCI/ZHEN/FIG/display approval; no paid repurchase or DB/publisher/deploy/merge/closure.',
    ],
    modernAuthoringBeforeFreeze: false, wholeCardApproved: false,
  })
  run(`n${number}-adapt-prepare`, ['adapt-prepare', '--edition', 'modern-us-neutral', '--lesson', card])
  const preparation = write(path.join(out, `n${number}-preparation.json`), {
    ticket: 'STEMROBIN-181', card, status: 'SOURCE-CLOSED-FIRST-TEXT-AUTHOR-READY',
    frozenRequirements: frozen, root, work, rawLesson: bind(lessonFile), rawExercises: bind(exercisesFile),
    sourceQuestions: read(exercisesFile).count, completeCard: false, databaseWrites: false,
  })
  preparations.push({ card, preparation })
  meter.activeHumanDirection.nextSourceCheckpoints[`n${number}`] = { status: 'SOURCE-CLOSED-FIRST-TEXT-AUTHOR-READY', preparation, completeCard: false }
}
meter.sourcePagesFinalized += 2
meter.currentCheckpoint.sourcePagesFinalized += 2
meter.currentCheckpoint.sourcePagesBasis += '; d758 SOURCE227228 first25/25 SOURCE/RAW199200/SVG PASS consumed. Actual85/86 headings close84/85;86 right boundary unread.'
meter.activeHumanDirection.nextSourceCheckpoints.source227228 = { status: 'PASS-CONSUMED', consumed, sourcePagesAdded: 2 }
meter.currentCheckpoint.nextBatch.latestSourceConsumption = consumed
meter.currentCheckpoint.nextBatch.latestN8485Preparation = preparations
meter.currentCheckpoint.nextBatch.sourceTotals.pages = meter.sourcePagesFinalized
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
fs.writeFileSync(meterPath, `${JSON.stringify(meter, null, 2)}\n`)
console.log(JSON.stringify({ consumed, preparations, sourcePages: meter.sourcePagesFinalized }))
