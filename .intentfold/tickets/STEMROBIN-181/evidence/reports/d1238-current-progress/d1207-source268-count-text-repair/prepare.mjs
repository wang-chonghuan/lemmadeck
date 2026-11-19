import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const reviewFile = path.join(tmp, 'd1198-source268-first-independent-review/report.json')
assert.equal(sha(reviewFile), '7514ad18ed6319c038d0575c6d72cad582fe47d128f7d81535ff0347fe003186')
const review = read(reviewFile)
assert.equal(review.gates.NATIVE.independent_expected_native_total, 19)
const author = path.join(tmp, 'd1189-source268-first-author')
const retainedDirectories = [
  author,
  path.join(tmp, 'd1195-source268-first-native'),
  path.join(tmp, 'd1192-counter-focused-proof'),
  path.join(tmp, 'd1193-source261265-native-repair'),
  path.dirname(reviewFile),
]
const files = folder => fs.readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(folder, entry.name)
  return entry.isDirectory() ? files(file) : [file]
})
const retained = retainedDirectories.flatMap(files).map(bind)
for (const directory of ['root', 'work']) {
  const target = path.join(own, directory)
  assert.equal(fs.existsSync(target), false)
  fs.cpSync(path.join(author, directory), target, {
    recursive: true, errorOnExist: true, force: false,
  })
  const writable = folder => {
    fs.chmodSync(folder, 0o755)
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name)
      if (entry.isDirectory()) writable(file)
      else fs.chmodSync(file, 0o644)
    }
  }
  writable(target)
}
const layout = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/layout.py')
const snapshot = path.join(own, 'layout-before.py')
fs.copyFileSync(layout, snapshot, fs.constants.COPYFILE_EXCL)
fs.chmodSync(snapshot, 0o444)
const manifest = {
  schema: 'source268-recovery-start-v1',
  independentReview: bind(reviewFile),
  retained,
  layoutBefore: bind(snapshot),
  originalLayout: bind(layout),
  originalMd: bind(path.join(author, 'root/10p/pages/0268/page.md')),
  originalJson: bind(path.join(author, 'root/10p/pages/0268/page.json')),
  sourcePixels: bind(path.join(author, 'work/10p/pages/0268/page.png')),
  sourceCrop: bind(path.join(author, 'work/10p/pages/0268/figures/fig-228.png')),
}
fs.writeFileSync(path.join(own, 'started.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ status: 'PREPARED', layoutBefore: manifest.layoutBefore, retainedFiles: retained.length }))
