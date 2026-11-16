import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g'
const root = `${ticket}/source-6g-p70-p71-notes-repair`
const author = `${ticket}/source-6g-p70-p71-author-20261116T122412Z`
const review = `${ticket}/source-6g-p70-p71-independent-review.md`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
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
const notes = {
  70: '物理页70第9块以“现在我们得到了圆周到它自身上的一个映射.”开头的陈述有较重字形强调，已由独立原图审查确认；完整字重范围为UNKNOWN，不猜测整段粗体，原文字面及印刷行界保持不变。',
  71: '物理页71第6块的对比措辞，尤其“而不能说：”，有较重字形强调；相邻否定及象的措辞亦较重，但完整字重范围为UNKNOWN，不扩展为猜测的整段粗体，原文字面及印刷行界保持不变。',
}
assert.equal(hash(review), '4c8a0e8c05ef9675e8dfe99f7f7eb1ecb1daef40841e111a31d419e65ae65e56')
const mode = process.argv[2]
if (mode === 'before') {
  assert(!fs.existsSync(root), 'Preserve first notes-only checkpoint')
  fs.mkdirSync(root)
  const targets = [70, 71].flatMap(page => ['page.md', 'page.json', 'audit.json']
    .map(name => `${source}/pages/${String(page).padStart(4, '0')}/${name}`))
  for (const file of targets) copy(file, `${root}/before/${path.relative(source, file)}`)
  const protectedFiles = [
    ...[70, 71].flatMap(page => walk(`.tmp/ld-s10y-lesson/6-8g/pages/${String(page).padStart(4, '0')}`)
      .filter(file => !/\/(?:page\.md|page\.json|audit\.json)$/.test(file))),
    ...[68, 69].flatMap(page => ['page.md', 'page.json', 'audit.json']
      .map(name => `${source}/pages/${String(page).padStart(4, '0')}/${name}`)),
    ...walk(author), review,
    `${ticket}/source-6g-p70-p71-independent-source-first.md`,
    `${source}/book.json`,
  ].map(record)
  write(`${root}/before.json`, { targets: targets.map(record), protectedFiles, notes })
} else if (mode === 'finalize') {
  const before = read(`${root}/before.json`)
  for (const item of before.protectedFiles) assert.equal(hash(item.path), item.sha256)
  for (const page of [70, 71]) {
    const number = String(page).padStart(4, '0')
    assert(!fs.existsSync(`${root}/finalize-${number}.command.json`), 'One affected finalize per page')
    const pagePath = `${source}/pages/${number}`
    const oldText = fs.readFileSync(`${root}/before/pages/${number}/page.md`, 'utf8')
    const old = split(oldText)
    const current = split(fs.readFileSync(`${pagePath}/page.md`, 'utf8'))
    const expectedMeta = structuredClone(old.meta)
    expectedMeta.notes.push(notes[page])
    assert.deepEqual(current.meta, expectedMeta, 'Notes-only manual edit')
    assert.equal(current.body, old.body, 'Literal text and physical rows unchanged')
    const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
    const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '6-8g', '--page', String(page)]
    const startedAtUtc = new Date().toISOString()
    const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
    fs.writeFileSync(`${root}/finalize-${number}.stdout.txt`, result.stdout || '', { flag: 'wx' })
    fs.writeFileSync(`${root}/finalize-${number}.stderr.txt`, result.stderr || '', { flag: 'wx' })
    write(`${root}/finalize-${number}.command.json`, {
      executable, args, cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
      exitCode: result.status, signal: result.signal, error: result.error?.message || null, invocationCount: 1,
    })
    for (const name of ['page.md', 'page.json', 'audit.json'])
      copy(`${pagePath}/${name}`, `${root}/after/pages/${number}/${name}`)
    const final = split(fs.readFileSync(`${pagePath}/page.md`, 'utf8'))
    assert.deepEqual(final.meta, expectedMeta)
    assert.equal(final.body, old.body)
    const oldJson = read(`${root}/before/pages/${number}/page.json`)
    oldJson.meta.notes.push(notes[page])
    assert.deepEqual(read(`${pagePath}/page.json`), oldJson)
    for (const item of before.protectedFiles) assert.equal(hash(item.path), item.sha256)
    console.log(result.stdout)
    assert.equal(result.status, 0, 'Preserve first affected finalize failure')
  }
  write(`${root}/after.json`, {
    targets: before.targets.map(item => record(item.path)), protectedFiles: before.protectedFiles,
    notes, audits: [70, 71].map(page => read(`${source}/pages/${String(page).padStart(4, '0')}/audit.json`)),
    limits: 'R1 notes only. Prior helper failure and INVALID unaligned comparisons retained; aligned differences UNKNOWN. No independent approval, assembly, publication or lesson completion.',
  })
} else throw new Error('Expected before or finalize')
