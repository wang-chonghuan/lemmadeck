import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp';
const owned = path.join(root, 'd585-n76-first-independent-text-review');
const author = path.join(root, 'd582-n76-first-bilingual-text-author');
const load = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const sha = filename => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
const source = load(path.join(author, 'source/lesson.json'));
const sourceExercises = load(path.join(author, 'source/exercises.json'));
const criteria = load(path.join(owned, 'criteria.json'));
const mapping = load(path.join(author, 'source-sentence-mapping.json'));
const locales = Object.fromEntries(['zh', 'en'].map(locale => [locale, {
  path: path.join(author, `candidate/${locale}/lesson.template.json`),
  lesson: load(path.join(author, `candidate/${locale}/lesson.template.json`)),
  exercises: load(path.join(author, `candidate/${locale}/exercises.template.json`)),
  figures: load(path.join(author, `candidate/${locale}/figures.template.json`))
}]));
const checks = [];
function check(id, pass, evidence) {
  checks.push({ id, status: pass ? 'PASS' : 'FAIL', ...evidence });
}
const mathTokens = text => [...text.matchAll(/\$([^$]+)\$/g)].map(match => match[1]);
const unique = values => [...new Set(values)].sort();

// Source propositions are identified by this reviewer, not copied from the author's mapping.
const atoms = [
  ['R01-A01', 'N76-R01', ['p0202#1'], -1, [1], 'Numbered lens-image-construction heading.'],
  ['R02-A01', 'N76-R02', ['p0202#2'], 0, [1], 'Focal positions characterize the thin-lens model.'],
  ['R02-A02', 'N76-R02', ['p0202#2'], 0, [2], 'Object distance and focal length determine image position.'],
  ['R02-A03', 'N76-R02', ['p0202#2'], 0, [2], 'No tracing of internal paths or exact spherical surfaces is needed.'],
  ['R02-A04', 'N76-R02', ['p0202#2'], 0, [3], 'Distinct symbols identify converging Figure 177 and diverging Figure 178.'],
  ['R03-A01', 'N76-R03', ['p0202#7'], 5, [1], 'Emphasized point-to-point imaging proposition.'],
  ['R03-A02', 'N76-R03', ['p0202#7'], 5, [3], 'Imaging each point gives an image of the whole object.'],
  ['R04-A01', 'N76-R04', ['p0202#8'], 6, [1], 'Known converging-lens foci and optical center enable three special rays.'],
  ['R04-A02', 'N76-R04', ['p0202#8'], 6, [2], 'A parallel incident ray refracts through the far focus.'],
  ['R04-A03', 'N76-R04', ['p0202#8'], 6, [3], 'A near-focus incident ray emerges parallel by reversibility.'],
  ['R04-A04', 'N76-R04', ['p0202#8'], 6, [4, 5], 'Optical-center direction is retained; small real-lens translation is neglected, not zero.'],
  ['R05-A01', 'N76-R05', ['p0202#9'], 7, [1], 'Worked image construction of AB in Figure 179.'],
  ['R05-A02', 'N76-R05', ['p0202#9'], 7, [2], 'Select A; AC is incident parallel and refracts through the far focus.'],
  ['R06-A01', 'N76-R06', ['p0203#1'], 7, [2], 'Accepted continuation: AD through the near focus emerges parallel.'],
  ['R06-A02', 'N76-R06', ['p0203#1'], 7, [3], 'Refracted-ray intersection locates A_1; other object points are treated similarly.'],
  ['R06-A03', 'N76-R06', ['p0203#1', 'p0203#4'], 7, [4], 'Many rays form the image, not only two or three construction rays.'],
  ['R06-A04', 'N76-R06', ['p0203#4'], 7, [5], 'AOA_1 passes through optical center O and reaches A_1.'],
  ['R07-A01', 'N76-R07', ['p0203#4'], 7, [6], 'Any two independent special rays suffice for construction.'],
  ['R07-A02', 'N76-R07', ['p0203#4'], 7, [7], 'First original prose rule: optical-center ray.'],
  ['R07-A03', 'N76-R07', ['p0203#4'], 7, [8], 'Second original prose rule: incident parallel ray.'],
  ['R07-A04', 'N76-R07', ['p0203#4'], 7, [9], 'Third original prose rule: ray through the focus before the lens.'],
  ['R08-A01', 'N76-R08', ['p0203#5'], 10, [1], 'Consider an object point on the principal axis.'],
  ['R08-A02', 'N76-R08', ['p0203#5'], 10, [2], 'The three special rays coincide, so independent information is missing.'],
  ['R08-A03', 'N76-R08', ['p0203#5'], 10, [3], 'Trace SB to lens point B; retain Figure 180.'],
  ['R08-A04', 'N76-R08', ['p0203#5'], 10, [4], 'Construct secondary axis PQ parallel to SB and intersect the focal plane through F at C.'],
  ['R08-A05', 'N76-R08', ['p0203#5', 'p0203#8'], 10, [5], 'Refracted BC goes through C across the accepted split 折/射.'],
  ['R08-A06', 'N76-R08', ['p0203#8'], 10, [5], 'Two ray paths are retained, including the principal-axis ray.'],
  ['R08-A07', 'N76-R08', ['p0203#8'], 10, [6], 'With S between the focus and converging lens the refracted rays diverge and S_1 is virtual.']
];

for (const [locale, data] of Object.entries(locales)) {
  const candidate = data.lesson;
  check(`SOURCE-SNAPSHOT-${locale}`, isDeepStrictEqual(candidate.source.data, source) &&
    isDeepStrictEqual(data.exercises.source.data, sourceExercises), {
      lesson_pointer: '/source/data', exercises_pointer: '/source/data'
    });
  check(`PROSE-OBJECT-IDENTITIES-${locale}`,
    candidate.prose.length === source.prose.length &&
    candidate.prose.every((object, index) => ['kind', 'id', 'label', 'printed_page', 'source_refs']
      .every(key => isDeepStrictEqual(object[key], source.prose[index][key]))), {
      prose_objects: candidate.prose.length,
      paragraphs: candidate.prose.filter(object => object.kind === 'p').length,
      figures: candidate.prose.filter(object => object.kind === 'fig').length,
      captions: candidate.prose.filter(object => object.kind === 'cap').length
    });
  check(`SOURCE-TEXT-LITERALS-${locale}`, candidate.prose.every((object, index) =>
    object.source_text === source.prose[index].text), {
      source_prose_objects: source.prose.length,
      literal_dot_in_source_reference_retained: candidate.prose[0].source_text.includes('图.178'),
      literal_italic_source_retained: candidate.prose[5].source_text.includes('*物体上')
    });
  check(`NO-EXERCISES-${locale}`, sourceExercises.count === 0 &&
    sourceExercises.exercises.length === 0 &&
    data.exercises.count === 0 && data.exercises.exercises.length === 0 &&
    candidate.exercise_count === 0, {
      expected_count_independently_frozen: 0, actual_count: data.exercises.count,
      candidate_exercises_sha256: sha(path.join(author, `candidate/${locale}/exercises.template.json`))
    });
  check(`FIGURE-IDENTITIES-${locale}`, isDeepStrictEqual(candidate.figures, source.figures) &&
    isDeepStrictEqual(data.figures.figures.map(figure => figure.id), source.figures.map(figure => figure.id)), {
      ids: data.figures.figures.map(figure => figure.id),
      scope: 'Text identities and bindings only; no FIG approval.'
    });
  for (const index of [0, 5, 6, 7, 10]) {
    const object = candidate.prose[index];
    check(`MATH-SYMBOL-INVENTORY-${locale}-${index}`,
      isDeepStrictEqual(unique(mathTokens(object.text)), unique(mathTokens(object.source_text))), {
        pointer: `/prose/${index}/text`,
        source_tokens_literal_order: mathTokens(object.source_text),
        modern_tokens_literal_order: mathTokens(object.text),
        explanation: 'Modern translation may reorder or avoid repeated mentions; all source math-symbol spellings survive and no new symbol or equation is introduced. Source snapshot order remains exact.'
      });
  }
  for (const index of [6, 7]) {
    const lines = candidate.prose[index].text.split('\n');
    const numbered = lines.flatMap((line, offset) => {
      const match = /^([123])\)\s+\S/.exec(line);
      return match ? [{ number: Number(match[1]), text_line: offset + 1, text: line }] : [];
    });
    check(`TEACHING-LIST-${locale}-${index}`,
      isDeepStrictEqual(numbered.map(item => item.number), [1, 2, 3]), {
        pointer: `/prose/${index}/text`, kind: candidate.prose[index].kind,
        numbered, practice_count: data.exercises.exercises.length,
        display_not_run: true
      });
  }
}

const paragraphIndexes = source.prose.flatMap((object, index) => object.kind === 'p' ? [index] : []);
check('AUTHOR-MAPPING-EXHAUSTIVE-PARAGRAPHS',
  isDeepStrictEqual(mapping.mappings.map(entry => entry.index), paragraphIndexes), {
    expected_paragraph_indexes: paragraphIndexes,
    actual_mapping_indexes: mapping.mappings.map(entry => entry.index),
    note: 'The author mapping is paragraph-aggregate, not a per-sentence proof. Independent atoms and figure/caption evidence complete the review.'
  });
for (const entry of mapping.mappings) {
  const expectedRequirements = criteria.requirements.filter(requirement =>
    requirement.source_refs.some(ref => source.prose[entry.index].source_refs.includes(ref)))
    .map(requirement => requirement.id);
  check(`AUTHOR-MAPPING-ROW-${entry.index}`,
    entry.source_text === source.prose[entry.index].text &&
    isDeepStrictEqual(entry.source_refs, source.prose[entry.index].source_refs) &&
    entry.ref === entry.source_refs[0] &&
    entry.zh === locales.zh.lesson.prose[entry.index].text &&
    entry.en === locales.en.lesson.prose[entry.index].text &&
    isDeepStrictEqual(entry.requirements, expectedRequirements), {
      source_refs: entry.source_refs, expected_requirements: expectedRequirements,
      actual_requirements: entry.requirements, index: entry.index
    });
}
check('HEADING-MAPPING', mapping.heading.source_ref === 'p0202#1' &&
  mapping.heading.requirement === 'N76-R01' &&
  mapping.heading.zh === locales.zh.lesson.title &&
  mapping.heading.en === locales.en.lesson.title &&
  locales.zh.lesson.number === '76' && locales.en.lesson.number === '76', {
    heading: mapping.heading, source_printed_heading: source.printed_title,
    modern_printed_headings: { zh: locales.zh.lesson.printed_title, en: locales.en.lesson.printed_title }
  });

const coverageAtoms = atoms.map(([id, requirement, refs, index, lineNumbers, proposition]) => ({
  id, requirement, source_refs: refs, source_proposition: proposition,
  source_coverage_status: 'PASS',
  judgment_basis: 'Reviewer read these source propositions and both candidate texts; extraction only records the localized evidence, not an automatic physics verdict.',
  physics_caveat: id === 'R08-A04' ? 'N76-R08-H01: focal-plane side remains unqualified.' : null,
  candidate_evidence: Object.entries(locales).map(([locale, data]) => ({
    locale, path: data.path, sha256: sha(data.path),
    pointer: index === -1 ? '/printed_title' : `/prose/${index}/text`,
    text_lines_one_based: lineNumbers,
    actual_text: index === -1 ? data.lesson.printed_title :
      lineNumbers.map(number => data.lesson.prose[index].text.split('\n')[number - 1]).join('\n')
  }))
}));

const figureCaptionCoverage = source.prose.flatMap((object, index) => {
  if (object.kind !== 'fig' && object.kind !== 'cap') return [];
  return [{
    source_refs: object.source_refs, source_prose_pointer: `/prose/${index}`,
    kind: object.kind, id: object.id, label: object.label,
    source_text: object.text, text_identity_status: 'PASS',
    zh_text: locales.zh.lesson.prose[index].text,
    en_text: locales.en.lesson.prose[index].text,
    candidate_pointer: `/prose/${index}`, FIG: 'NOT_REVIEWED'
  }];
});
const output = {
  schema: 'd585/n76-independent-text-evidence@1',
  generated_at_utc: new Date().toISOString(),
  review_id: 'd585-n76-first-independent-text-review',
  criteria_sha256: sha(path.join(owned, 'criteria.json')),
  source_sha256: sha(path.join(author, 'source/lesson.json')),
  author_mapping_sha256: sha(path.join(author, 'source-sentence-mapping.json')),
  mechanical_text_status: checks.every(entry => entry.status === 'PASS') ? 'PASS' : 'FAIL',
  mechanical_status_is_not_SCI_or_ZHEN_verdict: true,
  imageOpens: 0, native_stages: 0,
  checks, independent_source_proposition_atoms: coverageAtoms,
  figure_caption_text_coverage: figureCaptionCoverage,
  modernization_clarifications: [
    'Explicit thin-lens/paraxial scope and non-exact arbitrary-ray warning.',
    'Actual-ray real image versus backward-extension virtual image.',
    'Near/far ray rules, reversibility and finite-lens small translation qualification.',
    'Two independent rays and axial degeneracy.',
    'Secondary axis through optical center; focal plane perpendicular to principal axis.',
    'Axial ray retained and backward extensions not treated as real backward propagation.'
  ],
  first_HOLD_retained: load(path.join(owned, 'first-findings.json')).first_HOLD.id,
  unresolved_physics: ['N76-R08-H01'],
  representation_note: 'Original italic asterisk markup is unchanged in the snapshots/source_text. Modern corresponding propositions use matching bold emphasis in ZH and EN. This is retained textual emphasis, not a DISPLAY or exact typography certificate.'
};
const filename = path.join(owned, 'text-evidence.json');
fs.writeFileSync(filename, `${JSON.stringify(output, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({
  mechanical_text_status: output.mechanical_text_status,
  checks: checks.length, source_proposition_atoms: coverageAtoms.length,
  figure_caption_objects: figureCaptionCoverage.length,
  unresolved_physics: output.unresolved_physics,
  failed_checks: checks.filter(entry => entry.status === 'FAIL'),
  path: filename, sha256: sha(filename)
}, null, 2));
if (output.mechanical_text_status !== 'PASS') process.exitCode = 1;
