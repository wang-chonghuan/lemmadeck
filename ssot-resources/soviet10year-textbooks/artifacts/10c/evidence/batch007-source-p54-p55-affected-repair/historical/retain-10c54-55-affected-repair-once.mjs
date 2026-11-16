import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const T = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const E = path.join(T, 'source-10c-p54-p55-affected-repair')
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence')
const destination = path.join(base, 'batch007-source-p54-p55-affected-repair')
assert(!fs.existsSync(destination), 'First affected-repair retention only')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const files = []
const add = (source, relative, expected) => {
  const stat = fs.lstatSync(source)
  assert(stat.isFile() && !stat.isSymbolicLink())
  const sha256 = hash(source)
  if (expected) assert.equal(sha256, expected, source)
  files.push({ sourcePathProvenanceOnly: source, retainedRelativePath: relative, bytes: stat.size, sha256 })
}
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
  assert(!item.isSymbolicLink())
  const file = path.join(dir, item.name)
  return item.isDirectory() ? walk(file) : [file]
})
for (const file of walk(E)) add(file, `historical/affected/${path.relative(E, file)}`)
add(path.join(T, 'source-10c-p54-p55-affected-review.md'),
  'historical/source-10c-p54-p55-affected-review.md',
  '8d53715e55628c227c5f1563c8790624f2131c21670222ab2fd6a2a20317a419')
add(path.join(T, 'source-10c-p55-margin-allocation-clarification.md'),
  'historical/source-10c-p55-margin-allocation-clarification.md',
  '1ca03fb4ac18ff227e96fa4bcd046454438c1c43945b7a7a9b22e89b9bcb0ed1')
add(path.join(T, 'finalize-10c54-55-affected-once.mjs'), 'historical/finalize-10c54-55-affected-once.mjs')
add(fileURLToPath(import.meta.url), 'historical/retain-10c54-55-affected-repair-once.mjs')
const references = [
  ['batch007-source-p54-p55-first-failure', 'f18b9c00dc4e9a32d322b5dacb85962359e47df7a602de55f091142606c550fe'],
  ['batch007-source-p54-p55-independent-disposition', '040a2eb9822c3f56a7e1b7070f93f8d4f2e2fb186bcaad2fe329965c76186f23'],
]
for (const [name, expected] of references) assert.equal(hash(path.join(base, name, 'retention.json')), expected)
fs.mkdirSync(destination)
for (const item of files) {
  const output = path.join(destination, item.retainedRelativePath)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.copyFileSync(item.sourcePathProvenanceOnly, output, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(output), item.sha256)
  assert.equal(hash(item.sourcePathProvenanceOnly), item.sha256)
  fs.chmodSync(output, 0o444)
}
const result = {
  role: 'MECHANICAL_EXACT_BYTE_RETENTION_ONLY', status: 'LIMITED_F1_G1_ACCEPTED_NOT_COMPLETE_UNIT',
  ticket: 'STEMROBIN-184', book: '10c', physicalPages: [54, 55],
  references: references.map(([name, sha256]) => ({ retainedRelativePath: `../${name}/retention.json`, sha256 })),
  disposition: 'Affectednineoperator-gap substitutions+exacttwocounting-onlyNON-CONTENTmarginboxesaccepted. Affectedfinalizeeachfirstonce0/54=23vs23/55=15vs15/0normalizations. Original55first17vs15exit1anduniqueStageBremainunchanged.',
  preservation: 'No source/math/punctuation/row/figure/ownership changes beyond specifiedtokens+55metadata. Authorcorrectperiods,boldinclinedZ,sourcegaps,repeateda,21protectedbindingsunchanged. PhysicaloriginUNKNOWN,unit86andfinal现在，为了写出方OPEN.',
  runtimeDependencies: [], provenancePolicy: 'Absolute source paths are PROVENANCE_ONLY; use retainedRelativePath and SHA256.',
  operations: { invokedOnce: true, newImageLoads: 0, newReviews: 0, counter: false,
    finalize: false, sourceEdits: false, retries: false, assembly: false,
    formalAnswers: 0, choices: 0, git: false, database: false, production: false },
  counts: { copiedFiles: files.length, copiedBytes: files.reduce((sum, item) => sum + item.bytes, 0) },
  files,
}
for (const [name, expected] of references) assert.equal(hash(path.join(base, name, 'retention.json')), expected)
const output = path.join(destination, 'retention.json')
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
console.log(JSON.stringify({ ...result.counts, totalFiles: files.length + 1, retentionPath: output, sha256: hash(output) }))
