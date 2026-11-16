import fs from 'node:fs/promises';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const root = 'ssot-resources/soviet10year-textbooks/artifacts';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const meter = await read(`${ticket}/production-meter.json`);
let pages = 0;
let tasks = 0;
let ready = 0;
let captured = 0;
const indexed = {};
for (const book of ['9p', '10p']) {
  const source = await read(`${root}/${book}/book.json`);
  indexed[book] = source.lessons.length;
  tasks += source.audit.exercise_count;
  ready += (await read(`${root}/${book}/editions/modern-us-neutral/book.json`)).lessons.length;
  captured += (await read(`${root}/${book}/answers.json`)).answers.length;
  for (const page of await fs.readdir(`${root}/${book}/pages`)) {
    const audit = await read(`${root}/${book}/pages/${page}/audit.json`).catch(() => null);
    if (audit?.errors.length === 0 && audit.lines_md === audit.lines_printed) pages++;
  }
}
Object.assign(meter.deliveryBatches.find(batch => batch.id === 'D-016'), {
  planeProgressComment: '0f5b2eac-7c24-4544-967d-83f660d70689',
});
Object.assign(meter.currentCheckpoint, {
  sourcePagesFinalized: pages, indexedSourceCards: indexed,
  sourceWrittenExercises: tasks, modernReadyArtifacts: ready, capturedBookAnswers: captured,
  sourcePagesBasis: '9p native finalized throughPDF147; source148-151 firstgate requires only149F1/F2 correction.10p existing11-47/52-59,48-51gap unchanged.',
  openSourceTails: [
    '9p59 outgoing atPDF147, author148-151 pending149affected correction/nativefinalization.',
    '10p PDF59 outgoing prose open;48-51 blocks assembly.',
  ],
  answerScope: '9p44 faithful captures for exercises1-8 onPDF337;10p39 for exercises1-5 onPDF410. Newlycapturedexercise8 hasonlyprinted4/5/6. Capture doesnotapprove modernanswers.',
  newSourceReviews: '144-147 uniqueinitialsourcegate andnativefinalization/assemblyPASS;148-151 firstgate retains148/150/151 andfig104/105 PASS.149one-characterfidelity/countercorrection pendingaffected-onlyindependentrecheck.',
  nextBatch: {
    id: 'D-017', status: 'developing-not-delivered',
    completeCards: [],
    proseAuthoring: ['phy9-c1-s7-t4', 'phy9-c2-s1'],
    sourceTail: '148-151 nativefinalization waits149F1/F2 affectedgate',
    n55: 'SCIpassed;fig93-98 authorfrozenunapproved;fig92 source-detailblocker. No n55cardfinalization.',
    counterCorrection: 'Oneband-heightceiling1.2->1.3 in existing_small_prose_continuation;25actual149rows verified, independentaffectedgate pending. No sourcepixels/countsfudged.',
    evidence: [
      'tmp/source-review-9p-0144-0147-finalization-trace.json',
      'tmp/source-review-9p-0148-0151.json',
      'tmp/d017-native-counter-correction.json',
      'tmp/d017-n55-figures-author-freeze.json',
      'tmp/answer-review-9p-ex8-capture.json',
      'tmp/answer-review-9p-ex8-capture-promotion.json',
    ],
  },
});
meter.currentCheckpoint.unfinished = meter.currentCheckpoint.unfinished.filter(entry => !entry.startsWith('D017 '));
meter.currentCheckpoint.unfinished.push('D017 developing; exercise8 sourcecomplete7tasks and3faithfulbookcaptures,58canonicalphy9-c2-s1 sourcecomplete. Modernprose/figures/answers/choices pending;fig92 andolderblockers retained. No corpuscompletion/handoff/productionwrite.');
Object.assign(meter, {
  updatedAt: new Date().toISOString(), countsStale: false,
  sourcePagesFinalized: pages, writtenExercisesPreserved: tasks, modernCardsFinalized: ready,
});
await fs.writeFile(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
console.log(`D017 developing: ${pages} sourcepages,${tasks} source tasks,${captured} captured book answers. Delivered remains${meter.currentCheckpoint.completeDeliveredCards}.`);
