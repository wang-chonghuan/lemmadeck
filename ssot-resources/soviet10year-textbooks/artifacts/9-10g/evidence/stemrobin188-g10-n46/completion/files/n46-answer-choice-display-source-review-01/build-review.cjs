const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const out = path.join(process.cwd(), '.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-choice-display-source-review-01');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const canonical = v => {
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map(k => canonical(k) + ':' + canonical(v[k])).join(',') + '}';
  return JSON.stringify(v).replace(/[\u007f-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
};
const digest = v => crypto.createHash('sha256').update(canonical(v), 'utf8').digest('hex');
const seed = read('.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/seed.json');
const draft = read('.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/draft.json');
const projectedSource = read('.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-choice-review-inputs-01/source-only.json');
const projectedVisible = read('.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-choice-review-inputs-01/visible-questions.json');
const frozenSource = read(path.join(out, 'source-solutions-first.json'));
const frozenVisible = read(path.join(out, 'visible-observations-first.json'));
if (canonical(seed) !== canonical(projectedSource.seed)) throw new Error('Seed differs from source-only projection');
if (canonical(draft.questions.map(({id, view}) => ({id, view}))) !== canonical(projectedVisible.questions)) throw new Error('Visible projection differs from current draft');
if (digest(seed) !== draft.seed_sha256) throw new Error('Draft seed digest mismatch');
const coverageEvidence = {
  '34': 'Two questions exactly cover translation and k=-3/2 homothety of the given plane. Inverse substitution and signed offset are preserved. Free construction of both coordinate formulas and plane equations is lost and explicitly declared, but neither image equation is omitted.',
  '35': 'The complete three-row formula table covers central, planar and axial symmetry without merging their coordinate actions. All nine component signs are represented. Free derivation using midpoint/perpendicular foot is explicitly lost; 35 supplies mathematical tools for 36, as the original requires.',
  '36': 'One complete three-row plane table covers all three subcases and distinct normal/constant transformations. Independent scoped definition-role PASS justifies center O for item 1 without changing literal z_0. Free application and equation writing are recorded losses. The 35-to-36 relationship is warranted, not a hidden-key dependency.',
  '37': 'Two questions cover the full k=1 versus k!=1 point/line/plane classification, k=-1 inclusion, nonzero domain, set invariance versus pointwise fixing, and all-real-coefficient isometry iff |k|=1. The repaired positive/negative iff statements cover every admissible coefficient, not samples. Independent proof production remains an explicit capacity loss.',
  '38': 'Three questions cover both arbitrary-center constructions (opposite ray doubled; same-ray midpoint), all four vertices, coincident-center handling and six-edge/four-face incidence, followed by both original:image ratios 1:4 and 4:1. No exercise figure is supplied or required for a general algorithm. Actual drawing and independent joining/proof execution are lost. Two separately producible ratio subanswers become one paired-table response.',
  '39': 'Two questions cover fixed center vertex, all seven other vertices, twelve edges and six faces for a general oblique parallelepiped, plus original:image area 9:1. Partial adjacent-vertex contraction is explicitly tested and rejected. Actual eight-vertex drawing and area proof production are lost. One independently producible ratio subanswer becomes a selected ratio; together with 38 there are three ratio production losses.'
};
for (const q of draft.questions) {
  const r = frozenVisible.question_reviews.find(x => x.question_id === q.id);
  if (!r || canonical([...r.mathematics.correct].sort()) !== canonical([...q.key.correct].sort())) throw new Error(`Independent key mismatch: ${q.id}`);
  if (r.mathematics.option_checks.length !== q.view.options.length) throw new Error(`Option count mismatch: ${q.id}`);
  for (const option of r.mathematics.option_checks) {
    const rationale = q.key.rationales.find(x => x.option_id === option.option_id);
    if (!rationale || rationale.truth !== option.truth) throw new Error(`Option truth mismatch: ${q.id}/${option.option_id}`);
  }
}
for (const c of draft.coverage) {
  const actual = draft.questions.filter(q => q.source_numbers.includes(c.source_number)).map(q => q.id).sort();
  if (canonical(actual) !== canonical([...c.question_ids].sort())) throw new Error(`Coverage relationship mismatch: ${c.source_number}`);
}
const review = {
  schema: 's10y-choice-review-v1',
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  reviewer: {kind: 'independent_agent', identity: 'SAME188-6 sole independent reviewer'},
  source_reviews: frozenSource.source_reviews.map(r => ({...r, coverage: {verdict: 'pass', evidence: coverageEvidence[r.source_number]}})),
  figure_checks: [],
  new_figure_reviews: [],
  question_reviews: frozenVisible.question_reviews,
  outcome: 'pass'
};
const target = path.join(out, 'review.json');
if (fs.existsSync(target)) throw new Error(`Refusing overwrite: ${target}`);
fs.writeFileSync(target, JSON.stringify(review, null, 2) + '\n');
console.log(JSON.stringify({path: target, seed_sha256: review.seed_sha256, draft_sha256: review.draft_sha256, source_reviews: review.source_reviews.length, question_reviews: review.question_reviews.length, option_checks: review.question_reviews.reduce((n, r) => n + r.mathematics.option_checks.length, 0), native_validate_executed: false}, null, 2));
