import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck';
if (process.cwd() !== root) throw new Error('Exact isolated worktree required');
const out = path.join(root, '.tmp/stemrobin-184-resume/n8-offline-review');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const reportFile = path.join(out, 'report.json');
const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
if (report.screenshots.length !== 6 || !report.browserClosed || report.contextsClosed !== 6) {
  throw new Error('Incomplete first-run evidence; no browser retry authorized');
}
const observations = {
  'text-desktop': 'All eleven paragraphs, algebraic four-row proof, table in its original prose position, and complete two-class set proof are visible. No visually established missing math glyph. Table is unshrunk and nonblank.',
  'exercises-desktop': 'E70 header and complete Latin a)/b) formulas retained and separated. No collision or visibly broken formula; final return link visible.',
  'choices-desktop': 'Two questions and eight unselected native controls visible. A-D labels align independently of text; all four class lines are present in each second-question option. Class numerals visibly use the smaller prose font.',
  'text-mobile': 'Complete lesson continues below the fixed-width table. Table and aligned proof intentionally overflow their own horizontal scroll windows, not the document. Both proof classes and final recurrence are visible. No visually established missing math glyph.',
  'exercises-mobile': 'Complete a) and b) retained. The b) formula wraps below its label and has a measured reachable 15px horizontal scroll end. No letter/formula collision or document overflow.',
  'choices-mobile': 'A-D labels do not collide with wrapped options. All four class lines remain separated for each single-choice option; bottom option and final return link are present. Class numerals visibly use the smaller prose font.',
};
const ledger = {
  schema: 'ld-s10y-image/offline-observation-ledger@1',
  scope: 'STEMROBIN-184 B continuation 184-4; n8 whole-lesson offline review',
  screenshotsGenerated: 6, screenshotsOpened: 6, batchCount: 1, largestBatch: 6,
  budget: { maximum: 6, used: 6, remaining: 0, maximumPerBatch: 8 },
  sourceImages: 0, standaloneFigureImages: 0, reopens: 0, crops: 0,
  parentBudget: 'permanently 24/24; TEXT ONLY; must not reopen or receive image payloads',
  entries: report.screenshots.map(s => ({
    id: s.id, path: s.path, sha256: s.sha256, width: s.pixels.width, height: s.pixels.height,
    openedCount: 1, observation: observations[s.id],
  })),
};
const tableDisplay = report.surfaces.filter(s => s.id.startsWith('text-')).map(s => {
  const f = s.measurements.figures[0];
  const viewBox = f.viewBox.split(/\s+/).map(Number);
  const scale = Math.min(f.svgRect.width / viewBox[2], f.svgRect.height / viewBox[3]);
  const displayedSizes = [...new Set(f.labels.map(l => l.px * scale))];
  const p = s.measurements.paragraphs;
  return {
    surface: s.id, viewBox: f.viewBox, svgDisplay: f.svgRect,
    rawSvgFontSize: [...new Set(f.labels.map(l => l.px))], scale,
    effectiveLabelPx: displayedSizes, labelCount: f.labels.length,
    expectedPosition: 'after text paragraph 5, before text paragraph 6',
    exactProsePositionPass: f.rect.y >= p[4].rect.bottom && f.rect.bottom <= p[5].rect.y,
    effectiveFixedWidthAnd18pxPass: f.svgRect.width === 640 && displayedSizes.every(n => n === 18),
    scrollEnds: s.scrolling.find(x => x.id === f.id),
  };
});
const bindingNow = report.inputBindings.map(b => ({ ...b, currentSha256: hash(b.path), unchanged: hash(b.path) === b.sha256 }));
const rawFailures = report.checks.filter(c => c.status === 'fail');
const review = {
  schema: 'stemrobin-184/n8-offline-visual-adjudication@1',
  status: 'fail', createdAt: new Date().toISOString(),
  runCount: 1, repairs: 0, reruns: 0,
  rawMeasurementReport: { path: reportFile, sha256: hash(reportFile), summary: report.summary, immutable: true },
  inputSetSha256: report.inputSetSha256,
  bindingsNow: bindingNow,
  htmlCanonicalAndEvidenceInputsStillUnchanged: bindingNow.every(x => x.unchanged),
  confirmedFindings: [{
    priority: 2, status: 'fail',
    title: 'Four-class option numerals miss the required KaTeX_Main 1.10em typography',
    surface: 'choices.html, both viewports',
    countEachViewport: 16, selector: '.option-text .sr-prose-math',
    actual: { family: 'Songti SC and CJK serif fallbacks', px: 16.64, ratio: 1 },
    required: { family: 'KaTeX_Main', px: 18.304, ratio: 1.1 },
    diagnosis: 'View-only HTML emits sr-prose-math; embedded preview CSS defines prose-math, not sr-prose-math. The A-D labels inherit a correct independently styled option-letter, so they pass.',
    evidence: rawFailures.filter(c => c.id.startsWith('choices-')),
  }],
  measurementAdjudications: [
    {
      ids: rawFailures.filter(c => c.id.includes('fixed640')).map(c => c.id),
      status: 'measurement-false-positive-not-a-product-failure',
      reason: 'First-run script compared unscaled SVG computed font-size 36 to screen pixels 18. Existing saved viewport/viewBox measurements prove uniform scale 0.5, hence 18px screen text. No rerun or figure repair.',
      evidence: tableDisplay,
    },
    {
      ids: rawFailures.filter(c => c.id.includes('clipped-glyphs')).map(c => c.id),
      status: 'advisory-line-box-risk-not-confirmed-ink-loss',
      reason: 'Fifteen first-row glyph span boxes per text viewport extend 3.015625px above the nb scrolling box. Span line boxes alone do not prove ink loss; the once-opened full-page screenshots do not establish missing mathematical glyphs. Retain the raw warning without calling it a source/math defect.',
      actualKaTeXParseOrBlankFailures: 0,
      evidence: rawFailures.filter(c => c.id.includes('clipped-glyphs')),
    },
  ],
  passes: {
    exactCanonicalCoverage: '11 text paragraphs and 1 table in canonical order; both lesson proofs and both E70 a/b formulas preserved',
    exactHtmlViewCoverage: 'all six surfaces match supplied HTML semantic text and TeX annotations',
    mathRoots: '35 text, 2 exercise and 44 choice roots per viewport; KaTeX_Main root family and 1.10em all pass; native KaTeX_Math italic descendants retained',
    optionLayout: 'two questions, eight options, A-D labels, four independent lines per second-question option; no collision or hidden clipping',
    interactions: 'all four checkboxes checked cumulatively and individually unchecked; all four radios switch exclusively; no key/result or text change',
    reachability: 'all lesson regions, exercise content, eight controls and final links reachable; mobile table end282/282px; proof end97/97px; E70b end15/15px',
    documentOverflow: '1440/1440 desktop and 390/390 mobile on all three surfaces',
    assets: 'inline data fonts and inline SVG; pixel checks nonblank; no remote requests or missing images',
    errors: 'zero console errors, page errors, failed requests or blocked external attempts across six contexts',
  },
  visualReview: { status: 'completed-fail', imagesOpened: 6, observations },
  browserRelease: { browserClosed: report.browserClosed, contextsClosed: report.contextsClosed },
  scopeLimits: [
    'Offline preview evidence only; not live app, Gate2, source/math reapproval or publication approval.',
    'Approved table geometry, labels and source-bound mathematics reused without re-solving or reopening source/figure images.',
    'No content, canonical, application or skill edits; no keys, choice-author internals, installs, .env, services, DB, publishers, Git, old workers, other tasks or supervisor messages.',
    'All review writes remain in the owned n8-offline-review directory.',
  ],
  imageLedger: { path: path.join(out, 'images-ledger.json') },
};
fs.writeFileSync(path.join(out, 'images-ledger.json'), `${JSON.stringify(ledger, null, 2)}\n`, { flag: 'wx' });
review.imageLedger.sha256 = hash(path.join(out, 'images-ledger.json'));
fs.writeFileSync(path.join(out, 'review.json'), `${JSON.stringify(review, null, 2)}\n`, { flag: 'wx' });
const lines = [
  '# n8 Whole-Lesson Offline Layout Review',
  '',
  '**FAIL.** First whole-lesson check for STEMROBIN-184 B continuation 184-4. One run, no repair or retry. This is not source/math or production approval.',
  '',
  '## Confirmed Finding',
  '',
  '- **P2: choice four-class numerals use the wrong font and scale.** Sixteen `3/2/1/0` labels per viewport in `.option-text .sr-prose-math` render in Songti/CJK serif at 16.64px (1.00em), not KaTeX_Main at 18.304px (1.10em). The view HTML emits `sr-prose-math`, while its CSS only defines `prose-math`. A-D labels already inherit the correctly styled `option-letter` and pass.',
  '',
  '## Measurement Diagnosis',
  '',
  '- Raw first-run evidence remains unchanged: 122 pass / 6 fail. Two failures are the confirmed numeral defect, repeated across viewports.',
  '- Two table sizing flags are measurement false positives: SVG font-size36 is in the 1280x780 viewBox; its actual 640x390 screen box scales by0.5, giving exactly18px labels. No table repair or review replay is warranted.',
  '- Two aligned-proof flags are retained line-box warnings: fifteen span boxes per viewport begin3.015625px above the `.nb` scroll box. The once-opened screenshots do not establish lost ink; these are not confirmed mathematical render failures. No KaTeX error, missing formula or blank math occurred.',
  '',
  '## Passing Evidence',
  '',
  '- Exact canonical coverage: all12 prose entries, consisting of11 complete paragraphs and the table in its canonical position; full algebraic and two-class set proofs; E70 with complete Latin a)/b) formulas.',
  '- Exact supplied-HTML view coverage across all six pages. Per viewport, all35 text,2 exercise and44 choice KaTeX roots use KaTeX_Main1.10em; native italic math descendants remain normal KaTeX typography.',
  '- Two questions/eight options; A-D labels separate from controls/text; all four class lines per second-question option remain present, ordered and collision-free.',
  '- Every checkbox checked cumulatively then individually unchecked; every radio selected exclusively. No key, result, script, text change or judging operation.',
  '- Table fixed640x390 with77 displayed18px labels. Mobile end282/282px exposes the SVG right boundary. Aligned proof scroll97/97px and E70b scroll15/15px are reachable; edge occlusion is intentional horizontal scrolling, not document overflow.',
  '- All lesson regions, exercise content, controls and final navigation reachable. Documents remain1440px desktop/390px mobile with no horizontal overflow.',
  '- Inline fonts/SVG and pixel checks nonblank; zero console/page errors, failed requests, remote calls or missing images.',
  '',
  '## Evidence',
  '',
  `Owned directory: ${out}`,
  '',
  '- `check.mjs`: first-run isolated offline Playwright check, protected by `first-run.lock`.',
  '- `report.json`: complete raw DOM measurements, assertions, errors, pixel checks, interactions, scrolling, input and screenshot bindings; retained without editing.',
  '- `review.json`: visual adjudication and scale-aware diagnosis, linked to raw report hash.',
  '- `images-ledger.json`: six screenshots opened once each in one batch; no source/figure images, crops or reopens.',
  '- `finish-evidence.mjs`: report-only evidence finalization; does not launch a browser or rerun checks.',
  '',
  `Input-set SHA-256: ${report.inputSetSha256}`,
  `Raw report SHA-256: ${hash(reportFile)}`,
  `Review JSON SHA-256: ${hash(path.join(out, 'review.json'))}`,
  '',
  'HTML/canonical SHA-256 bindings:',
  ...report.inputBindings.slice(0, 6).map(b => `- \`${path.basename(b.path)}\` (${b.path.includes('/offline/') ? 'HTML preview' : 'canonical'}): \`${b.sha256}\``),
  '',
  'Screenshot files (all fullpage, absolute paths/hashes in report and ledger):',
  ...report.screenshots.map(s => `- \`${path.basename(s.path)}\` ${s.pixels.width}x${s.pixels.height}: \`${s.sha256}\``),
  '',
  '**STOP:** no repair or retry. Chromium and all6 fresh contexts explicitly closed. Reviewer images6/6, one batch6/8, reopens0; parent remains permanently24/24 and receives TEXT ONLY. Inputs remained unchanged throughout the browser run and evidence finalization. Writes only in the owned directory; no application/skill/canonical edits, installs, .env, services, DB/publisher, keys/author internals, Git, workers, other tasks or supervisor messages.',
];
fs.writeFileSync(path.join(out, 'review.md'), `${lines.join('\n')}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: review.status, confirmedFindings: review.confirmedFindings.length,
  inputsUnchanged: review.htmlCanonicalAndEvidenceInputsStillUnchanged,
  reports: ['report.json', 'review.json', 'review.md', 'images-ledger.json'].map(name => ({ path: path.join(out, name), sha256: hash(path.join(out, name)) })),
  imageUse: '6/6 opened once, 6/8 single batch, parent permanently24/24',
  browserClosed: report.browserClosed, contextsClosed: report.contextsClosed,
}, null, 2));
