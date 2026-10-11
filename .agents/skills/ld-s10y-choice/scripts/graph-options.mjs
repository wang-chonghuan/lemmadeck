import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

function affineSpec(id, graph, source, text, reference, frame) {
  const { k, l = 0, domain, integers = false, closed = [true, true] } = graph
  if (!Number.isFinite(k) || !Number.isFinite(l) || !frame ||
    (domain !== undefined && (!Array.isArray(domain) || domain.length !== 2 ||
      !domain.every(Number.isFinite) || domain[0] >= domain[1])) ||
    !Array.isArray(closed) || closed.length !== 2 || closed.some(value => typeof value !== 'boolean') ||
    typeof integers !== 'boolean' ||
    (integers && !domain)) throw new Error('Invalid affine graph model/frame')
  if (!Array.isArray(frame.bounds) || frame.bounds.length !== 4) throw new Error('Invalid affine coordinate frame')
  const [left, top, right, bottom] = frame.bounds
  const { xStep, yStep } = frame
  if (![left, top, right, bottom, xStep, yStep].every(Number.isFinite) ||
    left >= 0 || right <= 0 || bottom >= 0 || top <= 0 || xStep <= 0 || yStep <= 0) {
    throw new Error('Invalid affine coordinate frame')
  }
  for (const [values, min, max] of [[frame.xTicks ?? [], left, right], [frame.yTicks ?? [], bottom, top]]) {
    if (!Array.isArray(values) || values.some(value => !Number.isFinite(value) || value < min || value > max)) {
      throw new Error('Invalid affine axis ticks')
    }
  }
  const dx = right - left
  const dy = top - bottom
  const box = [left - dx * 0.35, top + dy * 0.25, right + dx * 0.25, bottom - dy * 0.25]
  const ticks = (values, horizontal) => values.map(value => ({
    at: horizontal ? [value, bottom] : [left, value], label: String(value), size: (horizontal ? dy : dx) * 0.015,
    fontSize: 27, labelPlacement: {
      position: horizontal ? 'S' : 'W', offset: [0, 0], gap: 25 },
  }))
  const objects = [
    { id: 'grid', type: 'grid', bounds: frame.bounds, xStep, yStep, stroke: 'grid', strokeWidth: 1 },
    { id: 'x-axis', type: 'axis', from: [left, 0], to: [right, 0], stroke: 'ink', strokeWidth: 1.5 },
    { id: 'y-axis', type: 'axis', from: [0, bottom], to: [0, top], stroke: 'ink', strokeWidth: 1.5 },
    { id: 'x-scale', type: 'axis', from: [left, bottom], to: [right, bottom], stroke: 'muted', strokeWidth: 1,
      ticks: ticks(frame.xTicks ?? [], true) },
    { id: 'y-scale', type: 'axis', from: [left, bottom], to: [left, top], stroke: 'muted', strokeWidth: 1,
      ticks: ticks(frame.yTicks ?? [], false) },
    { id: 'x-label', type: 'text', at: [right + dx * 0.14, -dy * 0.06],
      text: frame.xLabel ?? 'x', fontSize: 27, labelPlacement: { position: 'CENTER', offset: [0, 0] } },
    { id: 'y-label', type: 'text', at: [dx * 0.065, top + dy * 0.14],
      text: frame.yLabel ?? 'y', fontSize: 27, labelPlacement: { position: 'CENTER', offset: [0, 0] } },
  ]
  const assertions = [
    { id: 'perp', type: 'perpendicular', a: [left, 0], b: [right, 0], c: [0, bottom], d: [0, top] },
    { id: 'grid-size', type: 'gridDimensions', grid: 'grid', columns: dx / xStep, rows: dy / yStep },
  ]
  const at = x => [x, k * x + l]
  const point = (name, x, included = true) => {
    objects.push({ id: name, type: 'point', at: at(x), stroke: 'ink', fill: included ? 'ink' : 'paper', size: 4 })
    assertions.push({ id: `${name}-on-line`, type: 'pointOnLine', point: name, a: at(0), b: at(1) })
  }
  if (integers) {
    let count = 0
    for (let x = Math.ceil(Math.max(domain[0], left)); x <= Math.floor(Math.min(domain[1], right)); x += 1) {
      if ((x === domain[0] && !closed[0]) || (x === domain[1] && !closed[1])) continue
      const y = k * x + l
      if (y < bottom || y > top) continue
      point(`sample-${x}`, x)
      count += 1
    }
    if (!count) throw new Error('Graph outside frame')
    assertions.push({ id: 'sample-count', type: 'objectCount', objectType: 'point', count })
  } else {
    let start = Math.max(left, domain?.[0] ?? left)
    let end = Math.min(right, domain?.[1] ?? right)
    if (k !== 0) {
      const crossings = [(bottom - l) / k, (top - l) / k].sort((a, b) => a - b)
      start = Math.max(start, crossings[0])
      end = Math.min(end, crossings[1])
    }
    if (start >= end || (k === 0 && (l < bottom || l > top))) throw new Error('Graph outside frame')
    objects.push({ id: 'function', type: 'segment', from: at(start), to: at(end),
      stroke: 'ink', strokeWidth: 3 })
    assertions.push({ id: 'function-start', type: 'pointOnLine', point: at(start), a: at(0), b: at(1) },
      { id: 'function-end', type: 'pointOnLine', point: at(end), a: at(0), b: at(1) })
    if (domain) {
      if (start === domain[0]) point('start', start, closed[0])
      if (end === domain[1]) point('end', end, closed[1])
    }
  }
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: 'Exact authored function graph; domain restrictions and endpoint inclusion are explicit.',
    source: { image: source, authoritativeText: [...reference.authoritativeText, { text }],
      inventory: [{ id: 'source-frame-reference', description: reference.description,
        objects: ['grid', 'x-axis', 'y-axis', 'x-label', 'y-label'],
        assertions: ['perp', 'grid-size'] }] },
    canvas: { width: 400, height: 400, boundingBox: box, keepAspectRatio: false, background: 'paper' },
    display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 400, minTextPx: 16, widths: [240, 400] },
    objects, assertions,
  }
}

export function graphSpec(id, graph, source, text, reference, frame) {
  if (!reference?.description?.trim() || !Array.isArray(reference.authoritativeText) ||
    !reference.authoritativeText.length || reference.authoritativeText.some((item) => !item.text?.trim())) {
    throw new Error('Inspected source inventory and complete edition text required')
  }
  if (graph.type === 'affine') return affineSpec(id, graph, source, text, reference, frame)
  const { k, type } = graph
  if (type !== 'points' && (!Number.isFinite(k) || k === 0 ||
    !['inverse', 'inverse-positive', 'direct', 'direct-positive'].includes(type))) throw new Error('Invalid graph model')
  const box = [-9, 9, 9, -9]
  const extent = 8
  const inverse = type.startsWith('inverse')
  const positive = type.endsWith('positive')
  const objects = [
    { id: 'grid', type: 'grid', xStep: type === 'points' ? 1 : 2, yStep: type === 'points' ? 1 : 2,
      bounds: [-8, 8, 8, -8], stroke: 'grid', strokeWidth: 1 },
    { id: 'x-axis', type: 'axis', from: [-8, 0], to: [8, 0], stroke: 'ink', strokeWidth: 1.5,
      ticks: [-4, 4].map((x) => ({ at: [x, 0], label: String(x), size: 0.15, fontSize: 27,
        labelPlacement: { position: 'S', offset: [0, 5], gap: 2, fallback: true } })) },
    { id: 'y-axis', type: 'axis', from: [0, -8], to: [0, 8], stroke: 'ink', strokeWidth: 1.5,
      ticks: [-4, 4].map((y) => ({ at: [0, y], label: String(y), size: 0.15, fontSize: 27,
        labelPlacement: { position: 'W', offset: [-5, 0], gap: 2, fallback: true } })) },
    { id: 'x-label', type: 'text', at: type === 'points' ? [7.6, -3] : [7, -1.2], text: 'x', fontSize: 27,
      labelPlacement: { position: 'CENTER', offset: [0, 0] } },
    { id: 'y-label', type: 'text', at: type === 'points' ? [1, 8] : [1.2, 7], text: 'y', fontSize: 27,
      labelPlacement: { position: 'CENTER', offset: [0, 0] } },
  ]
  if (type === 'points') {
    for (const [label, x, y] of graph.points) {
      objects.push({ id: `point-${label}`, type: 'point', at: [x, y], label, fontSize: 27,
        stroke: 'ink', fill: 'ink', size: 3 })
    }
  } else for (const sign of positive ? [1] : [-1, 1]) {
    const points = []
    const start = inverse ? Math.abs(k) / extent : 0
    const end = inverse ? extent : Math.min(extent, extent / Math.abs(k))
    for (let i = 0; i <= 320; i += 1) {
      const x = sign * (start + (end - start) * i / 320)
      const y = inverse ? k / x : k * x
      points.push([x - box[0], box[1] - y])
    }
    objects.push({ id: `curve-${sign < 0 ? 'negative' : 'positive'}`, type: 'svgPath',
      d: points.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' '), stroke: 'ink', strokeWidth: 3 })
  }
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: 'Authored recognition option; exact mathematical curve, not a reproduction of the source graph.',
    source: { image: source, authoritativeText: [...reference.authoritativeText, { text }],
      inventory: [{ id: 'source-frame-reference',
        description: reference.description,
        objects: ['grid', 'x-axis', 'y-axis', 'x-label', 'y-label'], assertions: ['perp', 'grid-size'] }] },
    canvas: { width: 400, height: 400, boundingBox: box, background: 'paper' },
    display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 400, minTextPx: 16, widths: [240, 400] },
    objects, assertions: [
      { id: 'perp', type: 'perpendicular', a: [-8, 0], b: [8, 0], c: [0, -8], d: [0, 8] },
      { id: 'grid-size', type: 'gridDimensions', grid: 'grid',
        columns: type === 'points' ? 16 : 8, rows: type === 'points' ? 16 : 8 },
    ],
  }
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`${command} failed`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [file, sourceImage, inventoryFile] = process.argv.slice(2)
  if (!file || !sourceImage || !inventoryFile) {
    throw new Error('Usage: graph-options.mjs <choices.json> <reference-source.png> <inspected-inventory.json>')
  }
  const reference = JSON.parse(fs.readFileSync(inventoryFile, 'utf8'))
  const document = JSON.parse(fs.readFileSync(file, 'utf8'))
  const directory = path.dirname(path.resolve(file))
  const source = { path: sourceImage, sha256: hash(sourceImage) }
  const rendered = new Map()
  const renderFigure = (id, graph, frame, text) => {
      const base = path.join(directory, 'choice-figures', id)
      const spec = graphSpec(id, graph, source, text, reference, frame)
      const key = JSON.stringify(spec)
      if (rendered.has(id)) {
        if (rendered.get(id).key !== key) throw new Error(`Conflicting graph definition ${id}`)
        return rendered.get(id).figure
      }
      fs.mkdirSync(path.dirname(base), { recursive: true })
      fs.writeFileSync(`${base}.spec.json`, `${JSON.stringify(spec, null, 2)}\n`)
      run('python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${base}.spec.json`, '--stage', 'draft'])
      run('node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
        '--spec', `${base}.spec.json`, '--svg', `${base}.svg`, '--report', `${base}.render.json`])
      const figure = { spec: `choice-figures/${id}.spec.json`, svg: `choice-figures/${id}.svg`,
        render: `choice-figures/${id}.render.json`, review: `choice-figures/${id}.review.json` }
      rendered.set(id, { key, figure })
      return figure
  }
  for (const question of document.questions) {
    if (question.verification.kind === 'graph') for (const option of question.options) {
      option.figure = renderFigure(`fig-choice-${question.id}-${option.id}`,
        option.graph, question.graphFrame, question.prompt)
    }
    if (question.generatedGraphs) question.generatedFigures = question.generatedGraphs.map(figure =>
      renderFigure(figure.id, figure.graph, figure.frame, figure.text))
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`)
}
