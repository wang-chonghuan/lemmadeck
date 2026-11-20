import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const own = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d170-n12-text-author'
const bind = (file) => {
  assert(!/\.(png|svg|jpe?g|pdf|webp)$/i.test(file), 'ImagesZERO')
  const raw = fs.readFileSync(file)
  return { path: path.resolve(file), bytes: raw.length, sha256: crypto.createHash('sha256').update(raw).digest('hex') }
}
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, data) => {
  assert(!fs.existsSync(file), 'Never replace an existing author report or freeze')
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
  return bind(file)
}
const focusedPath = `${own}/receipts/007-focused-check-and-freeze.json`
const focused = read(focusedPath)
const inputsPath = `${own}/receipts/004-input-bindings.json`
const before = read(inputsPath)
assert.equal(focused.status, 'TEXTS_FROZEN_MECHANICAL_CHECKS_ONLY')
assert.equal(focused.counters.proseFlowCalls, 2)
const descriptions = [
  {
    sourceRefs: ['p0034#4'],
    originalKnowledge: ['Pressure, volume, and temperature are coupled state variables.', 'Their relationships are used to measure temperature; section 11 remains referenced.', 'Gas relationships between p, V, and t have comparatively simple forms.'],
    ZH: '用压强、体积、温度的联系引入气体定律，保留测温用途、§11 与 p、V、t。',
    EN: 'Introduces the coupled state variables, their thermometric use, section 11, and p, V, t.',
  },
  {
    sourceRefs: ['p0034#5'],
    originalKnowledge: ['Simultaneous variation makes experimental patterns harder to isolate.', 'Hold one of p, V, t fixed and compare the other two.', 'The resulting quantitative relation is a gas law.'],
    ZH: '保留实验中固定一个参量、比较另两个参量的思路与气体定律定义，并明确气体量固定。',
    EN: 'Retains the experimental comparison and gas-law definition, explicitly fixing the amount of gas.',
  },
  {
    sourceRefs: ['p0034#6'],
    originalKnowledge: ['Original book credits the British scientist Boyle and reports 1660.', 'Source work title concerning the spring of air is retained in translation.', 'Compressed gas is compared with a spring and the bicycle pump remains the everyday example.'],
    ZH: '保留英国、玻义耳、原书1660记载、空气弹簧书名与自行车打气筒比喻；年份只归于原书。',
    EN: 'Retains Boyle, British identity, the source-reported 1660 date, translated work title, air-spring analogy, and bicycle pump.',
    limits: ['1660 is attributed to the original book, not independently certified or replaced.', 'Historical identities are block-bound to actual source terms.'],
  },
  {
    sourceRefs: ['p0034#7', 'p0035#1'],
    originalKnowledge: ['Boyle studies pressure and volume at constant temperature.', 'An isothermal process changes state without changing temperature.', 'Source experimental model exchanges heat with a constant-temperature system.', 'An atmosphere with no noticeable temperature change can serve that role.'],
    ZH: '完整保留跨页等温定义、玻义耳研究、恒温器热交换和稳定大气例子；将恒温器要求限定在原书实验安排。',
    EN: 'Retains the joined isothermal definition, Boyle, heat exchange, thermostat meaning, and stable-atmosphere example.',
    limits: ['The source apparatus is explanatory, not a universal necessity for every conceivable isothermal system.'],
  },
  {
    sourceRefs: ['p0035#2'],
    originalKnowledge: ['Historical bent tube contains a fixed mass of air trapped by mercury.', 'Initially level mercury surfaces mean trapped-air pressure equals atmospheric pressure.', 'Source 760-millimeter height difference, increase by one initial pressure, doubled total pressure, and half-volume model.', 'Observations with different mercury amounts support inverse proportionality.'],
    ZH: '保留弯管、水银、定质量空气、等液面与大气压、760毫米、增大1倍、压强加倍和体积减半及后续历史观察。',
    EN: 'Retains the bent tube, mercury, fixed air mass, level surfaces, atmospheric pressure, 760 millimeters, increase by one initial pressure, doubled pressure, half volume, and subsequent observations.',
    limits: ['Uses absolute pressure.', 'The numerical doubling retains the source atmospheric-pressure assumption.', 'Historical narrative only; no child-directed mercury procedure.', 'No figure scale or gauge values are inferred.'],
  },
  {
    sourceRefs: ['p0035#3'],
    originalKnowledge: ['Figure 17 slot, ID, page, order, and source reference.'],
    ZH: '保留图17空图槽、身份与来源；不读取或批准图片。',
    EN: 'Retains the empty Figure 17 slot and its identity; localizes the label only.',
    limits: ['Figure content is unauthored and unapproved.'],
  },
  {
    sourceRefs: ['p0035#4'],
    originalKnowledge: ['Figure 17 caption and number.'],
    ZH: '保留原有图17图题。',
    EN: 'Translates the caption to Figure 17 without changing its number or source identity.',
  },
  {
    sourceRefs: ['p0035#5'],
    originalKnowledge: ['French physicist Mariotte reaches the same conclusion independently of Boyle.', 'Boyle-Mariotte naming.', 'Fixed-mass, constant-temperature inverse pressure-volume relation.', 'State variables V1, p1, V2, p2 and exact source equation p2/p1=V1/V2 with label (2-1).'],
    ZH: '保留法国、马略特独立研究、定律命名、定质量等温反比关系、全部变量、原式和式号；明确绝对压强与近似范围。',
    EN: 'Retains French Mariotte, independent research, naming, fixed-mass isothermal inverse relation, all variables, exact source ratio, and equation number.',
    limits: ['No gas enters, leaves, or leaks.', 'Temperature is constant and pressure is absolute.', 'Exact model relation is not a universal real-gas identity.'],
  },
  {
    sourceRefs: ['p0035#6'],
    originalKnowledge: ['Exact source product equation p1V1=p2V2.', 'Source t=constant and pV=constant notation and equation number (2-2).'],
    ZH: '保留 p1V1=p2V2、t=恒量、pV=恒量和式号；恒量只对应气体量与温度固定的状态组。',
    EN: 'Retains p1V1=p2V2, t=constant, pV=constant, and (2-2), with the constant limited to one fixed gas amount and temperature.',
    limits: ['All source math tokens remain unchanged, including $t=$ and $pV=$.', 'Absolute pressure and real-gas limits apply.'],
  },
  {
    sourceRefs: ['p0035#7'],
    originalKnowledge: ['Source examples hydrogen, oxygen, and mixtures such as air.', 'Source applicability is not restricted to one gas species.'],
    ZH: '保留氢气、氧气、空气混合物与非单一气体的知识；明确理想气体、低密度、远离凝结及高压偏离。',
    EN: 'Retains hydrogen, oxygen, and air mixtures while distinguishing ideal-gas behavior from real-gas approximation limits.',
    limits: ['Not exact for every real gas at every pressure or temperature.', 'Low-density and away-from-condensation conditions are explanatory limits, not new source numeric corrections.'],
  },
  {
    sourceRefs: ['p0036#1'],
    originalKnowledge: ['Figure 18 apparatus explains testing the pressure-volume law and retains footnote marker ①.', 'Sealed corrugated container and pressure gauge M.', 'Screw rod B changes volume.', 'Ruler L is used to determine volume in the apparatus model.', 'Readings at different volumes test equation (2-2).'],
    ZH: '保留图18、密封波纹容器、压强计M、螺丝杆B、直尺L、体积压强对应与式(2-2)；保留①。',
    EN: 'Retains Figure 18, the sealed corrugated container, gauge M, screw B, ruler L, the pressure-volume test, (2-2), and ①.',
    limits: ['Apparatus roles are explanatory, not operation steps.', 'Fixed gas amount, constant temperature, and absolute pressure are explicit.', 'No assumption that every gauge directly gives absolute pressure.', 'Tiny gauge/ruler interpretation remains HOLD; no numerical readings are supplied.'],
  },
  {
    sourceRefs: ['p0036#9'],
    originalKnowledge: ['Source footnote ① warns that repeating the Boyle experiment needs stronger precautions.', 'Mercury vapor is toxic.', 'Mercury spills easily.'],
    ZH: '完整保留加强预防、水银蒸汽有毒、水银易溢出；加入儿童不重做、不接触水银的历史范围。',
    EN: 'Retains stronger precautions, toxic mercury vapor, and easy spills; explicitly does not ask children to repeat the experiment or handle mercury.',
    limits: ['Owned by N12, not adjacent N13.', 'No mercury handling or cleanup instructions.'],
  },
  {
    sourceRefs: ['p0036#2'],
    originalKnowledge: ['Figure 18 slot, ID, page, order, and source reference.'],
    ZH: '保留图18空图槽与来源，不读图。',
    EN: 'Retains the empty Figure 18 slot and its source identity; translates its label.',
    limits: ['Figure content and tiny scales remain unapproved.'],
  },
  {
    sourceRefs: ['p0036#3'],
    originalKnowledge: ['Figure 18 caption and number.'],
    ZH: '保留图18图题。',
    EN: 'Translates the caption to Figure 18, retaining its number and identity.',
  },
  {
    sourceRefs: ['p0036#4'],
    originalKnowledge: ['Figure 19 slot, ID, page, order, and source reference.'],
    ZH: '保留图19空图槽与来源，不读图。',
    EN: 'Retains the empty Figure 19 slot and its source identity; translates its label.',
    limits: ['No redraw, visual approval, or inference from figure pixels.'],
  },
  {
    sourceRefs: ['p0036#5'],
    originalKnowledge: ['Figure 19 caption and number.'],
    ZH: '保留图19图题。',
    EN: 'Translates the caption to Figure 19, retaining its number and identity.',
  },
  {
    sourceRefs: ['p0036#6'],
    originalKnowledge: ['Figure 19 isotherms express the inverse pressure-volume relation and are hyperbolas in the model.', 'Different curves represent different temperatures.', 'The higher-temperature t2 curve lies above the lower-temperature t1 curve.', 'Footnote marker ② remains attached to temperature-pressure comparison.'],
    ZH: '保留图19、等温反比、双曲线、不同温度曲线及t2高于t1和②；比较限定同一气体量、相同体积。',
    EN: 'Retains Figure 19, isotherms, inverse relation, hyperbolas, t2 above t1, and ②; compares the same gas amount at the same volume.',
    limits: ['Each curve has constant temperature.', 'Cross-temperature pressure comparison fixes volume.', 'No global claim comparing arbitrary different-volume points.', 'Real-gas limits remain stated.'],
  },
  {
    sourceRefs: ['p0036#10'],
    originalKnowledge: ['Footnote ② points to source section 18 for a more detailed discussion.'],
    ZH: '保留②与§18的后续讨论引用，明确它承接本课等温线比较。',
    EN: 'Retains ② and section 18, identifying the note with this lesson’s isotherm comparison.',
    limits: ['Owned by N12, not N13.'],
  },
]
assert.equal(descriptions.length, 18)
const coverage = descriptions.map((description, index) => {
  const ZH = focused.blockMechanicalEvidence.find((item) => item.language === 'ZH' && JSON.stringify(item.sourceRefs) === JSON.stringify(description.sourceRefs))
  const EN = focused.blockMechanicalEvidence.find((item) => item.language === 'EN' && JSON.stringify(item.sourceRefs) === JSON.stringify(description.sourceRefs))
  assert(ZH && EN)
  return {
    blockPosition: index + 1,
    ...description,
    coverageStatus: { ZH: 'AUTHORED_AWAITING_FIRST_INDEPENDENT_REVIEW', EN: 'AUTHORED_AWAITING_FIRST_INDEPENDENT_REVIEW' },
    mechanicalPreservationEvidence: { ZH, EN },
  }
})
const currentBindings = [
  ...focused.currentInputs,
  ...focused.evidenceInputs,
  ...focused.runtimeInputs,
  focused.katex.stdout,
  bind(focusedPath),
  bind(inputsPath),
  bind(`${own}/receipts/write-reports.mjs`),
  ...focused.frozen.flatMap((item) => [item.working, item.frozen]),
]
const manifest = [...new Map(currentBindings.map((item) => [item.path, bind(item.path)])).values()]
const unchangedPaths = before.inputs.filter((item) =>
  !focused.frozen.some((output) => output.working.path === item.path)).map((item) => item.path)
const prohibited = {
  setupReplay: false,
  freshnessReplay: false,
  grillReplay: false,
  branchResetOrSwitch: false,
  sourceReviewReplay: false,
  originalSnapshotWrites: false,
  isolatedSourceWrites: false,
  pageWrites: false,
  exerciseWrites: false,
  figureTemplateWrites: false,
  toolSchemaWrites: false,
  canonicalResourceWrites: false,
  sourceScientificNumericCorrections: false,
  newErrataRegistration: false,
  databaseAccess: false,
  publisher: false,
  paidCalls: false,
  generation: false,
  modelOverride: false,
  commit: false,
  push: false,
  deploy: false,
  merge: false,
  closure: false,
  peerOrSupervisorMessages: false,
  wholeProjectChecks: false,
  adaptFinalize: false,
  render: false,
  buildContext: false,
  fullScienceCheck: false,
  productAcceptance: false,
  approval: false,
  promotion: false,
}
const limits = [
  'The two templates are first-authored drafts, not SCI/ZH/EN-approved content.',
  'Three modern figures remain pending: fig-17, fig-18, fig-19.',
  'Source34/35/36 uses existing observations plus actual byte-bound corrections, not new source-page reviews.',
  'Original genuine source-review fail statuses are retained and not overwritten by correction-pass evidence.',
  'The tiny gauge/ruler numeric interpretation remains HOLD. No values are inferred, no figures are read, redrawn, or approved.',
  'Both page36 footnotes p0036#9 and p0036#10 remain in N12, not N13.',
  'Gas amount is fixed; isothermal states have constant gas temperature.',
  'pV relations use absolute pressure, not unconverted gauge pressure.',
  'Relations are ideal-gas model results, approximate for real gases under suitable low-density, away-from-condensation conditions; not exact at every pressure or temperature.',
  'Source 1660 remains attributed to the original book, neither certified nor silently replaced.',
  'Historical 760-millimeter mercury height, increase by one initial pressure, doubled pressure, and half-volume model retain the source atmospheric assumption.',
  'Mercury apparatus description is historical, not a child-directed experiment; the full toxic-vapor/easy-spill warning and stronger-precaution statement remain.',
  'Thermostat heat exchange and stable atmosphere remain source experimental examples, not universal requirements for every conceivable isothermal system.',
  'Higher-temperature curve has larger pressure for the same gas amount at the SAME volume; arbitrary points at different volumes are not compared.',
  'All original equations, numeric values, units, materials, figure references, source texts, and block identities are retained; only permitted translation, wording, layout, and label metadata are authored.',
  'Historical entities are declared per block using terms that actually occur in that block’s source; declarations are not a global cultural-check bypass.',
]
const reportPath = `${own}/report.json`
const freezePath = `${own}/author-freeze.json`
const sealPath = `${own}/receipts/008-final-bindings.json`
const report = {
  schema: 'STEMROBIN-181/D170-first-bilingual-text-author-report@1',
  ticket: 'STEMROBIN-181',
  author: 'D170',
  date: '2026-11-20',
  workdir: cwd,
  book: '9p',
  lesson: 'phy9-c1-s2-n12',
  authorization: { sameInvocation: true, finish: 'review', Grill: 'self', setupFreshnessGrillSatisfiedByHuman: true, ImagesZERO: true, firstIndependentReviewsOwnedBy: 'parent', disjointReviewer: 'D167 N5; no interaction' },
  status: 'FIRST_BILINGUAL_TEXT_AUTHOR_FROZEN_FOR_PARENT_REVIEW',
  prepared: bind(`${own}/prepared.json`),
  perBlockSemanticCoverage: coverage,
  preservation: { sourceBlocksPerEdition: 18, proseTextBlocksPerEdition: 12, figureSlotsPerEdition: 3, captionBlocksPerEdition: 3, exercises: 0, equationsUnchanged: ['p2/p1=V1/V2', 'p1V1=p2V2', 't=constant / pV=constant'], noNumericChanges: true, noNewErrata: true, sourceSnapshotsExact: true, sourceRefsExact: true, originalIdentitiesPreserved: true, figuresPending: ['fig-17', 'fig-18', 'fig-19'], bothFootnotesOwnedBy: 'N12', EnglishTitle: 'Gas Laws: The Boyle-Mariotte Law', EnglishLocale: 'en', lockedChapterSectionPrintedTitle: 'Retained exactly as source metadata; only the allowed visible title is translated.' },
  sourcePassComposition: before.sourcePassComposition,
  limits,
  counters: focused.counters,
  executionFailures: [
    { receipt: bind(`${own}/receipts/001-discovery-failed.json`), classification: 'Technical path discovery, not content failure.' },
    { receipt: bind(`${own}/receipts/002-source-path-failed.json`), classification: 'Technical missing book qualifier and truncated read; corrected source path only.' },
    { receipt: bind(`${own}/receipts/003-metadata-discovery-failed.json`), classification: 'Technical filename discovery; actual edition.py subsequently read.' },
  ],
  passedStagesReused: ['Exactly two previously successful native adapt-prepare calls; no replay.', 'Existing source observations and byte-bound corrections; no source/native producer replay.', 'One successful native prose_flow.mjs call per authored template; boundaries copied from returned objects without manual integers.'],
  authorMechanicalEvidence: { receipt: bind(focusedPath), checks: focused.checks.length, KaTeXTokens: focused.katex.stdinItems.length, result: 'MECHANICAL_CHECKS_SATISFIED_ONLY' },
  independentReviews: { SCI: 'FIRST_REVIEW_PENDING_PARENT', ZH: 'FIRST_REVIEW_PENDING_PARENT', EN: 'FIRST_REVIEW_PENDING_PARENT', figures: 'PENDING' },
  prohibitedOperations: prohibited,
  currentBindings: manifest,
  frozenTemplates: focused.frozen,
  unchangedReadInputPaths: unchangedPaths,
  changedPaths: [
    ...focused.frozen.map((item) => item.working.path),
    ...focused.frozen.map((item) => item.frozen.path),
    ...manifest.filter((item) => item.path.startsWith(path.resolve(`${own}/receipts/`))).map((item) => item.path),
    path.resolve(reportPath),
    path.resolve(freezePath),
    path.resolve(sealPath),
  ],
  bindingPolicy: 'Every explicitly consumed source/tool/input and prior produced output/evidence has a current path/bytes/SHA256 binding. Historical pre-author and pre-boundary hashes remain stage evidence. To avoid self-referential hash cycles, the final report and author-freeze bytes are sealed together in receipts/008-final-bindings.json and returned in the final response.',
  parentNext: 'Parent performs the first independent SCI, ZH, and EN review of these exact frozen bytes, handles pending figures, collects evidence, and owns any later authorized collection or closure.',
}
const reportBinding = writeNew(reportPath, report)
const freeze = {
  schema: 'STEMROBIN-181/D170-author-freeze@1',
  author: 'D170',
  ticket: 'STEMROBIN-181',
  book: '9p',
  lesson: 'phy9-c1-s2-n12',
  workdir: cwd,
  status: 'AUTHORED_TEXT_BYTES_FROZEN_NOT_APPROVED',
  freezeMechanism: 'New byte-identical copies written without replacing any prior file. No permission change or promotion.',
  templates: focused.frozen,
  report: reportBinding,
  currentBindings: [...manifest, reportBinding],
  perBlockSemanticCoverage: coverage,
  limits,
  counters: focused.counters,
  prohibitedOperations: prohibited,
  firstIndependentReviews: { SCI: 'PENDING_PARENT', ZH: 'PENDING_PARENT', EN: 'PENDING_PARENT' },
  changedPaths: report.changedPaths,
  bindingPolicy: report.bindingPolicy,
  externalSeal: path.resolve(sealPath),
}
const freezeBinding = writeNew(freezePath, freeze)
const seal = {
  stage: 'FINAL_AUTHOR_ARTIFACT_BYTES_SEALED',
  workdir: cwd,
  ticket: 'STEMROBIN-181',
  author: 'D170',
  lesson: 'phy9-c1-s2-n12',
  report: reportBinding,
  authorFreeze: freezeBinding,
  templates: focused.frozen,
  currentBindings: [...manifest, reportBinding, freezeBinding],
  changedPaths: report.changedPaths,
  counters: focused.counters,
  independentReviewOrPromotion: false,
}
const sealBinding = writeNew(sealPath, seal)
console.log(JSON.stringify({ report: reportBinding, authorFreeze: freezeBinding, templates: focused.frozen, finalSeal: sealBinding, changedPaths: report.changedPaths }, null, 2))
