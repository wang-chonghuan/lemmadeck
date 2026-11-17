import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const own = path.join(tmp, 'd029-n111-prose-author')
const candidate = path.join(tmp, 'd029-n111-source-candidate')
const target = path.join(own, 'work/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n111')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = (file) => ({
  path: file, sha256: hash(file), bytes: fs.statSync(file).size,
})
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const mathTokens = (text) => text.match(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g) ?? []
const templatePath = path.join(target, 'lesson.template.json')
const baselinePath = path.join(own, 'prepared-lesson.template.json')
const englishPath = path.join(own, 'lesson.en.json')
const chinese = read(templatePath)
const baseline = read(baselinePath)
const english = read(englishPath)
const command = read(path.join(own, 'adapt-prepare.command.json'))
const issues = []
for (const item of command.sourceInputs) {
  if (hash(item.path) !== item.sha256) issues.push(`Source changed: ${item.path}`)
}
if (hash(command.sourceReport.path) !== command.sourceReport.sha256) {
  issues.push('Source report changed')
}
if (!same(chinese.source, baseline.source)) issues.push('Embedded native source snapshot changed')
if (chinese.prose.length !== baseline.prose.length) issues.push('Source block count changed')
if (english.prose.length !== chinese.prose.length) issues.push('Translation is incomplete')
for (const key of Object.keys(baseline)) {
  if (!['prose', 'section_breaks'].includes(key) && !same(chinese[key], baseline[key])) {
    issues.push(`Native lesson identity/metadata changed: ${key}`)
  }
}
const textBindings = chinese.prose.map((block, index) => {
  const original = baseline.prose[index]
  const translation = english.prose[index]
  for (const key of Object.keys(original)) {
    if (!['text', 'changes'].includes(key) && !same(block[key], original[key])) {
      issues.push(`Native block ${index} snapshot/identity changed: ${key}`)
    }
  }
  if (!same(translation.source_refs, block.source_refs) || translation.kind !== block.kind) {
    issues.push(`Translation ${index} source binding changed`)
  }
  if (!same(mathTokens(original.source_text), mathTokens(block.text))) {
    issues.push(`Block ${index} source math token sequence changed`)
  }
  if (!same(mathTokens(block.text), mathTokens(translation.text))) {
    issues.push(`Translation ${index} math token sequence changed`)
  }
  if (block.kind !== 'p' && !same(block, original)) {
    issues.push(`Non-prose native block ${index} changed`)
  }
  return {
    source_refs: block.source_refs, kind: block.kind,
    source_text_sha256: crypto.createHash('sha256').update(original.source_text).digest('hex'),
    chinese_text_sha256: crypto.createHash('sha256').update(block.text).digest('hex'),
    english_text_sha256: crypto.createHash('sha256').update(translation.text).digest('hex'),
    source_math_tokens: mathTokens(original.source_text),
    chinese_math_tokens: mathTokens(block.text),
    english_math_tokens: mathTokens(translation.text),
  }
})
const exercises = read(path.join(target, 'exercises.template.json'))
if (exercises.count !== 0 || exercises.exercises.length !== 0 || english.exercise_count !== 0) {
  issues.push('Source zero-task invariant changed')
}
for (const name of ['exercises.template.json', 'figures.template.json']) {
  if (hash(path.join(target, name)) !== hash(path.join(own, `prepared-${name}`))) {
    issues.push(`Unowned native template changed: ${name}`)
  }
}
const nativeTool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const args = [nativeTool, '--json', templatePath]
const result = spawnSync(process.execPath, args, { cwd: repo, encoding: 'utf8' })
const flowOutput = path.join(own, 'prose-flow.final.json')
const flowError = path.join(own, 'prose-flow.final.stderr.txt')
const flowCommand = path.join(own, 'prose-flow.final.command.json')
fs.writeFileSync(flowOutput, result.stdout ?? '')
fs.writeFileSync(flowError, result.stderr ?? '')
fs.writeFileSync(flowCommand, JSON.stringify({
  executable: process.execPath, args, cwd: repo, exitCode: result.status,
  input: binding(templatePath), tool: binding(nativeTool),
}, null, 2) + '\n')
if (result.status !== 0) issues.push('Native prose_flow could not resolve the authored anchors')
const flow = result.status === 0 ? read(flowOutput) : null
const boundaryOutput = fs.readFileSync(path.join(own, 'prose-flow.before-anchors.stdout.txt'), 'utf8')
const nativeBoundaries = boundaryOutput.split('\n')
  .filter((line) => line.startsWith('    break: '))
  .map((line) => JSON.parse(line.slice('    break: '.length)))
for (const anchor of chinese.section_breaks) {
  if (!nativeBoundaries.some((item) => same(item, anchor))) {
    issues.push('An authored section anchor was not copied from native output')
  }
}
const profile = path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')
const figureManifest = read(path.join(target, 'figures.template.json'))
const sourceFigures = figureManifest.figures.map((figure) => ({
  id: figure.id,
  source: Object.fromEntries(Object.entries(figure.source).map(([type, source]) => {
    const file = path.join(candidate, 'artifacts/9p', source.path)
    if (hash(file) !== source.sha256) issues.push(`Bound source figure changed: ${file}`)
    return [type, { ...binding(file), viewed: false, independentCropApproval: false }]
  })),
}))
const supportingMetadata = path.join(tmp, 'd026-semiconductor-references/openstax-devices.json')
const supportingText = path.join(tmp, 'd026-semiconductor-references/openstax-devices.txt')
if (hash(supportingText) !== read(supportingMetadata).content.sha256) {
  issues.push('Cached primary reference hash changed')
}
const prepared = [
  'prepared-lesson.template.json', 'prepared-exercises.template.json',
  'prepared-figures.template.json', 'prepared-book.template.json',
].map((name) => {
  const file = path.join(own, name)
  fs.chmodSync(file, 0o444)
  return { ...binding(file), preservedUnedited: true, readOnly: true }
})
const tools = [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
].map((name) => binding(path.join(repo, name)))
const pageBindings = [273, 274].map((page) => ({
  physicalPage: page,
  files: ['page.md', 'page.json', 'audit.json'].map((name) =>
    binding(path.join(candidate, 'artifacts/9p/pages', String(page).padStart(4, '0'), name))),
}))
const freeze = {
  schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
  ticket: 'STEMROBIN-181', book: '9p', card: 'phy9-c2-s4-n111',
  edition: 'modern-us-neutral', date: '2026-11-16', workspace: repo,
  status: issues.length ? 'HOLD' : 'DRAFT_FROZEN_PENDING_INDEPENDENT_STAGES',
  purpose: 'Authored Chinese modern prose and complete English translation; bindings only, not SOURCE/crop/SCI/finalize approval.',
  pathResolution: 'tmp/ resolves to the existing ticket scratch .intentfold/tickets/STEMROBIN-181/tmp/, where the requested source-report SHA was found.',
  ownedPaths: [own, path.join(tmp, '9p-n111-prose-freeze.json')],
  isolatedRoots: { artifactRoot: command.sourceRoot, workRoot: command.workRoot, futureFinalizeAuthorized: false },
  source: {
    report: binding(command.sourceReport.path), expectedReportSha256: command.sourceReport.sha256,
    nativeInputFiles: command.sourceInputs, pages: pageBindings, figures: sourceFigures,
    snapshot: { ...chinese.source, data: undefined },
    preparedSnapshots: prepared, snapshotsPreserved: issues.length === 0,
    upstreamTextStatus: 'Pages 273 and 274 text PASS inherited as provided; no new SOURCE signature.',
    sourceIndependentReview: binding(path.join(tmp, 'd029-source272-275-source-review.json')),
    independentSourceApproval: false, independentActualCropApproval: false,
    tasks: 0,
  },
  drafts: {
    chinese: binding(templatePath), english: binding(englishPath),
    exercisesUnchangedZeroTasks: binding(path.join(target, 'exercises.template.json')),
    figuresManifestUneditedNativeDraftOnly: binding(path.join(target, 'figures.template.json')),
    perBlockBindings: textBindings,
    translationComplete: english.prose.length === chinese.prose.length,
    translationIsIndependentAuthoredEnglish: true,
    figureSublabelAliases: { 'а': 'a', 'б': 'b', 'в': 'c' },
    numericChanges: [], formulaChanges: [], errata: [],
  },
  native: {
    adaptPrepareInvocationCount: 1,
    adaptPrepareCommand: binding(path.join(own, 'adapt-prepare.command.json')),
    adaptPrepareResult: binding(path.join(own, 'adapt-prepare.result.json')),
    adaptPrepareStdout: binding(path.join(own, 'adapt-prepare.stdout.txt')),
    adaptPrepareStderr: binding(path.join(own, 'adapt-prepare.stderr.txt')),
    executable: command.executable, args: command.args, cwd: command.cwd,
    proseFlowBeforeAnchorsCommand: binding(path.join(own, 'prose-flow.before-anchors.command.json')),
    proseFlowBeforeAnchorsOutput: binding(path.join(own, 'prose-flow.before-anchors.stdout.txt')),
    proseFlowFinalCommand: binding(flowCommand), proseFlowFinalOutput: binding(flowOutput),
    finalParagraphCount: flow?.paragraphs.length ?? null,
    resolvedSectionBreaks: flow?.resolvedBreaks ?? null,
    sectionBoundaryObjects: flow?.boundaries ?? null,
    authoredSectionAnchors: chinese.section_breaks,
    sectionAnchorsCopiedFromNativeOutput: issues.length === 0,
    toolsAndContracts: tools, profile: binding(profile),
    notes: 'No hand-counted paragraph anchors; no adapt-finalize or render invocation.',
  },
  primaryReading: {
    metadata: binding(supportingMetadata), cachedText: binding(supportingText),
    freshAcquisitionCount: 0, importedSourceQuantities: [],
  },
  authorNotes: binding(path.join(own, 'author-notes.json')),
  authorBrief: binding(path.join(own, 'brief.json')),
  authorCommands: [
    'prepare-native.mjs', 'capture-prose-flow.mjs', 'freeze-native-bindings.mjs',
  ].map((name) => binding(path.join(own, name))),
  bindingIssues: issues,
  approvals: {
    SOURCE: 'NOT_SIGNED', actualCropSCI: 'NOT_SIGNED', lessonSCI: 'NOT_SIGNED',
    modernFigureSCI: 'NOT_PERFORMED', adaptFinalize: 'NOT_RUN', render: 'NOT_RUN',
    promotion: 'NOT_PERFORMED', productionPublication: 'NOT_PERFORMED',
  },
  remainingStageRequirements: read(path.join(own, 'author-notes.json')).remaining_stage_requirements,
  restrictions: {
    newlyCreatedTasks: 0, imageLoads: 0, imageGenerationCommands: 0, figureSpecsAuthored: 0,
    sourceStageCommands: 0, sourceAssemblyReruns: 0, adaptFinalizeCommands: 0, renderCommands: 0,
    sharedProductWrites: 0, sourceCandidateWrites: 0, sharedBookWrites: 0,
    sharedIndexWrites: 0, sharedMeterWrites: 0, databaseOperations: 0, gitMutations: 0,
    testsOrBuildsRun: 0, contractChanges: 0,
    sourceAndSymbolsRetainedOnHold: true,
    initialReadOnlyGitStatusObservation: 1,
  },
}
const freezePath = path.join(tmp, '9p-n111-prose-freeze.json')
fs.writeFileSync(freezePath, JSON.stringify(freeze, null, 2) + '\n', { flag: 'wx' })
console.log(`${hash(freezePath)}  ${freezePath}`)
console.log(`Chinese: ${templatePath}`)
console.log(`English: ${englishPath}`)
console.log(`Status: ${freeze.status}`)
if (issues.length) {
  console.error(issues.join('\n'))
  process.exitCode = 2
}
