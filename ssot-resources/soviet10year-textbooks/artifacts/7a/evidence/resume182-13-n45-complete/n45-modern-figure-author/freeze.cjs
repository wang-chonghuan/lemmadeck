const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root='/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const own=path.join(root,'.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-modern-figure-author');
const final=path.join(own,'FINAL');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,d)=>{
  assert(p.startsWith(own+'/'));assert(!fs.existsSync(p),'Never overwrite frozen evidence');
  fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
};
const bind=p=>{
  const b=fs.readFileSync(p);
  return {path:p,sha256:hash(p),bytes:b.length,
    ...(p.endsWith('.png')?{width:b.readUInt32BE(16),height:b.readUInt32BE(20)}:{})};
};
const list=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>
  e.isDirectory()?list(path.join(dir,e.name)):[path.join(dir,e.name)]);
assert.equal(process.cwd(),root);
assert(!fs.existsSync(path.join(own,'freeze.json')));
const inputs=load(path.join(own,'EVIDENCE/input-bindings.json'));
for(const input of inputs.inputs) assert.equal(hash(input.path),input.sha256,`Input changed: ${input.path}`);
const authoring=load(path.join(own,'authoring-binding.json'));
const curve=load(path.join(own,'RECEIPTS/curve-facts-FIRST/stdout.txt'));
const display=load(path.join(own,'RECEIPTS/display-FIRST/stdout.txt'));
assert.equal(curve.status,'pass');assert.equal(display.status,'pass');
const receipts=fs.readdirSync(path.join(own,'RECEIPTS')).filter(n=>n!=='freeze-FIRST')
  .map(n=>load(path.join(own,'RECEIPTS',n,'receipt.json')));
assert(receipts.every(r=>r.exitCode===0));
const figureBindings=[];
for(const id of ['fig-59','fig-60','fig-61']) {
  const dir=path.join(final,id);
  const names=[id+'.spec.json',id+'.svg',id+'.render.json',id+'.preview.png'];
  const files=names.map(n=>bind(path.join(dir,n)));
  const report=load(path.join(dir,id+'.render.json'));
  const spec=load(path.join(dir,id+'.spec.json'));
  assert.equal(report.status,'pass');assert.deepEqual(report.collisions,[]);
  assert.equal(report.spec.sha256,files[0].sha256);
  assert.equal(report.output.svg.sha256,files[1].sha256);
  assert.equal(path.resolve(root,report.spec.path),files[0].path);
  assert.equal(path.resolve(root,report.output.svg.path),files[1].path);
  assert.equal(files[3].width,640);assert.equal(files[3].height,spec.canvas.height);
  assert.equal(hash(path.join(own,'WORKING',id,id+'.spec.json')),files[0].sha256);
  assert.equal(curve.results.find(r=>r.figure===id).spec.sha256,files[0].sha256);
  const validation=load(path.join(own,'RECEIPTS','validate'+id.slice(4)+'-FIRST/stdout.txt'));
  assert.equal(validation.status,'pass');
  for(const n of names.slice(1)) {
    const dest=path.join(own,'WORKING',id,n);
    assert(!fs.existsSync(dest));
    fs.copyFileSync(path.join(dir,n),dest);fs.chmodSync(dest,0o644);
  }
  figureBindings.push({
    figure:id,owner:id==='fig-59'?'lesson prose p0267#5':id==='fig-60'?'exercise 889 p0273#4':'exercise 891 p0273#9',
    source:spec.source.image,files,mode:'deterministic',display:spec.display,
    objectCount:spec.objects.length,assertionCount:spec.assertions.length,
    visibleLabelCount:report.labels,minTextPx:report.displayChecks.map(c=>({width:c.width,measuredMinPx:c.measuredMinPx})),
    mathematicalEvidence:bind(path.join(own,'RECEIPTS/curve-facts-FIRST/stdout.txt')),
    displayEvidence:bind(path.join(own,'RECEIPTS/display-FIRST/stdout.txt')),
    authorPreviewObserved:true,independentReview:'pending',reviewFile:null
  });
}
write(path.join(final,'source-binding.json'),{
  schema:'n45-modern-figure-source-binding@1',cwd:root,branch:inputs.branch,gitHead:inputs.gitHead,
  inputBinding:bind(path.join(own,'EVIDENCE/input-bindings.json')),
  sourceInputsUnchangedAtFreeze:inputs.inputs.map(i=>({path:i.path,sha256:i.sha256,currentSha256:hash(i.path)})),
  authoritativeModernText:authoring.authoritativeText,
  originalPreDrawingInventory:bind(path.join(own,'EVIDENCE/source-inventory-BEFORE-DRAWING.json')),
  correctedInventory:bind(path.join(final,'source-inventory.json')),
  inventoryHeaderAmendment:bind(path.join(own,'EVIDENCE/inventory-header-amendment.json')),
  sourceFactsVersusModernAdditions:'Separate arrays in source-inventory.json; no old modern diagrams or answers/choice data used.',
  figureBindings
});
const previews=load(path.join(own,'preview-observations.json'));
const inv=load(path.join(final,'source-inventory.json'));
const images=[
  ...inv.imageReceipts.map(r=>({
    ...r,path:path.join(root,'.intentfold/tickets/STEMROBIN-182/tmp/resume182-13',r.path),
    sha256:hash(path.join(root,'.intentfold/tickets/STEMROBIN-182/tmp/resume182-13',r.path)),
    kind:'source',actualRead:'functions.view_image detail=original, exactly once'
  })),
  ...previews.opens.map(r=>({
    ...r,path:path.join(own,r.path),sha256:hash(path.join(own,r.path)),
    kind:'current-preview',batch:1,reopen:false
  }))
];
write(path.join(final,'image-ledger.json'),{
  schema:'n45-image-ledger@1',images,
  counts:{batches:1,source:3,currentPreview:3,totalLoadedInThisContext:6,reopens:0,crops:0,maximumPerBatch:8,maximumContext:24},
  noImagePayloadInParentHandoff:true,noReviewApproval:true
});
for(const [from,to] of [
  ['text-read-receipts.json','text-read-receipts.json'],
  ['preview-observations.json','preview-observations.json'],
  ['RECEIPTS/curve-facts-FIRST/stdout.txt','mathematical-assertions.json'],
  ['RECEIPTS/display-FIRST/stdout.txt','display-evidence.json']
]) {
  assert(!fs.existsSync(path.join(final,to)));
  fs.copyFileSync(path.join(own,from),path.join(final,to));
}
const commands=receipts.map(r=>({name:r.name,cwd:r.cwd,executable:r.executable,args:r.args,
  start:r.start,end:r.end,exitCode:r.exitCode,
  receipt:bind(path.join(own,'RECEIPTS',r.name,'receipt.json')),
  stdout:r.stdout,stderr:r.stderr}));
const counts={
  figures:3,sourceImageOpens:3,previewImageOpens:3,totalContextImageOpens:6,imageBatches:1,reopens:0,crops:0,
  validateSpecDirectCalls:3,renderSpecCalls:3,automaticValidatorSubprocessesInsideRenderer:3,
  totalActualValidateSpecProcesses:6,renderRecoveries:0,contentRetries:0,generatedPreviews:3,
  curveFactsHelperCalls:1,displayHelperCalls:1,isolatedDisplayChecks:9,
  modelCalls:0,paidGenerationCalls:0,networkToolCalls:0,dbCalls:0,appRuns:0,dependencyChanges:0,
  finalizerCalls:0,approvalCalls:0,reviewFiles:0,publishCalls:0,commits:0,durableOutputWrites:0
};
write(path.join(final,'manifest.json'),{
  schema:'n45-modern-figure-author-handoff@1',date:'2026-11-19',
  status:'frozen-author-candidates-await-independent-figure-review',
  cwd:root,branch:inputs.branch,gitHead:inputs.gitHead,ownedScratch:own,
  figureBindings,counts,commands,
  sourceBinding:bind(path.join(final,'source-binding.json')),
  inventory:bind(path.join(final,'source-inventory.json')),
  imageLedger:bind(path.join(final,'image-ledger.json')),
  textReceiptLedger:bind(path.join(final,'text-read-receipts.json')),
  finalArtifacts:list(final).sort().map(bind),
  working:'Separate 0644 copies under WORKING; FINAL and evidence 0444. No hardlinks.',
  independentReview:'Not performed. No .review.json, no self-approval; later reviewer must inspect source/current figure against modern text independently.',
  productAcceptance:'Not performed: no application or finalized lesson was run. Display evidence is an offline SVG-only host with 390x844/1440x960 viewports and 300/331/640px containers.',
  determinism:'Existing deterministic JSXGraph renderer used once per figure. No byte-identical regeneration test; no claim of repetition proving fidelity.',
  recoveries:'No validator/render/content failures. Initial lookup errors and one IHDR width correction before drawing are preserved, not retry approvals.',
  restrictions:'No input/template/index/progress/usage/durable resource edits; no env/DB/network/app/dependency/model/paid image/publish/finalizer/commit/revert.',
  freezeCompletionReceipt:path.join(own,'RECEIPTS/freeze-FIRST/receipt.json')
});
const report=[
  '# STEMROBIN-182: n45 Deterministic Modern Figure Author',
  '',
  'Date: 2026-11-19. Exact checkout: `'+root+'`.',
  'Branch: `'+inputs.branch+'`. Head: `'+inputs.gitHead+'`.',
  'Only authored writes: `'+own+'`.',
  '',
  '## Result',
  '',
  '**Three frozen author candidates, not independent figure review or promotion approval.**',
  'Fig 59 is lesson prose; fig 60 belongs only to 889; fig 61 belongs only to 891.',
  'All three current validator/render results passed first time, with zero collisions and zero recovery retries.',
  'Current source text, modern WORKING text and all source/tool hashes remain unchanged.',
  '',
  '## Construction',
  '',
  '- Fig 59 preserves the exact 21x24 lattice, t=0.5/h=5 minor steps, grid offset/origin, solid bounded h=40t-5t^2 curve, (0,0)/(8,0) ground endpoints, (4,80) maximum, full dashed h=60 guide and t=2/6 vertical guides.',
  '- Fig 60 preserves the exact 18x12 half-unit lattice and actual source y/x axes. Nonanalytic, source-constrained piecewise cubic passes both source y=3 crossings, the minimum and finite endpoints, without overshoot, added query guides, labelled solutions or extension. Approximate intermediate source shape readings are explicitly distinguished from given function values.',
  '- Fig 61 preserves both unscaled separate number lines, origin ticks/zeros, all four A/B markers, source-relative spacing and ordering. Upper A is hollow. No unit tick, 1 mark or other requested point is supplied. Panel labels are Latin and squared labels use a real superscript.',
  '- Source facts and justified modern additions are separate arrays in `FINAL/source-inventory.json`. The original pre-drawing inventory is preserved unchanged; an IHDR-only correction from approximate width 864 to actual 872 is separately recorded before spec creation.',
  '',
  '## Evidence',
  '',
  'Images: ONE batch, source 3 + current 640px preview 3 = 6 loaded in this context; no reopens/crops, no parent image payload.',
  'Direct validate_spec calls: 3; render_spec calls: 3. Renderer internally invokes validate_spec once each, so 6 actual validator processes total. No retries.',
  'Fig 59/60: scroll media 640px, minimum actual text 22px. Fig 61: inline maxWidth 640px; at 300/331/640px labels measure 16.875/18.61875/36px.',
  'Nine SVG-only offline display checks at desktop 1440x960 and mobile 390x844 proved media widths and reachable horizontal scroll ends. Zero requested network loads. This is not product/lesson acceptance.',
  'Mathematical evidence verifies every construction point, grid dimensions/offsets, source guide spans, curve domain/query/extrema/monotonicity, and the two number-line panels. Current rendered raw paths, solid/dashed guide counts and arrowheads are also checked.',
  '',
  '## Files And Hashes',
  '',
  'Exact paths and full SHA-256 for every spec/SVG/render/preview plus all commands/cwd/exit/stdout/stderr: `'+path.join(final,'manifest.json')+'`.',
  'Source/modern-text/input binding: `'+path.join(final,'source-binding.json')+'`.',
  'Image/text receipts: `'+path.join(final,'image-ledger.json')+'` and `'+path.join(final,'text-read-receipts.json')+'`.',
  ''
];
for(const f of figureBindings) {
  report.push('### '+f.figure);
  for(const b of f.files) report.push('`'+b.path+'`  \nSHA-256: `'+b.sha256+'`');
  report.push('');
}
report.push('## Commands','','Executed exactly once each from the checkout root, with `PYTHONDONTWRITEBYTECODE=1` and no env file read. Original receipts preserve the full argv:','');
for(const c of commands.filter(c=>c.name.startsWith('validate')||c.name.startsWith('render')&&c.name!=='render-reports-FIRST')) {
  report.push('```sh',c.executable+' '+c.args.join(' '),'```','');
}
report.push('## Boundary','','FINAL plus EVIDENCE/RECEIPTS/report/manifest are 0444; independent WORKING copies are 0644. Original source PNGs are referenced and hashed, not duplicated or chmodded.',
  'No answers, choice data or old modern diagrams inspected. Shared figure-renderer source sections only were read for display behavior; no lesson finalizer or app run.',
  'Zero DB/env-file/network tool/dependency/model/paid generation/publish/commit/durable-index/progress/usage operations. Other active agents and their edits were left alone.',
  'No review file or self-approval. Later independent review is the next permitted owner stage.','');
assert(!fs.existsSync(path.join(own,'report.md')));
fs.writeFileSync(path.join(own,'report.md'),report.join('\n'));
const artifactFiles=[...list(final),path.join(own,'report.md')].sort();
const hashList=path.join(own,'artifact-hashes.sha256');
assert(!fs.existsSync(hashList));
fs.writeFileSync(hashList,artifactFiles.map(p=>hash(p)+'  '+p).join('\n')+'\n');
const sealingFiles=[...list(final),...list(path.join(own,'EVIDENCE')),
  ...list(path.join(own,'RECEIPTS')).filter(p=>!p.includes('/freeze-FIRST/')),
  ...['authoring-binding.json','text-read-receipts.json','preview-observations.json','report.md',
    'artifact-hashes.sha256','author-figures.cjs','check-curve-facts.cjs','check-display.mjs','evidence.cjs','freeze.cjs'].map(n=>path.join(own,n))];
for(const p of sealingFiles) fs.chmodSync(p,0o444);
for(const p of list(path.join(own,'WORKING'))) assert.equal(fs.statSync(p).mode&0o777,0o644);
write(path.join(own,'freeze.json'),{
  schema:'n45-author-freeze@1',at:new Date().toISOString(),cwd:root,
  status:'frozen-not-approved',counts,
  manifest:bind(path.join(final,'manifest.json')),report:bind(path.join(own,'report.md')),
  artifactHashList:bind(hashList),files:sealingFiles.sort().map(p=>({...bind(p),mode:(fs.statSync(p).mode&0o777).toString(8)})),
  expectedCompletionReceipt:path.join(own,'RECEIPTS/freeze-FIRST/receipt.json'),
  completionReceiptSeal:'evidence.cjs seals completion receipt/streams after this child exits; excluded from this self-referential freeze hash list.'
});
fs.chmodSync(path.join(own,'freeze.json'),0o444);
console.log(JSON.stringify({
  finalManifest:bind(path.join(final,'manifest.json')),report:bind(path.join(own,'report.md')),
  artifactHashList:bind(hashList),freeze:bind(path.join(own,'freeze.json')),
  counts,figures:figureBindings.map(f=>({figure:f.figure,files:f.files})),
  status:'frozen-author-candidates-await-independent-figure-review'
},null,2));
