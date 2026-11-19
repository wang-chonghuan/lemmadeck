import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
const file = (name) => path.join(out, name)
const read = (name) => JSON.parse(fs.readFileSync(file(name), 'utf8'))
const hash = (name) => crypto.createHash('sha256').update(fs.readFileSync(file(name))).digest('hex')
const evidence = (name) => ({ path: file(name), sha256: hash(name) })
function write(name, data) {
  assert(!fs.existsSync(file(name)), 'The only repair must not be repeated or overwritten.')
  fs.mkdirSync(path.dirname(file(name)), { recursive: true })
  fs.writeFileSync(file(name), `${JSON.stringify(data, null, 2)}\n`)
}
const first = read('FIRST/fig-228a.spec.json')
const firstRender = read('FIRST/fig-228a.render.json')
assert.equal(firstRender.status, 'fail')
assert.deepEqual(firstRender.collisions.map((item) => item.id), ['a-extraction-label-label'])
const candidate = structuredClone(first)
const label = candidate.objects.find((item) => item.id === 'a-extraction-label')
assert.deepEqual(label.at, [4.38, 1.2])
label.at = [3.85, 2.9]
write('candidate/fig-228a.spec.json', candidate)
write('repair.json', {
  phase: 'SOLE-TARGETED-FIGURE-REPAIR',
  figure: 'fig-228a',
  first_failure: evidence('FIRST/fig-228a-failure.json'),
  first_spec: evidence('FIRST/fig-228a.spec.json'),
  first_render: evidence('FIRST/fig-228a.render.json'),
  first_svg: evidence('FIRST/fig-228a.svg'),
  first_canvas: evidence('FIRST/fig-228a.canvas.png'),
  first_author_observation: 'FIRST canvas opened once. Four sectors, four cardinal straights, both apparatus boxes, both inlet couplings, injection bend, extraction branch and all callouts are visible. Beam extraction label touches the upper-right magnet and renderer reports a score-10000 clearance/collision failure.',
  change: { object: 'a-extraction-label', field: 'at', from: [4.38, 1.2], to: [3.85, 2.9] },
  purpose: 'Place the same extraction label in clear space above-right of the ring.',
  source_geometry_assertions_and_authoritative_text_changed: false,
  title_related_figure_changes: 0,
  repairs_used: 1,
  maximum_targeted_figure_repairs: 1,
  first_image_opens: 1,
  first_outputs_unchanged: true,
})
const args = [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', file('candidate/fig-228a.spec.json'),
  '--svg', file('candidate/fig-228a.svg'), '--png', file('candidate/fig-228a.canvas.png'),
  '--report', file('candidate/fig-228a.render.json'),
]
const result = spawnSync('node', args, { cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
write('receipts/fig-228a-render-SOLE-REPAIR.json', {
  command: 'node', args, cwd: repo, exit_code: result.status, signal: result.signal,
  stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
})
console.log(JSON.stringify({ exit_code: result.status, stdout: result.stdout, stderr: result.stderr, repairs_used: 1, no_further_repairs_permitted: true }))
