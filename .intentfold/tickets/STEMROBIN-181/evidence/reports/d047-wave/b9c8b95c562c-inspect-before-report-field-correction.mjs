import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = path.dirname(fileURLToPath(import.meta.url))
const stage = process.argv[2] || 'initial'
assert(['initial','repair-1'].includes(stage))
const D = `${O}/attempts/${stage}`
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({path:p,sha256:sha(p)})
const read = p => JSON.parse(fs.readFileSync(p,'utf8'))
function write(name, value) {
  const target = path.resolve(O,name)
  assert(target.startsWith(`${O}/`))
  fs.mkdirSync(path.dirname(target),{recursive:true})
  fs.writeFileSync(target,`${JSON.stringify(value,null,2)}\n`,{flag:'wx'})
}
const spec = read(`${D}/fig-70.spec.json`)
const report = read(`${D}/fig-70.render.json`)
const inventory = read(`${O}/source-inventory.json`)
assert.equal(report.status,'pass')
assert.equal(report.spec.sha256,sha(`${D}/fig-70.spec.json`))
assert.equal(report.output.svg.sha256,sha(`${D}/fig-70.svg`))
assert.equal(report.output.png.sha256,sha(`${D}/fig-70.native.png`))
const defs = new Map(spec.objects.map(o => [o.id,o]))
const relations = new Map(spec.assertions.map(a => [a.id,a]))
const coverage = []
for (const row of inventory.rows) {
  const group = spec.source.inventory.find(g => g.id === `source-row-${row.row}-all-18-balls`)
  const groupPoints = new Set(group.objects.filter(id => defs.get(id)?.type === 'point'))
  assert.equal(groupPoints.size,18)
  assert.deepEqual(row.balls.map(b => b.number),Array.from({length:18},(_,i) => i+1))
  assert.equal(row.balls.length,18)
  for (const ball of row.balls) {
    const object = defs.get(ball.id)
    assert.deepEqual(object.at,ball.modernNativeAt)
    assert.equal(defs.get(ball.numberLabel).text,String(ball.number))
    assert.notEqual(object.visible,false)
    const mapped = group.assertions.map(id => relations.get(id)).filter(a =>
      ['displacement','connects'].includes(a.type) && typeof a.from === 'string'
      && typeof a.to === 'string' && groupPoints.has(a.from) && groupPoints.has(a.to)
      && (a.from === ball.id || a.to === ball.id))
    assert(mapped.length > 0,`No wholly-within-row relationship for ${ball.id}`)
    if (!ball.reachedInThisSnapshot) {
      assert.equal(object.at[1],defs.get(`source-${row.row}-time`).at[1])
      assert.equal(ball.arrow,null)
      assert(!spec.objects.some(o => o.type === 'arrow' && o.from === ball.id))
    }
    coverage.push({ball:ball.id,row:row.row,number:ball.number,relationships:mapped.map(a => a.id)})
  }
  for (const vector of row.velocityArrows) {
    const arrow = defs.get(vector.id)
    assert.equal(arrow.type,'arrow')
    assert.equal(arrow.from,vector.ball)
    const from = defs.get(vector.ball).at
    assert.equal(arrow.to[0],from[0])
    const dy = arrow.to[1]-from[1]
    assert(Math.abs(Math.abs(dy)-vector.modernLengthPx)<1e-6)
    assert.equal(Math.sign(dy),vector.sourceDirection === 'up' ? 1 : -1)
    assert.equal(relations.get(`${vector.id}-connects`).arrow,vector.id)
  }
  assert.equal(defs.get(row.label).text,row.modernLetter)
  assert.equal(defs.get(row.timestampLabel).text,row.timestamp)
}
for (const object of spec.objects.filter(o => ['segment','arrow'].includes(o.type))) {
  const relation = relations.get(`${object.id}-connects`)
  assert(relation)
  assert.deepEqual([relation.from,relation.to],[object.from,object.to])
}
for (const [row,pairs] of Object.entries(inventory.equalPhaseScope).filter(([row]) => ['e','f'].includes(row))) {
  for (const [a,b] of pairs) {
    const id = n => `source-${row}-ball-${String(n).padStart(2,'0')}`
    const p = defs.get(id(a)).at
    const q = defs.get(id(b)).at
    assert.equal(q[0]-p[0],672)
    assert.equal(q[1],p[1])
    const arrows = n => spec.objects.find(o => o.type === 'arrow' && o.from === id(n))
    const va = arrows(a)
    const vb = arrows(b)
    assert.equal(Boolean(va),Boolean(vb))
    if (va) assert(Math.abs((va.to[1]-p[1])-(vb.to[1]-q[1]))<1e-6)
  }
}
assert(!relations.has('source-e-reached-equal-state-2-14'))
assert(!relations.has('source-e-reached-equal-state-3-15'))
assert(!spec.objects.some(o => ['grid','axis','svgPath','image','measure'].includes(o.type)))
const texts = spec.objects.filter(o => o.type === 'text')
assert.equal(texts.length,123)
assert(texts.every(t => /^(?:[1-9]|1[0-8]|[a-f]|0|T|T\/4|T\/2|3T\/4|5T\/4|\u03bb)$/.test(t.text)))
for (const language of ['zh','en']) {
  const context = read(`${O}/context/current/${language}/native-context.json`)
  assert.equal(context.lessons.length,2)
  for (const lesson of context.lessons) {
    const complete = lesson.fullTemplate.prose.map(b => b.text || b.label || '').filter(Boolean).join('\n\n')
    assert.equal(complete,lesson.fullProse)
    assert(spec.source.authoritativeText.some(t => t.lesson === lesson.lesson
      && t.language === language && t.text === complete))
  }
  const exercise = context.lessons[1].fullExercises
  const before = read(`${O}/context/before/${language}/full-context.json`)
  assert.deepEqual(exercise.source.data,before.authoritativeLessons.find(l => l.card.endsWith('n39')).exercises.source.data)
}
write(`checks/${stage}-native-geometry.json`,{
  status:'pass',scope:'Author checks only, not independent SCI or figure approval',
  spec:bind(`${D}/fig-70.spec.json`),inventory:bind(`${O}/source-inventory.json`),
  coveredSourcePoints:coverage.length,coverage,sourceCounts:inventory.counts,
  allSourceArrowsDirectionsAndLengthHierarchy:true,allEdgesConnects:true,
  stationaryTailsNeverPeriodicallyContinued:true,
  inPhaseScope:inventory.equalPhaseScope,completeCurrentBilingualBothCourseText:true,
  sixRawQuestionsUnchanged:true,noAnswerLabel:true,noOriginalGridInvented:true,
})

const require = createRequire(`${W}/.agents/skills/package.json`)
const {chromium} = require('playwright-core')
const executablePath = [chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p))
assert(executablePath,'Use existing browser only; no setup')
const svg = fs.readFileSync(`${D}/fig-70.svg`,'utf8')
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Figure 70</title><style>
  :root{--ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;--ld-figure-accent:#15201f;
    --ld-figure-accent-soft:#8a9795;--ld-figure-grid:#e3eae9;--ld-figure-paper:#fff}
  html,body{margin:0;background:white}body{padding:16px}
  #scroll{width:100%;max-width:640px;overflow-x:auto;overflow-y:hidden}
  #media{width:640px;flex:none}#media>svg{display:block;width:640px;height:auto}
  </style></head><body><div id="scroll"><div id="media">${svg}</div></div></body></html>`
fs.mkdirSync(`${O}/preview/${stage}`,{recursive:true})
fs.writeFileSync(`${O}/preview/${stage}/fig-70.html`,html,{flag:'wx'})
const browser = await chromium.launch({executablePath,headless:false})
const observations = []
try {
  for (const viewport of [{width:1440,height:960},{width:390,height:844}]) {
    const page = await browser.newPage({viewport,deviceScaleFactor:1})
    const errors = []
    const network = []
    page.on('pageerror',e => errors.push(String(e)))
    page.on('request',r => {if (/^https?:/.test(r.url())) network.push(r.url())})
    await page.setContent(html)
    await page.evaluate(() => document.fonts.ready)
    const observed = await page.locator('#scroll').evaluate(host => {
      const svg = host.querySelector('svg')
      const rect = svg.getBoundingClientRect()
      const texts = [...svg.querySelectorAll('text')].map(n => {
        const ctm = n.getScreenCTM()
        const box = n.getBoundingClientRect()
        return {id:n.getAttribute('data-label-id'),text:n.textContent,
          fontPx:parseFloat(getComputedStyle(n).fontSize)*Math.hypot(ctm.a,ctm.b),
          bounds:{left:box.left,top:box.top,right:box.right,bottom:box.bottom},
          inside:box.left >= rect.left && box.right <= rect.right
            && box.top >= rect.top && box.bottom <= rect.bottom}
      })
      const collisions = []
      for(let i=0;i<texts.length;i++) for(let j=i+1;j<texts.length;j++) {
        const a=texts[i].bounds,b=texts[j].bounds
        if(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top)
          collisions.push([texts[i].id,texts[j].id])
      }
      return {viewportWidth:innerWidth,hostWidth:host.clientWidth,mediaWidth:rect.width,
        height:rect.height,scrollWidth:host.scrollWidth,scrollLeft:host.scrollLeft,
        texts,minTextPx:Math.min(...texts.map(t => t.fontPx)),collisions,
        foreignObjects:svg.querySelectorAll('foreignObject').length,
        svgGeometryCount:[...svg.querySelectorAll('path,line,polygon,polyline,ellipse,circle')]
          .filter(n => !n.closest('defs') && getComputedStyle(n).display !== 'none').length,
        forbiddenText:texts.some(t => /[\u0400-\u04ff\u4e00-\u9fff]/.test(t.text))}
    })
    assert.equal(observed.mediaWidth,640)
    assert.equal(observed.height,1530)
    assert.equal(observed.texts.length,123)
    assert(observed.minTextPx >= 16)
    assert(observed.texts.every(t => t.inside))
    assert.equal(observed.collisions.length,0)
    assert.equal(observed.foreignObjects,0)
    assert.equal(observed.forbiddenText,false)
    assert(observed.svgGeometryCount>600)
    const name = viewport.width === 1440 ? 'media-640' : 'mobile-390-left'
    const screenshot = `${O}/preview/${stage}/${name}.png`
    await page.locator('#scroll').screenshot({path:screenshot,animations:'disabled'})
    const result = {viewport,observed,screenshot:bind(screenshot),errors,network}
    if(viewport.width === 390) {
      assert.equal(observed.hostWidth,358)
      assert(observed.scrollWidth>observed.hostWidth)
      await page.locator('#scroll').evaluate(h => {h.scrollLeft=h.scrollWidth})
      const end = await page.locator('#scroll').evaluate(h => {
        const box=h.getBoundingClientRect()
        const labels=[...h.querySelectorAll('text')].filter(n =>
          /source-[a-f]-(?:number-18|time)-label$/.test(n.getAttribute('data-label-id')||''))
        return {scrollLeft:h.scrollLeft,max:h.scrollWidth-h.clientWidth,
          lastLabels:labels.map(n => {const b=n.getBoundingClientRect()
            return {id:n.getAttribute('data-label-id'),text:n.textContent,
              visibleHorizontally:b.left>=box.left && b.right<=box.right}})}
      })
      assert.equal(end.scrollLeft,end.max)
      assert.equal(end.lastLabels.length,12)
      assert(end.lastLabels.every(l => l.visibleHorizontally))
      const endShot=`${O}/preview/${stage}/mobile-390-end.png`
      await page.locator('#scroll').screenshot({path:endShot,animations:'disabled'})
      result.horizontalEnd={...end,screenshot:bind(endShot)}
    } else assert.equal(observed.scrollWidth,observed.hostWidth)
    assert.equal(errors.length,0)
    assert.equal(network.length,0)
    observations.push(result)
    await page.close()
  }
} finally {
  await browser.close()
}
write(`checks/${stage}-actual-display.json`,{
  status:'pass',browser:{headed:true,executablePath},
  surface:'Isolated native SVG preview, not app/offline course acceptance',
  spec:bind(`${D}/fig-70.spec.json`),svg:bind(`${D}/fig-70.svg`),
  fixedMedia640:true,observations,productAppOpened:false,networkRequests:0,
})
console.log(JSON.stringify({status:'author-native-geometry-and-headed-width-pass',
  coveredPoints:coverage.length,mediaWidth:640,minTextPx:Math.min(...observations.map(o=>o.observed.minTextPx)),
  mobileEnd:observations[1].horizontalEnd,previews:observations.map(o=>o.screenshot.path)}))
