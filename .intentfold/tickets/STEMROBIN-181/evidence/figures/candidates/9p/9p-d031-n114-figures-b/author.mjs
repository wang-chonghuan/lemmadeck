import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const card = 'phy9-c2-s5-n114'
const ticketTmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, data) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`), 'Owned root only')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const chinese = path.join(ticketTmp, `d031-n114-prose-author/work/adapt/9p/modern-us-neutral/lessons/${card}/lesson.template.json`)
const english = path.join(ticketTmp, 'd031-n114-prose-author/english/lesson.json')
const science = path.join(ticketTmp, '9p-n114-science-review.json')
const firstPair = path.join(ticketTmp, 'd031-n114-figures-a-independent-review.json')
for (const [file, expected] of [
  [chinese, '72802abd6f3c39e3389862d3cbfd29f62242d6de529bfeee761748962b988cb6'],
  [english, 'd76eed399c4a74d287e4f7dac369fa5ea4aa2a24757d049de21326541ae856c5'],
  [science, '75456eabec7b4a666cd5e00db5b2c7f8791b902f96190f4a5f026cb19e0151b8'],
  [firstPair, 'c5e3d2909c0321aea788fe0f635779de8b8fa95f0a6b76d801e57b8d923d601c'],
]) assert.equal(hash(file), expected, file)
assert.equal(read(science).status, 'PASS')
const zh = read(chinese), en = read(english)
const inventoryFile = path.join(own, 'source-inventory.json')
const inventory = read(inventoryFile)
assert.equal(inventory.inventoryCompletedBeforeDrawing, true)
const inputs = { chinese: bind(chinese), english: bind(english), science: bind(science), firstPair: bind(firstPair) }
write(path.join(own, 'input-bindings.json'), {
  ...inputs, sourceInventory: bind(inventoryFile),
  chineseReadInFull: true, englishReadInFull: true,
  scienceReusedWithoutNewApproval: true,
  earlierPairIsLayoutTextOnlyNotSourceFacts: true,
})

function build(id, height, description) {
  const objects = [], assertions = [], wires = [], references = [], currents = [], masks = []
  const buckets = {}
  const p = (x, y) => [x, height - y]
  const put = (object, bucket) => {
    objects.push(object)
    if (bucket) (buckets[bucket] ||= []).push(object.id)
    return object.id
  }
  const point = (name, x, y, bucket) => put({
    id: name, type: 'point', at: p(x, y), size: 3,
    stroke: 'ink', fill: 'ink', strokeWidth: 1,
  }, bucket)
  const label = (name, text, x, y, bucket = 'additions') => put({
    id: name, type: 'text', text, at: p(x, y), fontSize: 32,
    fontWeight: 500, labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  }, bucket)
  const edge = (name, from, to, bucket, kind = 'wire') => {
    put({
      id: name, type: kind === 'current' ? 'arrow' : 'segment', from, to,
      stroke: kind === 'reference' ? 'muted' : kind === 'mask' ? 'paper' : 'ink',
      strokeWidth: kind === 'reference' ? 2.5 : kind === 'current' ? 5 : kind === 'mask' ? 11 : 4,
      ...(kind === 'reference' ? { dash: 2 } : {}),
    }, bucket)
    assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from, to })
    ;({ wire: wires, reference: references, current: currents, mask: masks }[kind]).push(name)
  }
  const chain = (prefix, nodes, bucket, kind = 'wire') => {
    const names = []
    for (let i = 1; i < nodes.length; i++) {
      const name = `${prefix}-${i}`
      edge(name, nodes[i - 1], nodes[i], bucket, kind)
      names.push(name)
    }
    return names
  }
  const box = (prefix, x1, x2, y1, y2, split = true) => {
    put({
      id: `${prefix}-box`, type: 'polygon',
      points: [p(x1, y1), p(x2, y1), p(x2, y2), p(x1, y2)],
      stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1,
    }, 'supply')
    const middle = (y1 + y2) / 2
    point(`${prefix}-left-terminal`, x1, middle, 'supply')
    point(`${prefix}-right-terminal`, x2, middle, 'supply')
    const labels = split
      ? [label(`${prefix}-power-label`, 'Power', (x1 + x2) / 2, middle - 20), label(`${prefix}-supply-label`, 'supply', (x1 + x2) / 2, middle + 20)]
      : [label(`${prefix}-supply-label`, 'Power supply', (x1 + x2) / 2, middle)]
    for (const name of labels) assertions.push({
      id: `${name}-inside`, type: 'inside', point: name, container: `${prefix}-box`,
    })
  }
  const coords = ref => typeof ref === 'string' ? objects.find(item => item.id === ref).at : ref
  const displacement = (name, from, to) => {
    const a = coords(from), b = coords(to)
    assertions.push({ id: name, type: 'displacement', from, to, dx: b[0] - a[0], dy: b[1] - a[1] })
  }
  const parallel = (name, a, b, c, d) => assertions.push({ id: name, type: 'parallel', a, b, c, d })
  const current = (name, from, to, wireFrom, wireTo, direction, origin) => {
    edge(name, from, to, origin === 'source' ? 'source-currents' : 'added-currents', 'current')
    displacement(`${name}-direction`, from, to)
    for (const [suffix, value] of [['tail', from], ['tip', to]]) assertions.push({
      id: `${name}-on-wire-${suffix}`, type: 'collinear', a: wireFrom, b: wireTo, c: value,
    })
    return { id: name, direction, origin }
  }
  const currentFacts = []
  const finish = (topology, additions) => {
    const visiblePoints = objects.filter(item => item.type === 'point')
    for (const item of visiblePoints.slice(1)) displacement(`${item.id}-relative-position`, visiblePoints[0].id, item.id)
    assertions.push({ id: 'current-arrow-count', type: 'objectCount', objectType: 'arrow', count: currents.length })
    const observed = inventory.figures.find(item => item.id === id)
    const sourcePNG = path.join(repo, observed.sourcePNG)
    assert.equal(hash(sourcePNG), observed.sha256)
    const sourceGroups = observed.items.map(item => {
      const ids = buckets[item.id] || []
      assert.ok(ids.length, `Unmapped source item ${item.id}`)
      return {
        id: item.id, description: `${item.observation} ${item.requirement}`,
        objects: ids,
        assertions: assertions.filter(a => ids.includes(a.arrow)).map(a => a.id),
      }
    })
    sourceGroups.push({
      id: `${id}-source-endpoint-relationships`,
      description: 'All distinct apparatus attachment/end points are mapped together to native connectivity, relative-position and parallel assertions. Pixel topology is preserved; drawing distances are modern schematic layout, not source measurements.',
      objects: visiblePoints.map(item => item.id),
      assertions: assertions.filter(item => ['displacement', 'parallel', 'collinear', 'connects'].includes(item.type)).map(item => item.id),
      requires: ['pointRelationships'],
    })
    const spec = {
      schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
      source: {
        image: bind(sourcePNG),
        authoritativeText: [zh, en].flatMap(lesson => lesson.prose.filter(block => block.text?.trim()).map(block => ({ lesson: card, text: block.text }))),
        inventory: sourceGroups,
      },
      canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
      assets: [], objects, assertions, layout: { minLabelGap: 6 },
    }
    const out = path.join(own, id, 'initial')
    write(path.join(out, 'spec.json'), spec)
    write(path.join(out, 'geometry.json'), {
      id, wires, references, currents, masks, currentFacts, topology,
      expectedLabels: objects.filter(item => item.type === 'text').map(item => item.text),
      additions, unknownPixels: observed.unknownPixels,
      sourceInventory: bind(inventoryFile),
      noSourceGlyphInterpretation: true, fullTextBound: inputs,
    })
    write(path.join(own, id, 'complete-context.json'), {
      schema: 'ld-s10y-image/complete-context@1', figure: id, card,
      rule: 'Complete approved edition text is authoritative; independently reopened durable source pixels supply structure.',
      bindings: inputs, sourcePNG: bind(sourcePNG),
      chineseCompleteLesson: zh, englishCompleteLesson: en,
      chineseFigurePointer: `/prose/${zh.prose.findIndex(block => block.id === id)}`,
      englishFigurePointer: `/prose/${en.prose.findIndex(block => block.id === id)}`,
      exercises: [], sourceInventory: observed,
      scienceStatus: 'PASS (reused hash-bound evidence; no new SCI decision)',
    })
    write(path.join(out, 'repair-history.json'), {
      repairCount: 0, maximumRepairs: 1, remainingRepairs: 1,
      initialSpec: bind(path.join(out, 'spec.json')),
      failures: [], policy: 'One targeted repair per figure total. Preserve initial artifacts and failures; failed repair means HOLD without another retry.',
    })
  }
  return { p, objects, assertions, buckets, point, label, edge, chain, box, displacement, parallel, current, currentFacts, finish }
}

{
  const f = build('fig-235', 760, 'Two current-carrying branches share an upper and a lower rail. Both currents point upward; solid flexible wires are displaced inward from two dashed initial positions, representing attraction of the adjacent parallel middle portions, not a rule about arbitrary complete circuits.')
  const { p } = f
  f.box('source', 60, 300, 590, 710, false)
  f.buckets['235-source-supply-and-leads'] = [...f.buckets.supply]
  f.label('heading', 'Closed circuit', 320, 40)
  f.label('condition', 'Same direction', 320, 90)
  for (const [name, x, y] of [
    ['upper-feed', 210, 160], ['lower-feed', 210, 510],
    ['left-upper', 360, 160], ['right-upper', 480, 160],
    ['left-lower', 360, 510], ['right-lower', 480, 510],
  ]) f.point(name, x, y, '235-source-bars')
  f.chain('upper-rail', ['upper-feed', 'left-upper', 'right-upper'], '235-source-bars')
  f.chain('lower-rail', ['lower-feed', 'left-lower', 'right-lower'], '235-source-bars')
  f.chain('upper-feed-lead', ['source-left-terminal', p(30, 615), p(65, 380), p(140, 190), 'upper-feed'], '235-source-supply-and-leads')
  f.chain('lower-return-lead', ['lower-feed', p(310, 550), p(340, 590), p(340, 650), 'source-right-terminal'], '235-source-supply-and-leads')
  for (const side of ['left', 'right']) {
    const x = side === 'left' ? 400 : 440
    f.edge(`${side}-initial-position`, `${side}-upper`, `${side}-lower`, '235-source-reference-traces', 'reference')
    f.chain(`${side}-wire`, [`${side}-upper`, p(x, 245), p(x, 425), `${side}-lower`], '235-source-conductors')
    f.currentFacts.push(f.current(`${side}-current`, p(x, 365), p(x, 290), p(x, 245), p(x, 425), 'up', 'source'))
    f.label(`${side}-I-label`, 'I', side === 'left' ? 335 : 505, 330)
  }
  f.buckets['235-source-current-arrows'] = f.buckets['source-currents']
  f.parallel('initial-positions-parallel', 'left-upper', 'left-lower', 'right-upper', 'right-lower')
  f.parallel('facing-portions-parallel', p(400, 245), p(400, 425), p(440, 245), p(440, 425))
  f.parallel('rail-parallelism', 'upper-feed', 'right-upper', 'lower-feed', 'right-lower')
  f.displacement('left-inward-displacement', 'left-upper', p(400, 245))
  f.displacement('right-inward-displacement', 'right-upper', p(440, 245))
  f.finish({
    externalComponents: 1, externalCycleRank: 1, pairOfBranches: true,
    terminalPairs: [['source-left-terminal', 'source-right-terminal', true]],
    expectedJunctions: ['left-upper', 'left-lower'],
    forbiddenCrossings: true, parallelScope: 'Only facing middle sections; whole bowed wires are not parallel.',
  }, [
    'Generic labelled supply and schematic rail abstraction; no tiny box marks decoded.',
    'Two I labels and headings are modern English restatements; the two upward current arrows themselves are source-visible.',
    'Exact middle parallel sections and diagonal shoulders regularize inward bows; 40 px facing separation versus 120 px reference separation are schematic dimensions, not measured givens.',
  ])
}

{
  const f = build('fig-236', 810, 'Two independent parallel-wire circuits: left switch open, no steady left current; right closed with a single sustained current. There is no upper interconnection and no dashed reference. One added right current arrow is an illustrative direction convention, not a source-pixel direction claim.')
  const { p } = f
  f.box('left-source', 55, 285, 625, 755)
  f.box('right-source', 355, 585, 625, 755)
  f.buckets['236-source-left-leads-box'] = f.buckets.supply.filter(id => id.startsWith('left-'))
  f.buckets['236-source-right-leads-box'] = f.buckets.supply.filter(id => id.startsWith('right-'))
  f.label('heading', 'One current only', 320, 40)
  f.label('left-condition', 'Open', 150, 100)
  f.label('right-condition', 'Closed', 470, 100)
  for (const [name, x, y] of [
    ['left-upper', 255, 150], ['left-lower', 255, 520],
    ['right-upper', 395, 150], ['right-lower', 395, 520],
  ]) f.point(name, x, y, '236-source-parallel-wires')
  f.edge('left-wire', 'left-upper', 'left-lower', '236-source-parallel-wires')
  f.edge('right-wire', 'right-upper', 'right-lower', '236-source-parallel-wires')
  f.point('switch-pivot', 100, 455, '236-source-left-open-switch')
  f.point('switch-contact', 180, 455, '236-source-left-open-switch')
  f.point('switch-blade-tip', 142, 415, '236-source-left-open-switch')
  f.edge('open-switch-blade', 'switch-pivot', 'switch-blade-tip', '236-source-left-open-switch')
  f.objects.push({
    id: 'switch-base', type: 'polygon', points: [p(75, 483), p(205, 483), p(205, 506), p(75, 506)],
    stroke: 'muted', strokeWidth: 2, fill: 'paper', fillOpacity: 1,
  })
  f.buckets['236-source-left-open-switch'].push('switch-base')
  f.chain('left-source-to-switch', ['left-source-left-terminal', p(30, 690), p(30, 550), p(65, 480), 'switch-pivot'], '236-source-left-leads-box')
  f.chain('left-upper-lead', ['switch-contact', p(210, 410), p(190, 260), p(210, 190), 'left-upper'], '236-source-left-leads-box')
  f.chain('left-lower-return', ['left-lower', p(305, 550), p(315, 605), p(315, 690), 'left-source-right-terminal'], '236-source-left-leads-box')
  f.chain('right-upper-lead', ['right-upper', p(470, 175), p(530, 280), p(560, 440), p(600, 580), p(600, 690), 'right-source-right-terminal'], '236-source-right-leads-box')
  f.chain('right-lower-return', ['right-lower', p(360, 545), p(335, 585), p(335, 690), 'right-source-left-terminal'], '236-source-right-leads-box')
  f.currentFacts.push(f.current('right-current', p(395, 290), p(395, 380), 'right-upper', 'right-lower', 'down', 'addition'))
  f.label('left-current-condition', 'I = 0', 125, 340)
  f.label('right-I-label', 'I', 450, 340)
  f.label('switch-label', 'Open switch', 140, 550)
  f.buckets['236-source-traces'] = ['left-wire', 'right-wire']
  f.parallel('vertical-wires-parallel', 'left-upper', 'left-lower', 'right-upper', 'right-lower')
  f.displacement('wire-separation', 'left-upper', 'right-upper')
  f.displacement('open-switch-gap', 'switch-blade-tip', 'switch-contact')
  f.finish({
    externalComponents: 3, externalCycleRank: 0,
    terminalPairs: [['left-source-left-terminal', 'left-source-right-terminal', false], ['right-source-left-terminal', 'right-source-right-terminal', true]],
    isolatedCircuitPairs: [['left-upper', 'right-upper']],
    switchGap: ['switch-blade-tip', 'switch-contact'],
    expectedJunctions: [], forbiddenCrossings: true,
    parallelScope: 'The two straight vertical experiment wires.',
  }, [
    'One downward current arrow on the right is added from the approved one-current-only experiment. Downward is an illustrative convention; fig-236 source contains no arrow.',
    'I = 0 means no steady current in the open left circuit. No claim that a current-free object cannot experience any other force.',
    'English Open/Closed/Open switch and I labels; neutral rectangular two-terminal supplies; separated switch base is mechanical, not a conductive bridge.',
  ])
}

{
  const f = build('fig-237', 810, 'A two-conductor twisted pair in its own closed return circuit, with equal-magnitude opposite currents, beside an independent single downward-current wire circuit. Insulated crossings are not junctions; both members stay distinct. Approximate cancellation applies only to the far external region, not a zero-field claim.')
  const { p } = f
  f.box('pair-source', 55, 285, 625, 755)
  f.box('single-source', 355, 585, 625, 755)
  f.buckets['237-source-pair-leads-box'] = f.buckets.supply.filter(id => id.startsWith('pair-'))
  f.buckets['237-source-single-leads-box'] = f.buckets.supply.filter(id => id.startsWith('single-'))
  f.label('heading', 'Twisted pair and wire', 320, 40)
  f.label('pair-condition', 'Pair: equal and opposite', 320, 95)
  for (const [name, x, y] of [
    ['pair-a-upper', 245, 160], ['pair-b-upper', 275, 160],
    ['pair-a-lower', 245, 510], ['pair-b-lower', 275, 510],
  ]) f.point(name, x, y, '237-source-twisted-pair')
  f.chain('pair-upper-turn', ['pair-a-upper', p(245, 140), p(275, 140), 'pair-b-upper'], '237-source-twisted-pair')
  const a = ['pair-a-upper', p(275, 200), p(245, 240), p(245, 275), p(245, 355), p(275, 395), p(245, 435), p(275, 475), 'pair-a-lower']
  const b = ['pair-b-upper', p(245, 200), p(275, 240), p(275, 275), p(275, 355), p(245, 395), p(275, 435), p(245, 475), 'pair-b-lower']
  const aEdges = f.chain('pair-a-wire', a, '237-source-twisted-pair')
  f.chain('pair-b-insulation-mask', b, 'additions', 'mask')
  const bEdges = f.chain('pair-b-wire', b, '237-source-twisted-pair')
  f.point('single-upper', 395, 160, '237-source-single-wire')
  f.point('single-lower', 395, 510, '237-source-single-wire')
  f.edge('single-wire', 'single-upper', 'single-lower', '237-source-single-wire')
  f.chain('pair-a-return', ['pair-a-lower', p(215, 550), p(160, 575), p(85, 600), p(30, 645), p(30, 690), 'pair-source-left-terminal'], '237-source-pair-leads-box')
  f.chain('pair-b-return', ['pair-b-lower', p(310, 550), p(310, 690), 'pair-source-right-terminal'], '237-source-pair-leads-box')
  f.chain('single-upper-return', ['single-upper', p(470, 180), p(535, 280), p(565, 430), p(600, 570), p(600, 690), 'single-source-right-terminal'], '237-source-single-leads-box')
  f.chain('single-lower-return', ['single-lower', p(445, 545), p(445, 560), p(370, 580), p(335, 625), p(335, 690), 'single-source-left-terminal'], '237-source-single-leads-box')
  f.currentFacts.push(f.current('pair-a-current', p(245, 285), p(245, 345), p(245, 275), p(245, 355), 'down', 'addition'))
  f.currentFacts.push(f.current('pair-b-current', p(275, 345), p(275, 285), p(275, 275), p(275, 355), 'up', 'addition'))
  f.currentFacts.push(f.current('pair-source-return-current', p(310, 625), p(310, 565), p(310, 550), p(310, 690), 'up', 'source'))
  f.currentFacts.push(f.current('single-current', p(395, 285), p(395, 375), 'single-upper', 'single-lower', 'down', 'source'))
  f.buckets['237-source-pair-leads-box'].push('pair-source-return-current')
  f.buckets['237-source-single-wire'].push('single-current')
  f.buckets['237-source-traces-and-context'] = ['pair-source-return-current', 'single-current']
  f.label('pair-a-I-label', 'I', 205, 315)
  f.label('pair-b-I-label', 'I', 325, 315)
  f.label('single-I-label', 'I', 450, 315)
  f.parallel('pair-reading-portions-parallel', p(245, 275), p(245, 355), p(275, 275), p(275, 355))
  f.parallel('pair-single-facing-portions-parallel', p(275, 275), p(275, 355), 'single-upper', 'single-lower')
  f.assertions.push({
    id: 'equal-opposite-arrow-lengths', type: 'equalDistance',
    a: p(245, 285), b: p(245, 345), c: p(275, 345), d: p(275, 285),
  })
  f.displacement('distinct-pair-upper-ends', 'pair-a-upper', 'pair-b-upper')
  f.displacement('distinct-pair-lower-ends', 'pair-a-lower', 'pair-b-lower')
  f.finish({
    externalComponents: 2, externalCycleRank: 0,
    terminalPairs: [['pair-source-left-terminal', 'pair-source-right-terminal', true], ['single-source-left-terminal', 'single-source-right-terminal', true]],
    isolatedCircuitPairs: [['pair-a-upper', 'single-upper']],
    expectedJunctions: [], permittedInsulatedCrossings: { first: aEdges, second: bEdges, masksPrefix: 'pair-b-insulation-mask-', count: 6 },
    distinctPairMembers: { a: aEdges, b: bEdges, joinedOnlyByUpperTurn: true },
    parallelScope: 'Short exact pair reading window and adjacent single wire; twisted members as a whole are not parallel.',
  }, [
    'Two added opposite pair-current arrows in a short parallel reading window, equal arrow lengths and repeated I labels restate equal current magnitude, not measured source values.',
    'The source upward arrow on the right lower pair tail and downward arrow on the single vertical wire are retained separately. Four total arrows: two source, two additions.',
    'Six deliberately drawn insulated crossovers show twisting without contact; crossover count and over/under order are modern layout, not reliable source-pixel givens.',
    'A separated upper U-turn expresses the common source cap/closed pair return; no lower-end short is inferred from the tiny lower loop-like mark.',
    'Generic English-labelled supply shells, no compass or field-zero wording, no added connection between the pair and single-wire circuit.',
  ])
}
console.log('Prepared three source-bound initial specs and complete bilingual contexts in owned root.')
