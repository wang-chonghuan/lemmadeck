import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const output = path.join(root, 'output-frozen-manifest.json')
if (fs.existsSync(output)) throw new Error('Output freeze already exists')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = JSON.parse(fs.readFileSync(path.join(root, 'report.json'), 'utf8'))
const boundInputs = Object.entries(report.boundInputs).map(([id, input]) => {
  const observed = hash(input.path)
  if (observed !== input.sha256) throw new Error(`Bound input changed: ${id}`)
  return { id, ...input, unchangedAtFreeze: true }
})
const walk = directory => fs.readdirSync(directory, { withFileTypes: true })
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error('No symlink output allowed')
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(file)
    if (!entry.isFile()) throw new Error('Unexpected non-file output')
    return [file]
  })
const files = walk(root)
for (const file of files) fs.chmodSync(file, 0o444)
const entries = files.map(file => ({
  path: file, sha256: hash(file), bytes: fs.statSync(file).size,
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0')
}))
const manifest = {
  schema: 'STEMROBIN-181/finite-figure-author-output-freeze@1',
  root, boundInputs, entries,
  everyListedOutputFrozen0444: entries.every(entry => entry.mode === '0444'),
  manifestAndFinalAuthorFreezeExcludedToAvoidSelfHashCycle: true,
  verdictAuthority: 'report.json; this generated manifest binds bytes, not visual approval.',
  newImageOpens: 0, cumulativeImageOpens: 11, imageLimit: 24,
  nativeFailuresPreserved: true, promotions: 0
}
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o444 })
console.log(JSON.stringify({
  path: output, sha256: hash(output), files: entries.length,
  allOutputs0444: manifest.everyListedOutputFrozen0444,
  boundInputsVerifiedUnchanged: boundInputs.length
}, null, 2))
