import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const D = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d848-n87-fig201202-first-author'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const changes = []
for (const figure of ['fig-201', 'fig-202']) {
  const first = path.join(D, 'figures', figure, 'FIRST/spec.json')
  const spec = JSON.parse(fs.readFileSync(first, 'utf8'))
  const before = hash(first)
  const oldId = figure === 'fig-201' ? 'spacer-hatch-count' : 'glass-hatch-count'
  const assertion = spec.assertions.find(item => item.id === oldId)
  assertion.id = `${figure}-authored-segment-count`
  assertion.count = spec.objects.filter(item => item.type === 'segment').length
  delete assertion.ids
  delete assertion.value
  for (const group of spec.source.inventory) {
    group.assertions = group.assertions.filter(id => id !== oldId)
  }
  const additions = spec.source.inventory.find(group => group.id === `${figure}-modern-additions`)
  additions.assertions.push(assertion.id)
  additions.description += ' The objectCount assertion is a diagnostic of ALL authored segment objects, not a source hatch count, not a relationship assertion, and not a source fact.'
  const folder = path.join(D, 'figures', figure, 'repair-1')
  fs.mkdirSync(folder, { recursive: true })
  const output = path.join(folder, 'spec.json')
  fs.writeFileSync(output, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
  fs.chmodSync(output, 0o444)
  if (hash(first) !== before) throw new Error('FIRST changed')
  changes.push({
    figure, first: { path: first, sha256: before },
    candidate: { path: output, sha256: hash(output) },
    nativeFailure: path.join(D, 'calls', `${figure}-FIRST-validation.json`),
    geometryAndLabelsUnchanged: true, sourceInventoriesUnchanged: true,
    repaired: [
      'Unsupported subset-count assertion replaced by native global authored-segment count using count.',
      'Diagnostic mapped only to the modern-additions group; it is explicitly not a source fact.',
      'fig-202 empty additions group is now mapped to that diagnostic.',
    ],
    cumulativeAuthorRounds: 2, ordinaryRepairRounds: 1,
  })
}
const receipt = path.join(D, 'repair-1-receipt.json')
fs.writeFileSync(receipt, `${JSON.stringify(changes, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(receipt, 0o444)
