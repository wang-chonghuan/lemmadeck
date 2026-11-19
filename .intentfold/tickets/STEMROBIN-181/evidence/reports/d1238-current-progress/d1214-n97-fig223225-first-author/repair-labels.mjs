import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const scripts = path.join(repo, '.agents/skills/ld-s10y-image/scripts')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const native = (name, command, args) => {
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: root },
  })
  write(path.join(root, 'native', `${name}.json`), {
    command, args, cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error ? String(result.error) : null,
  })
  console.log(JSON.stringify({ name, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
  return result.status === 0
}

for (const number of [223, 224, 225]) {
  const figure = `fig-${number}`
  const dir = path.join(root, 'figures', figure)
  const firstPath = path.join(dir, `${figure}.first.spec.json`)
  const first = read(firstPath)
  const failed = read(path.join(dir, `${figure}.first.render.json`))
  if (failed.status !== 'fail' || !failed.collisions.length) throw new Error('Expected a first label-collision failure')
  const repaired = structuredClone(first)
  const changes = []
  for (const collision of failed.collisions) {
    const id = collision.id.replace(/-label$/, '')
    const object = repaired.objects.find(item => item.id === id)
    if (!object) throw new Error(`Unresolved label: ${id}`)
    const before = structuredClone(object.labelPlacement)
    if (object.type === 'point') object.labelPlacement.gap = 22
    else if (number === 225 && id === 'return-motion-text') object.labelPlacement.offset = [0, -9]
    else throw new Error(`Unexpected repair scope: ${id}`)
    changes.push({ object: id, field: 'labelPlacement', before, after: structuredClone(object.labelPlacement) })
  }
  const stripPlacement = spec => ({
    ...spec,
    objects: spec.objects.map(({ labelPlacement, ...geometry }) => geometry),
  })
  if (JSON.stringify(stripPlacement(first)) !== JSON.stringify(stripPlacement(repaired))) {
    throw new Error('Repair changed geometry, source, assertions or display')
  }
  const spec = path.join(dir, `${figure}.repair1.spec.json`)
  write(spec, repaired)
  write(path.join(dir, 'repair1.changes.json'), {
    schema: 'd037/one-targeted-label-repair@1', figure, attempt: 1,
    firstSpec: firstPath, firstRender: path.join(dir, `${figure}.first.render.json`),
    firstArtifactsPreserved: true, geometrySourceAssertionsAndDisplayUnchanged: true, changes,
  })
  if (!native(`${figure}.validate.repair1`, 'python3', [
    path.join(scripts, 'validate_spec.py'), spec, '--stage', 'draft', '--json',
  ])) continue
  native(`${figure}.render.repair1`, 'node', [
    path.join(scripts, 'render_spec.mjs'), '--spec', spec,
    '--svg', path.join(dir, `${figure}.repair1.svg`),
    '--report', path.join(dir, `${figure}.repair1.render.json`),
  ])
  if (fs.existsSync(path.join(dir, `${figure}.repair1.svg`))) native(`${figure}.raster.repair1`, 'node', [
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js'),
    path.join(dir, `${figure}.repair1.svg`), path.join(dir, `${figure}.repair1.preview-640.png`), '640',
  ])
}
