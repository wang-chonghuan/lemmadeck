import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { verifyPhaseEvidence } from './source-evidence.mjs';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const phasePath = '.intentfold/tickets/STEMROBIN-181/tmp/d1817-source338341-review/phase1-observation.json';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
assert.equal(hash(phasePath), 'e35e4dc71acd8f099db4444f57a17c56d283b64fae5b28c5166030990a4250e5');
const phase = read(phasePath);
const evidence = verifyPhaseEvidence(phase);
assert.equal(evidence.length, 18);
assert.equal(phase.image_usage.total, 8);
assert.equal(phase.image_usage.reopens, 0);
const encoding = [];
function span(item, nested = false) {
  const result = { block: item.block, line: item.line, start: item.start, end: item.end,
    text: item.stored_substring };
  if (nested) {
    result.start = { block: item.block, line: item.line, column_1based: item.start };
    result.end = { block: item.block, line: item.line, column_1based_inclusive: item.end };
  }
  return result;
}
const pages = phase.pages.map(page => {
  const blocks = page.blocks.map(block => {
    const lines = [...block.printed_lines];
    if (block.kind === 'h3' && /^\$\d+\$\./.test(lines[0])) {
      const before = lines[0];
      lines[0] = lines[0].replace(/^\$(\d+)\$/, '$1');
      encoding.push({ block: block.id, before, after: lines[0],
        reason: 'Identified heading number is prose metadata, not a mathematical formula; only delimiters removed.' });
    }
    assert.equal(lines.length, block.line_count);
    return { ...block, lines, flags: { cont: !!block.cont, open: !!block.open,
      samerow: !!block.samerow, footnote: !!block.footnote || block.subkind === 'footnote' },
    heavy_spans_certain: phase.emphasis.certain_maximal_bold_spans
      .filter(item => item.block === block.id).map(item => span(item)),
    under_dot_spans_certain: phase.emphasis.certain_maximal_underdot_spans
      .filter(item => item.block === block.id).map(item => span(item, true)) };
  });
  const figures = phase.native_figure_inventories.filter(figure =>
    figure.source_page === page.page).map(figure => ({
    ...figure, printed_id: figure.printed_figure_id === null ? '' : `图 ${figure.printed_figure_id}`,
    approx_native_box_xywh: figure.box_xywh_rough,
  }));
  for (const figure of figures) {
    blocks.find(block => block.id === figure.block).figure_id = figure.printed_id;
    if (figure.caption_block) blocks.find(block => block.id === figure.caption_block).figure_id = figure.printed_id;
  }
  return { ...page, book: '10p', printed_page: Number(page.printed_page), blocks, figures,
    line_accounting: { unique_physical_lines: page.manual_line_count.unique_printed_rows } };
});
const normalizedPath = `${scratch}/d041-source338341-normalized.json`;
fs.writeFileSync(normalizedPath, JSON.stringify({
  schema: 'STEMROBIN-181/source-observation-schema-adapter@1', batch: 'D041', book: '10p',
  originalPhase: bind(phasePath), pages, evidence: [bind(phasePath), ...evidence],
  encoding, unresolvedHolds: phase.remaining_holds, boundaries: phase.boundaries,
  image_usage: phase.image_usage, independentNewObservation: false, sourceCardApproval: false,
}, null, 2) + '\n', { flag: 'wx' });
const decisionPath = `${scratch}/d041-source338340-decisions.json`;
fs.writeFileSync(decisionPath, JSON.stringify({
  batch: 'D041', root: '.tmp/STEMROBIN-181/d1817/root',
  phases: [bind(normalizedPath)],
  pages: [338, 339, 340].map(page => ({
    page, phase: normalizedPath, dotEncoding: 'metadata-not-literal-dots',
    notes: [
      'Mechanically adapted frozen SOURCE338341 schema; original report and exact pixel/evidence hashes retained.',
      'Native page candidate only; no modern, figure or whole-card approval.',
      ...phase.remaining_holds.filter(hold => hold.block?.startsWith(`p0${page}#`) ||
        (page === 340 && hold.figure === '264')).map(hold => ({ type: 'source-hold', ...hold })),
      ...(page === 340 ? [
        'Unit130 starts at340#5 and remains open; source341 has explicit unidentified glyphs and has no page candidate.',
        { type: 'observed-typeface', observations: phase.emphasis.other_typeface_observation },
        { type: 'heading-number-encoding', changes: encoding },
        { type: 'footnote-encoding', block: 'p0340#11', observedSubkind: 'footnote',
          nativeFlag: 'p footnote', owner: pages.find(item => item.physical_page === 340)
            .blocks.find(item => item.id === 'p0340#11').owner,
          reason: 'Preserve the explicit observed footnote classification and marker-bound unit129 ownership.' },
      ] : []),
    ],
  })),
  receipt: `${scratch}/d041-source338340-first-author.json`,
}, null, 2) + '\n', { flag: 'wx' });
const collectionPath = `${scratch}/d041-source338341-collected.json`;
fs.writeFileSync(collectionPath, JSON.stringify({
  batch: 'D041', phase: bind(phasePath), bindings: evidence,
  normalized: bind(normalizedPath), decisions: bind(decisionPath),
  closedAgent: '01a1f570-60d3-7040-85f0-342e7f8b9b68',
  imageUsage: { originals: 4, crops: 4, reopens: 0, total: 8, parentCumulative: 24, parentNewOpens: 0 },
  lineCounts: phase.line_count_totals.page_counts, holds: phase.remaining_holds,
  excludedPage: { page: 341, reason: 'Explicit unresolved glyph placeholders; observation-only, no native candidate.' },
  parserCoverage: 'First generic read bound only four original images. Added explicit phase.bindings and per-page initial/corrections/crop traversal; all18 actual bindings verified, with no images or reviews repeated.',
  sourceApproval: false, addedDeliveredCards: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ collected: bind(collectionPath), normalized: bind(normalizedPath),
  decisions: bind(decisionPath), candidatePages: [338, 339, 340], excludedPage: 341 }));
