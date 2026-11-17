import fs from 'node:fs'
import path from 'node:path'
import { A, T, card, read, hash, write } from './prepare.mjs'

const originalPath=path.join(T,'tmp/d044-10p-source120-123-author/work/10p/pages/0122/figures/fig-83.png')
const reviewPath=path.join(T,'tmp/d045-source120-123-review.json')
const currentRepair=path.join(T,'tmp/d046-n44-text-repair/repair-freeze.json')
const required=[
  [originalPath,'cec42cfeb8c8444a04e5556508b213cf47267bfef5c36d4a20c8caaf14ac0f1c'],
  [reviewPath,'312b9cfb05bac48a3f258c868e11f4452d9a609493b4e5361ac4d45edc10c774'],
  [currentRepair,'3dac48e44d85268eef06e8d8476dc47644fc137e2f3537884dc0e55663921472'],
]
for(const [p,expected] of required)if(hash(p)!==expected)throw new Error(`Changed authoritative input: ${p}`)
for(const b of read(path.join(A,'receipts/current-context-binding.json')).bindings)
  if(hash(b.original)!==b.sha256 || hash(b.snapshot)!==b.sha256)throw new Error(`Changed repaired context ${b.original}`)
const bind=p=>({path:path.join(A,p),sha256:hash(path.join(A,p))})
const geometry=read(path.join(A,'receipts/source-geometry-author-corrected-helper.json'))
const native=read(path.join(A,'receipts/native-final-author.json'))
const preview=read(path.join(A,'receipts/current-native-inspection.json'))
if(geometry.status!=='PASS'||native.status!=='PASS'||preview.status!=='PASS')throw new Error('Author evidence not passing')
const images=[
  {kind:'original-source',path:originalPath},
  {kind:'generated-material',path:path.join(A,'candidates/initial/wood.png')},
  {kind:'native-composite',path:path.join(A,'previews/repair-composite.png')},
  {kind:'separate-artwork',path:path.join(A,'candidates/repair/fig-83.artwork.png')},
  {kind:'separate-native-overlay',path:path.join(A,'previews/geometry-overlay.png')},
  {kind:'headed-native-product-fit-en-desktop',path:path.join(A,'previews/current-en-1440.png')},
  {kind:'headed-native-product-fit-en-mobile',path:path.join(A,'previews/current-en-390.png')},
  {kind:'headed-native-product-fit-zh-mobile',path:path.join(A,'previews/current-zh-390.png')},
].map((o,i)=>({sequence:i+1,...o,sha256:hash(o.path)}))
write('image-open-ledger.json',{
  limit:8,total:8,tool:'functions.view_image',opens:images,reopens:0,extraCrops:0,
  screenshotFilesCreated:4,screenshotFilesOpened:3,
  screenshotCapturesAndProgrammaticPixelDecodingNotLoadedAsImages:true,
  noFurtherImageOpens:true,
})
write('author-review.json',{
  schema:'ld-s10y-image/figure-author-review@1',ticket:'STEMROBIN-181',card,figure:'fig-83',
  status:'AUTHOR PASS',independentReview:false,reviewAt1Written:false,
  source:bind('inputs/source/fig-83.png'),spec:bind('frozen/fig-83.spec.json'),
  render:bind('frozen/fig-83.render.json'),currentText:bind('receipts/current-context-binding.json'),
  sourceInventory:bind('source-inventory.json'),
  sourceObservations:[
    'Two U forks, each two arms/rounded join/stem/mount, on two separate wooden boxes, comparable height and a visible air gap.',
    'The original hammer has a diagonal handle and transverse head, near the outer arm of the right fork with a visible gap.',
    'Original border/specks/stippling are scan styling and omitted. No source labels, measurements, arrows, clip or hand exist.',
    'Inward end aperture pixels are unclear. Facing openings are full-edition prose authority; author redraw clarifies that setup instead of claiming scan apertures were visually readable.',
  ],
  checks:[
    'Original PNG opened first; fresh inventory made before modern drawing.',
    'Source-geometry executable check: 18 PASS; five semantic mutations rejected.',
    'Wood generation is clean material only, no apparatus/text/effects. One generation call. No generation repair.',
    'Native overlay inspected separately; both forks and every box face/opening/hammer are deterministic.',
    'Native artwork inspected separately: only four contained texture patches. Black display outside patches is transparent alpha, not a black raster background; pixel check confirms transparency.',
    'Composite and native desktop640/mobile331 fit preserve recognizable forks, facing apertures and poised hammer; no clipping or incoherent overlap.',
    'Visible figure labels: zero. No invented measurement or answer-bearing annotation. Figure minTextPx=16, vacuous for unlabeled apparatus.',
    'Current repaired FULL ZH and EN context is hash-bound; original initial context and HOLD remain history.',
  ],
  native:bind('receipts/native-final-author.json'),
  headedInspection:bind('receipts/current-native-inspection.json'),
  geometry:bind('receipts/source-geometry-author-corrected-helper.json'),
  imageOpenCount:8,
  repair:{authorRepairs:1,geometryChanges:0,serializationRepair:1,contextOnlyRebind:1,helperCorrectionsNotGeometryRepairs:true},
  pending:['Parent affected independent SCI','Parent affected independent ZHEN','Independent modern figure review@1','Lesson edition finalize/assembly','Promotion/publication authorization'],
})
for(const file of ['wood.png','wood.png.json'])
  write(`frozen/${file}`,fs.readFileSync(path.join(A,'candidates/initial',file)))
write('frozen/figure-author-contract.json',{
  id:'fig-83',mode:'hybrid',artwork:'fig-83.artwork.png',svg:'fig-83.svg',
  render:'fig-83.render.json',spec:'fig-83.spec.json',review:null,
  status:'author-only',pendingReview:'Independent review@1 absent by user instruction; not promotable.',
  generationMetadata:'wood.png.json',
  noFlattenedPngDelivery:true,
})
const files=[]
function inventory(folder) {
  for(const entry of fs.readdirSync(folder,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    const p=path.join(folder,entry.name)
    if(entry.isDirectory()) {if(entry.name!=='runtime')inventory(p)}
    else files.push({path:p,sha256:hash(p),bytes:fs.statSync(p).size})
  }
}
inventory(A)
const outputs=['fig-83.spec.json','fig-83.svg','fig-83.artwork.png','fig-83.render.json','wood.png','wood.png.json','figure-author-contract.json']
  .map(f=>bind(`frozen/${f}`))
const receipts=[
  'native-spec-draft-initial.json','native-render-initial.json','native-spec-rendered-initial.json',
  'author-repair-1.json','native-spec-draft-repair.json','native-render-repair.json','native-spec-rendered-repair.json',
  'generation-initial.json','source-geometry-author.json','source-geometry-author-corrected-helper.json',
  'helper-initial-failures.json','overlay-initial-helper-fail.json','overlay-separated-author.json',
  'product-width-desktop.json','product-width-mobile.json','current-context-binding.json',
  'native-spec-current.json','native-context-current-en.json','native-context-current-zh.json',
  'offline-current-en.json','offline-current-zh.json','native-final-author.json','current-native-inspection.json',
].map(f=>bind(`receipts/${f}`))
const freeze=write('author-freeze.json',{
  schema:'ld-s10y-image/figure-author-freeze@1',ticket:'STEMROBIN-181',batch:'D029',
  card,figure:'fig-83',date:'2026-11-17',
  status:'AUTHOR PASS / native PASS / independent gates pending',
  source:bind('inputs/source/fig-83.png'),sourceRawIndependentPass:bind('inputs/source-review.json'),
  currentTextRepair:bind('inputs/current/repair-freeze.json'),
  currentText:[
    {language:'en',prose:bind('inputs/current/en/prose.md'),template:bind('inputs/current/en/lesson.template.json')},
    {language:'zh',prose:bind('inputs/current/zh/prose.md'),template:bind('inputs/current/zh/lesson.template.json')},
  ],
  sourceInventory:bind('source-inventory.json'),mode:'hybrid',purpose:'instructional',
  instructionalObjectsDeterministic:true,generatedSemanticMaterial:'wood grain only',
  outputs,receipts,authorReview:bind('author-review.json'),
  nativeStatus:'PASS',nativeSourceRelationshipAssertions:18,semanticNegativeControls:5,
  renderProvenance:{
    successfulNativeGeometryRuns:1,initialNativeRenderBlockedBeforeGeometry:1,
    noGeometryReplayForCurrentText:true,
    currentRenderReport:'Author-derived context rebind of original native PASS, explicitly marked in contextRebind. Original native report unchanged and hash-bound. No new renderer call claimed.',
    geometryUnchangedAfterInitialDrawing:true,generationCalls:1,
  },
  display:{layout:'inline',actualProductProbeWidths:[640,346],headedFullProseWidths:[640,331],
    viewportDesktop:[1440,960],viewportMobile:[390,844],minTextPx:16,visibleFigureLabels:0,
    scrollMedia:'Not applicable: inline',headlessProbe:true,headedProductFit:true,
    publicCardNotPublished:'Public n44 is empty; exact live product CSS/shell probed transiently and reproduced locally with native candidate and full current prose. No claim of published candidate.'},
  imageOpenLedger:bind('image-open-ledger.json'),imageOpenCount:8,imageOpenLimit:8,
  repairCount:1,geometryRepairCount:0,contextOnlyRebindCount:1,initialFailsPreserved:true,
  pendingGates:['Affected independent SCI','Affected independent ZHEN','Independent figure review@1','Edition finalize/assembly','Promotion/publication'],
  independentReviewAt1Written:false,promotion:false,fullCardApproval:false,publicationApproval:false,
  scope:{onlyOwnedDirectory:A,canonicalAppDepsToolsCharterWrites:0,gitOperations:0,
    databaseOperations:0,backendWrites:0,meterIndexWrites:0,otherChatWrites:0,
    inputPreservation:'Requested source PNG, independent source review, current repaired freeze and all repaired full text/template inputs verified. No global shared-worktree immutability claim.'},
  inventory:files,
})
console.log(JSON.stringify({freeze,sha256:hash(freeze),native:'PASS',author:'PASS',imageOpenCount:8,pending:true},null,2))
