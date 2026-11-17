import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = `${ticket}/production-counter140-141-ancillary-repair`
const destination = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch011-counter140-141-ancillary-partial'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(destination), 'Preserve the sole partial-repair retention')
assert.equal(hash(`${source}/hashes/manifest.json`),
  '6edfa96aee0e78d56f4e7415dce12ec9a8b0faec786133dec10809f285675df5')
for (const entry of JSON.parse(fs.readFileSync(`${source}/hashes/manifest.json`, 'utf8')).outputs) {
  assert.equal(hash(entry.path), entry.sha256)
  assert.equal(fs.statSync(entry.path).size, entry.size)
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
collect(source, `${destination}/production-counter140-141-ancillary-repair`)
collect(`${ticket}/production-retain-ancillary-partial-once.mjs`,
  `${destination}/production-retain-ancillary-partial-once.mjs`)
fs.mkdirSync(destination)
const copied = pending.map(entry => {
  fs.mkdirSync(path.dirname(entry.retained), { recursive: true })
  fs.copyFileSync(entry.source, entry.retained, fs.constants.COPYFILE_EXCL)
  assert(fs.readFileSync(entry.source).equals(fs.readFileSync(entry.retained)))
  return { ...entry, sha256: hash(entry.retained) }
})
const result = {
  totalFiles: copied.length, totalBytes: copied.reduce((n, entry) => n + entry.bytes, 0),
  copied, excluded: [], checksRerun: 0,
  qualification: 'Complete report, five scripts, new synthetic test, narrow patch, all21 command records/streams/proof gate and native140 failure consumed. All14 new synthetic cases passed once. Native140 FAIL19/18; native141 not run in this frozen bundle. No finalization authority for140.',
  subsequent141: 'A separately scoped completion of only the originally unrun native141 authorization is outside this frozen set; historical NOT_RUN seal remains unchanged.',
  holds: '134/106 held, 140 count failure held, 142 UNKNOWN no exclusion, 518 unmasked UNKNOWN, 64/65 origins UNKNOWN, 143 tail/108 OPEN.',
  completeModernBatch: false,
}
fs.writeFileSync(`${destination}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  excluded: [], checksRerun: 0, completeModernBatch: false }, null, 2))
