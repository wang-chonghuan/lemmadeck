import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo || root !== path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author')) throw new Error('Wrong scope');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const bindOwn = name => bind(path.join(root, name));
const write = (name, value) => {
  const file = path.join(root, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  fs.chmodSync(file, 0o444);
  return bind(file);
};
const manifestFile = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author-inputs-01/manifest.json');
const manifest = read(manifestFile);
const before = read(path.join(root, 'bindings-before.json'));
const after = manifest.bindings.map(entry => {
  const previous = before.bindings.find(item => item.path === entry.path);
  const current = bind(entry.path);
  return {
    ...current, expectedSha256: entry.sha256,
    beforeSha256: previous.sha256, unchanged: current.sha256 === previous.sha256,
    matchesManifest: current.sha256 === entry.sha256,
  };
});
const afterBinding = write('bindings-after.json', { schema: 'bounded-author/bindings@1', phase: 'after', bindings: after });
const seals = read(path.join(root, 'original-FIRST.seals.json')).seals;
const firstObservations = read(path.join(root, 'visual-observations-FIRST.json'));
const repairObservations = read(path.join(root, 'visual-observations-REPAIR1.json'));
const commandDir = path.join(root, 'commands');
const commands = fs.readdirSync(commandDir).map(name => {
  const file = path.join(commandDir, name, 'receipt.json');
  return { ...read(file), receipt: bind(file) };
}).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
const imageLedger = [
  ...manifest.figures.map(entry => ({
    ordinal: entry.id === 'fig-g10-83' ? 1 : 2, kind: 'original-alone',
    figure: entry.id, tool: 'functions.view_image', image: bind(entry.sourceImage.path),
    usable: true, reopened: false, failed: false,
  })),
  ...firstObservations.figures.map(figure => ({
    ordinal: figure.imageOpenOrdinal, kind: 'initial-native-output-snapshot',
    figure: figure.figure, draft: 'FIRST', tool: 'functions.view_image',
    image: bindOwn(figure.image), usable: true, reopened: false, failed: false,
    observedContentFailure: figure.failure,
  })),
  ...repairObservations.figures.map(figure => ({
    ordinal: figure.imageOpenOrdinal, kind: 'affected-native-output-snapshot',
    figure: figure.figure, draft: 'REPAIR1', tool: 'functions.view_image',
    image: bindOwn(figure.image), usable: true, reopened: false, failed: false,
  })),
].sort((a, b) => a.ordinal - b.ordinal);
write('image-ledger.json', {
  schema: 'bounded-author/image-ledger@1', entries: imageLedger, imageOpens: imageLedger.length,
  hardLimit: 8, contextLimit: 24, parentInheritedImageLoads: manifest.parentImageLoads,
  cumulativeContextImageLoads: imageLedger.length + manifest.parentImageLoads,
  diagnosticOpens: 0, duplicateOpens: 0, unusableOrFailedImageOpens: 0,
  generatedSnapshots: 4, generatedNewMobileFrames: 0,
  runtimeRasterDecodingIsNotAnAdditionalAssistantContextOpen: true,
});

const assertionPointReferences = assertion => {
  const fields = {
    connects: ['from', 'to'], displacement: ['from', 'to'],
    distance: ['a', 'b'], equalDistance: ['a', 'b', 'c', 'd'],
    pointOnCircle: ['point', 'center'],
  }[assertion.type] || [];
  return [...new Set(fields.map(field => assertion[field]).filter(value => typeof value === 'string'))];
};
const figures = manifest.figures.map(entry => {
  const id = entry.id;
  const specFile = path.join(root, `${id}.spec-REPAIR1.json`);
  const spec = read(specFile);
  const renderFile = path.join(root, `${id}.REPAIR1.render.json`);
  const render = read(renderFile);
  const repairFile = path.join(root, `${id}.repair1.json`);
  const repair = read(repairFile);
  const validation = commands.find(command => command.name === `fig${id.slice(-2)}-validate-REPAIR1`);
  const renderCommand = commands.find(command => command.name === `fig${id.slice(-2)}-render-REPAIR1`);
  const pointIds = new Set(spec.objects.filter(object => object.type === 'point').map(object => object.id));
  const groupCoverage = spec.source.inventory.map(group => {
    const mappedPoints = group.objects.filter(objectId => pointIds.has(objectId));
    const relations = spec.assertions.filter(assertion => group.assertions.includes(assertion.id))
      .map(assertion => ({
        id: assertion.id, type: assertion.type,
        pointReferences: assertionPointReferences(assertion),
      })).filter(assertion => assertion.pointReferences.length >= 2);
    return {
      inventoryGroup: group.id, requires: group.requires,
      definingPoints: mappedPoints.map(point => ({
        point,
        mappedExecutableRelationships: relations.filter(relation =>
          relation.pointReferences.includes(point) &&
          relation.pointReferences.every(reference => mappedPoints.includes(reference))).map(relation => relation.id),
      })),
      relationshipReferences: relations,
      interpretation: 'Address mapping of already native-validated relationships, not a second validator or independent review.',
    };
  });
  const firstFiles = repair.firstFiles.map(file => ({
    ...bind(file.path), preservedSha256: file.sha256, unchanged: hash(file.path) === file.sha256,
    mode: (fs.statSync(file.path).mode & 0o777).toString(8).padStart(4, '0'),
  }));
  const sourceSeal = seals.find(seal => seal.figure === id);
  return {
    id, status: 'AUTHOR_CANDIDATE_NATIVE_READY_REVIEW_PENDING', mode: 'deterministic',
    role: 'FIGURE_AUTHOR_ONLY', independentReviewer: false,
    FIRST: {
      ...sourceSeal,
      inventoryHashStillCurrent: hash(sourceSeal.inventory.path) === sourceSeal.inventory.sha256,
      inventoryModeStill0444: (fs.statSync(sourceSeal.inventory.path).mode & 0o777) === 0o444,
      route: bindOwn(`${id}.route-FIRST.json`),
      firstDraft: firstFiles,
      firstNativeValidation: 'pass', firstNativeRender: 'pass',
      firstAuthorVisualFailure: firstObservations.figures.find(figure => figure.figure === id),
    },
    currentDraft: {
      name: 'REPAIR1',
      route: bindOwn(`${id}.route-FIRST.json`),
      spec: bind(specFile), svg: bindOwn(`${id}.REPAIR1.svg`),
      render: bind(renderFile), snapshot: bindOwn(`${id}.REPAIR1.snapshot.png`),
      validation: { command: validation.receipt, status: read(validation.stdout.path).status, exitCode: validation.exitCode },
      nativeRender: {
        command: renderCommand.receipt, status: render.status, exitCode: renderCommand.exitCode,
        specHashMatches: render.spec.sha256 === hash(specFile),
        outputHashMatches: render.output.svg.sha256 === hash(path.join(root, `${id}.REPAIR1.svg`)),
        renderer: render.renderer, displayChecks: render.displayChecks, collisions: render.collisions,
        note: 'Native mechanical pass only, not semantic/canonical reviewPASS.',
      },
      definingRelationshipMapping: bindOwn(`${id}.defining-relationship-mapping-REPAIR1.json`),
      mappedInventoryGroups: groupCoverage,
      authorSnapshotObservation: repairObservations.figures.find(figure => figure.figure === id),
    },
    counters: {
      actualDrafts: 2, explicitNativeValidatorCalls: 2, nativeRendererCalls: 2,
      rendererOwnedInternalValidatorCalls: 2,
      contentRepairs: 1, repairLimit: 1, repairBudgetRemaining: 0,
      imageOpens: 3, originalOpens: 1, originalReopens: 0, snapshotOpens: 2,
      diagnosticOpens: 0, paidCalls: 0, modelCalls: 0,
    },
    repair: bind(repairFile),
    failures: [{ id: repair.failure, status: 'FIRST_FAIL_PRESERVED; rim-unit defect resolved in one affected author repair; not retroactively a pass' }],
    blockingLocalHOLDs: [],
    retainedLocalHOLDs: [
      {
        id: `${id}-SOURCE-GLYPH-AND-FONT`, status: 'HOLD_UNCHANGED',
        reason: 'O/zero identity, exact original Unicode and mathematical font remain source uncertainties. English conventional labels are modern representation, not clearance.',
      },
      ...(id === 'fig-g10-84' ? [{
        id: 'fig-g10-84-PANEL-CODEPOINT', status: 'HOLD_UNCHANGED',
        reason: 'Source a-shaped and b-shaped panel glyph/codepoint identity and fine A_1 subscript font are not approved; English a),b) and typographic subscript are explicit modernization.',
      }] : []),
      {
        id: `${id}-INDEPENDENT-REVIEW`, status: 'PENDING',
        reason: 'This author is self-excluded from independent review; source, mathematics, visual and cultural canonical approval require a separate authorized reviewer.',
      },
    ],
    review: { status: 'PENDING', canonicalReviewCreated: false, recordReviewCalled: false, semanticApproval: false, promotionAuthorizedByThisResult: false },
  };
});
const contracts = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js',
  '.agents/skills/node_modules/jsxgraph/distrib/jsxgraph.css',
  '.agents/skills/node_modules/jsxgraph/package.json',
  '.agents/skills/node_modules/playwright-core/package.json',
].map(relative => bind(path.join(repo, relative)));
const result = {
  schema: 'stemrobin188-bounded-figure-author-result@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', lesson: manifest.lesson, book: manifest.book,
  role: 'FIGURE_AUTHOR_ONLY_NOT_INDEPENDENTREVIEWER',
  status: after.every(entry => entry.unchanged && entry.matchesManifest)
    ? 'AUTHOR_CANDIDATES_REVIEW_PENDING' : 'INPUT_BINDING_DRIFT_HOLD',
  repo, soleNewWriteRoot: root, ownedFigures: ['fig-g10-83', 'fig-g10-84'],
  inputManifest: bind(manifestFile),
  beforeAfter12Bindings: {
    before: bindOwn('bindings-before.json'), after: afterBinding,
    countBefore: before.bindings.length, countAfter: after.length,
    allUnchanged: after.every(entry => entry.unchanged && entry.matchesManifest),
    beforeValues: before.bindings, afterValues: after,
  },
  FIRSTOrder: [
    'Manifest only supplied the source paths/bindings.',
    'Original83 alone opened as image1; pixel inventory written, chmod0444, sha256 obtained before original84.',
    'Original84 alone opened as image2; own pixel inventory written, chmod0444, sha256 obtained before complete contexts or specifications.',
    'Both complete edition prose/exercise contexts read only after those seals; local image contracts and production-resume read; 12 bindings captured before author drafts.',
    'Each actual FIRST draft explicitly native-validated once and native-rendered once; existing snapshot opened once (images3,4).',
    'Both missing-rim FIRST visual failures retained; one actual targeted spec repair per figure changed only two rim d fields.',
    'Each actual REPAIR1 explicitly native-validated once and native-rendered once; affected existing snapshot opened once (images5,6).',
  ],
  figures,
  imageLedger: { binding: bindOwn('image-ledger.json'), imageOpens: 6, hardLimit: 8, contextImageLoads: 6, contextLimit: 24, entries: imageLedger },
  failures: {
    FIRSTContentFailures: ['FIRST83-RIM-OFFCANVAS', 'FIRST84-RIM-OFFCANVAS'],
    nativeCommandFailures: commands.filter(command => command.exitCode !== 0).map(command => command.name),
    imageToolFailures: 0, exhaustedFAILs: [],
    firstPathProbe: {
      command: 'ls -ld .intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author',
      exitCode: 1, meaning: 'Expected not-yet-created authorized author directory; no image opened and no content verdict.',
    },
    diagnosticTextSearch: {
      command: "rg -o '<path[^>]*(83-cone-front-rim|83-cone-rear-rim)[^>]*>' .intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author/fig-g10-83.FIRST.svg",
      exitCode: 1, meaning: 'Raw path nodes have no per-object id; code inspection established the coordinate contract. No image or native stage rerun.',
    },
  },
  holds: {
    inheritedSource: manifest.sourceHolds,
    separateN61Text30ObjectSemanticPASS: 'Inherited semanticPASS only; neither source approval nor figure or whole-lesson approval.',
    sharedPriorLate0444ProceduralHOLD: 'UNCHANGED; fresh author FIRST seals do not retroactively clear the earlier review.',
    strictFIRSTProcessApproved: false, sourceApproved: false,
    canonicalFigureReview: 'PENDING', wholeLesson: 'UNAPPROVED',
    parentCollection: 'Parent must collect and CLOSE this author before reading its outputs. No peer message or automatic continuation sent.',
  },
  contractsReadAndRuntimeBindings: contracts,
  runtime: {
    existingHeadlessExecutable: commands.find(command => command.name === 'fig83-render-FIRST').environmentOverrides.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    isolation: 'Native renderer launches a fresh temporary headless browser, closes it in finally; TMPDIR stays under sole author root.',
    networkOrCredentialsOrServicesUsed: false, noUserWindow: true, noCloakBrowser: true,
    formalProductAcceptance: false, newMobileFrames: false,
  },
  actualCommands: commands,
  actualFinalPackagingCommand: {
    program: process.argv[0], args: process.argv.slice(1), cwd: process.cwd(),
    purpose: 'Bind final author records and self-excluded output index; external index digest is terminal/final-text only.',
  },
  actualOriginalInspectionAndSealOperations: manifest.figures.map(entry => ({
    figure: entry.id, sourceHashCommand: `shasum -a 256 ${path.relative(repo, entry.sourceImage.path)}`,
    imageOpen: { tool: 'functions.view_image', path: entry.sourceImage.path, calls: 1 },
    inventoryCreatedBy: 'functions.apply_patch',
    permissionCommand: `chmod 0444 .intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author/${entry.id}.original-FIRST.inventory.json`,
    inventoryHashCommand: `shasum -a 256 .intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author/${entry.id}.original-FIRST.inventory.json`,
    inventory: seals.find(seal => seal.figure === entry.id).inventory,
  })),
  permissions: {
    protectedOrCoreOrTemplateOrCharterEdits: false, sourceOrTextEdits: false,
    freshnessSetupGrill: false, gitWritesCommitPush: false, backendDBCredentials: false,
    dependenciesInstalledOrChanged: false, paidOrModelServices: false,
    peerMessagesDescendants: false, formalTests: false,
    recordReviewOrCanonicalPASS: false, templateApplication: false, assetPromotion: false,
    publicationMergeDeployClosure: false, wholeLessonApproval: false,
  },
  finish: {
    nativeExecSessions: 'All commands synchronous and completed; native browsers closed.',
    remaining: 'Separate authorized independent review after parent collection and CLOSE; inherited HOLDs remain.',
    furtherDependentAuthorSteps: 'STOP; one repair per figure consumed. No further draft, render or image open in this package.',
  },
};
write('author-result.json', result);

function filesBelow(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesBelow(file);
    if (!entry.isFile()) throw new Error(`Unexpected non-file output: ${file}`);
    return [file];
  });
}
const indexFile = path.join(root, 'output-index.json');
const outputs = filesBelow(root).filter(file => file !== indexFile).sort().map(file => ({
  path: path.relative(root, file), sha256: hash(file), bytes: fs.statSync(file).size,
}));
for (const file of filesBelow(root)) fs.chmodSync(file, 0o444);
write('output-index.json', {
  schema: 'stemrobin188-author-output-index@1',
  root, selfExcluded: 'output-index.json', outputs,
});
console.log(JSON.stringify({
  authorResult: path.join(root, 'author-result.json'),
  status: result.status,
  beforeAfterBindingCount: [before.bindings.length, after.length],
  all12InputsUnchanged: result.beforeAfter12Bindings.allUnchanged,
  figures: figures.map(figure => ({
    id: figure.id, currentDraft: figure.currentDraft.name,
    nativeValidation: figure.currentDraft.validation.status,
    nativeRender: figure.currentDraft.nativeRender.status,
    minimumTextPx: Math.min(...figure.currentDraft.nativeRender.displayChecks.map(check => check.measuredMinPx)),
    repairs: figure.counters.contentRepairs, review: figure.review.status,
  })),
  imageOpens: imageLedger.length, outputs: outputs.length,
  outputIndex: indexFile, externalOutputIndexSha256: hash(indexFile),
}, null, 2));
