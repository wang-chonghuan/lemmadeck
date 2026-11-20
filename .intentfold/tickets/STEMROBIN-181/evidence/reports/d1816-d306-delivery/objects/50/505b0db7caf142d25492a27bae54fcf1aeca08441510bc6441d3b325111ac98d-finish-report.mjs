import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo='/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const own=path.join(repo,'.intentfold/tickets/STEMROBIN-181/tmp/d1816-d280-fig2425-author');
assert.equal(process.cwd(),repo);
const bind=file=>{
  const p=path.resolve(file),data=fs.readFileSync(p);
  return {path:p,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')};
};
const read=file=>JSON.parse(fs.readFileSync(path.join(own,file)));
const write=(file,data)=>fs.writeFileSync(path.join(own,file),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  const p=path.join(dir,e.name);
  assert(!e.isSymbolicLink(),'No symlink outputs in owned directory');
  return e.isDirectory()?walk(p):[p];
});
const [stage]=process.argv.slice(2);
if(stage==='report') {
  const freeze=read('input-freeze.json'),geometry=read('geometry-audit.json'),pixels=read('pixel-audit.json');
  assert.equal(geometry.status,'pass');
  assert.equal(pixels.status,'pass');
  const inputFreshness=[...freeze.sources,...freeze.drafts,...freeze.contracts,freeze.sourceInventory].map(item=>{
    const current=bind(item.path);
    return {path:item.path,frozenSha256:item.sha256,currentSha256:current.sha256,unchanged:current.sha256===item.sha256};
  });
  assert(inputFreshness.filter(r=>r.path.endsWith('source-inventory.json')).every(r=>r.unchanged));
  const nativeOutcomes=fs.readdirSync(path.join(own,'native'))
    .filter(name=>name!=='d280-write-report').sort().map(name=>{
    const directory=path.join(own,'native',name);
    const receipt=JSON.parse(fs.readFileSync(path.join(directory,'receipt.json')));
    return {...receipt,receipt:bind(path.join(directory,'receipt.json')),
      stdout:bind(path.join(directory,'stdout.txt')),stderr:bind(path.join(directory,'stderr.txt'))};
  });
  assert(nativeOutcomes.every(r=>r.exitCode===0));
  const ledger=[
    {open:1,role:'original-fig24-alone',path:freeze.sources[0].path},
    {open:2,role:'original-fig25-alone',path:freeze.sources[1].path},
    {open:3,role:'source25-2x-nearest-neighbor-no-candidate',path:path.join(own,'source25-magnified.png')},
    {open:4,role:'fig24-full-and-source-width-identical-bytes',path:path.join(own,'fig-24/fig-24.full-width.png')},
    {open:5,role:'fig25-full-and-source-width-identical-bytes',path:path.join(own,'fig-25/fig-25.full-width.png')},
    {open:6,role:'fig24-mobile331-scroll-end',path:path.join(own,'fig-24/fig-24.mobile331-scroll-end.png')},
    {open:7,role:'fig25-mobile331-scroll-end',path:path.join(own,'fig-25/fig-25.mobile331-scroll-end.png')},
  ].map(item=>({...item,tool:'functions.view_image',...bind(item.path)}));
  write('image-ledger.json',{schema:'d280-image-ledger@1',entries:ledger,
    count:7,batchLimit:8,contextCount:7,contextLimit:24,
    nativePixelAnalysisIsNotAContextImageOpen:true,
    imageToolReceipts:'view_image is not a subprocess; payloads are retained only in the chat. This ledger records the actual opened file hashes, sequence and observations, not fictional run-native image calls.'});
  const figures=['fig-24','fig-25'].map(id=>{
    const spec=read(`${id}/spec.json`),render=read(`${id}/${id}.render.json`),preview=read(`${id}/preview.json`);
    assert.equal(render.spec.sha256,bind(path.join(own,id,'spec.json')).sha256);
    assert.equal(render.output.svg.sha256,bind(path.join(own,id,`${id}.svg`)).sha256);
    const variants=preview.previews;
    assert.equal(variants[0].sha256,variants[1].sha256);
    const figureNative=nativeOutcomes.filter(r=>r.name.match(new RegExp(`d280-fig${id.slice(4)}-(draft|render|preview)-01`)));
    assert.equal(figureNative.length,3);
    return {
      id,status:'author-candidate-native-pass-independent-review-pending',mode:'deterministic',
      source:freeze.sources.find(f=>f.id===id),spec:bind(path.join(own,id,'spec.json')),
      svg:bind(path.join(own,id,`${id}.svg`)),render:bind(path.join(own,id,`${id}.render.json`)),
      previewEvidence:bind(path.join(own,id,'preview.json')),previews:variants,
      actualAssertions:spec.assertions,sourceInventoryMappings:spec.source.inventory,
      nativeOutcomes:figureNative,nativeRenderStatus:render.status,nativeCollisions:render.collisions,
      display:{...spec.display,measuredMediaWidth:640,mobileContainerWidth:331,reachableHorizontalScrollEnd:309,
        measuredMinimumLabelPx:id==='fig-24'?22:null,
        labelMeaning:id==='fig-24'?'Three visible mathematical labels only.':'No internal labels in source; none invented.'},
      authorVisualObservations:id==='fig-24'
        ? 'Compared original to full 640px preview: common axes and both arrowheads, u-subscript-p/O/t, three rising runs/two vertical resets/partial endpoint intact; no negative-region loss. Mobile scroll end shows complete time arrow and partial third run.'
        : 'Compared original and source magnification to full 640px preview: entire round CRT, double rim, light beveled mount, four fasteners, broad dark lower band, all lattice tracks and circular boundary fragments, four decreasing crests/four troughs and falling tail visible. No constant sine, rectangular screen, calibration, caption contamination or omitted tail. Mobile end retains right rim, right fasteners and tail.',
      geometryRenderCalls:1,contentRepairs:0,geometryRerenders:0,independentReviewWritten:false,
    };
  });
  const report={
    schema:'d280-two-modern-figure-author-report@1',batch:'D280',ticket:'STEMROBIN-181',book:'10p',lesson:'phy10-c1-s3-n17',
    createdAt:new Date().toISOString(),status:inputFreshness.every(r=>r.unchanged)
      ?'authored-native-pass-independent-review-pending':'authored-input-drift-review-required',
    verdictMeaning:'Bounded offline author candidates with native geometry/display/pixel evidence only. Not source, text, course, mathematical/cultural independent review, or publish approval.',
    ownership:{onlyNewOutputRoot:own,existingProductFilesModified:0,otherWorkersPreserved:true,
      validation:'All explicit author, renderer, preview, audit and receipt output paths stay under this new directory. No Git or project-wide scan was used.'},
    sourceFirst:{originalPNGsOpenedBeforeInventory:true,inventoryWrittenBeforeAnySpecOrCandidate:true,
      inventory:bind(path.join(own,'source-inventory.json')),inputFreeze:bind(path.join(own,'input-freeze.json')),
      inventoryUnchanged:true,rawHashesMatchD271:true,sourceToGeometry:bind(path.join(own,'source-to-geometry.json'))},
    authoritativeDraftText:{status:'draft-under-independent-text-review-not-approved',bindings:freeze.drafts.map(({nonfigBlocks,...d})=>d),
      bothLanguagesCompleteNonfigBlocks:12,actualTextEmbeddedInEachSpec:true,fullText:freeze.authoritativeText,
      readReceipt:bind(path.join(own,'native/d280-read-all-nonfig-text/receipt.json'))},
    figures,geometryAudit:bind(path.join(own,'geometry-audit.json')),pixelAudit:bind(path.join(own,'pixel-audit.json')),
    nativeOutcomes,nativeAccounting:{externalDraftValidationCalls:2,rendererInternalDraftValidationCalls:2,
      totalValidatorExecutions:4,geometryRenderCalls:2,previewProcesses:2,previewPNGs:6,
      geometricAuditCalls:1,pixelAuditCalls:1,allRetainedCallsBeforeReport:nativeOutcomes.length,
      firstFailure:null,contentRepairs:0,technicalPreviewRepairs:0,geometryRerenders:0,
      warning:'Successful pixel audit stderr retains a Pillow getdata deprecation warning; no failed pixel or rendering outcome.'},
    imageLedger:ledger,imageLedgerFile:bind(path.join(own,'image-ledger.json')),
    imageCounts:{batch:7,context:7,batchLimit:8,contextLimit:24,reopensOfSameOriginalPNG:0,sourceMagnificationsOpened:1},
    previewContract:{latestHumanClarificationApplied:true,directSvgRasterOrResvgCalls:0,
      method:'Isolated existing Playwright Chromium screenshot of unchanged SVG with white background; all requests aborted, no network.',
      helperProvenance:freeze.contracts.filter(c=>c.path.endsWith('preview-d118-n19-existing-svg.mjs')||c.path.endsWith('recover-d261-n44-preview.mjs')),
      outputHelper:bind(path.join(own,'preview-existing-svg.mjs')),blankPreviewsProduced:0},
    inputFreshness,receiptCoverage:{allPostBootstrapSubprocessCallsThroughExistingPathOnlyRunner:true,
      stdoutAndStderrRetained:true,uniqueNativeNames:true,bootstrapExceptions:freeze.bootstrapExceptions,
      scopeDefect:'The five initial read-only discovery exec calls predate locating the owned receipt runner. They cannot be retroactively certified as run-native receipts; disclosed, not replayed or fabricated.'},
    reviewAndPublicationBoundary:{independentFigureReviewPending:true,bilingualTextReviewPending:true,
      reviewAt1FilesWritten:0,canonicalAssetsWritten:0,manifestsWritten:0,sourceFilesWritten:0,
      databaseCalls:0,publishCalls:0,gitCalls:0,projectWideTests:0,otherAgentOrChatMessages:0,
      paidGenerationCalls:0,rawScanUsedAsFinal:false,offlineLessonAssemblyOrProductAcceptance:'Not authorized; isolated unchanged-SVG display evidence only.'},
    outputFreeze:{path:path.join(own,'output-freeze.json'),
      meaning:'Created after this report. Contains actual hashes for this report and all completed owned outputs/receipts, excluding itself and its executing runner receipt to avoid circular hashes.'},
  };
  write('report.json',report);
  console.log(JSON.stringify({report:bind(path.join(own,'report.json')),status:report.status,
    figureNativeStatuses:figures.map(f=>({id:f.id,status:f.nativeRenderStatus,svgSha256:f.svg.sha256})),
    imageOpens:7,scopeDefect:report.receiptCoverage.scopeDefect}));
} else if(stage==='refine') {
  const report=read('report.json');
  assert.equal(report.status,'authored-input-drift-review-required');
  const initial=bind(path.join(own,'report.json'));
  const history=path.join(own,'history');
  fs.mkdirSync(history,{recursive:true});
  const preserved=path.join(history,'report-before-shared-json-drift-refinement.json');
  fs.copyFileSync(initial.path,preserved,fs.constants.COPYFILE_EXCL);
  const freeze=read('input-freeze.json');
  const comparison=freeze.drafts.map(d=>{
    const current=JSON.parse(fs.readFileSync(d.path));
    const text=[current.chapter,current.printed_title,
      ...current.prose.filter(b=>b.kind!=='fig').map(b=>b.text)].join('\n\n');
    const frozen=freeze.authoritativeText.find(t=>t.lesson.includes(`${d.edition}:`));
    assert.equal(text,frozen.text);
    return {edition:d.edition,currentFile:bind(d.path),frozenFileSha256:d.sha256,
      wholeFileBytesChanged:bind(d.path).sha256!==d.sha256,
      completeAuthoritativeTextUnchanged:true,
      currentDraftStatus:current.status,
      currentTextSha256:crypto.createHash('sha256').update(text).digest('hex')};
  });
  assert(report.inputFreshness.filter(r=>!freeze.drafts.some(d=>d.path===r.path)).every(r=>r.unchanged));
  report.status='authored-native-pass-independent-review-pending';
  report.sharedDraftJsonDrift={
    initialReportPreserved:bind(preserved),comparison,
    diagnosis:'Shared whole-file JSON hashes changed, but chapter/title and every nonfigure block remain byte-identical to the actual authoritative text embedded in both specs. No source/spec/renderer/output drift was found. Non-authoritative/figure/metadata fields in the shared files are outside this author scope.',
    sharedFilesModifiedByThisAuthor:false,contentRepair:false,geometryRerender:false,
    comparisonReceipt:bind(path.join(own,'native/d280-inspect-text-drift/receipt.json')),
  };
  write('shared-draft-text-comparison.json',report.sharedDraftJsonDrift);
  fs.writeFileSync(path.join(own,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({report:bind(path.join(own,'report.json')),status:report.status,
    firstFreshnessFinding:bind(preserved),completeAuthoritativeTextUnchanged:true,
    contentRepairs:0,geometryRerenders:0}));
} else if(stage==='seal') {
  const report=read('report.json');
  assert(report.status==='authored-native-pass-independent-review-pending');
  const excluded=path.join(own,'native/d280-freeze-outputs');
  const files=walk(own).filter(p=>!p.startsWith(`${excluded}/`)&&!p.endsWith('/output-freeze.json')).sort().map(bind);
  assert(files.every(f=>f.path.startsWith(`${own}/`)));
  assert(!files.some(f=>f.path.endsWith('.review.json')));
  const nativeReceipts=files.filter(f=>f.path.endsWith('/receipt.json'));
  for(const file of nativeReceipts)assert.equal(JSON.parse(fs.readFileSync(file.path)).exitCode,0);
  const output={
    schema:'d280-output-freeze@1',createdAt:new Date().toISOString(),root:own,files,
    report:bind(path.join(own,'report.json')),sourceInventory:report.sourceFirst.inventory,
    actualNativeReceiptCount:nativeReceipts.length,completedNativeReceiptHashesIncluded:true,
    excluded:[{path:path.join(own,'output-freeze.json'),reason:'Cannot hash itself.'},
      {path:excluded,reason:'Executing run-native receipt/stdout/stderr are written after this subprocess exits; independent terminal seal receipt, not a missing content-stage receipt.'}],
    review:'Independent review is pending. Freeze certifies bytes and provenance only.',
  };
  write('output-freeze.json',output);
  for(const file of files)fs.chmodSync(file.path,0o444);
  fs.chmodSync(path.join(own,'output-freeze.json'),0o444);
  console.log(JSON.stringify({report:bind(path.join(own,'report.json')),freeze:bind(path.join(own,'output-freeze.json')),
    frozenFiles:files.length,completedNativeReceipts:nativeReceipts.length,
    immutableFilePermissions:'0444 on completed files; terminal seal receipt remains runner-owned.'}));
} else throw new Error('Use report, refine or seal');
