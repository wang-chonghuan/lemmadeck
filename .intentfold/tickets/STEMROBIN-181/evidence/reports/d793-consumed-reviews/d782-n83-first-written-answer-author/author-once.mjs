import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const output = path.join(ticket, 'tmp/d782-n83-first-written-answer-author')
const input = path.join(ticket, 'tmp/d769-n83-citation-label-affected-repair/candidates')
const preparation = path.join(ticket, 'tmp/d747-source225226-consume-prepare83')
const card = 'phy10-c2-s3-n83'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  assert.ok(file.startsWith(`${output}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
}
const standards = {
  zh: [
    "以真空为参照时，光的折射率表示真空光速与该材料中同一种频率光的相速度之比，即 $n=\\frac{c}{v}$。相速度是光波中相同振动阶段向前推进的速度。比较时要固定材料的状态和光的频率；不同颜色在材料中可以有不同的折射率。对于原书讨论的普通透明玻璃，折射率越大，这种光的相速度越小。",
    "应该透过绿色玻璃看红色的“优”。在白光照明、白纸和普通彩色铅笔的近似条件下，绿色玻璃主要让绿光通过；白纸反射的绿光能通过，看起来较亮，而红色铅笔痕迹反射的绿光较少，看起来较暗，因此字与纸之间的对比明显。左边绿色的“良”与纸返回的绿光都较多，透过绿色玻璃时较难区分。若用红色玻璃，红字和白纸返回的红光都能较多地通过，红色“优”与纸之间的明暗对比反而较小。真实铅笔和玻璃不是理想的单色器件，结论说的是主要的反射和透射趋势。",
    "这里考虑含有多种颜色的白光。棱镜让不同颜色受到不同程度的折射，每种颜色都形成一个有一定宽度的光束像。入射束很窄时，各种颜色的像也较窄，彼此重叠较少，较容易看出清楚分开的光谱；入射束较宽时，各色的宽像在中间大量重叠，多种颜色混合起来接近白光，而边缘处有些颜色缺少或较少，才显出彩色。分开到什么程度还取决于棱镜的色散、入射束宽度、光学装置和屏幕距离，并不是任何窄光束都必然完全分开。",
  ],
  en: [
    "With vacuum as the reference, the refractive index is the ratio of the speed of light in vacuum to the phase velocity of light of the same frequency in the material: $n=\\frac{c}{v}$. Phase velocity describes the advance of the same stage of a light-wave vibration. The material's state and the light's frequency must be fixed for the comparison; different colours can have different indices in a material. For the ordinary transparent glass discussed in the source, a larger index means a smaller phase velocity for that light.",
    "Use the green glass to view the red '优' ('Excellent') mark. Under white illumination, with white paper and ordinary coloured pencils as an approximate model, the green glass mainly transmits green light. The paper returns appreciable green light and looks relatively bright, whereas the red pencil mark returns less green light and looks darker, giving clear contrast. The green '良' ('Good') mark to its left and the white paper both return more green light, so they are harder to distinguish through the green glass. Through red glass, the red '优' mark and white paper both return red light that can pass, so their brightness contrast is smaller. Real pigments and glass are not perfectly monochromatic filters; these are their main reflection and transmission tendencies.",
    "The question concerns white light containing many colours. A prism refracts different colours by different amounts, and each colour forms a beam image with some width. A very narrow incident beam produces relatively narrow colour images with less overlap, making a separated spectrum easier to see. With a wide beam, broad colour images overlap strongly in the middle, where the mixture is close to white; near the edges some colours are absent or weaker, so colour is visible there. The achievable separation also depends on prism dispersion, beam width, the optical arrangement, and screen distance, rather than every narrow beam being guaranteed complete separation.",
  ],
}
const packets = []
for (const locale of ['zh', 'en']) {
  const root = path.join(output, locale, 'root')
  const work = path.join(output, locale, 'work')
  const edition = path.join(root, '10p/editions/modern-us-neutral/lessons', card)
  const exerciseInput = path.join(input, locale, card, 'exercises.template.json')
  const lessonInput = path.join(input, locale, card, 'lesson.template.json')
  const exercises = read(exerciseInput)
  assert.deepEqual(exercises.exercises.map((item) => item.number), ['1', '2', '3'])
  assert.ok(exercises.exercises.every((item) => !item.figure_refs.length))
  copy(exerciseInput, path.join(edition, 'exercises.json'))
  copy(lessonInput, path.join(edition, 'lesson.json'))
  copy(path.join(preparation, 'work/adapt/10p/modern-us-neutral/lessons', card, 'figures.template.json'), path.join(edition, 'figures.json'))
  copy(path.join(preparation, 'root/10p/book.json'), path.join(root, '10p/book.json'))
  const captured = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/answers.json')
  if (fs.existsSync(captured)) copy(captured, path.join(root, '10p/answers.json'))
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'prepare', '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card, '--root', root, '--work', work]
  const native = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  save(path.join(output, locale, 'prepare.receipt.json'), { command, cwd: repo, exitCode: native.status, stdout: native.stdout, stderr: native.stderr })
  assert.equal(native.status, 0, native.stderr)
  const template = path.join(work, '10p/modern-us-neutral/lessons', card, 'answer-keys.template.json')
  const document = read(template)
  assert.equal(document.answers.length, 3)
  document.answers.forEach((answer, i) => {
    assert.equal(answer.prompt, exercises.exercises[i].text)
    assert.equal(answer.figureEvidence.length, 0)
    assert.equal(answer.source, 'derived', 'A captured answer would need separate comparison before authoring')
    answer.grading = 'ungraded'
    answer.displayAnswer = standards[locale][i]
    answer.parts = []
    answer.notes = 'Source provides no captured answer. This is a text-derived standard for open explanation, not an automatically graded key.'
  })
  document.locale = locale
  document.authoring = { status: 'FIRST-DERIVED-STANDARDS-INDEPENDENT-REVIEW-PENDING', images: 0, paidCalls: 0, wholeCardApproved: false }
  const candidate = path.join(output, locale, 'answer-keys.json')
  save(candidate, document)
  packets.push({ locale, exerciseInput: bind(exerciseInput), lessonInput: bind(lessonInput), nativeTemplate: bind(template), candidate: bind(candidate), questions: 3, figureEvidence: 0 })
}
save(path.join(output, 'author-freeze.json'), {
  status: 'FIRST-BILINGUAL-WRITTEN-STANDARDS-AUTHOR-FROZEN',
  ticket: 'STEMROBIN-181', card, packets, sourceQuestions: 3,
  actualImages: 0, paidCalls: 0, nativePrepareCalls: 2,
  answerSource: 'derived', grading: 'ungraded', parts: 0,
  pending: ['independent SCI answer review', 'native answer finalize', 'interaction finalize', 'DISPLAY'],
  sourceAndLessonReviewsReplayed: false, figureGateApproved: false, wholeCardApproved: false,
})
console.log(JSON.stringify({ status: 'ANSWER-AUTHOR-FROZEN', packets, paidCalls: 0, images: 0 }))
