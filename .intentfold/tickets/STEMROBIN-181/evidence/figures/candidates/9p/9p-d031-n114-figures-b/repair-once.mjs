import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
for (const id of ['fig-236', 'fig-237']) {
  const initial = path.join(own, id, 'initial')
  const repair = path.join(own, id, 'repair-1')
  assert.ok(!fs.existsSync(repair), 'Exactly one repair; no replay')
  const reportFile = path.join(initial, 'render.json')
  const report = read(reportFile)
  assert.equal(report.status, 'fail')
  assert.equal(report.collisions.length, 2)
  assert.ok(report.collisions.every(item => item.text === 'supply'))
  const specFile = path.join(initial, 'spec.json')
  const spec = read(specFile), before = structuredClone(spec)
  const changes = []
  for (const object of spec.objects.filter(item => item.type === 'text')) {
    if (object.text === 'Power' || object.text === 'supply') {
      const previous = [...object.at]
      object.at[1] += object.text === 'Power' ? 8 : -8
      changes.push({ id: object.id, before: previous, after: object.at })
    }
  }
  assert.equal(changes.length, 4)
  assert.deepEqual(spec.objects.filter(item => item.type !== 'text'), before.objects.filter(item => item.type !== 'text'))
  assert.deepEqual(spec.assertions, before.assertions)
  fs.mkdirSync(repair, { recursive: true })
  const write = (name, data) => fs.writeFileSync(path.join(repair, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  write('spec.json', spec)
  write('geometry.json', read(path.join(initial, 'geometry.json')))
  write('repair-history.json', {
    repairCount: 1, maximumRepairs: 1, remainingRepairs: 0,
    initialSpec: bind(specFile), initialSVG: bind(path.join(initial, `${id}.svg`)),
    initialNativePNG: bind(path.join(initial, `${id}.native.png`)),
    failures: [{
      stage: 'initial native render', status: 'fail',
      render: bind(reportFile), command: bind(path.join(initial, 'render-command.json')),
      collisions: report.collisions,
    }],
    targetedRepair: 'Increase Power/supply label separation from 40 px to 56 px; move each by 8 px within the existing supply box. No apparatus, arrows, topology, assertions, font size or source facts changed.',
    changes, repairedSpec: bind(path.join(repair, 'spec.json')),
    initialFilesRetainedUnchanged: true,
    policy: 'This is the only repair. Any failing repaired gate or pixel review means HOLD; no further retry.',
  })
}
console.log('Created sole label-spacing repairs for fig-236 and fig-237; initial failures retained.')
