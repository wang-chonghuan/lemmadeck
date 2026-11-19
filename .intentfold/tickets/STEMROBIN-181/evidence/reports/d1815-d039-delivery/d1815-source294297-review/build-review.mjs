import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck';
const out = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1815-source294297-review');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = relative => {
  const bytes = fs.readFileSync(path.join(root, relative));
  return {path: relative, bytes: bytes.length, sha256: hash(bytes)};
};
const freezeNames = [
  'source294.freeze.json', 'source295.freeze.json', 'source296.freeze.json',
  'source297.freeze.json', 'raw238.freeze.json', 'raw239.freeze.json',
  'rawportrait.freeze.json',
];
const freezes = freezeNames.map(name => {
  const absolute = path.join(out, name);
  if ((fs.statSync(absolute).mode & 0o222) !== 0) throw new Error(`Writable freeze: ${name}`);
  return {name, binding: bind(path.relative(root, absolute)), data: JSON.parse(fs.readFileSync(absolute, 'utf8'))};
});
const imageList = freezes.map(({data}) => {
  const current = bind(data.image.path);
  if (current.sha256 !== data.image.sha256 || current.bytes !== data.image.bytes) {
    throw new Error(`Image bytes changed after the one permitted view: ${data.image.path}`);
  }
  return {...data.image, sequence: data.sequence, phase: data.phase, current_binding_matches: true};
});
if (imageList.length !== 7 || new Set(imageList.map(x => x.path)).size !== 7 ||
    imageList.some(x => x.view_count !== 1)) throw new Error('Image budget mismatch');

const canonical = [];
for (const page of [294, 295, 296, 297]) {
  const base = `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${String(page).padStart(4, '0')}`;
  const files = {};
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const relative = `${base}/${name}`;
    const bytes = fs.readFileSync(path.join(root, relative));
    files[name] = {binding: {path: relative, bytes: bytes.length, sha256: hash(bytes)}, literal_utf8: bytes.toString('utf8')};
  }
  const parsed = JSON.parse(files['page.json'].literal_utf8);
  const audit = JSON.parse(files['audit.json'].literal_utf8);
  const mdLines = files['page.md'].literal_utf8.split('\n');
  const headings = mdLines.flatMap((line, index) => /^<!--.*-->$/.test(line) ? [index] : []);
  if (headings.length !== parsed.blocks.length) throw new Error(`MD/JSON block count differs: ${page}`);
  const blocks = parsed.blocks.map((block, index) => {
    const first = headings[index] + 1;
    const end = headings[index + 1] ?? mdLines.length;
    const textRows = mdLines.slice(first, end).flatMap((line, offset) => line.length ? [{text: line, md_line: first + offset + 1}] : []);
    if (block.kind !== 'fig' && JSON.stringify(textRows.map(x => x.text)) !== JSON.stringify(block.lines)) {
      throw new Error(`MD/JSON rows differ: ${page}#${index + 1}`);
    }
    return {...block, block: index + 1, md_header_line: headings[index] + 1, md_rows: textRows};
  });
  const source = freezes.find(x => x.data.phase === 'SOURCE' && x.data.sequence === page - 293).data;
  if (parsed.meta.render.sha256 !== source.image.sha256) throw new Error(`Source binding mismatch: ${page}`);
  canonical.push({page, files, meta: parsed.meta, blocks, audit});
}

const findings = [
  {id: 'S294-PUNCT-1', phase: 'SOURCE', judgment: 'FAIL', page: 294, rows: ['s294-r04'], refs: [{block: 1, line: 4}], dimension: 'punctuation', source: '透明的，在两个电极上加上', canonical: '透明的. 在两个电极上加上', observation: 'The independent SOURCE reading has a comma after 透明的; canonical substitutes a sentence dot and space.'},
  {id: 'S294-PUNCT-2', phase: 'SOURCE', judgment: 'FAIL', page: 294, rows: ['s294-r05'], refs: [{block: 1, line: 5}], dimension: 'punctuation', source: '电压；这个电压可以用电位', canonical: '电压，这个电压可以用电位', observation: 'SOURCE semicolon is replaced by a comma.'},
  {id: 'S294-TEXT-1', phase: 'SOURCE', judgment: 'FAIL', page: 294, rows: ['s294-r10'], refs: [{block: 4, line: 1}], dimension: 'literal', source: '子，电子在电场中运动时就形成', canonical: '子，电子在电场中运动时就形', observation: 'Pixels settle the terminal as two glyphs 形成. Canonical omits 成. The next SOURCE row begins 了电流.'},
  {id: 'S294-EMPH-1', phase: 'SOURCE', judgment: 'FAIL', page: 294, rows: ['s294-r12', 's294-r13'], refs: [{block: 4, line: 3}, {block: 4, line: 4}], dimension: 'emphasis', source: ['增大两电极间的电势差，', '则电流强度就增大.'], canonical: 'Both phrases are plain text in page.md and page.json.', observation: 'Two SOURCE bold phrases are not retained. The separate 饱和电流 emphasis is retained.'},
  {id: 'S294-QUOTE-HOLD', phase: 'SOURCE', judgment: 'HOLD', page: 294, rows: ['s294-r22'], refs: [{block: 8, line: 5}], dimension: 'literal', source: '《软铁磁化作用的研究》', canonical: '«软铁磁化作用的研究»', observation: 'Immutable independent reading and canonical delimiters disagree. Single full-page reading does not reliably distinguish these small doubled angle forms. This may be a freeze transcription error, not a canonical defect; no guessed replacement.'},
  {id: 'S295-TEXT-1', phase: 'SOURCE', judgment: 'FAIL', page: 295, rows: ['s295-r16'], refs: [{block: 6, line: 1}], dimension: 'literal', source: '当改变光强度时，如实验证明的，截止电压不变化；这', canonical: '当改变光强度时，如实验所证明的，截止电压不变化；这', observation: 'Canonical inserts 所 relative to the frozen SOURCE reading. Do not grammatically improve the historical sentence.'},
  {id: 'S295-OBJECT-1', phase: 'SOURCE', judgment: 'FAIL', page: 295, rows: ['s295-r14', 's295-r15'], refs: [{block: 4, line: 3}, {block: 5, line: 1}], dimension: 'object', source: 'The colon and centered mv^2/2=eU截 formula are one cutoff-energy paragraph.', canonical: 'Block 4 is closed; block 5 is a fresh closed p, without cont.', observation: 'Canonical partitions one frozen object into two unrelated closed paragraphs. Preserve the formula as the continuation of its introducing paragraph; this is an object finding, not a formula/science correction.'},
  {id: 'S296-OBJECT-1', phase: 'SOURCE', judgment: 'FAIL', page: 296, rows: ['s296-r11', 's296-r12'], refs: [{block: 3, line: 5}, {block: 4, line: 1}], dimension: 'object', source: 'The proportionality explanation ending in a colon and E=hν (10.1) are one paragraph.', canonical: 'Block 3 closed, block 4 fresh closed p.', observation: 'The displayed equation is separated from the same source object without open/cont.'},
  {id: 'S296-TEXT-HOLD', phase: 'SOURCE', judgment: 'HOLD', page: 296, rows: ['s296-r18'], refs: [{block: 5, line: 6}], dimension: 'literal', source: '在以后的传播过程中都保', canonical: '在以后光的传播过程中都保', observation: 'Independent freeze and canonical disagree on 的 versus 光的. The initial freeze may have missed a small glyph; canonical must not prime an amended freeze. HOLD, not a guessed edit or a confirmed canonical omission.'},
  {id: 'S296-PUNCT-HOLD', phase: 'SOURCE', judgment: 'HOLD', page: 296, rows: ['s296-r23'], refs: [{block: 6, line: 3}], dimension: 'punctuation', source: 'Terminal mark after 所以 unresolved before canonical read.', canonical: '金属中脱出需要做的功. 所以', observation: 'Preserve original ambiguity. No crop/reopen was made and no terminal punctuation is guessed. The OPEN object boundary itself is settled.'},
  {id: 'S297-OBJECT-1', phase: 'SOURCE', judgment: 'FAIL', page: 297, rows: ['s297-r10', 's297-r11'], refs: [{block: 3, line: 4}, {block: 4, line: 1}], dimension: 'object', source: '大于这个功： introduces hν>A in the same threshold paragraph.', canonical: 'Both blocks are fresh closed p objects.', observation: 'The introduced inequality is not connected to its source paragraph by open/cont.'},
  {id: 'S297-PERIOD-1', phase: 'SOURCE', judgment: 'FAIL', page: 297, rows: ['s297-r11'], refs: [{block: 4, line: 1}], dimension: 'period_space', source: '$h\\nu>A$. ', canonical: '$h\\nu>A$.', observation: 'SOURCE dot normalization requires period plus space; the canonical formula row omits the trailing space. Do not change the inequality.'},
  {id: 'S297-OBJECT-2', phase: 'SOURCE', judgment: 'FAIL', page: 297, rows: ['s297-r12', 's297-r13', 's297-r14', 's297-r15'], refs: [{block: 5, line: 1}, {block: 6, line: 1}, {block: 7, line: 1}, {block: 7, line: 2}], dimension: 'object', source: 'Red-limit introduction, equation (10.3), and flush-left explanation form one frozen source paragraph.', canonical: 'Blocks 5, 6, 7 are three fresh closed p objects.', observation: 'No open/cont preserves the equation and non-indented explanation inside their source object.'},
  {id: 'S297-MATERIAL-HOLD', phase: 'SOURCE', judgment: 'HOLD', page: 297, rows: ['s297-r19'], refs: [{block: 9, line: 1}], dimension: 'literal', source: '铂和铁', canonical: '铝和铁', observation: 'The immutable independent reading selected 铂; canonical has 铝. The small right-hand component was not securely distinguished in the permitted reading. This may be a freeze error. HOLD; no scientific inference, no guessed metal substitution.'},
  {id: 'S297-PUNCT-1', phase: 'SOURCE', judgment: 'FAIL', page: 297, rows: ['s297-r19'], refs: [{block: 9, line: 1}], dimension: 'punctuation', source: '比锌的大，所以', canonical: '比锌的大. 所以', observation: 'Independent SOURCE punctuation reading is a comma; canonical substitutes a sentence dot plus space. The separately ambiguous material glyph is not settled by this punctuation finding.'},
];

const sourceMaps = {
  294: [[1,1,9], [4,1,5], [7,1,3], [8,1,8], [10,1,1]],
  295: [[1,1,1], [2,1,4], [3,1,6], [4,1,3], [5,1,1], [6,1,4], [7,1,4]],
  296: [[1,1,1], [2,1,5], [3,1,5], [4,1,1], [5,1,8], [6,1,3]],
  297: [[1,1,1], [2,1,5], [3,1,4], [4,1,1], [5,1,1], [6,1,1], [7,1,2], [8,1,3], [9,1,3], [10,1,2]],
};
const semanticText = text => text.replaceAll('**', '').replace(/\\text\{([^{}]*)\}/g, '$1')
  .replace(/[ \t\u3000]+(?=\$)/g, '').replace(/(?<=\$)[ \t\u3000]+(?=[A-Za-z\u3400-\u9fff（])/g, '');
const rank = statuses => statuses.includes('FAIL') ? 'FAIL' : statuses.includes('HOLD') ? 'HOLD' : 'PASS';
const sourceReviews = [];
for (const page of [294,295,296,297]) {
  const frozen = freezes.find(x => x.data.phase === 'SOURCE' && x.data.sequence === page - 293);
  const current = canonical.find(x => x.page === page);
  const sourceRows = frozen.data.objects.flatMap(object => (object.rows ?? []).map(row => ({...row, source_object: object.id, source_kind: object.kind})));
  const coords = sourceMaps[page].flatMap(([block, first, count]) => Array.from({length: count}, (_, i) => ({block, line: first + i})));
  if (sourceRows.length !== coords.length) throw new Error(`SOURCE mapping length: ${page}`);
  const allRows = sourceRows.map((row, index) => ({row, coord: coords[index]}));
  for (const object of frozen.data.objects.filter(x => x.kind === 'cap' || x.kind === 'foot')) {
    const block = current.blocks.find(x => x.kind === object.kind && (object.kind === 'foot' || x.label === object.text));
    if (!block) throw new Error(`Missing caption/footer: ${object.id}`);
    allRows.push({row: {id: object.id, text: object.text, source_object: object.id, source_kind: object.kind}, coord: {block: block.block, line: 1}});
  }
  const rowCoverage = allRows.map(({row, coord}) => {
    const block = current.blocks[coord.block - 1];
    const actual = block.lines[coord.line - 1];
    const related = findings.filter(x => x.page === page && x.rows.includes(row.id));
    const footer = row.source_kind === 'foot';
    const equal = footer ? actual.replace(/[·•\s]/g, '') === row.text : semanticText(actual) === semanticText(row.text);
    const textIssues = related.filter(x => ['literal','punctuation','period_space'].includes(x.dimension));
    if (!equal && !textIssues.length) {
      const id = `S${page}-UNCLASSIFIED-${row.id}`;
      const finding = {id, phase: 'SOURCE', judgment: 'HOLD', page, rows: [row.id], refs: [coord], dimension: 'literal', source: row.text, canonical: actual, observation: 'Unclassified independent-freeze discrepancy; HOLD rather than guess.'};
      findings.push(finding);
      related.push(finding);
      textIssues.push(finding);
    }
    const lexicalEmphasis = frozen.data.objects.flatMap(x => (x.emphasis ?? []).filter(e => e.row === row.id));
    return {
      source_row: row.id, source_object: row.source_object, source_kind: row.source_kind,
      source_literal: row.text, canonical_literal: actual, canonical_ref: `p${String(page).padStart(4, '0')}#${coord.block}`,
      canonical_block: coord.block, canonical_line: coord.line, page_md_line: block.md_rows[coord.line - 1].md_line,
      checked: ['complete literal', 'punctuation and period-space', 'source math and formula number', 'lexical emphasis', 'object membership'],
      source_emphasis: lexicalEmphasis,
      literal_and_punctuation_judgment: rank(textIssues.map(x => x.judgment)),
      emphasis_judgment: rank(related.filter(x => x.dimension === 'emphasis').map(x => x.judgment)),
      object_judgment: rank(related.filter(x => x.dimension === 'object').map(x => x.judgment)),
      judgment: rank(related.map(x => x.judgment)),
      finding_ids: related.map(x => x.id),
      normalization_note: footer ? 'Page-number ornaments retained in freeze; bare digits and bullet-decorated foot rows are accepted as the same footer object.' :
        equal && actual !== row.text ? 'LaTeX text wrapper, Markdown emphasis and mathematical layout spacing only; literal content preserved. Punctuation font-weight is not independently adjudicated from dot thickness.' : null,
    };
  });
  const canonicalRows = current.blocks.flatMap(x => x.lines.map((_, i) => `${x.block}:${i + 1}`));
  const covered = rowCoverage.map(x => `${x.canonical_block}:${x.canonical_line}`);
  if (canonicalRows.length !== covered.length || new Set(covered).size !== covered.length ||
      canonicalRows.some(x => !covered.includes(x))) throw new Error(`Non-exhaustive canonical row coverage: ${page}`);
  sourceReviews.push({
    page, judgment: rank(rowCoverage.map(x => x.judgment)), freeze: frozen.binding,
    canonical_bindings: Object.values(current.files).map(x => x.binding),
    row_coverage: rowCoverage,
    coverage: {source_literal_rows_including_shared_captions_and_footer: rowCoverage.length, canonical_text_rows: canonicalRows.length, missing_rows: [], duplicate_rows: [], source_physical_rows_including_footer: frozen.data.coverage.physical_text_row_count_including_footer},
    native_audit_observed: {lines_printed: current.audit.lines_printed, lines_md: current.audit.lines_md, errors: current.audit.errors, rerun: false, interpretation: 'Existing native mechanical receipt, not SOURCE fidelity, RAW approval, or production permission.'},
    block_coverage: current.blocks.map(block => ({
      block: block.block, kind: block.kind, cont: block.cont, open: block.open, samerow: block.samerow,
      source_row_ids: rowCoverage.filter(row => row.canonical_block === block.block).map(row => row.source_row),
      source_figure: block.kind === 'fig' ? frozen.data.objects.find(x => x.kind === 'fig' && (x.label === block.label || x.id === 's294-portrait'))?.id : null,
      judgment: rank(findings.filter(x => x.page === page && x.refs.some(ref => ref.block === block.block)).map(x => x.judgment)),
    })),
  });
}
for (const finding of findings) {
  const current = canonical.find(x => x.page === finding.page);
  finding.locations = finding.refs.map(ref => ({
    canonical_ref: `p${String(finding.page).padStart(4, '0')}#${ref.block}`,
    block: ref.block, line: ref.line,
    page_md_path: current.files['page.md'].binding.path,
    page_md_line: current.blocks[ref.block - 1].md_rows[ref.line - 1].md_line,
    page_json_path: current.files['page.json'].binding.path,
    page_json_pointer: `/blocks/${ref.block - 1}/lines/${ref.line - 1}`,
  }));
  finding.action = finding.judgment === 'HOLD' ? 'Do not guess or amend frozen evidence; obtain separately authorized affected-source adjudication.' : 'Report only. No canonical or skill edits performed or authorized by this review.';
}
const rawIds = ['fig-238', 'fig-239', 'tbl-p0294-03'];
const rawReviews = freezes.filter(x => x.data.phase === 'RAW').map((frozen, i) => {
  const current = canonical.find(x => x.page === 294);
  const metaFigure = current.meta.figures.find(x => x.id === rawIds[i]);
  const block = current.blocks.find(x => x.id === rawIds[i]);
  const auditFigure = current.audit.figures.find(x => x.id === rawIds[i]);
  return {
    id: rawIds[i], judgment: 'PASS', completeness_judgment: frozen.data.completeness.judgment,
    freeze: frozen.binding, image: frozen.data.image, inventory: frozen.data.inventory,
    source_raw_match: 'PASS', clipping: 'none observed', contamination: 'none observed',
    canonical_description_comparison: {
      meta_label: metaFigure.label, block_label: block.label, audit_label: auditFigure.label,
      boxes: {meta: metaFigure.box, block: block.box, audit: auditFigure.box},
      judgment: 'PASS',
      description_limit: 'These canonical files declare identifiers, labels and boxes only, not a full apparatus/curve/portrait inventory. Independent pixel inventory is retained in this review; component counts do not replace semantic completeness.',
      portrait_note: rawIds[i] === 'tbl-p0294-03' ? 'Correctly labeled 斯托列托夫肖像, not a data table; no printed caption was fabricated as a cap block.' : null,
    },
    approval: false,
  };
});
const boundaryChecks = [
  {scope: '293 text-only tail -> 294 first paragraph', judgment: 'PASS', observed: 'p0294#1 cont/open continues the supplied OPEN after 可以通过; no 293 image loaded.'},
  {scope: '294 apparatus/graph interruptions', judgment: 'PASS', observed: 'Blocks 1,4,7 continue one paragraph through transparent fig/cap blocks; block7 closes. Literal and emphasis failures are separate.'},
  {scope: '294 caption238 and caption239 samerow', judgment: 'PASS', observed: 'p0294#3 and #6 both have samerow=true, aligned with source rows s294-r09 and s294-r14.'},
  {scope: '294 biography first paragraph', judgment: 'PASS', observed: 'p0294#8 closes at 电机设计中; unnumbered portrait is separate transparent figure.'},
  {scope: '294 biography final OPEN -> 295', judgment: 'PASS', observed: 'p0294#10 open pairs with p0295#1 cont, closes after 发起人; p0295#2 is new experimental prose.'},
  {scope: '296 starts n113', judgment: 'PASS', observed: 'p0296#1 h3 is 113. 光电效应的理论; no carry-over 112 object.'},
  {scope: '296 OPEN -> 297 same-object equation', judgment: 'PASS', observed: 'p0296#6 open pairs with p0297#1 cont; equation10.2 ends that object; p0297#2 starts separate explanation.'},
  {scope: '297 outgoing object beyond page', judgment: 'NOT_REVIEWED', observed: '298 is excluded. Last sentence on297 is complete; no downstream closure/continuation claim made.'},
];
const now = new Date().toISOString();
const writeOnce = (name, data) => {
  const file = path.join(out, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', {flag: 'wx', mode: 0o444});
  fs.chmodSync(file, 0o444);
  return bind(path.relative(root, file));
};
const canonicalFreeze = writeOnce('canonical.freeze.json', {
  schema: 'independent-canonical-byte-freeze@1', created_at: now,
  order: 'Created only after all four SOURCE and all three RAW immutable freezes.',
  pages: canonical.map(({page, files}) => ({page, files})),
});
const report = {
  schema: 'bounded-independent-source-raw-review@1', ticket: 'STEMROBIN-181', root, created_at: now,
  scope: 'SOURCE294/295/296/297 and RAW294 fig238/fig239/portrait only. Independent review, not production, not approval.',
  restrictions: {write_root: path.relative(root, out), canonical_or_skill_edits: false, git: false, database: false, environment_files: false, browser: false, paid_calls: 0, other_agents_or_chats: false, native_finalize_reruns: 0},
  image_budget: {allowed_batch_max: 8, actual_batches: 1, actual_image_views: 7, distinct_images: 7, source_views: 4, raw_views: 3, reopens: 0, extra_crops: 0, other_images: 0, image_list: imageList},
  freeze_order: freezeNames, freeze_bindings: freezes.map(x => x.binding), canonical_freeze: canonicalFreeze,
  judgments: {SOURCE: 'FAIL', RAW: 'PASS', overall: 'FAIL', approval: false, holds: findings.filter(x => x.judgment === 'HOLD').map(x => x.id)},
  findings, SOURCE: sourceReviews, RAW: rawReviews, boundary_checks: boundaryChecks,
  historical_fidelity_checks: [
    {scope: '297 source h subscript', judgment: 'PASS', source: '$h_0$', canonical_ref: 'p0297#10', line: 1, observation: 'Literal lower0 retained, not modernized to h.'},
    {scope: '297 historical wavelength units and values', judgment: 'PASS', source: ['3.7×10^-5 厘米（紫外线）', '6.8×10^-5 厘米'], canonical_refs: ['p0297#8:1','p0297#9:3'], observation: 'Historical centimeter units and stated numbers retained; no conversion or science correction.'},
    {scope: '297 reference225', judgment: 'PASS', source: '第225页', canonical_ref: 'p0297#9', line: 1, observation: '225 retained literally. No page-reference remapping.'},
    {scope: 'RAW239 photoelectric saturation source structure', judgment: 'PASS', observation: 'Exactly one solid connected source curve with one dashed horizontal saturation guide; no added second curve or vertical guide.'},
    {scope: 'all SOURCE formulas', judgment: 'PASS', observation: 'Literal mathematical expressions, subscripts and equation numbers match after LaTeX text wrappers and layout-gap equivalence; object and terminal period-space findings are separately reported.'},
  ],
  totals: {literal_rows_covered: sourceReviews.reduce((n,x) => n + x.coverage.canonical_text_rows, 0), physical_source_rows_including_footer: sourceReviews.reduce((n,x) => n + x.coverage.source_physical_rows_including_footer, 0), findings_fail: findings.filter(x => x.judgment === 'FAIL').length, findings_hold: findings.filter(x => x.judgment === 'HOLD').length},
  qualifications: [
    'HOLD entries explicitly include possible mistakes in the independent freeze. They are not confirmed canonical defects and do not authorize replacement text.',
    'Immutable freezes were not changed after canonical exposure. No new image payload was loaded to settle HOLDs.',
    'Lexical emphasis spans were compared. The precise font-weight of a normalized sentence-dot glyph is not inferred from black-dot thickness; Markdown punctuation outside strong markers is not a separate scientific or lexical change.',
    'Native audit receipts are observed, not rerun. The user supplied PASS for294/295/296 and concurrent297 start; existing297 audit now has 24/24 rows and no errors, which is not source/content approval.',
  ],
};
for (const page of canonical) {
  for (const file of Object.values(page.files)) {
    const current = bind(file.binding.path);
    if (current.sha256 !== file.binding.sha256 || current.bytes !== file.binding.bytes) {
      throw new Error(`Concurrent canonical change: ${file.binding.path}; preserved canonical.freeze.json, no final report.`);
    }
  }
}
const reportBinding = writeOnce('review.json', report);
console.log(JSON.stringify({review: reportBinding, judgments: report.judgments, totals: report.totals, image_views: 7}, null, 2));
