import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'

const root = path.dirname(new URL(import.meta.url).pathname)
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const report = read('report.json')
const source = read('source217218-review.json')
if (source.FAIL.length !== 5 || source.HOLD.length !== 9)
  throw new Error('Report count does not match source verdict')
for (const binding of report.bindings) {
  const before = read(binding.before)
  const after = read(binding.after)
  if (!before.allMatch || !after.allMatch || before.observedCount !== binding.expected
    || after.observedCount !== binding.expected || !isDeepStrictEqual(before.records, after.records)
    || !isDeepStrictEqual(before.currentSnapshots, after.currentSnapshots)
    || before.manifest.sha256 !== after.manifest.sha256)
    throw new Error(`Binding proof inconsistency: ${binding.scope}`)
}
for (const phase of ['before', 'after']) {
  if (!read(`FIRST-verification-${phase}.json`).allMatch) throw new Error('FIRST seal inconsistency')
}
const allNames = fs.readdirSync(root).filter(name =>
  !['output-index.json', 'output-index.sha256'].includes(name)).sort()
const entries = allNames.map(name => {
  const file = path.join(root, name)
  const bytes = fs.readFileSync(file)
  if (name.endsWith('.json')) JSON.parse(bytes)
  fs.chmodSync(file, 0o444)
  return { path: file, relativePath: name, bytes: bytes.length, sha256: hash(bytes), mode: '0444' }
})
const index = {
  schema: 'stemrobin188-independent-output-index@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
  root, selfExcluded: ['output-index.json', 'output-index.sha256'],
  externalIndexSHA256: path.join(root, 'output-index.sha256'),
  report: path.join(root, 'report.json'),
  files: entries, fileCount: entries.length,
  textOnly: true,
  parentMustCollectAndCloseBeforeReadingResults: true,
}
const indexPath = path.join(root, 'output-index.json')
const bytes = Buffer.from(JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(indexPath, bytes, { flag: 'wx', mode: 0o444 })
const sha = hash(bytes)
fs.writeFileSync(path.join(root, 'output-index.sha256'),
  `${sha}  output-index.json\n`, { flag: 'wx', mode: 0o444 })
const allEntriesVerified = entries.every(entry =>
  hash(fs.readFileSync(entry.path)) === entry.sha256
  && (fs.statSync(entry.path).mode & 0o777) === 0o444)
const indexVerified = hash(fs.readFileSync(indexPath)) === sha
if (!allEntriesVerified || !indexVerified) throw new Error('Output index verification failed')
console.log(JSON.stringify({ report: path.join(root, 'report.json'), index: indexPath,
  externalSHA256: path.join(root, 'output-index.sha256'), sha256: sha,
  files: entries.length, allEntriesVerified, indexVerified,
  FIRST217Mode: (fs.statSync(path.join(root, 'FIRST217.json')).mode & 0o777).toString(8),
  FIRST218Mode: (fs.statSync(path.join(root, 'FIRST218.json')).mode & 0o777).toString(8),
  readyForParentCollectionAndReviewerClose: true }, null, 2))
