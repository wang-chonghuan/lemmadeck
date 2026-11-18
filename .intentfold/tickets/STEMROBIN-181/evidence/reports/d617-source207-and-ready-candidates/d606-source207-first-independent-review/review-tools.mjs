import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const author = path.join(path.dirname(own), 'd599-source207-first-author');
const incoming = path.join(path.dirname(own), 'd594-source206-first-independent-review/report.json');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const mode = file => (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0');
const write = (name, value) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const facts = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes), mode: mode(file) };
};
const walk = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);

const pinned = [
  ['report.json', '6444c37f47f6121165902a2a9b5efcbcb10a3369c249592e482823aa8eeebc2d'],
  ['author-freeze.json', '25798d219bd59e628c364689d7ab0d0629158c16bae5bbdacc7d0325edde488a'],
  ['source/10p/pages/0207/page.json', '46baffe6c29dcb72572ab76c8616d5ebdfd3fdcf49e816c5d54bf2de3e9b9411'],
  ['work/10p/pages/0207/figures/fig-181.png', '8ae9d01b8e1dbdbdc5d141df9e99540e75b6ffe580327466693ef955471b690b'],
  ['work/10p/pages/0207/figures/fig-181.svg', '234f31a5b1e5644ec7b4d203248adee30616a5e28f93c5635c674c3aabd0b752']
];

if (process.argv[2] === 'verify') {
  const freeze = read(path.join(author, 'author-freeze.json'));
  const pinnedChecks = pinned.map(([relative, expected]) => {
    const actual = facts(path.join(author, relative));
    return { ...actual, expected_sha256: expected, pass: actual.sha256 === expected };
  });
  const incomingFacts = facts(incoming);
  pinnedChecks.push({
    ...incomingFacts,
    expected_sha256: '8b357e2a1c14671bc3f5eed68cec881c5e5714689a0d0d950220c44cf47a1208',
    pass: incomingFacts.sha256 === '8b357e2a1c14671bc3f5eed68cec881c5e5714689a0d0d950220c44cf47a1208',
    scope: 'TEXT ONLY incoming local boundary authority; no page206 checks rerun'
  });
  const listed = freeze.files.map(entry => {
    if (!entry.path.startsWith(`${author}/`)) throw new Error('Freeze path escapes author root');
    const actual = facts(entry.path);
    return {
      ...actual,
      expected: { bytes: entry.bytes, sha256: entry.sha256, mode: entry.mode },
      pass: actual.bytes === entry.bytes && actual.sha256 === entry.sha256 && actual.mode === entry.mode
    };
  });
  const actualPaths = walk(author).sort();
  const listedPaths = freeze.files.map(entry => entry.path).sort();
  const nonSelfPaths = actualPaths.filter(file => file !== path.join(author, 'author-freeze.json'));
  const structural = {
    indexed_file_count: freeze.indexedFileCount,
    actual_listed_file_count: listed.length,
    actual_regular_files_including_self: actualPaths.length,
    expected_regular_files_including_self: freeze.totalRegularFilesIncludingSelf,
    duplicate_paths: new Set(listedPaths).size !== listedPaths.length,
    unlisted_nonself_files: nonSelfPaths.filter(file => !listedPaths.includes(file)),
    missing_listed_files: listedPaths.filter(file => !nonSelfPaths.includes(file)),
    author_freeze_mode: mode(path.join(author, 'author-freeze.json')),
    all_files_mode0444: actualPaths.every(file => mode(file) === '0444')
  };
  const reportFacts = facts(freeze.report.path);
  const reportEntryMatches = reportFacts.sha256 === freeze.report.sha256 && reportFacts.bytes === freeze.report.bytes;
  const pass = pinnedChecks.every(check => check.pass) && listed.every(check => check.pass)
    && reportEntryMatches && structural.indexed_file_count === listed.length
    && structural.actual_regular_files_including_self === structural.expected_regular_files_including_self
    && !structural.duplicate_paths && !structural.unlisted_nonself_files.length
    && !structural.missing_listed_files.length && structural.all_files_mode0444;
  write('input-verification.json', {
    schema: 'd606-author-freeze-verification@1',
    verified_at: new Date().toISOString(),
    status: pass ? 'PASS' : 'FAIL',
    independent_inventory_already_recorded: facts(path.join(own, 'independent-inventory.json')),
    pinned_checks: pinnedChecks,
    author_report_entry_matches: reportEntryMatches,
    structural,
    listed_files: listed
  });
  console.log(JSON.stringify({ status: pass ? 'PASS' : 'FAIL', listed_files: listed.length, ...structural }));
  process.exit(pass ? 0 : 1);
}

if (process.argv[2] === 'render') {
  const input = path.join(author, 'work/10p/pages/0207/figures/fig-181.svg');
  const output = path.join(own, 'raw181-svg-preview.png');
  const helper = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js');
  if (fs.existsSync(output)) throw new Error('Refusing to overwrite preview');
  if (facts(input).sha256 !== pinned[4][1]) throw new Error('SVG hash drift before render');
  const args = [helper, input, output];
  const started = new Date().toISOString();
  const result = spawnSync(process.execPath, args, {
    cwd: path.join(repo, '.claude/skills/ld-s10y-lesson'),
    encoding: 'utf8',
    timeout: 30000
  });
  write('svg-preview-render.json', {
    schema: 'd606-native-svg-preview@1',
    started_at: started,
    completed_at: new Date().toISOString(),
    isolation: 'Fresh synchronous resvg process; no browser, server, network or user desktop context',
    command: [process.execPath, ...args],
    helper: facts(helper),
    input: facts(input),
    output: fs.existsSync(output) ? facts(output) : null,
    exit_code: result.status,
    signal: result.signal,
    stdout: result.stdout,
    stderr: result.stderr,
    error: result.error?.message ?? null,
    visual_open_count_at_render: read(path.join(own, 'open-ledger.json')).loaded_image_total,
    not_performed: ['native finalize', 'vectorize', 'modern render', 'product display acceptance']
  });
  console.log(JSON.stringify({ exit_code: result.status, stdout: result.stdout, stderr: result.stderr }));
  process.exit(result.status === 0 ? 0 : 1);
}

if (process.argv[2] === 'compare') {
  const inventory = read(path.join(own, 'independent-inventory.json'));
  const sourcePath = path.join(author, 'source/10p/pages/0207/page.json');
  const source = read(sourcePath);
  const audit = read(path.join(author, 'source/10p/pages/0207/audit.json'));
  const authorInventory = read(path.join(author, 'source-inventory.json'));
  const normalizeVisible = text => text.replace(/\*\*/g, '').replace(/\$([ABC])\$/g, '$1')
    .replace(/。/g, '.').replace(/,/g, '，').replace(/\s+/g, '');
  const comparisons = inventory.independent_block_inventory.map(expected => {
    const index = expected.block - 1;
    const actual = source.blocks[index];
    const activeFlags = ['open', 'cont', 'samerow'].filter(flag => actual[flag]);
    const expectedLines = expected.kind === 'fig' ? []
      : expected.kind === 'cap' ? [expected.text]
        : expected.rows.map(row => inventory.source_rows.find(item => item.row === row).text);
    const lines = actual.lines.map((literal, lineIndex) => {
      const independentText = expectedLines[lineIndex];
      const footer = expected.kind === 'foot';
      return {
        native_pointer: `/blocks/${index}/lines/${lineIndex}`,
        source_ref: `p0207#${expected.block}`,
        source_row: expected.kind === 'cap' ? 6 : expected.rows[lineIndex],
        independent_text: independentText,
        native_literal: literal,
        semantic_visible_match: normalizeVisible(independentText)
          === normalizeVisible(footer ? literal.replaceAll('•', '') : literal),
        allowed_encoding_differences: footer
          ? 'Independent inventory separately identified decorative dots; native faithfully retains both dots.'
          : 'Markdown bold/math delimiters, typesetting whitespace, ASCII period and fullwidth prose comma only; no source characters corrected.'
      };
    });
    const pass = actual.kind === expected.kind
      && JSON.stringify(activeFlags) === JSON.stringify(expected.flags)
      && actual.lines.length === expectedLines.length && lines.every(line => line.semantic_visible_match);
    return {
      source_ref: `p0207#${expected.block}`,
      native_pointer: `/blocks/${index}`,
      expected_kind: expected.kind,
      native_kind: actual.kind,
      expected_flags: expected.flags,
      native_flags: activeFlags,
      expected_lines: expectedLines.length,
      native_lines: actual.lines.length,
      lines,
      pass
    };
  });
  const math = source.blocks.flatMap((block, index) => block.lines.flatMap((line, lineIndex) =>
    [...line.matchAll(/\$([^$]+)\$/g)].map(match => ({
      tex: match[1],
      source_ref: `p0207#${index + 1}`,
      native_pointer: `/blocks/${index}/lines/${lineIndex}`
    }))));
  const mathPass = JSON.stringify(math.map(item => item.tex)) === JSON.stringify(['A', 'B', 'C'])
    && math.every(item => item.source_ref === 'p0207#7');
  const authorRowComparisons = authorInventory.rows.map(item => {
    const independent = inventory.source_rows.find(row => row.row === item.row);
    return {
      row: item.row,
      author_ref: item.blockRef,
      author_literal: item.literal,
      independent_visible_match: normalizeVisible(independent.text)
        === normalizeVisible(item.footer ? item.literal.replaceAll('•', '') : item.literal)
    };
  });
  const counts = {
    blocks: source.blocks.length,
    prose_blocks: source.blocks.filter(block => block.kind === 'p').length,
    paragraph_objects: source.blocks.filter(block => block.kind === 'p' && !block.cont).length,
    prose_rows: source.blocks.filter(block => block.kind === 'p').reduce((sum, block) => sum + block.lines.length, 0),
    caption_rows: source.blocks.filter(block => block.kind === 'cap').reduce((sum, block) => sum + block.lines.length, 0),
    shared_caption_rows: source.blocks.filter(block => block.kind === 'cap' && block.samerow).length,
    footer_rows: source.blocks.filter(block => block.kind === 'foot').reduce((sum, block) => sum + block.lines.length, 0),
    native_printed_rows: source.meta.printed_lines,
    audit_printed_rows: audit.lines_printed,
    audit_md_rows: audit.lines_md,
    math_spans: math.length,
    figures: source.blocks.filter(block => block.kind === 'fig').length
  };
  const countsPass = counts.blocks === 8 && counts.prose_blocks === 5 && counts.paragraph_objects === 4
    && counts.prose_rows === 25 && counts.caption_rows === 1 && counts.shared_caption_rows === 1
    && counts.footer_rows === 1 && counts.native_printed_rows === 26
    && counts.audit_printed_rows === 26 && counts.audit_md_rows === 26
    && counts.math_spans === 3 && counts.figures === 1;
  const mdPath = path.join(author, 'source/10p/pages/0207/page.md');
  const md = fs.readFileSync(mdPath, 'utf8');
  const mdBody = md.slice(md.indexOf('\n---', 4) + 4).trim();
  const mdBlocks = [...mdBody.matchAll(/<!-- ([^\n]+?) -->\n([\s\S]*?)(?=\n<!-- |$)/g)];
  const mdComparisons = mdBlocks.map((match, index) => {
    const block = source.blocks[index];
    const literalLines = match[2].trim().split('\n').filter(line => line.length);
    const expectedLines = block.kind === 'fig' ? ['![图 181](figures/fig-181.png)'] : block.lines;
    return {
      source_ref: `p0207#${index + 1}`,
      header: match[1],
      kind_matches: match[1].split(' ')[0] === block.kind,
      literal_lines_match_json: JSON.stringify(literalLines) === JSON.stringify(expectedLines)
    };
  });
  const incomingReport = read(incoming);
  const incomingTail = incomingReport.outgoing_tail_and_open;
  const localBoundary = {
    authority: facts(incoming),
    consumed_scope: 'Only already accepted outgoing206 paragraph text and reference metadata; no page206 pixels, native commands, joins or tests executed',
    human_supplied_reference: 'p0206#15',
    authority_body_reference: incomingTail.native_ref,
    authority_body_pointer: incomingTail.native_pointer,
    authority_footer_reference: incomingTail.footer_ref,
    authority_footer_pointer: incomingTail.footer_pointer,
    full_final_sentence: incomingTail.full_final_sentence,
    expected_final_sentence: '艺术摄影的意义是人所共知的，电影就是艺术摄影的产物.',
    final_sentence_matches: incomingTail.full_final_sentence === '艺术摄影的意义是人所共知的，电影就是艺术摄影的产物.',
    accepted206_paragraph_closed: incomingTail.mid_sentence_open === false && incomingTail.native_open === false,
    supplied_pointer_discrepancy: incomingTail.native_ref !== 'p0206#15',
    resolution: 'Keep accepted TEXT authority. For downstream provenance use d594 body ref p0206#14, not footer p0206#15. No incoming cont is introduced in source207.',
    source207_first_block_cont: source.blocks[0].cont,
    source207_first_block_open: source.blocks[0].open,
    source207_first_line: source.blocks[0].lines[0],
    separate_new_paragraph: source.blocks[0].cont === false
  };
  const pass = comparisons.every(item => item.pass) && mathPass && countsPass
    && authorRowComparisons.length === 26 && authorRowComparisons.every(item => item.independent_visible_match)
    && mdComparisons.length === 8 && mdComparisons.every(item => item.kind_matches && item.literal_lines_match_json)
    && localBoundary.final_sentence_matches && localBoundary.accepted206_paragraph_closed
    && localBoundary.separate_new_paragraph;
  write('text-comparison.json', {
    schema: 'd606-independent-native-text-comparison@1',
    compared_at: new Date().toISOString(),
    status: pass ? 'PASS' : 'FAIL',
    independent_inventory: facts(path.join(own, 'independent-inventory.json')),
    source_page_json: facts(sourcePath),
    source_page_md: facts(mdPath),
    blocks: comparisons,
    md_json_literal_comparisons: mdComparisons,
    author_inventory_row_comparisons: authorRowComparisons,
    counts,
    counts_pass: countsPass,
    math,
    math_pass: mathPass,
    audit_issues: { errors: audit.errors, unknown_chars: audit.unknown_chars, katex_warnings: audit.katex_warnings },
    incoming_local_boundary: localBoundary,
    native_commands_rerun: 0,
    outgoing_hold: {
      source_ref: 'p0207#7',
      native_pointer: '/blocks/6/lines/5',
      exact_tail: '减小光圈的孔，可以使到照相机不',
      literal_tail_matches: source.blocks[6].lines[5].endsWith('减小光圈的孔，可以使到照相机不'),
      open: source.blocks[6].open,
      fulln78: false,
      next_page_guesses: 0
    }
  });
  console.log(JSON.stringify({
    status: pass ? 'PASS' : 'FAIL',
    counts,
    compared_text_rows_including_shared_caption: comparisons.reduce((sum, item) => sum + item.lines.length, 0),
    incoming_pointer_discrepancy: localBoundary.supplied_pointer_discrepancy,
    actual_incoming_body_reference: localBoundary.authority_body_reference
  }));
  process.exit(pass ? 0 : 1);
}

if (process.argv[2] === 'freeze') {
  const inputVerification = read(path.join(own, 'input-verification.json'));
  const inventoryFacts = facts(path.join(own, 'independent-inventory.json'));
  if (inventoryFacts.sha256 !== inputVerification.independent_inventory_already_recorded.sha256
    || inventoryFacts.mode !== '0444') {
    throw new Error('Pre-author independent inventory changed');
  }
  const comparison = read(path.join(own, 'text-comparison.json'));
  const pixels = read(path.join(own, 'pixel-comparison.json'));
  const render = read(path.join(own, 'svg-preview-render.json'));
  const report = read(path.join(own, 'report.json'));
  if (inputVerification.status !== 'PASS' || comparison.status !== 'PASS' || pixels.status !== 'PASS'
    || render.exit_code !== 0 || report.gates.SOURCE207.status !== 'PASS'
    || report.gates.RAW181.status !== 'PASS' || report.gates.SVG181.status !== 'PASS'
    || report.gates.OUTGOING207.status !== 'HOLD' || report.fulln78 !== false) {
    throw new Error('Review evidence or scope does not match report');
  }
  for (const file of inputVerification.listed_files) {
    const actual = facts(file.path);
    if (actual.sha256 !== file.sha256 || actual.bytes !== file.bytes || actual.mode !== file.mode) {
      throw new Error(`Author file changed during review: ${file.path}`);
    }
  }
  for (const check of inputVerification.pinned_checks) {
    if (facts(check.path).sha256 !== check.sha256) throw new Error(`Pinned input changed during review: ${check.path}`);
  }
  const ledger = read(path.join(own, 'open-ledger.json'));
  if (!ledger.completed || ledger.loaded_image_total > 8 || ledger.lifetime_total > 24
    || ledger.opens.length !== ledger.loaded_image_total
    || ledger.actual_visual_images_loaded_into_context + ledger.programmatic_decoder_reads !== ledger.loaded_image_total) {
    throw new Error('Image ledger incomplete or budget exceeded');
  }
  const files = walk(own).sort();
  for (const file of files) fs.chmodSync(file, 0o444);
  const entries = files.map(facts);
  write('review-freeze.json', {
    schema: 'd606-independent-review-freeze@1',
    frozen_at: new Date().toISOString(),
    owned_root: own,
    scope: 'D033 SOURCE207/RAW181/SVG181 FIRST independent review only',
    substantive_report: facts(path.join(own, 'report.json')),
    independent_inventory: facts(path.join(own, 'independent-inventory.json')),
    image_ledger: facts(path.join(own, 'open-ledger.json')),
    input_authority: inputVerification.pinned_checks,
    author_listed_bytes_rechecked_unchanged_at_freeze: true,
    files: entries,
    indexed_file_count: entries.length,
    all_regular_files_mode: '0444',
    self_entry_omitted_to_avoid_circular_hash: true,
    complete: true
  });
  fs.chmodSync(path.join(own, 'review-freeze.json'), 0o444);
  const allFiles = walk(own);
  const seal = read(path.join(own, 'review-freeze.json'));
  for (const entry of seal.files) {
    const actual = facts(entry.path);
    if (JSON.stringify(actual) !== JSON.stringify(entry)) throw new Error('Own freeze verification failed');
  }
  if (allFiles.length !== seal.files.length + 1 || !allFiles.every(file => mode(file) === '0444')) {
    throw new Error('Own freeze file count or mode verification failed');
  }
  for (const name of ['report.json', 'independent-inventory.json', 'open-ledger.json', 'input-verification.json', 'review-freeze.json']) {
    console.log(JSON.stringify(facts(path.join(own, name))));
  }
  process.exit(0);
}

throw new Error('Expected verify, render, compare or freeze');
