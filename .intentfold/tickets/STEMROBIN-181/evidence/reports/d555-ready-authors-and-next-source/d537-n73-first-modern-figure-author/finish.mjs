import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const skill = path.join(repo, '.agents/skills/ld-s10y-image')
const ids = ['fig-156', 'fig-157', 'fig-158', 'fig-159']
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const write = (file, data) => {
  const target = path.resolve(root, file)
  if (!target.startsWith(`${root}/`)) throw new Error('write outside batch')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const command = (executable, argv, target) => {
  const result = spawnSync(executable, argv, {
    cwd: repo, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  write(`${target}.stdout.txt`, result.stdout || '')
  write(`${target}.stderr.txt`, result.stderr || '')
  write(`${target}.command.json`, { executable, argv, cwd: repo, exitCode: result.status, signal: result.signal, error: result.error?.message || null })
  return result.status
}
const beforeDisplay = read('display-before.json')
if (beforeDisplay.status !== 'fail') throw new Error('repair requires retained first failure')
const before = ids.map(id => read(`${id}/before/spec.json`))
const visual = {
  schema: 'd537/first-author-visual@1', independent: false, FIG: 'pending',
  actualCandidateOpens: 4, afterImagesOpened: 0,
  figures: ids.map((figure, index) => ({
    figure, originalOpenOrdinal: index + 1, firstCandidateOpenOrdinal: index + 5,
    source: bind(before[index].source.image.path),
    firstPNG: bind(path.join(root, figure, 'before', `${figure}.png`)),
    nativeRenderGate: 'pass',
    firstAuthorVisual: figure === 'fig-159' ? 'fail' : 'pass',
    firstDisplayDeclarationGate: 'fail',
    failure: figure === 'fig-159'
      ? 'The first PNG shows a sharp fold where circular arcs meet horizontal terminal strands, defeating the conditional curved-guidance schematic. Desktop 495px was also undeclared.'
      : 'Actual desktop media is 495px, absent from the first display.widths; mobile 342px, legibility and clipping checks passed.',
    observations: figure === 'fig-156'
      ? 'Disk, radial lower source, frosted lower semicylinder, mounts/support and separate glass reflection and air refraction remain visible. English labels are declared additions.'
      : figure === 'fig-157'
        ? 'One shared normal/interface, alpha-zero and gamma, right-angle beta, dashed grazing ray and separate reflected ray are visible. Boundary not labelled supercritical.'
        : figure === 'fig-158'
          ? 'Normal plus paired oblique families, near-grazing thin rays, stronger outer water reflections and S are visible. No extra numerical measurement or answer appears.'
          : 'Two terminal faces and the loop survive, but the initial sharp terminal junctions need the one permitted repair.',
  })),
}
write('first-author-visual.json', visual)
write('first-author-visual.stdout.txt', `${JSON.stringify(visual, null, 2)}\nFAIL: first author gates; one targeted repair round only.\n`)
const earlyOpens = read('actual-opens.json')
fs.renameSync(path.join(root, 'actual-opens.json'), path.join(root, 'actual-opens.initial.json'))
write('actual-opens.json', {
  ...earlyOpens, candidateOpens: 4, total: 8, sourceOpens: 4, maximum: 8,
  events: [...earlyOpens.events, ...ids.map((figure, index) => ({
    ordinal: index + 5, figure, role: 'first-candidate', tool: 'functions.view_image', detail: 'original',
    image: bind(path.join(root, figure, 'before', `${figure}.png`)),
    reopen: false, crop: false, montage: false,
  }))],
  afterImageOpens: 0, modelScreenshots: 0, imageHistoryCompaction: false,
  closedImageBudget: true, nextImageOpenForbidden: true,
})
write('ticket-read.json', {
  schema: 'd537/live-ticket-read@1', date: '2026-11-18',
  backend: 'plane', workspace: 'intentmill', project: '556c9df8-f5ac-435a-8abd-53bc522dd8a7',
  issue: '7ebae0e0-c024-481d-8360-5b3d3bfdda79', identifier: 'STEMROBIN-181',
  name: '\u8865\u9f50\u4e5d\u5341\u5e74\u7ea7\u7269\u7406\u53ca\u4e24\u518c\u6982\u7387\u7edf\u8ba1',
  helper: '/Users/yong/.agents/skills/n-plane/scripts/plane.sh',
  verifyHTTP: [200, 200], ticketGETHTTP: 200, writes: 0,
  inheritedTicketFinish: 'review', effectiveScope: 'Latest explicit human authorization: this one bounded author batch only; no ticket closure, Git, commit, DB or deployment.',
  listingParserErrorPreservedAsHistory: 'Initial paginate transport returned HTTP 200; jq attempted the wrong top-level shape and failed. A GET with a recursive object filter resolved the actual ticket. No write was attempted.',
})

const repairs = []
for (const spec of before) {
  const display = beforeDisplay.figures.find(item => item.figure === spec.id)
  if (display.status !== 'fail') throw new Error('not an affected display spec')
  const actualWidths = display.widths.map(item => Math.round(item.mediaWidth))
  spec.display.widths = [...new Set([...spec.display.widths, ...actualWidths])].sort((a, b) => a - b)
  const changed = ['display.widths: add measured desktop 495px, retain 342px and conservative 480px']
  if (spec.id === 'fig-159') {
    for (let i = 0; i < 9; i++) {
      const radius = 2.4 + i * .075
      for (const role of ['left-join', 'right-join']) {
        spec.objects.find(item => item.id === `modern-strand-${i}-${role}`).at = [0, .4 - radius]
      }
      for (const role of ['input', 'output']) {
        spec.objects.find(item => item.id === `modern-strand-${i}-${role}`).at[1] = .4 - radius
      }
      const loop = spec.objects.find(item => item.id === `source-loop-strand-${i}-curve`)
      loop.type = 'circle'
      loop.radius = radius
      delete loop.start
      delete loop.end
      spec.assertions.push({
        id: `modern-strand-${i}-tangent-junction`, type: 'perpendicular',
        a: [0, .4], b: `modern-strand-${i}-left-join`,
        c: `modern-strand-${i}-input`, d: `modern-strand-${i}-left-join`,
      })
    }
    for (const [id, x] of [['input', -4.2], ['output', 4.2]]) {
      const face = spec.objects.find(item => item.id === `source-${id}-end-face`)
      face.from = [x, .4 - 3]
      face.to = [x, .4 - 2.4]
    }
    spec.objects.find(item => item.id === 'modern-input').at[1] = -3.15
    spec.objects.find(item => item.id === 'modern-output').at[1] = -3.15
    spec.objects.find(item => item.id === 'modern-correspondence').at[1] = -4
    const count = spec.assertions.find(item => item.id === 'total-arc')
    count.id = 'total-circle'
    count.objectType = 'circle'
    const group = spec.source.inventory.find(item => item.id === '159-looped-bundle')
    group.description = 'Source looped ribbon bundle with two terminal portions. Full circular loops tangent to straight terminal portions are explicit modern standardized apparatus projection, not measured source curves or physical fiber count. Bottom overlap is a projection of a looping route, not an added branching junction. No sample image or optical ray path is introduced.'
    group.assertions.push(...spec.assertions.filter(item => item.id.endsWith('-tangent-junction')).map(item => item.id))
    spec.description += ' One repair removes sharp schematic terminal folds using tangent full-loop projection. All continuous strand levels match at the ends; no physical bend radius or unconditional guidance is claimed.'
    changed.push('Only fiber join geometry: full circular loop tangent to straight terminal portions, corresponding levels retained; labels move below terminals to avoid collision')
  }
  const after = `${spec.id}/after`
  write(`${after}/spec.json`, spec)
  write(`${spec.id}/source.inventory.after.json`, {
    schema: 'd537/source-inventory-map@1', figure: spec.id, source: spec.source.image,
    firstObservations: bind(path.join(root, 'source-observations.json')),
    mappings: spec.source.inventory, changed, modernAdditionsNotSourceFacts: true,
    afterPixelInspection: false, inheritedRAWAndSVGHoldsCleared: false,
  })
  const specFile = path.join(root, after, 'spec.json')
  const draft = command('python3', [path.join(skill, 'scripts/validate_spec.py'), specFile, '--stage', 'draft', '--json'], `${after}/draft`)
  const native = command('node', [
    path.join(skill, 'scripts/render_spec.mjs'), '--spec', specFile,
    '--svg', path.join(root, after, `${spec.id}.svg`),
    '--png', path.join(root, after, `${spec.id}.png`),
    '--report', path.join(root, after, 'render.json'),
  ], `${after}/native-render`)
  const rendered = command('python3', [path.join(skill, 'scripts/validate_spec.py'), specFile, '--stage', 'rendered', '--json'], `${after}/rendered-validation`)
  repairs.push({ figure: spec.id, repairCount: 1, changed, draftExitCode: draft, nativeExitCode: native, renderedExitCode: rendered, additionalRepairAllowed: false, afterImageOpened: false })
  console.log(`${spec.id}: one repair; draft=${draft}, native=${native}, rendered=${rendered}`)
}
write('repair.json', { schema: 'd537/one-repair@1', firstFailures: [bind(path.join(root, 'display-before.json')), bind(path.join(root, 'first-author-visual.json'))], figures: repairs })

const physics = []
const close = (a, b) => Math.abs(a - b) <= 1e-6
for (const id of ids) {
  const spec = read(`${id}/after/spec.json`)
  const byId = new Map(spec.objects.map(item => [item.id, item]))
  const p = id => Array.isArray(id) ? id : byId.get(id).at
  const v = (a, b) => { const x = p(a), y = p(b); return [y[0] - x[0], y[1] - x[1]] }
  const sin = vector => Math.abs(vector[0]) / Math.hypot(...vector)
  const checks = []
  const check = (name, ok, detail) => checks.push({ name, status: ok ? 'pass' : 'fail', detail })
  if (id === 'fig-156') {
    const i = v('source-aperture', 'interface-hit')
    const r = v('interface-hit', 'reflected-exit')
    const t = v('interface-hit', 'refracted-end')
    check('glass-to-air below-critical modern schematic', close(sin(t), 1.5 * sin(i)) && sin(t) > sin(i) && sin(t) < 1, 'Index used internally is the existing rounded glass example, not a new labelled value or recovered pixel measurement.')
    check('equal reflection angle, opposite normal component', close(sin(r), sin(i)) && i[1] > 0 && r[1] < 0, 'Native radius, symmetry and collinearity assertions also pass.')
  } else if (id === 'fig-157') {
    const i = v('source-incident-entry', 'source-interface-hit')
    const r = v('source-interface-hit', 'source-reflected-exit')
    const t = v('source-interface-hit', 'source-grazing-end')
    check('critical equality, not supercritical transmission', close(1.5 * sin(i), 1) && close(t[1], 0), 'Only the source-given right angle is labelled; no numerical critical angle is added.')
    check('reflection equality', close(sin(i), sin(r)) && r[1] < 0, 'Source alpha-zero and gamma are preserved.')
  } else if (id === 'fig-158') {
    const incident = spec.objects.filter(item => item.type === 'arrow' && item.id.endsWith('-incident'))
    const reflected = spec.objects.filter(item => item.type === 'arrow' && item.id.endsWith('-reflected'))
    const transmitted = spec.objects.filter(item => item.type === 'arrow' && item.id.endsWith('-refracted'))
    check('all source families preserved', incident.length === 13 && reflected.length === 13 && transmitted.length === 9, 'Normal plus six pairs of incidence/reflection; four transmitted pairs plus normal. Counts refer to ray families, not energy values.')
    for (const ray of incident) {
      const key = ray.id.slice('source-'.length, -'-incident'.length)
      const i = v(ray.from, ray.to)
      const r = v(ray.to, `source-${key}-reflected-end`)
      const t = byId.get(`source-${key}-refracted-end`)
      check(`${key}: reflection`, close(sin(i), sin(r)) && r[1] < 0, 'Direction-only short reflected legs; no measured endpoint claim.')
      check(`${key}: correct refraction regime`, t ? close(sin(v(ray.to, t.at)), 1.33 * sin(i)) && 1.33 * sin(i) < 1 : 1.33 * sin(i) > 1, 'Uses the inherited rounded water example internally. No inferred measured slopes, exact energies, or new printed values.')
    }
    const weight = key => byId.get(`source-right-${key}-refracted`).strokeWidth
    check('qualitative transmitted strength order', weight(1) > weight(2) && weight(2) > weight(3) && weight(3) > weight(4), 'Illustrative relative stroke weights, not Fresnel coefficients.')
  } else {
    const loops = spec.objects.filter(item => item.type === 'circle')
    check('single projected loop family, two faces', loops.length === 9 && byId.has('source-input-end-face') && byId.has('source-output-end-face'), 'Representative strands only, not an inferred source fiber count.')
    for (let i = 0; i < 9; i++) {
      const left = p(`modern-strand-${i}-left-join`)
      const right = p(`modern-strand-${i}-right-join`)
      const input = p(`modern-strand-${i}-input`)
      const output = p(`modern-strand-${i}-output`)
      const loop = byId.get(`source-loop-strand-${i}-curve`)
      check(`strand-${i}: tangent and corresponding levels`, close(left[0], 0) && close(right[0], 0) && close(left[1], right[1]) && close(left[1], .4 - loop.radius) && close(input[1], output[1]) && close(input[1], left[1]), 'Straight projected terminals tangent at the bottom of a full loop; no sharp turn, numeric bend radius, branching route, or sample image is asserted.')
    }
  }
  physics.push({ figure: id, status: checks.every(item => item.status === 'pass') ? 'pass' : 'fail', checks })
}
write('geometry-check.json', {
  schema: 'd537/author-geometry-check@1', status: physics.every(item => item.status === 'pass') ? 'pass' : 'fail',
  premise: 'Supplemental FigureSpec arithmetic for the modern schematic, not a new SCI/ZHEN prose review or a source-pixel measurement.',
  independentReview: false, figures: physics,
})
const displayExit = command('node', [path.join(root, 'display-check.mjs'), 'after'], 'display-after-command')
const afterDisplay = fs.existsSync(path.join(root, 'display-after.json')) ? read('display-after.json') : null
const inputs = read('inputs.json')
const unchanged = inputs.inputs.filter(item => !item.path.startsWith(`${root}/`)).map(item => ({ ...item, unchanged: sha(item.path) === item.sha256 }))
write('input-hashes-after.json', { status: unchanged.every(item => item.unchanged) ? 'pass' : 'fail', files: unchanged, inputsReopenedAsImages: false })

const figures = ids.map(id => {
  const repair = repairs.find(item => item.figure === id)
  const display = afterDisplay?.figures.find(item => item.figure === id)
  const geometry = physics.find(item => item.figure === id)
  const pass = repair.draftExitCode === 0 && repair.nativeExitCode === 0 && repair.renderedExitCode === 0 && display?.status === 'pass' && geometry.status === 'pass'
  const dir = path.join(root, id, 'after')
  const outputs = ['spec.json', 'render.json', `${id}.svg`, `${id}.png`].filter(file => fs.existsSync(path.join(dir, file))).map(file => bind(path.join(dir, file)))
  const byteIdentical = id === 'fig-159' ? null : {
    svg: sha(path.join(dir, `${id}.svg`)) === sha(path.join(root, id, 'before', `${id}.svg`)),
    png: sha(path.join(dir, `${id}.png`)) === sha(path.join(root, id, 'before', `${id}.png`)),
    meaning: 'Width-contract-only change; byte identity reuses the one viewed bitmap. It does not by itself establish source fidelity.',
  }
  return {
    figure: id, status: pass ? 'READY-FOR-INDEPENDENT-FIG-REVIEW' : 'HOLD',
    mode: 'deterministic', firstDraft: 'pass', firstNativeRender: 'pass',
    firstAuthorVisual: id === 'fig-159' ? 'fail' : 'pass', firstDisplayWidthDeclaration: 'fail',
    repairCount: 1, secondRepair: false, finalDraft: repair.draftExitCode === 0 ? 'pass' : 'fail',
    finalNativeRender: repair.nativeExitCode === 0 ? 'pass' : 'fail',
    finalRenderedSpec: repair.renderedExitCode === 0 ? 'pass' : 'fail',
    finalAuthorGeometry: geometry.status, finalIsolatedHeadedDisplay: display?.status || 'not-run',
    actualMediaWidths: display?.widths.map(item => ({ viewport: item.viewport, mediaWidth: item.mediaWidth, minTextPx: item.minTextPx })) || [],
    actualImageOpens: 2, originalOpens: 1, firstCandidateOpens: 1, afterCandidateOpens: 0,
    finalVisualReview: 'pending-independent', finalRasterVisualReview: id === 'fig-159' ? 'pending-independent-no-after-image-open' : 'first-image-inspected-width-only-repair',
    byteIdentical, spec: bind(path.join(dir, 'spec.json')), outputs,
    inventory: bind(path.join(root, id, 'source.inventory.after.json')),
    review: null, FIG: 'pending', DISPLAY: 'isolated-figure-only-not-integrated', fullcard: false,
  }
})
const ready = figures.every(item => item.status.startsWith('READY')) && unchanged.every(item => item.unchanged) && displayExit === 0
write('source.inventory.json', {
  schema: 'd537/all-source-inventory@1', basis: bind(path.join(root, 'source-observations.json')),
  figures: figures.map(item => ({ figure: item.figure, finalMapping: item.inventory, firstMapping: bind(path.join(root, item.figure, 'source.inventory.json')) })),
  existingRAWAndSVGHoldsPreserved: true, sourceFactsAndModernAdditionsSeparated: true,
})
write('report.json', {
  schema: 'd537/bounded-modern-figure-author-report@1', ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n73',
  date: '2026-11-18', batch: 'd537-n73-first-modern-figure-author', workerRole: 'one-off bounded figure author',
  branchContextFromHuman: 'codex/STEMROBIN-181-textbooks', gitCommandsRun: 0,
  status: ready ? 'READY-FOR-INDEPENDENT-FIG-REVIEW' : 'HOLD',
  readyMeaning: 'Hash-frozen draft/render evidence is ready for a separate fresh independent FIG review; not promotion, source-HOLD clearance, or full-card acceptance.',
  authorBatchClosed: true, parentCloseBatchNow: true, noResidentOrReplacementWorker: true,
  SCI: 'PASS-INHERITED', ZHEN: 'PASS-INHERITED', textReview: inputs.textReview,
  repeatedSCIOrZHEN: false, FIG: 'pending-independent', DISPLAY: 'isolated-headed-figure-check-only',
  fullcard: false, completeCard: false, figures,
  actualOpens: { originals: 4, firstCandidates: 4, total: 8, max: 8, reopens: 0, crops: 0, montages: 0, afterImages: 0, payloadReturned: false, evidence: bind(path.join(root, 'actual-opens.json')) },
  repairPolicy: 'Exactly one affected-spec repair per figure. All add actual measured 495px desktop declaration; only fig159 additionally repairs the visibly sharp loop joins. Before evidence and FAIL stdout retained. Any remaining failure is terminal HOLD; no second repair.',
  limitations: [
    'No integrated product or full offline lesson was run. Figure-only headed checks use implemented product prose/media CSS and the supplied mobile inner budget.',
    'The initial fig159 PNG was inspected and failed. The changed final fig159 SVG/PNG was not reopened because 8/8 actual image-context opens were consumed. Native tangent assertions, source-space arithmetic and headed DOM gate ran; final visual judgment belongs to independent FIG review.',
    'Fig156 printed hatching obscures exact beam traces; visible modern rays are complete inherited-prose clarifications, not claimed pixel measurements.',
    'No actual fiber count, measured curve, bend radius, refracted-energy percentage or new numerical figure label is inferred.',
    'Author scratch render metadata intentionally binds this batch only and is not promotable durable edition metadata.',
  ],
  preserved: { priorRAWAndSVGHolds: true, originalPNGs: true, fullBilingualText: true, canonicalAssets: true, otherWorkersBytes: true, sourceHashEvidence: bind(path.join(root, 'input-hashes-after.json')) },
  forbiddenOperationsRun: { newQuestions: 0, answerKeys: 0, paidGeneration: 0, productionDB: 0, git: 0, commitPush: 0, deployment: 0, wholeProjectTests: 0, lessonFinalize: 0, subagents: 0, worktreesOrBranches: 0 },
  next: 'Parent closes this short author batch. A separately authorized fresh short batch performs independent FIG review against the four originals, current bilingual context and final after outputs; no parent image payloads or parent reopens.',
})
write('report.md', `# D537\n\nStatus: ${ready ? 'READY-FOR-INDEPENDENT-FIG-REVIEW' : 'HOLD'}\n\nFour first modern native FigureSpecs for n73; no body-text review repeated. SCI/ZHEN inherited PASS; independent FIG pending; fullcard=false. Author batch closed; parent may close this batch now.\n\nOriginal PNG opens 4 + first-candidate opens 4 = 8/8. No reopens, crops, montage, history reset or image payload returned. Final repair PNGs were not opened.\n\nAll first draft/native gates passed. The first headed declaration gate failed because actual desktop media is 495px, not the declared 480px. The first fig159 visual also failed for sharp terminal joins. Each figure received exactly one affected-spec repair: add 495px; fig159 also uses a tangent full-loop apparatus projection. No second repair occurred. Final statuses and hashes are in report.json.\n\nFinal phone media is 342px and minimum text is 17px. Desktop media is 495px and minimum text is about 24.60px. These are isolated headed figure checks, not integrated card/lesson acceptance.\n\nThe changed fig159 still requires independent raster/visual inspection. No independent review@1 PASS or durable promotion is claimed. Existing RAW/SVG HOLDs remain separate and untouched.\n\nOnly this directory was written. No Git, DB, questions, answers, paid artwork, publish, deploy, permanent worker or subagent.\n`)

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory()
    ? listFiles(path.join(dir, item.name))
    : [path.join(dir, item.name)])
}
const files = listFiles(root).sort()
write('author-freeze.json', {
  schema: 'd537/author-freeze@1', date: '2026-11-18', status: ready ? 'READY-FOR-INDEPENDENT-FIG-REVIEW' : 'HOLD',
  closed: true, filesMode: '0444', fileCountIncludingThisManifest: files.length + 1,
  manifestSelfHash: 'Detached hash returned in final text; this manifest does not hash itself.',
  report: bind(path.join(root, 'report.json')), actualOpens: 8,
  independentFIG: 'pending', fullcard: false, files: files.map(bind),
})
const frozen = listFiles(root)
for (const file of frozen) fs.chmodSync(file, 0o444)
for (const file of frozen) if ((fs.statSync(file).mode & 0o777) !== 0o444) throw new Error(`freeze failed: ${file}`)
console.log(JSON.stringify({
  status: ready ? 'READY-FOR-INDEPENDENT-FIG-REVIEW' : 'HOLD',
  report: bind(path.join(root, 'report.json')),
  authorFreeze: bind(path.join(root, 'author-freeze.json')),
  frozenFiles: frozen.length, mode: '0444', actualOpens: 8, FIG: 'pending', fullcard: false,
}, null, 2))
