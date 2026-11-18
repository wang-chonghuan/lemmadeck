import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = process.cwd()
const owner = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: path.relative(root, p), sha256: hash(p) })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (p, v) => {
  assert.ok(p.startsWith(owner + path.sep))
  assert.ok(!fs.existsSync(p))
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n')
}
const changes = {
  'fig-144': {
    's144-O': { labelPlacement: { position: 'NW', offset: [-35, -75] } },
    's144-F': { labelPlacement: { position: 'SE', offset: [0, 107] } },
    's144-P': { labelPlacement: { position: 'E', offset: [26, 55] } }
  },
  'fig-146': {
    's146-P': { labelPlacement: { position: 'SE', offset: [40, 88] } },
    'fig-146-paraxial-scope': { at: [420, 32] }
  }
}
for (const [id, edits] of Object.entries(changes)) {
  const initial = path.join(owner, id, 'initial')
  assert.equal(read(path.join(initial, 'render.json')).status, 'fail')
  const s = read(path.join(initial, 'spec.json'))
  const before = structuredClone(s)
  const changeLog = []
  for (const [objectId, delta] of Object.entries(edits)) {
    const o = s.objects.find(o => o.id === objectId)
    assert.ok(o)
    changeLog.push({ id: objectId, before: structuredClone(o), delta })
    Object.assign(o, delta)
  }
  assert.deepEqual(s.assertions, before.assertions)
  assert.deepEqual(s.source, before.source)
  assert.deepEqual(s.canvas, before.canvas)
  assert.deepEqual(s.display, before.display)
  const dir = path.join(owner, id, 'repair-1')
  const p = path.join(dir, 'spec.json')
  save(p, s)
  save(path.join(dir, 'sole-repair.json'), {
    figure: id, repairCounter: 1, maximumRepairs: 1,
    targetedReason: 'First render label/stroke/point collisions; label positions only, plus free scope-caption position.',
    initialSpec: bind(path.join(initial, 'spec.json')),
    firstFailure: bind(path.join(initial, 'render.receipt.json')),
    changes: changeLog,
    geometryAndSourceFactsUnchanged: true, assertionsUnchanged: true, fontFloorUnchanged: true,
    secondFailurePolicy: 'terminal HOLD; no further repairs or generated-SVG edits'
  })
  for (const [step, cmd, args] of [
    ['validate', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', p, '--stage', 'draft', '--json']],
    ['render', 'node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', p, '--svg', path.join(dir, id + '.svg'), '--report', path.join(dir, 'render.json')]]
  ]) {
    const began = new Date().toISOString()
    const r = spawnSync(cmd, args, {
      cwd: root, encoding: 'utf8',
      env: Object.fromEntries(Object.entries({ ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' }).filter(([k]) => k !== 'PWDEBUG'))
    })
    save(path.join(dir, step + '.receipt.json'), {
      figure: id, attempt: 'repair-1', step, executable: cmd,
      args: args.map(a => a.startsWith(root) ? path.relative(root, a) : a),
      began, ended: new Date().toISOString(), exitCode: r.status, signal: r.signal,
      stdout: r.stdout, stderr: r.stderr, spec: bind(p),
      headless: true, isolated: true, PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never'
    })
    console.log(JSON.stringify({ figure: id, step, exitCode: r.status, stdout: r.stdout, stderr: r.stderr }))
  }
}
