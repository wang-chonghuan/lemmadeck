import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { verifyPhaseEvidence } from './source-evidence.mjs';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const decisionPath = process.argv[2];
assert(decisionPath, 'Explicit author decisions required');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const decision = read(decisionPath);
assert.equal(decision.batch, 'D041');
assert.equal(decision.root, '.tmp/STEMROBIN-181/d1817/root');
const phases = new Map();
for (const file of decision.phases) {
  assert.equal(hash(file.path), file.sha256);
  const phase = read(file.path);
  verifyPhaseEvidence(phase);
  phases.set(file.path, phase);
}

function emphasize(lines, spans, blockId) {
  const intervals = lines.map(() => []);
  for (const span of spans) {
    const firstPosition = typeof span.start === 'number'
      ? { block: span.block, line: span.line, column_1based: span.start }
      : span.start;
    const lastPosition = typeof span.end === 'number'
      ? { block: span.block, line: span.line, column_1based_inclusive: span.end }
      : span.end;
    assert.equal(firstPosition.block, blockId);
    assert.equal(lastPosition.block, blockId);
    const start = firstPosition.line - 1;
    const end = lastPosition.line - 1;
    assert(start >= 0 && end >= start && end < lines.length);
    const selected = [];
    for (let line = start; line <= end; line++) {
      const chars = Array.from(lines[line]);
      const first = line === start ? firstPosition.column_1based - 1 : 0;
      const last = line === end ? lastPosition.column_1based_inclusive : chars.length;
      assert(Number.isInteger(first) && Number.isInteger(last));
      assert(first >= 0 && last > first && last <= chars.length);
      intervals[line].push([first, last]);
      selected.push(chars.slice(first, last).join(''));
    }
    assert.equal(selected.join(''), span.text.replaceAll('\n', ''), `Emphasis binding: ${blockId}`);
  }
  return lines.map((line, index) => {
    const ranges = intervals[index].sort((a, b) => b[0] - a[0]);
    const chars = Array.from(line);
    let lastStart = chars.length;
    for (const [start, end] of ranges) {
      assert(end <= lastStart, `Overlapping emphasis: ${blockId}/${index + 1}`);
      chars.splice(end, 0, '**');
      chars.splice(start, 0, '**');
      lastStart = start;
    }
    return chars.join('');
  });
}

const records = [];
for (const author of decision.pages) {
  const phase = phases.get(author.phase);
  assert(phase, 'Page phase must be bound');
  const pages = phase.pages || phase.phase1?.pages;
  assert(Array.isArray(pages), 'Phase must expose frozen source records');
  const observed = pages.find(page => page.physical_page === author.page);
  assert(observed, `Missing source observation: ${author.page}`);
  assert.equal(observed.book, '10p');
  assert.equal(hash(observed.source.path), observed.source.sha256);
  const number = String(author.page).padStart(4, '0');
  const prepared = `.tmp/ld-s10y-lesson/10p/pages/${number}/page.template.md`;
  const match = /^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(prepared, 'utf8'));
  assert(match);
  const meta = JSON.parse(match[1]);
  assert.equal(meta.source.pdf_page, author.page);
  assert.equal(meta.render.sha256, observed.source.sha256);
  meta.printed_page = observed.printed_page;
  meta.notes = [
    'D041 candidate from hash-bound independent observation. Native finalization is not SOURCE approval.',
    ...(author.notes || []),
  ];
  if (author.retainDiplomaticMathShapes) {
    meta.notes.push({
      type: 'diplomatic-math-shapes',
      shapes: observed.formula_shapes || [],
      holds: observed.holds || [],
      basis: 'Exact observed glyph strings retained in scratch; mathematical layout and held codepoint identities are not approved.',
    });
  }
  const body = [];
  for (const [index, block] of observed.blocks.entries()) {
    assert.equal(block.id, `p${number}#${index + 1}`);
    assert.equal(block.lines.length, block.line_count);
    assert(!block.lines.some(line => /⟦HOLD:|\[(?:UNRESOLVED|UNKNOWN|a-SHAPED)/.test(line)),
      `Unidentified source glyphs have no page candidate: ${block.id}`);
    const underdots = block.under_dot_spans_certain || [];
    if (underdots.length) {
      assert.equal(author.dotEncoding, 'metadata-not-literal-dots',
        'Underdots require the retained source metadata convention');
      emphasize(block.lines, underdots, block.id);
      for (const span of underdots) {
        const ranges = [];
        for (let line = span.start.line; line <= span.end.line; line++) {
          const chars = Array.from(block.lines[line - 1]);
          const start = line === span.start.line ? span.start.column_1based : 1;
          const end = line === span.end.line ? span.end.column_1based_inclusive : chars.length;
          ranges.push({
            line, character_range_1based_inclusive: [start, end],
            text: chars.slice(start - 1, end).join(''),
          });
        }
        meta.notes.push({
          type: 'dot-emphasis', block: block.id, text: span.text,
          line_range: [span.start.line, span.end.line], ranges,
          position: 'Under the recorded source characters; punctuation follows the exact observed endpoints.',
          basis: 'Hash-bound SOURCE observation. Retained page0176 metadata convention; no literal dots or inferred bold.',
        });
      }
    }
    let header = block.kind;
    if (block.flags?.footnote) {
      assert.equal(block.kind, 'p', 'Explanatory footnotes remain prose');
      header += ' footnote';
    }
    if (block.kind === 'fig') {
      const figure = observed.figures.find(item => item.block === block.id);
      assert(figure, `Missing independent figure inventory: ${block.id}`);
      const box = figure.approx_native_box_xywh;
      assert(Array.isArray(box) && box.length === 4 && box.every(Number.isInteger));
      const label = author.figureLabels?.[block.id] ?? block.figure_id ?? figure.printed_id ?? '';
      header += ` ${label} box ${box.join(',')}`;
      if (block.owner_ex != null) header += ` owner-ex ${block.owner_ex}`;
    } else if (block.kind === 'cap') {
      const label = block.figure_id ?? block.lines.join('');
      assert(observed.figures.some(figure => figure.printed_id === label ||
        author.figureLabels?.[figure.block] === label), `Unbound caption: ${block.id}`);
      header += ` ${label}`;
    } else if (block.kind === 'ex') {
      assert(block.number != null);
      header += ` ${block.number}`;
    }
    for (const flag of ['cont', 'open', 'samerow']) {
      if (block.flags?.[flag]) header += ` ${flag}`;
    }
    const spans = /^(h[123]|exhead)$/.test(block.kind) ? [] : (block.heavy_spans_certain || []);
    const lines = emphasize([...block.lines], spans, block.id);
    assert(lines.every(line => !/\[(?:UNRESOLVED|UNKNOWN|a-SHAPED)/.test(line)));
    body.push(`<!-- ${header} -->`, ...lines, '');
  }
  const output = `${decision.root}/10p/pages/${number}/page.md`;
  assert(!fs.existsSync(output), 'Preserve existing source candidates');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `---\n${JSON.stringify(meta, null, 2)}\n---\n\n${body.join('\n')}`, { flag: 'wx' });
  records.push({
    page: author.page, phase: bind(author.phase), source: observed.source,
    output: bind(output), expectedPrintedLines: observed.line_accounting.unique_physical_lines,
    candidateOnly: true, sourceApproval: false,
  });
}
assert(decision.receipt && !fs.existsSync(decision.receipt));
fs.writeFileSync(decision.receipt, JSON.stringify({
  batch: 'D041', decision: bind(decisionPath), records,
  parentNewImageOpens: 0, addedCards: 0, canonicalAuthoring: false, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ receipt: bind(decision.receipt), pages: records.map(row => row.page) }));
