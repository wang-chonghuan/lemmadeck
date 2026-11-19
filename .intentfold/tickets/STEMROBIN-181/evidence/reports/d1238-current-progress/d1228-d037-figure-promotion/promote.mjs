import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const number = process.argv[2]
assert.ok(['226', '227'].includes(number))
const id = 'fig-' + number
const own = path.join(path.dirname(new URL(import.meta.url).pathname), id)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const reviewer = path.join(ticket, 'tmp', number === '226'
  ? 'd1221-n98-fig226-first-independent-review'
  : 'd1227-n99-fig227-first-independent-review')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const resolve = binding => {
  const file = path.resolve(repo, binding.path)
  assert.equal(sha(file), binding.sha256, file)
  return file
}
const independentFile = path.join(reviewer, 'report.json')
assert.equal(String(read(independentFile).status).toUpperCase(), 'PASS')
const review = read(path.join(reviewer, id + '.review.json'))
assert.equal(review.status, 'pass')
const specFile = resolve(review.spec)
const renderFile = resolve(review.render)
const svgFile = resolve(review.outputs.svg)
resolve(review.source)
const spec = read(specFile)
const target = path.join(repo,
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/figures', id)
const source = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures', id + '.png')
assert.equal(sha(source), spec.source.image.sha256)
save(path.join(own, 'started.json'), {
  status: 'APPROVED-PATH-REBIND-ONLY', independent: bind(independentFile),
  spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
})
spec.source.image.path = path.relative(repo, source)
save(target + '.spec.json', spec)
fs.copyFileSync(svgFile, target + '.svg', fs.constants.COPYFILE_EXCL)
assert.equal(sha(target + '.svg'), review.outputs.svg.sha256)
const render = read(renderFile)
assert.equal(render.status, 'pass')
render.spec = bind(target + '.spec.json')
render.output.svg = bind(target + '.svg')
save(target + '.render.json', render)
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', target + '.spec.json', '--render', target + '.render.json',
  '--output', target + '.review.json', '--status', 'pass', '--notes',
  `Inherited FIRST independent PASS ${sha(independentFile)}. Source/render paths rebound only; unchanged source and SVG bytes. No native render or substantive review replay, no complete-card claim.`]
const result = spawnSync(command[0], command.slice(1), {
  cwd: repo, encoding: 'utf8', timeout: 120000,
})
save(path.join(own, 'record-review.receipt.json'), {
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  error: result.error?.message ?? null,
})
assert.equal(result.status, 0, result.stdout + result.stderr)
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', figure: id,
  status: 'APPROVED-FIGURE-DURABLE-PATH-REBIND-PASS',
  independent: bind(independentFile),
  outputs: ['spec.json', 'svg', 'render.json', 'review.json'].map(ext => bind(target + '.' + ext)),
  nativeRenderReplays: 0, parentImageOpens: 0, paidCalls: 0, completeCard: false,
})
console.log(JSON.stringify({ figure: id, status: 'PASS-DURABLE', completeCard: false }))
