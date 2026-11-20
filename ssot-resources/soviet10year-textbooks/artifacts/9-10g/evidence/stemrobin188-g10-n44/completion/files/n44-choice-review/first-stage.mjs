import { choice, read, write, seal, binding, now, seedPath } from './audit-lib.mjs';

const base = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral';
const lessonDir = `${base}/lessons/geo910-c2-s1-n44`;
const seed = read(seedPath);
const lesson = read(`${lessonDir}/lesson.json`);
const exercises = read(`${lessonDir}/exercises.json`);
const projection = {
  book: '9-10g', lesson: lesson.id, edition: lesson.edition, status: lesson.status,
  definitions: [0, 1, 2, 7].map(block => ({ block, kind: lesson.prose[block].kind, text: lesson.prose[block].text })),
  exercises: exercises.exercises.map(e => ({
    number: e.number, source_number: e.source_number, group: e.group, group_id: e.group_id,
    text: e.text, figure_refs: e.figure_refs, pages: e.pages,
  })),
};
write(`${choice}/source-projection.json`, projection);
const solutions = [
  { source_number: '16', construction: ['2i+3j+k', 'i-j+2k', '-3i+(1/2)j-k', '2j-3k', '-(3/2)k'], scope: 'All A,B,D,E,G; E in Oyz and G on negative Oz. Signed ordered construction, not input copying.' },
  { source_number: '17', results: ['(-3,5,-3)', '(-11/10,4/3,-1/6)'], derivation: 'PQ=Q-P in both source parts.' },
  { source_number: '18', projection: '(0,-3,1)', length: 'sqrt(10)', derivation: 'Zero x only; squared projected norm=10.' },
  { source_number: '19', result: '(0,1,0)', derivation: 'X=(0,t,0); t^2+2t+6=t^2-2t+10 gives unique t=1; both distances 3.' },
  { source_number: '20', midpoint_A1: '(7/2,1/2,4)', midpoint_B1: '(7/2,-1,2)', medians: ['sqrt(62)/2', 'sqrt(53)/2'], centroid: '(10/3,-1/3,3)', origin_distance: 'sqrt(182)/3', angle_cosines: ['14/15', '11/(5sqrt(6))', '-5/(3sqrt(6))'], angle_degrees: ['21.039469781317237', '26.084541552047035', '132.87598866663575'], scope: 'Both full medians, centroid distance, all three internal angles; C obtuse.' },
  { source_number: '21', vertex_order_declared: false, cases: [
    { opposite: 'A,C', fourth_vertex: '(0,-6,0)', diagonals: ['sqrt(33)', 'sqrt(105)'] },
    { opposite: 'A,B', fourth_vertex: '(2,0,0)', diagonals: ['sqrt(59)', '3sqrt(3)'] },
    { opposite: 'B,C', fourth_vertex: '(-6,8,2)', diagonals: ['sqrt(10)', 'sqrt(174)'] },
  ], completeness: 'Three possible opposite known pairs; AB cross AC=(3,-1,16) nonzero.' },
  { source_number: '22', proof: 'AB=DC=(-1,-3,1), BC=AD=(-3,-1,8); both midpoints (0,2,1/2); cross=(-23,5,-8) nonzero.', AC: '(-4,-4,9)', BD: '(-2,2,7)', dot: 63, squared_norms: [113, 57], acute_angle: 'arccos(63/sqrt(6441))', angle_degrees: ['38.28028412223281', '141.7197158777672'], scope: 'Proof plus named smaller diagonal-line angle, supplement acknowledged.' },
];
const observedAt = now();
const previews = read(`${choice}/preview-bindings.json`);
const observations = [
  'Common tail O; i down-left, j right, k up; complete OM ends at M top-right. No exercise answer values.',
  'O; A on x/i, B on y/j, C on z/k; M off axes; dashed negative x,y,z extensions. Rightmost and bottommost objects visible.',
];
write(`${choice}/image-ledger.json`, {
  schema: 'same188-6/image-ledger@1', context_source_first: true,
  batches: [{ batch: 1, actual_image_loads: 2, max_per_batch: 8, cumulative_context_loads: 2, max_context: 24 }],
  entries: previews.records.map((r, index) => ({ ...r, opened_at: observedAt, open_order: index + 1, actual_loads: 1, observation: observations[index], inherited_image: false })),
  original_pngs_opened: false, specs_opened: false, source_figure_surface_production_gates: 'inherited; not rerun',
});
write(`${choice}/FIRST-source.json`, {
  schema: 'same188-6/independent-first-source@1', completed_at: now(),
  reviewer: { kind: 'independent_agent', identity: 'SAME188-6 independent reviewer, STEMROBIN-188' },
  independent_solve_count_per_source: 1, sources: solutions,
  permitted_input_bindings: [seedPath, `${lessonDir}/lesson.json`, `${lessonDir}/exercises.json`, `${lessonDir}/figures.json`, ...seed.figures.flatMap(f => f.assets.map(a => a.path))].map(binding),
  markdown_evidence: binding(`${choice}/FIRST-source.md`),
  accidental_exposure: 'Initial projection of lesson.prose array exposed current source worked examples beyond definition block 7. No choice/answer author internals, keys, prior reviews or inherited images exposed. Disclosed; formulas are not accepted as independent evidence.',
  forbidden_author_fields_read: false, draft_read: false, standard_candidate_read: false,
});
seal('FIRST-source', [`${choice}/FIRST-source.md`, `${choice}/FIRST-source.json`, `${choice}/source-projection.json`, `${choice}/image-ledger.json`, `${choice}/preview-bindings.json`], {
  chronology: 'Source solutions and actual figure observations persisted before any draft read.',
  independent_solve_count: 7, actual_images: 2, candidate_not_read: true,
});
