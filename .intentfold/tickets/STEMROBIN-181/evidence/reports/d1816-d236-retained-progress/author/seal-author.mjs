import * as fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const expectedInputHash = 'bd5104b89c6fc88c42007c3b9791a281a83157387322a895f331cd23546dbabb';

export async function sealAuthor({ repo, details }) {
  const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d236-10p-source86-87-author');
  const root = path.join(repo, '.tmp/STEMROBIN-181/d1816-d236/root');
  const inputPath = path.join(author, 'input-freeze.json');
  const inputBytes = await fs.readFile(inputPath);
  if (sha256(inputBytes) !== expectedInputHash) throw new Error('Input-freeze mismatch');
  const input = JSON.parse(inputBytes);

  const assertWriteScope = (file) => {
    if (![author, root].some((base) => file.startsWith(base + path.sep))) {
      throw new Error('Write outside author scope: ' + file);
    }
  };
  const binding = async (file, role) => {
    const bytes = await fs.readFile(file);
    return { path: file, bytes: bytes.length, sha256: sha256(bytes), role };
  };
  const writeNew = async (file, bytes, readOnly = false) => {
    assertWriteScope(file);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, bytes, { flag: 'wx' });
    if (readOnly) await fs.chmod(file, 0o444);
  };
  const writeJson = (file, value, readOnly = true) =>
    writeNew(file, JSON.stringify(value, null, 2) + '\n', readOnly);

  const frozenInputs = [];
  const collect = (value) => {
    if (!value || typeof value !== 'object') return;
    if (value.path && Number.isInteger(value.bytes) && value.sha256) {
      frozenInputs.push({ ...value, role: 'immutable-frozen-input' });
      return;
    }
    for (const child of Object.values(value)) collect(child);
  };
  collect(input);
  if (frozenInputs.length !== 14) throw new Error('Unexpected frozen-input binding count');

  const instructionPaths = [
    'AGENTS.md',
    '.intentfold/readme.md',
    '.intentfold/project.json',
    '.intentfold/charter/product.md',
    '.intentfold/charter/engineering.md',
    '.intentfold/charter/ui.md',
    '.intentfold/charter/operations.md',
    '/Users/yong/.agents/skills/intentfold/SKILL.md',
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/tools/blocks.py',
    '.claude/skills/ld-s10y-lesson/tools/assemble.py',
    '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
    'ssot-resources/soviet10year-textbooks/sources/manifest.json',
  ];
  const instructions = [];
  for (const file of instructionPaths) {
    instructions.push(await binding(path.isAbsolute(file) ? file : path.join(repo, file), 'read-only-instruction-or-contract'));
  }
  const inputs = [
    await binding(inputPath, 'input-freeze'),
    await binding(path.join(author, 'dispatch-record.json'), 'existing-dispatch-record'),
    ...frozenInputs,
    ...instructions,
  ];

  const pages = [];
  const outputs = [];
  for (const source of input.pages) {
    const number = String(source.page).padStart(4, '0');
    const draftPath = path.join(root, `10p/pages/${number}/page.md`);
    const draft = await fs.readFile(draftPath);
    const snapshotPath = path.join(author, `pre-native/${number}/page.md`);
    await writeNew(snapshotPath, draft, true);
    const working = await binding(draftPath, 'editable-draft-md');
    const snapshot = await binding(snapshotPath, 'read-only-pre-native-md-snapshot');
    outputs.push(working, snapshot);
    pages.push({
      page: source.page,
      printedPage: source.printedPage,
      original: source.original,
      grid: source.grid,
      working,
      snapshot,
      snapshotMode: '0444',
      actualPrintedRows: source.page === 86 ? 24 : 30,
      actualFigureBoxes: [],
      actualFigureCaptions: [],
      actualFootnoteRows: [],
    });
  }

  const inventoryPath = path.join(author, 'source-inventory.md');
  const inventory = await fs.readFile(inventoryPath, 'utf8');
  const observations = inventory.split('\n')
    .filter((line) => /^\| \d+ \|/.test(line))
    .map((line) => {
      const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
      return {
        printedRow: Number(cells[0]),
        coarseOriginalY: cells[1].split('-').map(Number),
        sourceRef: cells[2],
        text: cells[3],
        basis: 'manually-transcribed-actual-original-pixels',
      };
    });
  if (observations.length !== 54) throw new Error('Missing actual printed-row inventory');
  pages[0].rows = observations.filter((row) => row.sourceRef.startsWith('p0086#'));
  pages[1].rows = observations.filter((row) => row.sourceRef.startsWith('p0087#'));

  const imageUsage = {
    batch: 'D236',
    maximumActualImageOpens: 8,
    maximumContextImageOpens: 24,
    actualImageOpens: 7,
    contextImageOpens: 7,
    inheritedParentImageOpens: 0,
    originalImagesOpenedIndividuallyFirst: true,
    reopens: 0,
    original85ImageOpens: 0,
    original88ImageOpens: 0,
    opens: [
      { ordinal: 1, page: 86, kind: 'original', file: input.pages[0].original },
      { ordinal: 2, page: 87, kind: 'original', file: input.pages[1].original },
      { ordinal: 3, page: 86, kind: 'grid', file: input.pages[0].grid },
      { ordinal: 4, page: 87, kind: 'grid', file: input.pages[1].grid },
      ...details.map((detail, index) => ({
        ordinal: index + 5,
        page: detail.page,
        kind: 'original-only-detail',
        box: detail.box,
        original: detail.source,
        file: { path: detail.path, bytes: detail.bytes, sha256: detail.sha256 },
      })),
    ],
    generation: 'Deterministic existing sharp library in-process; no child process or model API.',
    imageContentRepairs: 0,
  };
  if (details.length !== 3 || imageUsage.opens.length !== 7) throw new Error('Image ledger mismatch');
  const imageUsagePath = path.join(author, 'image-usage.json');
  await writeJson(imageUsagePath, imageUsage);
  outputs.push(await binding(imageUsagePath, 'actual-image-usage-ledger'));
  for (const detail of details) {
    const current = await binding(detail.path, 'viewed-original-only-detail-crop');
    if (current.bytes !== detail.bytes || current.sha256 !== detail.sha256) {
      throw new Error('Viewed detail changed: ' + detail.path);
    }
    assertWriteScope(detail.path);
    await fs.chmod(detail.path, 0o444);
    outputs.push(current);
  }
  assertWriteScope(inventoryPath);
  await fs.chmod(inventoryPath, 0o444);
  const inventoryBinding = await binding(inventoryPath, 'complete-printed-row-formula-title-task-figure-boundary-inventory');
  outputs.push(inventoryBinding);
  outputs.push(await binding(path.join(author, 'seal-author.mjs'), 'author-only-in-process-sealing-helper'));

  const tasks = [
    ...[3, 1, 1, 2].map((rowCount, index) => ({
      cardId: 'phy10-c1-s3-n30',
      group: '问题',
      group_id: 'g1',
      source_number: String(index + 1),
      number: String(index + 1),
      sourceRefs: [`p0086#${index + 8}`],
      actualPrintedRows: rowCount,
      figureRefs: [],
      completeLocalExtent: true,
    })),
    {
      cardId: 'phy10-c1-s3-t15',
      group: '练习 2',
      group_id: 'g1',
      source_number: '1',
      number: '1',
      sourceRefs: ['p0086#13', 'p0087#1'],
      actualPrintedRows: 3,
      figureRefs: [],
      completeLocalExtent: true,
      pairing: 'p0086#13 ex 1 open -> p0087#1 ex 1 cont',
    },
    ...[4, 2, 3, 5, 2, 3, 3, 4, 1].map((rowCount, index) => ({
      cardId: 'phy10-c1-s3-t15',
      group: '练习 2',
      group_id: 'g1',
      source_number: String(index + 2),
      number: String(index + 2),
      sourceRefs: [`p0087#${index + 2}`],
      actualPrintedRows: rowCount,
      figureRefs: index === 8 ? ['fig-43'] : [],
      completeLocalExtent: true,
      glyphHold: index === 3 || index === 4,
    })),
  ];
  const holds = [
    {
      id: 'p86-separator-counting',
      phase: 'parent-first-native-counting',
      sourceRefs: ['p0086#5'],
      status: 'HOLD',
      facts: 'Actual pixels contain one horizontal three-star row. Inventory and MD preserve 24 rows; prepared layout has 23 bands, omitting that short row.',
      action: 'Parent diagnoses its FIRST native result. No deletion, fabricated figure, source edit or counting override here.',
    },
    {
      id: 'p87-emf-subscript-script-case',
      phase: 'source-glyph-review',
      sourceRefs: ['p0087#5', 'p0087#6'],
      status: 'HOLD',
      provisional: '\\mathcal{E}_{м}; I_{м}',
      provisionalSubscriptCodepoint: 'U+043C',
      unresolvedAlternatives: ['Latin m', 'Latin M', 'Cyrillic М', 'Cyrillic м'],
      facts: 'Small italic amplitude subscripts and source ornate E style remain provisional, not inferred from science.',
    },
    {
      id: 'p87-frequency-glyph',
      phase: 'source-glyph-review',
      sourceRefs: ['p0087#6'],
      status: 'HOLD',
      provisional: '\\nu=100',
      unresolvedAlternatives: ['Greek ν', 'Latin v'],
      facts: 'The original-only detail does not certify script. SOURCE85 and expected physics cannot settle it.',
    },
    {
      id: 'inherited-source85-approval',
      phase: 'preceding-source-review',
      status: 'HOLD',
      precedingCandidate: input.precedingCandidate,
      facts: 'Bound SOURCE85 is draft/native-only; coil-subscript and frequency-glyph holds stay unapproved. It was neither changed nor visually re-reviewed.',
    },
    {
      id: 'native-and-independent-source-review',
      phase: 'parent-next-lane',
      status: 'HOLD',
      facts: 'Author closes with draft output only. Parent owns FIRST native after closure; no native or independent source approval is claimed.',
    },
  ];

  const report = {
    batch: 'D236',
    ticket: 'STEMROBIN-181',
    book: '10p',
    role: input.role,
    cwd: repo,
    finish: 'review',
    status: 'DRAFT_ONLY_AUTHOR_CLOSED_WITH_HOLDS_PARENT_FIRST_NATIVE_PENDING',
    authorClosed: true,
    completedAt: new Date().toISOString(),
    initialInputFreeze: inputs[0],
    initialInputVerification: { exactInputHashMatched: true, frozenFileBindingsVerifiedBeforeImages: 14 },
    setupGrillFreshness: 'Inherited as satisfied for the same existing offline invocation; not rerun.',
    writeScope: input.writeScope,
    preparedInputsImmutable: true,
    preservedExistingParentFiles: ['input-freeze.json', 'dispatch-record.json'],
    inputs,
    artifacts: outputs,
    completeSourceInventory: inventoryBinding,
    pages,
    actualPrintedRowCounts: { SOURCE86: 24, SOURCE87: 30 },
    rowCountBasis: 'Original pixels inventoried individually before drafts; not template counts. Includes three-star separator.',
    source86Blocks: 14,
    source87Blocks: 11,
    tasks,
    authoredDistinctTaskCount: 14,
    source88Task11Authored: false,
    figures: {
      actualLocalBoxes: [],
      actualLocalCaptions: [],
      remoteReference: { sourceRef: 'p0087#10', figureId: 'fig-43' },
      precedingFigure56Reauthored: false,
      figureContentRepairs: 0,
    },
    boundaries: [
      {
        from: 85,
        to: 86,
        preceding: input.precedingCandidate,
        precedingSourceRef: 'p0085#6',
        exactPrecedingRows: [
          '从电子管振荡器这个例子上能够清楚地看出大多数自激',
          '振荡系统特有的基本组成部分（图 56）：',
        ],
        exactIncomingRow: pages[0].rows[0].text,
        previousOpenFlag: false,
        incomingContFlag: false,
        status: 'Printed following four-component explanation; no split word, no invented cont, no preceding-candidate change or approval.',
      },
      {
        from: 86,
        to: 87,
        fromRef: 'p0086#13',
        toRef: 'p0087#1',
        fromOpen: true,
        toCont: true,
        exactOutgoingRow: pages[0].rows[22].text,
        exactIncomingRows: pages[1].rows.slice(0, 2).map((row) => row.text),
        status: 'Actual task1 open/cont pairing, three printed rows; no supplied punctuation after 微法拉.',
      },
      {
        from: 87,
        to: 88,
        fromRef: 'p0087#10',
        fromOpen: false,
        exactOutgoingRow: pages[1].rows[28].text,
        retainedReference: input.retainedNextBoundary,
        nextTask: '11',
        nextCont: false,
        nextOpen: false,
        status: 'Bound retained JSON only. No SOURCE88 pixels, reauthor, prepare, replay or independent approval.',
      },
    ],
    observedN30RightBoundary: {
      lastTaskRef: 'p0086#11',
      beforeHeadingRef: 'p0086#12',
      nextCardId: 'phy10-c1-s3-t15',
      sourceApproval: false,
      courseOrLessonClosureClaim: false,
    },
    holds,
    imageUsage,
    authorOnlyValidation: {
      observedInventoryRowsEqualMdRows: true,
      schemaFrontmatterFromImmutablePreparedTemplates: true,
      inProcessBlocksPyParserExecuted: false,
      nativeParserExecuted: false,
      reason: 'MD-only output. Only JSON frontmatter and inventory/MD text-row checks; no production parser, finalize, assemble, vectorize or render stage.',
    },
    retainedFirstPreparationFailure: input.firstPreparationFailure,
    successfulParentPrepare86To87: input.preparation,
    source88PreparationOrReplay: false,
    executionDiagnostics: [
      { kind: 'read-only-inspection', error: 'ENOENT for not-yet-created permitted root', recovered: 'No source stage failed; apply_patch created only the permitted draft root.' },
      { kind: 'in-process-library-import', error: 'ESM sharp loader rejected ../package.json', imagesLoaded: 0 },
      { kind: 'in-process-library-resolution', error: 'Repo-local sharp unavailable', imagesLoaded: 0 },
      { kind: 'in-process-library-resolution', outcome: 'Existing bundled sharp loaded via createRequire; three deterministic crops generated without subprocess.' },
    ],
    usage: {
      actualImages: 7,
      paidCalls: 0,
      modelApiCalls: 0,
      nativeCalls: 0,
      subprocessStageCalls: 0,
      readOnlyShellInspectionCalls: 18,
      gitCalls: 0,
      databaseCalls: 0,
      publisherCalls: 0,
      deployCalls: 0,
      mergeCalls: 0,
      handoffCalls: 0,
      peerMessages: 0,
      childrenCreated: 0,
      canonicalPromotions: 0,
      figureContentRepairs: 0,
    },
    firstNativeParentLanePending: true,
    sourceApproval: false,
    independentSource88Approval: false,
    sourcePagesAdded: 0,
    completeCoursesAdded: 0,
    canonicalPromotions: 0,
    formalHandoff: false,
  };
  const reportPath = path.join(author, 'report.json');
  await writeJson(reportPath, report);
  const reportBinding = await binding(reportPath, 'author-report');
  const bindings = [...inputs, ...outputs, reportBinding];
  if (new Set(bindings.map((item) => item.path)).size !== bindings.length) {
    throw new Error('Duplicate freeze binding');
  }
  const freeze = {
    schema: 'STEMROBIN-181/author-freeze@1',
    batch: 'D236',
    ticket: 'STEMROBIN-181',
    status: report.status,
    authorClosed: true,
    role: report.role,
    cwd: repo,
    finish: 'review',
    inputFreeze: inputs[0],
    report: reportBinding,
    bindingCount: bindings.length,
    bindings,
    snapshotPaths: pages.map((page) => page.snapshot),
    actualImageOpens: 7,
    contextImageOpens: 7,
    preparedInputsImmutable: true,
    firstNativeParentLanePending: true,
    holds: holds.map((hold) => hold.id),
    sourceApproval: false,
    source88ReauthoredOrReplayed: false,
    paidCalls: 0,
    modelApiCalls: 0,
    nativeCalls: 0,
    subprocessStageCalls: 0,
    gitCalls: 0,
    databaseCalls: 0,
    sourcePagesAdded: 0,
    completeCoursesAdded: 0,
    canonicalPromotions: 0,
    formalHandoff: false,
    selfBindingRule: 'report is bound here; this file is hash-bound by the single freeze-verification.json and final response, avoiding self-referential hashes.',
  };
  const authorFreezePath = path.join(author, 'author-freeze.json');
  await writeJson(authorFreezePath, freeze);

  // This is the sole post-seal verification of the author's freeze.
  const savedFreezeBytes = await fs.readFile(authorFreezePath);
  const savedFreeze = JSON.parse(savedFreezeBytes);
  let checked = 0;
  for (const item of savedFreeze.bindings) {
    const bytes = await fs.readFile(item.path);
    if (bytes.length !== item.bytes || sha256(bytes) !== item.sha256) {
      throw new Error('Freeze binding mismatch: ' + item.path);
    }
    checked += 1;
  }
  for (const snapshot of savedFreeze.snapshotPaths) {
    const mode = (await fs.stat(snapshot.path)).mode & 0o777;
    if (mode !== 0o444) throw new Error('Snapshot is not read-only: ' + snapshot.path);
  }
  if (checked !== savedFreeze.bindingCount) throw new Error('Freeze count mismatch');
  const authorFreezeBinding = {
    path: authorFreezePath,
    bytes: savedFreezeBytes.length,
    sha256: sha256(savedFreezeBytes),
  };
  const verification = {
    batch: 'D236',
    status: 'PASS_EXACT_AUTHOR_FREEZE_BINDINGS_ONLY',
    verificationRuns: 1,
    verifiedAt: new Date().toISOString(),
    report: reportBinding,
    authorFreeze: authorFreezeBinding,
    expectedBindingCount: savedFreeze.bindingCount,
    verifiedBindingCount: checked,
    readOnlyPreNativeSnapshots: true,
    actualImageOpens: 7,
    nativeOrSourceApproval: false,
    scope: 'Checks exact bytes, SHA256 and snapshot permissions; not native reconciliation, independent source review or source approval.',
  };
  const verificationPath = path.join(author, 'freeze-verification.json');
  await writeJson(verificationPath, verification);
  return { report: reportBinding, authorFreeze: authorFreezeBinding, verifiedBindingCount: checked, verificationPath, actualImageOpens: 7, authorClosed: true, sourceApproval: false };
}
