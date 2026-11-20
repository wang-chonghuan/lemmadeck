import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d139-n17-fig23-author')
assert.equal(process.cwd(), repo)
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (name, data) => fs.writeFileSync(path.join(own, name), JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
const binding = p => {
  const absolute = path.resolve(repo, p)
  const bytes = fs.readFileSync(absolute)
  return { path: absolute, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const input = read(path.join(own, 'input-freeze.json'))
const old = read(path.join(repo, input.oldCandidate.path))
const validator = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
const verifyFrozen = () => Object.fromEntries(Object.entries(input)
  .filter(([, value]) => value?.path && value?.sha256)
  .map(([key, value]) => {
    const actual = binding(value.path)
    assert.equal(actual.sha256, value.sha256, key)
    assert.equal(actual.bytes, value.bytes, key)
    return [key, actual]
  }))
const run = (name, executable, args) => {
  const result = spawnSync(executable, args, { cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  const receipt = { executable, args, cwd: repo, status: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null }
  write(name, receipt)
  return receipt
}

function changes(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return []
  if (a === undefined || b === undefined || a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return [{ path: pointer, before: a ?? null, after: b ?? null }]
  }
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
    changes(a[key], b[key], `${pointer}/${key}`))
}

if (process.argv[2] === 'prepare') {
  const frozen = verifyFrozen()
  const initialSpec = binding('.intentfold/tickets/STEMROBIN-181/evidence/figures/failed/9p/fig-23/initialSpec-fig-23.spec.json')
  assert.equal(initialSpec.sha256, '0ba59cd145dd88dae345baf4e144b23c8c57155d5f85fdd3caa05d6fe4a5b40c')
  assert.deepEqual(old.source.authoritativeText, input.authoritativeText)
  assert.equal(old.objects.length, 1432)
  write('preserved-history.json', {
    schema: 'd139-preserved-history@1',
    input: binding(path.join(own, 'input-freeze.json')),
    sourceFirstInventory: binding(path.join(own, 'source-first-inventory.json')),
    frozen,
    original0: { spec: initialSpec, diagnostic: 'Original assertion-field and circle-container contract failure; inherited receipt retained without rerun or reset.' },
    original1: { spec: frozen.oldCandidate, render: frozen.originalFailure, svg: frozen.oldSvg },
    historicalUsage: { draftContractRepairs: 1, renderAttempts: 1, renderLabelRepairs: 0, independentReviews: 0 },
    originalFailure: read(path.join(repo, input.originalFailure.path)),
    preservation: 'References bind immutable retained bytes; no original files are overwritten or copied.',
  })
  const native0 = structuredClone(old)
  for (const group of native0.source.inventory) group.requires = ['pointRelationships']
  write('spec.native0.json', native0)
  const receipt = run('native0.receipt.json', 'python3', [validator, path.join(own, 'spec.native0.json'), '--stage', 'draft', '--json'])
  write('native0.validation.json', JSON.parse(receipt.stdout))
  assert.equal(receipt.status, 2)
  console.log(receipt.stdout)
} else if (process.argv[2] === 'repair') {
  const prior = read(path.join(own, 'native0.receipt.json'))
  assert.equal(prior.status, 2)
  verifyFrozen()
  const current = read(path.join(own, 'spec.native0.json'))
  const aliases = []
  const roles = ['rod-plate-joint', 'hose-source-port', 'gauge-pivot', 'thermometer-bulb']
  for (const panel of ['a', 'b', 'c']) {
    const group = current.source.inventory.find(g => g.id === `source-${panel}-apparatus`)
    for (const role of roles) {
      const owner = current.objects.find(o => o.id === `${panel}-${role}`)
      assert.equal(owner.type, 'circle')
      assert.equal(owner.fill, 'ink')
      assert.equal(owner.fillOpacity, 1)
      const point = {
        id: `${panel}-${role}-source-point`,
        type: 'point',
        at: structuredClone(owner.center),
        size: 1,
        strokeWidth: 0.1,
        stroke: 'ink',
        fill: 'ink',
        visible: true,
      }
      aliases.push({ point: point.id, existingCircle: owner.id, at: point.at, existingRadius: owner.radius, purpose: 'Named source-role center; marker lies wholly inside the existing opaque ink disk, not a new physical feature.' })
      current.objects.push(point)
      owner.center = point.id
      group.objects.push(point.id)
    }
    const pointId = role => `${panel}-${role}-source-point`
    for (const [fromRole, toRole, relation] of [
      ['rod-plate-joint', 'hose-source-port', 'plate-joint-to-outlet'],
      ['hose-source-port', 'gauge-pivot', 'outlet-to-connected-gauge-pivot'],
      ['thermometer-bulb', 'rod-plate-joint', 'thermometer-to-plate-joint'],
    ]) {
      const from = current.objects.find(o => o.id === pointId(fromRole))
      const to = current.objects.find(o => o.id === pointId(toRole))
      const assertion = {
        id: `${panel}-source-${relation}`,
        type: 'displacement',
        from: from.id,
        to: to.id,
        dx: to.at[0] - from.at[0],
        dy: to.at[1] - from.at[1],
      }
      current.assertions.push(assertion)
      group.assertions.push(assertion.id)
    }
    const needle = current.assertions.find(a => a.id === `${panel}-needle-through-pivot`)
    assert.deepEqual(needle.b, current.objects.find(o => o.id === pointId('gauge-pivot')).at)
    needle.b = pointId('gauge-pivot')
    const immersed = current.assertions.find(a => a.id === `${panel}-thermometer-immersed`)
    if (immersed) immersed.point = pointId('thermometer-bulb')
  }
  const states = current.source.inventory.find(g => g.id === 'source-three-states')
  states.objects.push(...aliases.filter(a => !a.point.includes('thermometer') && !a.point.includes('hose')).map(a => a.point))
  for (const [id, from, to] of [
    ['source-b-plate-higher-than-a', 'a-rod-plate-joint-source-point', 'b-rod-plate-joint-source-point'],
    ['source-c-plate-lower-than-b', 'b-rod-plate-joint-source-point', 'c-rod-plate-joint-source-point'],
  ]) {
    const assertion = current.assertions.find(a => a.id === id)
    for (const [field, pointId] of [['from', from], ['to', to]]) {
      assert.deepEqual(assertion[field], current.objects.find(o => o.id === pointId).at)
      assertion[field] = pointId
    }
  }
  const abPivot = {
    id: 'source-a-b-gauge-pivot-layout',
    type: 'displacement',
    from: 'a-gauge-pivot-source-point',
    to: 'b-gauge-pivot-source-point',
    dx: 320,
    dy: 0,
  }
  const bcPivot = {
    id: 'source-b-c-gauge-pivot-layout',
    type: 'displacement',
    from: 'b-gauge-pivot-source-point',
    to: 'c-gauge-pivot-source-point',
    dx: -163,
    dy: -457,
  }
  current.assertions.push(abPivot, bcPivot)
  states.assertions.push(abPivot.id, bcPivot.id)
  for (const id of ['a-parameter-1', 'b-parameter-1', 'c-parameter-1']) {
    const object = current.objects.find(o => o.id === id)
    assert.deepEqual(object.labelPlacement, { position: 'CENTER' })
    object.labelPlacement.offset = [0, 10]
  }
  write('spec.current.json', current)
  write('source-point-bindings.json', {
    aliases,
    addedPointCount: aliases.length,
    originalObjectCount: old.objects.length,
    currentObjectCount: current.objects.length,
    unmodifiedCountAssertion: current.assertions.find(a => a.type === 'objectCount'),
    coordinateMeaning: 'All numbers are inherited canvas geometry, not new physical measurements or source scale readings.',
    inGroupCoverage: current.source.inventory.map(g => ({
      id: g.id,
      requires: g.requires,
      mappedPoints: g.objects.filter(id => current.objects.find(o => o.id === id)?.type === 'point'),
      mappedRelationships: g.assertions.filter(id => current.assertions.find(a => a.id === id)?.type !== 'objectCount'),
    })),
  })
  write('changed-fields.json', changes(old, current))
  const resolve = spec => {
    const points = new Map(spec.objects.filter(o => o.type === 'point').map(o => [o.id, o.at]))
    const replace = value => typeof value === 'string' && points.has(value)
      ? points.get(value)
      : Array.isArray(value) ? value.map(replace)
        : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === 'id' ? v : replace(v)]))
          : value
    return spec.objects.filter(o => old.objects.some(previous => previous.id === o.id)).map(o => {
      const normalized = replace(o)
      if (normalized.type === 'text') {
        delete normalized.at
        delete normalized.labelPlacement
      }
      return normalized
    })
  }
  const beforeGeometry = resolve(old)
  const afterGeometry = resolve(current)
  assert.deepEqual(afterGeometry, beforeGeometry)
  assert.deepEqual(current.canvas, old.canvas)
  assert.deepEqual(current.display, old.display)
  assert.deepEqual(current.layout, old.layout)
  assert.deepEqual(current.source.authoritativeText, old.source.authoritativeText)
  write('source-geometry-comparison.json', {
    method: 'Deep compare every retained object after resolving source-point references to their exact coordinates; exclude text positions/labelPlacement only. Canvas/display/layout and complete authoritativeText compared separately. Added aliases are disclosed separately, never hidden by a count reset.',
    originalObjects: old.objects.length,
    retainedObjects: afterGeometry.length,
    addedSourcePointAliases: aliases.length,
    existingGeometryDeepEqual: true,
    existingGeometryChanges: changes(beforeGeometry, afterGeometry),
    canvasUnchanged: true,
    displayUnchanged: true,
    layoutUnchanged: true,
    authoritativeTextUnchanged: true,
    rawObjectArrayDeepEqual: false,
    rawDifferenceReason: 'Three permitted label offsets plus twelve explicitly disclosed source-center aliases and equal-coordinate circle references.',
    aliases,
    geometryPixelComparison: 'Pending actual old/current SVG raster comparison; no semantic approval asserted.',
  })
  const receipt = run('native1.receipt.json', 'python3', [validator, path.join(own, 'spec.current.json'), '--stage', 'draft', '--json'])
  write('native1.validation.json', JSON.parse(receipt.stdout))
  assert.equal(receipt.status, 0, receipt.stdout)
  console.log(receipt.stdout)
} else if (process.argv[2] === 'render') {
  const spec = path.join(own, 'spec.current.json')
  assert.equal(read(path.join(own, 'native1.receipt.json')).status, 0)
  const receipt = run('render1.receipt.json', 'node', [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', spec,
    '--svg', path.join(own, 'fig-23.svg'),
    '--png', path.join(own, 'fig-23.full.png'),
    '--report', path.join(own, 'fig-23.render.json'),
  ])
  console.log(JSON.stringify({ status: receipt.status, stdout: receipt.stdout, stderr: receipt.stderr }))
} else {
  throw new Error('Choose prepare, repair, or render')
}
