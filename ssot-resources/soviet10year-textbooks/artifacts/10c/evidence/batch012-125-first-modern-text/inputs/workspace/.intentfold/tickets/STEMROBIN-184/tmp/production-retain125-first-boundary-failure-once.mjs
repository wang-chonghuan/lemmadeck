import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const out = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-125-first-boundary-failure-and221-retry'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(out))
const copied = []
function copy(source, target) {
  const stat = fs.lstatSync(source)
  assert(!stat.isSymbolicLink())
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(source).sort()) copy(`${source}/${name}`, `${target}/${name}`)
  } else {
    assert(stat.isFile())
    const sha256 = hash(source)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(target), sha256)
    copied.push({ source, retained: target, bytes: stat.size, sha256 })
  }
}
copy(`${tmp}/production-assembly10c125-first`, `${out}/first-assembly`)
copy(`${tmp}/production-source10c221-representation-retry`, `${out}/221-retry`)
fs.writeFileSync(`${out}/copy-manifest.json`, JSON.stringify({
  totalFiles: copied.length, totalBytes: copied.reduce((s, x) => s + x.bytes, 0), copied,
  exclusions: [], status: 'FIRST_BOUNDARY_CLASSIFICATION_FAIL',
  consumption: '221-only retry4f88b8/c7f338 PASS23/23, zero exclusions/normalizations; original25/23FAIL unchanged. First isolated assembly e83cf3 exit0, semantic ownershipFAIL observed97e8e4:125 wrongly6prose2ex includesp0221#7 and906907. TOC6d6b75 defines ana10-c9-ex independent exercises card at215. No tool changes or source re-finalization.',
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ files: copied.length, bytes: copied.reduce((s, x) => s + x.bytes, 0), exclusions: [] }))
