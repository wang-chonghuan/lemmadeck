import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prep = path.join(tmp, 'd714-source223224-first-preparation/work/10p/pages')
const out = path.join(tmp, 'd716-source223224-first-author')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bodies = {
  223: `
<!-- p open -->
牛顿的基本实验是非
常简单的. 他想到了把横
截面小的光束射向棱镜.
太阳光束通过护窗板上的
一个小孔进入黑暗的房
间，射入玻璃棱镜后，光线
折射，并在对面的墙上产
生一个有虹彩颜色的伸长
了的图像（图 196）. 很多世
纪以来传统地认为虹是由

<!-- fig 图 196 box 729,136,599,613 -->
<!-- cap 图 196 samerow -->
图 196

<!-- p cont -->
七种基本颜色组成的. 牛顿也分出了七种颜色：紫、靛、蓝、
绿、黄、橙黄的和红. 牛顿把这七色光带叫做**光谱**.

<!-- p -->
用红玻璃把小孔挡住，牛顿在墙上仅仅看到红色斑点. 用
蓝玻璃挡住小孔，看到的是蓝色斑点，以此类推. 由此可知过
去推测棱镜把光染了色是不对的. 棱镜没有改变光的颜色，
而仅仅是把光分解为各组成成分（彩图Ⅰ）. 白光具有复杂的
结构. 由白光可以分解出各种不同颜色的光，只是因为它们
的共同作用，对我们产生了白光的印象. 事实上，如果利用相
对第一块棱镜转动了 $180^\\circ$ 的第二块棱镜，把光谱全部光束会
合起来，那末又会获得白光（彩图Ⅱ）. 分解出来的光谱的任
何一个部分，例如绿色光，使其光线再通过一块棱镜，不能得
到颜色的进一步变化.

<!-- p open -->
牛顿又得出了另外一个重要的结论，就是在《光学》论文
中他阐述的如下内容：“颜色不同的光在折射程度上是不同
的”（玻璃对它们具有不同的折射率）. 紫色光的折射率最大，

<!-- foot -->
· 213 ·
`,
  224: `
<!-- p cont -->
其他颜色的光中折射率最小的是红光. **光的折射率与它们的**
**颜色的关系称为色散**.

<!-- p -->
而后为了获得更纯的光，牛顿进一步改进了自己对光谱
的观察. 因为通过棱镜的光束的彩色圆形斑，有一部分彼此
互相遮盖（图 196），用明亮的光
源照亮的狭缝代替圆孔，在缝后
面放一个透镜，使光在屏幕上成
白色的窄条纹的像. 如果在光路
上放一个棱镜（图 197），则狭缝
的像就展开为光谱.

<!-- fig 图 197 box 821,604,493,231 -->
<!-- cap 图 197 samerow -->
图 197

<!-- p -->
因为折射率取决于光在该物质中的速度，那么显然折射
较小的红光的速度最大，紫光的速度最小. 正因为如此，棱镜
才能分解白光. 在真空中不同颜色的光速是相等的. 如果不
这样，那么，罗默观察的木星的卫星 $1$，在它从影子里出来的
时刻，就会显出红色，而在临没入影子之前，就会显出紫色. 但
是没有出现这种现象.

<!-- p -->
已知白光具有复杂的结构，就可以解释自然界中惊人的
色彩缤纷的现象. 如果物体，例如一张纸，能反射所有入射到
它上面的各种颜色的光线，那么它就是白色. 用一层红色把
纸蒙上时，这时虽然我们不能创造新的颜色的光，但是我们挡
住了纸上原有的某些部分的光；现在反射的仅仅是红光，其余
的光则被红色层吸收了. 草和树叶在我们看来之所以是绿
的，是因为入射到它那里去的太阳光线中被反射的仅仅是绿色，
而其余的都被吸收了. 如果通过只有红色光线才能透过去的
红玻璃来观察草，那么草就几乎呈黑色.

<!-- foot -->
· 214 ·
`,
}
const report = {
  ticket: 'STEMROBIN-181', book: '10p', pages: [223, 224],
  status: 'FIRST-AUTHOR-NATIVE-PENDING', imagesOpenedThisBatch: 2,
  boundary: 'Source83 continues; page223 finalopen definition joins224firstcont. No next unit heading,83 not closed.',
  figures: ['fig-196', 'fig-197'],
  externalColorPlates: ['彩图Ⅰ', '彩图Ⅱ'],
  sourceFacts: 'Historical seven color account, prism recombination180deg, Newton quote and water/material color claims retained, not modern scientific approval.',
  canonicalWrites: false, databaseWrites: false, native: [], files: [],
}
for (const number of [223, 224]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(prep, digits, name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
  const meta = JSON.parse(fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8').split('---')[1])
  meta.printed_page = number - 10
  meta.notes = [report.boundary, report.sourceFacts, 'External colorplates I/II references retained; actual plates not acquired or approved.']
  fs.writeFileSync(path.join(page, 'page.md'), `---\n${JSON.stringify(meta, null, 2)}\n---\n${bodies[number]}`, { flag: 'wx' })
  for (const verb of ['finalize', 'vectorize']) {
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb, '--book', '10p', '--page', String(number),
      '--root', root, '--work', work,
    ]
    const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
    const file = path.join(out, `${number}-${verb}.receipt.json`)
    fs.writeFileSync(file, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
    report.native.push({ page: number, verb, path: path.relative(repo, file), sha256: sha(file), exitCode: result.status })
    if (result.status !== 0) {
      report.status = 'FIRST-NATIVE-FAIL-RETAINED'
      fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
      console.log(JSON.stringify({ ...report, stdout: result.stdout, stderr: result.stderr }))
      process.exit(1)
    }
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = path.join(page, name)
    report.files.push({ path: path.relative(repo, file), sha256: sha(file) })
  }
}
report.status = 'FIRST-SOURCE-AUTHOR-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report))
