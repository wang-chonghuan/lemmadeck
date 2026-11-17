import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source168-author155-retry156-first'
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
  ['production-source10c168-171-author', '168-171-author'],
  ['production-source155-triangle-retry', '155-retry'],
  ['production-source10c156-159-first-finalize', '156-159-first-finalize'],
  ['production-finalize155-triangle-retry-once.mjs', 'production-finalize155-triangle-retry-once.mjs'],
  ['production-finalize10c156-159-first-once.mjs', 'production-finalize10c156-159-first-once.mjs'],
  ['production-retain168-author155retry156first-once.mjs', 'production-retain168-author155retry156first-once.mjs'],
]) copy(`${ticket}/${source}`, `${output}/${destination}`)
const result = { copied, totalFiles: copied.length,
  totalBytes: copied.reduce((sum, item) => sum + item.bytes, 0), exclusions: [],
  consumption: '168author full content/scripts/actual streams consumed;63bindingsMATCH_ONCE7c2f9d.155retry and156-159first full actual commands/audits/pageJSONsemantics consumed0cb488.',
  qualification: 'Executed155helper type-filter clause compared empty arrays; correct kind projection9899e2MATCH actual1figure. Audit geometry assertion was valid. Original used helper retained unchanged; no finalizer rerun.',
  statement: '15525/25PASS;15625/25PASS;15724/24PASS;15820/19FAIL;15922/22PASS. No further source/inventory/whole-unit approval. No model images or gates rerun.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes }))
