import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const output = `${root}/evidence/batch012-source168-stageB172-author166-first`
const stageB = `${ticket}/production-source10c168-171-review/stageB`
const author = `${ticket}/production-source10c172-175-author`
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
assert(!fs.existsSync(output), 'Retain once; no replacement')
const bindingBytes = fs.readFileSync(`${stageB}/input-outputbindings.json`)
assert.equal(hash(bindingBytes), '392cf20c5d7a9d833c126ab5272eb1a780b9d76d8768a5e34fdd425508db00a5')
const binding = JSON.parse(bindingBytes)
for (const item of binding.outputs) {
  const bytes = fs.readFileSync(item.path)
  assert.equal(bytes.length, item.bytes)
  assert.equal(hash(bytes), item.sha256)
}
assert.equal(hash(fs.readFileSync(binding.inputs.stageABindingPath)), binding.inputs.stageABindingSha256)
for (const item of binding.inputs.authorComparisonInputs) {
  assert.equal(hash(fs.readFileSync(item.authorPath)), item.sha256)
  assert.equal(hash(fs.readFileSync(item.snapshotPath)), item.sha256)
}
const manifestBytes = fs.readFileSync(`${author}/manifest.json`)
assert.equal(hash(manifestBytes), '7f5b41563fed96dd3dd9eb078cf59761c0fd3b216aa61f43aeb7790ac98e8f54')
const manifest = JSON.parse(manifestBytes)
const files = []
function collect(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink(), from)
  assert(!['.env', '.venv', 'node_modules', '__pycache__'].includes(path.basename(from)), from)
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) collect(`${from}/${name}`, `${to}/${name}`)
    return
  }
  assert(stat.isFile(), from)
  const bytes = fs.readFileSync(from)
  files.push({ source: from, retained: to, bytes: bytes.length, sha256: hash(bytes) })
}
collect(stageB, `${output}/stageB168`)
collect(author, `${output}/author172`)
collect(`${ticket}/production-source10c166-167-first-finalize`, `${output}/first166`)
collect(`${ticket}/production-finalize10c166-167-first-once.mjs`, `${output}/production-finalize10c166-167-first-once.mjs`)
for (const item of manifest.pages) collect(item.output.path,
  `${output}/author172-page-snapshots/${String(item.physical_page).padStart(4, '0')}.md`)
collect(`${ticket}/production-retain168-stageB172-author166-first-once.mjs`,
  `${output}/production-retain168-stageB172-author166-first-once.mjs`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  copied: files,
  totalFiles: files.length,
  totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  stageBMatchedBindingsOnce: binding.outputs.length + 10,
  authorBindingConsumption: 'Full manifest field projection and all 52 bindings MATCH_ONCE in f7659c; not rerun as source acceptance.',
  exclusions: [],
  consumption: '168 report/comparisons/addendum/ledger inherited full consumption; all four scripts e2da49, actual CB01-CB05 streams 6e9d42, complete terminal manifest 3e8b31. CB02 duplicate author text consumed as exact command/hash projection against previously consumed full author source. 172 full four Markdown/inventories inherited; final command vectors and streams c0228f/e0a33f with initial truncations expressly not claimed full; missing ledger/projections/004-006/seal reread d714e8/353437/b3f3b3, complete manifest projection f7659c. 166/167 first commands/audits/all JSON semantics inherited e3a09a; never rerun.',
  qualification: 'Frozen human wording means parent-agent transport under prior human scope, not fresh independent human pixels. 172 author crop claims are not independent review. 171 literal two exp_a subscripts preserved; 115 tail OPEN. All earlier HOLD/UNKNOWN and failed records unchanged. No image loaded by parent.',
  first166Timing: 'First finalizers serialized canonical 166/167 Markdown during affected164165 review. Original source hashes refer to first166 before.md snapshots, not canonical serialized output. Preserve any old transport mismatch; no rereview or rerun166167.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  stageBMatchedBindingsOnce: result.stageBMatchedBindingsOnce, exclusions: [] }))
