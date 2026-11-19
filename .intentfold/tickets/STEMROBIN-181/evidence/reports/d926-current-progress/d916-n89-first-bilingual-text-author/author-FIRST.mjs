import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
assert.equal(out, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d916-n89-first-bilingual-text-author'))
const card = 'phy10-c2-s3-n89'
const previous = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d915-n89-first-source-preparation')
const book = path.join(previous, 'root/10p')
const templates = path.join(previous, 'work/adapt/10p/modern-us-neutral/lessons', card)
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const owned = file => assert.ok(file.startsWith(out + path.sep), 'Write outside authorization: ' + file)
const save = (file, value) => {
  owned(file)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o644 })
  return bind(file)
}
const copyWritable = (from, to) => {
  owned(to)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(to, 0o644)
}

assert.ok(!fs.existsSync(path.join(out, 'started.json')), 'FIRST author is not replayable')
const reportPath = path.join(previous, 'report.json')
assert.equal(sha(reportPath), '1c341070afb553da15610f9c0c59a6dfebde455c3aad2d92f5af95f0aab475bb')
const previousReport = read(reportPath)
assert.equal(previousReport.root, path.join(previous, 'root'))
assert.equal(previousReport.work, path.join(previous, 'work'))
const requirementsPath = path.join(previous, 'source-requirements.json')
assert.equal(sha(requirementsPath), previousReport.requirements.sha256)
const requirements = read(requirementsPath)
assert.deepEqual(requirements.boundary, { first: 'p0236#7', last: 'p0238#6', nextHeading: 'p0239#1' })
assert.equal(requirements.sourceQuestions, 0)
assert.deepEqual(requirements.sourceFigureIds, ['fig-206', 'fig-207'])
const inputLesson = path.join(templates, 'lesson.template.json')
const inputExercises = path.join(templates, 'exercises.template.json')
const inputFigures = path.join(templates, 'figures.template.json')
const base = read(inputLesson)
const exercises = read(inputExercises)
const authoredPath = path.join(out, 'authored-text.json')
const authored = read(authoredPath)
assert.equal(base.id, card)
assert.equal(base.exercise_count, 0)
assert.deepEqual(base.errata, [])
assert.equal(exercises.count, 0)
assert.deepEqual(exercises.exercises, [])
assert.equal(sha(path.join(book, base.source.path)), base.source.sha256)
assert.equal(sha(path.join(book, exercises.source.path)), exercises.source.sha256)
assert.equal(sha(path.join(book, base.source.path)), previousReport.rawLesson.sha256)
assert.equal(sha(path.join(book, exercises.source.path)), previousReport.rawExercises.sha256)
const sourceCitation = base.prose.find(block => block.source_refs.includes('p0238#4')).source_text
assert.ok(sourceCitation.includes('(彩图 IV2,3)'))
const inputFiles = [
  reportPath, requirementsPath, inputLesson, inputExercises, inputFigures,
  path.join(book, base.source.path), path.join(book, exercises.source.path),
  ...requirements.sourceFigureIds.map(id => path.join(book, 'figures', id + '.png')),
  path.join(tools, 'edition.py'), path.join(tools, 'prose_flow.mjs'), path.join(tools, 'htmlfrag.js'),
  path.join(tools, 'mathcheck.py'), path.join(tools, 'katex_check.js'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/SKILL.md'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'),
  path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md'),
]
const inputBindings = inputFiles.map(bind)
save(path.join(out, 'started.json'), {
  ticket: 'STEMROBIN-181', successor: 'successor181-3', stage: 'd916-n89-FIRST-bilingual-text-author',
  card, cwd: repo, onlyWriteRoot: out, offlineOnly: true, firstCandidateOnly: true,
  sourceReviews: 'Independent source-page PASS consumed as explicitly supplied by the human; no full-source replay.',
  sourceBoundary: requirements.boundary, independentApproval: false, completeCard: false,
})
save(path.join(out, 'input-bindings.json'), {
  inputs: inputBindings, authorInput: bind(authoredPath), authorProgram: bind(fileURLToPath(import.meta.url)),
  sourcePreparationReportSha256Verified: true,
})
fs.mkdirSync(path.join(out, 'runtime-tmp'), { recursive: true })
const env = { ...process.env, TMPDIR: path.join(out, 'runtime-tmp'), PYTHONDONTWRITEBYTECODE: '1' }
const native = (name, executable, args, input) => {
  const result = spawnSync(executable, args, {
    cwd: repo, env, input, encoding: 'utf8', timeout: 60000, maxBuffer: 8 * 1024 * 1024,
  })
  const receipt = save(path.join(out, 'native', name + '.receipt.json'), {
    command: [executable, ...args], cwd: repo, TMPDIR: env.TMPDIR,
    exit: result.status, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null, textOnly: true, producerOrWholeCardCall: false,
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return { stdout: result.stdout, receipt }
}

const diagramUsage = save(path.join(out, 'source-diagram-usage.json'), {
  schema: 'STEMROBIN-181/d916-source-diagram-usage@1', authorObservationOnly: true,
  imageBatches: [{ batch: 1, images: 2, perBatchLimit: 8, defaultBatchSize: 2 }],
  imagesLoadedInThisContext: 2, contextImageLimit: 24, reopens: 0, crops: 0, fullSourcePagesLoaded: 0,
  noIndependentSourceReviewReplay: true,
  figures: authored.sourceDiagramObservations.map(item => ({
    ...item, source: bind(path.join(book, 'figures', item.id + '.png')),
    modernFigureApproval: false,
  })),
})
const normalizeCode = `
import json, sys
sys.path.insert(0, sys.argv[1])
import edition
document = json.load(sys.stdin)
edition.normalize_lesson_layout(document)
print(json.dumps(document, ensure_ascii=False))
`
const candidates = {}
const candidateBindings = {}
const flowEvidence = {}
for (const locale of ['zh', 'en']) {
  const lessonFile = path.join(out, locale, 'lesson.template.json')
  const exerciseFile = path.join(out, locale, 'exercises.template.json')
  copyWritable(inputLesson, lessonFile)
  copyWritable(inputExercises, exerciseFile)
  const lesson = read(lessonFile)
  lesson.locale = locale
  lesson.status = 'draft'
  if (locale === 'en') lesson.title = 'Diffraction Gratings'
  lesson.section_breaks = []
  const authoredRefs = []
  for (const block of lesson.prose) {
    const ref = block.source_refs[0]
    if (block.kind === 'p') {
      assert.ok(authored.texts[ref], 'Missing prose: ' + ref)
      block.text = authored.texts[ref][locale].join('\n')
      block.changes = locale === 'en' ? ['translation', 'explanation', 'layout'] : ['explanation', 'layout']
      block.numeric_changes = []
      block.historical_entities = []
      authoredRefs.push(ref)
    } else if (block.kind === 'cap') {
      block.text = 'Figure ' + block.source_text.match(/\d+/)[0]
      block.changes = ['translation', 'layout']
    }
    if (locale === 'en' && ['fig', 'cap'].includes(block.kind) && block.label)
      block.label = 'Figure ' + block.label.match(/\d+/)[0]
  }
  assert.deepEqual(authoredRefs.sort(), Object.keys(authored.texts).sort())
  if (locale === 'en')
    for (const figure of lesson.figures)
      if (figure.label) figure.label = 'Figure ' + figure.label.match(/\d+/)[0]
  const normalized = native('normalize-' + locale + '-FIRST', python,
    ['-B', '-c', normalizeCode, tools], JSON.stringify(lesson))
  const document = JSON.parse(normalized.stdout)
  fs.writeFileSync(lessonFile, JSON.stringify(document, null, 2) + '\n')
  // Derive adjacent final-paragraph anchors from the current native prose flow.
  const outline = native('outline-' + locale + '-FIRST', process.execPath,
    [path.join(tools, 'prose_flow.mjs'), lessonFile])
  const boundaries = outline.stdout.split('\n')
    .filter(line => line.startsWith('    break: '))
    .map(line => JSON.parse(line.slice('    break: '.length)))
  document.section_breaks = authored.conceptStarts[locale].map(start => {
    const matches = boundaries.filter(boundary => boundary.after.startsWith(start))
    assert.equal(matches.length, 1, 'Concept requires one native boundary: ' + start)
    return structuredClone(matches[0])
  })
  fs.writeFileSync(lessonFile, JSON.stringify(document, null, 2) + '\n')
  candidates[locale] = document
  candidateBindings[locale] = {
    lesson: bind(lessonFile), exercises: bind(exerciseFile),
    copiedFromReadOnlyPreparation: true, writableModeAtAuthoring: '0644',
  }
  flowEvidence[locale] = {
    boundaryDerivation: outline.receipt,
    selectedAnchors: document.section_breaks,
    selection: 'Copy literal native before/after objects by named conceptual starts. No hand-counted anchors.',
  }
}

const checkCode = `
import copy, json, re, sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
import edition as e
import mathcheck
payload = json.load(sys.stdin)
book = Path(payload["book"])
profile = payload["profile"]
forbidden = profile.get("forbidden_terms", []) + profile.get("forbidden_person_names", [])
raw = e.load(book / payload["rawLesson"])
raw_exercises = e.load(book / payload["rawExercises"])
requirements = payload["requirements"]
expected_refs = [b["ref"] for b in requirements["blocks"] if b["kind"] != "h3"]
results = {}
katex_items = []
def fail(errors, condition, message):
    if not condition:
        errors.append(message)
for locale, document in payload["candidates"].items():
    errors = []
    fail(errors, document["schema"] == e.LESSON_SCHEMA, "Wrong lesson schema")
    fail(errors, document["edition"] == "modern-us-neutral", "Wrong edition")
    fail(errors, document["status"] == "draft", "Author must not claim approval")
    errors += e.validate_source(book, document.get("source"), book / payload["rawLesson"], "lesson")
    errors += e.validate_lesson_identity(raw, document)
    fail(errors, document.get("errata") == [], "Unbound errata not authorized")
    fail(errors, document.get("exercise_count") == 0, "No original tasks")
    fail(errors, len(document["prose"]) == len(raw["prose"]), "Prose count changed")
    normalized = copy.deepcopy(document)
    e.normalize_lesson_layout(normalized)
    fail(errors, normalized == document, "Candidate not already native-normalized")
    block_results = []
    actual_refs = []
    for index, (source, modern) in enumerate(zip(raw["prose"], document["prose"])):
        label = f"{locale}.prose[{index}]"
        block_errors = []
        for field in ("kind", "id", "label", "printed_page", "source_refs"):
            if field == "label" and source["kind"] in ("fig", "cap"):
                fail(block_errors, e.same_figure_label(source.get(field), modern.get(field), locale), label + ".label changed")
            else:
                fail(block_errors, source.get(field) == modern.get(field), label + "." + field + " changed")
        fail(block_errors, modern["source_text"] == source.get("text", ""), label + ".source_text changed")
        block_errors += e.validate_text(source.get("text", ""), modern.get("text"),
            modern.get("changes"), modern.get("numeric_changes"), label, forbidden,
            modern.get("historical_entities"), None, modern.get("notation_changes"))
        source_math = [m.group(0) for m in e.MATH.finditer(source.get("text", ""))]
        modern_math = [m.group(0) for m in e.MATH.finditer(modern["text"])]
        fail(block_errors, source_math == modern_math, label + " ordered literal math tokens changed")
        source_numbers = re.findall(r"\\d+(?:\\.\\d+)?", e.MATH.sub("", source.get("text", "")))
        modern_numbers = re.findall(r"\\d+(?:\\.\\d+)?", e.MATH.sub("", modern["text"]))
        fail(block_errors, source_numbers == modern_numbers, label + " ordered literal numeric tokens changed")
        fail(block_errors, modern.get("numeric_changes") == [], label + " numeric changes not authorized")
        block_errors += mathcheck.check_delimiters(modern["text"])
        fail(block_errors, not re.search(r"<\\/?(?:span|div|p|br)\\b", modern["text"], re.I), label + " handwritten markup")
        if locale == "en":
            fail(block_errors, not e.NON_ENGLISH_FIGURE_SCRIPT.search(modern["text"]), label + " non-English visible text")
        if modern["kind"] == "cap":
            fail(block_errors, bool(re.fullmatch(r"Figure \\d+", modern["text"])), label + " non-English caption")
        if modern["kind"] == "fig":
            fail(block_errors, modern["text"] == "", label + " invented figure content")
        for tex, display in mathcheck.find_math_spans(modern["text"]):
            katex_items.append({"id": label, "field": "text", "tex": tex, "display": display})
        actual_refs.extend(modern["source_refs"])
        block_results.append({
            "index": index, "sourceRefs": modern["source_refs"], "kind": modern["kind"],
            "sourceMathTokens": source_math, "candidateMathTokens": modern_math,
            "sourceNumericTokens": source_numbers, "candidateNumericTokens": modern_numbers,
            "nativeTextErrors": block_errors,
        })
        errors += block_errors
    fail(errors, len(actual_refs) == len(set(actual_refs)), "Duplicate source reference")
    fail(errors, set(actual_refs) == set(expected_refs), "Missing or outside n89 reference")
    fail(errors, document["prose"][-1]["source_refs"][-1] == "p0238#6", "Wrong source right boundary")
    fail(errors, all("p0239#1" not in b["source_refs"] for b in document["prose"]), "n90 included")
    fail(errors, [b["id"] for b in document["prose"] if b["kind"] == "fig"] == requirements["sourceFigureIds"], "Figure order changed")
    fail(errors, [b["id"] for b in document["figures"]] == requirements["sourceFigureIds"], "Figure registry changed")
    plate = next(b for b in document["prose"] if "p0238#4" in b["source_refs"])
    fail(errors, "IV,1" in plate["text"] and "IV2,3" in plate["text"], "Literal plate citation changed")
    fail(errors, "IV2,3" in plate["source_text"], "Original irregular citation changed")
    flow, flow_errors = e.prose_flow_contract(document["prose"], document["section_breaks"])
    errors += flow_errors
    fail(errors, len(flow.get("boundaries", [])) == 7, "Concept boundaries did not resolve")
    results[locale] = {
        "status": "pass" if not errors else "fail", "errors": errors, "blocks": block_results,
        "flow": flow, "exerciseCount": 0,
        "sourceReferenceSetExactlyCoveredOnce": set(actual_refs) == set(expected_refs) and len(actual_refs) == len(set(actual_refs)),
        "literalIrregularPlateCitationPreserved": "IV2,3" in plate["text"] and "IV2,3" in plate["source_text"],
    }
exercise_results = {}
for locale, exercise in payload["exercises"].items():
    errors = e.validate_source(book, exercise.get("source"), book / payload["rawExercises"], "exercises")
    fail(errors, exercise["schema"] == e.EXERCISES_SCHEMA, "Wrong exercise schema")
    fail(errors, exercise["count"] == raw_exercises["count"] == 0, "Invented task count")
    fail(errors, exercise["exercises"] == raw_exercises["exercises"] == [], "Invented task")
    exercise_results[locale] = {"status": "pass" if not errors else "fail", "errors": errors, "count": 0}
print(json.dumps({
    "scope": "Native text/source/identity/math/number/final prose-flow contracts once only; no full validate_lesson, errata reassembly, plate or figure gate",
    "independentApproval": False, "lessons": results, "exercises": exercise_results, "katexInput": katex_items,
}, ensure_ascii=False))
`
const checked = native('text-and-flow-contract-FIRST', python, ['-B', '-c', checkCode, tools], JSON.stringify({
  book, profile: read(path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')),
  rawLesson: base.source.path, rawExercises: exercises.source.path, requirements, candidates,
  exercises: { zh: read(candidateBindings.zh.exercises.path), en: read(candidateBindings.en.exercises.path) },
}))
const textEvidence = JSON.parse(checked.stdout)
const katex = native('katex-text-only-FIRST', process.execPath,
  [path.join(tools, 'katex_check.js')], JSON.stringify(textEvidence.katexInput))
const katexResults = JSON.parse(katex.stdout)
const errors = [
  ...Object.values(textEvidence.lessons).flatMap(item => item.errors),
  ...Object.values(textEvidence.exercises).flatMap(item => item.errors),
  ...katexResults.filter(item => item.fatal || !item.ok)
    .map(item => item.fatal ?? `${item.id}: ${item.error}`),
]
delete textEvidence.katexInput
const evidence = save(path.join(out, 'native-text-only-evidence.json'), {
  ...textEvidence, status: errors.length ? 'fail' : 'pass', errors,
  contractReceipt: checked.receipt, katexReceipt: katex.receipt, katexResults,
  boundaryDerivation: flowEvidence, independentApproval: false,
})
const mapping = save(path.join(out, 'source-mapping.json'), {
  schema: 'STEMROBIN-181/d916-source-mapping@1', ticket: 'STEMROBIN-181', card,
  sourceBoundary: requirements.boundary, sourceRequirements: bind(requirementsPath),
  sourcePreparation: bind(reportPath), heading: requirements.blocks.find(block => block.kind === 'h3'),
  headingMapping: 'Original heading bound by unchanged printed_title, number and start-page identity; English modern title localized under native locale=en identity contract.',
  perObjectPhysicalReferenceOrderPreserved: true,
  transparentFigureContinuationPreserved: true,
  globalProseOrder: 'Retain the d915 assembled object order; do not reorder merged continuation text around figures.',
  noErrata: true, noOriginalTasks: true,
  mappings: base.prose.map((block, index) => ({
    index, kind: block.kind, id: block.id, sourceRefs: block.source_refs,
    sourceTextSha256: crypto.createHash('sha256').update(block.source_text).digest('hex'),
    basis: authored.texts[block.source_refs[0]]?.basis ?? 'Retain original figure object and source identity; English visible caption is localized without number change.',
    candidates: ['zh', 'en'].map(locale => ({
      locale, path: candidateBindings[locale].lesson.path, proseIndex: index,
      textSha256: crypto.createHash('sha256').update(candidates[locale].prose[index].text).digest('hex'),
      tokens: textEvidence.lessons[locale].blocks[index],
    })),
  })),
  authoredModelQualificationsAreNotErrata: true, holds: authored.holds,
})
for (const item of inputBindings)
  assert.equal(sha(item.path), item.sha256, 'Input changed during authoring: ' + item.path)
for (const locale of ['zh', 'en'])
  assert.equal(sha(candidateBindings[locale].exercises.path), sha(inputExercises), 'Exercise template changed')

const usage = save(path.join(out, 'usage.json'), {
  ticket: 'STEMROBIN-181', successor: 'successor181-3', stage: 'd916-n89-FIRST-bilingual-text-author',
  firstAuthorCandidates: 1, bilingualLocales: 2, substantiveContentRevisionCycles: 0,
  nativeTextContractPassesRun: 1, nativeFinalFlowChecksPerLocale: 1,
  nativeOutlineAuthoringCallsPerLocale: 1, nativeLayoutNormalizationCallsPerLocale: 1,
  katexTextOnlyBatches: 1,
  sourceQuestions: 0, authoredChoices: 0, authoredAnswers: 0, authoredPractice: 0,
  sourcePngImagesRead: 2, sourceFullPagesRead: 0, reopens: 0, crops: 0,
  sourceIndependentPassesConsumed: 'Human-supplied prior PASS; no self-independent review.',
  sourceReviewReplays: 0, assembleCalls: 0, adaptPrepareCalls: 0, adaptFinalizeCalls: 0,
  vectorizeCalls: 0, wholeCardRenders: 0, wholeProjectTests: 0,
  modernFigureCreations: 0, paidCalls: 0, canonicalWrites: 0, indexWrites: 0,
  meterWrites: 0, gitCommands: 0, databaseCalls: 0, publisherCalls: 0,
  deployments: 0, backendCalls: 0, otherChatActions: 0, externalNetworkCalls: 0,
  completeCardsAdded: 0, independentApprovals: 0,
})

// Keep writable templates for a later authorized stage, separate from immutable FIRST bytes.
const frozen = {}
for (const locale of ['zh', 'en']) {
  frozen[locale] = {}
  for (const [name, candidate] of Object.entries(candidateBindings[locale])) {
    if (!['lesson', 'exercises'].includes(name)) continue
    const frozenFile = path.join(out, 'frozen-FIRST', locale, path.basename(candidate.path))
    copyWritable(candidate.path, frozenFile)
    fs.chmodSync(frozenFile, 0o444)
    assert.equal(sha(frozenFile), candidate.sha256)
    frozen[locale][name] = bind(frozenFile)
  }
}
const report = save(path.join(out, 'report.json'), {
  schema: 'STEMROBIN-181/d916-FIRST-bilingual-text-author@1',
  ticket: 'STEMROBIN-181', successor: 'successor181-3', card,
  status: errors.length ? 'FIRST-CANDIDATE-FROZEN-TEXT-ONLY-FAIL-OVERALL-HOLD'
    : 'FIRST-CANDIDATE-FROZEN-TEXT-CONTRACT-PASS-OVERALL-HOLD',
  authorOnly: true, cwd: repo, onlyWriteRoot: out, offlineOnly: true,
  candidate: candidateBindings, frozenFirstCandidates: frozen,
  sourceBoundary: requirements.boundary, originalQuestions: 0,
  sourceMapping: mapping, sourceDiagramUsage: diagramUsage, nativeTextEvidence: evidence, usage,
  nativeTextOnlyStatus: errors.length ? 'fail' : 'pass', nativeTextErrors: errors,
  allWatchedInputsUnchanged: true, exerciseTemplatesByteIdenticalToPreparation: true,
  holds: authored.holds, uncertainties: authored.uncertainties,
  independentApproval: false, completeCard: false,
  candidateFreeze: 'FIRST final bytes retained as separate 0444 snapshots; candidate templates remain 0644 for an explicitly authorized later stage. No further author changes in this run.',
  stop: 'Stop after FIRST text-only freeze. No modern plate/figure work or approval, finalize, assemble, vectorize, whole-card render, whole-project tests, canonical/index/meter/Git/DB/publisher/deploy/backend/other-chat/paid calls.',
})
const freezeFiles = [
  authoredPath, fileURLToPath(import.meta.url),
  path.join(out, 'started.json'), path.join(out, 'input-bindings.json'),
  mapping.path, diagramUsage.path, evidence.path, usage.path, report.path,
  ...fs.readdirSync(path.join(out, 'native')).map(name => path.join(out, 'native', name)),
]
for (const file of freezeFiles) {
  owned(file)
  fs.chmodSync(file, 0o444)
}
const freeze = save(path.join(out, 'author-freeze.json'), {
  schema: 'STEMROBIN-181/d916-author-freeze@1',
  ticket: 'STEMROBIN-181', successor: 'successor181-3', card,
  report, candidates: candidateBindings, frozenFirstCandidates: frozen,
  evidenceFiles: freezeFiles.map(bind),
  candidatePermissions: '0644', immutableEvidencePermissions: '0444',
  independentApproval: false, completeCard: false,
})
fs.chmodSync(freeze.path, 0o444)
process.stdout.write(JSON.stringify({ report, freeze, candidates: candidateBindings, frozenFirstCandidates: frozen }, null, 2) + '\n')
