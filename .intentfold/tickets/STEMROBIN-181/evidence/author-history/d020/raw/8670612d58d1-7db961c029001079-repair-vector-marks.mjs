import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const failedPreview = path.join(own, 'fig-140/previews/w640.png')
write(path.join(own, 'initial-author-failure.json'), {
  schema: 'ld-s10y-image/author-observation@1',
  type: 'initial-visual-failure',
  imageLoadOrdinal: 3,
  preview: binding(failedPreview),
  observation: 'Actually inspected fig140 initial 640px pixels. Four field arrows, two points/labels and displacement are present, but both combining vector marks display as missing-glyph boxes. This defeats the intended mathematical notation even though native validation/render reports pass.',
  fig141: 'Its initial SVG uses the identical unsupported combining mark and native font path. No fig141 initial preview was opened. Apply the same single targeted notation correction; not a claim of inspected fig141 initial pixels.',
  correction: 'Replace only combining-mark text with base E and delta-d plus native deterministic arrow vector marks. Keep all field/point/plane geometry, spacing and crossings unchanged. No shared renderer edits.',
  imageBudget: {
    limit: 8, used: 3, remaining: 5,
    consequence: 'Five corrected final previews can be inspected. Corrected fig140 w640 will be captured and machine checked but not reopened; mark its author pixel inspection as not performed. Main must independently inspect current output.',
  },
})

for (const id of ['fig-140', 'fig-141']) {
  const initial = path.join(own, id, 'initial')
  const repair = path.join(own, id, 'repair')
  const initialSpec = path.join(initial, 'spec.json')
  const spec = JSON.parse(fs.readFileSync(initialSpec, 'utf8'))
  const mark = (id, from, to) => ({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 2.25 })
  const fieldText = spec.objects.find(object => object.id === 'field-vector-label')
  assert.equal(fieldText.text, 'E\u20d7')
  fieldText.text = 'E'
  const fieldMark = mark('field-vector-mark', [568, id === 'fig-140' ? 492 : 526], [594, id === 'fig-140' ? 492 : 526])
  spec.objects.push(fieldMark)
  spec.assertions.push({
    id: 'field-vector-mark-connects', type: 'connects', arrow: fieldMark.id, from: fieldMark.from, to: fieldMark.to,
  })
  const fieldInventory = spec.source.inventory.find(group => group.id === 'source-field-vector-label')
  fieldInventory.objects.push(fieldMark.id)
  fieldInventory.assertions.push('field-vector-mark-connects')
  fieldInventory.description += ' The source notation mark is constructed as a small deterministic arrow above E, not a fifth/sixth field line.'
  if (id === 'fig-140') {
    const displacementText = spec.objects.find(object => object.id === 'displacement-vector-label')
    assert.equal(displacementText.text, '\u0394d\u20d7')
    displacementText.text = '\u0394d'
    const displacementMark = mark('displacement-vector-mark', [320, 374], [342, 374])
    spec.objects.push(displacementMark)
    spec.assertions.push({
      id: 'displacement-vector-mark-connects', type: 'connects', arrow: displacementMark.id,
      from: displacementMark.from, to: displacementMark.to,
    })
    const displacementInventory = spec.source.inventory.find(group => group.id === 'source-points-and-displacement')
    displacementInventory.objects.push(displacementMark.id)
    displacementInventory.assertions.push('displacement-vector-mark-connects')
    displacementInventory.description += ' A small deterministic arrow above d realizes the original vector notation; it is not another displacement.'
  }
  const repairSpec = path.join(repair, 'spec.json')
  write(repairSpec, spec)
  write(path.join(repair, 'targeted-correction.json'), {
    schema: 'ld-s10y-image/author-targeted-correction@1',
    figure: id, correctionNumber: 1, maximumCorrections: 1,
    initialSpec: binding(initialSpec),
    initialRender: binding(path.join(initial, `${id}.render.json`)),
    initialSvg: binding(path.join(initial, `${id}.svg`)),
    failure: binding(path.join(own, 'initial-author-failure.json')),
    repairedSpec: binding(repairSpec),
    changes: 'Only vector notation: remove U+20D7 missing glyphs, retain base labels, add deterministic native-arrow vector marks and their inventory/connects bindings. All source field/point/plane geometry and crossing assertions unchanged.',
  })
  for (const [command, args, name] of [
    ['python3', [path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), repairSpec, '--stage', 'draft', '--json'], 'validation-command.json'],
    ['node', [path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'), '--spec', repairSpec, '--svg', path.join(repair, `${id}.svg`), '--report', path.join(repair, `${id}.render.json`)], 'render-command.json'],
  ]) {
    const result = spawnSync(command, args, {
      cwd: repo, encoding: 'utf8',
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PWDEBUG: '0', PLAYWRIGHT_HTML_OPEN: 'never' },
    })
    write(path.join(repair, name), {
      command, args, cwd: repo, exitCode: result.status,
      stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
    })
    assert.equal(result.status, 0, `${id}: single correction failed; no third attempt allowed`)
  }
  console.log(`${id}: single targeted vector-notation repair passed native validator/render; initial evidence retained.`)
}
