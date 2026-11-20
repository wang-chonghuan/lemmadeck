import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo || root !== path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author')) throw new Error('Wrong authorized root');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load = p => JSON.parse(fs.readFileSync(path.join(root, p)));
const bound = p => ({ path: p, sha256: sha(path.isAbsolute(p) ? p : path.join(root, p)), bytes: fs.statSync(path.isAbsolute(p) ? p : path.join(root, p)).size });
const save = (name, data) => {
  const file = path.join(root, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
  fs.chmodSync(file, 0o444);
};
if (process.argv[2] === 'author') {
  const before = load('bindings.before.json').bindings;
  const after = before.map(b => ({ path: b.path, sha256: b.sha256, actualSha256: sha(b.path), bytes: fs.statSync(b.path).size, matchesExpected: sha(b.path) === b.sha256, unchangedFromBefore: sha(b.path) === b.actualSha256 }));
  save('bindings.after.json', { bindings: after });
  const unchanged = after.length === 12 && after.every(b => b.matchesExpected && b.unchangedFromBefore);
  const observations = load('author-observations.json');
  observations.imageLedger = observations.imageLedger.map(i => ({ ...i, sha256: i.sha256 || sha(path.join(root, i.path)) }));
  const contracts = [
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  ].map(p => ({ path: p, sha256: sha(path.join(repo, p)) }));
  const context = JSON.parse(fs.readFileSync(path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author-inputs-01/fig-g10-88.context.json')));
  const commandDirectories = fs.readdirSync(path.join(root, 'commands')).filter(p => p !== 'finalize-author').sort();
  const commandReceipts = commandDirectories.map(dir => {
    const prefix = `commands/${dir}`;
    const command = load(`${prefix}/command.json`), exit = load(`${prefix}/exit.json`);
    return { stage: dir, cwd: command.cwd, command: command.command, args: command.args, ...exit, files: ['command.json', 'stdout.txt', 'stderr.txt', 'exit.json'].map(p => bound(`${prefix}/${p}`)) };
  });
  const figureResults = observations.figures.map(f => {
    const id = f.id, draft = f.currentDraft, stem = `${id}.${draft}`;
    const native = load(`${stem}.render.json`), snapshot = load(`${stem}.snapshot.json`);
    const firstNative = load(`${id}.FIRST.render.json`);
    return {
      ...f,
      status: 'AUTHOR_DRAFT_READY_FOR_PARENT_COLLECTION_NOT_INDEPENDENTLY_REVIEWED',
      route: { mode: 'deterministic', renderer: native.renderer, purpose: 'instructional', paidCalls: 0, modelCalls: 0, semanticArtworkNeeded: false, noFallback: true },
      FIRST: { inventory: bound(`${id}.FIRST-inventory.json`), inventoryMode: '0444', spec: bound(`${id}.FIRST.spec.json`), render: bound(`${id}.FIRST.render.json`), nativeStatus: firstNative.status, svg: bound(`${id}.FIRST.svg`), relationshipMapping: bound(`${id}.FIRST.relationship-mapping.json`), snapshot: bound(`${id}.FIRST.snapshot.json`), image: bound(`${id}.FIRST.widths-480-300.png`) },
      current: { spec: bound(`${stem}.spec.json`), svg: bound(`${stem}.svg`), render: bound(`${stem}.render.json`), relationshipMapping: bound(`${stem}.relationship-mapping.json`), snapshot: bound(`${stem}.snapshot.json`), image: bound(`${stem}.widths-480-300.png`) },
      native: {
        explicitValidatorStatus: 'pass', renderStatus: native.status, collisions: native.collisions,
        displayChecks: native.displayChecks, snapshotChecks: snapshot.checks,
        externalValidateCalls: draft === 'REPAIR1' ? 2 : 1,
        renderCalls: draft === 'REPAIR1' ? 2 : 1,
        rendererInternalValidation: 'Existing renderer validates internally once per invocation; not an extra external validator run.',
        snapshotCalls: draft === 'REPAIR1' ? 2 : 1,
      },
    };
  });
  if (figureResults.some(f => f.native.renderStatus !== 'pass' || f.native.collisions.length || Object.values(f.native.snapshotChecks).some(v => !v))) throw new Error('Current author draft failure; do not claim satisfaction');
  const result = {
    schema: 'stemrobin188-bounded-figure-author-result@1',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson: 'geo910-c2-s3-n61',
    role: 'FIGURE_AUTHOR_ONLY_NOT_INDEPENDENT_REVIEWER',
    status: unchanged ? 'AUTHOR_OUTPUTS_SEALED_PARENT_COLLECTION_PENDING_INHERITED_HOLDS_RETAINED' : 'HOLD_INPUT_BINDING_DRIFT',
    newWriteRoot: root, generatedSvgHandEdits: false, manualAuthoringMethod: 'apply_patch only for manual files; existing renderer and bounded local generators produce artifacts.',
    beforeAfter12Bindings: { count: 12, allUnchanged: unchanged, before, after, beforeReceipt: bound('bindings.before.json'), afterReceipt: bound('bindings.after.json') },
    FIRSTOrderingAndSeals: bound('FIRST-seal.receipts.json'),
    routesAndContracts: contracts,
    authoritativeContext: { path: path.relative(repo, path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author-inputs-01/fig-g10-88.context.json')), sha256: sha(path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author-inputs-01/fig-g10-88.context.json')), completeEditionProseRead: 20, completeEditionExercisesRead: 10, answersRead: false, separateTextSemanticPassExists: true, notPromotion: true },
    figures: figureResults,
    failures: [
      { figure: 'fig-g10-87', draft: 'FIRST', stage: 'render_spec.mjs', exitCode: 2, type: 'ACTUAL_CONTENT_GATE_FAILURE', defect: 'Six native label/stroke collisions', originalReceipt: 'commands/fig87-FIRST-render', failedSpecPreserved: true, failedSvgPreserved: true, failedRenderPreserved: true, failedSnapshotPreserved: true, repairCounterAfter: 1, disposition: 'Only affected figure label gaps repaired once; current native render satisfied. FIRST failure remains historical, never replaced.' }
    ],
    repairCounters: { 'fig-g10-87': 1, 'fig-g10-88': 0, limitPerFigure: 1, exhaustedFailRule: 'Any further affected figure defect requires local exhausted FAIL and stopping that figure; no second repair authorized.' },
    HOLDs: {
      localEssentialSourceAmbiguity: [],
      inheritedSource: context.sourceHolds,
      inheritedProcedure: { status: 'HOLD_RETAINED', priorSharedReviewLate0444: 'Procedural HOLD remains; this own fresh early 0444 seal does not rehabilitate the prior shared review.', strictFIRSTProcessApproved: false },
      independentFigureReview: 'PENDING_NOT_AUTHORIZED_HERE',
      parentCollection: 'Parent COLLECTS and CLOSES this author BEFORE reading outputs.',
      broaderScope: 'No source/text admission, canonical review PASS, promotion, template application, whole lesson approval, answer/choice work, publication or closure.'
    },
    imageLedger: observations.imageLedger,
    imageCounters: { batch: 5, context: 5, batchLimit: 8, contextLimit: 24, diagnosticsWithinTotal: 1, originalLoads: 2, initialSnapshotLoads: 2, affectedRepairSnapshotLoads: 1, reopens: 0, failuresOrUnusableImageLoads: 0, parentImageLoads: 0, countersNeverReset: true },
    actualCommandReceipts: commandReceipts,
    finalizationCommandReceipt: 'commands/finalize-author/{command.json,stdout.txt,stderr.txt,exit.json}; completed wrapper receipts included in output-index after command exits.',
    restrictionsObserved: { network: 0, DB: 0, backend: 0, credentialReads: 0, dependencyInstallsOrChanges: 0, paidServices: 0, modelServices: 0, formalTests: 0, reviewRecords: 0, gitWrites: 0, commits: 0, pushes: 0, publish: 0, merges: 0, deploys: 0, closure: 0, peerMessages: 0, descendants: 0, protectedInputsWrites: 0, coreWrites: 0, sourceWrites: 0, templateWrites: 0, charterWrites: 0 },
    outputIndex: { path: 'output-index.json', digest: 'output-index.sha256', schema: 'outputs:[{path(relative),sha256,bytes}]', selfExcluded: ['output-index.json', 'output-index.sha256'] },
    parentInstruction: observations.parentInstruction,
  };
  save('author-result.json', result);
  console.log(JSON.stringify({ authorResult: bound('author-result.json'), bindingCount: after.length, allUnchanged: unchanged, status: result.status, imageLoads: 5 }));
  process.exitCode = unchanged ? 0 : 2;
} else if (process.argv[2] === 'index') {
  const result = load('author-result.json');
  if (!result.beforeAfter12Bindings.allUnchanged) throw new Error('Binding HOLD; do not seal as unchanged');
  if (fs.existsSync(path.join(root, 'output-index.json'))) throw new Error('Index already sealed');
  const files = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Unexpected symbolic link in own outputs: ${p}`);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile()) files.push(p);
    }
  };
  walk(root);
  const outputs = files.map(file => ({ path: path.relative(root, file), sha256: sha(file), bytes: fs.statSync(file).size })).sort((a, b) => a.path.localeCompare(b.path));
  for (const file of files) fs.chmodSync(file, 0o444);
  save('output-index.json', {
    schema: 'bounded-author-output-index@1', root, outputs,
    selfExcluded: ['output-index.json', 'output-index.sha256'],
    actualSealCommand: 'node .intentfold/tickets/STEMROBIN-188/tmp/n61-fig8788-author/finalize.mjs index',
    parentInstruction: 'Parent COLLECTS and CLOSES before reading outputs; do not reopen batch images.',
  });
  const digest = sha(path.join(root, 'output-index.json'));
  fs.writeFileSync(path.join(root, 'output-index.sha256'), `${digest}  output-index.json\n`, { flag: 'wx' });
  fs.chmodSync(path.join(root, 'output-index.sha256'), 0o444);
  console.log(JSON.stringify({ files: outputs.length, outputIndexSha256: digest, authorResultSha256: sha(path.join(root, 'author-result.json')), newWriteRoot: root }));
} else throw new Error('Only author or index finalization');
