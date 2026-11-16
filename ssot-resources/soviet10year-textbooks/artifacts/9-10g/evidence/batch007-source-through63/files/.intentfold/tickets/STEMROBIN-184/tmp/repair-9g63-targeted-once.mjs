import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const prepared = '.tmp/ld-s10y-lesson/9-10g/pages/0063'
const page = `${source}/pages/0063`
const root = `${ticket}/source-9g-p63-targeted-repair`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file))
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? walk(file) : [file]
})
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
const split = text => {
  const marker = text.indexOf('\n---\n', 4)
  assert(marker >= 0)
  return { meta: JSON.parse(text.slice(4, marker)), body: text.slice(marker + 5) }
}
const changes = [
  ['<!-- fig 图 67 box 686,504,527,272 -->', '<!-- fig 图 67 box 718,495,512,295 -->'],
  ['定义. 如果一个空间变换', '**定义. 如果一个空间变换'],
  ['且距离$|MM_1|$等于距离$|AB|$，那么', '且距离$|MM_1|$等于距离$|AB|$；那么'],
  ['重合的点对$(A, B)$确定的向量(平移).', '重合的点对$(A, B)$确定的向量(平移).**'],
  ['叫做向量$\\overrightarrow{AB}$的方向，', '叫做**向量$\\overrightarrow{AB}$的方向**，'],
  ['而距离$|AB|$是向量\n$\\overrightarrow{AB}$的长度.',
    '而距离$|AB|$是**向量\n$\\overrightarrow{AB}$的长度**.'],
  ['为零向量. 零向量的长度', '为**零向量**. 零向量的长度'],
  ['由点对$(A, A)$给出的零向量，', '由点对$(A, A)$给出的**零向量**，'],
]
const mode = process.argv[2]
assert.equal(hash(`${ticket}/source-9g-p63-independent-review.md`),
  '08106168dc44a191a7f691739e757e8e6c528704f28221e35ad7c77a43c17afa')
assert.equal(hash(`${ticket}/source-9g-p63-emphasis-clarification.md`),
  'e38d2b53bd0353e55909a1cc470f998adbaece1b49d39ee28bdd167e13f7957e')
if (mode === 'before') {
  assert(!fs.existsSync(root), 'Preserve first targeted repair checkpoint')
  fs.mkdirSync(root)
  const targets = ['page.md', 'page.json', 'audit.json'].map(name => `${page}/${name}`)
  const crops = walk(`${prepared}/figures`)
  for (const file of targets) copy(file, `${root}/before/${path.basename(file)}`)
  for (const file of crops) copy(file, `${root}/before/figures/${path.basename(file)}`)
  const protectedFiles = [
    ...['page.png', 'page.grid.png', 'layout.json', 'page.template.md'].map(name => `${prepared}/${name}`),
    ...[59, 60, 61, 62].flatMap(number => ['page.md', 'page.json', 'audit.json']
      .map(name => `${source}/pages/${String(number).padStart(4, '0')}/${name}`)),
    `${source}/book.json`,
    ...['lesson', 'exercises'].map(name =>
      `${source}/editions/modern-us-neutral/lessons/geo910-c1-s1-t14/${name}.json`),
    `${ticket}/source-9g-p63-independent-review.md`,
    `${ticket}/source-9g-p63-emphasis-clarification.md`,
    `${ticket}/source-9g-p60-p62-affected-review.md`,
    `${ticket}/source-9g-p60-p63-independent-source-first.md`,
    'tmp/source-9g-p63-author.md', 'tmp/source-9g-p63-author.manifest.json',
    ...walk('tmp/source-9g-p63-author'),
    ...walk(`${ticket}/source-9g-p63-counter-repair`),
    ...walk(`${ticket}/source-9g-p63-row-diagnostic`),
    ...walk(`${ticket}/source-9g-p63-selection-diagnostic`),
  ].map(record)
  write(`${root}/before.json`, { targets: targets.map(record), crops: crops.map(record), protectedFiles, changes })
} else if (mode === 'finalize') {
  assert(!fs.existsSync(`${root}/finalize.command.json`), 'One affected finalize only')
  const before = read(`${root}/before.json`)
  for (const item of before.protectedFiles) assert.equal(hash(item.path), item.sha256)
  let expected = fs.readFileSync(`${root}/before/page.md`, 'utf8')
  for (const [from, to] of changes) {
    assert.equal(expected.split(from).length, 2, `Single frozen replacement: ${from}`)
    expected = expected.replace(from, to)
  }
  assert.equal(fs.readFileSync(`${page}/page.md`, 'utf8'), expected, 'No unrelated manual edit')
  const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '9-10g', '--page', '63']
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  fs.writeFileSync(`${root}/finalize.stdout.txt`, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(`${root}/finalize.stderr.txt`, result.stderr || '', { flag: 'wx' })
  write(`${root}/finalize.command.json`, {
    executable, args, cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null, invocationCount: 1,
  })
  for (const file of before.targets) copy(file.path, `${root}/after/${path.basename(file.path)}`)
  for (const file of walk(`${prepared}/figures`)) copy(file, `${root}/after/figures/${path.basename(file)}`)
  const current = split(fs.readFileSync(`${page}/page.md`, 'utf8'))
  const old = split(fs.readFileSync(`${root}/before/page.md`, 'utf8'))
  old.meta.figures.find(figure => figure.id === 'fig-67').box = [715, 504, 498, 272]
  const expectedBody = split(expected).body.replace(
    '<!-- fig 图 67 box 718,495,512,295 -->', '<!-- fig 图 67 box 715,504,498,272 -->'
  )
  write(`${root}/after.json`, {
    targets: before.targets.map(item => record(item.path)),
    crops: walk(`${prepared}/figures`).map(record),
    protectedFiles: before.protectedFiles,
    audit: read(`${page}/audit.json`),
    limits: 'Affected source/crop author repair only; all prior failures frozen, no independent approval or section completion.',
  })
  console.log(result.stdout)
  assert.equal(result.status, 0, 'Preserve first affected finalize failure')
  assert.deepEqual(current.meta, old.meta)
  assert.equal(current.body, expectedBody)
  assert.equal(hash(`${prepared}/figures/fig-66.png`),
    before.crops.find(item => item.path.endsWith('/fig-66.png')).sha256)
  for (const item of before.protectedFiles) assert.equal(hash(item.path), item.sha256)
} else throw new Error('Expected before or finalize')
