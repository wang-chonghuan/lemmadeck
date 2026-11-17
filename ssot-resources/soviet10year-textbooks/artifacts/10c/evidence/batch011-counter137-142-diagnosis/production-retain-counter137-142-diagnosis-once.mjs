import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = `${ticket}/production-counter137-142-diagnosis`
const destination = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch011-counter137-142-diagnosis'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(destination), 'Preserve the sole diagnostic retention')
assert.equal(hash(`${source}/report.md`),
  '2f70699cb85bdc4825f8f1dafcc4766fdcb3bc6659beafd38f97231179eede52')
assert.equal(hash(`${source}/hashes/manifest.json`),
  'e84ab98cc3b705d474c763224fde5cfd5165d2e9f2f728878963d9b00cdfddf2')
const manifest = JSON.parse(fs.readFileSync(`${source}/hashes/manifest.json`, 'utf8'))
for (const entry of manifest.outputs) {
  assert.equal(hash(`${source}/${entry.relative_path}`), entry.sha256)
  assert.equal(fs.statSync(`${source}/${entry.relative_path}`).size, entry.size)
}
const pending = []
const forbidden = new Set(['.env', '.venv', 'node_modules', '__pycache__', '8-python', '9-node'])
function collect(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink() && !forbidden.has(path.basename(from)), from)
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from)) collect(`${from}/${name}`, `${to}/${name}`)
  } else {
    assert(stat.isFile())
    pending.push({ source: from, retained: to, bytes: stat.size })
  }
}
collect(source, `${destination}/production-counter137-142-diagnosis`)
collect(`${ticket}/production-retain-counter137-142-diagnosis-once.mjs`,
  `${destination}/production-retain-counter137-142-diagnosis-once.mjs`)
fs.mkdirSync(destination)
const copied = pending.map(entry => {
  fs.mkdirSync(path.dirname(entry.retained), { recursive: true })
  fs.copyFileSync(entry.source, entry.retained, fs.constants.COPYFILE_EXCL)
  assert(fs.readFileSync(entry.source).equals(fs.readFileSync(entry.retained)))
  return { ...entry, sha256: hash(entry.retained) }
})
const result = {
  totalFiles: copied.length,
  totalBytes: copied.reduce((n, entry) => n + entry.bytes, 0),
  copied, excluded: [], checksRerun: 0,
  consumption: 'All reports/scripts/40 command arguments-exits-hashes and selected detailed streams consumed. Complete 13-envelope x 6-scale numerical projections consumed; not all repeated raw streams read verbatim.',
  qualification: 'Frozen computational diagnosis only. Retains all failures and reconstructed bootstrap disclosure. Original human wording is preserved; its parent-agent transport correction belongs in the subsequent repair report.',
  activeRepairAndNativeTasks: 'Outside this frozen set; no layout ownership release or source142 exclusion approval implied.',
  holds: '134 count FAIL14/13 and 106 HOLD; 518 UNKNOWN unmasked; 64/65 origin UNKNOWN; 143 tail and 108 OPEN.',
  completeModernBatch: false,
}
fs.writeFileSync(`${destination}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  excluded: [], checksRerun: 0, completeModernBatch: false }, null, 2))
