import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prep = path.join(tmp, 'd697-source219220-first-preparation/work/10p/pages')
const out = path.join(tmp, 'd698-source219220-first-author')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bodies = {
  219: `
<!-- fig 图 193 box 230,115,1080,508 -->
<!-- cap 图 193 -->
图 193

<!-- fig 图 194 box 220,795,1100,283 -->
<!-- cap 图 194 -->
图 194

<!-- p cont -->
么回事呢？因为当光通过齿间射到平面镜又返回来时，齿已
经转到原来是开口的地方，光就被遮住了.

<!-- p -->
当旋转的速度进一步增大时，光又变为可见的了. 显然，
这是因为在光到平面镜往返运行一次的这段时间内齿轮已经
转到使后面的开口转到前面的开口的位置上. 已知这个时间
及齿轮和平面镜之间的距离，可以求出光速. 在裴索实验中
距离为 $8.6$ 千米，求得光速的值为 $313000$ 千米/秒.

<!-- p -->
还发明了很多更准确的测量光速的实验室方法，特别是
美国物理学家迈克尔逊研究出的利用旋转镜子代替齿轮的测
量光速的完善的方法.

<!-- foot -->
· 209 ·
`,
  220: `
<!-- p -->
还测出了在各种透明物质中的光速. 水中的光速是在
$1856$ 年测定的. 它是真空中光速的 $3/4$. 在其它物质中光速
都比真空中的光速小.

<!-- p -->
根据现代数据，在真空中光速等于 $299792456.2\\pm0.8$
米/秒.

<!-- p -->
光速的测定在科学中起了非常重要的作用. 在相当大的
程度上它促进了对光的本质的探索. 光速具有特别重要的意
义是因为世界上没有任何物体能具有超出真空中光速的
速度.

<!-- h3 -->
**82. 光的折射定律的推导**

<!-- p -->
光线的概念是几何光学的基本概念. 确定光线的方向的
各定律，即光在均匀媒质中直线传播的定律、反射定律和折射
定律是用实验的方法发现的.

<!-- p -->
光的反射和折射定律理论上也首先是利用惠更斯的光的
波动说导出的. 惠更斯把光看作是在一种假想的充满了整个
宇宙空间的媒质——以太中传播的弹性波.

<!-- p -->
惠更斯原理在机械波为题的第四章中已经讲过了，它
正是对于光波最初的阐述.

<!-- p -->
这个原理，象波运动的其它各定律一样，对于任何波都是
正确的，而与波的性质无关.

<!-- p -->
在第 $47$ 节中导出了机械波的反射定律，但因为所有的
论断都能丝毫不差地正确地用于光波，所以可以认为光的反
射定律在理论上是被证明了的.

<!-- p open -->
现在我们来研究光从一种媒质进入另一种媒质时的折

<!-- foot -->
· 210 ·
`,
}
const report = {
  ticket: 'STEMROBIN-181', book: '10p', pages: [219, 220],
  status: 'FIRST-AUTHOR-NATIVE-PENDING', imagesOpenedThisBatch: 3, native: [], files: [],
  sourceHistoricalFacts: 'Literal 8.6km,313000km/s,1856,3/4,299792456.2+-0.8m/s retained, not modern scientific approval.',
  sourceBoundary: 'Source81 ends before actual220 unit82 heading. Source82 ends this range with open refraction paragraph.',
  sourceNames: 'Actual219 prose crop shows 裴索 and 迈克尔逊. No adjudication of unresolved218 initial.',
  figures: ['fig-193', 'fig-194'], canonicalWrites: false, databaseWrites: false,
}
for (const number of [219, 220]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
    fs.copyFileSync(path.join(prep, digits, name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
  }
  const meta = JSON.parse(fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8').split('---')[1])
  meta.printed_page = number - 10
  meta.notes = [report.sourceHistoricalFacts, report.sourceBoundary, report.sourceNames]
  fs.writeFileSync(path.join(page, 'page.md'), `---\n${JSON.stringify(meta, null, 2)}\n---\n${bodies[number]}`, { flag: 'wx' })
  for (const verb of ['finalize', 'vectorize']) {
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb, '--book', '10p',
      '--page', String(number), '--root', root, '--work', work,
    ]
    const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
    const receipt = path.join(out, `${number}-${verb}.receipt.json`)
    fs.writeFileSync(receipt, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
    report.native.push({ page: number, verb, receipt: path.relative(repo, receipt), sha256: sha(receipt), exitCode: result.status })
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
