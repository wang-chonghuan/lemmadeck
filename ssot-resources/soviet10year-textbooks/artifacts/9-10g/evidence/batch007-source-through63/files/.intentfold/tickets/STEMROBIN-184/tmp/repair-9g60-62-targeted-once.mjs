import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = `${ticket}/source-9g-p60-p62-targeted-repair-evidence`
const review = `${ticket}/source-9g-p60-p62-independent-review-after-disclosure.md`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const record = file => ({ path: file, sha256: hash(file) })
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  return entry.isDirectory() ? walk(file) : [file]
})
const changes = {
  '0060': [
    ['无章标题、无独立h3标题。', '无章标题，该标题按单元起始语义以h3记录，未另造印刷标题。'],
    ['<!-- h2 -->\n§16. 空间的方向', '<!-- h3 -->\n§16. 空间的方向'],
    ['（图62，а）那么', '（图62，а），那么'],
  ],
  '0061': [['（图63，а）. 如果', '（图63，а），如果']],
  '0062': [
    ['没有实际章标题或h3标题。', '无章标题；§17印刷标题按单元起始语义以h3记录，未另造标题。'],
    ['$CD$的相互位置如何？', '$CD$的相关位置如何？'],
    ['<!-- h2 -->\n§17. 向量', '<!-- h3 -->\n§17. 向量'],
  ],
}
assert.equal(hash(review), 'a11557d938fcec548ca638a1d9f4443ab1046686f0c26d3ec69c7cdbc10bef94')
const mode = process.argv[2]
if (mode === 'before') {
  assert(!fs.existsSync(root), 'Preserve first repair evidence')
  fs.mkdirSync(root)
  const targets = []
  for (const id of Object.keys(changes))
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const file = `${source}/pages/${id}/${name}`
      copy(file, `${root}/before/${id}/${name}`)
      targets.push(record(file))
    }
  const protectedFiles = [
    review, `${ticket}/source-9g-p60-p63-independent-source-first.md`,
    `${ticket}/source-9g-p60-p63-author.md`, `${ticket}/source-9g-p60-p63-author.manifest.json`,
    `${source}/book.json`,
    ...['lesson', 'exercises'].map(name => `${source}/editions/modern-us-neutral/lessons/geo910-c1-s1-t14/${name}.json`),
    ...[59, 63].flatMap(page => ['page.md', 'page.json', 'audit.json']
      .map(name => `${source}/pages/${String(page).padStart(4, '0')}/${name}`)),
    ...[60, 61, 62].flatMap(page => walk(`.tmp/ld-s10y-lesson/9-10g/pages/${String(page).padStart(4, '0')}`)),
  ].map(record)
  write(`${root}/before.json`, { review: record(review), targets, protectedFiles, changes,
    limits: 'R1 roles+related notes, R2 frozen literal, R3 punctuation only; UNKNOWN/63/first failures unchanged.' })
} else if (mode === 'finalize') {
  const before = read(`${root}/before.json`)
  for (const item of before.protectedFiles) assert.equal(hash(item.path), item.sha256)
  for (const [id, replacements] of Object.entries(changes)) {
    assert(!fs.existsSync(`${root}/${id}.command.json`), 'Only one affected finalize per page')
    let expected = fs.readFileSync(`${root}/before/${id}/page.md`, 'utf8')
    for (const [from, to] of replacements) {
      assert.equal(expected.split(from).length, 2, `Exact single replacement: ${id}/${from}`)
      expected = expected.replace(from, to)
    }
    assert.equal(fs.readFileSync(`${source}/pages/${id}/page.md`, 'utf8'), expected, 'No unrelated source edit')
    const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
    const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
      'finalize', '--book', '9-10g', '--page', String(Number(id))]
    const startedAtUtc = new Date().toISOString()
    const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
    fs.writeFileSync(`${root}/${id}.stdout.txt`, result.stdout || '', { flag: 'wx' })
    fs.writeFileSync(`${root}/${id}.stderr.txt`, result.stderr || '', { flag: 'wx' })
    write(`${root}/${id}.command.json`, {
      executable, args, cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
      exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    })
    for (const name of ['page.md', 'page.json', 'audit.json'])
      copy(`${source}/pages/${id}/${name}`, `${root}/after/${id}/${name}`)
    console.log(result.stdout)
    assert.equal(result.status, 0, `Preserve first affected ${id} failure`)
    assert.equal(fs.readFileSync(`${source}/pages/${id}/page.md`, 'utf8'), expected)
    for (const item of before.protectedFiles) assert.equal(hash(item.path), item.sha256)
  }
  write(`${root}/after.json`, {
    targets: before.targets.map(item => record(item.path)), protectedFiles: before.protectedFiles,
    review: record(review), limits: 'Affected author evidence only, no independent PASS/assembly/image reopen/recount.',
  })
} else throw new Error('Expected before or finalize')
