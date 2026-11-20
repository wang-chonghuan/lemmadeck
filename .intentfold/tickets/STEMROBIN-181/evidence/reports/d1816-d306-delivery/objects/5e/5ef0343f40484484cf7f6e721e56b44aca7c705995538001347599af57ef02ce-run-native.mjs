import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d287-n19-text-recovery')
const scratch = path.join(repo, '.tmp/STEMROBIN-181/d1816-d287')
const root = path.join(scratch, 'source-root')
const work = path.join(scratch, 'work')
const book = path.join(root, '10p')
const sourceBook = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const lessonId = 'phy10-c1-s3-n19'
const expectedSourceHash = '667273c43c28058fefef9d1d1ac4c7eb962ea4da2ee3aaee468eb23ca805df88'
const retainedFreeze = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/reports/10p-n19-prose-freeze.json')
const retainedSci = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/reports/10p-n19-science-review.json')
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const ranges = [[0, 4], [4, 6], [6, 8], [8, 9], [9, 10]]
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'))
const hash = filename => createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
const textHash = text => createHash('sha256').update(text, 'utf8').digest('hex')
const target = edition => path.join(work, 'adapt/10p', edition, 'lessons', lessonId)
const receiptPath = name => path.join(own, 'receipts', `${name}.json`)
const binding = filename => ({ path: filename, sha256: hash(filename), bytes: fs.statSync(filename).size })

function write(filename, value, raw = false) {
  assert([own, scratch].some(base => filename.startsWith(`${base}/`)), `outside owned roots: ${filename}`)
  assert(!fs.existsSync(filename), `refusing to overwrite: ${filename}`)
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, raw ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}

function replacePrepared(filename, value) {
  assert(filename.startsWith(`${work}/`))
  assert(fs.existsSync(filename))
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`)
}

function run(name, executable, args, parse = false) {
  assert(!fs.existsSync(receiptPath(name)))
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const receipt = {
    name, startedAt, finishedAt: new Date().toISOString(), cwd: repo,
    executable, args, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  }
  if (parse && result.status === 0) receipt.result = JSON.parse(result.stdout)
  write(receiptPath(name), receipt)
  assert.equal(result.status, 0, `${name} failed; retained ${receiptPath(name)}`)
  return receipt.result
}

function bootstrap() {
  assert.equal(process.cwd(), repo)
  assert(!fs.existsSync(scratch), 'scratch root must be new')
  assert.equal(hash(path.join(sourceBook, 'lessons', lessonId, 'lesson.json')), expectedSourceHash)
  const sci = read(retainedSci)
  const freeze = read(retainedFreeze)
  assert.equal(sci.status, 'pass')
  assert.equal(sci.bindings.source.sha256, expectedSourceHash)
  assert.equal(sci.bindings.lessonTemplate.sha256, freeze.bindings.lessonTemplate.sha256)
  assert.equal(freeze.proseFlow.paragraphs.length, 10)
  const inputs = []
  const relativeFiles = [
    'book.json',
    ...['lesson.json', 'lesson.md', 'exercises.json'].map(name => `lessons/${lessonId}/${name}`),
    ...['0052', '0053'].flatMap(page => ['page.json', 'page.md', 'audit.json'].map(name => `pages/${page}/${name}`)),
  ]
  for (const relative of relativeFiles) {
    const from = path.join(sourceBook, relative)
    const to = path.join(book, relative)
    write(to, fs.readFileSync(from), true)
    assert.equal(hash(from), hash(to))
    inputs.push({ canonical: binding(from), isolated: binding(to) })
  }
  write(path.join(own, 'd287-input-bindings.json'), {
    inputs, retainedFreeze: binding(retainedFreeze), retainedSci: binding(retainedSci),
    sourceImagesNotReadCopiedOrReviewed: true,
    sourceFigureAvailability: ['fig-28', 'fig-29', 'tbl-p0053-01'].map(id => ({
      id, png: path.join(sourceBook, 'figures', `${id}.png`),
      pngExists: fs.existsSync(path.join(sourceBook, 'figures', `${id}.png`)),
      svgExists: fs.existsSync(path.join(sourceBook, 'figures', `${id}.svg`)),
      approval: id === 'tbl-p0053-01' ? 'canonical retained original table; no new review' : 'D284 raw-source approval only, as directed by human',
    })),
    root, work,
    noD276AssemblyCandidateImported: true,
  })
}

function prepare(edition) {
  run(`d287-prepare-${edition.endsWith('-en') ? 'en' : 'zh'}`, python, [
    path.join(tools, 'p2c.py'), 'adapt-prepare', '--book', '10p', '--edition', edition,
    '--lesson', lessonId, '--root', root, '--work', work,
  ])
  for (const name of ['lesson', 'exercises', 'figures']) {
    const filename = path.join(target(edition), `${name}.template.json`)
    write(path.join(own, 'prepared', edition, `${name}.template.json`), fs.readFileSync(filename), true)
  }
}

function author() {
  const retained = read(retainedFreeze).proseFlow
  const english = read(path.join(own, 'english-paragraphs.json'))
  const require = createRequire(import.meta.url)
  const { proseOutline } = require(path.join(tools, 'htmlfrag.js'))
  for (const edition of editions) {
    const en = edition.endsWith('-en')
    const filename = path.join(target(edition), 'lesson.template.json')
    const lesson = read(filename)
    const paragraphs = en ? english.paragraphs : retained.paragraphs.map(item => item.text)
    assert.equal(lesson.prose.length, 6)
    assert.equal(paragraphs.length, 10)
    for (const [index, [start, end]] of ranges.entries()) {
      const block = lesson.prose[index]
      assert.equal(block.kind, 'p')
      block.text = paragraphs.slice(start, end).join('\n\n')
      block.changes = [en ? 'translation' : 'wording', 'layout', ...([2, 3].includes(index) ? ['notation'] : [])]
    }
    assert.equal(lesson.prose[5].kind, 'fig')
    assert.equal(lesson.prose[5].text, '')
    assert.equal(lesson.prose[5].label, '表')
    lesson.locale = en ? 'en' : 'zh'
    if (en) lesson.title = english.title
    lesson.section_breaks = en ? [] : structuredClone(retained.boundaries)
    replacePrepared(filename, lesson)
    const recovered = proseOutline(lesson.prose).map(item => item.text)
    assert.deepEqual(recovered, paragraphs)
  }
  write(path.join(own, 'd287-english-display-metadata.json'), {
    status: 'authored-pending-independent-text-metadata-review',
    identityFieldsInTemplatesPreserved: ['chapter', 'section', 'printed_title', 'prose[5].label'],
    metadata: english.displayMetadata,
    application: 'Sidecar authoring data only, not an implemented runtime overlay. Current native same_figure_label accepts numbered Figure aliases, not the unnumbered Table alias; canonical label is preserved.',
    missingCaptions: 'Canonical N19 has no cap blocks and no printed table caption. Only the existing label and in-prose figure references are translated.',
  })
  write(path.join(own, 'd287-notation-declarations.json'), {
    status: 'declared-pending-independent-text-metadata-review',
    unchangedSource: true,
    blocks: [
      { block: 'lesson.prose[2]', changes: ['notation'], from: '\\mathrm{м}', to: '\\mathrm{m}', meaning: 'upright descriptive maximum subscript; not a new variable' },
      { block: 'lesson.prose[2]', changes: ['notation'], from: '图 $28$б', to: '图 $28$b', english: 'Figure $28$b', meaning: 'subfigure b, same figure identity' },
      { block: 'lesson.prose[3]', changes: ['notation'], from: '图$29$б', to: '图 $29$b', english: 'Figure $29$b', meaning: 'subfigure b, same figure identity' },
    ],
    nativeContract: 'changes contains notation. notation_changes is reserved by the current validator for apparatus-label $Г$ -> $G$; unsupported declaration kinds are not inserted into that field.',
  })
}

function flow(edition) {
  return run(`d287-proseflow-${edition.endsWith('-en') ? 'en' : 'zh'}`, process.execPath, [
    path.join(tools, 'prose_flow.mjs'), '--json', path.join(target(edition), 'lesson.template.json'),
  ], true)
}

function normalize(edition) {
  const lang = edition.endsWith('-en') ? 'en' : 'zh'
  const filename = path.join(target(edition), 'lesson.template.json')
  const before = read(filename)
  const result = run(`d287-normalize-${lang}`, python, [
    '-c', String.raw`
import sys
sys.dont_write_bytecode = True
sys.path.insert(0, sys.argv[1])
import json
from pathlib import Path
import edition as E
lesson = E.load(Path(sys.argv[2]))
E.normalize_lesson_layout(lesson)
print(json.dumps(lesson, ensure_ascii=False, indent=2))
`, tools, filename,
  ], true)
  if (lang === 'zh') assert.deepEqual(result, before, 'Chinese normalization must not change retained recovery')
  else {
    write(path.join(own, 'd287-en-before-native-normalization.json'), before)
    replacePrepared(filename, result)
  }
  run(`d287-proseflow-${lang}-normalized`, process.execPath, [
    path.join(tools, 'prose_flow.mjs'), '--json', filename,
  ], true)
}

function englishAnchors() {
  const flow = read(receiptPath('d287-proseflow-en-normalized')).result
  const zhFlow = read(receiptPath('d287-proseflow-zh')).result
  const retained = read(retainedFreeze).proseFlow
  const filename = path.join(target(editions[1]), 'lesson.template.json')
  const lesson = read(filename)
  lesson.section_breaks = retained.boundaries.map(boundary => {
    const zhBefore = zhFlow.paragraphs.find(item => item.text === boundary.before)
    const zhAfter = zhFlow.paragraphs.find(item => item.text === boundary.after)
    assert(zhBefore && zhAfter)
    const before = flow.paragraphs.filter(item => item.blockIndex === zhBefore.blockIndex).at(-1)
    const after = flow.paragraphs.find(item => item.blockIndex === zhAfter.blockIndex)
    assert(before && after)
    const actualIndex = flow.paragraphs.findIndex(item => item === after)
    assert.equal(flow.paragraphs[actualIndex - 1], before)
    return {
      before: flow.paragraphs[actualIndex - 1].text,
      after: flow.paragraphs[actualIndex].text,
    }
  })
  replacePrepared(filename, lesson)
  run('d287-proseflow-en-anchored', process.execPath, [
    path.join(tools, 'prose_flow.mjs'), '--json', filename,
  ], true)
}

function retainChineseNormalizationDrift() {
  const normalizeReceipt = read(receiptPath('d287-normalize-zh'))
  const retained = read(retainedFreeze)
  const filename = path.join(target(editions[0]), 'lesson.template.json')
  const recovery = read(filename)
  const require = createRequire(import.meta.url)
  const { proseOutline } = require(path.join(tools, 'htmlfrag.js'))
  const current = proseOutline(recovery.prose).map(item => item.text)
  const proposed = proseOutline(normalizeReceipt.result.prose).map(item => item.text)
  assert.deepEqual(current, retained.proseFlow.paragraphs.map(item => item.text))
  assert.notDeepEqual(proposed, current)
  const disposition = {
    name: 'd287-normalize-zh-disposition',
    status: 'normalizer-executed-successfully-recovery-equivalence-check-failed-candidate-not-applied',
    receipt: binding(receiptPath('d287-normalize-zh')),
    wrapperExitCode: 1,
    wrapperFailure: 'Chinese normalization must not change retained recovery',
    diagnosis: 'Current native normalize_prose_layout changes blank-line locations in source prose blocks 0 and 2. Its line regrouping does not preserve all retained approved paragraph anchors.',
    changedBlocks: recovery.prose.flatMap((block, index) => block.text === normalizeReceipt.result.prose[index].text ? [] : [{
      blockIndex: index, retainedText: block.text, proposedText: normalizeReceipt.result.prose[index].text,
    }]),
    retainedParsedParagraphs: current, proposedParsedParagraphs: proposed,
    originalRecoveredTemplate: binding(filename),
    applied: false,
    scientificVerdict: 'none; technical/layout incompatibility only',
    action: 'Preserve exact approved Chinese recovery. Text-contract checks evaluate that unchanged recovery; do not report full native normalization/finalization acceptance.',
    reviewNeeded: 'Independent reconstructed text metadata/layout review; full finalization still not authorized or attempted.',
  }
  write(receiptPath('d287-normalize-zh-disposition'), disposition)
}

const textContractCode = String.raw`
import sys
sys.dont_write_bytecode = True
sys.path.insert(0, sys.argv[1])
import json
from pathlib import Path
import edition as E
book, folder, profile_path = map(Path, sys.argv[2:5])
lesson = E.load(folder / "lesson.template.json")
exercises = E.load(folder / "exercises.template.json")
raw_lesson_path = book / "lessons" / lesson["id"] / "lesson.json"
raw_exercises_path = book / "lessons" / lesson["id"] / "exercises.json"
raw_lesson = E.load(raw_lesson_path)
raw_exercises = E.load(raw_exercises_path)
profile = E.load(profile_path)
errors = []
errors += E.validate_source(book, lesson.get("source"), raw_lesson_path, "lesson")
errors += E.validate_source(book, exercises.get("source"), raw_exercises_path, "exercises")
errors += E.validate_lesson_identity(raw_lesson, lesson)
if lesson.get("schema") != E.LESSON_SCHEMA or exercises.get("schema") != E.EXERCISES_SCHEMA:
    errors.append("native template schema changed")
if lesson.get("edition") != folder.parents[1].name or exercises.get("edition") != folder.parents[1].name:
    errors.append("edition identity mismatch")
corrections, errata_errors = E.validate_errata(book, raw_lesson, raw_exercises, lesson, exercises)
errors += errata_errors
try:
    authoritative_targets = E._authoritative_source_targets(book, raw_lesson, raw_exercises)
    if E._refs_by_target(authoritative_targets) != E._refs_by_target(E._source_target_map(raw_lesson, raw_exercises)):
        errors.append("canonical source_refs differ from authoritative page binding")
except SystemExit as error:
    authoritative_targets = {}
    errors.append(str(error))
native_flow, flow_errors = E.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
errors += flow_errors
for index, (source, modern) in enumerate(zip(raw_lesson["prose"], lesson["prose"])):
    label = f"lesson.prose[{index}]"
    for field in ("kind", "id", "label", "printed_page", "source_refs"):
        if source.get(field) != modern.get(field):
            errors.append(f"{label}.{field} changed")
    if modern["source_text"] != source["text"]:
        errors.append(f"{label}.source_text changed")
    if modern.get("numeric_changes") != []:
        errors.append(f"{label} declares numeric changes")
    if "notation" not in modern["changes"] and index in (2, 3):
        errors.append(f"{label} missing notation declaration")
    if lesson.get("locale") == "en" and modern.get("kind") == "p" and E.normalize_prose_layout(modern["text"]) != modern["text"]:
        errors.append(f"{label} is not native-normalized")
    errors += E.validate_text(source["text"], modern["text"], modern["changes"],
        modern["numeric_changes"], label,
        profile.get("forbidden_terms", []) + profile.get("forbidden_person_names", []),
        modern.get("historical_entities"), corrections.get(label), modern.get("notation_changes"))
if len(raw_lesson["prose"]) != len(lesson["prose"]):
    errors.append("source prose block count changed")
if exercises["count"] != 0 or exercises["exercises"] != [] or raw_exercises["count"] != 0:
    errors.append("zero exercise count changed")
if lesson["errata"] != []:
    errors.append("unexpected errata")
print(json.dumps({
    "status": "pass" if not errors else "fail", "errors": errors,
    "scope": "Native text/source/identity/math/digits/errata/prose-flow functions only; no figure validation, finalization, scientific approval or writes.",
    "proseFlow": native_flow, "sourceProseBlocks": len(raw_lesson["prose"]),
    "authoritativeSourceTargets": authoritative_targets,
    "normalization": "English native-normalized; Chinese deliberately unchanged to preserve retained flow, known normalizer drift retained separately.",
    "mathAtoms": sum(len(E.math_signature(block["text"])) for block in lesson["prose"]),
    "sourceTasks": raw_exercises["count"], "candidateTasks": exercises["count"],
}, ensure_ascii=False, indent=2))
raise SystemExit(0 if not errors else 2)
`

function textContract(edition) {
  run(`d287-text-contract-${edition.endsWith('-en') ? 'en' : 'zh'}`, python, [
    '-c', textContractCode, tools, book, target(edition),
    path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
  ], true)
}

function freezeOutputs() {
  const retained = read(retainedFreeze)
  const zhFlow = read(receiptPath('d287-proseflow-zh')).result
  const enFlow = read(receiptPath('d287-proseflow-en-anchored')).result
  const retainedTexts = retained.proseFlow.paragraphs.map(item => item.text)
  const zhTexts = zhFlow.paragraphs.map(item => item.text)
  assert.deepEqual(zhTexts, retainedTexts)
  const retainedCombined = retainedTexts.join('\n\n')
  const recoveredCombined = zhTexts.join('\n\n')
  assert.equal(recoveredCombined, retainedCombined)
  assert.deepEqual(zhFlow.boundaries.map(({ before, after }) => ({ before, after })), retained.proseFlow.boundaries)
  const inputs = read(path.join(own, 'd287-input-bindings.json'))
  for (const input of inputs.inputs) {
    assert.equal(hash(input.canonical.path), input.canonical.sha256, `canonical input changed: ${input.canonical.path}`)
    assert.equal(hash(input.isolated.path), input.canonical.sha256)
  }
  assert.equal(hash(retainedFreeze), inputs.retainedFreeze.sha256)
  assert.equal(hash(retainedSci), inputs.retainedSci.sha256)
  const english = read(path.join(own, 'english-paragraphs.json'))
  const languages = {}
  for (const edition of editions) {
    const en = edition.endsWith('-en')
    const lang = en ? 'en' : 'zh'
    const flow = en ? enFlow : zhFlow
    const lesson = read(path.join(target(edition), 'lesson.template.json'))
    const snapshots = {}
    for (const name of ['lesson', 'exercises', 'figures']) {
      const from = path.join(target(edition), `${name}.template.json`)
      const to = path.join(own, 'frozen', edition, `${name}.template.json`)
      write(to, fs.readFileSync(from), true)
      fs.chmodSync(to, 0o444)
      snapshots[name] = { operative: binding(from), frozen: binding(to) }
    }
    const fullText = [
      `# ${en ? english.displayMetadata.printed_title.text : lesson.printed_title}`,
      '',
      `> ${en ? english.displayMetadata.chapter.text : lesson.chapter} | ${en ? english.displayMetadata.section.text : lesson.section}`,
      '',
      flow.paragraphs.map(item => item.text).join('\n\n'),
      '',
      en ? 'Table' : '表',
      '',
    ].join('\n')
    const textPath = path.join(own, 'frozen', `${lang}.text.md`)
    write(textPath, fullText, true)
    fs.chmodSync(textPath, 0o444)
    const combined = flow.paragraphs.map(item => item.text).join('\n\n')
    const combinedPath = path.join(own, 'frozen', `${lang}.paragraphs.txt`)
    write(combinedPath, combined, true)
    fs.chmodSync(combinedPath, 0o444)
    languages[lang] = {
      edition, status: en ? 'authored-independent-English-SCI-and-text-metadata-review-pending' : 'retained-approved-Chinese-prose-recovered-equivalently-no-new-SCI',
      snapshots, fullText: { ...binding(textPath), text: fullText },
      combinedParagraphText: { ...binding(combinedPath), text: combined },
      proseFlow: flow, section_breaks: lesson.section_breaks,
      textContract: binding(receiptPath(`d287-text-contract-${lang}`)),
      nativeOutcome: read(receiptPath(`d287-text-contract-${lang}`)).result,
    }
  }
  const equality = {
    method: 'Exact ordered paragraph-array and combined UTF-8 string comparison after native htmlfrag.js/prose_flow.mjs parsing; paragraphs joined with two LF characters, no terminal LF.',
    paragraphCount: 10, orderedParagraphsEqual: true, combinedTextEqual: true, boundariesEqual: true,
    retainedCombinedSha256: textHash(retainedCombined),
    recoveredCombinedSha256: textHash(recoveredCombined),
    originalTemplateSha256: retained.bindings.lessonTemplate.sha256,
    reconstructedTemplateSha256: languages.zh.snapshots.lesson.operative.sha256,
    originalTemplateByteHashMatchClaimed: false,
    missingOriginalTemplateLimitation: 'The original operative .tmp template and frozen template are unavailable in this checkout and all current worktrees, per direct human instruction; no old worker/chat or worktree search performed. Retained proseFlow contains the actual approved ten Chinese paragraphs and native before/after anchors. Only that prose equality is proven, not recovery of the lost metadata/template bytes.',
    historicalSCI: binding(retainedSci),
    historicalSCICarriedFor: 'Identical recovered Chinese paragraph text only. This is not a new science review, not an approval of reconstructed metadata, English, figures or whole course.',
  }
  const report = {
    ticket: 'STEMROBIN-181', batch: 'D287', lesson: lessonId,
    status: 'TEXT-RECOVERED-AND-EN-AUTHORED-INDEPENDENT-REVIEW-PENDING',
    ownerRoots: [own, scratch], canonicalSourceHash: expectedSourceHash,
    equality, languages, inputs: binding(path.join(own, 'd287-input-bindings.json')),
    notation: binding(path.join(own, 'd287-notation-declarations.json')),
    englishDisplayMetadata: binding(path.join(own, 'd287-english-display-metadata.json')),
    ChineseNormalizerDrift: binding(receiptPath('d287-normalize-zh-disposition')),
    nativeReceipts: fs.readdirSync(path.join(own, 'receipts')).filter(name => name.endsWith('.json')).map(name => binding(path.join(own, 'receipts', name))),
    canonicalSourceAndRetainedEvidenceUnchanged: true,
    recoveryMapping: {
      'lesson.prose[0]': 'retained paragraphs 0-3, verbatim, joined with two LF characters',
      'lesson.prose[1]': 'retained paragraphs 4-5, verbatim, joined with two LF characters',
      'lesson.prose[2]': 'retained paragraphs 6-7, verbatim, joined with two LF characters',
      'lesson.prose[3]': 'retained paragraph 8, verbatim',
      'lesson.prose[4]': 'retained paragraph 9, verbatim',
      'lesson.prose[5]': 'original fig/table block, empty text and original identity preserved',
    },
    helpers: [
      binding(path.join(own, 'run-native.mjs')),
      binding(path.join(own, 'english-paragraphs.json')),
    ],
    nativeToolBindings: [
      path.join(repo, '.claude/skills/ld-s10y-lesson/SKILL.md'),
      path.join(repo, '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'),
      path.join(repo, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
      path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
      ...['p2c.py', 'production.py', 'edition.py', 'assemble.py', 'prose_flow.mjs', 'htmlfrag.js'].map(name => path.join(tools, name)),
    ].map(binding),
    counts: { sourceProseBlocks: 6, sourceTextBlocks: 5, recoveredChineseParagraphs: 10, EnglishAuthoredSemanticParagraphs: 10, EnglishNativeParagraphs: enFlow.paragraphs.length, exercises: 0, answers: 0, newExamples: 0, newQuestions: 0 },
    signedConvention: 'Chinese paragraph 8 is unchanged. English paragraph 8 makes the retained SCI convention explicit: transferred charge is signed in the chosen positive current direction; this does not assert the same positive sign for remaining charge on a discharging plate.',
    limitations: [
      'Independent English science/translation and reconstructed text-metadata review are pending; no author self-approval.',
      'Current native Chinese normalization moved retained paragraph boundaries in prose blocks 0 and 2. Its output was not applied; the successful exact-recovery/source/text checks do not claim full normalize/finalize acceptance.',
      'The canonical chapter/section/source snapshot/bindings were retained; the D276 assembly candidate was not used.',
      'Source fig-28/fig-29 are canonical and have D284 raw approval only. No modern image approval is inferred.',
      'No images read, copied, generated, reviewed or rendered. Isolated figures template has the original table identity but empty image source metadata because no image assets were imported.',
      'Modern table tbl-p0053-01 is absent. No full-course adapt-finalize, render, publish or whole-course approval was attempted.',
      'English Table and breadcrumb/printed-title translations are authored in a sidecar/full text. Source-bound identity labels stay unchanged in the native template; the unnumbered Table display alias is not currently accepted by native same_figure_label.',
    ],
    prohibitedActionsNotPerformed: ['canonical writes', 'meter writes', 'retained evidence writes', 'DB', 'publish', 'Git mutation', 'capabilities', 'peer messages', 'paid calls', 'old workers/chats'],
    nativeReadOnlyGitNote: 'No agent-issued Git command. Existing adapt-prepare internally calls git rev-parse only to validate the exact checkout root, as required by production.validate_workspace.',
  }
  write(receiptPath('d287-recovery-equivalence'), {
    name: 'd287-recovery-equivalence',
    status: 'pass-exact-prose-recovery-only',
    equality,
    languageFiles: Object.fromEntries(Object.entries(languages).map(([lang, data]) => [lang, {
      template: data.snapshots.lesson.operative,
      fullText: binding(data.fullText.path),
      combinedParagraphText: binding(data.combinedParagraphText.path),
    }])),
    nativeInputs: [binding(receiptPath('d287-proseflow-zh')), binding(receiptPath('d287-proseflow-en-anchored'))],
  })
  report.nativeReceipts.push(binding(receiptPath('d287-recovery-equivalence')))
  write(path.join(own, 'd287-text-freeze.json'), report)
  fs.chmodSync(path.join(own, 'd287-text-freeze.json'), 0o444)
  write(path.join(own, 'd287-report.json'), {
    ...report, freeze: binding(path.join(own, 'd287-text-freeze.json')),
  })
  console.log(JSON.stringify({
    status: report.status,
    report: binding(path.join(own, 'd287-report.json')),
    freeze: binding(path.join(own, 'd287-text-freeze.json')),
    equality,
    languages: Object.fromEntries(Object.entries(languages).map(([lang, data]) => [lang, {
      template: data.snapshots.lesson.operative, fullText: binding(data.fullText.path),
      native: data.nativeOutcome.status,
    }])),
  }, null, 2))
}

const stage = process.argv[2]
if (stage === 'bootstrap') bootstrap()
else if (stage === 'prepare-zh') prepare(editions[0])
else if (stage === 'prepare-en') prepare(editions[1])
else if (stage === 'author') author()
else if (stage === 'flow-zh') flow(editions[0])
else if (stage === 'flow-en') flow(editions[1])
else if (stage === 'normalize-zh') normalize(editions[0])
else if (stage === 'normalize-en') normalize(editions[1])
else if (stage === 'retain-zh-normalization-drift') retainChineseNormalizationDrift()
else if (stage === 'english-anchors') englishAnchors()
else if (stage === 'text-contract-zh') textContract(editions[0])
else if (stage === 'text-contract-en') textContract(editions[1])
else if (stage === 'freeze') freezeOutputs()
else throw new Error('Expected a named D287 stage')
