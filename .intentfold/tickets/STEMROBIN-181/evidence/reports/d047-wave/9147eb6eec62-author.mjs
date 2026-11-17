import fs from 'node:fs'
import path from 'node:path'
import { A, W, card, hash, read, write, command } from './prepare.mjs'

const folder = 'candidates/initial'
const objects = []
const assertions = []
const point = (x, screenY) => [x, 400 - screenY]
const polygon = (id, points, fill = 'paper', opacity = 1) => {
  const o = { id, type: 'polygon', points: points.map(p => point(...p)), stroke: 'ink', strokeWidth: 2.8, fill, fillOpacity: opacity }
  objects.push(o)
  return o
}
const segment = (id, from, to, width = 9, stroke = 'muted') => {
  const o = { id, type: 'segment', from: point(...from), to: point(...to), stroke, strokeWidth: width }
  objects.push(o)
  return o
}
const imageRatio = 1536 / 1024
for (const [name, x] of [['left', 70], ['right', 500]]) {
  for (let i = 0; i < 2; i++) objects.push({
    id: `${name}-wood-${i + 1}`, type: 'image', asset: 'wood-material',
    at: [x + 95 * i, 55 + (70 - 95 / imageRatio) / 2],
    size: [95, 95 / imageRatio], opacity: 0.8,
  })
}
for (const [name, x] of [['left', 70], ['right', 500]]) {
  polygon(`${name}-box-front`, [[x,275],[x+190,275],[x+190,345],[x,345]], 'paper', 0)
  const top = name === 'left'
    ? [[70,275],[95,235],[285,235],[260,275]]
    : [[475,235],[665,235],[690,275],[500,275]]
  polygon(`${name}-box-top`, top, 'grid', 0.75)
  const end = name === 'left'
    ? [[260,275],[285,235],[285,305],[260,345]]
    : [[475,235],[500,275],[500,345],[475,305]]
  polygon(`${name}-box-inward-end`, end, 'muted', 0.15)
  const opening = name === 'left'
    ? [[267,279],[279,251],[279,301],[267,329]]
    : [[481,251],[493,279],[493,329],[481,301]]
  polygon(`${name}-box-opening`, opening, 'ink', 0.85)
}
const forks = {}
for (const [name, x] of [['left',174], ['right',594]]) {
  const arm1 = segment(`${name}-fork-inner-arm`, [x + (name === 'left' ? 18 : -18), 90], [x + (name === 'left' ? 18 : -18),194])
  const arm2 = segment(`${name}-fork-outer-arm`, [x + (name === 'left' ? -18 : 18),90], [x + (name === 'left' ? -18 : 18),194])
  const join = {
    id: `${name}-fork-u-join`, type: 'arc',
    center: point(x,194), start: point(x-18,194), end: point(x+18,194),
    stroke: 'muted', strokeWidth: 9,
  }
  objects.push(join)
  const stem = segment(`${name}-fork-stem`, [x,212], [x,241], 9)
  objects.push({
    id: `${name}-fork-mount`, type: 'circle', center: point(x,241),
    radius: 8, stroke: 'ink', strokeWidth: 2.5, fill: 'muted', fillOpacity: 1,
  })
  forks[name] = { arm1, arm2, join, stem }
}
const head = polygon('hammer-head', [[636,140],[640,132],[669,145],[665,153]], 'muted', 1)
const handle = segment('hammer-handle', [652,142], [686,58], 6, 'ink')
assertions.push(
  { id:'two-u-joins',type:'objectCount',objectType:'arc',count:2 },
  { id:'two-mounts',type:'objectCount',objectType:'circle',count:2 },
  { id:'apparatus-faces',type:'objectCount',objectType:'polygon',count:9 },
  { id:'apparatus-strokes',type:'objectCount',objectType:'segment',count:7 },
  { id:'wood-material-panels',type:'objectCount',objectType:'image',count:4 },
  { id:'identical-arm-length',type:'equalDistance',
    a:forks.left.arm1.from,b:forks.left.arm1.to,c:forks.right.arm1.from,d:forks.right.arm1.to },
  { id:'left-arms-same-length',type:'equalDistance',
    a:forks.left.arm1.from,b:forks.left.arm1.to,c:forks.left.arm2.from,d:forks.left.arm2.to },
  { id:'right-arms-same-length',type:'equalDistance',
    a:forks.right.arm1.from,b:forks.right.arm1.to,c:forks.right.arm2.from,d:forks.right.arm2.to },
  { id:'left-parallel-arms',type:'parallel',
    a:forks.left.arm1.from,b:forks.left.arm1.to,c:forks.left.arm2.from,d:forks.left.arm2.to },
  { id:'right-parallel-arms',type:'parallel',
    a:forks.right.arm1.from,b:forks.right.arm1.to,c:forks.right.arm2.from,d:forks.right.arm2.to },
  { id:'identical-stems',type:'equalDistance',
    a:forks.left.stem.from,b:forks.left.stem.to,c:forks.right.stem.from,d:forks.right.stem.to },
)
const inventory = []
for (const name of ['left','right']) {
  inventory.push({
    id: `source-${name}-fork`,
    description: `${name} U-shaped fork: two arms, lower join, stem and foot on its own box. Same-design pair; upright congruence is modern regularization, not a pixel measurement.`,
    objects: ['inner-arm','outer-arm','u-join','stem','mount'].map(s => `${name}-fork-${s}`),
    assertions: [name === 'left' ? 'left-arms-same-length' : 'right-arms-same-length',
      name === 'left' ? 'left-parallel-arms' : 'right-parallel-arms','identical-arm-length','identical-stems','two-u-joins','two-mounts'],
  })
  inventory.push({
    id: `source-${name}-box`,
    description: `${name} wooden resonance box beneath its fork. Top, long front and short inward end. Clarified inward opening comes from full ZH/EN prose; it is not a clearly readable aperture in the 457x305 scan.`,
    objects: ['front','top','inward-end','opening'].map(s => `${name}-box-${s}`),
    assertions: ['apparatus-faces'],
  })
}
inventory.push({
  id:'source-hammer',description:'One small diagonal-handled hammer above/right of right fork, transverse head near its outer arm, no hand, visible gap.',
  objects:['hammer-head','hammer-handle'],assertions:['apparatus-strokes'],
})
inventory.push({
  id:'source-separated-pair',description:'Two separate side-by-side assemblies at comparable height; no connector. Exact support, inward-end facing and gap are additionally checked by helpers/assert-source.mjs from rendered object geometry, not counts.',
  objects:['left-box-inward-end','right-box-inward-end','left-box-opening','right-box-opening'],
  assertions:['identical-arm-length'],
})
write(`${folder}/fig-83.spec.json`, {
  schema:'ld-s10y-image/figure-spec@2',id:'fig-83',mode:'hybrid',
  description:'Two identical tuning forks on separate wooden resonance boxes with their openings facing each other; a small hammer is poised near one arm of the right fork. Inspect apparatus setup for sound resonance without displaying the result or the later clip experiment.',
  source:{
    image:{path:path.join(A,'inputs/source/fig-83.png'),sha256:hash(path.join(A,'inputs/source/fig-83.png'))},
    authoritativeText:['FULL EN:\n'+fs.readFileSync(path.join(A,'inputs/en/prose.md'),'utf8'),
      'FULL ZH:\n'+fs.readFileSync(path.join(A,'inputs/zh/prose.md'),'utf8')].join('\n\n'),
    inventory,
  },
  canvas:{width:800,height:400,boundingBox:[0,400,800,0],background:'transparent'},
  display:{layout:'inline',purpose:'instructional',minTextPx:16,maxWidthPx:640,widths:[640,480,358,342,331]},
  assets:[{id:'wood-material',path:path.join(A,folder,'wood.png'),metadata:path.join(A,folder,'wood.png.json'),role:'artwork'}],
  objects,assertions,layout:{minLabelGap:8,avoidRegions:[]},
})
command('native-spec-draft-initial','python3',[
  path.join(W,'.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
  path.join(A,folder,'fig-83.spec.json'),'--stage','draft','--json',
])
command('native-render-initial','node',[
  path.join(W,'.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  '--spec',path.join(A,folder,'fig-83.spec.json'),
  '--svg',path.join(A,folder,'fig-83.svg'),
  '--artwork',path.join(A,folder,'fig-83.artwork.png'),
  '--png',path.join(A,'previews/initial-composite.png'),
  '--report',path.join(A,folder,'fig-83.render.json'),
])
command('native-spec-rendered-initial','python3',[
  path.join(W,'.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
  path.join(A,folder,'fig-83.spec.json'),'--stage','rendered','--json',
])
for (const language of ['zh','en']) {
  const contentRoot = `context/${language}/root/10p/editions/modern-us-neutral`
  for (const file of ['fig-83.spec.json','fig-83.svg','fig-83.artwork.png','fig-83.render.json']) {
    write(`${contentRoot}/figures/${file}`,fs.readFileSync(path.join(A,folder,file)))
  }
  const figureTemplate = read(path.join(A,`inputs/${language}/figures.template.json`))
  write(`context/${language}/figure-author-contract.json`, {
    schema:'ld-s10y-image/author-contract@1',id:'fig-83',mode:'hybrid',
    artwork:path.join(A,folder,'fig-83.artwork.png'),svg:path.join(A,folder,'fig-83.svg'),
    render:path.join(A,folder,'fig-83.render.json'),spec:path.join(A,folder,'fig-83.spec.json'),
    review:null,reviewGate:'PENDING independent review@1; no author substitution',
    originalTemplate:figureTemplate,
  })
  command(`offline-render-${language}-initial`,'node',[
    path.join(W,'.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
    path.join(A,`context/${language}/root/10p`),'--edition','modern-us-neutral',
    '--lesson',card,'--out',path.join(A,`previews/native-${language}`),
  ])
}
