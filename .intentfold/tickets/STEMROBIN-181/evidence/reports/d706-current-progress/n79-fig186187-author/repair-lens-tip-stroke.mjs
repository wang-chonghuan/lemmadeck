import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d694-n79-fig186187-first-author')
if (process.cwd() !== root) throw new Error('Wrong workdir')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
for (const id of ['fig-186', 'fig-187']) {
  const original = path.join(own, id, 'first', 'spec.json')
  const spec = JSON.parse(fs.readFileSync(original, 'utf8'))
  const changes = []
  for (const object of spec.objects) {
    if (object.type === 'arrow' && /-lens-(top|bottom)-tip$/.test(object.id)) {
      if (object.strokeWidth !== 2.5) throw new Error(`Unexpected input: ${object.id}`)
      changes.push({ object: object.id, field: 'strokeWidth', before: 2.5, after: 2 })
      object.strokeWidth = 2
    }
  }
  const folder = path.join(own, id, 'repair-1')
  fs.mkdirSync(folder, { recursive: true })
  const output = path.join(folder, 'spec.json')
  if (fs.existsSync(output)) throw new Error('Repair cannot be repeated')
  fs.writeFileSync(output, `${JSON.stringify(spec, null, 2)}\n`)
  fs.writeFileSync(path.join(folder, 'repair.delta.json'), `${JSON.stringify({
    figure: id,
    repairsConsumed: 1,
    maximumRepairs: 1,
    reason: 'Technical arrowhead-export failure on fractional stroke marker aspect ratio. Only lens-tip stroke changes; point geometry, ray direction, assertions, source inventory and authoritative text remain identical.',
    original: { path: path.relative(root, original), sha256: sha(original) },
    repaired: { path: path.relative(root, output), sha256: sha(output) },
    changes,
    independentApproval: false,
  }, null, 2)}\n`)
}
console.log('Created the sole targeted repair for fig-186 and fig-187; first failures preserved.')
