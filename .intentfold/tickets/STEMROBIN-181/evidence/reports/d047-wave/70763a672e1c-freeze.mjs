import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = path.dirname(fileURLToPath(import.meta.url))
const D = `${O}/attempts/initial`
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({path:p,sha256:sha(p),bytes:fs.statSync(p).size})
const read = p => JSON.parse(fs.readFileSync(p,'utf8'))
function write(name,data) {
  const target = path.resolve(O,name)
  assert(target.startsWith(`${O}/`))
  fs.mkdirSync(path.dirname(target),{recursive:true})
  fs.writeFileSync(target,`${JSON.stringify(data,null,2)}\n`,{flag:'wx'})
  return bind(target)
}
const spec = read(`${D}/fig-70.spec.json`)
const render = read(`${D}/fig-70.render.json`)
const state = read(`${O}/build-state.json`)
const inputs = read(`${O}/context/input-bindings.json`)
const inventory = read(`${O}/source-inventory.json`)
const geometry = read(`${O}/checks/initial-native-geometry.json`)
const display = read(`${O}/checks/initial-actual-display.json`)
const pixels = read(`${O}/checks/initial-pixels.json`)
assert.equal(render.status,'pass')
assert.equal(geometry.status,'pass')
assert.equal(display.status,'pass')
assert.equal(pixels.status,'pass')
assert.equal(geometry.coveredSourcePoints,108)
assert.equal(render.spec.sha256,sha(`${D}/fig-70.spec.json`))
assert.equal(render.output.svg.sha256,sha(`${D}/fig-70.svg`))
assert.equal(inventory.source.sha256,sha(inventory.source.path))
for (const entry of inputs.inputs) {
  assert.equal(sha(entry.original.path),entry.original.sha256)
  assert.equal(sha(entry.snapshot.path),entry.snapshot.sha256)
}
for (const tool of state.sharedTools) assert.equal(sha(tool.path),tool.sha256)
for (const entry of pixels.outputs) assert.equal(sha(entry.path),entry.sha256)
const command = spawnSync('python3',
  [`${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
    'fig-70.spec.json','--stage','rendered','--json'],
  {cwd:D,encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}})
write('commands/initial-rendered-stage-validation.json',{
  executable:'python3',args:[
    `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
    'fig-70.spec.json','--stage','rendered','--json'],
  cwd:D,exitCode:command.status,stdout:command.stdout,stderr:command.stderr,
})
assert.equal(command.status,0,command.stdout+command.stderr)
const imageOpens = [
  {index:1,path:inventory.source.path,role:'Fresh exact original before any inventory'},
  {index:2,path:`${O}/source-upper-detail.png`,role:'Source rows b/c/d arrows and point inspection'},
  {index:3,path:`${O}/source-lower-detail.png`,role:'Source rows e/f arrows and exact lambda endpoints'},
  {index:4,path:`${D}/fig-70.native.png`,role:'Actual native 1280x3060 raster review'},
  {index:5,path:`${O}/preview/initial/media-640.png`,role:'Actual headed 640px media-width review'},
  {index:6,path:`${O}/preview/initial/mobile-390-left.png`,role:'Actual 390px viewport, left end'},
  {index:7,path:`${O}/preview/initial/mobile-390-end.png`,role:'Actual 390px viewport, horizontal right end'},
].map(entry=>({...entry,sha256:sha(entry.path)}))
assert(imageOpens.length<=8 && imageOpens.length<=24)
const review = write('fig-70.author-review.json',{
  schema:'ld-s10y-image/bounded-author-review@1',figure:'fig-70',
  status:'AUTHOR-PASS-INDEPENDENT-APPROVAL-PENDING',authorOnly:true,
  reviewedAt:new Date().toISOString(),source:bind(inventory.source.path),
  spec:bind(`${D}/fig-70.spec.json`),render:bind(`${D}/fig-70.render.json`),
  outputs:{svg:bind(`${D}/fig-70.svg`),nativePreview:bind(`${D}/fig-70.native.png`)},
  inventory:bind(`${O}/source-inventory.json`),nativeGeometry:bind(`${O}/checks/initial-native-geometry.json`),
  actualDisplay:bind(`${O}/checks/initial-actual-display.json`),pixels:bind(`${O}/checks/initial-pixels.json`),
  sourceComparison:{
    fullOriginalOpenedBeforeInventory:true,sixRowsInExactOrder:true,
    all108BallPositionsIndependentlyTranscribed:true,all41VelocityArrowsRetained:true,
    all39DisplacementGuidesRetained:true,
    reachedFrontBalls:[1,4,7,10,13,16],tailHasNoSpuriousMotion:true,
    orderedNumbersPerRow:Array.from({length:18},(_,i)=>i+1),
    panelLetterMap:[['\u0430','a'],['\u0431','b'],['\u0432','c'],
      ['\u0433','d'],['\u0434','e'],['\u0435','f']],
    timestamps:['0','T/4','T/2','3T/4','T','5T/4'],
    originalGivenLambdaSpans:[['e',1,13],['f',2,14],['f',3,15]],
    originalUnlabeledAmplitudeDimensionPreservedWithoutAddingA:true,
    noOriginalGrid:true,noLongitudinalFigureComponents:true,
    noAnswerKeyRead:true,noAddedAdjacentPhaseAnswer:true,
    intermediateCoordinateAndArrowLengthRectificationDeclaredSeparately:true,
    numberOffsetsModernizedWithoutChangingNumberToDotAssociation:true,
    textLeftwardMotion:'Unlabelled overhead transverse direction: source upward page direction corresponds to the referenced leftward displacement in n39. No physical up/down axis was added.',
  },
  visualFindings:{
    nativeAnd640AndMobileEndsActuallyOpened:true,
    legible:true,labelsDoNotCollide:true,noCyrillicVisible:true,noAddedAnswerLabel:true,
    viewportMediaWidthPx:640,minimumScreenTextPx:17,mobileViewportWidthPx:390,
    mobileVisibleContainerWidthPx:358,horizontalEndPx:282,horizontalMaxPx:282,
    allSixFinalBall18AndTimestampLabelsReachable:true,
    noBlackRaster:true,displayHeightPx:1530,
  },
  counts:inventory.counts,imageOpens,imageOpenCount:imageOpens.length,
  actualFailureRetained:bind(`${O}/commands/initial-preview-check-failure.json`),
  failureClassification:'Inspection harness field error; no figure failure, spec/SVG unchanged',
  figureAttempts:1,targetedFigureRepairsUsed:0,authorEvidenceHarnessCorrections:1,
  independentScienceReview:false,independentBilingualReview:false,
  independentFigureReview:false,fullCardApproval:false,formalCap4ReviewRecorded:false,
  promotable:false,canonicalPromotionPerformed:false,
  unresolvedGates:[
    'Independent hash-bound SCI/figure review of source fidelity and declared modern rectification.',
    'Independent approval of complete current n38/n39 bilingual prose; current text freezes are author inputs, not approval.',
    'The supplied n38 freeze records native English figure-number signature FAILs and not-revalidated shared-tool drift; this figure-only author run does not resolve or revalidate those prose gates.',
    'Authoritative offline/product lesson acceptance and final figure binding for both courses, including n39 exercise 6, were not run in this bounded author scope.',
    'No durable asset promotion or canonical lesson edits were authorized.',
  ],
})
function files(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => {
    const p=path.join(directory,entry.name)
    return entry.isDirectory()?files(p):[p]
  })
}
const artifacts = files(O).filter(p=>!p.endsWith('/author-freeze.json') && !p.endsWith('/result.json')).sort().map(bind)
const freeze = write('author-freeze.json',{
  schema:'ld-s10y-image/bounded-figure-author-freeze@1',
  ticket:'STEMROBIN-181',book:'10p',figure:'fig-70',
  cards:['phy10-c1-s5-n38','phy10-c1-s5-n39'],
  frozenAt:new Date().toISOString(),
  status:'AUTHOR-FROZEN-NATIVE-PASS-INDEPENDENT-GATES-PENDING',
  ownedAbsoluteRoot:O,authorOnly:true,source:bind(inventory.source.path),
  sourceInventory:bind(`${O}/source-inventory.json`),
  authoritativeText:{
    n38Freeze:bind(`${O}/context/n38/author-freeze.json`),
    n39SoleRepairFreeze:bind(`${O}/context/n39/repair-freeze.json`),
    completeBothCoursesAndLanguages:true,unchangedRawQuestionCount:6,
    allInputSnapshots:inputs.inputs,oldN39TextRetainedOnlyAsHistory:true,
    currentContexts:['zh','en'].map(l=>bind(`${O}/context/current/${l}/native-context.json`)),
    inputGateStatuses:{
      n38:read(`${O}/context/n38/author-freeze.json`).status,
      n38NativeText:read(`${O}/context/n38/author-freeze.json`).nativeTextStatus,
      n38CurrentCompatibility:read(`${O}/context/n38/author-freeze.json`).currentNativeCompatibility,
      n39:read(`${O}/context/n39/repair-freeze.json`).status,
      nativeTextRevalidatedByThisFigureRun:false,
    },
  },
  counts:inventory.counts,relations:{
    totalAssertions:spec.assertions.length,sourcePointCoverage:geometry.coverage,
    sourcePointsCoveredWhollyWithinOwnRow:108,fronts:[1,4,7,10,13,16],
    equalPhaseScope:inventory.equalPhaseScope,exactGivenLambdaEndpoints:inventory.lambdaSpans,
    sourceGridAbsent:true,modernRectification:inventory.modernRectification,
  },
  figureSpec:bind(`${D}/fig-70.spec.json`),svg:bind(`${D}/fig-70.svg`),
  native:bind(`${D}/fig-70.native.png`),render:bind(`${D}/fig-70.render.json`),authorReview:review,
  nativeChecks:[bind(`${O}/checks/initial-native-geometry.json`),
    bind(`${O}/commands/initial-spec-validation.json`),bind(`${O}/commands/initial-rendered-stage-validation.json`)],
  previewChecks:bind(`${O}/checks/initial-actual-display.json`),
  previews:pixels.outputs.map(p=>bind(p.path)),pixelChecks:bind(`${O}/checks/initial-pixels.json`),
  renderer:render.renderer,patternsReused:state.patternsReused,sharedToolBindings:state.sharedTools,
  figureAttemptCount:1,initialAttemptRetained:true,figureRepairsUsed:0,
  figureRepairsAllowed:1,secondRepairForbidden:true,
  authorEvidenceHarnessFailure:bind(`${O}/commands/initial-preview-check-failure.json`),
  harnessCorrectionCount:1,noFigureMutationAfterFirstRender:true,
  imageOpens,imageOpenCount:7,imageOpenBatchLimit:8,imageContextLimit:24,
  imageCountScope:'Images opened into this context, including original, crops and previews; no images reopened.',
  independentApproval:false,SCI:false,ZHEN:false,fullCardApproval:false,
  formalReviewPassIssued:false,figurePromotable:false,promotionPerformed:false,
  preservedAllBoundInputsRehashed:true,
  boundaries:{gitOperations:0,backendOperations:0,databaseOperations:0,
    otherChatMessages:0,appOperations:0,sharedToolEdits:0,charterEdits:0,
    canonicalEdits:0,dependencySetup:0,writesOutsideOwnedRoot:0,
    isolatedHeadedNativePreviewOnly:true},
  unresolvedGates:read(review.path).unresolvedGates,artifacts,
})
const result=write('result.json',{
  status:'AUTHOR-FROZEN-NATIVE-PASS-INDEPENDENT-GATES-PENDING',authorFreeze:freeze,
  source:bind(inventory.source.path),sourceInventory:bind(`${O}/source-inventory.json`),
  counts:inventory.counts,outputs:{spec:bind(`${D}/fig-70.spec.json`),
    svg:bind(`${D}/fig-70.svg`),native:bind(`${D}/fig-70.native.png`),
    render:bind(`${D}/fig-70.render.json`),review},
  nativeGeometry:bind(`${O}/checks/initial-native-geometry.json`),
  previews:pixels.outputs.map(p=>bind(p.path)),actualDisplay:bind(`${O}/checks/initial-actual-display.json`),
  imageOpens:7,figureRepairs:0,harnessCorrections:1,
  unresolvedGates:read(review.path).unresolvedGates,
})
console.log(JSON.stringify({authorFreeze:freeze,result,counts:inventory.counts,
  outputs:read(result.path).outputs,previews:read(result.path).previews,imageOpens:7,
  status:read(freeze.path).status},null,2))
