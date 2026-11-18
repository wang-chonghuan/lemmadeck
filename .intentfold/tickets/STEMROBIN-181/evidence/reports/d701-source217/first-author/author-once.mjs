import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prep = path.join(tmp, 'd686-source217218-first-preparation/work/10p/pages')
const out = path.join(tmp, 'd687-source217218-first-author')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
fs.mkdirSync(out, { recursive: true })
const bodies = {
  217: `
<!-- h1 -->
第七章　光　波

<!-- h3 -->
**81. 光的速度**

<!-- p -->
在**几何光学**中研究的仅仅是光线的方向. 关于光的**传播**
过程是如何进行的问题就超出了几何光学的范围. 在**物理光
学**中更深刻地研究光的特性和光与物质的相互作用. 我们现
在从讲述光速是如何测量的来开始这一部分.

<!-- p -->
当我们接通电键时，整个房间立刻就被光照亮了，似乎是
光到达墙壁完全不需要时间. 为了求出光速曾做过大量的实
验. 曾试图用准确的钟来测量光信号在远距离（几公里）传播
的时间，但是这些尝试都没有结果. 人们开始这样想：光的
传播根本不需要时间，光刹那间就可以通过任何距离. 但是
后来终于发现光速不是无限大的；光速终于被测定了.

<!-- p -->
**测量光速的天文方法**　1676 年光速首先被丹麦学者罗
默成功地测量出来. 罗默是天文学家，他成功的原因是他测
量的光通过的距离是非常大的，这个距离是太阳系行星间的
距离.

<!-- p open -->
罗默观察了太阳系最大的行星——木星的卫星食. 木
星与地球不同，它有十三个卫星. 木星最近的卫星木卫 $1$ 是
罗默观察的对象. 他看到卫星在行星前面通过，然后没入到
行星的影子里，从视野中消失；接着卫星又出现，好像闪烁着

<!-- foot -->
· 207 ·
`,
  218: `
<!-- p cont -->
的一盏灯，两次闪光之间的时间间隔为 $42$ 小时 $28$ 分. 这样
一来，这个月亮就如同一个巨大的天文钟，它经过相等的时
间间隔而向地球发射自己的信号.

<!-- p -->
开始测量是在地球绕太阳运动最靠近木星的时间进行
的. 而后的测量是在六个月之后，即地球远离木星，走到自己
轨道直径的另一端时. 测量意外地发现卫星从影子中出来比
根据已知的木卫 $1$ 的旋转周期计算出的时刻晚了整整 $22$
分钟.

<!-- p -->
罗默这样解释：“如果我能停留在地球轨道的另一边，那
么卫星总会在预定的时间从影子里出现，站在这个地方的观
察者看到木卫 $1$ 就要早 $22$ 分钟. 此时迟到的原因是由于光
从我第一次观察的地方到达我现在的位置需要 $22$ 分钟.”已
知木卫 $1$ 迟到的时间和引起迟到的距离，用迟到的距离（地球
轨道直径）除以这个时间，就可以求出光的速度. 原来光的速
度非常大，约 $300000$ 千米/秒①，所以要察觉光在地球上两个
点间的传播时间是极端困难的，因为在一秒钟内，光通过的
距离是地球赤道长度的 $7.5$ 倍.

<!-- p open -->
**测量光速的实验室方法**　光的速度首先是由法国物理学
家 H·斐索用实验室的方法在 $1849$ 年成功地测量出来的. 斐
索让光在转动的齿轮的齿间通过（图 194）. 然后让光入射到
距齿轮几公里的平面镜上. 光从平面镜反射回来后，还应当
在齿间通过. 当齿轮转动得较慢时，可以看见从平面镜反射
回来的光. 当旋转的速度增大时，光就逐渐消失了. 这是怎

<!-- p footnote -->
①　由于测量精确度小，对地球轨道半径长度掌握得又不准确，罗默本人测
出的光速为 $215000$ 千米/秒.

<!-- foot -->
· 208 ·
`,
}
const report = {
  ticket: 'STEMROBIN-181', book: '10p', pages: [217, 218],
  status: 'FIRST-AUTHOR-NATIVE-PENDING', imagesOpenedThisBatch: 2,
  boundary: 'Actual source217 h1/h3 starts chapter7/lightwaves and81; no further n80 text or exercises before81heading. Source81 remains open beyond218.',
  sourceHistoricalNumbers: 'Literal thirteen satellites,42h28min,22min,1676,1849,300000km/s and footnote215000km/s preserved; no contemporary correction or scientific approval.',
  externalFigureReference: '194 referenced on218 but actualfigure beyondpage, not invented or approved.',
  canonicalWrites: false, databaseWrites: false, native: [], files: [],
}
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
for (const number of [217, 218]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(prep, digits, name), path.join(prepared, name))
  const meta = JSON.parse(fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8').split('---')[1])
  meta.printed_page = number - 10
  meta.notes = ['First author from actual retained source grid; no source typography or historical correction.', report.boundary, report.sourceHistoricalNumbers, report.externalFigureReference]
  fs.writeFileSync(path.join(page, 'page.md'), `---\n${JSON.stringify(meta, null, 2)}\n---\n${bodies[number]}`)
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', String(number), '--root', root, '--work', work,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
  fs.writeFileSync(path.join(out, `${number}-finalize.receipt.json`), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
  report.native.push({ page: number, exitCode: result.status })
  if (result.status !== 0) {
    report.status = 'FIRST-NATIVE-FAIL-RETAINED'
    fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
    console.log(JSON.stringify(receipt))
    process.exit(1)
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) report.files.push({ path: path.join(page, name), sha256: sha(path.join(page, name)) })
}
report.status = 'FIRST-SOURCE-AUTHOR-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
