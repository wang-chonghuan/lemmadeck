import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const D = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d848-n87-fig201202-first-author'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const changes = []
for (const figure of ['fig-201', 'fig-202']) {
  const previous = path.join(D, 'figures', figure, 'repair-1/spec.json')
  const spec = JSON.parse(fs.readFileSync(previous, 'utf8'))
  const before = hash(previous)
  if (figure === 'fig-201') {
    spec.objects.find(object => object.id === 'test-surface-label').at = [280, 286]
    spec.objects.find(object => object.id === 'air-wedge-label').at = [390, 152]
  } else {
    spec.canvas.height = 440
    spec.canvas.boundingBox[1] = 440
    spec.objects.find(object => object.id === 'reflected-1-label').at = [295, 405]
  }
  const folder = path.join(D, 'figures', figure, 'repair-2')
  fs.mkdirSync(folder, { recursive: true })
  const output = path.join(folder, 'spec.json')
  fs.writeFileSync(output, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
  fs.chmodSync(output, 0o444)
  if (hash(previous) !== before) throw new Error('Previous evidence changed')
  changes.push({
    figure, previous: { path: previous, sha256: before },
    candidate: { path: output, sha256: hash(output) },
    nativeFailure: path.join(D, 'calls', `${figure}-repair-1-render.json`),
    repairType: 'One native render-collision repair after the earlier validator-contract repair',
    repaired: figure === 'fig-201'
      ? ['Move Test surface inward from the padded canvas boundary.', 'Move Air wedge down 10 units into the existing air region.']
      : ['Add 40 units of top canvas whitespace and move numeral 1 above its ray without clipping or changing its association.'],
    rayApparatusGeometryAndAssertionsUnchanged: true,
    sourceInventoriesUnchanged: true, cumulativeAuthorRounds: 3,
    validatorRepairRounds: 1, renderRepairRounds: 1,
  })
}
const output = path.join(D, 'repair-2-receipt.json')
fs.writeFileSync(output, `${JSON.stringify(changes, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(output, 0o444)
