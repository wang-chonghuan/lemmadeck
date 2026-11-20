import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const repo='/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root=path.dirname(fileURLToPath(import.meta.url));
const input=path.join(repo,'.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author-inputs-01');
const manifest=JSON.parse(fs.readFileSync(path.join(input,'manifest.json')));
const bind=absolute=>{
  const bytes=fs.readFileSync(absolute);
  return{path:path.relative(repo,absolute),sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
};
const local=name=>bind(path.join(root,name));
const put=(name,value)=>fs.writeFileSync(path.join(root,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const before=JSON.parse(fs.readFileSync(path.join(root,'bindings-before.json')));
const after=JSON.parse(fs.readFileSync(path.join(root,'bindings-after.json')));
assert.equal(after.status,'MATCH');
assert.deepEqual(before.outputs,after.outputs);
assert.deepEqual(before.FIRSTs,after.FIRSTs);
const holds=JSON.parse(fs.readFileSync(path.join(root,'inherited-holds.json')));
const observations=JSON.parse(fs.readFileSync(path.join(root,'author-observations.json')));
const geometryBindings=[];
const figures=manifest.figures.map(figure=>{
  const id=figure.id, stem=`${id}.REPAIR1`;
  const spec=JSON.parse(fs.readFileSync(path.join(root,`${stem}.spec.json`)));
  const render=JSON.parse(fs.readFileSync(path.join(root,`${stem}.render.json`)));
  const snapshot=JSON.parse(fs.readFileSync(path.join(root,`${stem}.snapshot.json`)));
  const repair=JSON.parse(fs.readFileSync(path.join(root,`${stem}.repair-receipt.json`)));
  const failedRender=JSON.parse(fs.readFileSync(path.join(root,`${id}.FIRST.render.json`)));
  assert.equal(failedRender.status,'fail');
  assert.equal(render.status,'pass');
  assert.equal(snapshot.status,'AUTHOR_SNAPSHOT_MECHANICAL_SATISFIED');
  assert.equal(repair.contentRepairCounter,1);
  assert.equal(render.spec.sha256,local(`${stem}.spec.json`).sha256);
  assert.equal(render.output.svg.sha256,local(`${stem}.svg`).sha256);
  assert.deepEqual(snapshot.image,local(`${stem}.widths-480-300.png`));
  assert.equal(observations.figures.find(f=>f.id===id).authorState,'USABLE_AUTHOR_DRAFT');
  const mapping=JSON.parse(fs.readFileSync(path.join(root,`${id}.relationship-mapping.json`)));
  const circle=spec.objects.find(o=>o.id===(id==='fig-g10-89'?'outer-outline':'right-outline'));
  assert.deepEqual(circle.center,[mapping.sphere.center[0],spec.canvas.height-mapping.sphere.center[1]]);
  assert.equal(circle.radius,mapping.sphere.radius);
  const ellipse=mapping.externalAssertions.find(a=>a.type==='ellipseHalfPaths');
  assert.deepEqual(ellipse.center,mapping.sphere.center);
  assert.equal(ellipse.rx,circle.radius);
  geometryBindings.push({
    id, check:'Actual silhouette circle matches declared projection and ellipse endpoints on its left/right outline; no guessed silhouette incidence for spatial surface marks.',
    status:'AUTHOR_BINDING_SATISFIED', circle:circle.id, center:circle.center, radius:circle.radius,
    ellipseEndpointScreenCoordinates:[[ellipse.center[0]-ellipse.rx,ellipse.center[1]],[ellipse.center[0]+ellipse.rx,ellipse.center[1]]],
    geometryMappingReplayed:false, semanticApproval:false
  });
  const inherited=[];
  for(const value of Object.values(holds.originalSourceHolds))if(Array.isArray(value))for(const hold of value)inherited.push({...hold,status:hold.status||'HOLD'});
  return{
    id,source:bind(figure.sourceImage.path),FIRST:local(`${id}-FIRST.json`),
    current:{spec:local(`${stem}.spec.json`),svg:local(`${stem}.svg`),render:local(`${stem}.render.json`),image:local(`${stem}.widths-480-300.png`)},
    contentRepairCounter:1,status:'AUTHOR_DRAFT_USABLE_INDEPENDENT_APPROVAL_PENDING',
    holds:[...inherited,{id:'H-AUTHOR-NOT-INDEPENDENT-APPROVAL',status:'HOLD',reason:'Independent modern-figure content review, integration, promotion and publication are not performed or authorized.'}],
    authorNative:{validation:'pass',render:'pass',snapshot:'AUTHOR_SNAPSHOT_MECHANICAL_SATISFIED',displayWidths:[480,300],minimumActualTextPx:Math.min(...snapshot.measurements.map(m=>m.minFontPx))},
    independentContentApproval:'NOT_PERFORMED',semanticApproval:false,promoted:false,published:false,
    failedFIRST:{spec:local(`${id}.FIRST.spec.json`),svg:local(`${id}.FIRST.svg`),render:local(`${id}.FIRST.render.json`),command:local(`${id}.FIRST.render.command.json`),status:'FAIL_NOT_CURRENT'},
    repairReceipt:local(`${stem}.repair-receipt.json`),snapshotReceipt:local(`${stem}.snapshot.json`),
    relationshipMapping:local(`${id}.relationship-mapping.json`),retainedGeometryReceipt:local(`${id}.FIRST.relationship-receipt.json`)
  };
});
put('geometry-bindings-receipt.json',{schema:'author-final-geometry-bindings@1',checks:geometryBindings,independentReview:false,semanticApproval:false});
const events=[
  ...manifest.figures.map((figure,i)=>({ordinal:i+1,tool:'functions.view_image',kind:'original',figure:figure.id,binding:bind(figure.sourceImage.path),units:1,openedOnce:true,phase:'blind BEFORE all complete material'})),
  ...figures.map((figure,i)=>({ordinal:i+3,tool:'functions.view_image',kind:'desktop-mobile-contact-sheet',figure:figure.id,binding:figure.current.image,renderings:[{width:480,units:1},{width:300,units:1}],units:2,openedOnce:true,phase:'REPAIR1 author inspection'}))
];
put('image-ledger.json',{
  schema:'bounded-image-unit-ledger@1',ticket:'STEMROBIN-188',assignment:'SAME188-6',events,
  counts:{originals:2,contactSheets:2,contactSheetRenderingUnits:4,crops:0,reopens:0,failedImageToolAttempts:0,diagnosticImageUnits:0,batchImageUnits:6,contextImageUnits:6,parentImageUnits:0,maxBatchImageUnits:8,maxContextImageUnits:24,unusedRepairDiagnosticReserve:2},
  nativeRenderFailures:2,nativeRenderFailuresLoadedAsImages:0,
  technicalBindingFailureImageUnits:0,generatedSnapshotsLoadedBySnapshotCommand:0,
  rule:'Each inspected double-width sheet counts TWO image units. No original, crop or contact-sheet reopen occurred.',
  contextFreshAtIntake:true,budgetNotReset:true
});
const stageReceipts=fs.readdirSync(root).filter(n=>n.endsWith('.command.json')).sort().map(name=>({binding:local(name),...JSON.parse(fs.readFileSync(path.join(root,name)))}));
put('commands.json',{
  schema:'bounded-author-command-ledger@1',cwd:repo,
  orchestrationCommands:[
    {command:['node','.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author/bindings.mjs','before'],exitCode:1,classification:'TECHNICAL_PATH_RESOLUTION_FAULT',receipt:local('bindings.FIRST-EXECUTION-FAULT.json')},
    {command:['node','.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author/bindings.mjs','before'],exitCode:0,receipt:local('bindings-before.json')},
    {command:['node','.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author/make-specs.mjs'],exitCode:0},
    {command:['node','.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author/make-repair.mjs'],exitCode:0,phase:'After both FIRST native render failures; before REPAIR1 validation/render.'}
  ],
  sealReceipt:local('FIRST-seal-receipt.json'),stages:stageReceipts,
  postNative:[{command:['node','.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author/bindings.mjs','after'],exitCode:0,receipt:local('bindings-after.json')}],
  semanticApproval:false,paidCalls:0,modelCalls:0,dbOperations:0,publicationOperations:0,gitWrites:0,descendantsCreated:0,
  nativeReplay:'One explicit draft-validation and one render invocation per actual draft; renderer built-in validation disclosed in receipts. Passed geometry mapping retained after label-only repair, not replayed.',
  writeScope:path.relative(repo,root),allExecSessionsSettled:true
});
put('author-result.json',{
  schema:'bounded-modern-figure-author-result@1',ticket:'STEMROBIN-188',assignment:'SAME188-6',book:'9-10g',lesson:'geo910-c2-s3-n62',
  status:'AUTHOR_DRAFTS_ONLY_INDEPENDENT_APPROVAL_PENDING',figures,
  FIRSTSealReceipt:local('FIRST-seal-receipt.json'),bindingsBefore:local('bindings-before.json'),bindingsAfter:local('bindings-after.json'),
  imageLedger:local('image-ledger.json'),commands:local('commands.json'),observations:local('author-observations.json'),inheritedHolds:local('inherited-holds.json'),
  textState:'Existing independent semanticPASS for20 objects/34 exact math spans reused unchanged; no edits/rechecks/flow/native source reruns.',
  sourceHolds:'ALL_INHERITED_HOLDS_RETAINED_UNCHANGED',imageUnits:6,modelOrPaidCalls:0,independentContentApproval:false,promoted:false,published:false
});
const outputs=fs.readdirSync(root,{recursive:true,withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>path.join(entry.parentPath,entry.name)).filter(file=>path.basename(file)!=='output-index.json').sort().map(bind);
put('output-index.json',{schema:'bounded-author-output-index@1',outputs});
console.log(JSON.stringify({figures:figures.map(f=>({id:f.id,status:f.status,contentRepairCounter:f.contentRepairCounter})),outputs:outputs.length,imageUnits:6,outputIndex:bind(path.join(root,'output-index.json'))}));
