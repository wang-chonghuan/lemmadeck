import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const manifestPath = path.join(tmp, 'd266-source180-preparation/manifest.json')
assert.equal(hash(manifestPath), 'b8e824c49cd930452d8b0a58f02ead0370c35f061a8ba5b1ea16a0bdfd0a3efd')
const manifest = read(manifestPath)
assert.deepEqual(manifest.pages, [180])
const inherited = bound(path.join(tmp, 'd260-source178179-first-author/actual-opens.json'))
assert.equal(inherited.sha256, 'f0d97d1ac6846f17f60f0663b80dae5efd68306d8e2ac8853392d9c49ae6c599')
assert.equal(read(inherited.path).budget.cumulativeContextImages, 22)
assert.equal(hash(path.resolve(root, manifest.previousAuthor.path)), manifest.previousAuthor.sha256)
assert.equal(hash(manifest.previousPage.path), manifest.previousPage.sha256)
assert.equal(hash(path.resolve(root, manifest.receipt.path)), manifest.receipt.sha256)
const previousFreezes = [
  ['d242-source177-first-author', 'fc9d6c490808b9a65cf032d9a84af87e0baa04134d3ea5f0ccc9a773cc7cb4e4'],
  ['d257-n67-fig134-first-author', '8de86cadafc7c5ad20fd9f8cab967e077869b203661e9f7b855fa2cc36026981'],
  ['d260-source178179-first-author', manifest.previousAuthor.sha256],
].map(([directory, expected]) => {
  const p = path.join(tmp, directory, 'author-freeze.json')
  assert.equal(hash(p), expected)
  const artifacts = read(p).artifacts
  for (const artifact of artifacts) assert.equal(hash(artifact.path), artifact.sha256)
  return { ...bound(p), artifacts }
})
const preparedInputs = manifest.inputs.map(input => {
  const p = path.resolve(root, input.path)
  assert.equal(hash(p), input.sha256)
  const destination = `work/10p/pages/0180/${path.basename(p)}`
  fs.mkdirSync(path.dirname(path.join(out, destination)), { recursive: true })
  fs.copyFileSync(p, path.join(out, destination), fs.constants.COPYFILE_EXCL)
  const record = { ...bound(p), destination }
  if (p.endsWith('.png')) {
    const bytes = fs.readFileSync(p)
    assert.equal(bytes.subarray(1, 4).toString('ascii'), 'PNG')
    record.nativeWidth = bytes.readUInt32BE(16)
    record.nativeHeight = bytes.readUInt32BE(20)
    assert.equal(record.nativeWidth, 1536)
    assert.equal(record.nativeHeight, 2337)
  }
  return record
})
fs.mkdirSync(path.join(out, 'source/10p/pages/0180'), { recursive: true })
const sourceFiles = [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  '.claude/skills/ld-s10y-lesson/tools/vectorize.py',
].map(p => bound(path.join(root, p)))
save('input-bindings.json', {
  schema: 'bounded-source180-first-author-inputs@1', ticket: 'STEMROBIN-181', batch: 'D033',
  manifest: bound(manifestPath), prepareReceipt: bound(path.resolve(root, manifest.receipt.path)),
  previousPage: bound(manifest.previousPage.path), previousObject: manifest.previousObject,
  preparedInputs, inherited, previousFreezes, sourceFiles,
  sourcePixelsDecodedOrViewedDuringSetup: false,
  uniqueWriteDomain: out, prepareCalls: 0, previousArtifactsVerifiedBeforeAuthoring: true,
})
save('actual-opens.json', {
  schema: 'bounded-source180-first-author-actual-opens@1', ticket: 'STEMROBIN-181',
  role: 'First source author, not independent reviewer', status: 'ACTIVE',
  inherited,
  budget: {
    inheritedImages: 22, newImages: 0, cumulativeContextImages: 22,
    batchMaximum: 2, contextMaximum: 24, reset: false,
    reopens: 0, cropsOpened: 0, previewsOpened: 0, screenshotsOpened: 0, parentImagesOpened: 0,
  },
  plannedInputs: preparedInputs.filter(i => i.path.endsWith('.png')),
  attempts: [], opens: [], zeroImagesAfterThisBatch: true,
})
console.log(JSON.stringify({
  inputBindings: bound(path.join(out, 'input-bindings.json')),
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  preparedCopies: preparedInputs.length, inheritedImages: 22, maximumNewImages: 2,
  previousTail: manifest.previousObject,
}, null, 2))
