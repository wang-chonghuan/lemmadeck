import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-native144-151-and168-171-stageA'
assert(!fs.existsSync(output))
const copied = []
function copy(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink())
  assert(!['.env', '.venv', 'node_modules', '__pycache__'].includes(path.basename(from)))
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true })
    for (const name of fs.readdirSync(from).sort()) copy(`${from}/${name}`, `${to}/${name}`)
    return
  }
  assert(stat.isFile())
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  const bytes = fs.readFileSync(from)
  assert(bytes.equals(fs.readFileSync(to)))
  copied.push({ source: from, retained: to, bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex') })
}
for (const [source, destination] of [
  ['production-counter144-151-native-types', '144-151-native-types'],
  ['production-source10c168-171-review', '168-171-stageA'],
  ['production-retain-native144-151-stageA168-once.mjs', 'production-retain-native144-151-stageA168-once.mjs'],
]) copy(`${ticket}/${source}`, `${output}/${destination}`)
const result = { copied, totalFiles: copied.length,
  totalBytes: copied.reduce((sum, item) => sum + item.bytes, 0), exclusions: [],
  consumption: 'Inherited nativeTYPE full report/scripts/10 actual command vectors and rawstream projections consumed202823/27a3a1/86854e; complete ledger/finalbindings081a7d,76bindingsMATCH_ONCE2dfd0c.168StageA full report/four inventories/ledger/freeze/commands and reconstructed instruction projections consumed3eb7e4/6ca8d1/16039d,18bindingsMATCH_ONCE16039d.',
  statement: 'Seven native crops remain UNKNOWN. No exclusion/retry/source/count/tool/test change.168StageA source-only, author not yet disclosed;171 tail OPEN and literal two exp_a subscripts preserved. Parent-agent transport is not fresh human pixel authority. No model images or gates rerun.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes }))
