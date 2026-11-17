import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = `${ticket}/production-modern10c114-offline-harness-correction`
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-114-offline-harness-correction'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const matched = new Map()
function bind(item) {
  if (matched.has(item.path)) {
    assert.deepEqual(matched.get(item.path), { bytes: item.bytes, sha256: item.sha256 })
    return
  }
  const bytes = fs.readFileSync(item.path)
  assert.equal(bytes.length, item.bytes)
  assert.equal(hash(bytes), item.sha256)
  matched.set(item.path, { bytes: item.bytes, sha256: item.sha256 })
}
assert(!fs.existsSync(output), 'Only the first retention')
bind({
  path: path.resolve(`${source}/complete-manifest.json`), bytes: 41131,
  sha256: '64787b5e5116f950a47d33cb733e6faded57b0d0157d06d8ee5a9ab43d80eaa6',
})
bind({
  path: path.resolve(`${source}/supplement-manifest.json`), bytes: fs.statSync(`${source}/supplement-manifest.json`).size,
  sha256: '224c07814ef8f49a1cfc51f1bdb68e5a0640b6eb20df2ae9f903d143e7637ca1',
})
const manifest = read(`${source}/complete-manifest.json`)
const supplement = read(`${source}/supplement-manifest.json`)
assert.equal(manifest.status, 'PASS_OFFLINE_ONLY')
assert.equal(supplement.completeManifestExclusionsCovered, true)
for (const item of [
  manifest.inheritedFreeze,
  ...manifest.originalInputs.flatMap(item => [item.original, item.firstFrozenSnapshot]),
  ...manifest.inheritedOriginalPrograms, ...manifest.inheritedGuidanceReceipts,
  manifest.configuredBrowserRuntimeInputs.node, manifest.configuredBrowserRuntimeInputs.chromium,
  manifest.configuredBrowserRuntimeInputs.playwrightPackage,
  manifest.actualLaunchedBrowserExecutable, manifest.actualLaunchedBrowserEvidence,
  ...manifest.runtimeInputs, ...manifest.outputs, ...supplement.outputs,
]) bind(item)
const files = []
function collect(from, retained) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink())
  assert(!['.env', 'node_modules', '.venv', '__pycache__'].includes(path.basename(from)))
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) collect(`${from}/${name}`, `${retained}/${name}`)
  } else {
    assert(stat.isFile())
    const bytes = fs.readFileSync(from)
    files.push({ source: from, retained, bytes: bytes.length, sha256: hash(bytes) })
  }
}
collect(source, `${output}/corrected-package`)
collect(`${ticket}/production-retain114-corrected-offline-once.mjs`, `${output}/production-retain114-corrected-offline-once.mjs`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  totalFiles: files.length, totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  uniqueMatchedBindings: matched.size, copied: files, exclusions: [],
  consumption: 'Inherited81db3d/2b2f53/c4b669/ed0df4/03e137/2f5ac0/e91740. Finalfindings/acceptanced4fafb; completeall-fieldmanifest5a6513 supplementspriortruncatedeb0282; sealprograms2f3f9c/launcherfab908; actualsealvectors/rawstreams63bb5b. All56paragraphrows/192wrappers(two95textplus2heading)29d1ec/f99578 and foursurfaces/52proseMath/10scrollvectors9812e5. Prior49926d/c94191truncationsnotclaimedfull. Parent45eac0read-onlyprojectionTypeErroronabsentscrollChecks,no gate or filechange. Parent24/24zeroimageopens; numerical projections not parent pixel judgments.',
  qualification: 'Single corrected harness and first actual isolated headless browser observation only; independent Noether visual PASS,6/8batch6/24lifetime0reopens. No original freeze/PASS rerun, no lesson/HTML/library change, no further retry. Prior first-package parseFAIL/UNKNOWN preserved unchanged. copy-bindings browser-check destination SHA is historical BEFORE-patch, not current corrected-file binding; current output manifest supplies current SHA. Frozen authorization wording refers to parent-agent delegated instruction under existing human scope, not a new direct human pixel grant. No product/auth/quiz/DB/headed-OS/full-book acceptance. All inherited FAIL/HOLD/UNKNOWN remain.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  uniqueMatchedBindings: matched.size, exclusions: [] }))
