import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
for (const id of ['fig-233', 'fig-234']) {
  const initial = path.join(own, id, 'initial')
  const out = path.join(own, id, 'repair-1')
  assert.ok(!fs.existsSync(out), 'One repair only')
  fs.mkdirSync(out)
  const specPath = path.join(initial, 'spec.json')
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
  const initialSpec = bind(specPath)
  const failurePath = id === 'fig-233'
    ? path.join(initial, 'render.json')
    : path.join(own, 'commands', `${id}-initial-validate-draft.json`)
  const failure = JSON.parse(fs.readFileSync(failurePath, 'utf8'))
  assert.equal(id === 'fig-233' ? failure.status : failure.exitCode, id === 'fig-233' ? 'fail' : 2)
  spec.objects.find(object => object.id === 'circuit-label').at[1] = 724
  if (id === 'fig-234') {
    const tips = []
    for (const item of spec.assertions.filter(item => item.type === 'collinear')) {
      const [a, b, from, to] = item.points
      delete item.points
      Object.assign(item, { a, b, c: from })
      const tip = { id: `${item.id}-tip`, type: 'collinear', a, b, c: to }
      tips.push(tip)
      spec.source.inventory.find(group => group.id === `${id}-vertical-conductors`).assertions.push(tip.id)
    }
    assert.equal(tips.length, 2)
    spec.assertions.push(...tips)
  }
  write(path.join(out, 'spec.json'), spec)
  for (const file of ['context.native.json', 'context.complete.json', 'geometry.json', 'assets.json']) {
    fs.copyFileSync(path.join(initial, file), path.join(out, file), fs.constants.COPYFILE_EXCL)
  }
  write(path.join(out, 'repair-history.json'), {
    figure: id, repairNumber: 1, remainingRepairs: 0,
    initialSpec, initialFailure: bind(failurePath),
    initialNativePNG: fs.existsSync(path.join(initial, `${id}.native.png`)) ? bind(path.join(initial, `${id}.native.png`)) : null,
    changes: id === 'fig-233'
      ? ['Move circuit heading12px upward;60px-ish heading separation clears the native padded label boxes. No geometry, arrow or topology change.']
      : ['Replace each invalid collinear points-array with native a/b/c assertion fields and add a separate arrow-tip collinearity assertion; preserves both arrow endpoints and wire geometry.',
          'Move circuit heading12px upward to apply the same concrete native label-spacing correction found in Figure233.'],
    immutableInitialRetained: true,
    stopPolicy: 'If this second attempt fails any figure gate, freeze HOLD; no additional repair or render retry.',
    repairedSpec: bind(path.join(out, 'spec.json')),
  })
  assert.equal(hash(specPath), initialSpec.sha256)
}
console.log('One targeted repair prepared for each figure; both initial failures retained.')
