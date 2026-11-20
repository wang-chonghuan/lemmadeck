import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { isDeepStrictEqual as equal } from 'node:util';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp');
const combinedPath = path.join(tmp, 'n47-text-fig1617-n46-choice-review-inputs-01/manifest.json');
if (process.cwd() !== repo) throw new Error('Wrong cwd');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const binding = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const combined = read(combinedPath);
const modern = read(combined.modernText.path);
const figureManifest = read(combined.figures.path);
const choice = read(combined.choiceVisual.path);
const own = name => path.join(root, name);
const objectHash = obj => crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const keysChanged = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => !equal(a[k], b[k]));
const omit = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
const formulas = text => [...text.matchAll(/\$([^$]*)\$/g)].map(m => m[1]);
const normalizePresentation = text => text.replace(/\s/g, '').replace(/\./g, '\u3002');
const pngSize = p => {
  const bytes = fs.readFileSync(p);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};
const currentTextBindings = modern.candidates.map(x => binding(x.path));

if (process.argv[2] === 'record') {
  const recorder = path.join(repo, '.agents/skills/ld-s10y-image/scripts/record_review.py');
  const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
  const receipts = [];
  for (const figure of figureManifest.figures) {
    const output = own(`${figure.id}.review.json`);
    if (fs.existsSync(output)) throw new Error('Native review already exists; no repeated recorder');
    const inventory = binding(own(`${figure.id}.FIRST-source-inventory.json`));
    const notes = [
      'Sole independent FIRST reviewer, SAME188-6.',
      `Original PNG inspected before author inventory/spec; independent frozen inventory ${inventory.path} sha256=${inventory.sha256}.`,
      `Compared ALL current N47 prose/exercises, not just raw spec text: ${currentTextBindings.map(x => `${x.path} sha256=${x.sha256}`).join('; ')}.`,
      'Compared full current spec, final SVG, source corner/edge topology, all hidden-edge transitions and projected crossings, and actual 480/300 PNG previews.',
      figure.id.endsWith('16')
        ? 'PASS: 8 unmarked corners, 12 geometric edges in 13 style runs; prism lateral surface remains nonclosed, both open rims unfilled, rear generator solid above front rim and dashed below; both projected crossings remain nonvertices.'
        : 'PASS: 1 apex plus 4 unmarked base corners, 8 edges, 5 solid and 3 dashed; closed quadrilateral pyramid surface, hidden rear corner and front/base crossing retained without an extra vertex.',
      'No added labels, dots, dimensions, answers, cultural symbols, shaded faces, or clipped geometry. Dash cadence and stroke cleanup are nonmetric modernization.',
      'Native renderer PASS reused; this recorder performs its own required rendered-stage validation internally. No standalone validator or rerender was invoked.',
      'Local figure review only, not promotion, durable edition validation, whole N47 completion, source49 exact-glyph approval, or whole-page all-ink approval. Author repairs16=0,17=0 and first technical failures remain preserved.',
    ].join(' ');
    const args = [recorder, '--spec', figure.spec.path, '--render', figure.render.path,
      '--output', output, '--status', 'pass', '--notes', notes];
    const startedAt = new Date().toISOString();
    const result = spawnSync(python, args, {
      cwd: repo, encoding: 'utf8',
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
    const stdout = own(`${figure.id}.record-review.stdout.txt`);
    const stderr = own(`${figure.id}.record-review.stderr.txt`);
    fs.writeFileSync(stdout, result.stdout ?? '', { flag: 'wx' });
    fs.writeFileSync(stderr, result.stderr ?? '', { flag: 'wx' });
    receipts.push({
      figure: figure.id, invocationOrdinal: receipts.length + 1,
      command: python, args, cwd: repo, startedAt, endedAt: new Date().toISOString(),
      envOverride: { PYTHONDONTWRITEBYTECODE: '1' },
      exitCode: result.status, signal: result.signal,
      error: result.error?.message ?? null,
      stdout: binding(stdout), stderr: binding(stderr),
      output: fs.existsSync(output) ? binding(output) : null,
      recorder: binding(recorder),
      standaloneNativeValidatorInvocations: 0,
      nativeRendererInvocations: 0,
      requiredRecorderInternalRenderedValidationInvocations: 1,
    });
    if (result.status !== 0) {
      write('native-recorder-receipts.json', { status: 'fail', receipts });
      throw new Error(`First native recorder failure for ${figure.id}; dependent stage stopped`);
    }
  }
  write('native-recorder-receipts.json', { status: 'pass', receipts });
  console.log(JSON.stringify({ nativeRecorderInvocations: receipts.length, failures: 0 }));
} else if (process.argv[2] === 'reports') {
  const before = read(own('bindings-before.json'));
  const after = read(own('bindings-after.json'));
  if (!before.allMatchManifest || !after.allMatchManifest || !after.unchangedSinceBefore) {
    throw new Error('Input binding change blocks reports');
  }
  const bindingEvidence = { before: binding(own('bindings-before.json')), after: binding(own('bindings-after.json')), count: 98, unchanged: true };
  const rawLesson = read(modern.rawLesson.path);
  const rawExercises = read(modern.rawExercises.path);
  const initialLesson = read(modern.initialTemplates[0].path);
  const initialExercises = read(modern.initialTemplates[1].path);
  const lesson = read(modern.candidates[0].path);
  const exercises = read(modern.candidates[1].path);
  const initialFigures = read(modern.figureContractsOnly.path);
  const profilePath = path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json');
  const profile = read(profilePath);
  const proseNotes = {
    1: 'Eighth-grade prerequisite, nonplanar polygons, right-prism lateral surface fig16, pyramid surface fig17, and both simple-surface examples all retained. Only three sentence stops and sentence newlines differ.',
    6: 'Finite polygon collection and introduction to both simple-polyhedral-surface conditions retained verbatim.',
    7: 'Condition 1 retains arbitrary two vertices, endpoint requirement, existence of an edge-composed broken line, and its quantifier; no weakening to selected vertices.',
    8: 'Condition 2 retains all three alternatives for any point: one polygon, common edge of two polygons, or polyhedral-angle vertex composed of several polygon interior angles.',
    9: 'Both positive examples16/17, negative example18, both-condition claim, cross-page source refs and the request to explain why all retained.',
    12: 'Convention of omitting the word simple in future discussion retained; only sentence stop changed.',
    13: 'Faces, edges and vertices each retain their corresponding polygon definitions; initial-template semicolon newline is preserved.',
    14: 'Every edge belongs to two faces in the closed-surface condition; fig17 is closed and fig16 lateral surface is nonclosed. All three sentences retained, not exchanged.',
    15: 'Space points not on the closed surface are partitioned into two subsets. Existence of a line contained in the first subset, nonexistence in the other, and exterior/interior order retained. Literal originalContains170 wording is retained; no contains/passes-through correction.',
    16: 'Bold definition retains the union of closed surface and its interior, not either alone. Entire raw definition and both ASCII periods are unchanged; explicitly nonblocking punctuation disposition below.',
    17: 'Surface/interior and each face/edge/vertex correspondence retained. No extra mathematical interpretation of the source wording.',
    18: 'Diagonal endpoints must not lie on the same face. Prose raw lettering ABCDEF, diagonal BF and fig19 retained exactly; not harmonized with exercise54 ABCDFE.',
    19: 'Convex fig19 versus nonconvex fig20 and the limitation to studying convex polyhedra later retained.',
    24: 'Flexible but inelastic material, paper/thin cardboard examples, cutting along several edges, flattening into a polygon and definition of surface net retained.',
    25: 'Fig21 represents fig19 nets; both differently looking nets comprise congruent polygons, and the model-making recommendation is retained, including both cross-page source refs.',
  };
  const exerciseNotes = {
    49: 'Naming the polyhedron with fewest faces and counting its edges, vertices and diagonals all retained. Literal prefix 49\\u00b0. remains byte-for-byte; raised-circle exact glyph/meaning remains UNKNOWN localHOLD, not inferred as degree/star/difficulty.',
    50: 'Both alternatives, quadrilateral and pentagonal faces of a five-faced polyhedron, retained in order and on separate lines. Entire candidate equals initial template, but the complete raw object was also compared.',
    51: 'A hexagonal face is the given condition, and minimum number of edges is the complete request. No numerical answer added.',
    52: 'Both construction tasks, 8 edges then 9 edges, retained in natural order and separate lines; no construction or answer inserted.',
    53: 'Both truth-judgment requests retained: intersection and union of two convex polyhedra, each conditional on the result being a polyhedron. Neither conditional nor operation omitted.',
    54: 'ABCDFE and fig22 retained; ABCD is square with side a; ABEF is trapezoid; the entire BE=EF=FA=a/2 chain and (ABE) perpendicular (ABC) survive exactly. AF-to-ABC angle, ABC-to-CDF plane angle and net area are all retained in that order. No source-math correction or answer.',
  };
  const evidence = [];
  const groups = [
    ['prose', rawLesson.prose, initialLesson.prose, lesson.prose],
    ['exercise', rawExercises.exercises, initialExercises.exercises, exercises.exercises],
  ];
  for (const [type, raw, initial, candidate] of groups) {
    if (raw.length !== initial.length || raw.length !== candidate.length) throw new Error('Object count mismatch');
    raw.forEach((r, i) => {
      const t = initial[i], c = candidate[i];
      const fullRawMetadata = omit(r, ['text', 'lines']);
      const fullCandidateMetadata = omit(c, ['text', 'lines', 'source_text', 'changes', 'numeric_changes', 'historical_entities']);
      const templateOnlyMutableFields = type === 'prose' ? ['text', 'changes'] : ['text', 'lines', 'changes'];
      const conditions = {
        completeRawMetadataRetained: equal(fullRawMetadata, fullCandidateMetadata),
        completeInitialTemplateMetadataRetained: equal(omit(t, templateOnlyMutableFields), omit(c, templateOnlyMutableFields)),
        sourceTextExact: c.source_text === r.text && t.source_text === r.text,
        mathematicalTokensRawInitialCandidateExact: equal(formulas(r.text), formulas(t.text)) && equal(formulas(r.text), formulas(c.text)),
        orderedAsciiNumbersExact: equal(r.text.match(/\d+/g) ?? [], c.text.match(/\d+/g) ?? []),
        contentSameExceptAuditedStopsAndWhitespace: normalizePresentation(r.text) === normalizePresentation(c.text),
        noUnregisteredNumericChanges: equal(c.numeric_changes, []),
        noInventedHistoricalEntities: equal(c.historical_entities, []),
        onlyLayoutOrPunctuationChangeDeclarations: c.changes.every(x => ['layout', 'punctuation'].includes(x)),
        sourceRefsExact: equal(r.source_refs ?? r.pages, c.source_refs ?? c.pages),
        figureRefsExact: equal(r.figure_refs, c.figure_refs) && equal(r.figures, c.figures),
        exerciseLinesMatchText: type !== 'exercise' || c.lines.join('\n') === c.text,
        noChinesePunctuationInsideMath: formulas(c.text).every(x => !/[\u3001\uff0c\uff1b\u3002\uff1f\uff01\uff1a]/u.test(x)),
        noCyrillicText: !/[\u0400-\u04ff]/u.test(c.text),
        noForbiddenCultureTerms: [...profile.forbidden_terms, ...profile.forbidden_person_names].every(x => !c.text.includes(x)),
      };
      const id = type === 'prose' ? `prose-${String(i + 1).padStart(2, '0')}` : `exercise-${r.number}`;
      const notes = type === 'exercise' ? exerciseNotes[r.number]
        : r.kind === 'p' ? proseNotes[i + 1]
        : r.kind === 'fig'
          ? `Complete empty placeholder, ${r.id}, ${r.label}, printed page and source refs retained. No image substituted; geometry approval only16/17 is a separate scoped result.`
          : `Complete caption ${r.text}, label, null id, printed page and source refs retained exactly; no caption removed or altered.`;
      evidence.push({
        id, kind: r.kind ?? 'exercise', ordinal: evidence.length + 1,
        status: Object.values(conditions).every(Boolean) ? 'pass' : 'revise',
        sourceRefs: r.source_refs ?? r.pages,
        fullObjectComparison: {
          rawObject: r, initialTemplateObject: t, candidateObject: c,
          canonicalJSONSha256: { raw: objectHash(r), initialTemplate: objectHash(t), candidate: objectHash(c) },
          changedKeysRawToInitial: keysChanged(r, t),
          changedKeysInitialToCandidate: keysChanged(t, c),
          changedKeysRawToCandidate: keysChanged(r, c),
        },
        mathTokens: { raw: formulas(r.text), initial: formulas(t.text), candidate: formulas(c.text) },
        checks: conditions, semanticEvidence: notes,
      });
    });
  }
  const globalChecks = {
    completeComparisonCount33: evidence.length === 33,
    allPerObjectChecksPass: evidence.every(x => x.status === 'pass'),
    prose27: lesson.prose.length === 27,
    text15: lesson.prose.filter(x => x.kind === 'p').length === 15,
    placeholders6: lesson.prose.filter(x => x.kind === 'fig').length === 6,
    captions6: lesson.prose.filter(x => x.kind === 'cap').length === 6,
    exercises49Through54: equal(exercises.exercises.map(x => x.number), ['49', '50', '51', '52', '53', '54']),
    fullLessonSourceDataEqualsRaw: equal(lesson.source.data, rawLesson),
    fullExercisesSourceDataEqualsRaw: equal(exercises.source.data, rawExercises),
    lessonSourceEqualsInitial: equal(lesson.source, initialLesson.source),
    exerciseSourceEqualsInitial: equal(exercises.source, initialExercises.source),
    lessonWholeTopLevelExceptProseEqualsInitial: equal(omit(lesson, ['prose']), omit(initialLesson, ['prose'])),
    exercisesWholeTopLevelExceptExercisesEqualsInitial: equal(omit(exercises, ['exercises']), omit(initialExercises, ['exercises'])),
    rawLessonShaMatchesSource: lesson.source.sha256 === hash(modern.rawLesson.path),
    rawExerciseShaMatchesSource: exercises.source.sha256 === hash(modern.rawExercises.path),
    sevenFigureContracts16Through22: equal(lesson.figures.map(x => x.id), initialFigures.figures.map(x => x.id)),
    sixProseFigureRefsAndOneExerciseFigure: equal([...lesson.prose.filter(x => x.kind === 'fig').map(x => x.id), ...exercises.exercises.flatMap(x => x.figure_refs)], lesson.figures.map(x => x.id)),
    noErratum: equal(lesson.errata, []) && equal(initialLesson.errata, []),
    noSectionBreakMutation: equal(lesson.section_breaks, initialLesson.section_breaks),
    originalContains170Literal: lesson.prose[14].text.includes('\u5b58\u5728\u5305\u542b\u5728\u8fd9\u4e2a\u5b50\u96c6\u91cc\u7684\u76f4\u7ebf'),
    literal49CirclePrefix: exercises.exercises[0].text.startsWith('49\u00b0. ') && rawExercises.exercises[0].text.startsWith('49\u00b0. '),
    literalBoldDefinition: lesson.prose[15].text === rawLesson.prose[15].text,
    originalProseLettering: formulas(lesson.prose[17].text)[0] === 'ABCDEF',
    originalExerciseLettering: formulas(exercises.exercises[5].text)[0] === 'ABCDFE',
  };
  const preservedHolds = [
    { id: 'source49-exact-glyph', scope: 'p0172#3 / exercise49', status: 'localHOLD', result: 'UNKNOWN', literal: '49\u00b0.', blocksModernTextContract: false, reason: 'Exact contour/meaning was not resolved or re-reviewed. Literal source is retained; modern textual fidelity pass does not approve it.' },
    { id: 'whole-pages-all-ink', scope: 'source169-172 and inherited local source holds', status: 'localHOLD', wholeAllInkPagesApproved: false, blocksModernTextContract: false, reason: 'Readable scoped source admission is inherited only. No whole pages were opened and no all-ink hold is closed.' },
    { id: 'originalContains170', scope: 'p0170#7', status: 'inherited-scoped-result-only', literalPreserved: true, blocksModernTextContract: false, reason: 'Contains wording is exact; prior lexical disposition is not a new source or source-math approval.' },
  ];
  const punctuationDispositions = [
    {
      id: 'bold-definition-ascii-stops', objects: ['prose-16'], status: 'nonblocking-retain',
      literal: lesson.prose[15].text, blocksModernTextContract: false,
      reason: 'Both raw ASCII periods and bold delimiters remain. A visible typographic inconsistency with normalized sentence stops elsewhere is acknowledged, not hidden. The active modern profile leaves neutral mathematical text unchanged; no contract requires replacing every outside-math ASCII stop. Neither stop is inside math, no semantic ambiguity or content loss.',
    },
    {
      id: 'raw-title-lettering-and-punctuation', objects: ['lesson.title', 'lesson.printed_title'], status: 'nonblocking-retain',
      literals: [lesson.title, lesson.printed_title], blocksModernTextContract: false,
      reason: 'Exact original lesson identity, including ASCII separator and printed section sign, is retained. No title rewrite or source correction is required by this scoped contract.',
    },
    {
      id: 'raw-mathematical-lettering', objects: ['prose-18', 'exercise-54'], status: 'nonblocking-retain',
      literals: ['ABCDEF', 'BF', 'ABCDFE', 'ABCD', 'ABEF', 'BE', 'EF', 'FA', '(ABE)', '(ABC)', 'AF', 'ABC', 'CDF'],
      blocksModernTextContract: false,
      reason: 'The two source letter orders belong to distinct raw references and are not silently unified. All tokens remain exact, with no Cyrillic enumeration or cultural lettering. Figure19/22 geometry is outside this review; no correctness inference is made from their lettering.',
    },
    {
      id: 'numeric-enumeration-and49-prefix', objects: ['prose-07', 'prose-08', 'exercise-49', 'exercise-50', 'exercise-51', 'exercise-52', 'exercise-53', 'exercise-54'],
      status: 'nonblocking-retain', blocksModernTextContract: false,
      reason: 'ASCII numbered subpart markers and exercise-number stops are enumeration, not leaked formula punctuation. Every complete sequence retains natural order and separate subpart lines. Literal49 raised circle remains source UNKNOWN localHOLD; it is not interpreted as a mathematical angle or difficulty marker.',
    },
  ];
  const modernStatus = Object.values(globalChecks).every(Boolean) ? 'pass' : 'revise';
  write('modern-review.json', {
    schema: 'same188-6/complete-independent-modern-text-review@1',
    status: modernStatus, lesson: modern.lesson, book: modern.book, edition: 'modern-us-neutral',
    completeComparisonCount: 33,
    counts: { prose: 27, text: 15, figurePlaceholders: 6, captions: 6, exercises: 6, mathSpans: evidence.reduce((n, x) => n + x.mathTokens.raw.length, 0) },
    comparisonMethod: 'Independent complete-object raw/initial/current comparison and manual semantic reading of every object. Author all33 report was not rerun or used as the comparison engine.',
    globalChecks, perObjectEvidence: evidence, punctuationDispositions,
    newScopedHolds: [], preservedHolds,
    originalContains170: { literalPreserved: globalChecks.originalContains170Literal, sourceCorrection: false },
    text_contract_ready: { flagsModified: false, anyInputFlagChanged: false, note: 'This is a review disposition only; no source/template/candidate readiness flag is set, unset, or silently reinterpreted.' },
    bindings: [binding(combinedPath), binding(combined.modernText.path), ...currentTextBindings, binding(modern.rawLesson.path), binding(modern.rawExercises.path), ...modern.initialTemplates.map(x => binding(x.path)), binding(modern.figureContractsOnly.path)],
    bindingEvidence,
    contracts: [binding(profilePath), binding(path.join(repo, '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'))],
    limits: { imageLoads: 0, sourcePageReviewRepeated: false, errataOrSourceMathCorrections: 0, nativeFinalize: 0, nativeLessonRender: 0, answersRead: false, wholeN47Completion: false, published: false },
  });

  const imageRecords = [
    ...figureManifest.figures.map((f, i) => ({ ordinal: i + 1, kind: 'original-source', figure: f.id, ...binding(f.source.path), size: pngSize(f.source.path) })),
    ...figureManifest.figures.flatMap((f, i) => f.previews.map((p, j) => ({
      ordinal: 3 + i * 2 + j, kind: 'final-figure-preview', figure: f.id, displayWidth: p.width,
      ...binding(p.path), size: pngSize(p.path),
    }))),
    ...choice.screenshots.map((s, i) => ({
      ordinal: 7 + i, kind: 'actual-first-choice-fullpage-screenshot', lesson: choice.lesson,
      viewport: s.viewport, ...binding(s.path), size: pngSize(s.path),
      toolDisplayResize: i === 1 ? { original: [390, 7277], displayed: [322, 6000], performedBy: 'view_image tool', additionalLoad: false } : null,
    })),
  ].sort((a, b) => a.ordinal - b.ordinal);
  write('actual-image-loads.json', {
    schema: 'same188-6/actual-image-loads@1', tool: 'functions.view_image',
    actualTotal: 8, hardLimit: 8, originals: 2, finalFigurePNGs: 4, choiceScreenshots: 2,
    reopens: 0, newCrops: 0, screenshotRecaptures: 0, svgRasterLoads: 0, extraImageSlotsUsed: 0,
    notes: 'Hashing/IHDR metadata reads do not load image pixels into model context. No image was reopened, cropped, rerendered, or embedded in final output.',
    loads: imageRecords,
  });
  const fig16Map = [
    ['upper-back-left', ['upper-rear-left']], ['upper-left-front', ['upper-left-front']],
    ['upper-front-right', ['upper-front-right']], ['upper-right-back', ['upper-right-rear']],
    ['generator-left', ['vertical-left']], ['generator-front', ['vertical-front']],
    ['generator-right', ['vertical-right']], ['generator-back', ['vertical-rear-visible', 'vertical-rear-hidden']],
    ['lower-left-front', ['lower-left-front']], ['lower-front-right', ['lower-front-right']],
    ['lower-left-back', ['lower-rear-left']], ['lower-back-right', ['lower-right-rear']],
  ];
  const fig17Map = [
    ['apex-left', ['apex-left']], ['apex-front', ['apex-front']],
    ['apex-right', ['apex-right']], ['apex-back', ['apex-rear']],
    ['base-left-front', ['base-left-front']], ['base-front-right', ['base-front-right']],
    ['base-left-back', ['base-rear-left']], ['base-back-right', ['base-right-rear']],
  ];
  const figs = figureManifest.figures.map(f => {
    const spec = read(f.spec.path), render = read(f.render.path);
    const inventoryPath = own(`${f.id}.FIRST-source-inventory.json`);
    const inventory = read(inventoryPath);
    const nativeReview = read(own(`${f.id}.review.json`));
    const mapping = f.id.endsWith('16') ? fig16Map : fig17Map;
    const mapped = mapping.map(([sourceEdge, suffixes]) => {
      const ids = suffixes.map(x => `${f.id}-${x}`);
      return {
        sourceEdge, sourceRequirement: inventory.edges.find(x => x.id === sourceEdge),
        objects: ids.map(id => spec.objects.find(x => x.id === id)),
        assertions: ids.map(id => spec.assertions.find(x => x.id === `${id}-connection`)),
        disposition: 'pass',
      };
    });
    const resolutionChecks = {
      sourceInventoryAllEdgesMapped: mapped.length === inventory.edges.length && mapped.every(x => x.sourceRequirement && x.objects.every(Boolean) && x.assertions.every(Boolean)),
      everySpecObjectMapped: new Set(mapped.flatMap(x => x.objects.map(o => o.id))).size === spec.objects.length,
      everySemanticEdgeHasConnects: spec.objects.every(o => spec.assertions.some(a => a.type === 'connects' && a.arrow === o.id && equal(a.from, o.from) && equal(a.to, o.to))),
      authorInventoryObjectIdsResolve: spec.source.inventory.every(g => g.objects.every(id => spec.objects.some(o => o.id === id))),
      authorInventoryAssertionIdsResolve: spec.source.inventory.every(g => g.assertions.every(id => spec.assertions.some(a => a.id === id))),
      segmentsOnlyNoLabelsFillOrDots: spec.objects.every(o => o.type === 'segment' && !o.label && o.stroke === 'ink' && !o.fill),
      currentNativeRendererPassReused: render.status === 'pass',
      currentNativeReviewPass: nativeReview.status === 'pass' && nativeReview.schema === 'ld-s10y-image/review@1',
      nativeSourceHashExact: nativeReview.source.sha256 === hash(f.source.path),
      nativeSpecHashExact: nativeReview.spec.sha256 === hash(f.spec.path),
      nativeRenderHashExact: nativeReview.render.sha256 === hash(f.render.path),
      nativeSVGHashExact: nativeReview.outputs.svg.sha256 === hash(f.svg.path),
    };
    return {
      id: f.id, status: Object.values(resolutionChecks).every(Boolean) ? 'pass' : 'revise',
      source: binding(f.source.path), spec: binding(f.spec.path), svg: binding(f.svg.path), render: binding(f.render.path),
      preview: { width: 480, ...binding(f.previews.find(x => x.width === 480).path) },
      previews: f.previews.map(p => ({ width: p.width, ...binding(p.path) })),
      nativeReview: binding(own(`${f.id}.review.json`)), sourceInventory: binding(inventoryPath),
      resolutionChecks, sourceEdgeComparison: mapped,
      cornerEvidence: {
        sourceUnlabelledCorners: inventory.counts.geometricCorners,
        realization: 'Shared literal segment endpoints with complete incident connects assertions; no invented point dots or letters. Projected crossings are not added as geometric vertices.',
        allSourceCornersCompared: true,
      },
      sourceAndCurrentTextSemantics: f.id.endsWith('16')
        ? 'Entire current modern candidate confirms fig16 is the right-prism lateral surface, a simple nonclosed surface. Four lateral regions and both upper/lower boundary loops retained without filled caps or added diagonals. Full source geometry, not merely object count, was compared.'
        : 'Entire current modern candidate confirms fig17 is the pyramid surface, a simple closed surface. Apex and complete four-corner base cycle retained, with the hidden triangular rear connections shown dashed. No square/regular-pyramid metric assumption.',
      currentFullTextCompared: currentTextBindings,
      currentVersusSpecText: 'Spec authoritativeText is raw wording; complete current candidate comparison confirms only presentation changes, no changed figure meaning or new mathematical requirement. No spec/text input was edited.',
      crossingAndDashEvidence: f.id.endsWith('16')
        ? [
            { sourceCrossing: 'upper-crossing', disposition: 'pass', evidence: 'Rear generator visible/hidden objects meet at [134.62282398452612,204.8742746615087], collinear with rear endpoints; the split lies on upper-front-right. Final SVG split at about [278.53,255.43] joins solid to dashed exactly at the continuous solid front rim. No ninth corner.' },
            { sourceCrossing: 'lower-left-crossing', disposition: 'pass', evidence: 'Lower-rear-left remains dashed behind the solid front generator in both480/300 previews. Dash gap phase is normalized, not a new join. No extra endpoint or solid hidden edge.' },
            { disposition: 'pass', evidence: 'All four upper edges, two visible lower edges and three outer/front generators remain solid; two rear lower edges and the lower rear generator remain dashed. Upper rear generator retains thin solid styling.' },
          ]
        : [
            { sourceCrossing: 'base-left-crossing', disposition: 'pass', evidence: 'Base-rear-left crosses the continuous solid apex-front edge in projection; no extra marked vertex and no front-edge dash transition. Same relative ordering in source, spec, SVG and both previews.' },
            { disposition: 'pass', evidence: 'Apex-left/front/right and base-left-front/front-right are solid; apex-rear and both rear base edges are dashed. Five solid plus three dashed connections exactly cover the source.' },
          ],
      svgEvidence: {
        inspectedAsXMLNotRasterLoaded: true, visibleLines: spec.objects.length,
        visibleGeometryTags: ['line'], noVisibleTextOrMarkerOrFacePolygon: true,
        dashedSVGStrokeArray: '5,5', color: 'var(--ld-figure-ink, #15201f)',
        sourceDashCadenceNotClaimedAsMetric: true,
        clippedHelpersNotMistakenForVisibleGeometry: true,
        geometryWhiteClearance: f.id.endsWith('16')
          ? '480 SVG endpoints span about x33.10..440.69, y33.79..642.07 inside480x680. Preview300 retains positive clearance on all four sides.'
          : '480 SVG endpoints span about x27.14..452.86, y27.67..524.63 inside480x554. Preview300 retains positive clearance on all four sides.',
      },
      visualQuality: {
        widthsReviewed: [480, 300], nonblank: true, allSolidAndDashedEdgesReadable: true,
        noClipping: true, noAddedLabelsOrValues: true, noFaceFill: true,
        noAnswers: true, noCulturalLeakage: true, labelMinTextPx: 'not applicable: zero labels',
        noThemeRerenderClaim: true,
      },
      cumulativeAuthorContentRepairs: f.cumulativeContentRepairs,
      reviewerRepairs: 0, promotion: false,
    };
  });
  write('figures-review.json', {
    schema: 'same188-6/independent-first-figures-review@1',
    status: figs.every(x => x.status === 'pass') ? 'pass' : 'revise',
    lesson: modern.lesson, figs,
    sourceFirst: { originalPNGImageOrdinals: [1, 2], independentInventoriesFrozenBeforeAuthorSpecRead: true },
    actualImageLoads: 6, nativeRecorderInvocations: 2,
    nativeRendererInvocations: 0, standaloneNativeValidatorInvocations: 0,
    requiredRecorderInternalRenderedValidationInvocations: 2,
    nativeReviewIsNotPromotion: true, durableEditionMetadataNotPromoted: true,
    authorRepairsPreserved: { '16': 0, '17': 0 }, preservedHolds,
    firstTechnicalFailures: combined.bindings.filter(x => /n47-fig1617-author\/FIRST-(author|resumeauthor)-failure/.test(x.path)),
    bindings: [binding(combined.figures.path), ...currentTextBindings], bindingEvidence,
    beyondScope: 'Figures18-22 geometry, whole N47 display, durable finalization, original source49 glyph and all-ink approval are not claimed.',
  });

  const visible = read(choice.visibleQuestions.path);
  const result = read(choice.result.path);
  const questionNotes = [
    'Complete plane/vector translation stem and four equations with constants1,33,16,43 visibly retained; signs, vector arrow and tuple intact.',
    'Origin O, negative coefficient -3/2, original plane and all four equation alternatives retained, including34/3 and both signs of51/2.',
    'Complete three-symmetry stem, M/M prime, z=0 and180-degree qualification retained. Four2-column tables each show all three transformation rows and every coordinate tuple, including deliberate alternatives.',
    'Complete plane7x-2y-5z-1=0 stem, z subscript0, all three transformation definitions and all four3-row tables retained; differing signs preserved.',
    'Complete nonzero homothety coefficient and fixed-point versus invariant-point-set qualification retained. Four4-column tables each retain both coefficient rows and all three outcome columns.',
    'Complete distance-preserving definition, nonzero coefficient and choose-all instruction retained. Four statement options and positive/negative coefficient qualifications intact; square checkbox controls, not radios.',
    'Complete arbitrary tetrahedron/O, coefficient-2, all four image vertices, six edges/four faces and center-vertex qualification retained. All four construction alternatives retain ray direction and factors.',
    'Complete arbitrary tetrahedron/O, coefficient0.5, six-edge/four-face correspondence and O-fixed qualification retained. Midpoint/factor/reverse-ray/retain-D alternatives fully visible.',
    'Complete S/S prime and two-coefficient-2/0.5 ratio question retained. Four2-column tables show both coefficients and all eight ratio entries intact.',
    'Complete arbitrary parallelepiped, vertex-centerO, coefficient1/3, seven other vertices, twelve edges and six faces retained. All four construction alternatives fully visible.',
    'Complete parallelepiped surface-area ratio stem with coefficient1/3 and S/S prime retained. Four ratio alternatives3:1,27:1,1:9,9:1 visible through last option.',
  ];
  const projectionHasNoKeys = Object.keys(visible).every(k => ['schema', 'questions'].includes(k))
    && visible.questions.every(q => Object.keys(q).every(k => ['mode', 'stem', 'figure_ids', 'options'].includes(k))
      && q.options.every(o => Object.keys(o).every(k => ['id', 'text', 'figure_ids'].includes(k))));
  const surfaces = choice.screenshots.map((shot, surfaceIndex) => {
    const machine = result.results.find(r => r.viewport.width === shot.viewport.width);
    return {
      status: 'pass', viewport: shot.viewport, screenshot: binding(shot.path), screenshotPixels: pngSize(shot.path),
      actualImageLoadOrdinal: 7 + surfaceIndex, fullPage: true,
      visibleQuestionsProjection: binding(choice.visibleQuestions.path),
      questionCountCompared: 11, optionCountCompared: 44,
      controlCounts: { radios: 40, checkboxes: 4, singleQuestions: 10, multipleQuestions: 1 },
      perQuestionEvidence: visible.questions.map((q, i) => ({
        ordinal: i + 1, mode: q.mode, optionsCompared: q.options.map(o => o.id),
        completeStemCompared: true, completeOptionsCompared: true, formulasAndTablesCompared: true,
        status: 'pass', evidence: questionNotes[i],
        surfaceDetail: surfaceIndex === 0
          ? 'All four alternatives are readable in the centered desktop column, with separated question sections and no formula/option overlap.'
          : [3, 4].includes(i)
            ? 'Narrow table cells wrap equations and coefficient expressions onto additional lines; all characters and last columns remain visible. Row heights accommodate wraps, no overlap or scroll crop. This is nonblocking wrapping, not a lost mathematical token.'
            : 'Mobile text and formulas wrap within the content width. All four options, controls and complete stem remain readable; no item runs off the screenshot edge.',
      })),
      controlStateEvidence: {
        question1OptionA: 'selected blue radio, as expected after machine first.check()',
        otherQuestion1Options: 'unselected radio circles',
        question6OptionsAThroughD: 'four empty square checkboxes',
        lastQuestionOptionD: 'visible unselected radio, not an inferred correct-answer state',
        noCorrectnessFeedbackOrLeakedKeysVisible: true,
      },
      readableFitEvidence: surfaceIndex === 0
        ? 'Centered column begins aroundx378 and ends aroundx1062 in1440px screenshot. Four-option tables, long stems, fractions and prime/subscript symbols are legible; section rules separate questions. Last ratio option and bottom margin are captured.'
        : 'The390px original screenshot uses the complete narrow column with both side margins. Tool scaled display to322x6000 from390x7277 once; readable full projection comparison still possible. Tables wrap instead of overflowing, including equations in question4 and coefficient cells in question5; all final columns and bottom option remain captured.',
      overlapOrCroppingFindings: [], noMissingStemsOrOptions: true,
      machineEvidenceReused: {
        result: binding(choice.result.path), producer: binding(path.join(tmp, 'offline-display.mjs')),
        recordedStatus: machine.status, documentWidth: machine.layout.documentWidth,
        questionCount: machine.questionCount,
        firstControlChecked: 'Inherited successful producer assertion at offline-display.mjs:173-175; screenshot independently shows checked first radio.',
        lastControlVisible: 'Inherited successful producer assertion at offline-display.mjs:176-177; fullpage screenshot independently includes last control.',
        limitations: 'Result is successful status evidence from the bound producer, not separately named first/last JSON fields. No new interaction, screenshot, math solving, answer read, text/exercise/source/figure review, or browser run.',
      },
    };
  });
  const choiceStatus = projectionHasNoKeys && visible.questions.length === 11
    && visible.questions.reduce((n, q) => n + q.options.length, 0) === 44
    && visible.questions.filter(q => q.mode === 'single').length === 10
    && visible.questions.filter(q => q.mode === 'multiple').length === 1 ? 'pass' : 'revise';
  write('choice-visual-review.json', {
    schema: 'same188-6/independent-first-choice-visual-review@1', status: choiceStatus,
    lesson: choice.lesson, book: choice.book, scope: choice.scope,
    questionsCompared: 11, optionsCompared: 44, singleQuestions: 10, multipleQuestions: 1,
    projectionHasNoAnswerKeys: projectionHasNoKeys, surfaces,
    findings: [], newScopedHolds: [],
    nonblockingDispositions: [
      { scope: 'mobile question4 equation cells', status: 'nonblocking-wrap', reason: 'Signs and constant terms wrap across lines inside table cells; none is omitted, clipped or overlapped.' },
      { scope: 'mobile question5 coefficient/header cells', status: 'nonblocking-wrap', reason: 'k=1 and k!=1 wrap vertically, as do long headers; expressions remain complete and table rows expand.' },
    ],
    actualImageLoads: 2, recaptures: 0, interactionsRepeated: 0,
    mathematicalReviewRepeated: false, answerKeysRead: false,
    inheritedSemanticReview: { ...choice.inheritedSemanticReview, role: 'hash-bound existing pass only; review body not reread or re-solved' },
    noPassedN46OtherScopeReviewRepeated: true,
    bindings: [binding(combined.choiceVisual.path), binding(choice.visibleQuestions.path), binding(choice.result.path), ...choice.screenshots.map(s => binding(s.path))],
    bindingEvidence, published: false,
  });

  const recorderReceipts = read(own('native-recorder-receipts.json'));
  const textAuthor = read(modern.authorReport.path);
  const figAuthor = read(figureManifest.figures[0].authorReport.path);
  const status = [modernStatus, ...figs.map(f => f.status), choiceStatus].every(x => x === 'pass') ? 'pass' : 'revise';
  const report = {
    schema: 'same188-6/sole-independent-scoped-review-report@1',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', role: 'sole independent FIRST reviewer',
    status, recordedAt: new Date().toISOString(), cwd: repo, writeRoot: root,
    results: {
      modernText: { status: modernStatus, lesson: modern.lesson, completeComparisonCount: 33, ...binding(own('modern-review.json')) },
      figures: { status: figs.every(f => f.status === 'pass') ? 'pass' : 'revise', ids: figs.map(f => f.id), ...binding(own('figures-review.json')) },
      choiceVisual: { status: choiceStatus, lesson: choice.lesson, ...binding(own('choice-visual-review.json')) },
    },
    bindingEvidence, combinedManifest: binding(combinedPath),
    counters: {
      actualImageLoads: 8, hardImageLimit: 8, sourceOriginalLoads: 2, finalFigurePNGLoads: 4, choiceScreenshotLoads: 2,
      reopens: 0, cropLoads: 0, screenshotRecaptures: 0, extraImageSlots: 0,
      nativeRecorderInvocations: recorderReceipts.receipts.length,
      nativeRecorderFailures: recorderReceipts.receipts.filter(r => r.exitCode !== 0).length,
      nativeRecorderInternalRenderedValidationInvocations: 2,
      standaloneNativeValidatorInvocations: 0, nativeFigureRendererInvocations: 0,
      nativeLessonFinalizeInvocations: 0, nativeLessonRenderInvocations: 0,
      independentFullObjectComparisons: 33, independentTextReviewRounds: 1, independentFigureReviewRounds: 1, independentChoiceVisualReviewRounds: 1,
      reviewerContentRepairs: 0, reviewerContentFailures: status === 'pass' ? 0 : 1, reviewerTechnicalFailures: 0,
      searchNoMatchExit1Count: 1, searchNoMatchIsTechnicalFailure: false,
      paidCalls: 0, modelCalls: 0, databaseOperations: 0, dependencyChanges: 0,
      credentialsRead: 0, backendOperations: 0, peerOrSupervisorMessages: 0, commits: 0,
    },
    nativeRecorderReceipts: binding(own('native-recorder-receipts.json')),
    actualImageLedger: binding(own('actual-image-loads.json')),
    inheritedAuthorCountersPreserved: {
      modernText: textAuthor.counts,
      figures: figAuthor.repairAndFailureAccounting,
      repairs16: 0, repairs17: 0,
      noCounterReset: true,
    },
    originalFailureBindings: combined.bindings.filter(x => /FIRST-(author|resumeauthor)-failure|preflight-failure-01|additional-execution-discovery-failures/.test(x.path)),
    newScopedHolds: [], preservedHolds,
    punctuationDispositions,
    boundaries: {
      all98InputsUnchanged: true, sourceDataUnchanged: true, originalTemplatesUnchanged: true,
      coreEdits: false, sourceEdits: false, readinessFlagsChanged: false,
      source49ExactGlyphUnknown: true, wholeAllInkPagesApproved: false,
      originalContains170Preserved: true, erratumOrSourceMathCorrection: false,
      noSetupFreshnessGrill: true, noServicesOrDepsOrCredentials: true,
      noN46MathematicalSourceOtherDisplayOrFigureReviewRepeated: true,
      noAnswersRead: true, noNativeRendererOrStandaloneValidatorRepeated: true,
      nativeRecordIsNotPromotion: true, promoted: false, finalized: false, published: false,
      wholeN47Completion: false, wholeN47Approval: false, N48Approval: false,
      writeScopeOnly: root,
    },
    stop: 'TEXT-only evidence for parent collection/closure. No messages, promotion, next lesson, or further image loads.',
  };
  write('report.json', report);
  const md = [
    '# SAME188-6 Independent FIRST Review',
    '',
    `Status: ${status}. Only N47 complete modern text, figures16/17, and first N46 actual choice display are reviewed.`,
    '',
    '- N47 text: 33/33 full raw/initial/current objects compared: 15 text + 6 placeholders + 6 captions + exercises49-54. All source.data, metadata, mathematical tokens, conditions, requests and figure_refs retained.',
    '- Figures16/17: PASS. Original PNGs were loaded first; independent FIRST inventories were frozen before author inventory/spec reading. Full current text, all source corners/edges, projected crossings, hidden-edge transitions, final SVG and480/300 previews compared.',
    '- N46 choice display: PASS on1440x960 and390x844 viewport evidence. Complete11 questions/44 options,40 radios/4 checkboxes. First radio selection and last control visibility reuse bound machine results; no math solving or answers reread.',
    '- Nonblocking: unchanged bold definition ASCII periods, original title punctuation and raw ABCDEF/ABCDFE lettering explicitly retained. Mobile table equation/coefficient wrapping remains complete and readable.',
    '- Preserved localHOLD: source49 literal49 raised-circle exact glyph/meaning UNKNOWN; whole-page all-ink and inherited source holds. originalContains170 wording unchanged. No erratum or source math correction.',
    '',
    '## Counters',
    '',
    '8/8 image loads =2 originals +4 final figure PNGs +2 choice screenshots. No crops, reopens or recaptures. Native record_review.py called exactly once perfigure,2 PASS records,0 failures. Required recorder internal validation ran twice;0 standalone validators,0 figure/lesson rerenders,0 finalizations.',
    '',
    'Reviewer repairs/content failures/technical failures:0/0/0. One text search returned expected no-match exit1, not a technical failure. Author repairs16=0,17=0 and all historical execution/width-check failures remain hash-bound; no counters reset.',
    '',
    '## Bindings',
    '',
    `98/98 manifest inputs match before and after, unchanged. Manifest: ${combinedPath}`,
    `Before: ${own('bindings-before.json')} SHA256 ${hash(own('bindings-before.json'))}`,
    `After: ${own('bindings-after.json')} SHA256 ${hash(own('bindings-after.json'))}`,
    ...['modern-review.json', 'figures-review.json', 'choice-visual-review.json', 'report.json'].map(n => `${own(n)} SHA256 ${hash(own(n))}`),
    '',
    'No input, source, core, template or text_contract_ready flag was changed. Native figure PASS is local review evidence, not promotion. Whole N47 completion/approval is NOT claimed; figures18-22 geometry, lesson display, finalization and publication remain outside this review.',
    '',
    'Stop for parent collection/closure. TEXT only; no image payloads returned.',
    '',
  ].join('\n');
  fs.writeFileSync(own('report.md'), md, { flag: 'wx' });
  console.log(JSON.stringify({ status, compared: evidence.length, figures: figs.map(x => ({ id: x.id, status: x.status })), choice: choiceStatus, report: binding(own('report.json')) }));
} else {
  throw new Error('Use record or reports');
}
