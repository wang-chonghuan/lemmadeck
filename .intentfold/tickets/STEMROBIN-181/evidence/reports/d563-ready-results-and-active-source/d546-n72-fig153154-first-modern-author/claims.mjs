import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: sha(file) })
const write = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1,
  (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b)),
)))
const vector = (a, b) => [b[0] - a[0], b[1] - a[1]]
const close = (a, b) => Math.abs(a - b) < 1e-8
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const sourceInventory = read(path.join(root, 'source.inventory.json'))
const binding = read(path.join(root, 'binding.json'))
const en = read(path.join(workspace, binding.fullEN.path))
const zh = read(path.join(workspace, binding.fullZH.path))
let allPass = true
for (const figure of ['fig-153', 'fig-154']) {
  const version = figure === 'fig-153' ? 'repair' : 'first'
  const specPath = path.join(root, figure, `spec.${version}.json`)
  const renderPath = path.join(root, figure, `native.${version}.json`)
  const spec = read(specPath), render = read(renderPath)
  const source = sourceInventory.source.find(item => item.figure === figure)
  const map = new Map(spec.objects.map(item => [item.id, item]))
  const prefix = figure === 'fig-153' ? 's153' : 's154'
  const at = id => map.get(id).at
  const o = at(`${prefix}-o`), i = at(`${prefix}-i`), t = at(`${prefix}-t`)
  const nUp = at(`${prefix}-n-up`), nDown = at(`${prefix}-n-down`)
  const bLeft = at(`${prefix}-b-left`), bRight = at(`${prefix}-b-right`)
  const alpha = angle(vector(o, i), vector(o, nUp))
  const beta = angle(vector(o, t), vector(o, nDown))
  const claims = []
  const claim = (id, statement, condition, provenance, assertionIds = []) => {
    claims.push({ id, statement, status: condition ? 'pass' : 'fail', provenance, assertionIds })
  }
  const sourceAssertionIds = spec.source.inventory.flatMap(group => group.assertions)
  claim(`${prefix}-binding`,
    'Source image and complete reviewed modern EN/ZH prose are hash-bound; SCI and ZHEN were not re-reviewed.',
    spec.source.image.sha256 === sha(path.join(workspace, spec.source.image.path))
      && same(spec.source.image, binding.selected.find(item => item.figure === figure).source)
      && spec.source.authoritativeText[0].text === en.prose.map(item => item.text).filter(Boolean).join('\n\n')
      && spec.source.authoritativeText[1].text === zh.prose.map(item => item.text).filter(Boolean).join('\n\n'),
    'Manifest/context/full lesson bytes; not answer material')
  claim(`${prefix}-shared-interface`,
    'Horizontal boundary, common incidence point and vertical normal use one frame. The normal is perpendicular to the boundary.',
    close(bLeft[1], bRight[1]) && close(o[1], bLeft[1])
      && close(nUp[0], nDown[0]) && close(o[0], nUp[0]),
    'Source-observed relation; coordinates are modern schematic regularization',
    [`${prefix}-o-on-boundary`, `${prefix}-o-on-normal`, `${prefix}-boundary-perpendicular-normal`])
  claim(`${prefix}-directed-rays`,
    'Incident direction is upper-right to incidence; refracted direction is incidence to lower-left in the second medium.',
    i[0] > o[0] && i[1] > o[1] && t[0] < o[0] && t[1] < o[1]
      && map.get(`${prefix}-incident`).from === `${prefix}-i`
      && map.get(`${prefix}-incident`).to === `${prefix}-o`
      && map.get(`${prefix}-refracted`).from === `${prefix}-o`
      && map.get(`${prefix}-refracted`).to === `${prefix}-t`,
    'Source pixels plus reviewed prose; arrowheads in Figure 154 are a modern addition',
    [`${prefix}-incident-connects`, `${prefix}-refracted-connects`, `${prefix}-incident-displacement`, `${prefix}-refracted-displacement`])
  claim(`${prefix}-normal-referenced-angles`,
    'Incidence uses the upward normal and the line toward the incident origin; refraction uses the downward normal and the outgoing ray. Both angles are acute and refraction is nearer the normal in this source example. No angle values are given data.',
    alpha > 0 && alpha < Math.PI / 2 && beta > 0 && beta < alpha,
    'Executable vector-angle claim from source relative bending; not an invented source measurement',
    [`${prefix}-boundary-perpendicular-normal`, `${prefix}-incident-displacement`, `${prefix}-refracted-displacement`])
  if (figure === 'fig-153') {
    const alphaArc = map.get('s153-alpha-arc'), betaArc = map.get('s153-beta-arc')
    const alphaEnd = at(alphaArc.start), betaEnd = at(betaArc.start)
    claim('s153-angle-arcs',
      'Alpha arc joins incident-side radius to upward-normal radius; beta arc joins refracted-side radius to downward-normal radius. Both centers are O, and both arcs are short rather than reflex.',
      alphaArc.center === 's153-o' && betaArc.center === 's153-o'
        && alphaArc.end === 's153-alpha-n' && betaArc.end === 's153-beta-n'
        && close(angle(vector(o, alphaEnd), vector(o, at(alphaArc.end))), alpha)
        && close(angle(vector(o, betaEnd), vector(o, at(betaArc.end))), beta),
      'Observed source alpha/beta definitions',
      ['s153-alpha-normal-end', 's153-alpha-ray-end', 's153-alpha-equal-radius', 's153-beta-normal-end', 's153-beta-ray-end', 's153-beta-equal-radius'])
    claim('s153-reflection-not-added',
      'The definition diagram has no reflected branch; absence is retained rather than fabricating a source ray.',
      !spec.objects.some(item => item.id.includes('reflected')),
      'Source pixel inventory; refraction definitions do not require adding reflection here')
    const original = read(path.join(root, figure, 'spec.first.json'))
    const adjusted = structuredClone(spec)
    const before = original.objects.find(item => item.id === 's153-beta').at
    const after = adjusted.objects.find(item => item.id === 's153-beta').at
    adjusted.objects.find(item => item.id === 's153-beta').at = before
    const targeted = same(adjusted, original) && same(before, [297, 172]) && same(after, [289, 110])
    claim('s153-single-repair-only',
      'Only s153-beta.at changed; all geometry, assertions, source bindings, text and labels except that position retain first-spec bytes semantically.',
      targeted, 'First FAIL and one repaired spec, both retained')
    write('fig-153/repair.json', {
      figure, reason: 'Native first render reported only s153-beta-label stroke collision',
      firstSpec: record(path.join(root, figure, 'spec.first.json')),
      firstNative: record(path.join(root, figure, 'native.first.json')),
      firstSVG: record(path.join(root, figure, 'candidate.first.svg')),
      firstStderr: record(path.join(root, 'commands/fig-153.native.first.stderr.txt')),
      repairedSpec: record(specPath), repairedNative: record(renderPath),
      affectedField: 'objects[id=s153-beta].at', before, after,
      onlyAffectedSpecRepair: targeted, repairCount: 1,
      nativeSecondStatus: render.status,
      policy: 'No third attempt; any second native failure is terminal HOLD.',
    })
  } else {
    const r = at('s154-modern-r')
    const reflectedAngle = angle(vector(o, r), vector(o, nUp))
    claim('s154-modern-reflection',
      'The explicitly modern reflected branch goes from O to upper-left in air, with incidence/reflection angles equal about the normal. It is not the adjacent source dashed upper-right trace.',
      r[0] < o[0] && r[1] > o[1] && close(alpha, reflectedAngle)
        && map.get('s154-modern-reflected').from === 's154-o'
        && map.get('s154-modern-reflected').to === 's154-modern-r'
        && map.get('s154-modern-reflected').dash === 2,
      'Modern addition: reviewed EN/ZH prose p0188#8, p0189#10 and p0192#3; not source pixel evidence',
      ['s154-modern-reflected-connects', 's154-modern-reflected-direction', 's154-modern-reflection-equal-length'])
    const front = map.get('s154-front-frame').points
    const right = map.get('s154-right-frame').points
    const top = map.get('s154-top-frame').points
    claim('s154-apparatus-topology',
      'A single source-style geometric aquarium keeps front/right/top rim and upright continuity; no light-source hardware, measurement disk, screen or fish is invented.',
      same(front, [[60, 420], [505, 420], [505, 90], [60, 90]])
        && same(right, [[505, 420], [580, 470], [580, 140], [505, 90]])
        && same(top, [[60, 420], [505, 420], [580, 470], [135, 470]])
        && same(map.get('s154-rear-left-upright').from, [135, 470])
        && same(map.get('s154-rear-left-upright').to, [135, 360]),
      'Source apparatus identity/topology; exact projection dimensions are explicitly modern',
      ['s154-front-horizontal', 's154-front-vertical', 's154-front-right-angle', 's154-top-depth-parallel', 's154-side-vertical-parallel'])
    const companion = map.get('s154-incident-companion')
    claim('s154-adjacent-source-trace',
      'The observed adjacent upper-right dashed trace is retained as a parallel companion to the incident beam, never reclassified as reflection.',
      companion.dash === 2 && same(companion.from, [500, 555]) && same(companion.to, [320, 310])
        && map.has('s154-visible-water-beam') && map.get('s154-visible-water-beam').fill === 'paper',
      'Source visible trace and bright submerged band, with illustrative thickness only',
      ['s154-companion-parallel', 's154-t-in-water'])
  }
  const roles = new Set(['ink', 'muted', 'accent', 'accentSoft', 'grid', 'paper'])
  claim(`${prefix}-visible-language-and-roles`,
    'All visible words are English or mathematical symbols; colors use semantic roles, not source inks, wavelength colors or theme literals.',
    spec.objects.every(item => ['stroke', 'fill', 'labelColor'].every(key => !item[key] || roles.has(item[key])))
      && spec.objects.filter(item => item.type === 'text').every(item => !/[\u0400-\u04ff\u3400-\u9fff]/.test(item.text)),
    'Modern label/color contract')
  claim(`${prefix}-native-display-only`,
    'Unmodified JSXGraph native output is hash-bound and passes all declared instructional inline widths 331, 342 and 640 with at least 16px text. This is not independent DISPLAY or full-card acceptance.',
    render.status === 'pass' && render.spec.sha256 === sha(specPath)
      && render.output.svg.sha256 === sha(path.join(workspace, render.output.svg.path))
      && same(spec.display.widths, [331, 342, 640])
      && spec.display.maxWidthPx === 640 && spec.display.minTextPx === 16
      && spec.display.purpose === 'instructional' && spec.display.layout === 'inline'
      && render.displayChecks.length === 3
      && render.displayChecks.every(check => check.status === 'pass' && check.measuredMinPx >= 16),
    'Native renderer/display metrics; author preview at actual mobile media width')
  const status = claims.every(item => item.status === 'pass') ? 'pass' : 'fail'
  allPass &&= status === 'pass'
  write(`${figure}/claims.json`, {
    schema: 'stemrobin-181/author-claims@1', figure, owner: 'one-shot-author',
    status, independentReview: false,
    source: { image: spec.source.image, pixelInventory: record(path.join(root, 'source.inventory.json')) },
    spec: record(specPath), nativeRender: record(renderPath),
    sourceMappedNativeAssertions: sourceAssertionIds,
    modernAdditions: source.modernAdditions,
    claims,
    numericGeometry: {
      provenance: 'Computed modern layout only; not printed source given values, labels, an answer or a calibrated optical experiment.',
      incidenceDegrees: alpha * 180 / Math.PI,
      refractionDegrees: beta * 180 / Math.PI,
    },
    signature: 'AUTHOR-ONLY; independent FIG and DISPLAY remain pending',
  })
  console.log(`${figure}: author claims ${status}; no native or validator rerun`)
}
if (!allPass) process.exitCode = 2
