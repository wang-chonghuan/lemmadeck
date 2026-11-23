import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n35-text-author7')
assert.equal(process.cwd(), repo, 'Use only the authorized checkout root')
assert.equal(path.dirname(fileURLToPath(import.meta.url)), owned)

const preparation = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n35/preparation7')
const templates = path.join(preparation, 'work/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n35')
const raw = path.join(preparation, 'artifacts/6-8g/lessons/geo68-c3-s2-n35')
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const readJson = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const bind = (filename) => {
  const bytes = fs.readFileSync(filename)
  return {
    path: filename,
    sha256: sha256(bytes),
    bytes: bytes.length,
    mode: (fs.statSync(filename).mode & 0o777).toString(8),
  }
}
const inputSpecs = [
  [path.join(raw, 'lesson.json'), '06daaf76cd0a2915fd089b563086ffb37fc7ce8545048d4fd9a3c9c7b1247ada'],
  [path.join(raw, 'exercises.json'), '6f8fe3ef2022c0bc446bd7f3a1214ce599db37c47351c4a37c44a1e387b436c3'],
  [path.join(raw, 'lesson.md'), '34146da0d102f0fdb07489ec0fa0be8bce1dd4e31aa2e62032e16b17099f656e'],
  [path.join(templates, 'lesson.template.json'), '72a51d2dc4d29c16ca642f12d315bb9b306274df897d54b4242264beb42c84b1'],
  [path.join(templates, 'exercises.template.json'), '607cc64aaa500d1614ccabb213e14d388fd0bda584f024724ffb2915efeed61e'],
  [path.join(templates, 'figures.template.json'), 'd7367c575cccec2b2c8b2db49be210d6ef8e831b4a71c9b28c8f9cdccc94df7b'],
]
const inputs = inputSpecs.map(([filename, expected]) => {
  const result = bind(filename)
  assert.equal(result.sha256, expected, `Input changed: ${filename}`)
  assert.equal(result.mode, '644', `Input mode changed: ${filename}`)
  return result
})

const lessonPath = path.join(owned, 'lesson.template.json')
const exercisesPath = path.join(owned, 'exercises.template.json')
const lesson = readJson(lessonPath)
const exercises = readJson(exercisesPath)
const originalLesson = readJson(path.join(templates, 'lesson.template.json'))
const originalExercises = readJson(path.join(templates, 'exercises.template.json'))
assert.deepEqual(lesson.source.data, readJson(path.join(raw, 'lesson.json')))
assert.deepEqual(exercises.source.data, readJson(path.join(raw, 'exercises.json')))
assert.equal(lesson.source.sha256, inputs[0].sha256)
assert.equal(exercises.source.sha256, inputs[1].sha256)
assert.equal(lesson.prose.length, 21)
assert.equal(lesson.prose.filter((block) => block.kind === 'p').length, 13)
assert.equal(exercises.count, 10)
assert.deepEqual(exercises.exercises.map((item) => item.number), Array.from({ length: 10 }, (_, i) => String(450 + i)))
assert.deepEqual(lesson.figures.map((item) => item.id), Array.from({ length: 5 }, (_, i) => `fig-${214 + i}`))
assert.deepEqual(fs.readFileSync(path.join(owned, 'figures.template.json')), fs.readFileSync(path.join(templates, 'figures.template.json')))

const formulaSpans = (text) => [...text.matchAll(/\$\$(.*?)\$\$|\$([^$]*)\$/gs)].map((match) => match[0])
const digits = (text) => text.match(/\d+/g) ?? []
const chineseNumbers = (text) => text.match(/[零一二两三四五六七八九十百千万亿]+/g) ?? []
const refs = (text) => [...text.matchAll(/(图|定理)\s*(\d+)|(\d+)\s*定理/g)]
  .map((match) => match[1] ? `${match[1]}${match[2]}` : `定理${match[3]}`)
const changes = []
const unchanged = []
const formulas = []

function compareDocument(filename, current, original, collection) {
  assert.deepEqual(Object.keys(current), Object.keys(original))
  for (const key of Object.keys(original).filter((key) => key !== collection && key !== 'section_breaks')) {
    assert.deepEqual(current[key], original[key], `${filename}: immutable ${key}`)
  }
  assert.equal(current[collection].length, original[collection].length)
  current[collection].forEach((item, index) => {
    const source = original[collection][index]
    const identity = collection === 'prose' ? item.source_refs : item.number
    const permitted = new Set(['text', 'changes', ...(collection === 'exercises' ? ['lines'] : [])])
    assert.deepEqual(Object.keys(item), Object.keys(source))
    for (const key of Object.keys(source).filter((key) => !permitted.has(key))) {
      assert.deepEqual(item[key], source[key], `${filename}: ${index} immutable ${key}`)
    }
    assert.deepEqual(formulaSpans(item.text), formulaSpans(item.source_text), `${filename}: ${index} exact source formulas`)
    assert.deepEqual(digits(item.text), digits(item.source_text), `${filename}: ${index} exact digit sequence`)
    assert.deepEqual(chineseNumbers(item.text), chineseNumbers(item.source_text), `${filename}: ${index} exact Chinese number sequence`)
    assert.deepEqual(refs(item.text), refs(item.source_text), `${filename}: ${index} source figure/theorem references`)
    assert.equal(item.numeric_changes.length, 0)
    assert.ok(!item.changes.includes('math-correction'))
    assert.ok(!/[\u0400-\u04ff]/u.test(item.text))
    assert.ok(!item.text.includes('UNKNOWN'))
    assert.ok(!/[、，；。？！：]/u.test(formulaSpans(item.text).join('')))
    assert.ok(!/<(?:span|div|p)\b/u.test(item.text))
    if (item.lines) assert.equal(item.lines.join('\n'), item.text)
    if (item.text === item.source_text) assert.equal(item.changes.length, 0)
    else assert.ok(item.changes.length > 0)
    const fields = Object.keys(item)
      .filter((key) => JSON.stringify(item[key]) !== JSON.stringify(source[key]))
      .map((key) => ({ field: key, before: source[key], after: item[key] }))
    if (fields.length) changes.push({ file: filename, identity, fields })
    else unchanged.push({ file: filename, identity })
    formulas.push({ file: filename, identity, exact_source_spans: formulaSpans(item.text) })
  })
}

compareDocument('lesson.template.json', lesson, originalLesson, 'prose')
compareDocument('exercises.template.json', exercises, originalExercises, 'exercises')
changes.push({
  file: 'lesson.template.json',
  identity: 'section_breaks',
  fields: [{ field: 'section_breaks', before: originalLesson.section_breaks, after: lesson.section_breaks }],
})

function run(command, args) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8' })
  assert.ifError(result.error)
  assert.equal(result.status, 0, result.stderr)
  return { command, args, cwd: repo, exit_code: result.status, stdout: result.stdout, stderr: result.stderr }
}

const nativeLayout = run(path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
  '-B', '-c',
  [
    'import sys,json',
    'from pathlib import Path',
    'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
    'from edition import normalize_prose_layout,normalize_numbered_subparts',
    'own=Path(".intentfold/tickets/STEMROBIN-188/tmp/n35-text-author7")',
    'lesson=json.loads((own/"lesson.template.json").read_text())',
    'exercises=json.loads((own/"exercises.template.json").read_text())',
    'rows=[("prose",b.get("source_refs"),b["text"],normalize_prose_layout(b["text"])) for b in lesson["prose"] if b["kind"]=="p"]+[( "exercise",e["number"],e["text"],normalize_numbered_subparts(e["text"])) for e in exercises["exercises"]]',
    'differences=[{"kind":kind,"target":target,"native":native} for kind,target,text,native in rows if text!=native]',
    'print(json.dumps({"prose_checked":13,"exercises_checked":10,"differences":differences},ensure_ascii=False))',
  ].join('; '),
])
assert.deepEqual(JSON.parse(nativeLayout.stdout).differences, [], 'Native layout must be stable')

const nativeFlow = run(process.execPath, [
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
  '--json', lessonPath,
])
const flow = JSON.parse(nativeFlow.stdout)
assert.equal(flow.paragraphs.length, 16)
assert.equal(flow.boundaries.length, 4)
assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), lesson.section_breaks)
const flowPath = path.join(owned, 'prose-flow.json')
fs.writeFileSync(flowPath, nativeFlow.stdout)

const conceptTransitions = [
  '两种射线方向的定义和记号 → 同方向关系的自反性、对称性、传递性',
  '同方向关系是等价关系 → 以同方向射线的集合定义方向',
  '方向的定义 → 定理 43：方向相反的射线的中心对称性',
  '定理 43 的证明及共线情形 → 中心对称射线方向相反的结论',
]
const record = {
  schema: 'stemrobin188/n35-modern-text-author-record@1',
  lesson: lesson.id,
  edition: lesson.edition,
  status: 'text-authored-independent-review-pending',
  cwd: repo,
  owned_path: owned,
  scope: { prose_records: 21, text_records: 13, exercise_numbers: exercises.exercises.map((item) => item.number), figure_ids: lesson.figures.map((item) => item.id) },
  inputs,
  outputs: ['lesson.template.json', 'exercises.template.json', 'figures.template.json', 'prose-flow.json', 'record-author.mjs'].map((filename) => bind(path.join(owned, filename))),
  exact_changes_from_native_templates: changes,
  unchanged_native_records: unchanged,
  source_formula_inventory: formulas,
  mechanical_evidence: {
    scope_and_source_snapshots_preserved: true,
    source_metadata_and_source_refs_preserved: true,
    exact_formula_spans_and_order_preserved: true,
    exact_numeric_sequences_preserved: true,
    figures_manifest_byte_identical: true,
    modern_text_cyrillic_count: 0,
    modern_text_unknown_body_count: 0,
    numeric_changes: 0,
    math_corrections: 0,
    native_layout: nativeLayout,
    native_flow: {
      ...nativeFlow,
      evidence: bind(flowPath),
      final_paragraphs: flow.paragraphs.length,
      boundaries: flow.boundaries.map((boundary, index) => ({ ...boundary, concept_transition: conceptTransitions[index] })),
      derivation: 'Copied adjacent before/after objects printed by prose_flow.mjs after matching native layout; no manually counted paragraph anchors.',
    },
    interpretation: 'Mechanical preservation and native text-flow evidence only; not an independent source or mathematical approval.',
    technical_recovery: {
      failed_command: 'node .intentfold/tickets/STEMROBIN-188/tmp/n35-text-author7/record-author.mjs',
      cwd: repo,
      exit_code: 1,
      first_failure: 'AssertionError: lesson.template.json: 14 source figure/theorem references; actual [定理43], expected [].',
      diagnosis: 'The checker recognized 定理 43 but not the source heading 43 定理. This was a reference-parser defect, not a source or mathematical verdict.',
      correction: 'Accept both native theorem-heading orders when comparing the preserved theorem number; no lesson/exercise/source content changed for this repair.',
    },
  },
  author_notes: [
    '正文保留全部定义、三项性质、方向集合、定理 43、定理 39 引用和原证明链；未扩写证明或添加新的数学断言。古旧措辞只作轻量中文现代化，始点改为起点。',
    '完整数字小问顺序和题号不变。452、453 的两组 a/b 分别对应各自的数字小问；459 的 a/б/в 顺序映射为 a/b/c。图 214、215、216 的分图正文引用统一使用 a/b；图文件和标签实现仍由父任务及独立图作者负责。',
    '455 的共同问句从最后一个情形前移到题干前缀，各条件和 455、1、2、3 的数字身份不变；没有补成所在直线、最多、至少、正多边形或其他未经来源授权的条件。',
    '453 的共同作图及符号要求独立成段，避免只归入最后一个 b 小问；454、456 的 bullet 以及 459 的星号公式保持原样。',
    '原始 lesson.json、lesson.md、exercises.json 与输入模板未修改，source.data、source_text、source.path、source.sha256、pages、source_refs、figures 和其他元数据完整保留。',
    '没有重新修复来源 163/164，没有读取父任务的冗余尝试；来源文字的正确性和既有修复的批准状态不由本作者认领。',
  ],
  historical_unknown_notes: [
    {
      category: 'shape',
      status: 'UNKNOWN-not-resolved-by-text-author',
      source_refs: ['p0165#6'],
      note: '只保留准备稿中凸四边形、凸五边形、凸六边形的原有形状条件；不从题号或旧标记推断额外图形、正多边形条件或最大值要求。具体原印刷措辞和可能的形状限定待独立来源复核。',
    },
    {
      category: 'alphabet',
      status: 'UNKNOWN-original-glyph-not-inspected',
      source_refs: ['p0161#9', 'p0162#5', 'p0163#3', 'p0164#9', 'p0164#10', 'p0165#6'],
      note: '准备稿字母 a 与西里尔 б、в 的序列身份按既有文化合同映射为拉丁 a、b、c；未查看扫描，不裁定视觉同形的原字母属于哪一种字母表。所有几何点字母和数学变量原样保留。',
    },
    {
      category: 'Unicode',
      status: 'UNKNOWN-original-codepoint-or-shape-not-inspected',
      source_refs: ['p0162#6', 'p0162#7', 'p0163#1', 'p0163#8'],
      note: 'uparrow、downarrow、alpha、alpha_1 及射线记法均逐个保持准备稿公式原串，尤其不合并传递性结论中的两个相邻数学区；不声称已核清原书 Unicode 或印刷符号形状。',
    },
    {
      category: 'dash',
      status: 'UNKNOWN-no-source-span-restored',
      source_refs: [],
      note: '本次指定的原始课文和模板没有提供需要恢复的明确 UNKNOWN 横线或破折号正文跨度；保留此历史未知状态，不补写原横线、破折号或猜测其数学含义。',
    },
    {
      category: 'marker',
      status: 'UNKNOWN-historical-marker-semantics-not-reviewed',
      source_refs: ['p0161#9', 'p0161#10', 'p0165#1', 'p0165#3', 'p0165#6'],
      note: '脚注 * 与 marked-question 公式 $454^{\\bullet}.$、$456^{\\bullet}.$、$459^{*}.$ 保留原样；不从标记猜测答案、难度规则或交互方式。历史符号的扫描形状、语义或位置未由本文字作者批准。',
    },
  ],
  review_requirements: [
    {
      scope: 'all raw-derived textual claims',
      status: 'independent-review-required',
      note: '定义、等价关系性质、方向集合、定理 43 及其证明、定理 39 引用、末尾结论和全部题面仍需独立来源/数学实质审查；哈希与布局检查不构成内容批准。',
    },
    {
      scope: 'exercise 459(1), p0165#6',
      status: 'mathematical-wording-ambiguity-reported-not-corrected',
      note: '只给出凸多边形的边数，互相平行的边的对数并不由这些条件唯一确定；不能默默将“有多少对”改为“最多有多少对”，也不能补成正多边形。按原稿保留问题，交独立审查判定原题意，不提供答案或候选数值。',
    },
    {
      scope: 'modern figures and downstream display',
      status: 'delegated-not-inspected',
      note: '仅保留 figures.template.json 的 ID、spec 路径和来源 PNG 哈希合同；本作者没有查看任何源图、现代图或显示截图，不声明图或显示通过。',
    },
  ],
  activity: {
    image_loads: 0,
    source_page_edits: 0,
    canonical_output_edits: 0,
    index_edits: 0,
    adapt_finalize_calls: 0,
    render_calls: 0,
    answers_choices_interactions_authored_or_inspected: 0,
    db_env_network_install_git_newworktree_chat_peer_actions: 0,
  },
}
const recordPath = path.join(owned, 'author-record.json')
fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`)
console.log(JSON.stringify({
  status: record.status,
  prose_records: 21,
  text_records: 13,
  exercises: 10,
  figures: 5,
  native_final_paragraphs: flow.paragraphs.length,
  resolved_breaks: flow.resolvedBreaks,
  changed_native_records: changes.length - 1,
  formula_spans_preserved: formulas.reduce((total, row) => total + row.exact_source_spans.length, 0),
  image_loads: 0,
  outputs: record.outputs,
  author_record: bind(recordPath),
}, null, 2))
