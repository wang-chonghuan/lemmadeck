import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prep = path.join(tmp, 'd679-source215216-first-preparation/work/10p/pages')
const out = path.join(tmp, 'd680-source215216-first-author')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
fs.mkdirSync(out, { recursive: true })
const bodies = {
  215: `
<!-- exhead -->
练习 9

<!-- ex 1 -->
图 191 标出了透镜的主光轴 $MN$、发光点 $S$ 和它的像 $S_1$ 的位
置. 用作图法求出透镜的光心和它的焦点. 确定这个透镜是会聚透镜
还是发散透镜，像是实像还是虚像？

<!-- fig 图 191 box 528,500,472,257 -->
![图 191](figures/fig-191.png)

<!-- cap 图 191 -->
图 191

<!-- ex 2 -->
位于透镜前距离为 $d=1.25$ 厘米处的毫米分度标尺的像在屏幕
上的长度为 $l=2.4$ 厘米. 问透镜的焦距是多少？

<!-- ex 3 -->
利用透镜在屏幕上获得电灯泡的实像，如果把透镜有一半遮
住，则像如何变化？

<!-- ex 4 -->
照相机在胶片上产生了人的头像. 用图形说明，为什么在人后
面的近处森林呈现出的像是不清晰的？为了使森林的像清晰，物镜应
该向哪方移动？在这种情况下脸的像还清晰吗？

<!-- ex 5 -->
为什么不带面罩的潜游者在水下不能很好地辨别物体？

<!-- ex 6 -->
画出位于会聚透镜和它的焦点之间的物体的像.

<!-- ex 7 -->
一物体位于距会聚透镜 $d=1.8$ 米的地方，如果它的像的大小为
物体的五分之一，求透镜的焦距.

<!-- ex 8 open -->
图 192 标出了透镜的主光轴、光源和它的像. 用作图法求出光
心和透镜的焦点.

<!-- fig 图 192 box 553,1662,503,211 -->
![图 192](figures/fig-192.png)

<!-- cap 图 192 -->
图 192

<!-- foot -->
· 205 ·
`,
  216: `
<!-- ex 8 cont -->
这个透镜是会聚透镜还是发散透镜？成的像是实像还是虚像？研
究以下情况：
1) $A$——光源，$B$——像；
2) $B$——光源，$A$——像.

<!-- ex 9 -->
利用三条“特殊”的光线画出发光点在发散透镜中的像.

<!-- ex 10 -->
幻灯镜头的焦距 $F=0.25$ 米. 如果屏幕离镜头距离 $f=2$ 米，
则幻灯片底片的放大率多大？

<!-- ex 11 -->
发光点位于发散透镜的焦点上. 像距离透镜多远？画出光路.

<!-- ex 12 -->
斜的短箭头的尾端位于会聚透镜主光轴上 $2$ 倍焦距处，画出
斜箭头的像.

<!-- foot -->
· 206 ·
`,
}
const report = {
  ticket: 'STEMROBIN-181', book: '10p', pages: [215, 216],
  status: 'FIRST-AUTHOR-NATIVE-PENDING', imagesOpenedThisBatch: 2,
  sourceInventory: {
    215: 'Exercise9 tasks1-8 with raw191 MN/S/S1 ray-construction locations and192 MN/A/B point positions; two separate captions. No derived focal point or answer added.',
    216: 'Task8 continuation with two opposite source/image assignments then original tasks9-12. No figures or new lesson headings.',
  },
  boundaries: 'Ex8 source215open joins216ex8cont; all12written tasks distinct, no numbered lesson added. Need subsequent actual81heading for full n80 boundary.',
  mathematicalReview: 'Not performed; task2 literal source d=1.25cm and l=2.4cm retained without correcting units or guessing ruler length.',
  canonicalWrites: false, databaseWrites: false, native: [], files: [],
}
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
for (const number of [215, 216]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(prep, digits, name), path.join(prepared, name))
  const meta = JSON.parse(fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8').split('---')[1])
  meta.printed_page = number - 10
  meta.notes = [
    'First author from actual retained source grid. Literal prose/units retained, no solutions or modern correction.',
    report.sourceInventory[number], report.boundaries, report.mathematicalReview,
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
      console.log(JSON.stringify(receipt))
      process.exit(1)
    }
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) report.files.push({ path: path.join(page, name), sha256: sha(path.join(page, name)) })
  const figures = path.join(prepared, 'figures')
  if (fs.existsSync(figures)) for (const name of fs.readdirSync(figures)) {
    const file = path.join(figures, name)
    report.files.push({ path: file, sha256: sha(file) })
  }
}
report.status = 'FIRST-AUTHOR-NATIVE-PASS-FIRST-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
