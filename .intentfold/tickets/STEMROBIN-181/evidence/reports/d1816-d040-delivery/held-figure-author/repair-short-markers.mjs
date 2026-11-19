import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const source = path.join(out, 'first-candidates/fig-245/spec.json')
const target = path.join(out, 'repair-candidate/fig-245/spec.json')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const spec = JSON.parse(fs.readFileSync(source, 'utf8'))
const changes = ['authored-turn-head-a', 'authored-turn-head-b'].map((id) => {
  const object = spec.objects.find((item) => item.id === id)
  if (!object || object.strokeWidth !== 2) throw new Error('unexpected first-candidate marker')
  object.strokeWidth = 1
  return { object: id, field: 'strokeWidth', before: 2, after: 1 }
})
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(target, 0o444)
const receipt = {
  schema: 'bounded-figure-author/one-native-defect-repair@1',
  maximumRepairs: 1, repairsUsed: 1,
  figure: 'fig-245',
  nativeFailure: 'Unsupported arrow marker aspect ratio: authored-turn-head-aTriangleEnd1',
  failureEvidence: path.join(out, 'first-candidates/fig-245/render.stderr.txt'),
  cause: 'Short 10px rotational arrows with 2px strokes exceed native marker sizing; JSXGraph can reduce marker width/viewBox to zero, which the native arrow materializer rejects.',
  repair: 'Reduce only the two short rotational arrow stroke widths to 1px. Optical chain, labels, geometry, assertions, source bindings and dependencies unchanged.',
  changes,
  source: { path: source, sha256: sha(source) },
  repaired: { path: target, sha256: sha(target) },
  firstCandidateUntouched: true,
  handwrittenSVG: false,
  noFurtherRepairAllowed: true,
  fig246VisualHold: 'Phototube label crossed by descending circuit wires; first candidate remains unchanged because the single repair is consumed by native fig245 render failure.',
}
fs.writeFileSync(path.join(out, 'repair-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(path.join(out, 'repair-receipt.json'), 0o444)
console.log(JSON.stringify({ status: 'single-repair-authored', changes, target }))
