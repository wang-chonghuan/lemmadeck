import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const input = `${ticket}/production-114-expa-erratum`
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-114-math-erratum-before-registration'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
assert(!fs.existsSync(output), 'Unique retention; no replacement')
assert.equal(hash(fs.readFileSync(`${input}/terminalseal.json`)), '8f1611fd5050e00377ea188ef256e4bb16a422facd95e1aa96e135d4bad232c5')
const seal = load(`${input}/terminalseal.json`)
assert.equal(seal.exit_code, 0)
for (const item of [seal.stdout, seal.stderr, seal.manifest]) {
  const bytes = fs.readFileSync(`${input}/${item.path}`)
  if (item.bytes !== undefined) assert.equal(bytes.length, item.bytes)
  assert.equal(hash(bytes), item.sha256)
}
const manifest = load(`${input}/manifest.json`)
for (const item of manifest.outputs) {
  const bytes = fs.readFileSync(`${input}/${item.path}`)
  assert.equal(bytes.length, item.bytes)
  assert.equal(hash(bytes), item.sha256)
}
const inputs = load(`${input}/input-bindings.json`).inputs
for (const item of inputs) {
  if (item.sha256) assert.equal(hash(fs.readFileSync(item.path)), item.sha256)
  if (item.capture) {
    const bytes = fs.readFileSync(`${input}/${item.capture}`)
    assert.equal(hash(bytes), item.sha256 ?? item.excerpt_sha256)
  }
}
const records = load(`${input}/command-records.json`).commands
for (const record of records) {
  assert.equal(record.exit_code, 0)
  for (const stream of ['stdout', 'stderr']) {
    const bytes = fs.readFileSync(`${input}/${record[stream]}`)
    assert.equal(bytes.length, record[`${stream}_bytes`])
    assert.equal(hash(bytes), record[`${stream}_sha256`])
  }
}
const files = []
function collect(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink(), from)
  assert(!['.env', '.venv', 'node_modules', '__pycache__'].includes(path.basename(from)), from)
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) collect(`${from}/${name}`, `${to}/${name}`)
  } else {
    assert(stat.isFile())
    const bytes = fs.readFileSync(from)
    files.push({ source: from, retained: to, bytes: bytes.length, sha256: hash(bytes) })
  }
}
collect(input, `${output}/independent-math-inquiry`)
collect('ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0171', `${output}/before-source171`)
collect(`${ticket}/production-sync171-erratum-only.py`, `${output}/production-sync171-erratum-only.py`)
collect(`${ticket}/production-retain114-erratum-before-registration-once.mjs`,
  `${output}/production-retain114-erratum-before-registration-once.mjs`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  copied: files, totalFiles: files.length,
  totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  sealedOutputsMatchedOnce: manifest.outputs.length,
  inputsMatchedOnce: inputs.filter(item => item.sha256).length,
  capturedCommandsMatchedOnce: records.length,
  exclusions: [],
  consumption: 'Fullfindingsdace11/drafta489d4/twoprograms8594cd+8eec74/da3ba4/manifest0010a1/fullcommandvectors2fa071/earlybootstrap199c14/fullsourceMDa48f5c/fullsourceJSON61d5eb consumed. Contract streams reflect already consumed exact skill sections; input paragraph repetitions projected against exact complete sourceJSON. Terminal streams forwarded verbatim in prior agent tool result and terminalseal independently hashbound. Bootstrap combined outputs cannot be separated retrospectively; preserve archival limit, do not claim empty stderr.',
  parentMathematicalDecision: 'Independent parent derivation from literal and inverse premise: setting x=1 and applying injectivity forces ln(a)=1, hence a=e. For base e^2 ordinary integer powers independently give e^2 vs e^4, unequal since e>1. The adjacent exp=ln inverse uniquely provides corrected exp(x ln a); only RHS subscript removal is justified. This is mathematical erratum registration, not transcription/pixel correction. Frozen human wording means parent transport under prior scope, not new humanpixel authority.',
  sourceState: 'All original171 blocks and literal unchanged. Retained before-source171 is after sole first PASS and before NEW metadata registration. Historical first PASS records stay immutable and no PASS finalizer/line counter/math suite is rerun.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  sealedOutputsMatchedOnce: result.sealedOutputsMatchedOnce, inputsMatchedOnce: result.inputsMatchedOnce,
  capturedCommandsMatchedOnce: result.capturedCommandsMatchedOnce, exclusions: [] }))
