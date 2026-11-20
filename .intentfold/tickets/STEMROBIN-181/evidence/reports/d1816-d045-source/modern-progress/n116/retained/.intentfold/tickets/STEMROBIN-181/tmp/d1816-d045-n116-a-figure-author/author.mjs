import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const scratch = '.tmp/STEMROBIN-181/d1816-d045/n116-a-figure-author'
const evidence = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-a-figure-author'
const draftPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-bilingual-draft/phy9-c2-s5-n116.json'
const lessonPath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s5-n116/lesson.json'
const consumedPath = '.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d045-source/consumed.json'
const reviewPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-bilingual-review/n116-affected-report.json'
const runtimeReceipt = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n117-figure-author/technical-runtime-recovery.json'
const runtime = '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/render_spec.mjs'
const validator = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
const numbers = [242, 243, 244, 245]
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: p, sha256: sha(p) })
const textSha = t => crypto.createHash('sha256').update(t).digest('hex')
function writeNew(p, value) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const draft = read(draftPath)
const review = read(reviewPath)
assert.equal(sha(draftPath), 'da72a0266856eb2875bfe58880c0d9948e988a835613251bd1b7039058ff6952')
assert.equal(review.currentDraft.sha256, sha(draftPath))
assert.equal(review.status, 'PASS')
assert.equal(sha(lessonPath), review.source.sha256)
assert.equal(read(consumedPath).status, 'SOURCE-AND-RAW-PNG-PASS-SCOPED-CONSUMED-ONCE')
assert.equal(draft.en.length, 9)
assert.equal(draft.zh.length, 9)
const en = draft.en.join('\n\n')
const zh = draft.zh.join('\n\n')
const image = n => `ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-${n}.png`

const inventories = {
  242: {
    source: 'One oblique horseshoe magnet, two long rectangular arms ending openly at the left, curved joining body at the right; the rear upper arm is light, the nearer lower arm dark. End faces and body thickness are visible. One small rectangular wire loop hangs in the open gap near the left ends from one vertical textured strand extending to the top. Its nature as electrical lead versus suspension is not pixel-resolved. No pole letters, current arrow, normal, field arrow, dimensions, numbers, hand or natural object is visible.',
    relations: 'Both arms belong to the same U-shaped body; the loop is between their open ends. The vertical strand reaches the upper edge of the loop. End faces and loop side edges are vertical in the projection. No polarity or loop-current direction can be derived from these unlabeled pixels.',
    additions: 'Clean computed oblique projection and smooth sampled U bend; semantic-role shading replaces black halftone. No N/S, B, I, n, terminal or battery is added.',
    routing: 'deterministic: all visible objects are manufactured apparatus with geometric relationships; no natural artwork is required.'
  },
  243: {
    source: 'Left: a tall narrow projected circular loop with paired winding contours, two upper leads, a down arrow on the left upper lead and an up arrow on the right upper lead beside I. Downward current heads occur on the left loop side; an upward head occurs on the right side. The horizontal normal starts near the loop centre and points right, labeled vector n. Right: a physical screw/auger with vertical thick shaped handle, horizontal shaft, helical/thread-like marks and pointed right tip. A curved turning indicator around the shaft has a visible upward head at its lower-right portion. No hand, numerical angle or field arrow is visible.',
    relations: 'The loop normal and screw shaft share a rightward projected axis. The visible left-down/right-up circulation is consistent with the right-hand screw advancing along the displayed normal. The 2D ellipse is not a true circular cross section in screen coordinates; do not assert screen-space perpendicularity.',
    additions: 'One explicit orthographic model P(x,y,z)=(0.8x+0.6y,z); the loop lies in the y-z plane and its current-selected normal is +x. Its circulation is y=cos(t), z=sin(t), so y cross z = +x. Projection is a consistent reconstruction, not uniquely pixel-certified 3D. Smooth winding contours and clean thread marks are regularization, not turn/thread counts. Rotation is modeled with the same current sense.',
    routing: 'deterministic: retain the actual screw handle, threaded shaft and tip, not an abstract replacement arrow.'
  },
  244: {
    source: 'Two side-by-side objects: left a horizontal double-ended magnetic needle, S on the left light half and N on the right dark half, a concentric circular centre/pivot, and a small rightward arrow along the centreline toward N. Right a tall elliptical multi-contour coil with downward current heads on the left and upward current heads on the right. Its centre is a filled dot; a thick horizontal arrow from that centre points right and is labeled vector n. No external-field B label, support or dimensions is present.',
    relations: 'The needle S-to-N arrow and the coil current-selected normal point right in the shared comparative frame. Pole placement determines S-to-N independently of any imagined magnet outside the figure. Current-to-normal derivation uses the same consistent projection as fig-243, not a guessed hidden arrowhead.',
    additions: 'Readable S/N and vector n; semantic fill on the N half; regularized symmetric needle outline, three illustrative winding contours, not a measured turn count. Needle and loop are shown after stable settling in an approximately uniform external field, not during arbitrary rotation.',
    routing: 'deterministic: exact pole ordering, direction agreement, current circulation and pivot/coil geometry.'
  },
  245: {
    source: 'One suspended inclined circular multi-turn coil shown as several dark/light elliptical rim strokes, leaning from upper left toward lower right in the image. An upright inverted-U yoke surrounds its upper region; a vertical shaft continues from the arch top to a short thick horizontal top bar. Coil attachments are visible at the lower left and near the right upper side; the left has a small angular projecting bracket and the right joins the yoke and a wavy lead extending up-right to a thick free end. No current, n, B, pole, axis label, turn count, numerical dip or rotation arrow is visible.',
    relations: 'Vertical suspension permits rotation about the vertical shaft; opposed coil bearings permit rotation about a horizontal physical axis which is oblique on the page. Do not call that screen line physically tilted or make it a second vertical axis. The inclined loop is not a measured dip angle. Electrical topology and any hidden second lead are unresolved and are not reconstructed.',
    additions: 'Explicit orthographic camera with screen-right=(0.8,0.6,0) and screen-up=(-0.24,0.32,sqrt(0.84)); the horizontal bearing axis is world y, the vertical axis world z. A normalized illustrative tilt, not a source angle, places the coil in a plane spanned by y and (-sin(beta),0,cos(beta)). Two dashed axis guides and English labels are modern additions. No current-selected n or B direction is drawn: the unlabeled source cannot pixel-certify their signs. The text supplies stable Earth-field settling and field uniformity over a comparatively large coil.',
    routing: 'deterministic: retain yoke, suspension bar/shaft, both bearings, angular left bracket and wavy right lead; no natural artwork or paid generation.'
  }
}

function prepare() {
  for (const n of numbers) assert.ok(read(consumedPath).rawPngFigures.includes(`fig-${n}`))
  for (const { source, runtime: recovered } of read(runtimeReceipt).copied) {
    assert.equal(sha(source.path), source.sha256)
    assert.equal(sha(recovered.path), source.sha256)
  }
  writeNew(`${evidence}/original-inventory.json`, {
    schema: 'STEMROBIN-181/figure-source-inventory@1',
    role: 'FIRST AUTHOR; not independent review',
    originalViewsBeforeAnySpec: ['fig-242', 'fig-243', 'fig-243', 'fig-244', 'fig-245'],
    duplicateView: 'Accidental second view of fig-243 retained; total original views is five, not four.',
    figures: numbers.map(n => ({ id: `fig-${n}`, original: bind(image(n)), ...inventories[n] })),
    noNumericSourceGuesses: true,
    noAdditionalImageAssetsOpened: true
  })
  writeNew(`${evidence}/context.json`, {
    schema: 'STEMROBIN-181/figure-author-context@1',
    workdir: cwd,
    scope: numbers.map(n => `fig-${n}`),
    role: 'FIRST AUTHOR, not independent reviewer',
    sourceLesson: bind(lessonPath),
    sourceConsumed: bind(consumedPath),
    sourceApprovalCarriedForward: '6 source pages and 11 raw PNGs already passed and consumed; no page reopen or source review replay.',
    currentDraft: bind(draftPath),
    completeEN: en, completeZH: zh,
    enSHA256: textSha(en), zhSHA256: textSha(zh),
    joinSeparator: '\n\n', enBlocks: 9, zhBlocks: 9,
    textReview: bind(reviewPath),
    firstHistoricalTextReview: bind(review.firstReview.path),
    effectiveTextStatus: 'PASS: current affected PASS composed with prior unchanged SCI and ZHEN; no new text review.',
    textEdits: 0,
    scientificLimits: [
      'Stable small planar current loop: current-selected normal aligns approximately uniform EXTERNAL B.',
      'Instantaneous normal during turning need not align B.',
      'RHR uses conventional current; needle direction is S to N.',
      'Earth-field coil may be comparatively large only with approximately uniform external field over the coil.',
      'Vertical and horizontal physical turning axes permit inclination; no universal or numeric Earth dip.',
      'No unique spatial directions are recovered from a 2D ellipse; model additions are explicit.'
    ],
    runtime: bind(runtime),
    runtimeRecovery: bind(runtimeReceipt),
    runtimeReuse: 'Read-only; no copy, install, dependency symlink change or renderer edit.',
    ownership: [scratch, evidence],
    deviations: [{
      id: 'unrequested-read-only-git-status',
      actualCommand: 'git status --short -- the two owned directories',
      count: 1, mutation: false,
      reason: 'Initial read-only status call was outside the no-git instruction; retained honestly. No further Git calls.'
    }]
  })
}

const r = v => Math.round(v * 1e6) / 1e6
const xy = p => p.map(r)
const uxy = p => xy([p[0], -p[1]])
class Diagram {
  constructor(n, height = 480) {
    this.n = n
    this.spec = {
      schema: 'ld-s10y-image/figure-spec@2', id: `fig-${n}`, mode: 'deterministic',
      description: inventories[n].relations + ' Model additions: ' + inventories[n].additions,
      source: { image: bind(image(n)), authoritativeText: [
        { lesson: draft.id, text: en }, { lesson: draft.id, text: zh }
      ], inventory: [] },
      canvas: { width: 640, height, boundingBox: [0, 0, 640, -height], background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [331, 334, 358, 640], minTextPx: 16 },
      objects: [], assertions: [], layout: { minLabelGap: 8 }
    }
  }
  add(type, id, rest) {
    this.spec.objects.push({ id, type, stroke: 'ink', ...rest })
    return id
  }
  seg(id, a, b, rest = {}) {
    this.add('segment', id, { from: uxy(a), to: uxy(b), strokeWidth: 4, ...rest })
    this.fact('connects', `${id}-ends`, { arrow: id, from: uxy(a), to: uxy(b) })
    return id
  }
  arrow(id, a, b, rest = {}) {
    this.add('arrow', id, { from: uxy(a), to: uxy(b), strokeWidth: 4, ...rest })
    this.fact('connects', `${id}-ends`, { arrow: id, from: uxy(a), to: uxy(b) })
    return id
  }
  poly(id, points, rest = {}) {
    return this.add('polygon', id, { points: points.map(uxy), fill: 'paper', fillOpacity: 1, strokeWidth: 3, ...rest })
  }
  text(id, at, text) {
    return this.add('text', id, { at: uxy(at), text, fontSize: 32, labelPlacement: { position: 'CENTER' } })
  }
  circle(id, at, radius, rest = {}) {
    return this.add('circle', id, { center: uxy(at), radius, strokeWidth: 3, fill: 'paper', fillOpacity: 1, ...rest })
  }
  fact(type, id, rest) { this.spec.assertions.push({ id, type, ...rest }); return id }
  curve(id, points, rest = {}) {
    return points.slice(1).map((p, i) => this.seg(`${id}-${i}`, points[i], p, rest))
  }
  group(id, description, objects, assertions) {
    this.spec.source.inventory.push({ id, description, objects: objects.flat(Infinity), assertions: assertions.flat(Infinity) })
  }
}
function sample(count, fn, a = 0, b = Math.PI * 2) {
  return Array.from({ length: count + 1 }, (_, i) => xy(fn(a + (b - a) * i / count)))
}
function ellipse(cx, cy, ax, ay, bx, by, t) {
  return xy([cx + ax * Math.cos(t) + bx * Math.sin(t), cy + ay * Math.cos(t) + by * Math.sin(t)])
}
function winding(d, name, cx, cy, rx, ry, stroke = 'ink') {
  const p = sample(64, t => ellipse(cx, cy, rx, 0, 0, -ry, t))
  const ids = d.curve(name, p, { stroke, strokeWidth: 3 })
  return ids
}
function current(d, name, cx, cy, rx, ry) {
  const e = t => ellipse(cx, cy, rx, 0, 0, -ry, t)
  return [
    d.arrow(`${name}-left-current-upper`, e(Math.PI - 0.45), e(Math.PI - 0.02)),
    d.arrow(`${name}-left-current-lower`, e(Math.PI + 0.02), e(Math.PI + 0.45)),
    d.arrow(`${name}-right-current`, e(-0.25), e(0.25))
  ]
}

function fig242() {
  const d = new Diagram(242)
  const P = (x, y, z = 0) => xy([380 + 0.88 * x + 0.8 * y, 180 - 0.44 * x + 0.4 * y - z])
  const outer = sample(28, t => [130 + 115 * Math.cos(t), 115 * Math.sin(t)], -Math.PI / 2, Math.PI / 2)
  const inner = sample(28, t => [130 + 78 * Math.cos(t), 78 * Math.sin(t)], Math.PI / 2, -Math.PI / 2)
  const plan = [[-300,-115], ...outer, [-300,115], [-300,78], ...inner, [-300,-78]]
  const front = d.poly('magnet-near-arm-thickness', [P(-300,115),P(130,115),P(130,115,-42),P(-300,115,-42)], { fill: 'accentSoft' })
  const bend = d.poly('magnet-curved-body-thickness', [...outer.map(p=>P(...p)), ...outer.toReversed().map(p=>P(...p,-42))], { fill: 'accentSoft' })
  const top = d.poly('magnet-u-top', plan.map(p=>P(...p)), { fill: 'paper' })
  const endFar = d.poly('magnet-far-free-end', [P(-300,-115),P(-300,-78),P(-300,-78,-42),P(-300,-115,-42)])
  const endNear = d.poly('magnet-near-free-end', [P(-300,78),P(-300,115),P(-300,115,-42),P(-300,78,-42)], { fill: 'accentSoft' })
  const frame = [P(-292,-20,-5),P(-292,20,-5),P(-292,20,-42),P(-292,-20,-42)]
  const loop = frame.map((p,i)=>d.seg(`suspended-loop-edge-${i}`,p,frame[(i+1)%4],{strokeWidth:5}))
  const anchor = P(-292,0,-5)
  const strand = d.seg('vertical-suspension-strand', [anchor[0],30], anchor, { strokeWidth:4 })
  const arms = d.fact('parallel','same-body-arm-directions',{a:uxy(P(-300,-115)),b:uxy(P(130,-115)),c:uxy(P(-300,115)),d:uxy(P(130,115))})
  const sides = d.fact('parallel','loop-opposed-vertical-sides',{a:uxy(frame[1]),b:uxy(frame[2]),c:uxy(frame[0]),d:uxy(frame[3])})
  const junction = d.fact('pointOnLine','strand-meets-loop-top',{point:uxy(anchor),a:uxy(frame[0]),b:uxy(frame[1])})
  d.group('single-u-magnet',inventories[242].source,[front,bend,top,endFar,endNear],[arms])
  d.group('loop-in-open-gap',inventories[242].relations,[loop,strand],[sides,junction,`${strand}-ends`,loop.map(id=>`${id}-ends`)])
  return d.spec
}
function fig243() {
  const d = new Diagram(243)
  const cx=120, cy=265, rx=93, ry=155
  const coil = [winding(d,'coil-outer',cx,cy,rx,ry),winding(d,'coil-inner',cx,cy,0.6*(ry-7),ry-7)]
  const currents = current(d,'coil',cx,cy,rx,ry)
  const leadL=d.seg('left-upper-lead',[106,110],[106,36])
  const leadR=d.seg('right-upper-lead',[131,110],[131,36])
  const ia=d.arrow('left-lead-current',[106,38],[106,82])
  const ib=d.arrow('right-lead-current',[131,80],[131,36])
  const il=d.text('current-label',[167,50],'I')
  const normal=d.arrow('current-selected-normal',[120,265],[245,265],{strokeWidth:5})
  const nl=d.text('normal-label',[253,304],'n\u20d7')
  const handle=d.poly('screw-handle',[[291,179],[320,179],[313,219],[313,309],[321,350],[290,350],[299,309],[299,219]],{fill:'accentSoft'})
  const shaft=d.seg('screw-shaft',[305,265],[581,265],{strokeWidth:7})
  const tip=d.poly('screw-tip',[[581,259],[609,265],[581,271]],{fill:'ink'})
  const threads=[]
  for(let i=0;i<8;i++) threads.push(d.seg(`screw-thread-${i}`,[365+i*23,257],[375+i*23,273],{strokeWidth:3}))
  const rotPoints=sample(36,t=>ellipse(515,265,32,0,0,-62,t),0.45,2*Math.PI-0.38)
  const rotation=d.curve('screw-turning-curve',rotPoints,{strokeWidth:4})
  const e=t=>ellipse(515,265,32,0,0,-62,t)
  const ra=d.arrow('screw-turning-head',e(2*Math.PI-0.38),e(2*Math.PI-0.05),{strokeWidth:4})
  const axis=d.fact('collinear','normal-and-screw-axis',{a:uxy([120,265]),b:uxy([245,265]),c:uxy([609,265])})
  d.group('current-loop-and-leads',inventories[243].source,[coil,currents,leadL,leadR,ia,ib,il],[...currents.map(id=>`${id}-ends`),`${leadL}-ends`,`${leadR}-ends`,`${ia}-ends`,`${ib}-ends`])
  d.group('normal-and-real-screw',inventories[243].relations+' '+inventories[243].additions,[normal,nl,handle,shaft,tip,threads,rotation,ra],[axis,`${normal}-ends`,`${shaft}-ends`,`${ra}-ends`])
  return d.spec
}
function fig244() {
  const d=new Diagram(244,400)
  const left=d.poly('needle-south-half',[[32,215],[160,183],[160,247]],{fill:'paper'})
  const right=d.poly('needle-north-half',[[160,183],[286,215],[160,247]],{fill:'accentSoft',fillOpacity:0.65})
  const pivot=d.circle('needle-pivot',[160,215],12)
  const pivotInner=d.circle('needle-pivot-inner',[160,215],5)
  const needle=d.arrow('needle-s-to-n',[178,215],[270,215],{strokeWidth:4})
  const s=d.text('south-label',[99,164],'S')
  const n=d.text('north-label',[225,164],'N')
  const coil=[winding(d,'coil-outer',451,215,87,145),winding(d,'coil-middle',451,215,83.4,139),winding(d,'coil-inner',451,215,79.8,133)]
  const currents=current(d,'coil',451,215,87,145)
  const dot=d.circle('coil-centre-dot',[451,215],6,{fill:'ink'})
  const normal=d.arrow('current-selected-normal',[451,215],[588,215],{strokeWidth:5})
  const nl=d.text('normal-label',[570,171],'n\u20d7')
  const same=d.fact('parallel','s-to-n-and-normal-agree',{a:uxy([178,215]),b:uxy([270,215]),c:uxy([451,215]),d:uxy([588,215])})
  d.group('magnetic-needle-poles-pivot',inventories[244].source,[left,right,pivot,pivotInner,needle,s,n],[`${needle}-ends`,same])
  d.group('stable-loop-and-selected-normal',inventories[244].relations+' '+inventories[244].additions,[coil,currents,dot,normal,nl],[currents.map(id=>`${id}-ends`),`${normal}-ends`,same])
  return d.spec
}
function fig245() {
  const d=new Diagram(245,640)
  const P=(x,y,z)=>xy([295+0.8*x+0.6*y,430-(-0.24*x+0.32*y+Math.sqrt(0.84)*z)])
  const beta=0.7
  const coil=[]
  for(const [j,R] of [130,136,142].entries()) {
    const pts=sample(72,t=>P(-R*Math.sin(beta)*Math.sin(t),R*Math.cos(t),R*Math.cos(beta)*Math.sin(t)))
    coil.push(d.curve(`inclined-coil-contour-${j}`,pts,{strokeWidth:3}))
  }
  const arch=sample(48,t=>P(0,210*Math.cos(t),210*Math.sin(t)),0,Math.PI)
  const yoke=d.curve('upright-yoke',arch,{stroke:'muted',strokeWidth:6})
  const shaft=d.seg('vertical-suspension-shaft',P(0,0,210),[295,65],{strokeWidth:6})
  const bar=d.seg('top-suspension-bar',[258,65],[332,65],{strokeWidth:10})
  const l=P(0,-142,0), rr=P(0,142,0)
  const bearingL=d.seg('left-horizontal-bearing',P(0,-210,0),l,{strokeWidth:7})
  const bearingR=d.seg('right-horizontal-bearing',rr,P(0,210,0),{strokeWidth:7})
  const bracket=d.poly('left-angular-bearing-bracket',[[l[0]-9,l[1]+2],[l[0]-13,l[1]+28],[l[0]+7,l[1]+16]],{fill:'paper'})
  const leadPts=sample(40,t=>[rr[0]+(525-rr[0])*t+9*Math.sin(8*Math.PI*t),rr[1]+(170-rr[1])*t],0,1)
  const lead=d.curve('wavy-right-lead',leadPts,{strokeWidth:4})
  const leadEnd=d.seg('right-lead-free-end',[525,170],[530,157],{strokeWidth:8})
  const vaxis=d.seg('added-vertical-axis-guide',[295,95],[295,590],{stroke:'muted',strokeWidth:2,dash:2})
  const haxis=d.seg('added-horizontal-axis-guide',P(0,-235,0),P(0,235,0),{stroke:'muted',strokeWidth:2,dash:2})
  const vl=d.text('added-vertical-axis-label',[155,117],'Vertical axis')
  const hl=d.text('added-horizontal-axis-label',[453,593],'Horizontal axis')
  const vertical=d.fact('parallel','vertical-guide-follows-shaft',{a:uxy([295,95]),b:uxy([295,590]),c:uxy(P(0,0,210)),d:uxy([295,65])})
  const horizontal=d.fact('collinear','opposed-bearings-one-physical-axis',{a:uxy(P(0,-210,0)),b:uxy(P(0,210,0)),c:uxy(rr)})
  d.group('inclined-multi-turn-coil',inventories[245].source,[coil,bearingL,bearingR,bracket],[`${bearingL}-ends`,`${bearingR}-ends`,horizontal])
  d.group('suspension-yoke-lead',inventories[245].relations,[yoke,shaft,bar,lead,leadEnd],[`${shaft}-ends`,`${bar}-ends`,`${leadEnd}-ends`])
  d.group('disclosed-modern-axis-guides',inventories[245].additions,[vaxis,haxis,vl,hl],[vertical,horizontal,`${vaxis}-ends`,`${haxis}-ends`])
  return d.spec
}
const builders={242:fig242,243:fig243,244:fig244,245:fig245}
const candidateOrder=['first','technical','repair','runtime','runtime2']
function currentFolder(n) {
  return candidateOrder.filter(c=>fs.existsSync(`${scratch}/fig-${n}/${c}/spec.json`)).at(-1)
}
function verify() {
  const context=read(`${evidence}/context.json`)
  assert.equal(sha(draftPath),context.currentDraft.sha256)
  assert.equal(sha(lessonPath),context.sourceLesson.sha256)
  assert.equal(sha(review.firstReview.path),review.firstReview.sha256)
  const originalInventory=read(`${evidence}/original-inventory.json`)
  const results=[]
  for(const n of numbers) {
    const folder=`${scratch}/fig-${n}/${currentFolder(n)}`
    const spec=read(`${folder}/spec.json`)
    const rendered=read(`${folder}/fig-${n}.render.json`)
    assert.equal(spec.source.image.sha256,sha(image(n)))
    assert.equal(originalInventory.figures.find(f=>f.id===`fig-${n}`).original.sha256,sha(image(n)))
    assert.equal(rendered.status,'pass')
    assert.equal(rendered.spec.sha256,sha(`${folder}/spec.json`))
    assert.equal(rendered.output.svg.sha256,sha(`${folder}/fig-${n}.svg`))
    assert.equal(rendered.renderer.name,'JSXGraph')
    assert.equal(spec.source.authoritativeText[0].text,en)
    assert.equal(spec.source.authoritativeText[1].text,zh)
    assert.ok(spec.canvas.width<=640&&spec.canvas.height<=640)
    assert.deepEqual(spec.display.widths,[331,334,358,640])
    assert.equal(spec.display.maxWidthPx,640)
    assert.equal(spec.display.minTextPx,16)
    assert.equal(spec.display.layout,'inline')
    const ids=new Set(spec.objects.map(o=>o.id))
    assert.equal(ids.size,spec.objects.length)
    assert.ok(spec.objects.every(o=>!['image','svgPath'].includes(o.type)))
    assert.ok(spec.objects.filter(o=>o.type==='text').every(o=>o.fontSize===32))
    assert.ok(spec.objects.every(o=>['ink','muted','accent','accentSoft','grid','paper'].includes(o.stroke)))
    assert.ok(rendered.displayChecks.every(c=>c.status==='pass'&&(!c.measuredMinPx||c.measuredMinPx>=16)))
    assert.deepEqual(rendered.collisions,[])
    const png=fs.readFileSync(`${folder}/fig-${n}.preview.png`)
    assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a')
    assert.equal(png.readUInt32BE(16),640)
    assert.equal(png.readUInt32BE(20),spec.canvas.height)
    const o=id=>spec.objects.find(o=>o.id===id)
    if(n===243||n===244) {
      for(const id of ['coil-left-current-upper','coil-left-current-lower']) {
        assert.ok(o(id).to[1]<o(id).from[1])
      }
      assert.ok(o('coil-right-current').to[1]>o('coil-right-current').from[1])
      assert.ok(o('current-selected-normal').to[0]>o('current-selected-normal').from[0])
      assert.equal(o('current-selected-normal').to[1],o('current-selected-normal').from[1])
      const radius=n===243?155:145
      const centre=n===243?[120,-265]:[451,-215]
      const outer=spec.objects.filter(o=>o.id.startsWith('coil-outer-')&&o.type==='segment')
      for(const segment of outer) {
        const dy=(segment.from[1]-centre[1])/radius
        const dx=(segment.from[0]-centre[0])/(0.6*radius)
        assert.ok(Math.abs(dx*dx+dy*dy-1)<1e-6)
      }
    }
    if(n===244) {
      assert.ok(o('south-label').at[0]<o('north-label').at[0])
      assert.equal(o('south-label').text,'S')
      assert.equal(o('north-label').text,'N')
      assert.ok(o('needle-s-to-n').to[0]>o('needle-s-to-n').from[0])
      assert.equal(o('needle-s-to-n').to[1],o('current-selected-normal').to[1])
    }
    if(n===245) {
      const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0)
      const right=[0.8,0.6,0],up=[-0.24,0.32,Math.sqrt(0.84)]
      assert.ok(Math.abs(dot(right,up))<1e-12)
      assert.ok(Math.abs(dot(right,right)-1)<1e-12)
      assert.ok(Math.abs(dot(up,up)-1)<1e-12)
      const y=[0,1,0],z=[0,0,1],v=[-Math.sin(0.7),0,Math.cos(0.7)]
      assert.equal(dot(y,z),0)
      assert.equal(dot(y,v),0)
      assert.ok(Math.abs(dot(v,v)-1)<1e-12)
      assert.ok(!spec.objects.some(o=>o.type==='arrow'))
    }
    results.push({id:`fig-${n}`,spec:bind(`${folder}/spec.json`),render:bind(`${folder}/fig-${n}.render.json`),bitmap:bind(`${folder}/fig-${n}.preview.png`),status:'PASS-machine-only'})
  }
  const receipts=fs.readdirSync(`${evidence}/receipts`).map(f=>read(`${evidence}/receipts/${f}`))
  const failures=receipts.filter(r=>r.exitCode!==0)
  writeNew(`${evidence}/author-consistency-check.json`,{
    schema:'STEMROBIN-181/author-consistency-check@1',status:'PASS',workdir:cwd,
    role:'Author executable consistency only, not independent review',
    figures:results,
    rhrDerivation:'World y cross z = +x. P(x,y,z)=(0.8x+0.6y,z) has orthonormal rows. Counterclockwise circulation in the y-z plane has left-down/right-up projected tangents and projects +x rightward.',
    n245Axes:'World vertical z and horizontal bearing y are perpendicular; projection is orthographic. Screen obliqueness of y is not a physical dip of the axis. No source-current, pole, n or B sign is guessed.',
    failureReceiptsRetained:failures.map(r=>({label:r.label,exitCode:r.exitCode})),
    failuresCount:failures.length,
    imageInspectionStatus:'Only fig-243/244 current final bitmaps inspected. Fig-242 repaired final and fig-245 final remain targeted HOLD.',
    originalBindingsCurrent:true,textBindingsCurrent:true,svgRenderBindingsCurrent:true,bitmapDimensionsChecked:true,
    colorsSemantic:true,nativeRendererUnmodified:true,
    sourceFidelityApproved:false,independentReview:false,publicationApproved:false
  })
  console.log(JSON.stringify({status:'PASS',check:bind(`${evidence}/author-consistency-check.json`),failuresRetained:failures.length}))
}
function command(label, command, args) {
  const result=spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:16*1024*1024})
  const receipt={schema:'STEMROBIN-181/author-command-receipt@1',label,workdir:cwd,command:[command,...args],exitCode:result.status,signal:result.signal,error:result.error?.message||null,stdout:result.stdout,stderr:result.stderr}
  writeNew(`${evidence}/receipts/${label}.json`,receipt)
  return receipt
}
function renderFigure(n, candidate='first') {
  assert.ok(fs.existsSync(`${evidence}/original-inventory.json`))
  assert.equal(sha(runtime),read(runtimeReceipt).copied[0].source.sha256)
  const folder=`${scratch}/fig-${n}/${candidate}`
  const specPath=`${folder}/spec.json`
  if(candidate==='first'||candidate==='repair') writeNew(specPath,builders[n]())
  if(candidate==='technical') {
    const first=read(`${scratch}/fig-${n}/first/spec.json`)
    for(const group of first.source.inventory) {
      group.objects=group.objects.flat(Infinity)
      group.assertions=group.assertions.flat(Infinity)
    }
    writeNew(specPath,first)
  }
  if(candidate==='runtime') {
    assert.equal(n,243)
    const changed=read(`${scratch}/fig-${n}/repair/spec.json`)
    const arrow=changed.objects.find(o=>o.id==='screw-turning-head')
    arrow.from=uxy(ellipse(515,265,32,0,0,-62,2*Math.PI-0.9))
    writeNew(specPath,changed)
  }
  if(candidate==='runtime2') {
    assert.equal(n,243)
    const changed=read(`${scratch}/fig-${n}/runtime/spec.json`)
    const arrow=changed.objects.find(o=>o.id==='screw-turning-head')
    changed.assertions.find(a=>a.id==='screw-turning-head-ends').from=arrow.from
    writeNew(specPath,changed)
  }
  const validation=command(`fig-${n}-${candidate}-validate`,'python3',[validator,specPath,'--stage','draft','--json'])
  if(validation.exitCode!==0) return {id:`fig-${n}`,candidate,status:'validation-failed',validation:bind(`${evidence}/receipts/fig-${n}-${candidate}-validate.json`)}
  const rendering=command(`fig-${n}-${candidate}-render`,'node',[runtime,'--spec',specPath,'--svg',`${folder}/fig-${n}.svg`,'--png',`${folder}/fig-${n}.preview.png`,'--report',`${folder}/fig-${n}.render.json`])
  return {id:`fig-${n}`,candidate,status:rendering.exitCode===0?'machine-pass':'render-failed',validation:bind(`${evidence}/receipts/fig-${n}-${candidate}-validate.json`),render:bind(`${evidence}/receipts/fig-${n}-${candidate}-render.json`)}
}
function freeze() {
  const context=read(`${evidence}/context.json`)
  assert.equal(sha(draftPath),context.currentDraft.sha256)
  assert.equal(sha(lessonPath),context.sourceLesson.sha256)
  const inspection=read(`${evidence}/author-inspection.json`)
  const figures=numbers.map(n=>{
    const folders=candidateOrder.filter(c=>fs.existsSync(`${scratch}/fig-${n}/${c}/spec.json`))
    const current=folders.at(-1)
    const folder=`${scratch}/fig-${n}/${current}`
    const render=read(`${folder}/fig-${n}.render.json`)
    assert.equal(render.status,'pass')
    const observed=inspection.figures.find(f=>f.id===`fig-${n}`)
    const holds=observed.holds
    return {
      id:`fig-${n}`,status:holds.length?'AUTHOR-ONLY-TARGETED-HOLD':'AUTHOR-ONLY-CANDIDATE-FROZEN-NOT-INDEPENDENTLY-REVIEWED',
      original:bind(image(n)),mode:'deterministic',machineStatus:'PASS',
      authorBitmapInspected:observed.bitmapInspected,authorObservation:observed,
      sourceFidelityApproved:false,independentReviewStatus:'not-performed',promotable:false,holds,
      final:{spec:bind(`${folder}/spec.json`),svg:bind(`${folder}/fig-${n}.svg`),render:bind(`${folder}/fig-${n}.render.json`),bitmap:bind(`${folder}/fig-${n}.preview.png`),displayChecks:render.displayChecks},
      candidates:folders.map(c=>{
        const dir=`${scratch}/fig-${n}/${c}`
        return {candidate:c,files:fs.readdirSync(dir).sort().map(f=>bind(`${dir}/${f}`))}
      }),
      validationAndRenderReceipts:fs.readdirSync(`${evidence}/receipts`).filter(f=>f.startsWith(`fig-${n}-`)).sort().map(f=>bind(`${evidence}/receipts/${f}`)),
      contentRepairRounds:folders.includes('repair')?1:0,
      technicalRecoveryRounds:Number(folders.includes('technical'))+Number(folders.includes('runtime'))+Number(folders.includes('runtime2'))
    }
  })
  function allFiles(dir) {
    return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?allFiles(`${dir}/${e.name}`):[`${dir}/${e.name}`])
  }
  const all=[...allFiles(evidence),...allFiles(scratch)].sort()
  const held=figures.filter(f=>f.holds.length)
  const freezePath=`${evidence}/author-freeze.json`
  writeNew(freezePath,{
    schema:'STEMROBIN-181/figure-author-freeze@1',ticket:'STEMROBIN-181',batch:'D045',book:'9p',lesson:draft.id,
    frozenAt:new Date().toISOString(),workdir:cwd,role:'FIRST AUTHOR ONLY, not independent reviewer',
    status:held.length?'AUTHOR-ONLY-FROZEN-WITH-TARGETED-HOLDS-NOT-APPROVED':'AUTHOR-ONLY-FROZEN-NOT-INDEPENDENTLY-REVIEWED',
    scope:numbers.map(n=>`fig-${n}`),ownership:[scratch,evidence],
    context:bind(`${evidence}/context.json`),inventory:bind(`${evidence}/original-inventory.json`),
    authorConsistencyCheck:bind(`${evidence}/author-consistency-check.json`),
    authoritativeText:{draft:bind(draftPath),sourceLesson:bind(lessonPath),completeENHash:textSha(en),completeZHHash:textSha(zh),enBlocks:9,zhBlocks:9,completeENInEverySpec:true,completeZHInEverySpec:true,textUnchanged:true,affectedReview:bind(reviewPath),historicalFirstHOLD:bind(review.firstReview.path),effectiveCurrentSCI:'PASS-carried-forward',effectiveCurrentZHEN:'PASS-carried-forward',textReviewReruns:0},
    sourceConsumed:bind(consumedPath),runtime:{renderer:bind(runtime),recovery:bind(runtimeReceipt),copied:false,installed:false,edited:false},
    display:{purpose:'instructional',layout:'inline',maxWidthPx:640,widths:[331,334,358,640],minTextPx:16,labelFontPx:32},
    figures,hashBindingsToAllOwnedFilesBeforeFreeze:all.map(bind),
    retention:'Every first candidate, failure and receipt retained once in place; no duplicate evidence package.',
    counts:{figures:4,machinePass:4,authorFinalBitmapInspections:inspection.figures.filter(f=>f.bitmapInspected).length,targetedHeldFigures:held.length,targetedHolds:figures.reduce((sum,f)=>sum+f.holds.length,0),firstSpecs:4,contentRepairRounds:figures.reduce((sum,f)=>sum+f.contentRepairRounds,0),technicalRecoveryRounds:figures.reduce((sum,f)=>sum+f.technicalRecoveryRounds,0),validationAttempts:all.filter(f=>f.endsWith('-validate.json')).length,renderAttempts:all.filter(f=>f.endsWith('-render.json')&&f.includes('/receipts/')).length,originalImageViews:5,uniqueOriginalImages:4,firstNonfinalBitmapViews:1,finalBitmapViews:2,totalImageViews:8,batchImageLimit:8,contextImageLimit:24,paidCalls:0,modelCalls:0,spend:0,researchCalls:0,independentReviews:0,recordReviewCalls:0,promotions:0,databaseOperations:0,productEdits:0,indexEdits:0,meterEdits:0,gitCommands:1,gitMutations:0,cloudOperations:0,dependencyChanges:0,childTasks:0,interchatMessages:0,textEdits:0,textReviewReruns:0},
    deviations:context.deviations,
    imageViewUsage:inspection.imageViewUsage,
    formalHandoff:false,publicationApproved:false
  })
  console.log(JSON.stringify({status:read(freezePath).status,authorFreeze:bind(freezePath),counts:read(freezePath).counts}))
}
const action=process.argv[2]
if(action==='prepare') prepare()
else if(action==='render') console.log(JSON.stringify(renderFigure(Number(process.argv[3]),process.argv[4]||'first')))
else if(action==='verify') verify()
else if(action==='freeze') freeze()
else throw new Error('Expected prepare, render <figure> [first|repair], or freeze')
