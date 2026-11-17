import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const A = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(A, '../../../../..');
const T = path.join(W, '.intentfold/tickets/STEMROBIN-181');
const R = path.join(T, 'tmp/d045-n40-text-repair');
const L = 'phy10-c1-s5-n40';
const ED = 'modern-us-neutral';
const source = path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-64.png');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const binding = p => ({ path: p, sha256: sha(p), bytes: fs.statSync(p).size });
function owned(p) {
  if (!path.resolve(p).startsWith(A + path.sep)) throw new Error(`Out-of-scope write: ${p}`);
  return p;
}
function write(p, value) {
  owned(p);
  if (fs.existsSync(p)) throw new Error(`Refusing overwrite: ${p}`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value, null, 2) + '\n');
}
function copy(p, dest) {
  write(dest, fs.readFileSync(p));
}
function run(name, argv) {
  const startedAt = new Date().toISOString();
  write(path.join(A, 'receipts', `${name}.command.json`), { argv, cwd: W, startedAt });
  const out = spawnSync(argv[0], argv.slice(1), {
    cwd: W,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  write(path.join(A, 'receipts', `${name}.stdout.txt`), out.stdout || '');
  write(path.join(A, 'receipts', `${name}.stderr.txt`), out.stderr || '');
  write(path.join(A, 'receipts', `${name}.result.json`), {
    startedAt, finishedAt: new Date().toISOString(), exitCode: out.status,
    signal: out.signal, error: out.error?.message || null,
  });
  console.log(`${name}: exit ${out.status}`);
  if (out.status !== 0) throw new Error(out.stderr || out.stdout || `${name} failed`);
  return out.stdout;
}
function prepare() {
  const repair = path.join(R, 'repair-freeze.json');
  if (sha(repair) !== '234f22abbc69b624a4207ac9ac74d1397e70633e17a5297252b9148aed590296') {
    throw new Error('Repair freeze changed');
  }
  const freeze = load(repair);
  const consumedPath = path.join(T, 'evidence/reports/d040-source104-107-consumed.json');
  const consumed = load(consumedPath);
  if (consumed.SOURCE !== 'PASS' || consumed.RAW !== 'PASS') throw new Error('Unconsumed source');
  const sourceEntry = consumed.outputs.find(item => item.path.endsWith('/fig-64.png'));
  if (sha(source) !== sourceEntry.sha256) throw new Error('Source binding mismatch');
  const originalFreeze = path.join(T, 'tmp/d044-10p-n40-author/author-freeze.json');
  if (sha(originalFreeze) !== '57460be08f809264a7c942aee226687f336cf544a76e45fc4d190fac869388d1') {
    throw new Error('Original author binding mismatch');
  }
  const sciencePath = path.join(T, 'tmp/d044-n38-n40-science-review.json');
  const science = load(sciencePath);
  const sciCard = science.cardResults.find(item => item.card === L);
  if (sciCard.SCI !== 'PASS') throw new Error('SCI not passed');
  const inputs = [binding(source), binding(consumedPath), binding(repair), binding(originalFreeze), binding(sciencePath)];
  copy(source, path.join(A, 'inputs/fig-64.source.png'));
  copy(repair, path.join(A, 'inputs/repair-freeze.json'));
  const texts = [];
  for (const language of ['zh', 'en']) {
    const frozen = freeze.outputs.find(item => item.language === language);
    for (const key of ['lesson', 'exercises', 'figures']) {
      const item = frozen.frozenTemplates[key];
      if (sha(item.path) !== item.sha256) throw new Error(`Changed frozen ${language} ${key}`);
      copy(item.path, path.join(A, `inputs/${language}/${key}.template.json`));
      inputs.push(binding(item.path));
    }
    if (sha(frozen.prose.path) !== frozen.prose.sha256) throw new Error('Changed frozen prose');
    copy(frozen.prose.path, path.join(A, `inputs/${language}/prose.md`));
    inputs.push(binding(frozen.prose.path));
    texts.push({ lesson: L, text: fs.readFileSync(frozen.prose.path, 'utf8') });
    const lesson = load(frozen.frozen.path);
    const contextual = structuredClone(lesson);
    // Native build_context expects figure blocks, whereas this shared reference is paragraph-owned.
    const associated = contextual.prose.findIndex(b => (b.figures || []).some(f => f.id === 'fig-64'));
    if (associated < 0) throw new Error('Missing shared paragraph figure');
    contextual.prose.splice(associated + 1, 0, { kind: 'fig', id: 'fig-64', label: language === 'zh' ? '图 64' : 'Figure 64', text: '' });
    write(path.join(A, `context-roots/${language}/10p/editions/${ED}/lessons/${L}/lesson.json`), contextual);
    write(path.join(A, `context-roots/${language}/10p/editions/${ED}/lessons/${L}/exercises.json`), { exercises: [], count: 0 });
    copy(source, path.join(A, `context-roots/${language}/10p/figures/fig-64.png`));
    run(`context-${language}`, ['python3', '-B', path.join(W, '.agents/skills/ld-s10y-image/scripts/build_context.py'),
      '--root', path.join(A, `context-roots/${language}`), '--book', '10p', '--edition', ED,
      '--figure', 'fig-64', '--output', path.join(A, `context-${language}.json`)]);
  }
  const originalZH = path.join(T, 'tmp/d044-10p-n40-author/zh/work/adapt/10p/modern-us-neutral/lessons', L, 'lesson.template.json');
  if (sha(originalZH) !== sha(path.join(A, 'inputs/zh/lesson.template.json'))) throw new Error('ZH bytes changed');
  const rawDir = path.join(T, 'tmp/d044-10p-n40-author/zh/root/10p/lessons', L);
  for (const filename of ['lesson.json', 'exercises.json']) {
    copy(path.join(rawDir, filename), path.join(A, 'inputs/zh-source-root/10p/lessons', L, filename));
    inputs.push(binding(path.join(rawDir, filename)));
  }
  const inventory = load(path.join(A, 'source-inventory.json'));
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: 'fig-64', mode: 'generated',
    description: 'Circular ripples spreading over an open water surface after a local stone impact; a surface-wave illustration, explicitly distinct from spherical bulk waves.',
    source: { image: { path: source, sha256: sha(source) }, authoritativeText: texts,
      inventory: inventory.groups.map(group => ({ id: group.id, description: group.description, objects: [], assertions: [] })) },
    canvas: { width: 1536, height: 1024, boundingBox: [0, 1024, 1536, 0], background: 'paper', keepAspectRatio: true },
    display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
    objects: [], assertions: [],
  };
  write(path.join(A, 'candidate/fig-64.spec.json'), spec);
  write(path.join(A, 'context.json'), {
    schema: 'ld-s10y-image/author-bilingual-context@1', figure: 'fig-64',
    source: binding(source), physicalOrigin: 104, sharedProseRefs: ['p0112#14', 'p0113#1'],
    authoritativeRule: 'Both complete frozen edition texts are current; Chinese bytes remain unchanged. Text overrides source pixels. No answer key was read.',
    repairFreeze: binding(repair), science: { ...binding(sciencePath), n40SCI: sciCard.SCI, rerun: false },
    texts: texts.map((item, i) => ({ language: ['zh', 'en'][i], ...item })),
    nativeContexts: ['zh', 'en'].map(language => binding(path.join(A, `context-${language}.json`))),
    nativeContextAdapter: 'Full lesson prose is copied without textual edits; one context-only figure block exposes the paragraph-owned shared reference to native build_context. It is not a new source block or a lesson candidate.',
    parentBilingualRebindNeeded: false, affectedIndependentZHEN: 'Active externally; not claimed by this author.',
  });
  const prompt = `Use case: scientific-educational
Asset type: modern shared textbook figure 64, generated semantic scene.
Primary request: Redraw the supplied old extracted figure as one clean contemporary full-color textbook illustration. The original PNG is visual structure only. BOTH complete edition texts below are authoritative and override the source pixels.
Subject: A calm lake or pond surface with a small stone-impact disturbance and a clearly readable family of nested circular surface ripples spreading over the water. The stone has already entered the water; do not invent an airborne stone, person throwing it, or a dramatic fountain.
Composition: Preserve the source's oblique surface perspective, small disturbance right of center, successively broader ring traces surrounding it, irregular rocky near-bank rim across the left and bottom, slender reeds/branches and one leafy shrub on the left near bank, a low continuous distant vegetation/shoreline band along the top and a narrow light sky. Keep the ripple family dominant and clear at a 640-pixel display width. Foliage must not hide the central rings. Natural muted water, foliage, stone and sky colors; clean readable daytime lighting.
Geometry meaning: These are circular rings lying on ONE water surface, appearing elliptical through perspective. NOT spheres, hemispheres, bubbles, shells, bulk waves, water cutaways, wave rays or underwater circles. Preserve inner-to-outer nesting around one disturbance, not an exact measured ring count or equal-distance construction. Do not encode quantitative amplitude or energy laws with sizes, fading, numerals, arrows or labels.
Style: Finished raster educational illustration, clean forms and restrained natural detail; not archival photograph, not engraving, not black-and-white tracing, not manuscript, not textured old-book paper.
Text: NONE. No labels, captions, words, numbers, mathematical symbols, arrows, axes, scales, grids, dimensions, answer annotations, flags or Soviet motifs. No people, animals, boats or buildings. No extra panels. Do not illustrate later figure 73, 74 or 75 material in this figure.
Source pixel inventory:
${inventory.groups.map(item => `${item.id}: ${item.description}`).join('\n')}

COMPLETE CURRENT CHINESE EDITION TEXT:
${texts[0].text}

COMPLETE CURRENT ENGLISH EDITION TEXT:
${texts[1].text}
`;
  write(path.join(A, 'candidate/fig-64.prompt.txt'), prompt);
  write(path.join(A, 'input-bindings.json'), {
    schema: 'ld-s10y-image/author-input-bindings@1', inputs, zhByteUnchanged: true,
    noSourceNativeOrVectorStageRerun: true, noCanonicalOrOtherAuthorWrites: true,
    contextOnlySourceCopies: true, sourceReadImageOpens: 1,
  });
  run('spec-draft', ['python3', '-B', path.join(W, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    path.join(A, 'candidate/fig-64.spec.json'), '--stage', 'draft', '--json']);
}
function generate() {
  run('generation-initial', ['python3', '-B', '/Users/yong/.agents/skills/n-azure/scripts/generate_image.py',
    '--prompt-file', path.join(A, 'candidate/fig-64.prompt.txt'), '--reference-image', source,
    '--output', path.join(A, 'candidate/fig-64.png'), '--size', '1536x1024', '--quality', 'high',
    '--background', 'opaque', '--retries', '0']);
}
function native() {
  const spec = path.join(A, 'candidate/fig-64.spec.json');
  const png = path.join(A, 'candidate/fig-64.png');
  const generation = load(png + '.json');
  if (generation.output.sha256 !== sha(png)) throw new Error('PNG receipt mismatch');
  if (generation.references.length !== 1 || generation.references[0].sha256 !== sha(source)) throw new Error('Reference not bound');
  if (!generation.prompt.includes(fs.readFileSync(path.join(A, 'inputs/zh/prose.md'), 'utf8').trim())
      || !generation.prompt.includes(fs.readFileSync(path.join(A, 'inputs/en/prose.md'), 'utf8').trim())) throw new Error('Incomplete context');
  run('spec-rendered', ['python3', '-B', path.join(W, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    spec, '--stage', 'rendered', '--json']);
  write(path.join(A, 'candidate/figures.author-entry.json'), {
    schema: 'ld-s10y-image/author-output-entry@1', promotable: false,
    figure: { id: 'fig-64', mode: 'generated', png, generation: png + '.json', spec },
    independentReview: 'Not authored. Parent must obtain independent figure review before promotion.',
  });
  for (const language of ['zh', 'en']) {
    const lesson = load(path.join(A, `inputs/${language}/lesson.template.json`));
    const block = lesson.prose.find(b => (b.figures || []).some(f => f.id === 'fig-64'));
    const view = { ...lesson, prose: [block], section_breaks: [] };
    const ed = path.join(A, `native-preview-roots/${language}/10p/editions/${ED}`);
    write(path.join(ed, `lessons/${L}/lesson.json`), view);
    write(path.join(ed, `lessons/${L}/exercises.json`), { count: 0, exercises: [] });
    copy(spec, path.join(ed, 'figures/fig-64.spec.json'));
    copy(png, path.join(ed, 'figures/fig-64.png'));
    run(`native-render-${language}`, ['node', path.join(W, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
      path.join(A, `native-preview-roots/${language}/10p`), '--edition', ED, '--lesson', L,
      '--out', path.join(A, `previews/${language}`)]);
  }
  write(path.join(A, 'native-preview-scope.json'), {
    schema: 'ld-s10y-image/author-native-preview-scope@1',
    purpose: 'Affected shared-figure media and unmodified associated prose, not full-card acceptance.',
    sharedRefs: ['p0112#14', 'p0113#1'], languages: ['zh', 'en'],
    completeAuthorityFiles: ['inputs/zh/prose.md', 'inputs/en/prose.md', 'context.json'],
    lessonTextStageRerun: false, sourceStageRerun: false, vectorStageRerun: false,
    deterministicRenderSpec: 'Not applicable to generated mode; native render_spec rejects generated mode. Azure output and native offline renderer are used.',
    otherFigures: 'Not rendered or judged; no substitute artwork.',
  });
}
const command = process.argv[2];
if (command === 'prepare') prepare();
else if (command === 'generate') generate();
else if (command === 'native') native();
else throw new Error('Use prepare, generate, or native');
