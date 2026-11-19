import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const ticket = path.dirname(path.dirname(own))
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const root = path.join(own, 'root')
const work = path.join(own, 'work')
const recovery = fs.existsSync(path.join(own, 'assemble-FIRST.json'))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (recovery && fs.existsSync(to)) {
    assert.equal(sha(from), sha(to))
    return
  }
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
const receipt = path.join(ticket, 'evidence/reports/d1262-source270273-consumed/consumed.json')
assert.equal(read(receipt).status, 'PASS-COMPOSED-SEQUENTIALLY-CONSUMED-ONCE')
const pages = []
const stream = []
for (let number = 269; number <= 273; number++) {
  const page = String(number).padStart(4, '0')
  for (const name of ['page.md', 'page.json', 'audit.json'])
    copy(path.join(raw, 'pages', page, name), path.join(root, '10p/pages', page, name))
  assert.deepEqual(read(path.join(raw, 'pages', page, 'audit.json')).errors, [])
  pages.push(bind(path.join(raw, 'pages', page, 'page.json')))
  read(path.join(raw, 'pages', page, 'page.json')).blocks.forEach((block, index) =>
    stream.push({ ref: `p${page}#${index + 1}`, ...block }))
}
const calls = recovery ? [bind(path.join(own, 'assemble-FIRST.json'))] : []
const run = (label, args) => {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args,
    '--book', '10p', '--root', root, '--work', work]
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 12 * 1024 * 1024,
  })
  calls.push(save(path.join(own, label + '.json'), {
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }))
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
if (!recovery)
  save(path.join(own, 'started.json'), { stage: 'FIRST-N101-T11-ASSEMBLY', receipt: bind(receipt) })
run(recovery ? 'assemble-recovery-1' : 'assemble-FIRST',
  ['assemble', '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json'])
const n101 = 'phy10-c2-s4-n101'
const t11 = 'phy10-c2-s4-t11'
const definitions = [
  [n101, 'p0269#1', 'p0272#4', 4],
  [t11, 'p0272#4', 'p0273#1', 3],
]
const cards = []
for (const [card, first, next, questions] of definitions) {
  const left = stream.findIndex(item => item.ref === first)
  const right = stream.findIndex(item => item.ref === next)
  assert.ok(left >= 0 && right > left)
  const blocks = stream.slice(left, right).filter(item => item.kind !== 'foot')
  assert.equal(blocks.filter(item => item.kind === 'fig').length, 0)
  assert.equal(blocks.filter(item => item.kind === 'ex').length, questions)
  assert.equal(blocks.filter(item => !['h3', 'exhead'].includes(item.kind)).at(-1).open, false)
  const source = path.join(root, '10p/lessons', card)
  assert.equal(read(path.join(source, 'exercises.json')).count, questions)
  const requirements = save(path.join(own, 'cards', card, 'source-requirements.json'), {
    ticket: 'STEMROBIN-181', batch: 'D037', card, status: 'SOURCE-CLOSED-PREAUTHOR-FROZEN',
    boundary: { first, last: blocks.at(-1).ref, nextHeading: next },
    pages, blocks, sourceQuestions: questions, sourceFigures: [],
    rawLesson: bind(path.join(source, 'lesson.json')),
    rawExercises: bind(path.join(source, 'exercises.json')),
    n102RemainsOpen: true, completeCard: false,
  })
  cards.push({ card, sourceQuestions: questions, requirements })
}
assert.deepEqual(read(path.join(root, '10p/lessons', t11, 'lesson.json')).prose, [])
run('adapt-prepare-FIRST', ['adapt-prepare', '--edition', 'modern-us-neutral',
  ...cards.flatMap(item => ['--lesson', item.card])])
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', status: 'FIRST-ASSEMBLED-PREPARED-N101-T11',
  root, work, cards, calls, sourceReceipt: bind(receipt),
  nativePassReplays: 0, parentImageOpens: 0, paidCalls: 0,
  completeCardsAdded: 0, n102RemainsOpen: true,
})
console.log(JSON.stringify({ status: 'FIRST-ASSEMBLED-PREPARED-N101-T11', cards: cards.map(item => item.card) }))
