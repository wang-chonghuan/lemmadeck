import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const base = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const retained = path.join(base, 'evidence/reports/d646-active-stages/d644-source210-first-preparation/work/10p/pages/0210')
const out = path.join(base, 'tmp/d663-source210-reconstruction')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const dest = path.join(root, '10p/pages/0210')
const prepared = path.join(work, '10p/pages/0210')
assert.equal(fs.existsSync(path.join(out, 'report.json')), false)
fs.mkdirSync(dest, { recursive: true })
fs.mkdirSync(prepared, { recursive: true })
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  fs.copyFileSync(path.join(retained, name), path.join(prepared, name))
}
const template = fs.readFileSync(path.join(retained, 'page.template.md'), 'utf8')
const metadata = JSON.parse(template.split('---')[1])
metadata.printed_page = 200
metadata.printed_lines = 23
metadata.notes = [
  'Reconstructed after the external archive from the retained source210 grid and one top detail, not recovered from the lost d645 manuscript.',
  'p cont joins accepted source209 p0209#8, ending 特殊, to 的肌肉7. This local page ends the paragraph on accommodation near point, but n79 remains open beyond this page.',
  'Twenty-one printed body rows, one figure caption and one footer row total23. Figure185 intervenes between the open paragraph ending 就 and its continuation 增大.',
  'Bold source terms retained from these pixels: 玻璃体, 网状膜, 视网膜, 杆状, 锥状, 眼的调节 and 调节近点. No modern optical or anatomical corrections enter the raw text.',
  'Figure185 source inventory: two upright object extents at different distances, upper and lower light paths entering the eye, two angular arcs labelled phi2 and phi1, ray arrows, and the eye cross-section. These are original pixels, not a modern construction.',
  'Footer ornamental dots are retained textually as centered dots. No exercises, headings, source tables or new numbered lesson start appear.',
]
const body = `
<!-- p cont -->
的肌肉 $7$ 在一定的范围内可以改变晶状体的形状，在观察近物
体时，使晶状体变得更凸一些. 以上未谈到的眼睛的直到后
壁（眼底）的部分是透明的半液体状**玻璃体** $8$. 眼底被复杂的
**网状膜** $9$（**视网膜**）覆盖. 视网膜是末端为**杆状**和**锥状**视神经
$10$ 的分支. 杆状体和锥状体是感光基本单位.

<!-- p -->
入射到眼睛的光线最大的折射发生在角膜表面. 晶状体
实现不大的补充折射. 从整体上可以把眼睛的光学系统看作
是具有可变焦距和不变“象距”（透镜到屏幕的距离）的会聚透
镜. 视网膜是“屏幕”，在其上形成所观察物体的倒立的实像.
入射光线对神经末梢（杆状和锥状细胞）的刺激引起我们的
视觉.

<!-- p open -->
如果物体很远，在正常眼睛的视网膜上获得像时晶状体
肌肉不紧张. 当物体接近时，就发生晶状体的压缩和眼睛焦
距的减小，使成像平面与视网膜重新重合. 这是用改变晶状
体曲率的肌肉的反射性紧张来达到的. 眼睛对于被观察的物
体的距离变化的这种适应性叫做**眼的调节**. 随着向物体的靠
近，我们能分辨物体相邻两个点的角度，即视角 $\\varphi$（图 185）就

<!-- fig 图 185 box 185,1455,1110,214 -->
![图 185](figures/fig-185.png)

<!-- cap 图 185 -->
图 185

<!-- p cont -->
增大. 当这个角变得大于 $1$ 分时，两个点的像就落在不同的
神经末梢上，我们看到的是两个分开的点. 但是，把物体移到
离眼睛很小的距离处来观察物体的细小局部是没有意义的，
因为眼睛的调节有一个限度，叫做**调节近点**.

<!-- foot -->
· 200 ·
`
fs.writeFileSync(path.join(dest, 'page.md'), `---\n${JSON.stringify(metadata, null, 2)}\n---\n${body}`)
const commands = []
for (const [verb, extra] of [['finalize', ['--page', '210']], ['vectorize', ['--page', '210']]]) {
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb,
    '--book', '10p', ...extra, '--root', root, '--work', work,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
  write(path.join(out, `${verb}-receipt.json`), receipt)
  commands.push(receipt)
  if (result.status !== 0) {
    write(path.join(out, 'report.json'), {
      status: 'NATIVE-EXECUTION-FAIL-NOT-SOURCE-APPROVAL', commands,
      oldLostReview: 'd658 source210 observation retained, missing manuscript not treated as recovered',
      parentImagesThisBatch: 2, canonicalWrites: false,
    })
    process.exit(1)
  }
}
const files = []
for (const folder of [dest, path.join(prepared, 'figures')]) {
  for (const name of fs.readdirSync(folder)) {
    const file = path.join(folder, name)
    if (fs.statSync(file).isFile()) files.push({ path: file, sha256: hash(file) })
  }
}
write(path.join(out, 'report.json'), {
  ticket: 'STEMROBIN-181', book: '10p', sourcePage: 210,
  status: 'RECONSTRUCTED-AUTHOR-NATIVE-ONLY-INDEPENDENT-MATCH-REVIEW-PENDING',
  priorLostReportSha256: '226054472f466877e5a904dbefe05ca80ea2ceef982b88190aec14cd345f2326',
  priorObservationsNotAutomaticallyReapproved: true,
  nativeCommands: commands.map(({ command, exitCode }) => ({ command, exitCode })),
  retainedSource: { path: path.join(retained, 'page.png'), sha256: hash(path.join(retained, 'page.png')) },
  files, parentImagesThisBatch: 2, sourcePagesAdded: 0, completeCardsAdded: 0,
  canonicalWrites: false, paidCalls: 0, databaseWrites: false,
})
console.log(JSON.stringify({ report: path.join(out, 'report.json'), files }, null, 2))
