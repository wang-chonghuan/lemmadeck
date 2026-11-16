import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const seedPath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-t6-choice-seed.json'
const draftPath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-t6-choice-draft.json'
const helperPath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-t6-choice-author.mjs'
const freezePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-t6-choice-author-freeze.json'
const expectedSeedDigest = '93e8c2dcc6a3535d6461982bca833c135b07576c580b6f8c2ad6e746f7ff0df4'
const expectedSeedBytes = '2a19c54aea0372b76f237ce49ce93086d0cf8d563b0e9f54b812a53b7e6fc1ed'
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: sha(fs.readFileSync(file)) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }

// These full seed solutions were recorded before the separate option draft.
const independentSolutions = [
  {
    source_number: '3',
    source_solution: '只使用题设的浸润事实，不调用材料常识或焊接答案。锡要在金属表面形成所需接触，浸润是题目所问的必要条件；题设满足者恰为铜、银、黄铜，不锈钢、铝、铬不满足。这个集合并不保证实际焊接成功，也不推广到其他温度、氧化层或表面处理条件。',
    decisive_inference: '把题设给出的浸润分类映射为必要条件集合，而非推断充分焊接能力。',
  },
  {
    source_number: '5',
    source_solution: '设油脂溶液的表面张力系数为 σ_o，纯汽油为 σ_p，题设给定 σ_o>σ_p。仅在题设连通液膜模型中，把先浸润处视为纯汽油占优的低张力区，其余油脂溶液区为高张力区。沿液面取向外坐标 s，小段液膜两端的切向张力合力方向由 dσ/ds 决定：高张力端拉力较大，表面迁移从低 σ 指向高 σ。从中心形成低 σ 区而外侧保留高 σ 区，梯度向外，故有利于向外迁移；若低 σ 区先在边缘，梯度指向内侧，不产生所求的向外趋势。这是表面梯度的理想理论判断，不是真实汽油去污建议，也不证明复杂织物中的全部流动。',
    decisive_inference: '区分表面张力系数梯度的方向与低/高张力区域的位置，完整确定位置和迁移依据。',
  },
  {
    source_number: '7',
    source_solution: '油滴与外液密度相等，静水压梯度相同。对固定体积的油滴，重力与外液浮力的形状效应相抵，不等于重力消失，也不意味着界面张力为零。互不相溶、均匀正界面张力、无壁接触、静止平衡时，界面能随面积增大，固定体积下球面面积最小，因此单个油滴呈球形。这里仅分析普拉托历史实验的理想模型，不声称进行了真实实验。',
    decisive_inference: '在密度匹配消除形状的净重力偏好后，由界面面积极小决定形状。',
  },
  {
    source_number: '8',
    source_solution: '采用显式的两部分能量近似：表面能 E_s=σS，σ>0 在比较范围内不变，另一部分是热运动能量，且热容为正。若各小球滴体积为 V_i，单滴面积为 (36π)^(1/3)V_i^(2/3)。合并后体积 ΣV_i，因至少两滴有正体积，(ΣV_i)^(2/3)<ΣV_i^(2/3)，总面积与表面能均减少。系统孤立、质量不变、其他能量变化忽略且比较运动平息后的状态，ΔE_total=0，所以 ΔU_thermal=-ΔE_s>0；初温相同而热容为正，最终温度升高。不能把 Q=0误读为温度不变，也不能把这个模型推广为有能量流向环境的实测结论。',
    decisive_inference: '把面积减少、表面能减少和孤立总能量守恒联成一个热运动能量及温度判断。',
  },
  {
    source_number: '9',
    source_solution: '半径为 r 的薄膜球形肥皂泡有内、外两个界面，理想拉普拉斯压差是 p_in-p_out=4σ/r，而不是单界面的 2σ/r。同一外压、同一固定 σ 下，r_small<r_large 导致 p_small>p_large，空气从小泡流入大泡。按持续成立的球泡准静态模型，小泡缩小、大泡增大，半径差不会自行消失；若存在两个有限半径的连通静止平衡，等压要求 1/r_small=1/r_large，即半径相等，因而不等半径不能成为所述静止终态。该理想趋势延续到小泡消失的极限或薄膜、球形、恒定张力等模型假设失效；不给出流量、时间或大小。原题的成人指导实验与实际观察记录仍保留，不由理论选项代替，也不编造做过实验。',
    decisive_inference: '同时判断两界面的系数、初始流向与不等半径状态不能达到静止平衡的后续趋势。',
  },
  {
    source_number: '10',
    source_solution: '完全浸润时 cosθ=1，同一均匀毛细管的半径 r 和当地 g 相同，静止平衡满足 2σ/(r)=ρgh，即 h=2σ/(ρgr)。令 a 为酒精、w 为水，题设 h_a=55毫米、h_w=146毫米，两者比值无须额外单位换算。h_a/h_w=(σ_a/σ_w)(ρ_w/ρ_a)，所以 ρ_a/ρ_w=(146/55)(σ_a/σ_w)，或 ρ_a=(146σ_a/(55σ_w))ρ_w。若不给匹配温度与酒精组成的 σ_a、σ_w 及水密度 ρ_w，无法唯一给出酒精的数值密度。完全浸润只决定接触角因子，不推出两种液体张力相等；高度较低也不单独推出密度较高。',
    decisive_inference: '保留55/146这一高度比，正确消去管径并同时判断数值数据是否充分。',
  },
]

const unconvertedTasks = [
  { source_number: '1', reason: '主会话明确保留为开放举例任务；有限选项不能代表自主举例。未读取不在白名单中的正文。' },
  { source_number: '2', reason: '主会话明确保留实际实验任务；选择题不能证明操作或真实观察。未读取不在白名单中的正文。' },
  { source_number: '4', reason: '主会话明确保留开放解释任务；未将自由论证改为有限候选句。未读取不在白名单中的正文。' },
  { source_number: '6', reason: '主会话明确保留开放解释任务；不按题数或答案槽强行转换。未读取不在白名单中的正文。' },
  { source_number: '11', reason: '主会话说明边界条件未指定；未补造条件或键控唯一答案。未读取不在白名单中的正文。' },
]

function digest(file) {
  const r = spawnSync('python3', ['-B', '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'digest', file],
    { env, encoding: 'utf8', maxBuffer: 1024 * 1024 })
  assert.equal(r.status, 0, r.stderr)
  return r.stdout.trim()
}

assert.equal(bind(seedPath).sha256, expectedSeedBytes, 'Preserve the selected native seed.')
assert.equal(digest(seedPath), expectedSeedDigest)
const seed = read(seedPath)
assert.deepEqual(seed.exercises.map(e => e.number), ['3', '5', '7', '8', '9', '10'])
assert.deepEqual(seed.concepts, [])
assert.deepEqual(seed.figures, [])
assert.equal(process.argv[2], 'freeze', 'This helper only freezes a manually authored draft; it never generates options.')
assert(!fs.existsSync(freezePath), 'Run the structural command once; do not overwrite its evidence.')
const draft = read(draftPath)
assert.equal(draft.seed_sha256, expectedSeedDigest)
for (const solution of independentSolutions) {
  const question = draft.questions.find(q => q.source_numbers.includes(solution.source_number))
  assert(question)
  assert.equal(question.intent.source_solution, solution.source_solution, 'Preserve the solution recorded before options.')
}

const command = ['python3', '-B', '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', '.', '--seed', seedPath, '--draft', draftPath]
const result = spawnSync(command[0], command.slice(1), { env, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
const evidence = {
  ticket: 'STEMROBIN-181',
  lesson: seed.source.lesson,
  status: result.status === 0 ? 'author-frozen-structural-pass-independent-semantic-review-pending' : 'author-frozen-structural-blocked',
  bindings: {
    seed: { ...bind(seedPath), canonical_sha256: expectedSeedDigest },
    draft: { ...bind(draftPath), canonical_sha256: digest(draftPath) },
    helper: bind(helperPath),
    originalProjectionTrace: seed.trace,
  },
  structuralCommand: {
    argv: command, cwd: process.cwd(), exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    runs: 1, reviewArgumentSupplied: false,
  },
  selectedSourceNumbers: ['3', '5', '7', '8', '9', '10'],
  conceptBlocks: [],
  newFigures: [],
  independentSolutionsRecordedBeforeOptionDraft: independentSolutions,
  unconvertedTasks: unconvertedTasks.map(t => ({ ...t, taskRetainedReadOnly: true, basis: 'Direct human whitelist/continuation instruction, not answer or history lookup.' })),
  retainedSelectedTaskParts: [
    { source_number: '9', retained: '成人指导下的实际实验及理论/实际观察分开记录；选择题仅覆盖理论预测。' },
    { source_number: '10', retained: '物性资料未给定时的条件性数值密度任务；只键控符号关系与资料不足判断，不补造数值。' },
  ],
  capacityStatement: 'Six selected-seed recognition questions, not evidence of independent written production, real experiments, all eleven original tasks being converted, or whole-card completion.',
  questionModes: draft.questions.map(q => ({ id: q.id, mode: q.view.mode, sources: q.source_numbers })),
  independentSemanticReview: { owner: 'Main', status: 'pending', authorSelfReviewRecorded: false },
  sourceAndSeedEdited: false,
  answersLegacyChoicesInteractionsKeyboardArtifactsConsulted: false,
  sourceExerciseStatusChanged: false,
  DBAppDependenciesDurablePromotionOrBrowserActions: false,
  modelCalls: 0,
  inFlightProcesses: [],
}
fs.writeFileSync(freezePath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ freeze: bind(freezePath), draft: evidence.bindings.draft,
  structuralCommand: evidence.structuralCommand, status: evidence.status }, null, 2))
if (result.status !== 0) process.exitCode = 1
