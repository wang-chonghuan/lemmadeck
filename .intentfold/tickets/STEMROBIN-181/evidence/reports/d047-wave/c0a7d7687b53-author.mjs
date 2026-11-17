import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = path.dirname(fileURLToPath(import.meta.url))
const S = `${W}/.agents/skills/ld-s10y-image`
const TMP = path.dirname(O)
const SOURCE = `${W}/ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-70.png`
const N38 = `${TMP}/d044-10p-n38-author/author-freeze.json`
const N39 = `${TMP}/d045-n39-text-repair/repair-freeze.json`
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const digest = b => crypto.createHash('sha256').update(b).digest('hex')
const sha = p => digest(fs.readFileSync(p))
const bind = p => ({ path: p, sha256: sha(p) })
const round = n => Number(n.toFixed(9))
function dest(p) {
  const target = path.resolve(O, p)
  assert(target.startsWith(`${O}/`), 'Write escaped author ownership')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  return target
}
function write(p, value) {
  const target = dest(p)
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bind(target)
}
function copy(p, relative) {
  const target = dest(relative)
  fs.copyFileSync(p, target, fs.constants.COPYFILE_EXCL)
  return { original: bind(p), snapshot: bind(target) }
}
function command(id, executable, args, cwd = O) {
  const result = spawnSync(executable, args, {
    cwd, encoding: 'utf8', timeout: 180000, maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  write(`commands/${id}.json`, {
    executable, args, cwd, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  })
  return result
}
function verifyExternal() {
  assert.equal(sha(SOURCE), '8cf1965d548aad41c46aa2a6c77017789a078b1aab470306ce9ecdd96bb75d65')
  assert.equal(sha(N38), 'd5e69cdda197b60aa3d89879184a2f77401e9700539972e11da96bd086562048')
  assert.equal(sha(N39), '3220c430f340cb5d40213da415e6826a0990179e2d36b3f842a2bbd1a347febf')
}

// Each entry was read from its own source dot; tails are explicitly stationary,
// not a periodic continuation. P/Q are modern uncalibrated rectifications.
const P = Math.sqrt(3) / 2
const Q = 0.5
const rows = [
  {
    id: 'a', sourceLetter: '\u0430', time: '0', front: 1, baseline: 140,
    pixels: [[115,57],[166,57],[219,59],[272,60],[323,58],[375,58],
      [429,58],[481,57],[535,57],[587,56],[640,55],[692,54],
      [743,54],[796,52],[849,51],[901,51],[953,51],[1006,51]],
    values: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    arrows: [],
  },
  {
    id: 'b', sourceLetter: '\u0431', time: 'T/4', front: 4, baseline: 550,
    pixels: [[115,132],[170,145],[224,186],[271,235],[324,235],[375,235],
      [428,235],[480,235],[533,234],[586,234],[639,234],[692,234],
      [743,235],[795,235],[847,235],[900,235],[954,236],[1007,235]],
    values: [1,P,Q,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    arrows: [[2,'up','short',[170,121]],[3,'up','medium',[218,153]],
      [4,'up','long',[272,184]]],
  },
  {
    id: 'c', sourceLetter: '\u0432', time: 'T/2', front: 7, baseline: 990,
    pixels: [[115,410],[172,361],[223,324],[277,305],[330,327],[381,359],
      [431,410],[481,410],[534,410],[587,411],[640,411],[693,411],
      [745,411],[795,410],[849,410],[901,411],[954,411],[1008,411]],
    values: [0,Q,P,1,P,Q,0,0,0,0,0,0,0,0,0,0,0,0],
    arrows: [[1,'down','long',[117,462]],[2,'down','medium',[172,400]],
      [3,'down','short',[223,351]],[5,'up','short',[328,289]],
      [6,'up','medium',[382,322]],[7,'up','long',[432,362]]],
  },
  {
    id: 'd', sourceLetter: '\u0433', time: '3T/4', front: 10, baseline: 1430,
    pixels: [[119,686],[172,670],[224,640],[275,588],[327,538],[380,498],
      [433,479],[487,498],[539,538],[590,587],[639,587],[691,587],
      [745,587],[795,588],[848,588],[901,589],[954,589],[1007,590]],
    values: [-1,-P,-Q,0,Q,P,1,P,Q,0,0,0,0,0,0,0,0,0],
    arrows: [[2,'down','short',[172,699]],[3,'down','medium',[224,674]],
      [4,'down','long',[275,642]],[5,'down','medium',[327,578]],
      [6,'down','short',[380,529]],[8,'up','short',[487,470]],
      [9,'up','medium',[539,500]],[10,'up','long',[590,539]]],
  },
  {
    id: 'e', sourceLetter: '\u0434', time: 'T', front: 13, baseline: 1870,
    pixels: [[118,794],[167,841],[220,878],[274,902],[327,887],[380,850],
      [431,798],[482,748],[536,710],[590,692],[642,712],[694,750],
      [745,797],[795,797],[848,798],[901,798],[954,798],[1008,798]],
    values: [0,-Q,-P,-1,-P,-Q,0,Q,P,1,P,Q,0,0,0,0,0,0],
    arrows: [[1,'up','long',[118,737]],[2,'up','medium',[167,802]],
      [3,'up','short',[220,851]],[5,'down','short',[327,915]],
      [6,'down','medium',[380,886]],[7,'down','long',[432,852]],
      [8,'down','medium',[482,785]],[9,'down','short',[536,737]],
      [11,'up','short',[642,683]],[12,'up','medium',[694,707]],
      [13,'up','long',[745,744]]],
  },
  {
    id: 'f', sourceLetter: '\u0435', time: '5T/4', front: 16, baseline: 2530,
    pixels: [[115,1042],[166,1064],[217,1094],[271,1150],[323,1196],[376,1236],
      [428,1257],[481,1238],[534,1202],[586,1153],[640,1107],[691,1067],
      [745,1046],[797,1066],[849,1104],[901,1153],[955,1155],[1009,1155]],
    values: [1,P,Q,0,-Q,-P,-1,-P,-Q,0,Q,P,1,P,Q,0,0,0],
    arrows: [[2,'up','short',[164,1030]],[3,'up','medium',[216,1054]],
      [4,'up','long',[270,1098]],[5,'up','medium',[320,1155]],
      [6,'up','short',[376,1206]],[8,'down','short',[481,1269]],
      [9,'down','medium',[534,1245]],[10,'down','long',[585,1210]],
      [11,'down','medium',[640,1148]],[12,'down','short',[691,1094]],
      [14,'up','short',[797,1031]],[15,'up','medium',[849,1066]],
      [16,'up','long',[900,1104]]],
  },
]
const spans = [
  { id: 'source-e-lambda-1-13', row: 'e', from: 1, to: 13, screenY: 2150,
    pixels: [[118,948],[746,949]], labelPixel: [488,931] },
  { id: 'source-f-lambda-2-14', row: 'f', from: 2, to: 14, screenY: 2860,
    pixels: [[163,1302],[794,1303]], labelPixel: [597,1283] },
  { id: 'source-f-lambda-3-15', row: 'f', from: 3, to: 15, screenY: 2950,
    pixels: [[215,1337],[841,1343]], labelPixel: [554,1325] },
]
const bid = (r, n) => `source-${r}-ball-${String(n).padStart(2, '0')}`
const nid = (r, n) => `source-${r}-number-${String(n).padStart(2, '0')}`
const at = (r, n) => [110 + 56 * (n - 1), round(-r.baseline + 120 * r.values[n - 1])]

function prepare() {
  verifyExternal()
  const inputs = [copy(N38, 'context/n38/author-freeze.json'),
    copy(N39, 'context/n39/repair-freeze.json')]
  const authoritativeText = []
  const contexts = {}
  for (const language of ['zh', 'en']) {
    for (const name of ['native-context.json', 'full-context.json', 'prose.md']) {
      const original = `${TMP}/d044-wave-figure-context/fig-70/${language}/${name}`
      inputs.push(copy(original, `context/before/${language}/${name}`))
    }
    const lang = read(N38).frozen.find(item => item.language === language)
    const repaired = read(N39).outputs.find(item => item.language === language)
    for (const binding of [lang.template, lang.currentProse, lang.readingText,
      lang.exercisesTemplate, lang.figuresTemplate]) {
      assert.equal(sha(binding.path), binding.sha256, `n38 input changed: ${binding.path}`)
      inputs.push(copy(binding.path, `context/n38/${language}/${path.basename(binding.path)}`))
    }
    for (const binding of [repaired.frozen, repaired.prose]) {
      const absolute = path.resolve(W, binding.path)
      assert.equal(sha(absolute), binding.sha256, `n39 repaired input changed: ${absolute}`)
    }
    for (const name of ['lesson.template.json', 'prose.md', 'exercises.template.json',
      'figures.template.json']) {
      inputs.push(copy(`${TMP}/d045-n39-text-repair/frozen/${language}/${name}`,
        `context/n39/${language}/${name}`))
    }
    const lessons = ['38', '39'].map(n => {
      const template = read(`${O}/context/n${n}/${language}/lesson.template.json`)
      const exercise = read(`${O}/context/n${n}/${language}/exercises.template.json`)
      const complete = template.prose.map(b => b.text || b.label || '').filter(Boolean).join('\n\n')
      authoritativeText.push({ lesson: template.card_id, language, text: complete })
      if (n === '39') {
        assert.equal(exercise.source.data.count, 6)
        assert.equal(exercise.exercises.length, 6)
        for (const q of exercise.exercises) authoritativeText.push({
          lesson: template.card_id, language, exercise: q.number, text: q.text,
        })
        authoritativeText.push({
          lesson: template.card_id, language, text: JSON.stringify(exercise.source.data),
        })
      }
      return { lesson: template.card_id, fullTemplate: template,
        fullProse: complete, fullExercises: exercise,
        proseMarkdown: bind(`${O}/context/n${n}/${language}/${n === '38' ? `lesson-${language}.md` : 'prose.md'}`) }
    })
    contexts[language] = {
      schema: 'ld-s10y-image/context@1', book: '10p', edition: 'modern-us-neutral',
      figure: 'fig-70', authorOnly: true, scientificApproval: false,
      sourceImage: { ...bind(SOURCE), width: 1124, height: 1370 },
      oldContextRole: 'Retained verbatim before update; source-image facts only. All old n39 text superseded.',
      authoritativeRule: 'Complete current hash-bound n38 and sole-repair n39 templates/prose, not nearby excerpts; no answer keys.',
      textFreezes: [bind(N38), bind(N39)], lessons,
    }
    write(`context/current/${language}/native-context.json`, contexts[language])
  }
  write('context/input-bindings.json', { status: 'pass', source: bind(SOURCE), inputs })

  const objects = []
  const assertions = []
  const inventory = []
  const facts = []
  function edge(id, from, to, type = 'segment', strokeWidth = 3) {
    objects.push({ id, type, from, to, stroke: 'ink', strokeWidth })
    assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
    return id
  }
  function text(id, value, position, fontSize = 34) {
    objects.push({ id, type: 'text', text: value, at: position, fontSize,
      fontWeight: 400, labelColor: 'ink', labelPlacement: { position: 'CENTER' } })
    return id
  }
  const nativeLengths = { short: 32, medium: 52, long: 68 }
  for (const r of rows) {
    assert.equal(r.pixels.length, 18)
    assert.equal(r.values.length, 18)
    const mappedObjects = []
    const mappedAssertions = []
    const arrowMap = new Map(r.arrows.map(a => [a[0], a]))
    const rowFacts = { row: r.id, sourceLetter: r.sourceLetter, modernLetter: r.id,
      timestamp: r.time, reachedThrough: r.front, firstUnreached: r.front + 1,
      sourceBaselinePixels: r.pixels.slice(r.front - 1).map(p => p.slice()),
      sourceSeparateEquilibriumBaseline: r.id !== 'a', balls: [], guides: [],
      velocityArrows: [], adjacentConnections: [], label: `source-${r.id}-letter`,
      timestampLabel: `source-${r.id}-time`, noNumericAxisTicks: true }
    for (let n = 1; n <= 18; n += 1) {
      const point = bid(r.id, n)
      objects.push({ id: point, type: 'point', at: at(r, n),
        size: 7, strokeWidth: 1, stroke: 'ink', fill: 'ink' })
      mappedObjects.push(point)
      const vector = arrowMap.get(n)
      const displacement = r.values[n - 1]
      const numberSide = displacement < 0 || (displacement === 0 && vector?.[1] === 'down') ? -1 : 1
      const vectorOnNumberSide = vector && (vector[1] === 'up' ? 1 : -1) === numberSide
      const offset = vectorOnNumberSide ? 110 : 48
      text(nid(r.id, n), String(n), [at(r, n)[0], at(r, n)[1] + numberSide * offset])
      mappedObjects.push(nid(r.id, n))
      const firstReached = n === 1 ? 'a' : n <= 4 ? 'b' : n <= 7 ? 'c'
        : n <= 10 ? 'd' : n <= 13 ? 'e' : n <= 16 ? 'f' : null
      rowFacts.balls.push({
        id: point, number: n, sourceCenterApproxPx: r.pixels[n - 1],
        sourcePosition: displacement === 0 ? 'on-equilibrium' : displacement > 0 ? 'above-equilibrium' : 'below-equilibrium',
        modernRectifiedDisplacement: round(displacement), modernNativeAt: at(r, n),
        reachedInThisSnapshot: n <= r.front, firstObservedReachedSnapshot: firstReached,
        arrivalEvidence: firstReached ? `By timestamp ${rows.find(item => item.id === firstReached).time}; exact between-snapshot arrival not independently measured from pixels` : 'Not reached in any of the six source snapshots',
        arrow: vector ? `source-${r.id}-velocity-${String(n).padStart(2, '0')}` : null,
        noArrowReason: vector ? null : r.id === 'a' ? 'initial-source-has-no-velocity-arrows'
          : n > r.front ? 'unreached-stationary-tail' : 'extreme-displacement-no-velocity-arrow',
        numberLabel: nid(r.id, n), modernNumberSide: numberSide > 0 ? 'above' : 'below',
      })
    }
    // Native Hermite segments join independently transcribed ball anchors.
    // Extrema have zero tangents; no interpolated lobe continues past the front.
    for (let n = 1; n < 18; n += 1) {
      const relation = `source-${r.id}-spacing-displacement-${n}-${n + 1}`
      assertions.push({ id: relation, type: 'displacement', from: bid(r.id, n),
        to: bid(r.id, n + 1), dx: 56,
        dy: round(120 * (r.values[n] - r.values[n - 1])), tolerance: 1e-6 })
      mappedAssertions.push(relation)
      const y0 = r.values[n - 1]
      const y1 = r.values[n]
      const straight = n >= r.front
      const slope = index => {
        if (index < 0 || index >= r.front - 1) return 0
        const left = index > 0 ? r.values[index] - r.values[index - 1] : 0
        const right = r.values[index + 1] - r.values[index]
        return left * right > 0 ? (left + right) / 2 : 0
      }
      const m0 = slope(n - 1)
      const m1 = n === r.front - 1 ? y1 - y0 : slope(n)
      const vertices = [bid(r.id, n)]
      const parts = straight ? 1 : 10
      for (let step = 1; step < parts; step += 1) {
        const t = step / parts
        const y = (2*t**3 - 3*t**2 + 1)*y0 + (t**3 - 2*t**2 + t)*m0
          + (-2*t**3 + 3*t**2)*y1 + (t**3 - t**2)*m1
        const id = `modern-${r.id}-connector-${n}-vertex-${step}`
        objects.push({ id, type: 'point', at: [110 + 56 * (n - 1 + t), round(-r.baseline + 120*y)],
          visible: false })
        vertices.push(id)
      }
      vertices.push(bid(r.id, n + 1))
      const edges = vertices.slice(1).map((id, index) => edge(
        `source-${r.id}-connection-${n}-${n + 1}-part-${index + 1}`, vertices[index], id,
        'segment', 4))
      mappedObjects.push(...edges)
      mappedAssertions.push(...edges.map(id => `${id}-connects`))
      rowFacts.adjacentConnections.push({ from: bid(r.id, n), to: bid(r.id, n + 1),
        nativeSegments: edges, relationship: relation, stationary: straight })
    }
    if (r.id !== 'a') {
      const id = edge(`source-${r.id}-equilibrium-baseline`,
        [110, -r.baseline], [1062, -r.baseline], 'segment', 2)
      mappedObjects.push(id)
      mappedAssertions.push(`${id}-connects`)
    }
    for (let n = 1; n <= r.front; n += 1) {
      if (r.values[n - 1] !== 0) {
        const id = edge(`source-${r.id}-displacement-guide-${n}`,
          [at(r, n)[0], -r.baseline], bid(r.id, n), 'segment', 2)
        mappedObjects.push(id)
        mappedAssertions.push(`${id}-connects`)
        rowFacts.guides.push({ id, ball: bid(r.id, n), zeroBaselineAt: [at(r, n)[0], -r.baseline] })
      }
    }
    for (const [n, direction, lengthClass, sourceTip] of r.arrows) {
      const id = `source-${r.id}-velocity-${String(n).padStart(2, '0')}`
      const point = at(r, n)
      const tip = [point[0], round(point[1] + (direction === 'up' ? 1 : -1) * nativeLengths[lengthClass])]
      edge(id, bid(r.id, n), tip, 'arrow', 3)
      mappedObjects.push(id)
      mappedAssertions.push(`${id}-connects`)
      const relation = `${id}-transverse-direction-length`
      assertions.push({ id: relation, type: 'displacement', from: bid(r.id, n),
        to: tip, dx: 0, dy: (direction === 'up' ? 1 : -1) * nativeLengths[lengthClass] })
      mappedAssertions.push(relation)
      rowFacts.velocityArrows.push({ id, ball: bid(r.id, n), sourceDirection: direction,
        sourceTipApproxPx: sourceTip, sourceRelativeLengthClass: lengthClass,
        modernLengthPx: nativeLengths[lengthClass], assertions: [`${id}-connects`, relation] })
    }
    for (let n = r.front; n <= 16; n += 1) {
      const id = `source-${r.id}-stationary-tail-${n}-${n + 1}-${n + 2}`
      assertions.push({ id, type: 'collinear', a: bid(r.id, n),
        b: bid(r.id, n + 1), c: bid(r.id, n + 2) })
      mappedAssertions.push(id)
    }
    if (['e','f'].includes(r.id)) {
      for (const [a, b] of (r.id === 'e' ? [[1,13]] : [[1,13],[2,14],[3,15]])) {
        const id = `source-${r.id}-reached-equal-state-${a}-${b}`
        assertions.push({ id, type: 'displacement', from: bid(r.id, a), to: bid(r.id, b),
          dx: 672, dy: 0 })
        mappedAssertions.push(id)
      }
    }
    mappedObjects.push(text(`source-${r.id}-letter`, r.id, [36,-r.baseline], 36))
    mappedObjects.push(text(`source-${r.id}-time`, r.time, [1175,-r.baseline], 36))
    inventory.push({
      id: `source-row-${r.id}-all-18-balls`,
      description: `Source row ${r.sourceLetter} maps to ${r.id}, time ${r.time}. Eighteen independently read numbered balls in exact source order 1..18; disturbance has reached ball ${r.front}; all later balls remain stationary on the common equilibrium line with no velocity vectors. Includes every source connector, nonzero displacement guide, numbered label and velocity arrow. Pixel centers are approximate observations, not a calibrated grid. Within-row displacement assertions cover all 18 balls. No longitudinal compression/rarefaction is part of Figure 70.`,
      objects: mappedObjects, assertions: mappedAssertions, requires: ['pointRelationships'],
    })
    facts.push(rowFacts)
  }
  for (const span of spans) {
    const r = rows.find(item => item.id === span.row)
    const from = [at(r, span.from)[0], -span.screenY]
    const to = [at(r, span.to)[0], -span.screenY]
    const ids = []
    for (const [side, n, endpoint] of [['left',span.from,from],['right',span.to,to]]) {
      ids.push(edge(`${span.id}-${side}-extension-endcap`,
        bid(r.id, n), [endpoint[0], endpoint[1] - 12], 'segment', 2))
    }
    const middle = [(from[0]+to[0])/2, from[1]]
    ids.push(edge(`${span.id}-left-arrow`, middle, from, 'arrow', 3))
    ids.push(edge(`${span.id}-right-arrow`, middle, to, 'arrow', 3))
    ids.push(text(`${span.id}-given-label`, '\u03bb', [middle[0], middle[1]+42], 36))
    assertions.push({ id: `${span.id}-horizontal-wavelength`, type: 'displacement',
      from: bid(r.id, span.from), to: bid(r.id, span.to), dx: 672, dy: 0 })
    inventory.push({
      id: span.id, description: `Original given lambda span, not an added solution. Exact source row ${span.row} endpoints are balls ${span.from}/${span.to}; both extension lines overshoot the opposing-arrow line as terminal endcaps. No adjacent-phase answer annotation is added.`,
      objects: [bid(r.id, span.from), bid(r.id, span.to), ...ids],
      assertions: [...ids.filter(id => !id.endsWith('label')).map(id => `${id}-connects`),
        `${span.id}-horizontal-wavelength`], requires: ['pointRelationships'],
    })
  }
  const amp = 'source-b-unlabeled-amplitude-span'
  const ampObjects = [
    edge(`${amp}-up-arrow`, [76,-490], [76,-430], 'arrow', 3),
    edge(`${amp}-down-arrow`, [76,-490], [76,-550], 'arrow', 3),
    edge(`${amp}-upper-terminal-bar`, [64,-430], [110,-430], 'segment', 2),
    edge(`${amp}-lower-terminal-bar`, [64,-550], [110,-550], 'segment', 2),
  ]
  assertions.push({ id: `${amp}-ball-4-to-crest-1`, type: 'displacement',
    from: bid('b',4), to: bid('b',1), dx: -168, dy: 120 })
  inventory.push({ id: amp,
    description: 'One source unlabelled vertical amplitude dimension left of row b ball 1, equilibrium to crest. Two opposed vertical arrowheads and two horizontal terminal bars. No A label exists; none is added.',
    objects: [bid('b',1),bid('b',4),...ampObjects],
    assertions: [...ampObjects.map(id => `${id}-connects`),`${amp}-ball-4-to-crest-1`],
    requires: ['pointRelationships'],
  })
  const counts = {
    rows: 6, balls: 108, numberLabels: 108, panelLetters: 6, timestamps: 6,
    velocityArrows: facts.reduce((n,r) => n+r.velocityArrows.length,0),
    velocityArrowsPerRow: facts.map(r => r.velocityArrows.length),
    displacementGuides: facts.reduce((n,r) => n+r.guides.length,0),
    displacementGuidesPerRow: facts.map(r => r.guides.length),
    sourceAdjacentBallConnections: 102, separateEquilibriumBaselines: 5,
    lambdaSpans: 3, lambdaLabels: 3, lambdaExtensionEndcaps: 6,
    unlabeledAmplitudeSpans: 1, amplitudeTerminalBars: 2,
    dimensionArrowheads: 8, totalArrowObjects: 49,
    numericAxisTicks: 0, gridLines: 0, longitudinalObjects: 0, visibleLabels: 123,
  }
  assert.equal(counts.velocityArrows,41)
  assert.equal(counts.displacementGuides,39)
  const sourceInventory = {
    schema: 'ld-s10y-image/source-pixel-inventory@1', source: { ...bind(SOURCE), width:1124,height:1370 },
    openedFreshBeforeInventory: true, observationBasis: 'Original exact PNG plus two source-only enlarged crops; no prior spec or answer key.',
    counts, rows: facts, lambdaSpans: spans, groups: inventory,
    amplitude: { id: amp, row:'b', pixels:[[96,131],[96,237]],
      label:null, arrowheads:2, terminalBars:2 },
    modernRectification: {
      sourceGrid: false, sourcePixelPositionsCalibrated: false,
      pixelCenterTolerancePx: 4,
      nativeEqualHorizontalSpacing:56, nativeAmplitude:120,
      displacementClasses:[0,Q,P,1,-Q,-P,-1].map(round),
      displacementStatus:'Source signs, extrema, repeated states and relative intermediate heights retained; exact normalized values are separately declared modern rectification, not measured original numbers.',
      vectorLengths:nativeLengths, vectorStatus:'Source direction and short/medium/long hierarchy retained; exact native lengths are uncalibrated modern regularization, not measured speed units.',
      interpolation:'Native sampled cubic Hermite connectors through all independent ball anchors; stationary connections exactly straight from the reached front. No global sine or cosine generator.',
      textLayout:'Number labels remain tied to each dot x coordinate; offsets expanded to clear vectors at 640px. Five separated baselines flattened from minor scan skew.',
      arrivalTimes:'Only six source timestamp snapshots bound arrival intervals; no between-snapshot arrival time is fabricated.',
      sourceForwardMotionArrow:false, addedAnswerLabels:0,
    },
    equalPhaseScope: {
      e:[[1,13]], f:[[1,13],[2,14],[3,15]],
      notAssertedInE:[[2,14],[3,15]],
      reason:'Balls 14 and 15 are not yet reached at T. Exact repetition/phase applies only after arrival. The lambda marks are original givens.',
    },
    independentApproval:false,
  }
  write('source-inventory.json',sourceInventory)
  const spec = {
    schema:'ld-s10y-image/figure-spec@2', id:'fig-70', mode:'deterministic',
    description:'Six ordered transverse-wave ball-chain snapshots a-f at 0, T/4, T/2, 3T/4, T, 5T/4. Preserve every dot, source velocity direction, unreached stationary tail, unlabeled amplitude dimension and three original given wavelength spans. Complete current n38/n39 bilingual texts and unchanged six raw questions bound. No grid, longitudinal model, added formula, adjacent-phase solution, or answer label.',
    source:{image:bind(SOURCE),authoritativeText,inventory},
    canvas:{width:1280,height:3060,boundingBox:[0,0,1280,-3060],background:'paper',keepAspectRatio:true},
    display:{purpose:'instructional',layout:'scroll',widths:[640],minTextPx:16},
    layout:{minLabelGap:4},objects,assertions,
  }
  write('attempts/initial/fig-70.spec.json',spec)
  write('build-state.json',{status:'initial-spec-authored',counts,inputs:bind(`${O}/context/input-bindings.json`),
    sourceInventory:bind(`${O}/source-inventory.json`),targetedRepairsUsed:0,
    sourceImageOpens:3,sourceImageOpenPaths:[SOURCE,`${O}/source-upper-detail.png`,`${O}/source-lower-detail.png`],
    patternsReused:[bind(`${TMP}/d042-9p-fig302-author/graph/author.mjs`),
      bind(`${TMP}/d042-9p-fig302-author/graph/inspect.mjs`),bind(`${TMP}/d042-9p-fig303-author/author.mjs`)],
    sharedTools:[bind(`${S}/scripts/validate_spec.py`),bind(`${S}/scripts/render_spec.mjs`),
      bind(`${S}/scripts/materialize_arrowheads.mjs`)]})
  console.log(JSON.stringify({status:'prepared',counts,objects:objects.length,assertions:assertions.length}))
}
function render(stage) {
  verifyExternal()
  assert(['initial','repair-1'].includes(stage))
  const dir = `${O}/attempts/${stage}`
  const validation = command(`${stage}-spec-validation`, 'python3',
    [`${S}/scripts/validate_spec.py`,`${dir}/fig-70.spec.json`,'--stage','draft','--json'],dir)
  if (validation.status !== 0) {
    console.log(JSON.stringify({status:'FAIL',stage,step:'validate',stdout:validation.stdout}))
    return
  }
  const rendered = command(`${stage}-native-render`, 'node',
    [`${S}/scripts/render_spec.mjs`,'--spec','fig-70.spec.json','--svg','fig-70.svg',
      '--report','fig-70.render.json','--png','fig-70.native.png'],dir)
  console.log(JSON.stringify({status:rendered.status === 0 ? 'PASS':'FAIL',stage,
    stdout:rendered.stdout,stderr:rendered.stderr}))
}
if (process.argv[2] === 'prepare') prepare()
else if (process.argv[2] === 'render') render(process.argv[3] || 'initial')
else throw new Error('Use prepare or render STAGE')
