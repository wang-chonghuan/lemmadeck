import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const retained = path.join(tmp, 'd671-source213214-first-preparation/work/10p/pages')
const out = path.join(tmp, 'd673-source213214-first-author')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
fs.mkdirSync(out, { recursive: true })
assert.equal(fs.existsSync(path.join(out, 'report.json')), false)
const bodies = {
  213: `
<!-- p -->
人们把通过光学仪器观察物体时的视角与用肉眼观察时
的视角之比作为光学仪器的特征——**角放大率**.

<!-- p -->
肉眼看物体时的视角（图 188）等于
$\\varphi=\\frac{h}{d_0}$ （6.20）↵
其中 $d_0=25$ 厘米，是明视距离，$h$ 是物体的线尺寸.

<!-- fig 图 188 box 448,570,192,511 -->
![图 188](figures/fig-188.png)

<!-- cap 图 188 -->
图 188

<!-- fig 图 189 box 875,674,210,383 -->
![图 189](figures/fig-189.png)

<!-- cap 图 189 -->
图 189

<!-- p -->
在观察细小物体时增大视角的最简单的方法是利用**放大
镜**. 会聚透镜或者焦距 $F$ 小的（一般不超过 $10$ 厘米）的透
镜组叫做**放大镜**. 通常把放大镜移得靠近眼睛，而物体放在
它的焦平面上. 这样，物体上的任何点发出的光线从放大镜
发射出来以后形成平行的光束（图 189）. 因此，在视网膜上
得到了点的清楚的像，而眼睛不紧张. 从放大镜中看到物体
的视角
$\\varphi_1=\\frac{h}{F}$↵

<!-- p open -->
求出放大镜的角放大率，

<!-- foot -->
· 203 ·
`,
  214: `
<!-- p cont -->
$\\Gamma=\\frac{\\varphi_1}{\\varphi}$ （6.21）↵

<!-- p -->
为此我们把对于 $\\varphi_1$ 和 $\\varphi_2$ 的等式代入上式：
$\\Gamma=\\frac{h/F}{h/d_0}=\\frac{d_0}{F}$ （6.22）↵

<!-- p -->
移动物体使之比焦平面更近，这时的放大率比物体位于
焦平面上时增加不大，但这样眼睛就紧张了.

<!-- p -->
**显微镜**　放大镜的放大率是有限的，因为直径小的透镜
才有很小的焦距，而用这种透镜是很困难的. 大的放大率需
要再用一个透镜来获得. 这个透镜叫做**物镜**. 物镜给出物体
的放大实像，然后再用叫做**目镜**的放大镜来观察这个实像，这
样组合的光学仪器叫做**显微镜**.

<!-- p open -->
为了获得物体放大的实像，把物体放在物镜焦点和两倍
焦距的点之间，用目镜观察时，需要把目镜这样安置，使物镜所
成的像在目镜的焦平面上. 这样从目镜中观察时眼睛就不紧

<!-- fig 图 190 box 222,1289,1091,274 -->
![图 190](figures/fig-190.png)

<!-- cap 图 190 -->
图 190

<!-- p cont -->
张了. 在显微镜里，光路如图 190 所示. 图中所画的两条光线
是从物体上点 $A$ 发出的，并且形成中间实像 $A_1$. 光线入射到
目镜后，由其折射，并以平行光束射入眼睛，在视网膜上造成
像 $A_2$. 显微镜使区分物体的各细小局部成为可能. 在用肉眼
观察时，这些细小局部是重叠在一起的.

<!-- foot -->
· 204 ·
`,
}
const report = {
  ticket: 'STEMROBIN-181', book: '10p', pages: [213, 214],
  status: 'FIRST-AUTHOR-NATIVE-PENDING', imagesOpenedThisBatch: 4,
  sourceInventory: {
    213: 'Two angular observation diagrams:188 unaided eye/object h/angular phi/d0;189 eye with converging magnifier, h/F/angular phi1 and nearaxis parallel emergent rays. Separate captions. No written exercise.',
    214: 'Microscope diagram190: object AB, objective, first focal distanceF1 and intermediate imageA1B1, ocular withF2, two paths fromA through lenses into eye formingA2B2. Separate caption interrupts a paragraph.',
  },
  sourceDiscrepancyRetained: 'Source214 substitution prose prints phi1 and phi2, while adjacent expressions use phi1 and phi. Raw literal phi2 preserved; no correction/erratum approved here.',
  sourcePagesAdded: 0, completeCardsAdded: 0, canonicalWrites: false, databaseWrites: false,
  native: [], files: [],
}
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
for (const number of [213, 214]) {
  const digits = String(number).padStart(4, '0')
  const prepared = path.join(work, '10p/pages', digits)
  const page = path.join(root, '10p/pages', digits)
  fs.mkdirSync(prepared, { recursive: true })
  fs.mkdirSync(page, { recursive: true })
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
    fs.copyFileSync(path.join(retained, digits, name), path.join(prepared, name))
  }
  const meta = JSON.parse(fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8').split('---')[1])
  meta.printed_page = number - 10
  meta.notes = [
    'First authored from this retained source grid and one detail per page; no OCR or modernization.',
    report.sourceInventory[number],
    'Display fractions represent two printed rows using the native continuation-row marker. Footer ornaments represented as centered dots.',
    ...(number === 214 ? [report.sourceDiscrepancyRetained] : []),
  ]
  fs.writeFileSync(path.join(page, 'page.md'), `---\n${JSON.stringify(meta, null, 2)}\n---\n${bodies[number]}`)
  for (const verb of ['finalize', 'vectorize']) {
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb, '--book', '10p', '--page', String(number),
      '--root', root, '--work', work,
    ]
    const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
    const receipt = { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
    fs.writeFileSync(path.join(out, `${number}-${verb}.receipt.json`), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
    report.native.push({ page: number, verb, exitCode: result.status })
    if (result.status !== 0) {
      report.status = 'FIRST-NATIVE-FAIL-RETAINED-NOT-APPROVED'
      fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
      console.log(JSON.stringify({ status: report.status, receipt }))
      process.exit(1)
    }
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) report.files.push({ path: path.join(page, name), sha256: sha(path.join(page, name)) })
  for (const name of fs.readdirSync(path.join(prepared, 'figures'))) {
    const file = path.join(prepared, 'figures', name)
    report.files.push({ path: file, sha256: sha(file) })
  }
}
report.status = 'FIRST-AUTHOR-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
