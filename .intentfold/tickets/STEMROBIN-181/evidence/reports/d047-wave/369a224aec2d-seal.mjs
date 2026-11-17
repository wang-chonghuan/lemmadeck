import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const A = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(A, '../../../../..');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const output = path.join(A, 'author-freeze.json');
if (fs.existsSync(output)) throw new Error('Already frozen; no repeated unchanged seal');
const inputs = read(path.join(A, 'input-bindings.json'));
const observations = read(path.join(A, 'author-observations.json'));
const media = read(path.join(A, 'receipts/headed-media.json'));
const spec = path.join(A, 'candidate/fig-64.spec.json');
const png = path.join(A, 'candidate/fig-64.png');
const gen = read(png + '.json');
if (observations.imagesOpenedTotal > 8 || observations.imageContextTotal > 24) throw new Error('Image budget exceeded');
if (observations.authorStatus !== 'PASS' || media.status !== 'pass') throw new Error('Author or media gate failed');
if (gen.output.sha256 !== hash(png)) throw new Error('Generation hash mismatch');
const preservation = inputs.inputs.map(item => ({
  ...item, observedAtFreezeSha256: hash(item.path), unchanged: item.sha256 === hash(item.path),
}));
if (preservation.some(item => !item.unchanged)) throw new Error('Input drift; retain evidence, do not promote');
const commands = fs.readdirSync(path.join(A, 'receipts')).filter(name => name.endsWith('.result.json'))
  .map(name => ({ ...bind(path.join(A, 'receipts', name)), ...read(path.join(A, 'receipts', name)) }));
if (commands.some(item => item.exitCode !== 0)) throw new Error('A first FAIL exists; retain it and stop');
const nativeSpec = read(path.join(A, 'receipts/spec-rendered.stdout.txt'));
if (nativeSpec.status !== 'pass') throw new Error('Native rendered validation failed');
const preservationPath = path.join(A, 'input-preservation.json');
fs.writeFileSync(preservationPath, JSON.stringify({
  schema: 'ld-s10y-image/author-input-preservation@1', status: 'pass',
  bindings: preservation, onlyOwnedNewFilesWritten: A,
  scope: 'Exact consumed input bindings only. Other authors may write concurrently; no whole-worktree unchanged claim.',
}, null, 2) + '\n');
function list(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error('No sidecar symlinks allowed');
    return entry.isDirectory() ? list(p) : [p];
  });
}
const files = list(A).filter(p => p !== output).sort();
if (files.some(p => /\.review\.json$/.test(p) || (p.endsWith('.json')
  && (() => { try { return read(p).schema === 'ld-s10y-image/review@1'; } catch { return false; } })()))) {
  throw new Error('Author sidecar cannot contain independent figure review');
}
const sourceAuditPath = path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0104/audit.json');
const sourceAudit = read(sourceAuditPath).figures.find(item => item.id === 'fig-64');
const tools = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/generation.md',
  '.agents/skills/ld-s10y-image/scripts/build_context.py',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  'app/src/styles/app.css',
].map(p => bind(path.join(W, p)));
tools.push(bind('/Users/yong/.agents/skills/n-azure/scripts/generate_image.py'));
const freeze = {
  schema: 'ld-s10y-image/author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D029',
  date: '2026-11-17', figure: 'fig-64', authorOnly: true, frozen: true,
  status: 'AUTHOR-FROZEN-NATIVE-PASS-AWAITING-INDEPENDENT-FIGURE-REVIEW',
  ownedAbsoluteRoot: A, renderingMode: 'generated',
  sourceGeometry: {
    source: bind(path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-64.png')),
    exactBitmapPx: [563, 353], physicalOrigin: 104,
    consumedCanonicalAudit: { ...bind(sourceAuditPath), figure: sourceAudit },
    auditCaveat: 'Existing canonical extraction metadata retained without rerunning stages. Audit box/from are not substituted for the actual PNG dimensions or new physical measurements.',
    freshPixelInventory: bind(path.join(A, 'source-inventory.json')),
    labelledPoints: 0, givenValues: 0, subfigures: 1, sharedProseRefs: ['p0112#14', 'p0113#1'],
    keyRelation: 'Nested circular surface ripples around one disturbance in an oblique water view, not spherical bulk waves.',
  },
  currentBilingualContext: bind(path.join(A, 'context.json')),
  repairFreeze: inputs.inputs.find(item => item.path.endsWith('/d045-n40-text-repair/repair-freeze.json')),
  zhByteUnchanged: true, parentBilingualRebindNeeded: false,
  outputs: {
    png: bind(png), generation: bind(png + '.json'), spec: bind(spec),
    prompt: bind(path.join(A, 'candidate/fig-64.prompt.txt')),
    authorEntry: bind(path.join(A, 'candidate/figures.author-entry.json')),
    mathematicalAndCulturalObservations: bind(path.join(A, 'author-observations.json')),
  },
  receipts: {
    nativeSpecDraft: bind(path.join(A, 'receipts/spec-draft.stdout.txt')),
    nativeSpecRendered: bind(path.join(A, 'receipts/spec-rendered.stdout.txt')),
    nativeRenderZH: bind(path.join(A, 'receipts/native-render-zh.stdout.txt')),
    nativeRenderEN: bind(path.join(A, 'receipts/native-render-en.stdout.txt')),
    generation: bind(path.join(A, 'receipts/generation-initial.result.json')),
    headedMedia: bind(path.join(A, 'receipts/headed-media.json')),
    commands,
  },
  measuredDisplay: {
    desktopViewport: [1440, 960], mobileViewport: [390, 844],
    imageWidthPx: 640, mediaWidthPx: 640, imageHeightPx: 426.6640625,
    desktopContainerWidthPx: 685, mobileContainerWidthPx: 358,
    mobileScrollStartPx: 0, mobileScrollEndPx: 282,
    mobileScrollEndReached: true, pageHorizontalOverflowPx: 0,
    affectedProseTextPx: 16.96, imageTextLabels: 0,
    minFigureTextPx: 'Not applicable: no embedded text; no fabricated text-size measurement.',
    nativeSurface: 'Headed affected offline figure+prose, not full card or production app acceptance.',
  },
  imagesOpened: observations.imagesOpenedTotal, imageContextTotal: observations.imageContextTotal,
  imageOpenRecords: observations.imageOpens.map(item => ({ ...item, sha256: hash(item.path) })),
  repairBudget: observations.repairBudget,
  firstFAILSnapshots: [], repeatedUnchangedChecks: 0,
  inheritedSCI: 'PASS-reused-not-rerun', affectedZHEN: 'Independently owned externally; not claimed',
  independentFigureReviewWritten: false, independentReviewAt1Written: false,
  promotionPerformed: false, sourceStagesRerun: false, passedTextStagesRerun: false,
  sourceVectorStagesRerun: false, deterministicRenderSpecRun: false,
  deterministicRenderSpecReason: 'Generated route uses approved n-azure PNG generation and native lesson offline render; JSXGraph render_spec deliberately rejects generated mode.',
  generationCalls: 1, rawOrZHTextChanges: false,
  noCanonicalAppDepsToolsCharterMeterIndexGitDBOrOtherChatWrites: true,
  inputPreservation: bind(preservationPath),
  toolBindingsObservedAtFreeze: tools,
  fileBindings: files.map(bind),
  nextGate: 'Independent figure review, then parent integration. No bilingual context rebind is needed.',
};
fs.writeFileSync(output, JSON.stringify(freeze, null, 2) + '\n');
console.log(JSON.stringify({
  freeze: bind(output), png: bind(png), spec: bind(spec), generation: bind(png + '.json'),
  context: freeze.currentBilingualContext, inventory: freeze.sourceGeometry.freshPixelInventory,
  media: freeze.receipts.headedMedia, fileCount: freeze.fileBindings.length, imagesOpened: freeze.imagesOpened,
}, null, 2));
