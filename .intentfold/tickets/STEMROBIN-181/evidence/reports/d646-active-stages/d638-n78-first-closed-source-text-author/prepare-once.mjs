import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(new URL(import.meta.url).pathname);
const base = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp');
const canonical = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/10p');
const tools = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools');
const card = 'phy10-c2-s2-n78';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (relative, value, freeze = false) => {
  const file = path.join(own, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  if (freeze) fs.chmodSync(file, 0o444);
  return bind(file);
};
const verify = (relative, expected) => {
  const file = path.join(base, relative);
  assert.equal(sha(file), expected, file);
  return bind(file);
};
assert.deepEqual(process.argv.slice(2), ['--execute']);
assert.equal(fs.existsSync(path.join(own, 'preparation-manifest.json')), false);
const authorities = [
  verify('d619-n78-preauthor-source206207-requirements/source-requirements.json', '1b1ab4992e6cc7e4648241a98a76ec60e19ce9cafae8b341284f0a86d253bfa9'),
  verify('d619-n78-preauthor-source206207-requirements/source-blocks.json', '321f583fa92b831e47b35a2270fe9ab8bd9cf77a57fdf1ca2f2b3c46c07ce8db'),
  verify('d624-source208-first-independent-review/report.json', '4cabe077de8772cfe4768c46d16c66b3495f0ea042fd9e839a497f39f91e941c'),
  verify('d631-source209-first-independent-review/report.json', '59d7bb129d6e35e711268169428dd579a52f85d5d29d7884eeb2fb44a777c798'),
  verify('d625-source209-first-author/report.json', 'c0f184888c12605cb44be078303a6fcb2168fe19e320d5e73aa38dc4e26da594'),
];
const baseline = read(authorities[0].path);
const baselineBlocks = read(authorities[1].path);
for (const input of baselineBlocks.inputs) {
  const file = path.join(cwd, input.path);
  assert.equal(sha(file), input.sha256);
  authorities.push(bind(file));
}
const d624 = read(authorities[2].path);
const d631 = read(authorities[3].path);
const d625 = read(authorities[4].path);
const pageFiles = [206, 207, 208, 209].map(page => {
  const parent = page === 209
    ? path.join(base, 'd625-source209-first-author/source/10p/pages/0209')
    : path.join(canonical, 'pages', String(page).padStart(4, '0'));
  return { page, files: ['page.json', 'page.md', 'audit.json'].map(name => bind(path.join(parent, name))) };
});
assert.equal(pageFiles[2].files[0].sha256, d624.frozenAuthority.sourcePageJson.sha256);
assert.equal(pageFiles[2].files[1].sha256, d624.frozenAuthority.sourcePageMd.sha256);
assert.equal(pageFiles[2].files[2].sha256, d624.frozenAuthority.sourceAuditJson.sha256);
assert.equal(pageFiles[3].files[0].sha256, d625.nativeOutputs.pageJSON.sha256);
assert.equal(pageFiles[3].files[1].sha256, d625.nativeOutputs.pageMD.sha256);
assert.equal(pageFiles[3].files[2].sha256, d625.nativeOutputs.audit.sha256);
const pages = pageFiles.map(item => read(item.files[0].path));
assert.deepEqual(baseline.requirements.map(item => item.id), Array.from({ length: 9 }, (_, i) => `N78-R0${i + 1}`));
for (const block of baselineBlocks.blocks) {
  const p = pages.find(item => `p${String(item.meta.page).padStart(4, '0')}` === block.ref.split('#')[0]);
  const { ref, pointer, ...data } = block;
  assert.deepEqual(p.blocks[Number(ref.split('#')[1]) - 1], data);
}
const row = (page, index) => ({
  ref: `p${String(page).padStart(4, '0')}#${index + 1}`,
  pointer: `/blocks/${index}`,
  ...pages.find(item => item.meta.page === page).blocks[index],
});
const additions = [...pages[2].blocks.slice(0, 6).map((_, i) => row(208, i)), ...pages[3].blocks.slice(0, 3).map((_, i) => row(209, i))];
assert.equal(row(208, 2).lines.join(''), '同距离的点的像都变得足够清晰，即所谓景深增加.');
assert.equal(row(208, 5).open, true);
assert.equal(row(209, 2).cont, true);
assert.equal(row(209, 2).open, false);
assert.equal(row(209, 3).kind, 'h3');
assert.equal(row(209, 3).lines.join(''), '79. 眼睛　眼镜');
assert.equal(row(209, 7).open, true);
const currentBoundary = {
  leftAt: 'p0206#12',
  rightAfter: 'p0209#3',
  rightBefore: 'p0209#4',
  nextHeading: row(209, 3),
  n79OutgoingRef: 'p0209#8',
  n79OutgoingOpen: true,
  n79ExcludedFromAuthoring: true,
};
const sourceBlocks = write('source-blocks.json', {
  schema: 'STEMROBIN-181/n78-extended-source-blocks@1',
  ticket: 'STEMROBIN-181', batch: 'd638', card,
  baseline: authorities[1], inputs: [...authorities, ...pageFiles.flatMap(item => item.files)],
  blocks: [...baselineBlocks.blocks, ...additions],
  baselineBlocksPreservedExactly: true,
  firstRef: 'p0206#12', lastRef: 'p0209#3',
  source208Independent: authorities[2], source209Independent: authorities[3],
  historicalSource208PendingInD631: {
    preserved: true,
    nowSatisfiedBy: authorities[2],
    canonical208CopySHA: pageFiles[2].files[0].sha256,
    reason: 'Pinned d624 accepts the same208 page bytes used for the d631 local208209 join. No original report or note is amended.',
  },
  boundary: currentBoundary,
  sourceExerciseRowsWithinBoundary: [],
  sourceExerciseGroupHeadingsWithinBoundary: [],
  imageOpens: 0,
}, true);
const extraRequirements = [
  {
    id: 'N78-R10', source_refs: ['p0207#7', 'p0208#1', 'p0208#2', 'p0208#3'],
    requirement: 'Append the accepted207208 join literally: 减小光圈的孔，可以使到照相机不同距离的点的像都变得足够清晰，即所谓景深增加. Preserve increased depth of field as acceptable sharpness over a range of object distances, not exact simultaneous focus. Qualify ideal point imaging by the thin-lens, paraxial geometrical-optics approximation; distinguish real-camera aberrations and diffraction from the ideal ray sketch without inventing source measurements or a new equation. Retain A/B/C and every182 prose panel reference in its original occurrence order, localizing Cyrillic panel suffixes а/б/в/г/д/е to a/b/c/d/e/f only in modern text. The accepted fig182 inventory is not modern figure approval.',
  },
  {
    id: 'N78-R11', source_refs: ['p0208#4', 'p0209#1', 'p0209#2'],
    requirement: 'Retain the projector subsection, enlarged real image on a screen, rear-illuminated picture or slide, figure183 reference, O as objective, D as slide, and K as condenser lens group collecting source light onto the slide. Keep math tokens O,D,K in precisely that order. Explain the condenser illumination role separately from the objective imaging role. If clarifying enlargement, scope to a focused real image of a slide between one and two focal lengths in the thin-lens/paraxial model; use words, not added formulas/numerical data. Do not introduce a new source math label S from figure morphology. Fig183 belongs to n78 before the actual79 heading.',
  },
  {
    id: 'N78-R12', source_refs: ['p0208#5'],
    requirement: 'Retain changing magnification by moving the objective toward/away from the slide and simultaneously changing projector-to-screen distance. State the focus condition and the coupled object/image distances in the thin-lens approximation; do not portray independent lens motion with a fixed arbitrary screen as maintaining focus. Do not invent zoom components, numerical magnifications or an equation absent from this paragraph.',
  },
  {
    id: 'N78-R13', source_refs: ['p0208#6', 'p0209#3'],
    requirement: 'Retain the complete opaque-projection paragraph, its source term 反射映画器, an opaque object such as a book illustration, strong illumination and projection onto a screen. Explain that the objective uses light reflected from the opaque object, not transmission through it. Preserve the exact物+体 cross-page join and the terminal sentence; do not invent apparatus measurements, a mirror layout or a new source figure.',
  },
  {
    id: 'N78-R14', source_refs: ['p0206#12', 'p0209#3', 'p0209#4'],
    requirement: 'The actual source interval starts at78 on206, closes after209#3 and ends before the actual79 heading209#4. Source exercise rows and exercise-group headings in this interval are both empty: zero questions, zero groups, no answers, choices or input interactions. The eight questions on206 before78 belong outside this interval. Fig184 and the open n79 eye paragraph are copied only as page-level boundary context and excluded from n78 prose, figure templates and completion claims.',
  },
  {
    id: 'N78-R15', source_refs: ['p0206#12', 'p0206#13', 'p0206#14', 'p0207#1', 'p0207#4', 'p0207#5', 'p0207#6', 'p0207#7', 'p0208#3', 'p0208#4', 'p0208#5', 'p0208#6', 'p0209#3'],
    requirement: 'Author both languages from the first prepared complete source; preserve native title identity, all source snapshots/block identity/order/bindings, all physical quantities and math-token occurrence order, and exact numeric/figure-reference signatures. The film chemical mechanism, usual reduced camera image beyond twice focal length, threaded/bellows focusing, exposure/sensitivity/irradiance relation and aperture/depth tradeoff must remain. Brightness comparisons require fixed object radiance, transmission and other relevant conditions in the geometrical-optics regime; no claim that focusing distance alone universally sets exposure. Real finite-aperture rays need not be exactly coincident. Use justified language/layout/clarification declarations; unchanged text uses changes=[]. Derive section breaks only from normalized actual final paragraph anchors. First independent SCI/ZHEN and modern figure authoring/review remain pending.',
  },
];
const requirements = write('source-requirements.json', {
  schema: 'STEMROBIN-181/n78-extended-preauthor-requirements@1',
  ticket: 'STEMROBIN-181', batch: 'd638', card,
  status: 'FIRST-EXTENDED-PREAUTHOR-FROZEN-ACCEPTED206209-SOURCE-ONLY',
  baseline: authorities[0], baselineRequirementSHAConfirmed: true,
  baselineRequirementsPreservedExactly: true,
  requirements: [...baseline.requirements, ...extraRequirements],
  sourceBlocks, boundary: currentBoundary,
  sourceQuestionsAccepted: 0, sourceExerciseGroups: 0,
  sourceFigureIds: ['fig-181', 'fig-182', 'fig-183'],
  contextOnlyFigureIds: ['fig-184'],
  baselineHistoricalHoldsUnchanged: true,
  closureIsAppendOnlyAndBoundToCurrentAccepted208209: true,
  imageOpens: 0, modernTextAuthoredBeforeFreeze: false,
  SCI: 'NOT-AUTHORED', ZHEN: 'NOT-AUTHORED', FIG: 'PENDING', DISPLAY: 'NOT-RUN',
}, true);
write('requirements-freeze.json', {
  schema: 'STEMROBIN-181/n78-requirements-freeze@1',
  recordedAt: new Date().toISOString(),
  status: 'FROZEN-BEFORE-SPARSE-ASSEMBLY-AND-MODERN-AUTHORING',
  files: [requirements, sourceBlocks],
  baselineCount: 9, appendedCount: extraRequirements.length,
  sourceRefsComplete: true, imageOpens: 0,
}, true);

const copies = [];
const copy = (source, destination) => {
  assert.ok(destination.startsWith(`${own}/`));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  assert.equal(fs.existsSync(destination), false);
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(destination, 0o444);
  assert.equal(sha(source), sha(destination));
  copies.push({ source: bind(source), copy: bind(destination), mode: '0444' });
};
for (const item of pageFiles) {
  for (const file of item.files) copy(file.path, path.join(own, 'root/10p/pages', String(item.page).padStart(4, '0'), path.basename(file.path)));
}
for (const id of [181, 182, 183, 184]) {
  const page = id === 181 ? 207 : id === 182 ? 208 : 209;
  for (const suffix of ['png', 'svg']) {
    const source = id < 183
      ? path.join(canonical, 'figures', `fig-${id}.${suffix}`)
      : path.join(base, 'd625-source209-first-author/work/10p/pages/0209/figures', `fig-${id}.${suffix}`);
    copy(source, path.join(own, 'work/10p/pages', String(page).padStart(4, '0'), 'figures', path.basename(source)));
  }
}
const toc = path.join(cwd, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json');
const python = path.join(cwd, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
write('input-bindings.json', {
  authorities, pageFiles, copies, toc: bind(toc),
  tools: ['p2c.py', 'assemble.py', 'edition.py', 'mathcheck.py', 'htmlfrag.js', 'prose_flow.mjs'].map(name => bind(path.join(tools, name))),
  sourceManifest: bind(path.join(cwd, 'ssot-resources/soviet10year-textbooks/sources/manifest.json')),
  imageReads: 'Opaque byte copies/hashes only; no image decoding, rendering or visual opens.',
}, true);
fs.mkdirSync(path.join(own, 'runtime-tmp'), { recursive: true });
function native(name, args) {
  const command = [python, '-B', path.join(tools, 'p2c.py'), ...args];
  const relative = `native/${name}`;
  const started = write(`${relative}/started.json`, { command, cwd, recordedAt: new Date().toISOString(), attempt: 1 });
  const result = spawnSync(command[0], command.slice(1), {
    cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(own, 'runtime-tmp') },
  });
  const dir = path.join(own, relative);
  fs.writeFileSync(path.join(dir, 'stdout.txt'), result.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(path.join(dir, 'stderr.txt'), result.stderr ?? '', { flag: 'wx' });
  const receipt = write(`${relative}/receipt.json`, {
    command, cwd, attempt: 1, started, exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    stdout: bind(path.join(dir, 'stdout.txt')), stderr: bind(path.join(dir, 'stderr.txt')),
    imageOpens: 0, sourceFinalizeVectorize: false,
    runtimeOnlySafety: 'Child bytecode disabled; runtime temporary directory inside owned root; no.env file reads or edits.',
  }, true);
  if (result.status !== 0) {
    write('native-first-failure.json', { status: 'HOLD-NATIVE-FIRST-FAIL-NO-RETRY', receipt, requirements, sourceBlocks }, true);
    console.log(JSON.stringify(receipt));
    process.exit(1);
  }
  return receipt;
}
const assemble = native('assemble-first', ['assemble', '--book', '10p', '--toc', toc, '--root', path.join(own, 'root'), '--work', path.join(own, 'work')]);
const preparedSource = path.join(own, 'root/10p/lessons', card);
const lesson = read(path.join(preparedSource, 'lesson.json'));
const exercises = read(path.join(preparedSource, 'exercises.json'));
assert.equal(exercises.count, 0);
assert.deepEqual(exercises.exercises, []);
assert.equal(lesson.exercise_count, 0);
assert.deepEqual(lesson.figures.map(item => item.id), ['fig-181', 'fig-182', 'fig-183']);
assert.equal(lesson.prose.at(-1).source_refs.at(-1), 'p0209#3');
assert.ok(lesson.prose.every(item => !item.source_refs.includes('p0209#4')));
const prepare = native('adapt-prepare-first', ['adapt-prepare', '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card, '--root', path.join(own, 'root'), '--work', path.join(own, 'work')]);
for (const file of copies) {
  assert.equal(sha(file.source.path), file.source.sha256);
  assert.equal(sha(file.copy.path), file.copy.sha256);
}
const templates = path.join(own, 'work/adapt/10p/modern-us-neutral/lessons', card);
const outputs = [
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name => bind(path.join(preparedSource, name))),
  ...['lesson.template.json', 'exercises.template.json', 'figures.template.json'].map(name => bind(path.join(templates, name))),
];
outputs.forEach(file => fs.chmodSync(file.path, 0o444));
write('preparation-manifest.json', {
  schema: 'STEMROBIN-181/n78-first-scoped-preparation@1',
  ticket: 'STEMROBIN-181', batch: 'd638', card,
  status: 'SPARSE-ASSEMBLE-AND-FIRST-SELECTED-ADAPT-PREPARE-PASS',
  requirementsFreeze: bind(path.join(own, 'requirements-freeze.json')),
  inputs: bind(path.join(own, 'input-bindings.json')),
  nativeCommands: [assemble, prepare], outputs,
  sourcePageCount: 4, originalQuestions: 0, exerciseGroups: 0,
  sourceProseObjects: lesson.prose.length, sourceFigures: lesson.figures.map(item => item.id),
  n79: { outgoingOpen: true, authored: false, approved: false },
  assembleInvocations: 1, adaptPrepareInvocations: 1,
  finalizeVectorizeAdaptFinalizeRenderInvocations: 0,
  canonicalBookReassembled: false, canonicalSourceBytesUnchanged: true,
  imagesOpenedOrDecoded: 0, modernFigures: 'PENDING',
}, true);
console.log(JSON.stringify({ preparation: bind(path.join(own, 'preparation-manifest.json')), requirements, sourceBlocks, outputs }, null, 2));
