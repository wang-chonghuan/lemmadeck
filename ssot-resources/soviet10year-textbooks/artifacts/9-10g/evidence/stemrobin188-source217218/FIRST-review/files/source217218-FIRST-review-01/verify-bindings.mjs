import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = path.dirname(new URL(import.meta.url).pathname)
const inputRoot = path.resolve(root, '../source217218-FIRST-review-inputs-01')
const phase = process.argv[2]
if (!['before', 'after'].includes(phase)) throw new Error('Expected before or after')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const definitions = [
  ['source217218', 'manifest.json', 27],
  ['affected214', 'after-FIRST-affected-supplement.json', 68],
  ['heading215', 'after-FIRST-heading-adjudication.json', 14],
]
let firstFailure = null
for (const [scope, filename, expectedCount] of definitions) {
  const manifestPath = path.join(inputRoot, filename)
  const manifestBytes = fs.readFileSync(manifestPath)
  const manifest = JSON.parse(manifestBytes)
  const records = manifest.bindings.map(binding => {
    try {
      const bytes = fs.readFileSync(binding.path)
      const actual = hash(bytes)
      return {
        path: binding.path, expectedSha256: binding.sha256, actualSha256: actual,
        bytes: bytes.length, mode: (fs.statSync(binding.path).mode & 0o777).toString(8).padStart(4, '0'),
        match: actual === binding.sha256,
      }
    } catch (error) {
      return { path: binding.path, expectedSha256: binding.sha256, match: false, error: String(error) }
    }
  })
  const currentSnapshots = (manifest.authoritativeSnapshots ?? []).map(({ current, snapshot }) => {
    try {
      const actual = hash(fs.readFileSync(current.path))
      return { path: current.path, expectedSha256: current.sha256, actualSha256: actual,
        snapshotPath: snapshot.path, match: actual === current.sha256 && current.sha256 === snapshot.sha256 }
    } catch (error) {
      return { path: current.path, match: false, error: String(error) }
    }
  })
  const mismatches = [...records, ...currentSnapshots].filter(record => !record.match)
  const result = {
    schema: 'stemrobin188-independent-binding-verification@1', phase, scope,
    manifest: { path: manifestPath, sha256: hash(manifestBytes) },
    expectedCount, observedCount: records.length, matches: records.filter(record => record.match).length,
    allMatch: records.length === expectedCount && mismatches.length === 0,
    firstFailure: mismatches[0] ?? null, records, currentSnapshots,
    hashingImagesDoesNotLoadPixelsIntoContext: true,
    noStageOrProbeExecution: true,
  }
  const output = path.join(root, `bindings-${scope}-${phase}.json`)
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify({ scope, phase, expected: expectedCount, observed: records.length,
    matched: result.matches, currentSnapshotsMatched: currentSnapshots.filter(record => record.match).length,
    allMatch: result.allMatch, output, firstFailure: result.firstFailure }))
  if (!result.allMatch && firstFailure === null) firstFailure = result.firstFailure ?? 'count-mismatch'
}
const ownSeals = JSON.parse(fs.readFileSync(path.join(root, 'FIRST-seals.json')))
const ownFirsts = ownSeals.FIRSTs.map(binding => {
  const bytes = fs.readFileSync(binding.path)
  const actual = hash(bytes)
  const mode = (fs.statSync(binding.path).mode & 0o777).toString(8).padStart(4, '0')
  return { ...binding, actualSha256: actual, actualBytes: bytes.length, actualMode: mode,
    match: actual === binding.sha256 && bytes.length === binding.bytes && mode === '0444' }
})
const firstOutput = path.join(root, `FIRST-verification-${phase}.json`)
fs.writeFileSync(firstOutput, JSON.stringify({ phase, allMatch: ownFirsts.every(item => item.match),
  records: ownFirsts }, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ phase, ownFIRSTsUnchangedAnd0444: ownFirsts.every(item => item.match), output: firstOutput }))
if (firstFailure !== null || ownFirsts.some(item => !item.match)) process.exitCode = 1
