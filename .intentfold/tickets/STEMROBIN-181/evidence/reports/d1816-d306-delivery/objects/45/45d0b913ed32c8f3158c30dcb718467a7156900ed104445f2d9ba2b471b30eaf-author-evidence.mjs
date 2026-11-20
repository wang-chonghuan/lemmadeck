import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const owned = join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d268-source48-51-author');
const sourceRoot = join(cwd, '.tmp/STEMROBIN-181/d1816-d268/source-work/10p/pages');
const candidateRoot = join(cwd, '.tmp/STEMROBIN-181/d1816-d268/root/10p/pages');
const bind = (path) => {
  const bytes = readFileSync(path);
  return { path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
};
const save = (name, data) => {
  const path = join(owned, name);
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
  return bind(path);
};
const rowBands = {
  48: [
    [[456, 517]], [[634, 681]],
    [[727, 770], [799, 840], [871, 911], [943, 983], [1015, 1055], [1088, 1129], [1160, 1201], [1231, 1273], [1303, 1346], [1374, 1416], [1446, 1487]],
    [[1518, 1562], [1589, 1629]],
    [[1661, 1707], [1731, 1778], [1804, 1852], [1876, 1919]],
    [[1949, 1996]], [[2029, 2053]],
  ],
  49: [
    [[114, 159], [187, 230], [261, 303], [332, 376], [403, 448], [474, 519], [544, 592], [618, 665], [690, 737], [761, 806]],
    [], [], [[1291, 1324]], [[1338, 1372]], [[1344, 1380]],
    [[1402, 1455], [1473, 1524]], [[1545, 1598], [1617, 1671]],
    [[1759, 1804], [1810, 1853], [1862, 1892]], [[1945, 1969]],
  ],
  50: [
    [[246, 286], [319, 360], [391, 434], [462, 507], [534, 576], [605, 650], [677, 720], [748, 792], [817, 860]],
    [], [[828, 862]], [[937, 987]],
    [[1034, 1077], [1107, 1150], [1178, 1224], [1247, 1289]],
    [], [[1320, 1368]], [[1336, 1370]],
    [[1392, 1442], [1464, 1517], [1536, 1584], [1625, 1696]],
    [], [[1983, 2016]], [[2050, 2072]],
  ],
  51: [
    [[151, 193], [225, 265]],
    [[296, 338], [369, 409], [440, 481], [510, 554], [581, 626], [653, 693]],
    [[725, 771], [796, 840], [873, 952], [990, 1039], [1062, 1112], [1133, 1184], [1205, 1247]],
    [], [[1890, 1923]], [[1966, 1995]],
  ],
};
const pages = [48, 49, 50, 51].map((page) => {
  const directory = String(page).padStart(4, '0');
  const candidate = bind(join(candidateRoot, directory, 'page.md'));
  const [, frontmatter, body] = readFileSync(candidate.path, 'utf8').split('---');
  const meta = JSON.parse(frontmatter);
  const blocks = [];
  for (const line of body.split('\n')) {
    const header = line.match(/^<!--\s+(h1|h2|h3|p|exhead|ex|fig|cap|foot)\b(.*?)\s*-->$/);
    if (header) {
      const index = blocks.length;
      blocks.push({
        ref: `p${directory}#${index + 1}`, kind: header[1],
        header: line, lines: [], sourceRowBandsApproxPx: rowBands[page][index],
      });
    } else if (line.trim() && blocks.length) {
      blocks.at(-1).lines.push(line);
    }
  }
  const bodyRows = blocks.reduce((count, block) => count + block.lines.length, 0);
  const sharedRows = blocks.filter((block) => /\bsamerow\b/.test(block.header)).length;
  return {
    physicalPage: page, printedPage: meta.printed_page, candidate,
    source: ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'].map((name) => bind(join(sourceRoot, directory, name))),
    declaredSource: meta.source, declaredRender: meta.render, declaredProfile: meta.profile,
    bodyRows, sharedRows, uniquePrintedRows: bodyRows - sharedRows,
    rowEvidenceBasis: 'Author visual rows; approximate y-bands from already viewed source grid. Not a native pixel-count reconciliation.',
    blockRows: blocks.map(({ lines, ...block }) => ({ ...block, printedRows: lines.length })),
    rawProseBoundaries: blocks.filter((block) => block.kind === 'p').map((block) => ({
      ref: block.ref, firstRow: block.lines[0], lastRow: block.lines.at(-1),
      incomingCont: /\bcont\b/.test(block.header), outgoingOpen: /\bopen\b/.test(block.header),
      footnote: /\bfootnote\b/.test(block.header),
    })),
    figures: blocks.filter((block) => block.kind === 'fig').map((block) => ({
      ref: block.ref, label: block.header.match(/fig\s+(.*?)\s+box/)[1],
      roughBoxXYWH: block.header.match(/box\s+([\d,]+)/)[1].split(',').map(Number),
      exactCropApproved: false,
    })),
    notes: meta.notes,
  };
});

const imageDefinitions = [
  [48, 'page.grid.png'], [49, 'page.grid.png'],
  [49, 'p0049-figures-footnote.png', [190, 790, 1385, 1900]],
  [50, 'page.grid.png'], [50, 'p0050-formulas.png', [270, 920, 1460, 2050]],
  [51, 'page.grid.png'], [51, 'p0051-figures.png', [220, 1280, 1375, 1940]],
  [50, 'p0050-spring.png', [1090, 1720, 1260, 1980], 2],
];
const imageLedger = save('image-ledger.json', {
  schema: 'd268/source-author-image-ledger@1', ticket: 'STEMROBIN-181',
  actualImageOpens: 8, maximumImageOpens: 8, imagesReadOneAtATime: true,
  basis: 'Actual functions.view_image calls in this bounded author invocation.',
  entries: imageDefinitions.map(([page, name, box, scale], index) => ({
    open: index + 1, tool: 'functions.view_image', physicalPage: page,
    image: bind(box ? join(owned, 'inspection-crops', name) : join(sourceRoot, String(page).padStart(4, '0'), name)),
    sourceOriginal: bind(join(sourceRoot, String(page).padStart(4, '0'), 'page.png')),
    kind: box ? 'source-only-inspection-crop' : 'prepared-source-grid',
    cropBoxLTRB: box ?? null, resize: scale ? { scale, resampling: 'nearest' } : null,
    originalPixelsModified: false,
  })),
  inspectionFinished: true, additionalOpens: 0, parentOrChildImageOpens: 0,
});

const inventories = [
  {
    figure: '图 24', page: 49, sourceRef: 'p0049#2',
    inventory: 'Horizontal right-arrow t axis; vertical upward-arrow u_p axis; O-shaped origin; three ascending sawtooth ramps, with two intervening abrupt descending reset segments. Last ramp incomplete as actually printed. No numeric ticks or rectangular lattice.',
  },
  {
    figure: '图 25', page: 49, sourceRef: 'p0049#3',
    inventory: 'Dark rectangular apparatus surround; circular oscilloscope screen; square graticule clipped by the circular screen; four corner fastener marks; damped alternating trace across the screen. Separate printed caption lines 电子示波器 and 图25. Trace, lattice clipping and dark ink remain source pixels, not reconstructed.',
    doubts: ['A rectangular row/column total is not asserted for the circularly clipped graticule. Source pixels retain every visible lattice line; independent figure inventory/count review pending.'],
  },
  {
    figure: '图 26', page: 50, sourceRef: 'p0050#2',
    inventory: 'Tall horseshoe magnet with opposed lower pole blocks; rotating wire frame between the poles; shaft extending to the left, ring/contact forms, a curved rotation mark and two outgoing wavy leads. Right pole has N-shaped marking; opposite pole marking is dark/partly obscured. Whole apparatus remains in one box.',
    doubts: ['Exact dark opposite-pole glyph and ring/brush topology need independent source review; no labels or apparatus parts have been invented.'],
  },
  {
    figure: '图 27', page: 50, sourceRef: 'p0050#6',
    inventory: 'One closed wire loop; drawn coil on left; exactly two capacitor plates on right; no battery, selector switch or additional labels.',
  },
  {
    figure: '图 28', page: 50, sourceRef: 'p0050#10',
    inventory: 'One whole figure. а groups two selector-switch circuits: each has battery left, capacitor centrally, coil right, contacts 1 and 2 above. Left circuit switch connects the capacitor to contact1; right connects to contact2. Capacitor top/bottom carry positive/negative charge patterns and q_m/-q_m labels. б is a fixed-support vertical spring with a mass below the horizontal dash-dot equilibrium line, printed 平衡位置, a rotated x_m-like displacement label and vertical endpoint marks. Both source а and б retained inside one box.',
    doubts: ['Amplitude m-shaped glyph encoding and exact displaced arrow-end topology are not certified by the raster.'],
  },
  {
    figure: '图 29', page: 51, sourceRef: 'p0051#4',
    inventory: 'One whole figure. а is exactly two rows of three closed LC circuits, headed 第一个四分之一周期 and 第二个四分之一周期. Upper row: +q_m/-q_m charged plates; +q/-q plates with downward i arrow at coil; neutral plates with downward I_m arrow. Lower row: neutral plates with upward I_m arrow; -q/+q plates with upward i arrow; -q_m/+q_m plates. б contains two fixed-support spring/mass drawings aligned to these rows. Upper mass is at its dash-dot 平衡位置 line, with v_m-shaped label and a small overmark. Lower mass is above its dash-dot 平衡位置 line, with rotated x_m-like displacement label and vertical endpoint marks. Source а and б at bottom, caption 图29 separately below.',
    doubts: ['Small velocity overmark and displacement endpoint topology are retained in pixels without certifying vector-arrow direction. Math homographs do not certify encoding.'],
  },
];
const boundaries = [
  { boundary: '47→48', incomingCont: false, evidence: 'Direct parent instruction: page47 exercise10 and footer complete; page48 starts chapter2 and N17.' },
  { boundary: '48→49', openCont: false, left: '为了观察和分析电振荡，电子示波器是最合适的仪器.', right: '在示波器的显像管里窄细的电子束射到荧光屏上，荧光' },
  { boundary: '49→50', leftRef: 'p0049#8', rightRef: 'p0050#1', openCont: true, join: '用几匝线圈做成的线圈框，在匀强磁场里转动就能产生交变电动势', footnoteTransparent: true },
  { boundary: 'N17→N18', previousLastProse: 'p0050#1', nextHeading: 'p0050#4', heading: '18. 振荡回路', printedStart: 40 },
  { boundary: 'p0050#7→p0050#9', openCont: true, transparentCaption: 'p0050#8', join: '我们来观察为什么在回路里产生振荡？' },
  { boundary: '50→51', leftRef: 'p0050#9', rightRef: 'p0051#1', openCont: true, leftLast: '$E=\\frac{q_m^2}{2C}$　（2.1）', rightFirst: '这里$q_m$是电容器电量，$C$是它的电容，在电容器两板间产生', evidence: '这里 starts at normal left margin, not new-paragraph indentation; figure28/footer transparent.' },
  { boundary: '51→52', outgoingOpen: false, leftRef: 'p0051#3', leftLast: '度也将达到最大值$I_m$（图29，а）', rightRef: 'p0052#1', rightFirst: '尽管这时线圈两端的电势差变为零，但电流不可能立即', evidence: 'Unpunctuated but complete page51 statement. Existing page52 JSON marks first four blocks as independent p; its notes record clearly indented first paragraph. Page52 pixels not reopened or authored.' },
  { boundary: 'N18→N19', outsideAuthorRange: true, evidence: 'TOC N19 starts printed42/physical52; existing page52#1..#4 finish N18 before page52#5 N19 heading. No N18 completion/approval claim for this four-page range.' },
];
const holds = [
  'Author drafts only. Independent original-source, mathematical and figure review not performed.',
  'All rough figure boxes need parent-owned native snapping/cropping and caption exclusion checks.',
  'Native printed-row reconciliation not run. Row bands/counts are visual author evidence only.',
  'Math variables use normal profile math q_m/U_m/I_m/u_p/C/L/i; identical Latin/Cyrillic raster shapes cannot certify original encoding. Actual source subfigure sequences use Cyrillic а/б.',
  'Figure25 circular graticule rectangular totals unknown; Figure26 dark pole/contact details and Figure28/29 tiny arrow/overmark details await independent source review.',
  'No genuine unreadable prose was encountered; no missing prose or punctuation was supplied from scientific inference.',
  'N18 continues in canonical52. Parent owns native stages and downstream closure; no publication or approval is implied.',
];
const context = [
  '.intentfold/readme.md', '.intentfold/charter/engineering.md', '.intentfold/project.json',
  '.claude/skills/ld-s10y-lesson/SKILL.md', '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md', '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
  '.claude/skills/ld-s10y-lesson/tools/blocks.py',
  'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0052/page.json',
].map((path) => bind(join(cwd, path)));
context.push(bind('/Users/yong/.agents/skills/intentfold/SKILL.md'));
const counts = {
  pageMarkdownCandidates: 4, uniquePrintedRows: pages.reduce((n, page) => n + page.uniquePrintedRows, 0),
  bodyRows: pages.reduce((n, page) => n + page.bodyRows, 0),
  sharedRows: pages.reduce((n, page) => n + page.sharedRows, 0),
  figureBoxes: 6, displayFormulaRows: 2, actualImageOpens: 8,
  nativeStages: 0, tests: 0, approvals: 0, networkCalls: 0, modelApiCalls: 0,
  imageGenerationCalls: 0, agentsOrChatsCreated: 0, crossChatMessages: 0,
  gitCalls: 0, databaseCalls: 0, canonicalWrites: 0, pageJsonWrites: 0,
};
const report = save('report.json', {
  schema: 'd268/source-author-report@1', ticket: 'STEMROBIN-181', role: 'BOUNDED_SOURCE_AUTHOR',
  status: 'AUTHOR_DRAFTS_FROZEN_PARENT_NATIVE_AND_INDEPENDENT_REVIEW_PENDING',
  cwd, counts, pages, imageLedger, sourceInventories: inventories, boundaries, holds,
  toc: { section: '第二章　电振荡', printedPage: 38, N17: 38, N18: 40, N19: 42, physicalOffset: 10 },
  consultedContext: context,
  scientificApproval: false, independentApproval: false, publication: false,
  finalizationAttempted: false, sourceInspectionFinished: true,
});
const freeze = save('author-freeze.json', {
  schema: 'd268/source-author-freeze@1', ticket: 'STEMROBIN-181',
  status: 'AUTHOR_ONLY_FROZEN', immutableMeaning: 'Hashes bind current candidate bytes; no permission changes or approval claim.',
  candidates: pages.map((page) => ({ ...page.candidate, physicalPage: page.physicalPage, printedPage: page.printedPage, uniquePrintedRows: page.uniquePrintedRows })),
  report, imageLedger, counts, holds, boundaries,
  canonical52BoundaryInput: context.find((input) => input.path.endsWith('/0052/page.json')),
  approval: false, nativeStages: 0, furtherAuthorship: false,
});
console.log(JSON.stringify({ report, freeze, imageLedger, candidates: pages.map((page) => ({ ...page.candidate, uniquePrintedRows: page.uniquePrintedRows })), counts }, null, 2));
