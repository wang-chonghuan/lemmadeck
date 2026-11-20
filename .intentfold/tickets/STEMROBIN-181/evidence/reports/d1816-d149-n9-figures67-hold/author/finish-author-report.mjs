import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(),repo);
const home = path.join(repo,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d149-n9-figures-author');
const figureRoot = path.join(repo,'.tmp/STEMROBIN-181/d1816-d149/figures');
const read = p=>JSON.parse(fs.readFileSync(p,'utf8'));
const binding = p=>{
  const bytes=fs.readFileSync(p);
  return {path:p,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
};
const save = (p,value)=>fs.writeFileSync(p,`${JSON.stringify(value,null,2)}\n`,{flag:'wx'});
const reportPath=path.join(home,'report.json');
const freezePath=path.join(home,'author-freeze.json');
assert(!fs.existsSync(reportPath)&&!fs.existsSync(freezePath),'Terminal report already frozen');
const entry=read(path.join(home,'input-bindings.verified.json'));
const inputs=[entry.inputFreeze,...entry.bindings].map(expected=>{
  const actual=binding(expected.path);
  return {...actual,expectedSha256:expected.sha256,unchanged:actual.sha256===expected.sha256};
});
const findings=read(path.join(home,'author-findings.json'));
const filesUnder = directory=>{
  const files=[];
  for(const item of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    const p=path.join(directory,item.name);
    if(item.isDirectory())files.push(...filesUnder(p));
    else if(item.isFile())files.push(p);
  }
  return files;
};
const nativeDirectory=path.join(home,'native');
const receipts=filesUnder(nativeDirectory).filter(p=>path.basename(p)==='receipt.json').map(p=>({
  ...read(p),receipt:binding(p),
}));
assert(receipts.every(r=>r.name.startsWith('d149-')));
const failedReceipts=receipts.filter(r=>r.exitCode!==0);
const figures={};
for(const id of ['fig-06','fig-07']) {
  const directory=path.join(figureRoot,id,'candidate-2');
  const specPath=path.join(directory,'spec.json');
  const spec=read(specPath);
  const context=read(path.join(home,`${id}.input-context.json`));
  assert.equal(spec.source.authoritativeText[0].text,context.fullText.zh);
  assert.equal(spec.source.authoritativeText[1].text,context.fullText.en);
  const renderPath=path.join(directory,`${id}.render.json`);
  const render=read(renderPath);
  assert.equal(render.spec.sha256,binding(specPath).sha256);
  assert.equal(render.output.svg.sha256,binding(path.join(directory,`${id}.svg`)).sha256);
  const validationName=id==='fig-06'?'d149-fig06-validate-repair1':'d149-fig07-validate-repair1';
  figures[id]={
    status:findings.figures[id].status,
    authorReadyForIndependentReview:false,
    selectedCandidate:{
      directory,selectionPurpose:'Terminal retained candidate, not approved for independent-review handoff, promotion or publication',
      spec:binding(specPath),svg:binding(path.join(directory,`${id}.svg`)),
      render:binding(renderPath),preview:binding(path.join(directory,`${id}.preview.png`)),
    },
    validation:{
      status:read(path.join(nativeDirectory,validationName,'stdout.txt')).status,
      raw:binding(path.join(nativeDirectory,validationName,'stdout.txt')),
    },
    renderStatus:render.status,
    firstCandidate:binding(path.join(figureRoot,id,'candidate-1/spec.json')),
    inventoryMapping:binding(path.join(home,`${id}.inventory-mapping.json`)),
    contentRepair:binding(path.join(home,`${id}.content-repair-1.json`)),
    contentRepairs:1,
    findings:findings.figures[id],
    allCandidateOutputs:filesUnder(path.join(figureRoot,id)).map(binding),
  };
  if(id==='fig-06')figures[id].technicalPreview= binding(path.join(directory,'author-preview.metrics.json'));
}
const imageOpens=[
  {sequence:1,figure:'fig-06',kind:'original',path:read(path.join(home,'fig-06.input-context.json')).sourceImage.path},
  {sequence:2,figure:'fig-07',kind:'original',path:read(path.join(home,'fig-07.input-context.json')).sourceImage.path},
  {sequence:3,figure:'fig-06',kind:'source enlargement',path:path.join(figureRoot,'fig-06/preview/source-zoom.png')},
  {sequence:4,figure:'fig-07',kind:'rejected candidate preview',path:path.join(figureRoot,'fig-07/candidate-2/fig-07.preview.png')},
  {sequence:5,figure:'fig-06',kind:'terminal candidate preview',path:path.join(figureRoot,'fig-06/candidate-2/fig-06.preview.png')},
].map(open=>({...open,binding:binding(open.path)}));
const authoredNames=[
  'source-first-inventory.json','input-bindings.verified.json','fig-06.inventory-mapping.json','fig-07.inventory-mapping.json',
  'preflight-failure.json','run-native.mjs','author-specs.mjs','repair-fig06-once.mjs','repair-fig07-once.mjs',
  'fig-06.content-repair-1.json','fig-07.content-repair-1.json','preview-fig06.mjs','author-findings.json','finish-author-report.mjs',
];
const outputs=[
  ...['fig-06','fig-07'].flatMap(id=>filesUnder(path.join(figureRoot,id))),
  ...authoredNames.map(name=>path.join(home,name)),
  ...filesUnder(nativeDirectory),
].map(binding);
const constraints={
  ticket:'STEMROBIN-181',batch:'D149',lesson:'phy9-c1-s1-n9',book:'9p',
  invocation:'Same authorized parent invocation; no new IntentFold capability or checker loop started',
  finish:'review',grill:'self',independentReviewerOpen:false,
  onlyFigures:['fig-06','fig-07'],
  completeApprovedBilingualTextAuthoritative:true,
  sourceImagesOpenedBeforeDraftOrReuse:true,
  deterministicFigureSpec:'ld-s10y-image/figure-spec@2',
  validator:'.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  renderer:'.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  rendererEngine:'JSXGraph',labels:'English',colors:'semantic roles only',
  display:{purpose:'instructional',layout:'scroll',widths:[640],minTextPx:16},
  actualMobileContainerWidthCheckedForFig06:331,
  previewSurface:'Headless isolated exported SVG host; not native lesson or headed product acceptance',
  maximumActualImageOpens:8,maximumContextImageOpens:24,actualImageOpens:5,parentImageOpens:0,
  maximumContentRepairsPerFigure:1,contentRepairsPerFigure:{'fig-06':1,'fig-07':1},
  noQuantitativeCalibration:true,noParticleDeformation:true,
  remainingFiguresInspected:0,portraitsInspectedOrGenerated:0,
  sourcePagesOpened:0,sourceOrNativeAuthorReplay:0,scienceReviewsReplayed:0,textReviewsReplayed:0,
  independentApproval:false,recordReviewCalls:0,promotions:0,nativeFinalizers:0,
  lessonOrCarrierEdits:0,dbCalls:0,publisherCalls:0,paidCalls:0,modelOverrides:0,
  commitCalls:0,pushCalls:0,deployCalls:0,mergeCalls:0,closureCalls:0,supervisorOrPeerMessages:0,
  technicalPreviewRecoveryCalls:0,
  browsersClosed:true,
  nativeRunner:{
    path:path.join(home,'run-native.mjs'),
    derivedFrom:binding(path.join(repo,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d141-n8-figure-author/run-native.mjs')),
    adaptation:'Receipt home relocated to this authorized D149 report directory; D149 label prefix enforced. Existing output dirs and receipts are refused.',
  },
  writesRestrictedTo:[home,path.join(figureRoot,'fig-06'),path.join(figureRoot,'fig-07')],
  immutableInputBindingsUnchanged:inputs.every(b=>b.unchanged),
  noCheckerOrSvgEdited:true,
};
const status=constraints.immutableInputBindingsUnchanged?'AUTHOR_HOLD_REPAIR_LIMIT_NOT_READY_FOR_INDEPENDENT_REVIEW':'AUTHOR_HOLD_INPUT_BINDING_CHANGED';
const report={
  schema:'STEMROBIN-181/figure-author-report@1',batch:'D149',status,
  authoredAt:new Date().toISOString(),
  reportPath,authorFreezePath:freezePath,
  independentApproval:false,authorReadyForIndependentReview:false,
  summary:'Both requested deterministic candidates retained. Fig-06 native validation/render/technical preview pass but author source-wall-contact fidelity is held. Fig-07 repaired validation passes but render label-clearance fails. Both one-repair budgets are exhausted; no further content repair, checker replay, review record or promotion occurred.',
  inputs,sourceFirstInventory:binding(path.join(home,'source-first-inventory.json')),
  sourceInventoryErratum:findings.sourceInventoryErratum,
  sourceInventoryFinalFacts:{
    'fig-06':{subfigures:1,particles:14,filled:true,arrows:26,wallContacts:7,collisionJunctions:2,pistons:0},
    'fig-07':{subfigures:2,particlesPerPanel:[16,16],filled:false,arrows:0,pistons:2,rods:2},
  },
  figures,imageOpens,actualImageOpens:5,contentRepairsPerFigure:{'fig-06':1,'fig-07':1},
  failures:[
    {kind:'read-only diagnostic syntax failure',record:binding(path.join(home,'preflight-failure.json')),checkerStage:false},
    ...failedReceipts.map(r=>({kind:'native execution or content-check failure',receipt:r.receipt,name:r.name,exitCode:r.exitCode,stdout:binding(r.stdout.path),stderr:binding(r.stderr.path)})),
    {kind:'author visual source-fidelity hold',figure:'fig-06',record:binding(path.join(home,'author-findings.json'))},
    {kind:'source inventory aggregate count erratum',figure:'fig-06',firstInventoryPreserved:true,record:binding(path.join(home,'author-findings.json'))},
  ],
  nativeCalls:receipts.length,nativeReceipts:receipts.map(r=>r.receipt),
  explicitSpecValidations:4,rendererCalls:3,rendererInternalValidations:3,
  rendererInternalValidationNote:'The mandated renderer invokes its validator internally; these are not additional standalone checker replays.',
  constraints,outputs,
  nextRequiredAction:'Explicitly authorize further affected figure repair before changing these terminal candidates. Independent figure review and source-free native lesson integration remain unperformed; no approval is asserted.',
};
save(reportPath,report);
save(freezePath,{
  schema:'STEMROBIN-181/figure-author-freeze@1',batch:'D149',status,
  createdAt:new Date().toISOString(),report:binding(reportPath),
  inputFreeze:binding(path.join(home,'input-freeze.json')),
  expectedInputFreezeSha256:'3ec39d874b9cdac9538fa748f8d205c17eb279986c8b49605fd5988ef5727773',
  actualInputs:inputs,outputs:[...outputs,binding(reportPath)],
  selectedCandidates:Object.fromEntries(Object.entries(figures).map(([id,f])=>[id,{status:f.status,...f.selectedCandidate}])),
  actualImageOpens:5,imageOpens,contentRepairsPerFigure:{'fig-06':1,'fig-07':1},
  allFailures:report.failures,constraints,
  independentApproval:false,promotionAuthorized:false,
  freezeSelfHashExcluded:'Self hashing is impossible; the actual freeze hash is printed with the final execution result.',
});
console.log(JSON.stringify({status,report:binding(reportPath),authorFreeze:binding(freezePath),actualImageOpens:5,contentRepairsPerFigure:constraints.contentRepairsPerFigure,inputsUnchanged:constraints.immutableInputBindingsUnchanged,outputBindings:outputs.length}));
