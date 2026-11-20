import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save } from '../retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const root = path.dirname(new URL(import.meta.url).pathname)
const priorPath = path.join(root, 'fig-g10-86.repair4.spec.json')
const prior = read(priorPath)
save(path.join(root, 'repair4-author-visual-failure.json'), {
  status: 'FAIL_LOCAL_AUTHOR_LABEL_ASSOCIATION',
  finding: 'The diagonal grey guide follows the upper-rim silhouette too closely to disambiguate the A1 endpoint at normal widths.',
  spec: bind(priorPath),
  snapshot: bind(path.join(root, 'fig-g10-86.repair4.widths-480-300.png')),
  nativePASSPreserved: true, actualAuthorSnapshotUnits: 2,
  contentRepairCountAtFailure: 4, independentVerdict: false,
})
const current = structuredClone(prior)
const point = current.objects.find(object => object.id === 'A1')
point.labelPlacement = { position: 'W', gap: 50, offset: [0, 0] }
const guide = current.objects.find(object => object.id === 'A1-association-leader')
guide.to = [-1.8, point.at[1]]
current.assertions.find(assertion =>
  assertion.id === 'A1-association-leader-connects').to = guide.to
const specPath = path.join(root, 'fig-g10-86.repair5.spec.json')
save(specPath, current)
save(path.join(root, 'repair5-changes.json'), {
  before: bind(priorPath), after: bind(specPath),
  labelPlacement: point.labelPlacement, guideEndpoint: guide.to,
  reason: 'Use a horizontal muted guide from the unchanged A1 junction, visibly separate from the rim; place its label beside the guide, outside the silhouette.',
  originalGeometryAndLettersUnchanged: true,
  priorContentRepairs: 4, newContentRepairs: 1, totalContentRepairs: 5,
})
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
for (const [name, command, args] of [
  ['validate', python, ['-B', '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    specPath, '--stage', 'draft', '--json']],
  ['render', 'node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', specPath,
    '--svg', path.join(root, 'fig-g10-86.repair5.svg'),
    '--report', path.join(root, 'fig-g10-86.repair5.render.json')]],
]) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8' })
  save(path.join(root, `${name}-repair5.command.json`), {
    command, args, cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr}`)
}
assert.equal(read(path.join(root, 'fig-g10-86.repair5.render.json')).status, 'pass')
console.log(JSON.stringify({ root, native: 'pass', totalContentRepairs: 5 }))
