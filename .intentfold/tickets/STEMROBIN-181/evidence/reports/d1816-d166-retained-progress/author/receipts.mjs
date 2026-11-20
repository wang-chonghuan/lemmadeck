import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const base = path.dirname(fileURLToPath(import.meta.url))
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const lesson = 'phy9-c1-s1-n5'
const preparedPath = path.join(base, 'prepared.json')
const isolated = '.tmp/STEMROBIN-181/d1816-d166/root/9p'
const work = '.tmp/STEMROBIN-181/d1816-d166/work/adapt/9p'
const tool = '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'
const absolute = (p) => path.isAbsolute(p) ? p : path.join(repo, p)
const template = (edition) => `${work}/${edition}/lessons/${lesson}/lesson.template.json`
const read = (p) => JSON.parse(fs.readFileSync(absolute(p), 'utf8'))
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
function binding(p) {
  assert(!/\.(png|svg|pdf|jpe?g|webp)$/i.test(p), 'Author must not open visual source files')
  const bytes = fs.readFileSync(absolute(p))
  return { path: absolute(p), bytes: bytes.length, sha256: digest(bytes) }
}
function writeNew(p, value) {
  const target = absolute(p)
  assert(target.startsWith(`${base}/`), 'Receipts may only write inside the author directory')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.equal(process.cwd(), repo)
const phase = process.argv[2]
if (phase === 'capture') {
  const prepared = read(preparedPath)
  assert.equal(binding(preparedPath).sha256, '5efb79a88741a58874468e690138b74ca9877d117000e0f8b7c32997f03b2c04')
  const sources = prepared.reused.filter((entry) => !/\.(png|svg)$/i.test(entry.path)).map((entry) => {
    const current = binding(entry.path)
    assert.equal(current.sha256, entry.sha256, entry.path)
    assert.equal(current.bytes, entry.bytes, entry.path)
    return current
  })
  const isolatedSources = [
    `${isolated}/book.json`,
    `${isolated}/lessons/${lesson}/lesson.json`,
    `${isolated}/lessons/${lesson}/lesson.md`,
    `${isolated}/lessons/${lesson}/exercises.json`,
    ...prepared.pages.flatMap((page) => ['page.md', 'page.json', 'audit.json'].map((name) =>
      `${isolated}/pages/${String(page).padStart(4, '0')}/${name}`)),
  ].map(binding)
  const protectedTemplates = editions.flatMap((edition) => [
    `${work}/${edition}/book.template.json`,
    `${work}/${edition}/lessons/${lesson}/exercises.template.json`,
    `${work}/${edition}/lessons/${lesson}/figures.template.json`,
  ]).map(binding)
  const tools = [
    tool,
    '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
    '.claude/skills/ld-s10y-lesson/tools/edition.py',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
    path.join(base, 'receipts.mjs'),
  ].map(binding)
  const nativePreparation = ['zh', 'en'].map((locale) => {
    const dir = `.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d166-n5-${locale}-first-isolated-prepare`
    const receipt = read(`${dir}/receipt.json`)
    assert.equal(receipt.exitCode, 0)
    assert.equal(receipt.cwd, repo)
    assert(receipt.command.includes('adapt-prepare'))
    return { receipt, bindings: ['receipt.json', 'stdout.txt', 'stderr.txt'].map((name) => binding(`${dir}/${name}`)) }
  })
  const inputs = editions.map((edition) => {
    const input = template(edition)
    const document = read(input)
    assert.equal(document.prose.length, 14)
    assert.deepEqual(document.source.data, read(`${isolated}/lessons/${lesson}/lesson.json`))
    const snapshot = path.join(base, 'receipts', 'input', edition, 'lesson.template.json')
    writeNew(snapshot, fs.readFileSync(absolute(input), 'utf8'))
    return { edition, working: binding(input), snapshot: binding(snapshot) }
  })
  writeNew(path.join(base, 'input-bindings.json'), {
    schema: 'd166/text-author-input-bindings@1',
    capturedAt: new Date().toISOString(),
    prepared: binding(preparedPath),
    sources,
    isolatedSources,
    protectedTemplates,
    tools,
    nativePreparation,
    inputs,
    visualSourceFilesOpened: 0,
    visualSourceBindings: prepared.reused.filter((entry) => /\.(png|svg)$/i.test(entry.path)).map((entry) => ({
      ...entry,
      verification: 'Inherited from prepared.json; not opened, displayed or re-reviewed by this author',
    })),
  })
  console.log(JSON.stringify({ phase, preparedSha256: binding(preparedPath).sha256, templatesCaptured: inputs.length, nativePrepareReused: nativePreparation.length }))
} else if (phase === 'prose-flow') {
  const edition = process.argv[3]
  assert(editions.includes(edition))
  const receiptDir = path.join(base, 'receipts', 'prose-flow', edition)
  assert(!fs.existsSync(path.join(receiptDir, 'receipt.json')), 'Do not replay the authored-template prose-flow stage')
  const input = template(edition)
  const inputBinding = binding(input)
  const startedAt = new Date().toISOString()
  const result = spawnSync(process.execPath, [absolute(tool), absolute(input)], { cwd: repo, encoding: 'utf8' })
  writeNew(path.join(receiptDir, 'stdout.txt'), result.stdout ?? '')
  writeNew(path.join(receiptDir, 'stderr.txt'), result.stderr ?? '')
  writeNew(path.join(receiptDir, 'receipt.json'), {
    command: [process.execPath, absolute(tool), absolute(input)],
    cwd: repo,
    startedAt,
    finishedAt: new Date().toISOString(),
    exitCode: result.status,
    error: result.error ? String(result.error) : null,
    input: inputBinding,
    tool: binding(tool),
    stdout: binding(path.join(receiptDir, 'stdout.txt')),
    stderr: binding(path.join(receiptDir, 'stderr.txt')),
    stage: 'Author-only paragraph outline; not independent language/science approval',
  })
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  process.exitCode = result.status ?? 1
} else {
  throw new Error(`Unknown receipt phase: ${phase}`)
}
