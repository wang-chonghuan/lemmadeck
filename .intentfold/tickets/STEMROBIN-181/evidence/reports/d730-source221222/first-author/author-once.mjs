import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prep = path.join(tmp, 'd709-source221222-first-preparation/work/10p/pages')
const out = path.join(tmp, 'd710-source221222-first-author')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bodies = {
  221: `
<!-- p cont open -->
射. 设光的平面波入射到两种
媒质（如空气和水）的界面上
（图 195）. 波面 $AC$ 垂直于光
射线 $A_1A$ 和 $B_1B$. 在第二种媒
质里做中心在两种媒质的交界
面上的所有次波的切面，就可
以得到折射波的波面. 光线
$A_1A$ 首先到达表面 $MN$. 如果

<!-- fig 图 195 box 830,101,523,511 -->
<!-- cap 图 195 samerow -->
图 195

<!-- p cont -->
在第一种媒质中光速等于 $v_1$，那么光线 $B_1B$ 到达面 $MN$ 经
过的时间为
$\\Delta t=\\frac{|CB|}{v_1}$

<!-- p -->
所以，当次波在 $B$ 点刚刚开始激发的时刻，由点 $A$ 发出的波已
经是一个球面，其半径为
$|AD|=v_2\\cdot\\Delta t$

<!-- p -->
其中 $v_2$ 是光在第二种媒质中的速度.

<!-- p -->
如果从点 $B$ 作与中心在点 $A$ 的球面相切的直线，我们就
得到折射波的波面 $DB$. 显然光线的入射角 $\\alpha$ 等于 $\\triangle ABC$ 中
的 $\\angle CAB$（两个角的两边互相垂直）. 所以
$|CB|=v_1\\cdot\\Delta t=|AB|\\sin\\alpha$ （7.1）

<!-- p -->
折射角 $\\beta$ 等于 $\\triangle ABD$ 中的 $\\angle ABD$. 所以
$|AD|=v_2\\cdot\\Delta t=|AB|\\sin\\beta$ （7.2）

<!-- p -->
用（7.2）除（7.1），我们得到折射定律
$\\frac{\\sin\\alpha}{\\sin\\beta}=\\frac{v_1}{v_2}=n$ （7.3）

<!-- foot -->
· 211 ·
`,
  222: `
<!-- p -->
其中 $n$ 是与入射角无关的常量，如大家知道的，它叫做相对折
射率. 用这种方法，根据惠更斯原理不仅能得出折射定律，而
且利用它也揭示出相对折射率的物理意义：折射率就是光在
其界面上发生折射的两种媒质中光速之比.
$n=\\frac{v_1}{v_2}$ （7.4）

<!-- p -->
此外，如果折射角 $\\beta$ 小于入射角 $\\alpha$，则根据（7.3）在第二种媒
质中光速就小于第一种媒质中的光速. 在水和其它透明媒质
中测量光速的实验精确地证实了这一点.

<!-- p -->
利用公式（7.4）用第一种和第二种媒质的绝对折射率 $n_1$
和 $n_2$ 可以表示出相对折射率 $n$. 事实上，因为
$n_1=\\frac{c}{v_1}$ 和 $n_2=\\frac{c}{v_2}$，

<!-- p -->
所以
$n=\\frac{v_1}{v_2}=\\frac{n_2}{n_1}$ （7.5）

<!-- h3 -->
**83. 光的色散**

<!-- p -->
**折射率与光束的入射角无关，但是它与光的颜色有关，这**
是牛顿发现的.

<!-- p -->
牛顿改进望远镜时，注意到物镜所产生的像边缘是彩色
的. 他对此很感兴趣，并且第一个“研究了光线的多样性和由
此产生的各种颜色的特点. 这在当时是谁也没意料到的”（牛
顿墓志铭）. 当然，在他之前人们就已观察到由透镜产生的像
的虹的色彩，也察觉到通过棱镜看物体时也有虹彩的边缘，通
过棱镜的光束使边缘染色.

<!-- foot -->
· 212 ·
`,
}
const report = {
  ticket: 'STEMROBIN-181', book: '10p', pages: [221, 222],
  status: 'FIRST-AUTHOR-NATIVE-PENDING', imagesOpenedThisBatch: 2,
  boundary: 'Source221 first continuation joins220 open refraction paragraph; actual222 h3 begins83, closes82;83 remains incomplete.',
  sourceFigure: '195 planar refraction construction M,N,A,B,C,D,A1,A2,B1,B2,alpha,beta; caption shares row with last narrow prose line.',
  sourceFacts: 'Original phase/wavefront account, formulas7.1-7.5 and Newton quote retained; no modern scientific approval.',
  canonicalWrites: false, databaseWrites: false, native: [], files: [],
}
for (const number of [221, 222]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(prep, digits, name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
  const meta = JSON.parse(fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8').split('---')[1])
  meta.printed_page = number - 10
  meta.notes = [report.boundary, report.sourceFigure, report.sourceFacts]
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
