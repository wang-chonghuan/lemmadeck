import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const out = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-125-factorial-layout-before-repair'
assert(!fs.existsSync(out))
const copied = []
function copy(source, target) {
  const stat = fs.lstatSync(source)
  assert(!stat.isSymbolicLink())
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(source).sort()) copy(`${source}/${name}`, `${target}/${name}`)
    return
  }
  const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  const sha256 = hash(source)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(target), sha256)
  copied.push({ source, retained: target, bytes: stat.size, sha256 })
}
copy('.claude/skills/ld-s10y-lesson/tools/edition.py', `${out}/edition.py`)
copy(`${tmp}/production-modern10c125/first-prepare`, `${out}/first-prepare`)
copy(`${tmp}/production-modern10c125/prepared-snapshots`, `${out}/prepared-snapshots`)
copy(`${tmp}/production-assembly10c125-corrected`, `${out}/corrected-assembly`)
fs.writeFileSync(`${out}/copy-manifest.json`, JSON.stringify({
  copied, totalFiles: copied.length, totalBytes: copied.reduce((sum, file) => sum + file.bytes, 0),
  exclusions: [], consumption: 'Actual corrected assembly2f5d54/b6f0e0 and first prepareaea633/58ed78 consumed. Prepared paragraph2 incorrectly splits factorial n! from its noun phrase. No source/formula/oldPASS operations rerun.',
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ files: copied.length, bytes: copied.reduce((sum, file) => sum + file.bytes, 0), exclusions: [] }))
