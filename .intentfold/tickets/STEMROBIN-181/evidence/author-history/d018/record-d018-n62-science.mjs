import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async file => ({
  path: path.relative(root, path.resolve(file)),
  sha256: createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const freezePath = `${work}/9p-n62-prose-freeze.json`;
const freeze = await read(freezePath);
assert.equal(freeze.bindings.template.sha256, 'f97f26e7c5932a3be643a52becdbc7569180c1434aaa0c3e9c285f0ebc411222');
const bindings = {};
for (const key of ['template', 'source', 'sourceExercises', 'exercisesTemplate', 'nativeProseFlow']) {
  bindings[key] = await bind(freeze.bindings[key].path);
  assert.equal(bindings[key].sha256, freeze.bindings[key].sha256);
}
bindings.authorFreeze = await bind(freezePath);
const template = await read(bindings.template.path);
const referencesPath = `${work}/d018-n62-science-reference-notes.json`;
const references = {
  ticket: 'STEMROBIN-181', batch: 'D018', lesson: 'phy9-c2-s2-n62',
  reviewer: 'session-D', read_date: '2026-11-16',
  method: 'Actual rendered pages already read through CloakBrowser in this same SCI inspection before context transition; this command only records the completed observations. All fetch sessions closed. No refetch.',
  references: [
    {
      id: 'R1', publisher: 'OpenStax', title: "Physics,18.2 Coulomb's Law",
      url: 'https://openstax.org/books/physics/pages/18-2-coulombs-law',
      actually_read: true,
      evidence: 'Torsion-balance principle; sharing charge with an identical initially uncharged conducting sphere; force dependence on charges and separation; attraction and repulsion.',
      supports: ['/prose/7', '/prose/10', '/prose/11', '/prose/12', '/prose/17'],
      limits: 'Does not establish an unconditional equal-sharing rule in arbitrary surroundings or quantify this historical apparatus.'
    },
    {
      id: 'R2', publisher: 'OpenStax', title: "University Physics Volume2,5.3 Coulomb's Law",
      url: 'https://openstax.org/books/university-physics-volume-2/pages/5-3-coulombs-law',
      actually_read: true,
      evidence: 'Coulomb-force magnitude uses absolute charge values; forces combine as vectors; static pair forces are equal and opposite. Vacuum permittivity is expressed in C squared per N metre squared.',
      supports: ['/prose/3', '/prose/4', '/prose/11', '/prose/12', '/prose/13', '/prose/17'],
      reusable_scope: 'The actually read vacuum-permittivity unit may be reused for n63 without another fetch; no n63 SCI approval is implied.',
      limits: 'No new numerical constant or replacement formula is imported into n62.'
    },
    {
      id: 'R3', publisher: 'Academie des sciences', title: 'Charles-Augustin de Coulomb',
      url: 'https://www.academie-sciences.fr/pdf/dossiers/Coulomb/Coulomb_od1.htm',
      actually_read: true,
      evidence: 'Institutional biography supports1736-1806, electrical research beginning1785 and sensitive torsion apparatus.',
      supports: ['/prose/0', '/prose/5', '/prose/7'],
      limits: 'Does not verify the footnote manuscript-discovery or exclusive-priority story. Modern text expressly attributes those details to the old book.'
    }
  ],
  unusable_attempts: [
    { source: 'APS article', result: '403 challenge', scientific_evidence: false },
    { source: 'Academie Coulomb_publi.htm', result: '200 title only; body timed out', scientific_evidence: false }
  ]
};
const assessments = [
  [0, 'Classical static regime and electrostatics correctly qualify the source topic; Coulomb1785 is supported by R3.'],
  [1, 'Cavendish/Maxwell and Cambridge manuscript account is expressly source-attributed, not asserted as verified priority or a newly established historical event.'],
  [3, 'Finite-body approximation requires separation large relative to size and nonzero dominant total charge. Residual shape/distribution effects are not said to vanish; neutral or distribution-dominated bodies are excluded from that simple approximation.'],
  [4, 'A given static distribution is divided into charge elements and combined by vector superposition; a conductor must first reach the appropriate equilibrium distribution. Scalar addition is not substituted for vector force.'],
  [5, 'Caption retains source1736-1806 and historical identity; electric, magnetic and friction research is not promoted into an invented priority claim.'],
  [6, 'Vacuum law is distinguished from an air approximation, which is explicitly conditional rather than a universal dielectric law.'],
  [7, 'B/A/a/c/b torsion apparatus description is complete. Small-force visibility depends on sensitivity and environment; fibre twist is a calibrated restoring torque, not an unconditional direct force reading.'],
  [10, 'Equal sharing is restricted to identical isolated conductors in symmetric surroundings after equilibrium; repeated initially neutral companion spheres yield halves and quarters. Source2/4 reduction is not described as amplification.'],
  [11, 'Coulomb magnitude law correctly specifies static point charges in vacuum and inverse-square separation.'],
  [12, 'Magnitude uses absolute charge amounts; separation is the positive point-charge distance.'],
  [13, 'Equation8-2 and all original math atoms remain unchanged; sign controls attraction/repulsion separately from the nonnegative magnitude interpretation.'],
  [14, 'Coefficient depends on the unit system; source unit-charge/unit-distance interpretation is correctly bounded to that chosen system.'],
  [15, 'Analogy with gravity is a similarity of mathematical form, not equality of mass/charge or a claim that electric interaction is always attractive.'],
  [16, 'Magnitude alone does not determine force direction.'],
  [17, 'Central attraction/repulsion and equal/opposite forces are restricted to the static situation. The forces act on different charges and cannot cancel as two forces on one body.'],
  [20, 'Coulomb interaction is a classical electrostatic characterization of charge, not a universal definition replacing the more general physical property.']
].map(([index, reasoning]) => ({
  location: `/prose/${index}/text`, source_refs: template.prose[index].source_refs,
  status: 'pass', reasoning,
}));
await fs.writeFile(referencesPath, `${JSON.stringify(references, null, 2)}\n`, { flag: 'wx' });
bindings.references = await bind(referencesPath);
await fs.writeFile(`${work}/9p-n62-science-review.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', lesson: 'phy9-c2-s2-n62',
  reviewer: 'session-D, independent of the frozen prose author', status: 'pass',
  reviewKind: 'unique-independent-initial-science-gate',
  bindings,
  inspected_scope: 'Completed pre-transition inspection of the entire actual source lesson/exercises, complete frozen modern template, metadata and retained native prose flow. This script records that inspection and checks byte bindings only; no second SCI pass.',
  raw_comparison: {
    source_snapshot_deep_equal_current_source: true,
    all_21_source_texts_exact: true,
    kinds_ids_labels_pages_refs_order_exact: true,
    lesson_identity_headers_and_figure_list_exact: true,
    math_token_comparison_previously_executed: 'No differences;13 source math fragments retained in sequence.',
    source_and_modern_tasks: 0,
    figures: ['tbl-p0153-01', 'fig-106', 'fig-107'],
    figure_stubs_and_captions_unchanged_except_declared_portrait_caption_wording: true,
    errata: [],
    normalized_paragraphs: 26,
    native_section_boundaries: 5
  },
  block_assessments: assessments, findings: [],
  limits: 'One substantive SCI inspection recorded here. Native author checks reused, not rerun. No original-pixel/modern-figure approval, task invention, answer/choice gate, modern finalization, full-project check or production write.',
  in_flight_processes: []
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: 'pass', review: `${work}/9p-n62-science-review.json`, references: referencesPath }));
