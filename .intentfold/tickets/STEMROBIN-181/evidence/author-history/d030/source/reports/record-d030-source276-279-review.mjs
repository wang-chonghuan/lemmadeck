import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-source276-279-author`;
const freezePath = `${folder}/author-freeze.json`;
const freeze = await read(freezePath);
await verify(freezePath, 'a4c27aed9ddf013acc9b18f7da84dca5b13f3512c8fba55aca9a91439f1118a2');
const observations = {
  276: {
    status: 'PASS', rows: 18,
    refs: ['p0276#1', 'p0276#2', 'p0276#3', 'p0276#4', 'p0276#5',
      'p0276#6', 'p0276#7', 'p0276#8', 'p0276#9', 'p0276#10',
      'p0276#11', 'p0276#12', 'p0276#13', 'p0276#14'],
    text: 'All three incoming112 rows, the113 heading, thermistor and photoresistor '
      + 'paragraphs and outgoing这表明 are present with literal punctuation and wraps. '
      + 'The -70 to +125 degreeC interval and the source几千米 claim are preserved, '
      + 'not converted into universal modern device specifications.',
    typography: 'The two lead terms are clearly distinct bold type, and the inline '
      + '热敏电阻 has four underdots. All three are marked. The remaining body has '
      + 'spatially uneven dark strokes within the same serif face, also varying inside '
      + 'characters and ordinary connective words; the full page and unscaled lower '
      + 'detail do not show an additional independently bounded emphasis run.',
    figures: [
      { id: 'fig-227', facts: 'One hatched vertical semiconductor rectangle; one dark '
        + 'right-side insert; one curved junction boundary; two horizontal leads; '
        + 'three complete leader labels. Original label pixels retained.',
        owner: '112, from incoming275 text; not113 merely because of the nearby heading.' },
      { id: 'fig-228', facts: 'One upright cylindrical diode can and flange, top and '
        + 'bottom leads, complete original body-stamp pixels.', owner: '112.' },
      { id: 'fig-229', facts: 'One closed series circuit with two-cell battery, an '
        + 'A-labelled circular ammeter, bottom rectangular resistor and a separate '
        + 'heat/flame illustration below it.', owner: '113, explicit prose reference.' },
    ],
    structure: '227/228 captions share one row. 229 caption shares the first radiation '
      + 'row; open/cont keeps利用射...加热 together. Last p is open to277.',
    necessaryCorrections: [],
  },
  277: {
    status: 'PASS', rows: 21,
    text: 'The incoming photoresistor paragraph closes. All three prose paragraphs, '
      + 'Russian/Chinese light caption, example heading, five task rows, five printed '
      + 'solution rows and foot are retained. R5cm, r0.5mm, t30min/1800s, charge density '
      + '0.01, A0.0635kg/mol, r much less thanR, area314cm2 and charge5652C match pixels.',
    typography: '光电效应 and光敏电阻 have their complete underdot spans, retained as '
      + 'strong markers. 例题 is a separate heading role. The solution lead解 is '
      + 'retained literally in the example; no additional bounded body emphasis '
      + 'is established from the irregular serif-stroke darkness.',
    figures: [
      { id: 'fig-230', facts: 'One series circuit with one battery, bottom resistor '
        + 'and upper circular meter; its pointer leans upper-left.', owner: '113.' },
      { id: 'fig-231', facts: 'One similar series circuit with upper meter pointer '
        + 'vertical and five upward-right light arrows toward the resistor. The '
        + 'in-figure Russian light word and separateСвет 光 caption are retained.',
        owner: '113.' },
    ],
    structure: 'Number captions230/231 share a row, butСвет 光 is its own row. '
      + 'Example1 contains both task and printed solution and remains open at铜的质量为.',
    margins: 'The rightmost narrow vertical black fragment alongside the final prose '
      + 'rows has no readable Chinese glyph or body-line structure. It is excluded '
      + 'from transcription, not guessed as neighboring-page text. Source pixels unchanged.',
    necessaryCorrections: [],
  },
  278: {
    status: 'FAIL', rows: 25,
    text: 'All25 actual printed rows are present: example1 tail, full example2 task '
      + 'and printed solution, exercise14 heading, full exercise1, open exercise2, '
      + 'and page number. Actual source m approximately1.9 times10^3kg is clearly '
      + 'positive3 in the original and unscaled detail; it must not become10^-3 '
      + 'during extraction. S andd both have10^-3, n has10^4, e has10^-19 and '
      + 'the source final voltage has10^-11.',
    typography: 'No underdot or distinct additional emphasis run is printed here. '
      + 'Exercise14 is a heading role; ordinary serif/body and mathematical type '
      + 'show uneven ink darkness, preserved literally rather than guessed as new strong spans.',
    figures: [
      { id: 'fig-232', facts: 'One rectangular series loop, capacitor at top, resistor '
        + 'at right and two-cell battery at bottom. All C/R/epsilon-form labels and '
        + 'both-cell polarity strokes are inside the rough coverage box.',
        owner: 'Example2 in113; caption shares the fifth task row.' },
    ],
    structure: 'Example1 cont closes afterkg. Example2 open/cont crosses232 without '
      + 'losing d= or n= line splits. Exercise14 starts a new TOC cardt18; exercise2 '
      + 'continues to279. Figure189 is an older referenced image, not a new local figure.',
    nativeCount: 'Original native26 versus authored25 remains FAIL. The extra band '
      + '2160..2184 lies below both the body and printed page number. Original full '
      + 'page and the exact unscaled bottom crop show only a corner smudge and '
      + 'scattered scanning dots, not text, figures or a footnote.',
    requiredCountingChange: {
      edge_margin_px: 110,
      reason: '独立SOURCE原页及未缩放底边局部确认：左右110px内无本页文字、图形、图题或页码；'
        + '正文与页码下方2160至2184的额外行带来自左下角扫描黑污及零星边缘点。仅排除计行'
        + '副本左右边缘，保留源像素、完整25印刷行和全部图框；须原生重计核对。',
      newCountNotYetRun: true,
      exclusions: 'This is not permission to change the source text, add rows, erase '
        + 'interior dots, extend the margin or alter figure pixels.',
    },
    necessaryCorrections: ['R278-EDGE-COUNT'],
    mathematicalScope: 'SOURCE PASS would preserve the printed positive3 and '
      + '1.4 times10^-11 result, not approve their physics. A later independent SCI '
      + 'must settle suspected printed numerical errors via the existing errata path.',
  },
  279: {
    status: 'PASS', rows: 25,
    text: 'Incoming exercise2 and all exercises3..16 match literal wording, punctuation '
      + 'and each physical wrap. Nickel task retains2h,25A,3 times10^-7kg/C, '
      + '8.9 times10^3kg/m3 and0.2m2. Last task retains500V/5000V and ends fully. '
      + 'The unusual chemistry wording and literal辉光放电 are retained, not silently corrected.',
    typography: 'No dotted, italic or independently bounded semantic emphasis is '
      + 'present in this exercise list. Numbered exercise roles and ordinary serif '
      + 'text are preserved; varying ink thickness is not converted into guessed bold spans.',
    figures: [],
    structure: 'No new heading, figure or outgoingopen. Exercise2 joins preceding在 '
      + 'to相同的时间内. Stable source numbers3..16 are neither subparts nor new answers.',
    metadata: 'Only repaired279 metadata is reviewed. Its rendered source hash '
      + 'matches the actual279 PNG; initial mismatched metadata and original receipt '
      + 'remain historical, not relabelled.',
    necessaryCorrections: [],
  },
};
const pages = [];
for (const page of freeze.pages) {
  await verify(page.reviewCandidate.path, page.reviewCandidate.sha256);
  await verify(page.sourceImage.path, page.sourceImage.sha256);
  const view = observations[page.pdfPage];
  assert.equal(page.candidateRows, view.rows);
  pages.push({
    pdfPage: page.pdfPage, printedPage: page.printedPage, ...view,
    candidate: page.reviewCandidate, source: page.sourceImage,
    nativeRows: page.nativeRows, candidateRows: page.candidateRows,
    sourceApproval: view.status === 'PASS',
    nativeReceipt: page.nativeReceipt ?? page.originalRowCountReceipt
      ?? freeze.initialNativeCountStdout,
    approvalLimits: 'Page text/structure and rough object coverage only. '
      + 'No exact snapped crop, vectorization, modern figure, whole-card or publication approval.',
  });
}
const imagePaths = [
  ...[276, 277, 278, 279].map(page =>
    `.tmp/ld-s10y-lesson/9p/pages/${String(page).padStart(4, '0')}/page.png`),
  `${folder}/details/0276.detail.png`,
  `${ticket}/tmp/d030-source276-279-review/0278-extra-bottom-band.png`,
  `${folder}/details/0277.detail.png`,
  `${folder}/details/0278.detail.png`,
];
const reportPath = `${ticket}/tmp/d030-source276-279-source-review.json`;
await immutableWrite(reportPath, `${JSON.stringify({
  schema: 'ld-s10y-source-review@1', ticket: 'STEMROBIN-181',
  book: '9p', date: '2026-11-16', status: 'SOURCE-FAIL-278-count-only',
  role: 'Main independent reviewer; did not author the frozen candidates.',
  freeze: await bind(freezePath), reviewComplete: true,
  imageAccounting: { batchImageOpens: 8, reopens: 0,
    priorContextImageOpens: 2, totalContextImageOpens: 10,
    allOriginalOrUnscaled: true,
    images: await Promise.all(imagePaths.map(bind)),
    noFurtherImageOpensInThisBatch: true },
  pages,
  effectivePassPages: [276, 277, 279], effectiveFailPages: [278],
  nativeEvidence: await Promise.all([
    `${folder}/native/count.stdout.txt`,
    `${folder}/repairs/count.stdout.json`,
    `${ticket}/tmp/d030-source276-279-review/0278-edge-pixel-measurement.json`,
  ].map(bind)),
  pixelMeasurementLimit: 'The first margin measurement used an over-strong assertion '
    + 'that all band ink would vanish and failed before any crop write. Actual '
    + 'measurement retains79 scattered black pixels inside110..1393; it does not '
    + 'erase them or claim zero remaining ink. Native counting must establish the '
    + 'new band result. One successful unscaled crop was opened.',
  limits: 'One independent new-source review; no old-source re-review. '
    + 'No finalized source pages, native counting rerun, vectorization, assembly, '
    + 'modern scientific approval, index/meter change, DB or Git action.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(reportPath)));
