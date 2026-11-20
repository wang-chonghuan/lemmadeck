import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
assert.equal(own, path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-author'))
assert.equal(fs.realpathSync(own), own)
const digest = file => {
  const bytes = fs.readFileSync(file)
  return { path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length }
}
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const reportPath = path.join(own, 'report.json')
const report = load(reportPath)
assert.deepEqual(digest(report.candidate.path), report.candidate)
assert.equal(report.semanticApproval, false)
assert.equal(load(report.candidate.path).status, 'draft')
for (const file of report.bindings.before ? load(report.bindings.before.path).files : []) {
  assert.deepEqual(digest(file.source.path), file.source)
  assert.equal(digest(file.snapshotPath).sha256, file.source.sha256)
}
const files = []
function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, item.name)
    assert.equal(item.isSymbolicLink(), false, 'Output tree must not contain symlinks')
    if (item.isDirectory()) walk(file)
    else {
      assert.ok(item.isFile())
      assert.ok(!/\.(png|jpg|jpeg|webp|gif|svg|pdf)$/i.test(file), 'No image output expected')
      files.push(digest(file))
    }
  }
}
const target = path.join(own, 'outputbindings.json')
assert.equal(fs.existsSync(target), false, 'Never overwrite output seal')
walk(own)
const manifest = {
  schema: 'n46-answer-author/outputbindings@1',
  time: new Date().toISOString(),
  cwd: repo,
  ownedRoot: own,
  candidate: report.candidate,
  report: digest(reportPath),
  humanReport: digest(path.join(own, 'report.md')),
  files,
  excludes: [target],
  reasonForSelfExclusion: 'A manifest cannot include its own SHA256 without a circular digest.',
  imageFiles: 0,
  semanticApproval: false,
  promotion: false,
}
fs.writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  candidate: manifest.candidate,
  report: manifest.report,
  humanReport: manifest.humanReport,
  outputbindings: digest(target),
  outputFileCountExcludingManifest: files.length,
  images: 0,
  status: 'sealed-draft-author-evidence-not-approval',
}, null, 2))
