import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '../../../../..')
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const write = (name, value) => fs.writeFileSync(
  path.join(root, name), JSON.stringify(value, null, 2) + '\n',
)
const metadata = filename => {
  const absolute = path.resolve(filename)
  const stat = fs.statSync(absolute)
  return {
    path: absolute,
    sha256: sha(fs.readFileSync(absolute)),
    bytes: stat.size,
    mode: (stat.mode & 0o7777).toString(8).padStart(4, '0'),
  }
}
const before = read('inputs-before.json')
const after = {
  schema: before.schema,
  observedAt: new Date().toISOString(),
  inputs: before.inputs.map(entry => ({ ...metadata(entry.path), role: entry.role })),
}
const inputBindings = before.inputs.map((entry, index) => {
  const final = after.inputs[index]
  assert.equal(final.sha256, entry.sha256, `Input changed: ${entry.path}`)
  return {
    path: entry.path,
    sha256Before: entry.sha256,
    sha256After: final.sha256,
    bytesAfter: final.bytes,
    modeAfter: final.mode,
    unchanged: true,
    role: entry.role,
  }
})
write('inputs-after.json', after)
const first = read('answer-keys.FIRST.json')
const candidate = read('answer-keys.candidate.json')
const differences = []
function compare(left, right, pointer = '') {
  if (JSON.stringify(left) === JSON.stringify(right)) return
  if (left && right && typeof left === 'object' && typeof right === 'object') {
    for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
      compare(left[key], right[key], `${pointer}/${key}`)
    }
  } else {
    differences.push(pointer)
  }
}
compare(first, candidate)
assert.deepEqual(differences, ['/answers/1/displayAnswer'])
const firstMeta = metadata(path.join(root, 'answer-keys.FIRST.json'))
const candidateMeta = metadata(path.join(root, 'answer-keys.candidate.json'))
assert.equal(firstMeta.sha256, '24e5f35315ffc023b776111eaf88dfbdd62143cf33920d7b8c0593e0464ed124')
assert.equal(firstMeta.mode, '0444')
assert.equal(candidateMeta.sha256, 'c1e8476fd7beebb6dcc0862b342201d0d0ab3fd8fafa514b45709edd46ab7f3a')
assert.equal(candidateMeta.mode, '0644')
assert.notEqual(fs.statSync(firstMeta.path).ino, fs.statSync(candidateMeta.path).ino)
assert.equal(read('structure-check.FIRST.json').candidateSha256, firstMeta.sha256)
assert.equal(read('expected-parser-check.FIRST.json').candidateSha256, firstMeta.sha256)
const runtimePaths = [
  ['.claude/skills/ld-s10y-answer/SKILL.md', 'a825db87672032d77aef61e5ae20098a2334ef6cfe7c12d2d1d90c110c955857'],
  ['.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md', '9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9'],
  ['.claude/skills/ld-s10y-lesson/references/production-resume.md', '8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58'],
  ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py', '30b7ba6be1397b2e005b8f9b3a682ca5ff9b680d6c77af9c1d06cedbef70d9e2'],
  ['.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs', '2b9e236faf57a5ff2860c5ea2961ad57dfb99b5fc3218eb5e12bcb5404f9a281'],
  ['app/src/lib/textbook-answer.ts', 'bee990b6367f8111ab30a4409c28d5e9387a01068c0bf27376326dfe4fe8ff8f'],
  ['.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json', 'f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1'],
  ['.claude/skills/ld-s10y-lesson/tools/assemble.py', '10d350ef080bfbec151736ef5a66f5465911ed08565917795b96bfb66ec9bdd2'],
  ['.claude/skills/ld-s10y-lesson/tools/blocks.py', '893ef002002ebd48291a3f8153e2e7dcb9375e5bcf89e527a1cb090b21e8db48'],
  ['.claude/skills/ld-s10y-lesson/tools/mathcheck.py', '8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7'],
  ['.claude/skills/ld-s10y-lesson/tools/normalize.py', '65db6b013806f0dd9de0a739e09714c8cdfaebd8f9cb41c4edcb5e242beae29f'],
  ['/Users/yong/work/lemmadeck-ws/lemmadeck/app/node_modules/@cortex-js/compute-engine/package.json', '929ad624d52dea5b793d81072db1eb29bc78a9e575856292f78a6c5bed47aea1'],
  ['/Users/yong/work/lemmadeck-ws/lemmadeck/app/node_modules/@cortex-js/compute-engine/dist/compute-engine.min.umd.cjs', '9fbe93c5c52dad18eece87e7223b4cb1761cca1eaa71d7deae42aa8ab9da5254'],
]
const runtimeBindings = runtimePaths.map(([filename, observedHash]) => {
  const entry = metadata(path.isAbsolute(filename) ? filename : path.join(repo, filename))
  assert.equal(entry.sha256, observedHash, `Referenced source changed: ${entry.path}`)
  return { ...entry, observedSha256: observedHash, unchangedSinceObservation: true }
})
const expectedProjection = answers => answers.map(answer => ({
  exercise: answer.exercise,
  grading: answer.grading,
  source: answer.source,
  parts: answer.parts,
}))
assert.deepEqual(expectedProjection(candidate.answers), expectedProjection(first.answers))
const integrity = {
  status: 'pass',
  scope: 'Byte/mode/input and JSON-change binding only; not another structural, parser or mathematical validation.',
  FIRST: firstMeta,
  candidate: candidateMeta,
  changedJsonPointers: differences,
  expectedGradingPartsAndIdentityUnchanged: true,
  originalReceiptsBoundToFIRST: true,
  inputsUnchanged: true,
  runtimeReferencesUnchangedSinceObservation: true,
  structuralReruns: 0,
  parserReruns: 0,
}
write('integrity-receipt.json', integrity)
const commonNames = [
  'answer-keys.candidate.json',
  'answer-keys.FIRST.json',
  'inputs-before.json',
  'inputs-after.json',
  'structure-check.FIRST.json',
  'expected-parser-check.FIRST.json',
  'check-structure.py',
  'check-expected-parser.mjs',
  'bind-evidence.mjs',
  'integrity-receipt.json',
]
const report = read('report.json')
report.inputs = inputBindings
report.runtimeBindings = runtimeBindings
report.integrity = integrity
report.outputs = commonNames.map(name => metadata(path.join(root, name)))
write('report.json', report)
const index = {
  schema: 'same188-6/n64-answer-output-index@1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6',
  conclusion: report.conclusion,
  outputs: [...commonNames, 'report.json', 'report.md'].map(name => metadata(path.join(root, name))),
}
for (const entry of index.outputs) {
  assert.ok(entry.path.startsWith(root + path.sep))
  assert.deepEqual(Object.keys(entry).sort(), ['bytes', 'mode', 'path', 'sha256'])
  assert.match(entry.mode, /^[0-7]{4}$/)
  assert.deepEqual(metadata(entry.path), entry)
}
assert.ok(!index.outputs.some(entry => entry.path.endsWith('/output-index.json')))
write('output-index.json', index)
console.log(JSON.stringify({
  conclusion: report.conclusion,
  candidate: candidateMeta,
  FIRST: firstMeta,
  reports: index.outputs.filter(entry => /\/report\.(json|md)$/.test(entry.path)),
  index: metadata(path.join(root, 'output-index.json')),
  indexedOutputs: index.outputs.length,
  inputChanges: 0,
  changedJsonPointers: differences,
}, null, 2))
