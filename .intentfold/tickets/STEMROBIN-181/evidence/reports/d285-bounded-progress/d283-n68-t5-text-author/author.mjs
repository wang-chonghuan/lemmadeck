import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { proseOutline } = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const local = p => read(path.join(out, p))
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const bindings = local('source-binding.json')
const texts = local('texts.json')
for (const input of [...bindings.preservedInputs, ...bindings.contracts]) assert.equal(hash(input.path), input.sha256)
assert(!fs.existsSync(path.join(out, 'change-register.json')), 'Author this first batch once')
const changes = []
const proseFlowReports = []
for (const card of bindings.cards) {
  const authored = texts[card.alias]
  const nativeLesson = read(card.templates.find(t => t.name === 'lesson').nativePrepared.path)
  const nativeExercises = read(card.templates.find(t => t.name === 'exercises').nativePrepared.path)
  assert.equal(authored.prose.length, nativeLesson.prose.length)
  assert.equal(authored.exercises.length, nativeExercises.exercises.length)
  for (const language of ['zh', 'en']) {
    const folder = path.join(out, 'frozen', card.alias, language)
    const lessonPath = path.join(folder, 'lesson.template.json')
    const exercisesPath = path.join(folder, 'exercises.template.json')
    const lesson = read(lessonPath)
    const exercises = read(exercisesPath)
    assert.deepEqual(lesson, nativeLesson)
    assert.deepEqual(exercises, nativeExercises)
    lesson.authoring = {
      language, localized_title: texts.localizedTitles[card.alias][language],
      status: 'FIRST-AUTHOR-DRAFT-SCI-ZHEN-PENDING',
      localizedTitleIsNotAChangeToNativeIdentityFields: true,
      modernFigures: card.alias === 'n68' ? 'PENDING-FIG135-FIG136-NOT-OBSERVED' : 'NONE-SOURCE-EXERCISE-CARD',
    }
    exercises.authoring = { language, status: 'FIRST-AUTHOR-DRAFT-SCI-ZHEN-PENDING' }
    const applyText = (item, draft, target, sourceRefs) => {
      const source = item.source_text
      item.text = draft[language]
      const context = (card.alias === 't5' && target === 'exercises.exercises[2]') ||
        (card.alias === 't5' && target === 'exercises.exercises[4]') ||
        (card.alias === 'n68' && target === 'lesson.prose[25]')
      item.changes = item.text === source ? [] : [
        language === 'en' ? 'translation' : 'language',
        ...(item.text.includes('\n') || item.text.replace(/\s/g, '') === source.replace(/\s/g, '') ? ['layout'] : []),
        ...(context ? ['culture-context'] : []),
      ]
      item.numeric_changes = []
      item.historical_entities = []
      const holds = texts.holdTargets.filter(h => h.card === card.alias && h.target === target)
      if (holds.length) item.author_review = { status: 'HOLD-UNIT-SCI', pending_ids: holds.map(h => h.id) }
      changes.push({
        card: card.card, alias: card.alias, language, target, source_refs: sourceRefs,
        source_text: source, authored_text: item.text, changes: item.changes,
        sourceTextUnmodified: true, numeric_changes: [], formulaChangesAuthorizedOrApplied: false,
        status: holds.length ? 'HOLD-UNIT-SCI' : 'AUTHORED-INDEPENDENT-REVIEW-PENDING',
        pending_ids: holds.map(h => h.id),
      })
    }
    lesson.prose.forEach((item, index) => {
      assert.deepEqual(authored.prose[index].source_refs, item.source_refs)
      applyText(item, authored.prose[index], `lesson.prose[${index}]`, item.source_refs)
    })
    exercises.exercises.forEach((item, index) => {
      assert.equal(authored.exercises[index].number, item.number)
      applyText(item, authored.exercises[index], `exercises.exercises[${index}]`, item.pages)
      item.lines = item.text.split('\n')
    })
    const semanticTransitions = card.alias === 'n68' ? [
      { concept: 'definition', from: 'p0176#5', to: 'p0176#6' },
      { concept: 'distance-law', from: 'p0177#2', to: 'p0177#3' },
      { concept: 'incidence-angle', from: 'p0177#4', to: 'p0177#5' },
      { concept: 'measurement-and-context', from: 'p0179#2', to: 'p0179#3' },
    ] : []
    const outline = proseOutline(lesson.prose)
    lesson.section_breaks = semanticTransitions.map(({ from, to }) => {
      const fromIndex = lesson.prose.findIndex(b => b.source_refs.includes(from))
      const toIndex = lesson.prose.findIndex(b => b.source_refs.includes(to))
      const before = outline.filter(p => p.blockIndex === fromIndex).at(-1)
      const after = outline.find(p => p.blockIndex === toIndex)
      assert(before && after)
      assert.equal(after.index, before.index + 1)
      return { before: before.text, after: after.text }
    })
    fs.writeFileSync(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`)
    fs.writeFileSync(exercisesPath, `${JSON.stringify(exercises, null, 2)}\n`)
    const command = ['node', path.join(root, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', lessonPath]
    const proc = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
    const receiptDir = path.join(out, 'prose-flow', card.alias, language)
    fs.mkdirSync(receiptDir, { recursive: true })
    fs.writeFileSync(path.join(receiptDir, 'stdout.txt'), proc.stdout || '', { flag: 'wx' })
    fs.writeFileSync(path.join(receiptDir, 'stderr.txt'), proc.stderr || '', { flag: 'wx' })
    fs.writeFileSync(path.join(receiptDir, 'receipt.json'), `${JSON.stringify({
      command, exitCode: proc.status, sourceLesson: bound(lessonPath),
      stdout: bound(path.join(receiptDir, 'stdout.txt')), stderr: bound(path.join(receiptDir, 'stderr.txt')),
      notALessonRender: true, images: 0,
    }, null, 2)}\n`, { flag: 'wx' })
    assert.equal(proc.status, 0)
    const flow = JSON.parse(proc.stdout)
    assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), lesson.section_breaks)
    proseFlowReports.push({
      card: card.card, language, semanticTransitions,
      boundariesFromNativeProseFlow: flow.boundaries, paragraphCount: flow.paragraphs.length,
      report: bound(path.join(receiptDir, 'stdout.txt')), receipt: bound(path.join(receiptDir, 'receipt.json')),
    })
  }
}
const n68Source = read(bindings.cards[0].sourceLesson.path)
const unitDefinition = n68Source.prose.find(b => b.source_refs.includes('p0176#7'))
const fluxPerArea = n68Source.prose.find(b => b.source_refs.includes('p0176#6'))
const finalLaw = n68Source.prose.find(b => b.source_refs.includes('p0179#1'))
const unitEvidence = {
  fluxPerArea: { source_refs: fluxPerArea.source_refs, source_text: fluxPerArea.text },
  unitDefinition: { source_refs: unitDefinition.source_refs, source_text: unitDefinition.text },
  finalLaw: { source_refs: finalLaw.source_refs, source_text: finalLaw.text },
}
const pendingDecisions = texts.holdTargets.map(hold => ({
  ...hold, languages: ['zh', 'en'], candidateUnitChangeApplied: false,
  sourceCorrectionApplied: false, sourceErrataInvented: false,
  internalUnitEvidence: unitEvidence,
  reasoning: '本课明确把E定义为Phi/S，并把1流明均布在1平方米上的照度定义为1勒克斯。150/30与50/50/10都被题面或段落称为照度，所以仅以流明表示缺少每单位面积的含义。',
  proposedInterpretation: 'SCI应判断这些原数值的预期照度单位是否为勒克斯（lux，lx），而不是光通量单位流明（lumen，lm）。只提出单位解释，不据此改数值或源字节。',
  contractDisposition: '现有原生模板errata为空；本轮无新增源勘误授权。保持忠实source和候选的原单位，HOLD对应段/题，待SCI确认批准的现代层更正或明确说明路径，不能靠作者备注冒充已通过勘误门禁。',
  decisionNeeded: [
    '确认每个数值是否确实表示照度而不是另有面积条件的光通量。',
    '确认现代层是否可保留原数字并以勒克斯表述，及适用的源绑定更正合同。',
    '如不能在现有合同内安全说明，则维持HOLD；不能静默换单位或凭空登记source errata。',
  ],
  publicationBlockedUntilDecision: true,
}))
save('sci-pending.json', {
  schema: 'bounded-n68-t5-first-text-author-sci-pending@1',
  role: 'Author proposals, not independent SCI findings or approval',
  mandatoryUnitDecisions: pendingDecisions,
  generalReview: [
    { card: 'phy10-c2-s2-n68', status: 'PENDING-FIRST-INDEPENDENT-SCI', scope: '完整照度定义、点光源强度/距离/入射角关系、球面推导和小面/平行光近似、照度叠加及仪器术语；式6.4的全光通量关系沿用源文，适用条件未在作者稿中擅自补改。' },
    { card: 'phy10-c2-s2-t5', status: 'PENDING-FIRST-INDEPENDENT-SCI', scope: '全部7题的现象和条件，含第3题缝隙成画/倒影的原目标、第6题屏的位置与非垂直追问、第7题两处照度与反射光忽略条件；本轮不写解答。' },
  ],
  ZHEN: 'PENDING-FIRST-INDEPENDENT-BILINGUAL-REVIEW',
  images: [
    { card: 'phy10-c2-s2-n68', id: 'fig-135', status: 'PENDING-MODERN-FIGURE-WORKFLOW', sourceRAWDoesNotMeanModernPASS: true },
    { card: 'phy10-c2-s2-n68', id: 'fig-136', status: 'PENDING-MODERN-FIGURE-WORKFLOW', sourceRAWDoesNotMeanModernPASS: true },
  ],
  currentHygieneOrLightingStandardClaimed: false, allAnswersAndChoicesUnauthored: true,
  independentPASS: false, wholeCardPASS: false,
})
save('change-register.json', {
  schema: 'bounded-n68-t5-first-bilingual-text-change-register@1',
  ticket: 'STEMROBIN-181', role: 'First text author only',
  sourceBinding: bound(path.join(out, 'source-binding.json')), changes, proseFlowReports,
  sourceSnapshotPolicy: 'All source.data, source.sha256, source_text, source_refs/pages, original numbers/formulas/group identities remain exactly native-prepared.',
  unitPolicy: {
    pending: pendingDecisions, silentUnitReplacement: false,
    sourceFormulaOrNumericChangeApplied: false, approvedErrataClaimed: false,
  },
  culturalChanges: [
    {
      card: 'phy10-c2-s2-t5', target: 'exercises.exercises[2]', source_refs: ['p0179#13', 'p0180#1'],
      actorMapping: { originalProtagonist: '伊凡·伊凡诺维奇', authoredProtagonist: 'Alex' },
      removedLiteraryAttribution: 'Н. В. 果戈里及含伊凡·尼基弗罗维奇的小说题名仅作文学场景来源，不是科学史教学身份；现代层改为普通虚构场景，忠实source保留完整引文。',
      preserved: ['几扇百叶窗关闭', '黑暗房间', '阳光从百叶窗缝隙进入', '对墙的彩色/彩虹般图像', '屋顶、树木、院内晾衣', '倒置图像', '解释原因的原问题'],
      noNewAnswerOrFigure: true,
    },
    {
      card: 'phy10-c2-s2-n68', target: 'lesson.prose[25]', source_refs: ['p0179#4'],
      change: '去除“在我国”的国别当前指代，把150/30明确归为原书示例，不声称它们是现代卫生标准；单位保持原样并HOLD。',
    },
    {
      card: 'phy10-c2-s2-t5', target: 'exercises.exercises[4]', source_refs: ['p0180#3'],
      change: '把“按规定”改为本题给定/假定的照度要求，不宣称现行工作场所标准；1.1和50/50/10保持原值，原单位待SCI。',
    },
  ],
  proseFlowPolicy: 'Boundaries generated with the existing htmlfrag proseOutline and confirmed by prose_flow output; no paragraph-number counting or hand-wrapped spans.',
  nativeFigureTemplatesCopiedUnmodified: true, figureSpecsOrModernRendersAuthored: false,
  sourcePrepareAssembleAdaptPrepareFinalizeVectorizeRenderReplays: 0,
  newImages: 0, cumulativeImages: 24, independentPASS: false, wholeCardPASS: false,
})
console.log(JSON.stringify({ authoredCards: 2, languages: ['zh', 'en'], textItems: changes.length, proseFlowReports: proseFlowReports.length, unitHoldTargets: pendingDecisions.map(h => h.id), newImages: 0, cumulativeImages: 24 }, null, 2))
