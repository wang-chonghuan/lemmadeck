import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp')
const output = path.join(tmp, 'n41-modern-text-review')
const previous = JSON.parse(fs.readFileSync(path.join(output, 'pre-author-input-bindings.json'), 'utf8'))
const files = new Map(previous.files.map((item) => [item.path, item]))
const checks = []
function read(filename, role) {
  const absolute = path.resolve(root, filename)
  const bytes = fs.readFileSync(absolute)
  const old = files.get(absolute)
  files.set(absolute, {
    path: absolute,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    roles: [...new Set([...(old?.roles ?? []), role])],
  })
  return bytes
}
function check(id, condition, detail = null) {
  checks.push({ id, status: condition ? 'pass' : 'fail', detail })
}
for (const item of previous.files) {
  const current = crypto.createHash('sha256').update(fs.readFileSync(item.path)).digest('hex')
  check(`pre-author-input-stable:${path.relative(root, item.path)}`, current === item.sha256)
}
const author = {}
for (const filename of ['report.md', 'report.json', 'erratum-proposal.json', 'input-bindings.json']) {
  const bytes = read(path.join(tmp, 'n41-proof-author', filename), 'author-read-last')
  author[filename] = filename.endsWith('.json') ? JSON.parse(bytes) : bytes.toString('utf8')
}
const proposal = author['erratum-proposal.json']
const authorInputs = author['input-bindings.json']
for (const item of authorInputs.inputs) {
  const actual = crypto.createHash('sha256').update(read(item.path, 'author-input-hash-only-no-image-open')).digest('hex')
  check(`author-input-binding:${item.id}`, actual === item.sha256)
}
for (const filename of ['source-first.md', 'verify-inputs.mjs', 'mechanical-evidence.json', 'pre-author-input-bindings.json', 'verify-author.mjs']) {
  read(path.join(output, filename), 'independent-review-evidence')
}
const page = JSON.parse(read(
  'ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0141/page.json',
  'native-erratum-source-current').toString('utf8'))
const sourceText = page.blocks[1].lines.join('').replace(/\u21b5/g, '')
const lesson = JSON.parse(read(
  path.join(tmp, 'g10-n41/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s3-n41/lesson.template.json'),
  'reviewed-candidate-current').toString('utf8'))
const occurrences = (text, part) => text.split(part).length - 1
check('author-original-exact-source-substring-once', occurrences(sourceText, proposal.original) === 1)
check('corrected-exact-modern-substring-once', occurrences(lesson.prose[3].text, proposal.corrected) === 1)
check('printed-original-absent-from-modern-target', occurrences(lesson.prose[3].text, proposal.original) === 0)
check('author-proposal-agrees-with-source-first-formula',
  proposal.original === '$\\cos\\alpha<\\cos(\\widehat{NSD})$' &&
  proposal.corrected === '$\\cos\\alpha<\\cos(\\widehat{NSB})$' &&
  proposal.block === 'p0141#2' && proposal.id === 'p0141-math-n41-nsd-nsb-1')
check('registration-pending-not-claimed-complete', page.meta.errata.length === 0 && lesson.errata.length === 0)

// Independently recalculate the author's rational witness, not the author's verifier.
const S = [0, 0, 0]
const A = [1, 0, 0]
const B = [-3 / 5, 4 / 5, 0]
const C = [0, -3 / 5, 4 / 5]
const N = [0, 1 / 2, 0]
const D = [0, -3 / 10, 2 / 5]
const M = [0, 1, 0]
const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0)
const subtract = (a, b) => a.map((value, index) => value - b[index])
const sq = (a) => dot(a, a)
const cosine = (a, b) => dot(a, b) / Math.sqrt(sq(a) * sq(b))
const near = (a, b) => Math.abs(a - b) < 1e-12
const vectorNear = (a, b) => a.every((value, index) => near(value, b[index]))
const determinant = A[0] * (B[1] * C[2] - B[2] * C[1]) -
  A[1] * (B[0] * C[2] - B[2] * C[0]) +
  A[2] * (B[0] * C[1] - B[1] * C[0])
const measured = {
  determinant,
  cosAlpha: cosine(B, C),
  cosBeta: cosine(A, C),
  cosGamma: cosine(A, B),
  cosNSD: cosine(N, D),
  cosNSB: cosine(N, B),
  AD2: sq(subtract(A, D)),
  AN2: sq(subtract(A, N)),
  DB2: sq(subtract(D, B)),
  NB2: sq(subtract(N, B)),
  SD2: sq(D),
  SN2: sq(N),
}
const expected = {
  determinant: 16 / 25,
  cosAlpha: -12 / 25,
  cosBeta: 0,
  cosGamma: -3 / 5,
  cosNSD: -3 / 5,
  cosNSB: 4 / 5,
  AD2: 5 / 4,
  AN2: 5 / 4,
  DB2: 173 / 100,
  NB2: 45 / 100,
  SD2: 1 / 4,
  SN2: 1 / 4,
}
for (const [key, value] of Object.entries(expected)) {
  check(`independent-author-witness-${key}`, near(measured[key], value))
}
check('independent-author-witness-N-inside-AB',
  vectorNear(N, A.map((value, index) => value + (5 / 8) * (B[index] - value))))
check('independent-author-witness-D-on-SC', vectorNear(D, C.map((value) => value / 2)))
check('independent-author-witness-N-on-SM', vectorNear(N, M.map((value) => value / 2)))
check('independent-author-witness-unit-rays', [A, B, C].every((v) => near(sq(v), 1)))
check('independent-author-witness-gamma-largest', measured.cosGamma < measured.cosAlpha && measured.cosAlpha < measured.cosBeta)
check('independent-author-witness-interior-ray',
  near(cosine(A, M), measured.cosBeta) && measured.cosBeta > measured.cosGamma)
check('independent-author-witness-printed-inequality-false', !(measured.cosAlpha < measured.cosNSD))
check('independent-author-witness-corrected-inequality-true', measured.cosAlpha < measured.cosNSB)
check('independent-author-witness-side-comparison-true', measured.DB2 > measured.NB2)
check('independent-author-witness-cosine-law-subtraction',
  near(measured.DB2 - measured.NB2, 2 * Math.sqrt(sq(B) * sq(D)) * (measured.cosNSB - measured.cosAlpha)))
check('author-reason-supported', typeof proposal.reason === 'string' &&
  proposal.reason.includes('BSD and BSN') && proposal.reason.includes('SD = SN') &&
  proposal.reason.includes('cos(angle NSB)'))
check('historical-invented-approval-note-retained',
  author['report.md'].includes('explicit human mathematical-replacement approval') &&
  author['report.json'].scope_gates.modern_correction === 'HOLD_PENDING_INDEPENDENT_REVIEW_AND_EXPLICIT_HUMAN_APPROVAL')

const nativeRecord = {
  id: proposal.id,
  block: proposal.block,
  original: proposal.original,
  reason: proposal.reason,
}
const evidence = {
  schema: 'ld-s10y-lesson/independent-proof-comparison@1',
  recorded_at: new Date().toISOString(),
  status: checks.every((item) => item.status === 'pass') ? 'pass' : 'revise',
  source_first_precedes_modern_and_author: true,
  author_read_after_saved_full_modern_review: true,
  independent_symbolic_proof: 'DB^2-NB^2 = 2 SB SD (cos(NSB)-cos(alpha)) > 0, since SD=SN.',
  author_witness_independent_recalculation: { coordinates: { S, A, B, C, N, D, M }, measured, exact_rational_expected: expected },
  native_registration: {
    status: 'pending-deterministic-binding',
    registered_by_reviewer: false,
    record: nativeRecord,
    modern_corrected: proposal.corrected,
    modern_target: 'lesson.prose[3]',
    pre_registration_page_json_sha256: files.get(path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0141/page.json')).sha256,
    post_registration_sha256: null,
    binding_rule: 'The native source registry must generate the modern source record with the actual post-registration page.json SHA256 and unchanged original, block, target and reason; do not reuse the pre-registration digest as the registry digest.',
  },
  authorization: {
    controlling_direct_human_instruction: 'Current delegation permits source-bound deterministic corrections after independent evidence, with no additional human approval gate.',
    author_old_invented_gate: 'Retained unchanged as historical evidence; not a new human directive, not a genuine mathematical HOLD.',
    no_extra_human_approval_required_for_this_supported_source_bound_correction: true,
    finalization_or_publication_approved_by_this_review: false,
  },
  checks,
  failures: checks.filter((item) => item.status !== 'pass'),
}
const manifest = {
  schema: 'ld-s10y-lesson/independent-review-input-bindings@1',
  recorded_at: evidence.recorded_at,
  hash_algorithm: 'SHA256',
  files: [...files.values()],
}
for (const [filename, data] of [['author-comparison.json', evidence], ['input-bindings.json', manifest]]) {
  fs.writeFileSync(path.join(output, filename), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
console.log(JSON.stringify({
  status: evidence.status,
  checks: checks.length,
  failures: evidence.failures,
  input_files: files.size,
  witness: measured,
  native_registration: nativeRecord,
  corrected: proposal.corrected,
}, null, 2))
if (!isDeepStrictEqual(evidence.failures, [])) process.exitCode = 1
