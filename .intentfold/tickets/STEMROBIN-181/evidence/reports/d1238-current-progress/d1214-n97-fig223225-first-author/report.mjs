import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const artifact = file => ({
  path: file, sha256: hash(file), bytes: fs.statSync(file).size,
})
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const freeze = read(path.join(root, 'source-inventory-freeze.json'))
for (const binding of [
  ...freeze.textBindings,
  ...freeze.figures.flatMap(item => [item.original, item.image, item.inventory]),
]) {
  if (hash(binding.path) !== binding.sha256) throw new Error(`Frozen input changed: ${binding.path}`)
}
const observations = {
  223: [
    'Inspected the unmodified native resvg raster at 640 x 440. Labels and arrowheads are present, but coordinate-axis shafts and synchronized-clock circles/hands are absent. The rod is a black filled rectangle rather than the intended semantic-color vector presentation.',
    'The surviving labels preserve K/K1, O/O1, X/X1, Y/Y1, Z/Z1 and A/B identities. The clocks are explicit modern additions and cannot be visually accepted because their outlines/hands are missing.',
    'Native repair1 render still rejects X and X1 label clearance.',
  ],
  224: [
    'Inspected the unmodified native resvg raster at 640 x 340. Optical arrowheads point right on the upper track and left on the lower track, but the tracks, coordinate-axis shafts, apparatus supports and length-dimension shaft are absent. The rod is black.',
    'The rest-length l0 label remains. A is visually crowded against O1, matching the remaining native clearance failure. This is not a usable rest-clock diagram.',
    'Native repair1 render still rejects X1 and A label clearance.',
  ],
  225: [
    'Inspected the unmodified native resvg raster at 640 x 580. Three right-shifted rod positions and all endpoint/time/span labels remain, but coordinate-axis shafts, dimension shafts and the shared B1 reflection guide are absent. All three rod rectangles are black, including the two intended outlined positions.',
    'The c-arrow cues retain rightward outbound and leftward return directions, but isolated arrowheads cannot replace the missing optical-distance and motion-span geometry.',
    'Native repair1 render still rejects X, X1 and A label clearance.',
  ],
}
const figures = [223, 224, 225].map(number => {
  const figure = `fig-${number}`
  const dir = path.join(root, 'figures', figure)
  const firstSpecPath = path.join(dir, `${figure}.first.spec.json`)
  const currentSpecPath = path.join(dir, `${figure}.repair1.spec.json`)
  const firstRender = read(path.join(dir, `${figure}.first.render.json`))
  const currentRender = read(path.join(dir, `${figure}.repair1.render.json`))
  const firstSpec = read(firstSpecPath)
  const currentSpec = read(currentSpecPath)
  const freezeItem = freeze.figures.find(item => item.figure === figure)
  const inventory = read(freezeItem.inventory.path)
  const sourceMap = read(path.join(dir, 'source-point-relationship-map.json'))
  const expectedSourcePoints = inventory.panels.flatMap(panel => panel.points.map(point => point.id))
  if (sourceMap.sourcePointMappings.length !== expectedSourcePoints.length ||
      sourceMap.sourcePointMappings.some(item => item.assertions.length === 0)) throw new Error('Incomplete source-point map')
  for (const stage of ['first', 'repair1']) {
    const render = read(path.join(dir, `${figure}.${stage}.render.json`))
    if (render.spec.sha256 !== hash(path.join(dir, `${figure}.${stage}.spec.json`)) ||
        render.output.svg.sha256 !== hash(path.join(dir, `${figure}.${stage}.svg`))) throw new Error('Stale renderer binding')
  }
  return {
    figure, mode: 'deterministic', display: currentSpec.display,
    status: 'AUTHOR-NATIVE-FAIL-ONE-REPAIR-EXHAUSTED',
    source: freezeItem,
    frozenInventoryPrecedesFirstSpec: fs.statSync(freezeItem.inventory.path).mtimeMs < fs.statSync(firstSpecPath).mtimeMs,
    context: artifact(path.join(root, `contexts/${figure}.context.json`)),
    sourcePointCount: expectedSourcePoints.length,
    sourceRelationshipCount: inventory.panels.flatMap(panel => panel.relationships).length,
    sourcePointMap: artifact(path.join(dir, 'source-point-relationship-map.json')),
    explicitModernAdditions: artifact(path.join(dir, 'author-additions.json')),
    noObjectCountSubstitutes: firstSpec.assertions.every(item => item.type !== 'objectCount'),
    first: {
      spec: artifact(firstSpecPath),
      svg: artifact(path.join(dir, `${figure}.first.svg`)),
      render: artifact(path.join(dir, `${figure}.first.render.json`)),
      raster: artifact(path.join(dir, `${figure}.first.preview-640.png`)),
      validation: artifact(path.join(root, `native/${figure}.validate.first.json`)),
      validationStatus: JSON.parse(read(path.join(root, `native/${figure}.validate.first.json`)).stdout).status,
      renderStatus: firstRender.status, collisions: firstRender.collisions,
      renderCalls: 1, rasterCalls: 1, rasterActuallyOpened: false,
    },
    repair1: {
      spec: artifact(currentSpecPath),
      svg: artifact(path.join(dir, `${figure}.repair1.svg`)),
      render: artifact(path.join(dir, `${figure}.repair1.render.json`)),
      raster: artifact(path.join(dir, `${figure}.repair1.preview-640.png`)),
      validation: artifact(path.join(root, `native/${figure}.validate.repair1.json`)),
      validationStatus: JSON.parse(read(path.join(root, `native/${figure}.validate.repair1.json`)).stdout).status,
      renderStatus: currentRender.status, collisions: currentRender.collisions,
      displayChecks: currentRender.displayChecks,
      changes: artifact(path.join(dir, 'repair1.changes.json')),
      geometrySourceAssertionsAndDisplayUnchanged: read(path.join(dir, 'repair1.changes.json')).geometrySourceAssertionsAndDisplayUnchanged,
      renderCalls: 1, rasterCalls: 1, rasterActuallyOpened: true,
    },
    authorOnlyVisualInspection: {
      independent: false, gate: 'FAIL', actualOpenOrdinal: number - 219,
      inspectedArtifact: artifact(path.join(dir, `${figure}.repair1.preview-640.png`)),
      observations: observations[number],
      resolution: [currentSpec.canvas.width, currentSpec.canvas.height],
      usableAtMediaWidth: false,
    },
    currentHashBindingsVerified: true,
    independentVisualReview: 'PENDING-NOT-PERFORMED',
    promotionEligible: false,
  }
})
const usage = {
  schema: 'd037/bounded-first-figure-author-usage@1',
  freshBatches: 1,
  actualImageOpens: 6,
  batchImageOpenLimit: 8,
  imagesLoadedInThisContext: 6,
  contextImageLimit: 24,
  imageOpenLedger: [
    ...freeze.figures.map((item, index) => ({
      ordinal: index + 1, kind: 'original', figure: item.figure,
      image: item.original, independentOpen: true, inventoryFrozenBeforeItsSpec: true,
    })),
    ...figures.map((item, index) => ({
      ordinal: index + 4, kind: 'native-raster-preview', figure: item.figure,
      image: item.repair1.raster, inspected: true, widthPx: 640,
    })),
  ],
  crops: 0, reopens: 0,
  nativeBuildContextCalls: 3,
  explicitNativeSpecValidationCalls: 6,
  rendererInternalValidationCalls: 6,
  nativeJSXGraphRenderCalls: 6,
  nativeSvgRasterCalls: 6,
  firstRenderCallsPerFigure: 1,
  targetedRepairsPerFigure: 1,
  furtherRepairCalls: 0,
  firstRasterFilesPreservedButNotOpened: 3,
  paidCalls: 0, networkCalls: 0,
  independentVisualReviewCalls: 0, reviewRecords: 0,
  sourceEdits: 0, authorTextEdits: 0, durableEdits: 0, nativeWholeLessonCalls: 0,
  gitCalls: 0, gitStatusCalls: 0, databaseCalls: 0, publisherCalls: 0,
  chatCalls: 0, toolOrSkillEdits: 0, dependencyEdits: 0,
}
write(path.join(root, 'usage.json'), usage)
const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (entry.isFile()) files.push(file)
  }
}
walk(root)
const report = {
  schema: 'd037/first-modern-figure-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D037', card: 'phy10-c2-s4-n97',
  role: 'FIRST modern FIGURES223/224/225 AUTHOR only',
  cwd: '/Users/yong/.codex/worktrees/00b1/lemmadeck',
  ownershipRoot: root,
  finishedAt: new Date().toISOString(),
  status: 'FIRST-AUTHORED-NATIVE-FAIL-REPAIR-LIMIT-REACHED-INDEPENDENT-VISUAL-REVIEW-PENDING',
  stopReason: 'All three FIRST native renders failed label collisions. One label-only repair per figure preserved geometry/source/assertions/display but still failed native clearance. All three inspected unmodified native rasters are visually broken. The bounded repair loop ends here; no pass, independent review or promotion is claimed.',
  authoritativeText: {
    report: freeze.textBindings[0],
    zhLesson: freeze.textBindings[1],
    zhExercises: freeze.textBindings[2],
    enLesson: freeze.textBindings[3],
    enExercises: freeze.textBindings[4],
    inheritedTextNativeStatus: 'PASS',
    independentTextReview: 'PARALLEL-PENDING-NOT-CLAIMED-BY-THIS-AUTHOR',
    exerciseCount: 0,
    copiedZhTemplatesByteIdenticallyAsContextLessonAndExercises: true,
    completeCurrentZhAndEnParagraphsBoundInEveryFigureSpec: true,
    inputHashesUnchangedAtFinish: true,
  },
  sourceInventoryFreeze: artifact(path.join(root, 'source-inventory-freeze.json')),
  source223Clarification: 'RAW223 has one longitudinal rod AB with transverse axes, not two rod panels. No transverse rod was invented. Synchronized K clocks are documented modern additions from current text, not asserted source pixels.',
  source225Clarification: 'All three rod endpoint pairs, original dimension labels, shared K/K1 baseline and common B1 reflection guide are specified and relationship-asserted. Time-row offsets are layout only. One-way c cues supplement, never replace, the original double-ended dimensions.',
  figures,
  authorNativeSummary: {
    firstSpecValidationPasses: 3, repairedSpecValidationPasses: 3,
    firstRenderPasses: 0, repairedRenderPasses: 0,
    readableTextChecksPassedAt640: 3, minimumMeasuredTextPx: 20,
    authorRasterVisualFailures: 3, independentVisualReview: 'PENDING',
    noFurtherRepairWithoutNewAuthorization: true,
  },
  usage: artifact(path.join(root, 'usage.json')),
  artifacts: files.sort().map(artifact),
  outputScope: 'Only this assigned temporary batch directory; concurrent changes elsewhere preserved without Git/status operations.',
  independentReviewRecordCreated: false,
  promotionPerformed: false,
}
write(path.join(root, 'report.json'), report)
console.log(JSON.stringify({
  report: artifact(path.join(root, 'report.json')),
  status: report.status, actualImageOpens: usage.actualImageOpens,
  inputHashesUnchangedAtFinish: true,
  figures: figures.map(item => ({
    figure: item.figure,
    firstSpecSha256: item.first.spec.sha256, firstSvgSha256: item.first.svg.sha256,
    currentSpecSha256: item.repair1.spec.sha256, currentSvgSha256: item.repair1.svg.sha256,
    validation: item.repair1.validationStatus, render: item.repair1.renderStatus,
    remainingCollisions: item.repair1.collisions.map(collision => collision.id),
  })),
}, null, 2))
