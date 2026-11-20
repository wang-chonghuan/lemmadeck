import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(),root);
const own=path.join(root,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const figdir=path.join(root,'.tmp/STEMROBIN-181/d1816-d054/n14-figure-author');
const work=path.join(root,'.tmp/STEMROBIN-181/d1816-d054/n14-work/adapt/10p');
const carrier=path.join(root,'.tmp/STEMROBIN-181/d1816-d054/n14-root/10p');
const lesson='phy10-c1-s2-n14';
const read=file=>JSON.parse(fs.readFileSync(file));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind=file=>({path:file,sha256:hash(file)});
const bindings=[];
function tracked(file){const row=bind(file);bindings.push(row);return row;}
const context=read(path.join(own,'bilingual-context.json'));
const native=read(path.join(own,'native-text-validation.json'));
assert.equal(native.status,'pass');
const proofPath=path.join(root,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-source-reuse/bindings.json');
const proof=read(proofPath);
assert.equal(hash(path.join(root,proof.source.path)),proof.source.sha256);
const text=[];
for(const locale of context.locales){
  assert.equal(hash(locale.template.path),locale.template.sha256);
  const directory=path.join(work,locale.edition,'lessons',lesson);
  const doc=read(locale.template.path),source=read(path.join(carrier,'lessons',lesson,'lesson.json'));
  assert.deepEqual(doc.source.data,source);
  assert.equal(doc.prose.length,19);
  assert.equal(doc.prose.filter(x=>x.kind==='p').length,15);
  const ex=read(path.join(directory,'exercises.template.json'));
  assert.equal(ex.count,0);assert.deepEqual(ex.exercises,[]);
  text.push({
    locale:locale.locale,edition:locale.edition,
    templates:['lesson','exercises','figures'].map(x=>tracked(path.join(directory,`${x}.template.json`))),
    sourceSnapshotSha256:doc.source.sha256,
    paragraphCount:native.locales.find(x=>x.locale===locale.locale).paragraphCount,
    sectionBreaks:doc.section_breaks,
    nativeFlow:tracked(path.join(own,`${locale.locale}-prose-flow-final.json`)),
    formulaSpansByEntry:native.locales.find(x=>x.locale===locale.locale).blocks.map(x=>({entry:x.index,sourceRefs:x.sourceRefs,spans:x.modernMath})),
    metadataPreserved:'id, card_id, chapter, section, number, printed_title, start_page, start_printed; all source refs, kinds, order and snapshots retained',
  });
}
const images=read(path.join(own,'author-observations.json'));
assert.equal(images.imagesInspected.length,6);
for(const image of images.imagesInspected) image.binding=tracked(path.join(root,image.path));
const mappings=read(path.join(own,'source-inventory-mapping.json'));
const previews=read(path.join(own,'preview-bindings.json'));
assert.equal(previews.status,'pass');
const figures=[];
for(const id of ['fig-18','fig-19']){
  const specPath=path.join(figdir,`${id}.spec.json`);
  const spec=read(specPath),reportPath=path.join(figdir,`${id}.render.json`),report=read(reportPath);
  assert.equal(hash(specPath),report.spec.sha256);
  assert.equal(hash(path.join(root,report.output.svg.path)),report.output.svg.sha256);
  assert.equal(report.status,'pass');assert.deepEqual(report.collisions,[]);
  assert.deepEqual(spec.source.authoritativeText,context.locales.map(x=>({lesson:x.lesson,text:`[${x.locale}; ${x.edition}; ${x.title}]\n${x.completeText}`})));
  assert.equal(hash(spec.source.image.path),spec.source.image.sha256);
  assert.deepEqual(spec.display.widths,[331,640]);
  const mapped=mappings.figures.find(x=>x.id===id);
  assert.equal(mapped.spec.sha256,hash(specPath));
  const source=proof.reused.find(x=>x.path.endsWith(`/figures/${id}.png`));
  assert.equal(source.sha256,spec.source.image.sha256);
  const nativeReceiptPath=path.join(own,id==='fig-18'?'fig-18-native-render-label-repair.receipt.json':'fig-19-native-render.receipt.json');
  assert.equal(read(nativeReceiptPath).exitCode,0);
  const draftReceiptPath=path.join(own,`${id}-native-draft-label-repair.receipt.json`);
  assert.equal(read(draftReceiptPath).exitCode,0);
  figures.push({
    id,mode:spec.mode,purpose:spec.display.purpose,
    sourcePng:tracked(spec.source.image.path),
    spec:tracked(specPath),svg:tracked(path.join(figdir,`${id}.svg`)),
    nativeRender:tracked(reportPath),native640:tracked(path.join(figdir,`${id}.native.png`)),
    preview331:tracked(path.join(figdir,`${id}.preview-331.png`)),
    nativeDraftReceipt:tracked(draftReceiptPath),nativeRenderReceipt:tracked(nativeReceiptPath),
    nativeMechanicalStatus:'pass',nativeDisplayChecks:report.displayChecks,
    objectCount:report.objects,labelCount:report.labels,assertionCount:spec.assertions.length,
    completeInventoryMapping:spec.source.inventory,
    modernRegularization:mapped.regularization,
    independentlyApproved:false,authorObservation:images.imagesInspected.filter(x=>x.figure===id),
  });
}
const reference=read(path.join(own,'primary-reference-bindings.json'));
for(const passage of reference.passages){
  assert.equal(hash(passage.fullRenderedRead.path),passage.fullRenderedRead.sha256);
  assert.equal(hash(passage.passage.path),passage.passage.sha256);
  const full=fs.readFileSync(passage.fullRenderedRead.path);
  assert.equal(full.subarray(passage.byteStart,passage.byteEnd).toString('utf8'),fs.readFileSync(passage.passage.path,'utf8'));
  tracked(passage.fullRenderedRead.path);tracked(passage.passage.path);
}
const receipts=fs.readdirSync(own).filter(x=>x.endsWith('.receipt.json')).sort().map(x=>tracked(path.join(own,x)));
const programs=fs.readdirSync(own).filter(x=>x.endsWith('.mjs')||x.endsWith('.py')).sort().map(x=>tracked(path.join(own,x)));
const repaired=read(path.join(own,'repair-history.json'));
assert.equal(repaired.genuineContentRepairs,1);
const raw=['lesson.json','exercises.json','lesson.md'].map(x=>tracked(path.join(carrier,'lessons',lesson,x)));
const failures=[
  'fig-18-native-draft.receipt.json','fig-18.first-draft.json','fig-19.first-draft.json',
  'fig-18-native-render.receipt.json','fig-18-native-render-runtime-reuse.receipt.json',
  'fig-18.before-label-repair.spec.json','fig-18.before-label-repair.svg','fig-18.before-label-repair.render.json',
  'fig-19.before-label-repair.spec.json','live-read-recovery.json',
  'references/R1-UVA.stdout.txt','references/R1-UVA.stderr.txt',
].map(x=>tracked(path.join(own,x)));
const evidence=[
  'authored-text.json','materialize-text.receipt.json','bilingual-context.json','native-text-validation.json',
  'source-inventory.json','source-inventory-mapping.json','curve-relationship-checks.json',
  'primary-reference-bindings.json','reference-acquisition.json','preview-bindings.json',
  'repair-history.json','author-observations.json','technical-runtime-reuse.json',
  'live179-authority.json','live181.stdout.json','live-read-recovery.json',
].map(x=>tracked(path.join(own,x)));
const freeze={
  schema:'STEMROBIN-181/d054-n14-author-freeze@1',role:'AUTHOR',lesson,batch:'D054',
  status:'AUTHOR-COMPLETE-INDEPENDENT-REVIEW-PENDING',cwd:root,
  authority:{comment:'830251c5-4c6f-48af-9bae-6e3a22118c80',liveRead:bind(path.join(own,'live179-authority.json')),finish:'review'},
  ownership:{templates:work,figures:figdir,evidence:own,onlyLesson:lesson},
  sourceReuseProof:tracked(proofPath),raw,
  sourceBoundary:proof.sourceBoundary,sourceEntries:19,proseEntries:15,sourceFigures:['fig-18','fig-19'],questions:0,
  text,figures,primaryReferences:reference,evidence,receipts,programs,
  inventory:read(path.join(own,'source-inventory.json')),actualImageLedger:images,
  counts:{
    textAuthoringRounds:1,textContentRepairs:0,nativeTextValidationRuns:1,localesValidated:2,
    sectionBreaksPerLocale:3,sourcePngOpens:2,fullNativePngOpens:2,preview331Opens:2,
    contextImages:6,batchImages:6,crops:0,reopens:0,failedImageOpens:0,imageBatchLimit:8,imageContextLimit:24,
    standaloneDraftValidationCalls:{'fig-18':3,'fig-19':2},
    rendererProcessInvocations:{'fig-18':3,'fig-19':1},
    actualNativeRenderExecutions:{'fig-18':2,'fig-19':1},
    rendererInternalDraftValidations:3,currentSuccessfulRenders:2,contentFigureRepairs:1,
    contractRepairs:1,runtimeExecutionRepairs:1,paidCalls:0,dependencyInstalls:0,
    packagesCopied:0,sourcePageOpens:0,sourceReassembly:0,sourceRepreparation:0,
    pdfRenders:0,adaptFinalizeCalls:0,offlineLessonRenderCalls:0,promotions:0,dbWrites:0,
    independentReviewPassesIssued:0,
  },
  failuresAndRepairs:{firstFailures:failures,history:repaired,technicalReferenceRecovery:'UVA HTTPS certificate error retained; official HTTP page read successfully without disabling certificate verification.'},
  holds:[],
  pending:images.pending,
  boundaries:{
    independentReviewPending:true,reviewAt1Issued:false,independentPassIssued:false,
    noPriorN14ModernApprovalAssumed:true,authorVisualJudgmentOnly:true,
    draftManifestReviewPathsNotExistingApprovals:true,promoted:false,published:false,
    rawCarrierUnmodified:true,canonicalRawOrEditionWrites:false,indexOrMeterWrites:false,
    gitWrites:false,dbWrites:false,appStarted:false,worktreeSettingsChanged:false,
    cloudOrPurchasesChanged:false,otherChatWrites:false,reviewerTaskInterference:false,
    charterEdits:false,dependencyChanges:false,
  },
  exactCurrentAndRetainedBindings:[...new Map(bindings.map(x=>[x.path,x])).values()],
};
const target=path.join(own,'author-freeze.json');
assert(!fs.existsSync(target));
fs.writeFileSync(target,JSON.stringify(freeze,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:freeze.status,freeze:bind(target),text:text.map(x=>({locale:x.locale,template:x.templates[0],paragraphs:x.paragraphCount})),
  figures:figures.map(x=>({id:x.id,spec:x.spec,svg:x.svg,render:x.nativeRender})),
  context:bind(path.join(own,'bilingual-context.json')),imageCount:6,independentReview:'pending'}));
