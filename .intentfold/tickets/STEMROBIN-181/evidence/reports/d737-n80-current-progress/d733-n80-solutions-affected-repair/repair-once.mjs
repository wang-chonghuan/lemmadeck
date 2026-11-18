import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const original = path.join(tmp, 'd720-n80-text-only-derived-solutions/solutions.json')
const out = path.join(tmp, 'd733-n80-solutions-affected-repair')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const document = JSON.parse(fs.readFileSync(original, 'utf8'))
const prior = structuredClone(document)
const replacements = {
  4: {
    displayAnswerZh: '头像清晰时，胶片放在人的像平面上。更远的森林所成的实像更靠近物镜，所以森林的光在胶片上形成模糊斑。\n\n作图时，先画会聚透镜、主光轴和固定的胶片平面，在人和更远的森林上各选一个不在主光轴上的物点。从每个物点画一条平行主光轴的光线，折射后通过另一侧焦点；再画一条通过光心、方向不变的光线。人的两条光线在胶片上相交，森林的两条光线在透镜与胶片之间相交，然后散开，在胶片处成为光斑。\n\n要使森林清晰，把物镜向胶片移动，减小物镜到胶片的距离，直到森林的像点落在胶片上。此时人的光线会在胶片后方才相交，头像不再精确合焦。在题目的理想化模型中头像会变模糊，实际模糊程度还取决于景深。',
    displayAnswerEn: 'With the portrait in focus, the film lies in the person\'s image plane. The more distant forest forms its real image closer to the objective, so its light makes blur spots on the film.\n\nDraw a converging lens, its optical axis and the fixed film plane, then choose one off-axis object point on the person and one on the farther forest. From each point, draw an axis-parallel ray that refracts through the far focus and a ray through the optical center that keeps its direction. The person\'s rays meet on the film, while the forest\'s rays meet between the lens and film and then spread into a spot at the film.\n\nMove the objective toward the film, reducing the lens-to-film distance until the forest\'s image point lies on the film. The person\'s rays then meet beyond the film, so the portrait is no longer in exact focus. It becomes blurred in the idealized model, while the practical amount of blur also depends on depth of field.',
  },
  11: {
    displayAnswerZh: '用 $F>0$ 表示焦距的大小，发散透镜的有符号焦距是 $-F$。光源到透镜的距离为 $F$，由薄透镜公式得到 $\\frac{1}{f}=\\frac{1}{-F}-\\frac{1}{F}=-\\frac{2}{F}$，所以有符号像距是 $f=-F/2$。负号说明像是虚像，位于光源同侧，距透镜为焦距大小的一半。\n\n光源在主光轴上时，平行主光轴的光线和通过光心的光线重合，不能靠它们的交点作图。先按算出的距离在主光轴上标出虚像点，再从光源向透镜上方和下方各一个靠近光轴的点画入射光线。每条出射光线都远离光轴张开，它的反向延长线经过已标出的虚像点，实际光线不在那里会聚。\n\n这也能检查光线的方向：若上方光线在透镜处离光轴的高度为 $h$，它的入射斜率为 $h/F$，出射斜率为 $2h/F$，反向延长就会在距透镜 $F/2$ 处与光轴相交。斜率表示每前进一段水平距离时高度改变的比，上下两条光线给出同一个像点。图可以左右镜像，但距离和像在光源同侧的结论不变。',
    displayAnswerEn: 'Let $F>0$ be the magnitude of the focal length, so the diverging lens has signed focal length $-F$. The source is a distance $F$ from the lens, and the thin-lens equation gives $\\frac{1}{f}=\\frac{1}{-F}-\\frac{1}{F}=-\\frac{2}{F}$, hence signed image distance $f=-F/2$. The negative sign means a virtual image on the source side, at half the focal-length magnitude from the lens.\n\nBecause the source is on the axis, its axis-parallel ray and optical-center ray coincide and cannot locate the image by an intersection. First mark the image point at the calculated distance on the axis, then draw incoming rays from the source to two small nonzero heights on the lens, one above and one below the axis. Each outgoing ray spreads away from the axis with a backward extension through the marked image point, where the actual rays do not converge.\n\nThe directions can also be checked: for a ray reaching the lens at height $h$ above the axis, its incoming slope is $h/F$ and its outgoing slope is $2h/F$, so its backward extension meets the axis a distance $F/2$ from the lens. Slope means the change in height per horizontal distance, and both rays locate the same image point. Mirroring the diagram left to right changes neither the distance nor the source-side location.',
  },
  12: {
    displayAnswerZh: '箭尾在物体一侧主光轴上的二倍焦距处，它的像在透镜另一侧主光轴上的二倍焦距处。先直接按这个对应关系标出箭尾的像，不用两条重合的轴上光线假装确定交点。\n\n从实际所画箭尖画一条平行主光轴的光线，折射后通过另一侧焦点；再画一条通过光心、方向不变的光线。它们的交点是箭尖的像，连接箭尾和箭尖的像点，就得到箭头的像。箭尖若恰好也在轴上，应按它自己的物距用薄透镜公式确定轴上像点。\n\n像的倾斜方向必须跟随实际所画的短箭头，不能只凭箭尾的位置猜定。在箭头各点仍位于物体一侧焦平面外的通常构图中，整个像是有限的倒立实像。只有箭尾给出了二倍焦距的位置，不能据此把整个倾斜箭头都画成等大，或把所有像点都放在同一个二倍焦距平面。',
    displayAnswerEn: 'The tail is on the axis at twice the focal length on the object side, so its image is on the axis at twice the focal length on the opposite side of the lens. Mark the image tail directly using this relation, rather than pretending that two coincident axial rays locate an intersection.\n\nFrom the tip of the actual drawn arrow, draw an axis-parallel ray that refracts through the far focus and a ray through the optical center that keeps its direction. Their intersection is the image tip, and joining the image tail and tip gives the image arrow. If the tip is also on the axis, use its own object distance in the thin-lens equation to locate its axial image point.\n\nThe image tilt must follow the actual short arrow drawn, rather than being guessed from the tail\'s position. In the usual construction where every object point stays outside the source-side focal plane, the whole image is finite, real and inverted. Only the tail has the specified twice-focal-length position, so this does not make the entire tilted image equal in size or put every image point in one twice-focal-length plane.',
  },
}
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
for (const [exercise, values] of Object.entries(replacements)) {
  const answer = document.answers.find((item) => item.exercise === exercise)
  assert.ok(answer)
  Object.assign(answer, values)
}
for (const answer of document.answers) {
  if (!(answer.exercise in replacements)) assert.deepEqual(answer, prior.answers.find((item) => item.exercise === answer.exercise))
}
document.status = 'THREE-CONSTRUCTION-FINDINGS-REPAIRED-AFFECTED-REVIEW-PENDING'
document.affectedRepair = {
  original: { path: path.relative(repo, original), sha256: sha(original) },
  firstReview: { path: '.intentfold/tickets/STEMROBIN-181/tmp/d724-n80-derived-solutions-first-review/review.md', sha256: sha(path.join(tmp, 'd724-n80-derived-solutions-first-review/review.md')) },
  exercises: ['4', '11', '12'], imageOpens: 0, nativeAnswerFinalize: false,
  task2DATAHOLDUnchanged: true, tasks1And8FigurePendingUnchanged: true,
}
const file = path.join(out, 'solutions.json')
fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: document.status, path: path.relative(repo, file), sha256: sha(file), affected: document.affectedRepair }))
