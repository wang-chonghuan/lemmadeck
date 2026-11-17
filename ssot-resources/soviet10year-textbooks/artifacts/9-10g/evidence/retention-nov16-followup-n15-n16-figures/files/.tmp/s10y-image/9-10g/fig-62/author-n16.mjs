import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const base = path.join(root, '.tmp/s10y-image/9-10g')
const templates = path.join(root, '.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n16')
const lesson = JSON.parse(fs.readFileSync(path.join(templates, 'lesson.template.json')))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, data) => {
  const bytes = `${JSON.stringify(data, null, 2)}\n`
  if (fs.existsSync(file)) {
    if (fs.readFileSync(file, 'utf8') === bytes) return
    assert(file.endsWith('.spec.json'), `Preserve existing binding: ${file}`)
    assert(!fs.existsSync(file.replace('.spec.json', '.svg')), `Do not replace rendered draft: ${file}`)
  }
  fs.writeFileSync(file, bytes)
}
const specs = []

function figure(number, height, description, proseIndexes) {
  const id = `fig-${number}`
  const directory = path.join(base, id)
  const source = path.join(root, `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/${id}.png`)
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: {
      image: { path: source, sha256: hash(source) },
      authoritativeText: proseIndexes.map(index => ({ lesson: lesson.id, text: lesson.prose[index].text })),
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper' },
    display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
    objects: [], assertions: [], layout: { minLabelGap: 3 },
  }
  const p = (x, y) => [x, height - y]
  const point = (id, x, y, label, position = 'S', visible = true) => {
    spec.objects.push({
      id, type: 'point', at: p(x, y), ...(label ? { label } : {}),
      visible, size: 3, stroke: 'ink', fill: 'ink', fontSize: 22, fontWeight: 500,
      labelPlacement: { position, gap: 25 },
    })
    return id
  }
  const text = (id, x, y, value) => {
    spec.objects.push({
      id, type: 'text', at: p(x, y), text: value, fontSize: 22, fontWeight: 500,
      labelPlacement: { position: 'CENTER' },
    })
    return id
  }
  const segment = (id, from, to, width = 1.5) => {
    spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: width, dash: 0 })
    spec.assertions.push({ id: `${id}-endpoints`, type: 'connects', arrow: id, from, to })
    return id
  }
  const ray = (id, from, to, width = 4) => {
    spec.objects.push({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: width, dash: 0 })
    spec.assertions.push({ id: `${id}-endpoints`, type: 'connects', arrow: id, from, to })
    return id
  }
  const polygon = (id, vertices) => {
    spec.objects.push({
      id, type: 'polygon', points: vertices.map(([x, y]) => p(x, y)),
      stroke: 'ink', strokeWidth: 1.5, fill: 'paper', fillOpacity: 0, dash: 0,
    })
    return id
  }
  const relation = (id, type, data) => {
    spec.assertions.push({ id, type, ...data, tolerance: 1e-7 })
    return id
  }
  const inventory = (id, description, objects, assertions) => {
    spec.source.inventory.push({ id, description, objects, assertions, requires: ['pointRelationships'] })
  }
  specs.push({ spec, directory })
  return { spec, directory, p, point, text, segment, ray, polygon, relation, inventory }
}

{
  const f = figure(62, 660, 'Two source plane cases distinguish co-directed and oppositely directed rays on distinct parallel supports; no metric condition on the oblique envelope.', [1])
  const { p, point, text, segment, ray, polygon, relation, inventory } = f
  polygon('a-plane', [[55,115],[105,65],[240,31.6666666667],[405,35],[550,85],[560,130.5],[585,175],[480,235],[330,267],[140,254.5833333333],[65,225],[42,175]])
  point('a-O1', 160, 210, 'O₁', 'W')
  point('a-O2', 208, 103, 'O₂', 'NW')
  point('a-A1', 480, 235, 'A₁', 'SE', false)
  point('a-A2', 560, 130.5, 'A₂', 'E', false)
  segment('a-boundary', p(240, 31.6666666667), p(140, 254.5833333333), 2)
  ray('a-h1', 'a-O1', 'a-A1')
  ray('a-h2', 'a-O2', 'a-A2')
  text('a-h1-name', 350, 188, 'h₁')
  text('a-h2-name', 425, 101, 'h₂')
  text('a-alpha1', 330, 60, 'α₁')
  text('a-alpha2', 86, 165, 'α₂')
  text('a-case', 320, 304, 'a)')
  relation('a-boundary-O1', 'collinear', { a: 'a-O1', b: 'a-O2', c: p(240, 31.6666666667) })
  relation('a-boundary-O2', 'collinear', { a: 'a-O1', b: 'a-O2', c: p(140, 254.5833333333) })
  relation('a-parallel', 'parallel', { a: 'a-O1', b: 'a-A1', c: 'a-O2', d: 'a-A2' })
  inventory('source-a', 'Original a: distinct origins O1/O2 on the dividing boundary; A1/A2 in the same half-plane, h1/h2 rightward, alpha1/alpha2 and a. Polygon envelope/arrowheads/layout are additions; no source length equality.',
    ['a-plane','a-O1','a-O2','a-A1','a-A2','a-boundary','a-h1','a-h2','a-h1-name','a-h2-name','a-alpha1','a-alpha2','a-case'],
    ['a-boundary-O1','a-boundary-O2','a-parallel','a-h1-endpoints','a-h2-endpoints','a-boundary-endpoints'])

  polygon('b-plane', [[72,513.5],[55,460],[85,406],[132,373.5225806452],[235,355],[395,361],[535,392],[572,429],[600,482],[585,535],[481,571.664516129],[335,605],[155,590],[78,550]])
  point('b-O1', 390, 520, 'O₁', 'S')
  point('b-O2', 235, 432, 'O₂', 'N')
  point('b-A1', 572, 429, 'A₁', 'NE', false)
  point('b-A2', 72, 513.5, 'A₂', 'W', false)
  segment('b-boundary', p(132, 373.5225806452), p(481, 571.664516129), 2)
  ray('b-h1', 'b-O1', 'b-A1')
  ray('b-h2', 'b-O2', 'b-A2')
  text('b-h1-name', 455, 464, 'h₁')
  text('b-h2-name', 140, 456, 'h₂')
  text('b-alpha1', 516, 517, 'α₁')
  text('b-alpha2', 240, 567, 'α₂')
  text('b-case', 320, 637, 'b)')
  relation('b-boundary-O1', 'collinear', { a: 'b-O1', b: 'b-O2', c: p(132, 373.5225806452) })
  relation('b-boundary-O2', 'collinear', { a: 'b-O1', b: 'b-O2', c: p(481, 571.664516129) })
  relation('b-parallel', 'parallel', { a: 'b-O1', b: 'b-A1', c: 'b-O2', d: 'b-A2' })
  inventory('source-b', 'Original b: O2 upper-left of O1 on the divider; h1 points to A1 upper-right, h2 to A2 lower-left in opposite half-planes; all labels retained. No central-symmetric A-pair or source length equality is claimed.',
    ['b-plane','b-O1','b-O2','b-A1','b-A2','b-boundary','b-h1','b-h2','b-h1-name','b-h2-name','b-alpha1','b-alpha2','b-case'],
    ['b-boundary-O1','b-boundary-O2','b-parallel','b-h1-endpoints','b-h2-endpoints','b-boundary-endpoints'])
}

{
  const f = figure(63, 640, 'All four source collinear ray cases, preserving order, coincidence and solid thin/bold traces. Central symmetry checks opposite rays with explicitly regularized finite tips, not source-given lengths.', [4])
  const { p, point, text, segment, ray, relation, inventory } = f
  const rows = [
    { id: 'a', y: 95, o1: 250, o2: 370, t1: 465, t2: 600, names: [300,510] },
    { id: 'b', y: 245, o1: 300, o2: 410, t1: 110, t2: 600, names: [210,505] },
    { id: 'c', y: 395, o1: 305, o2: 425, t1: 585, t2: 145, names: [520,220] },
    { id: 'd', y: 545, o1: 340, o2: 340, t1: 100, t2: 580, names: [220,470] },
  ]
  for (const row of rows) {
    const { id, y, o1, o2, t1, t2, names } = row
    const objects = []
    objects.push(point(`${id}-O1`, o1, y, id === 'd' ? 'O₁ = O₂' : 'O₁'))
    objects.push(point(`${id}-O2`, o2, y, id === 'd' ? undefined : 'O₂', 'S', id !== 'd'))
    objects.push(segment(`${id}-support`, p(80,y), p(605,y), 1.4))
    objects.push(ray(`${id}-h1`, `${id}-O1`, p(t1,y)))
    objects.push(ray(`${id}-h2`, `${id}-O2`, p(t2,y)))
    objects.push(text(`${id}-h1-name`, names[0], y-38, 'h₁'))
    objects.push(text(`${id}-h2-name`, names[1], y-38, 'h₂'))
    objects.push(text(`${id}-case`, 35, y, `${id})`))
    const assertions = [
      relation(`${id}-collinear`, 'collinear', { a: `${id}-O1`, b: p(80,y), c: `${id}-O2` }),
      `${id}-support-endpoints`, `${id}-h1-endpoints`, `${id}-h2-endpoints`,
    ]
    if (id !== 'a') {
      assertions.push(relation(`${id}-opposite-midpoints`, 'centralSymmetry', {
        center: p((o1+o2)/2,y),
        pairs: [{ a: `${id}-O1`, b: `${id}-O2` }, { a: p(t1,y), b: p(t2,y) }],
      }))
    }
    if (id === 'd') {
      // The second coincident origin is construction-only; the source has one dot.
      objects.splice(objects.indexOf('d-O2'), 1)
      assertions.push(relation('d-common-origin', 'distance', { a: 'd-O1', b: p(o2,y), value: 0 }))
      const symmetry = f.spec.assertions.find(item => item.id === 'd-opposite-midpoints')
      symmetry.pairs[0].b = 'd-O1'
      const collinear = f.spec.assertions.find(item => item.id === 'd-collinear')
      collinear.c = 'd-O1'
      const rayAssertion = f.spec.assertions.find(item => item.id === 'd-h2-endpoints')
      rayAssertion.from = 'd-O1'
      f.spec.objects.find(item => item.id === 'd-h2').from = 'd-O1'
      f.spec.objects = f.spec.objects.filter(item => item.id !== 'd-O2')
    }
    inventory(`source-${id}`, `Source row ${id}; h1/h2 and printed origins retained, with English row letter and arrowheads added. Opposite finite tips, where present, use declared regularization rather than a source equality.`, objects, assertions)
    if (id === 'd') delete f.spec.source.inventory.at(-1).requires
  }
}

{
  const f = figure(64, 480, 'Given ray AB and line m through M: the bold m1 is co-directed with AB, the thin m2 oppositely directed. Central symmetry at M checks the common origin and both regularized finite tips.', [9,10,11])
  const { p, point, text, ray, relation, inventory } = f
  point('A', 100, 390, 'A', 'SW')
  point('B', 210, 243.3333333333, 'B', 'W', false)
  point('M', 390, 260, 'M', 'E')
  ray('AB', 'A', p(325,90), 4)
  ray('m1', 'M', p(525,80), 4)
  ray('m2', 'M', p(255,440), 1.7)
  text('m-name', 435, 173, 'm')
  text('m1-name', 560, 100, 'm₁')
  text('m2-name', 285, 435, 'm₂')
  relation('AB-B', 'collinear', { a: 'A', b: 'B', c: p(325,90) })
  relation('AB-m1-parallel', 'parallel', { a: 'A', b: 'B', c: 'M', d: p(525,80) })
  relation('m-collinear', 'collinear', { a: 'M', b: p(525,80), c: p(255,440) })
  // Equal finite extents are declared regularization, not source-given lengths.
  relation('m-opposite-midpoints', 'centralSymmetry', {
    center: 'M',
    pairs: [
      { a: 'M', b: 'M' },
      { a: p(435,200), b: p(345,320) },
      { a: p(525,80), b: p(255,440) },
    ],
  })
  inventory('source-main', 'Source A origin dot, unmarked B, M dot, AB/m/m1/m2; thin m2 and bold AB/m1 retained. Arrowheads and reflected finite parameter samples are additions, not source lengths or right angles.',
    ['A','B','M','AB','m1','m2','m-name','m1-name','m2-name'],
    ['AB-endpoints','m1-endpoints','m2-endpoints','AB-B','AB-m1-parallel','m-collinear','m-opposite-midpoints'])
}

{
  const f = figure(65, 500, 'Source spatial co-direction illustration: h1, h2 and h3 rise from three distinct origins on an oblique plane. This projection asserts direction and incidence only, not perpendicularity, rectangleness, equal lengths or exhaustive relative-position classification.', [12,13,14])
  const { p, point, text, segment, ray, polygon, relation, inventory } = f
  const envelope = [[50,245],[100,200],[240,196],[400,218],[535,250],[585,300],[590,348],[520,405],[390,447],[240,454],[125,420],[45,342]]
  polygon('plane-envelope', envelope)
  point('h3-origin', 130, 250)
  point('h2-origin', 295, 402)
  point('h1-origin', 520, 312)
  const origin = [[130,250],[295,402],[520,312]]
  function intersections(a, b) {
    const vector = [b[0]-a[0],b[1]-a[1]]
    const hits = []
    for (let index = 0; index < envelope.length; index++) {
      const c = envelope[index], d = envelope[(index+1)%envelope.length]
      const edge = [d[0]-c[0],d[1]-c[1]]
      const determinant = vector[0]*edge[1]-vector[1]*edge[0]
      if (Math.abs(determinant) < 1e-8) continue
      const offset = [c[0]-a[0],c[1]-a[1]]
      const t = (offset[0]*edge[1]-offset[1]*edge[0])/determinant
      const u = (offset[0]*vector[1]-offset[1]*vector[0])/determinant
      if (u >= 0 && u <= 1) hits.push([t,[a[0]+t*vector[0],a[1]+t*vector[1]]])
    }
    hits.sort((a,b) => a[0]-b[0])
    assert(hits.length >= 2)
    return [hits[0][1],hits.at(-1)[1]]
  }
  const planeAssertions = []
  for (const [a,b] of [[0,1],[1,2],[0,2]]) {
    const names = ['h3-origin','h2-origin','h1-origin']
    const id = `support-${a}-${b}`
    const ends = intersections(origin[a],origin[b])
    segment(id, p(...ends[0]), p(...ends[1]), 1.5)
    for (let side = 0; side < 2; side++) {
      planeAssertions.push(relation(`${id}-incidence-${side}`, 'collinear', {
        a: names[a], b: names[b], c: p(...ends[side]),
      }))
    }
    planeAssertions.push(`${id}-endpoints`)
  }
  ray('h3', 'h3-origin', p(130,40))
  ray('h2', 'h2-origin', p(295,185))
  ray('h1', 'h1-origin', p(520,65))
  text('h3-name', 165, 105, 'h₃')
  text('h2-name', 330, 238, 'h₂')
  text('h1-name', 555, 130, 'h₁')
  for (const name of ['h1','h2','h3']) {
    planeAssertions.push(relation(`${name}-on-plane-envelope`, 'inside', { point: `${name}-origin`, container: 'plane-envelope' }))
  }
  const rayAssertions = ['h1-endpoints','h2-endpoints','h3-endpoints']
  for (const [a,b] of [['h1','h2'],['h2','h3'],['h1','h3']]) {
    const first = f.spec.objects.find(item => item.id === a)
    const second = f.spec.objects.find(item => item.id === b)
    rayAssertions.push(relation(`${a}-${b}-parallel`, 'parallel', { a: first.from, b: first.to, c: second.from, d: second.to }))
  }
  inventory('source-plane', 'Irregular plane outline with three distinct unlabelled origin dots and all three supporting lines extended to the envelope; no spatial metric claims. Polygonal outline is a modern contain envelope.',
    ['plane-envelope','h1-origin','h2-origin','h3-origin','support-0-1','support-1-2','support-0-2'], planeAssertions)
  inventory('source-rays', 'h3 left/rear, h2 front/middle, h1 right/rear; three bold upward co-directed rays and ONLY h1/h2/h3 labels. Arrowheads are added. This is not the task167 solution diagram.',
    ['h1-origin','h2-origin','h3-origin','h1','h2','h3','h1-name','h2-name','h3-name'], rayAssertions)
}

for (const { spec, directory } of specs) {
  assert(spec.objects.every(object => object.type !== 'svgPath'))
  write(path.join(directory, `${spec.id}.spec.json`), spec)
  write(path.join(directory, 'context-binding.json'), {
    ticket: 'STEMROBIN-184', branch: 'codex/STEMROBIN-184-textbooks', status: 'draft',
    sourceImage: spec.source.image,
    inventory: { path: path.join(directory, 'source-inventory.md'), sha256: hash(path.join(directory, 'source-inventory.md')) },
    templates: ['lesson.template.json','exercises.template.json','figures.template.json'].map(name => ({
      path: path.join(templates,name), sha256: hash(path.join(templates,name)),
    })),
    sourcePixelViews: 1, review: 'Independent review pending; no approval or promotion.',
  })
}
console.log('Authored four draft FigureSpec@2 files after source inventories; no rendering or promotion.')
