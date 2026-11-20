import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../../../..')
const readPath = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const read = (relative) => readPath(path.join(own, relative))
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const save = (relative, value, mode = 0o444) => {
  fs.writeFileSync(path.join(own, relative), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode })
  fs.chmodSync(path.join(own, relative), mode)
}
const manifestPath = path.join(path.dirname(own), 'n61-modern-text-author-inputs-01/manifest.json')
const manifest = readPath(manifestPath)
const before = read('input-bindings.before.json')
const bindingAfter = (item) => {
  const bytes = fs.readFileSync(item.path)
  return { path: item.path, beforeSha256: item.sha256, afterSha256: hash(bytes),
    bytes: bytes.length, unchanged: hash(bytes) === item.sha256 }
}
const after = {
  manifest: bindingAfter(before.manifest),
  bindings: before.bindings.map(bindingAfter),
  rulesAndHelpers: before.rulesAndHelpers.map(bindingAfter),
}
save('input-bindings.after.json', after)
if ([after.manifest, ...after.bindings, ...after.rulesAndHelpers].some((item) => !item.unchanged)) {
  throw new Error('Input changed; stop delivery without resetting peer content')
}
const check = read('focused-author-check-01.json')
if (check.status !== 'PASS') throw new Error('Unresolved focused content failure')
const anchors = read('anchor-binding.json')
const flow = read('prose-flow.saved.json')
const freeze = read('FIRST/freeze.json')
const firstBindings = freeze.files.map((item) => {
  const bytes = fs.readFileSync(path.join(own, item.path))
  const mode = fs.statSync(path.join(own, item.path)).mode & 0o777
  if (hash(bytes) !== item.sha256 || mode !== 0o444) throw new Error(`FIRST changed: ${item.path}`)
  return item
})
const finalBindings = []
for (const name of ['lesson', 'exercises']) {
  const bytes = fs.readFileSync(path.join(own, `working/${name}.template.json`))
  const first = read(`FIRST/${name}.template.json`)
  const candidate = JSON.parse(bytes)
  const withoutAnchors = structuredClone(candidate)
  if (name === 'lesson') withoutAnchors.section_breaks = first.section_breaks
  if (JSON.stringify(withoutAnchors) !== JSON.stringify(first)) {
    throw new Error('Final content not bound to checked FIRST; would require affected-only repair')
  }
  for (const suffix of ['template', 'candidate']) {
    const relative = `${name}.${suffix}.json`
    fs.writeFileSync(path.join(own, relative), bytes, { flag: 'wx', mode: 0o444 })
    fs.chmodSync(path.join(own, relative), 0o444)
    finalBindings.push({ path: relative, sha256: hash(bytes), bytes: bytes.length, mode: '0444' })
  }
}
const receipts = fs.readdirSync(path.join(own, 'receipts')).sort().map((stage) => {
  const relative = `receipts/${stage}/command.json`
  return { path: relative, sha256: hash(fs.readFileSync(path.join(own, relative))), data: read(relative) }
})
if (receipts.some((item) => item.data.exitCode !== 0)) throw new Error('Unresolved technical/content stage receipt')
const inheritedPaths = manifest.bindings.filter((item) => /\/(?:assemble-source-01|vectorize-source-01|assemble-source-02|adapt-prepare-isolated-01)\/command\.json$/.test(item.path))
const inherited = inheritedPaths.map((item) => ({ ...item, receipt: readPath(item.path), rerunByThisAuthor: false }))
const allObjects = check.all30ObjectComparison.map((item) => ({
  ...item,
  final_text: item.FIRST_text,
  finalContentBoundToCheckedFIRST: true,
  finalContentCheck: 'Saved checked-FIRST equality; no unaffected checks repeated',
}))
save('author-report.json', {
  schema: 'stemrobin188-n61-modern-text-author-report@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  lesson: 'geo910-c2-s3-n61', edition: 'modern-us-neutral',
  role: 'MODERN TEXT AUTHOR ONLY, NOT REVIEWER',
  status: 'authored-candidates-ready-for-parent-collection-and-independent-review',
  repository: repo, ownRoot: own,
  suppliedManifest: { path: manifestPath, sha256: before.manifest.sha256 },
  candidates: finalBindings,
  counts: { allObjects: 30, prose: 20, textualProse: 8, figureSlots: 6, captionSlots: 6, exercises: 10 },
  all30ObjectComparisonAndChangeMapping: allObjects,
  figureCaptionPairs: check.figureCaptionPairs,
  textPolicy: {
    sourceNeutral: true, semanticOrCulturalRewrites: 0,
    preservedNonWhitespaceCodepointSequence: true,
    literalOrderedFormulasPreserved: true,
    numeric_changes: [], historical_entities: [], errata: [],
    gradeMappingAdded: false, sourceMathCorrection: false,
    panelTransliterations: [], figureInspectionOrCreation: false,
    mathPunctuation: 'No Chinese prose punctuation inserted inside math; literal source math and outside punctuation retained.',
    protected: ['source218 accepted h3 repair and N60 exclusion', 'recall p0218#12,p0219#5',
      'frustum p0219#15,p0220#5 and literal ) immediately after $[O_1,O]$ outside math',
      'exercise209 p0220#12,p0221#1', 'source219 literal S_{侧} and S_{圆锥}',
      '207 raised circle literal prefix', '210 roof 苫 verb', 'all source emphasis, fine glyph/font/codepoint/punctuation HOLDs',
      'Figure88 prose/net roles and exercise215 refs', 'N62 exclusion'],
  },
  inputBindings: { before: read('input-bindings.before.json'), after },
  actualCommandReceipts: receipts,
  reusedPriorStages: inherited,
  first: { path: 'FIRST/freeze.json', sha256: hash(fs.readFileSync(path.join(own, 'FIRST/freeze.json'))),
    frozenBeforeFocusedChecks: true, files: firstBindings, immutable: true },
  focusedAuthorCheck: { path: 'focused-author-check-01.json',
    sha256: hash(fs.readFileSync(path.join(own, 'focused-author-check-01.json'))),
    status: check.status, helpers: check.helperBinding, failures: check.failures },
  savedActualFlow: { path: 'prose-flow.saved.json',
    sha256: hash(fs.readFileSync(path.join(own, 'prose-flow.saved.json'))), ...flow },
  anchorBinding: anchors,
  failures: {
    initialAuthorContentFailures: check.failures,
    technicalExecutionFailures: [],
    preauthorDirectoryProbe: {
      command: 'ls -ld .intentfold/tickets/STEMROBIN-188/tmp/n61-modern-text-author',
      exitCode: 1, stdout: '',
      stderr: 'ls: .intentfold/tickets/STEMROBIN-188/tmp/n61-modern-text-author: No such file or directory\n',
      classification: 'Expected nonexistence inventory result establishing NEW own root; not a failed author stage.',
    },
    source220OriginalFAIL: 'Historical original missing-parenthesis FAIL retained, not overwritten by accepted repair.',
    bothSource220MissedFIRSTs: 'Both historical FIRST misses remain historical; existing single accepted repair1/1 reused, no source repair performed here.',
    source212ProceduralFAIL: manifest.sourceHolds.source212ProceduralFAIL,
  },
  repair: { limit: 1, used: 0, affectedOnlyChecks: [], genuineProseRepairs: 0,
    anchorInsertionNotContentRepair: true },
  counters: {
    initialAuthorRuns: 1, focusedAuthorChecks: 1, focusedAffectedOnlyChecks: 0,
    proseFlowRuns: 1, affectedProseFlowRuns: 0, postAnchorFlowRuns: 0,
    contentRepairsUsed: 0, sourceRepairsByThisAuthor: 0, imagesInspected: 0,
    sourceImageReads: 0, figuresCreated: 0, mathSyntaxChecks: 0, paidCalls: 0,
    sourceAdmissionReruns: 0, assembly1Reruns: 0, vectorizationReruns: 0,
    assembly2Reruns: 0, adaptPrepareReruns: 0, adaptFinalizeRuns: 0,
    nativeCalls: 0, sourceParserCalls: 0, counterCalls: 0, rendererCalls: 0,
    formalProjectChecks: 0, peerMessages: 0, backendCalls: 0, databaseCalls: 0,
    dependencyChanges: 0, commits: 0, pushes: 0, publications: 0,
  },
  syntaxCheckNotNeeded: 'Already assembled exact source math retained; pure exact identity/signature checks do not constitute mathematical validity review. No KaTeX helper invocation.',
  holds: manifest.sourceHolds,
  figure87EvidenceSeparation: {
    historicalAuthorUnobservedHOLD: 'RETAINED, not overwritten',
    laterIndependentActualObservation: 'Inherited separately as recorded by supplied source admission; not observed or approved by this author',
  },
  inheritedSourceAdmission: {
    path: manifest.sourceAdmission.path, sha256: manifest.sourceAdmission.sha256,
    status: readPath(manifest.sourceAdmission.path).status,
    historicalEvidenceReferences: readPath(manifest.sourceAdmission.path).inheritedReviews,
    body: 'Existing admission reused as supplied; no transitive source images, review packages, answers or neighboring lessons opened.',
  },
  approvals: {
    authorSelfApproval: false, independentModernTextApproval: false, sourceApproval: false,
    figureApproval: false, wholeLessonApproval: false, templatesApplied: false,
    promoted: false, published: false, ticketClosed: false,
  },
  parentCollectionContract: 'Parent collects and CLOSES this author before reading outputs; no approval or promotion by author.',
}, 0o644)
console.log(JSON.stringify({ status: 'authored-not-approved', outputs: finalBindings,
  contentRepairsUsed: 0, images: 0, report: 'author-report.json' }, null, 2))
