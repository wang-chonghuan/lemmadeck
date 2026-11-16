import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(import.meta.filename)
const bind = file => ({
  path: path.resolve(file),
  bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
})
const write = (file, data) => fs.writeFileSync(file, data, { flag: 'wx' })
const json = (file, data) => write(file, `${JSON.stringify(data, null, 2)}\n`)
assert.equal(process.cwd(), root)
assert(!fs.existsSync(path.join(out, 'author-freeze.json')))
const manifestPath = path.join(root, 'ssot-resources/soviet10year-textbooks/sources/manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const catalog = manifest.catalogs.find(item => item.book === '9p')
const record = manifest.pdfs.find(item => item.book === catalog.sourcePdf)
const pdf = path.join(root, manifest.pdfRoot, record.file)
const incoming = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d022-source216-219-correction/0219.page.md')
const inputs = path.join(out, 'bound-inputs')
fs.mkdirSync(inputs, { recursive: true })
const incomingCopy = path.join(inputs, 'incoming-0219.page.md')
fs.copyFileSync(incoming, incomingCopy, fs.constants.COPYFILE_EXCL)
const manifestSlice = path.join(inputs, 'source-manifest-9p.json')
json(manifestSlice, { manifest: bind(manifestPath), pdfRoot: manifest.pdfRoot, catalog, pdf: record })
const inputBindings = [
  bind(pdf), bind(manifestPath), bind(manifestSlice), bind(incoming), bind(incomingCopy),
  ...['tools/p2c.py', 'tools/blocks.py', 'tools/layout.py', 'tools/normalize.py',
    'tools/mathcheck.py', 'profiles/soviet-cn.json', 'SKILL.md']
    .map(file => bind(path.join(root, '.claude/skills/ld-s10y-lesson', file))),
  bind(path.join(root, '.agents/skills/ld-s10y-image/SKILL.md')),
  bind(import.meta.filename),
]
assert.equal(inputBindings[0].sha256, record.sha256)
json(path.join(out, 'inputs-before-prepare.json'), {
  ticket: 'STEMROBIN-181', invocation: 'existing-author-preparation-not-new-capability',
  bindings: inputBindings, incomingCaptionOpen: 'provisional-until-physical220-read',
})

for (const page of [220, 221, 222, 223]) {
  const work = path.join(root, `.tmp/ld-s10y-lesson/9p/pages/${String(page).padStart(4, '0')}`)
  const files = ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']
  const absent = !fs.existsSync(work)
  const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const args = ['-B', path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py'),
    'prepare', '--book', '9p', '--page', String(page)]
  const result = absent ? spawnSync(python, args, {
    cwd: root, encoding: 'utf8', timeout: 180000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  }) : { status: 0, stdout: 'Existing complete native scratch reused; prepare not called.\n', stderr: '' }
  const stdout = path.join(out, `prepare-${page}.stdout.txt`)
  const stderr = path.join(out, `prepare-${page}.stderr.txt`)
  write(stdout, result.stdout ?? '')
  write(stderr, result.stderr ?? '')
  assert(files.every(file => fs.existsSync(path.join(work, file))), `Incomplete preparation ${page}`)
  const outputs = files.map(file => bind(path.join(work, file)))
  const snapshot = path.join(inputs, 'prepared', String(page))
  fs.mkdirSync(snapshot, { recursive: true })
  const snapshots = files.map(file => {
    const destination = path.join(snapshot, file)
    fs.copyFileSync(path.join(work, file), destination, fs.constants.COPYFILE_EXCL)
    return bind(destination)
  })
  const receipt = path.join(out, `prepare-${page}.json`)
  json(receipt, {
    role: 'author-native-prepare-only', pdfPage: page, scratchInitiallyAbsent: absent,
    prepareCalls: absent ? 1 : 0, command: absent ? [python, ...args] : null,
    cwd: root, helper: bind(import.meta.filename), pdf: inputBindings[0],
    exitCode: result.status, signal: result.signal ?? null, error: result.error?.message ?? null,
    stdout: bind(stdout), stderr: bind(stderr), outputs, snapshots,
    finalizeVectorizeAssembleOrPromotion: false,
  })
  console.log(JSON.stringify({ receipt: bind(receipt), page, exitCode: result.status, stdout: result.stdout }))
  assert.equal(result.status, 0)
}
