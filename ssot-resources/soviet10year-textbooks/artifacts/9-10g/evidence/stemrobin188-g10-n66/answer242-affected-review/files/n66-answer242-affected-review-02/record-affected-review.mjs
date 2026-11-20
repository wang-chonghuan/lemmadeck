import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const inputsPath = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n66-answer242-affected-02/review-inputs.json')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const artifact = file => {
  const stat = fs.statSync(file)
  return { path: file, sha256: hash(fs.readFileSync(file)), bytes: stat.size, mode: (stat.mode & 0o777).toString(8).padStart(4, '0') }
}
const ordered = value => Array.isArray(value)
  ? value.map(ordered)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, ordered(value[key])]))
    : value
const stable = value => JSON.stringify(ordered(value))
const inputs = read(inputsPath)
const priorReview = read(inputs.previousReview.path)
const previous = read(inputs.previousCandidate.path)
const current = read(inputs.currentCandidate.path)
const repair = read(inputs.repair.path)
const oldOutput = path.dirname(inputs.previousReview.path)
const inheritedRefs = [
  priorReview.sourceFIRST,
  priorReview.optionFIRST,
  artifact(path.join(oldOutput, 'engine-probes.json')),
  artifact(path.join(oldOutput, 'parameter-domain-probes.json')),
  artifact(path.join(oldOutput, 'report.json')),
  artifact(path.join(oldOutput, 'output-index.json'))
]
const declaredRefs = [inputs.currentCandidate, inputs.previousCandidate, inputs.previousReview, inputs.passingChoiceReview, inputs.repair, ...inheritedRefs]
const paths = [...new Set([inputsPath, ...declaredRefs.map(ref => ref.path)])]
const before = new Map(paths.map(file => [file, hash(fs.readFileSync(file))]))
const differences = []
function diff(left, right, location = '') {
  if (stable(left) === stable(right)) return
  if (left && right && typeof left === 'object' && typeof right === 'object' && !Array.isArray(left) && !Array.isArray(right)) {
    for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) diff(left[key], right[key], location ? `${location}.${key}` : key)
  } else if (Array.isArray(left) && Array.isArray(right) && left.length === right.length) {
    left.forEach((item, index) => diff(item, right[index], `${location}[${index}]`))
  } else {
    differences.push({ path: location, before: left, after: right })
  }
}
diff(previous, current)
const allowedChanges = ['answers[0].grading', 'answers[0].parts', 'answers[0].notes']
const oldAnswer = previous.answers[0]
const answer = current.answers[0]
const withoutRepairFields = value => {
  const copy = structuredClone(value)
  for (const key of ['grading', 'parts', 'notes']) delete copy.answers[0][key]
  return copy
}
const oldMetadata = stable(withoutRepairFields(previous))
const currentMetadata = stable(withoutRepairFields(current))
const oldDisplay = Buffer.from(oldAnswer.displayAnswer, 'utf8')
const currentDisplay = Buffer.from(answer.displayAnswer, 'utf8')
const oldSections = oldAnswer.displayAnswer.split('\n\n')
const currentSections = answer.displayAnswer.split('\n\n')
const displayEvidence = {
  encoding: 'UTF-8 decoded JSON string value; every byte including paragraph separators is compared',
  bytesBefore: oldDisplay.length,
  bytesAfter: currentDisplay.length,
  sha256Before: hash(oldDisplay),
  sha256After: hash(currentDisplay),
  byteIdentical: oldDisplay.equals(currentDisplay),
  sectionCountBefore: oldSections.length,
  sectionCountAfter: currentSections.length,
  sections: currentSections.map((text, index) => ({
    label: `${index + 1})`,
    bytesBefore: Buffer.byteLength(oldSections[index] ?? '', 'utf8'),
    bytesAfter: Buffer.byteLength(text, 'utf8'),
    sha256Before: hash(Buffer.from(oldSections[index] ?? '', 'utf8')),
    sha256After: hash(Buffer.from(text, 'utf8')),
    byteIdentical: Buffer.from(oldSections[index] ?? '', 'utf8').equals(Buffer.from(text, 'utf8')),
    mathematicalContentResult: 'PASS inherited from previous source-FIRST review; not re-solved'
  }))
}
const disclosureChecks = {
  originalNotesPrefixRetained: answer.notes.startsWith(oldAnswer.notes),
  positiveParameterDomain: answer.notes.includes('a>0'),
  missingDomainAssumptionsAndFalseRejection: answer.notes.includes('无变量定义域假设') && answer.notes.includes('误拒') && answer.notes.includes('根式或绝对值答案'),
  cannotReliablyAutoGrade: answer.notes.includes('不能可靠自动判定'),
  exerciseLevelSchema: answer.notes.includes('只支持逐题 grading'),
  otherFiveNumericLoseAutomaticScoring: answer.notes.includes('其它五个数值小问的自动判分') && answer.notes.includes('242整题不自动判分') && answer.notes.includes('五个数值目标的自动作答能力损失'),
  allSixStillDisplayed: answer.notes.includes('六个区域、积分过程和正确体积仍原样显示')
}
const checks = [
  { id: 'EXACT-THREE-FIELD-DIFF', passed: stable(differences.map(d => d.path).sort()) === stable([...allowedChanges].sort()), evidence: differences.map(d => d.path).join(', ') },
  { id: 'CURRENT-GRADING-UNGRADED', passed: answer.grading === 'ungraded', evidence: `Current grading=${answer.grading}; previous=${oldAnswer.grading}.` },
  { id: 'CURRENT-PARTS-EMPTY', passed: Array.isArray(answer.parts) && answer.parts.length === 0, evidence: `Current parts length=${answer.parts.length}; previous=${oldAnswer.parts.length}. No numeric/expression auto targets remain active.` },
  { id: 'SIX-DISPLAYS-BYTE-IDENTICAL', passed: displayEvidence.byteIdentical && oldSections.length === 6 && currentSections.length === 6 && displayEvidence.sections.every(s => s.byteIdentical), evidence: `Full display SHA256 before/after=${displayEvidence.sha256Before}/${displayEvidence.sha256After}; all six sections identical.` },
  { id: 'OTHER-METADATA-UNCHANGED', passed: oldMetadata === currentMetadata, evidence: 'Structured comparison of the entire candidate after excluding exactly grading, parts and notes finds no other difference, including displayAnswer, schema, book, lesson, edition, status, exercise, source and historical metadata.' },
  { id: 'DOMAIN-AND-CAPACITY-LOSS-DISCLOSED', passed: Object.values(disclosureChecks).every(Boolean), evidence: answer.notes },
  { id: 'PREVIOUS-FAIL-PRESERVED', passed: priorReview.result === 'FAIL' && priorReview.semanticContentResult === 'PASS' && priorReview.findings.some(f => f.id === repair.finding && f.result === 'FAIL'), evidence: 'Previous automatic-domain finding remains FAIL in the original review; its six mathematical content results remain PASS.' },
  { id: 'INHERITED-SIX-MATHEMATICAL-PASSES', passed: priorReview.perExercise[0].exercise === '242' && priorReview.perExercise[0].parts.length === 6 && priorReview.perExercise[0].parts.every(p => p.contentResult === 'PASS'), evidence: 'All six prior per-part contentResult fields are PASS; current display bytes are identical.' }
]
for (const ref of declaredRefs) checks.push({
  id: 'DECLARED-SNAPSHOT-BINDING',
  passed: before.get(ref.path) === ref.sha256,
  evidence: `${ref.path}: declared=${ref.sha256}, observed=${before.get(ref.path)}`
})
const inputBindings = paths.map(file => ({ path: file, sha256Before: before.get(file), sha256After: hash(fs.readFileSync(file)) }))
for (const binding of inputBindings) checks.push({
  id: 'INPUT-UNCHANGED-DURING-AFFECTED-REVIEW',
  passed: binding.sha256Before === binding.sha256After,
  evidence: `${binding.path}: ${binding.sha256Before} -> ${binding.sha256After}`
})
const findings = checks.filter(check => !check.passed).map(check => ({
  id: `N66-AFFECTED-02-${check.id}`,
  result: 'FAIL',
  scope: 'Only exercise242 grading/parts/notes repair and inherited unchanged evidence',
  priority: 1,
  path: inputs.currentCandidate.path,
  location: check.id,
  evidence: check.evidence,
  recommendation: 'Do not admit the current repair snapshot. Correct only the indicated mismatch and preserve the original FAIL evidence.',
  contentFailure: false
}))
const result = findings.length ? 'FAIL' : 'PASS'
const reviewer = { kind: priorReview.reviewer.kind, identity: `${priorReview.reviewer.identity}; same reviewer resumed for affected answer repair02 only, no new independent review` }
const inheritedMathematics = priorReview.perExercise[0].parts.map(part => ({
  label: part.label,
  result,
  contentResult: 'PASS',
  evidenceOrigin: 'Inherited previous source-FIRST mathematical PASS; current display is byte-identical; not re-solved',
  closedRegion: part.closedRegion,
  lower: part.lower,
  upper: part.upper,
  radius: part.radius,
  squaredRadius: part.squaredRadius,
  antiderivative: part.antiderivative,
  endpointEvaluation: part.endpointEvaluation,
  exactVolume: part.exactVolume,
  automaticEligibility: 'NOT_CLAIMED: current exercise242 is ungraded and parts=[]',
  inheritedPreviousAutomaticQualificationResult: part.result,
  currentGrading: answer.grading,
  activeAutomaticPart: false
}))
const inheritedFailure = {
  result: 'FAIL',
  originalReview: artifact(inputs.previousReview.path),
  originalCandidate: artifact(inputs.previousCandidate.path),
  findings: priorReview.findings,
  engineRepairNotClaimed: true,
  remedy: 'Unsafe automatic judging is disabled for the whole exercise; the engine-domain defect is not fixed, cleared or re-probed.',
  engineCounterexamples: artifact(path.join(oldOutput, 'parameter-domain-probes.json'))
}
const scope = 'N66 exercise242 affected repair02 only, current candidate f4a23561bcd449ce43d2d8007b1064cb5e151650017d8eaf2567bec03066154d: grading=ungraded, parts=[], and notes disclosure. PASS applies only to this repaired snapshot; six mathematical content PASS and 12 choice-option PASS are inherited, not re-reviewed. No current automatic qualification is claimed.'
write('snapshot-diff.json', {
  schema: 'stemrobin188-n66-answer242-affected-diff@1',
  result,
  previousCandidate: artifact(inputs.previousCandidate.path),
  currentCandidate: artifact(inputs.currentCandidate.path),
  allowedChanges,
  actualChanges: differences,
  metadataExcludingThreeFields: { sha256Before: hash(Buffer.from(oldMetadata)), sha256After: hash(Buffer.from(currentMetadata)), unchanged: oldMetadata === currentMetadata },
  displayEvidence,
  disclosureChecks,
  checks
})
write('answer-review.json', {
  schema: 'stemrobin188-n66-answer-review@1',
  reviewer,
  result,
  scope,
  semanticContentResult: 'PASS',
  semanticContentOrigin: 'Inherited from original source-FIRST; six display values byte-identical, not re-solved',
  findings,
  perExercise: [{ exercise: '242', result, contentResult: 'PASS', contentEvidence: 'Inherited six mathematical PASS; no re-solution', grading: answer.grading, currentParts: answer.parts, automaticEligibility: 'NOT_CLAIMED_CURRENT_UNGRADED', parts: inheritedMathematics }],
  perExerciseEvidence: [{
    exercise: '242',
    result,
    contentResult: 'PASS',
    evidence: 'Only grading, parts and notes changed. All six display paragraphs and every other metadata field are unchanged.',
    gradingReview: 'Current ungraded with empty parts removes all automatic judging. This resolves the unsafe auto claim without claiming the engine defect has been fixed. Exercise-level schema also disables the five formerly passing numeric parts.',
    displayAnswerCoverage: 'Inherited original six mathematical/display PASS, supported by whole-display and six-section byte equality and SHA256.',
    expectedReview: 'Current parts=[]; no expected values or judge modes are active. Old expected values and engine counterexamples remain immutable evidence, not current automatic targets.',
    parts: inheritedMathematics
  }],
  inputBindings,
  currentCandidate: artifact(inputs.currentCandidate.path),
  sourceFIRST: priorReview.sourceFIRST,
  optionFIRST: priorReview.optionFIRST,
  inheritedFailure,
  passingChoiceReview: { ...artifact(inputs.passingChoiceReview.path), result: 'PASS inherited unchanged; all12 options remain PASS; no choice validation repeated' },
  limitations: [{
    result,
    scope: 'Exercise-level automatic-scoring capacity loss',
    evidence: 'The notes explicitly disclose a>0-domain false rejection and the schema limitation that prevents disabling only part4. All six are now display-only; five numeric parts lose automatic scoring too.'
  }],
  counts: {
    originalExercises: 1,
    originalSubparts: 6,
    inheritedMathematicalContentPass: 6,
    answerContentPass: 1,
    answerGatePass: result === 'PASS' ? 1 : 0,
    answerGateHold: 0,
    answerGateFail: result === 'FAIL' ? 1 : 0,
    auto: 0,
    ungraded: 1,
    currentActiveAutomaticParts: 0,
    currentAutomaticQualificationClaims: 0,
    inheritedChoiceOptionTruthPass: 12,
    newlyReviewedChoiceOptions: 0,
    mathematicalReSolutions: 0,
    engineProbeRuns: 0,
    choiceValidatorRuns: 0,
    producerRuns: 0,
    imagesOpened: 0,
    parentActualImages: 0,
    parentImageLimit: 0
  },
  original242ClosedRegionResults: priorReview.original242ClosedRegionResults,
  constructionAndProofOriginals: {},
  wholeLessonApproved: false,
  productApproved: false,
  published: false
})
write('report.json', {
  schema: 'stemrobin188-n66-answer242-affected-review-report@1',
  status: result,
  result,
  scope,
  reviewer,
  currentCandidate: artifact(inputs.currentCandidate.path),
  previousCandidate: artifact(inputs.previousCandidate.path),
  repair: artifact(inputs.repair.path),
  actualDiff: differences,
  gradingCheck: { result: checks[1].passed ? 'PASS' : 'FAIL', before: oldAnswer.grading, after: answer.grading, automaticQualificationClaimed: false },
  partsCheck: { result: checks[2].passed ? 'PASS' : 'FAIL', beforeCount: oldAnswer.parts.length, afterCount: answer.parts.length, after: answer.parts },
  notesCheck: { result: checks[5].passed ? 'PASS' : 'FAIL', currentNotes: answer.notes, disclosureChecks, interpretation: 'The notes disclose the missing positive-domain assumptions, false rejection of root/absolute-value answers, whole-exercise grading schema, inability to retain five numeric auto scores, and retention of all six displayed solutions.' },
  displayEvidence,
  otherMetadataUnchanged: oldMetadata === currentMetadata,
  inheritedMathematics,
  inheritedFailure,
  inheritedChoice: { ...artifact(inputs.passingChoiceReview.path), result: 'PASS', optionTruthPass: 12, hashUnchanged: before.get(inputs.passingChoiceReview.path) === inputs.passingChoiceReview.sha256, reviewRepeated: false, validationRepeated: false },
  currentAutomaticEligibility: 'NOT_CLAIMED: ungraded, empty parts; PASS is the corrected non-automatic answer snapshot only',
  currentRepairChecksPassed: checks.every(check => check.passed),
  checks,
  findings,
  inputBindings,
  images: { loaded: 0, allowed: 0, reopened: 0 },
  actionsNotRun: ['Source solving', 'Choice review or validation', 'Producer/finalizer/publisher', 'Engine probes', 'App startup or edits', 'Skill/data edits', 'Database or .env access', 'Git/Plane', 'Network/paid calls/install', 'Image opening', 'Other chat operations or new independent review'],
  onlyWriteRoot: out,
  originalFailPreserved: true,
  oldReportsEdited: false,
  wholeLessonApproved: false,
  productApproved: false,
  published: false
})
const outputs = fs.readdirSync(out).filter(name => name !== 'output-index.json').sort().map(name => artifact(path.join(out, name)))
write('output-index.json', { schema: 'stemrobin188-n66-answer242-affected-output-index@1', status: result, outputRoot: out, outputs, selfListed: false })
console.log(JSON.stringify({ status: result, report: artifact(path.join(out, 'report.json')), index: artifact(path.join(out, 'output-index.json')), changedFields: differences.map(d => d.path), findings }, null, 2))
