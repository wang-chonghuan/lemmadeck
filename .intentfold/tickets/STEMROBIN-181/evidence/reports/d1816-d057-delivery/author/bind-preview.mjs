import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { W, A, F, T, editions, id, load, hash, save } from './receipt.mjs'
const require = createRequire(import.meta.url)
const { chromium } = require('/Users/yong/work/lemmadeck-ws/lemmadeck/.agents/skills/node_modules/playwright-core')

const previews = []
const bindings = []
for (const n of [34, 35]) {
  const reportPath = path.join(F, 'native',
    n === 34 ? 'fig-34.context-final.render.json' : 'fig-35.label-repair.render.json')
  const native = load(reportPath)
  if (native.status !== 'pass') throw new Error(`Native render held: fig-${n}`)
  const sourceFolder = path.join(F, editions[0], 'lessons', id, 'figures')
  const specPath = path.join(sourceFolder, `fig-${n}.spec.json`)
  const svgPath = path.join(sourceFolder, `fig-${n}.svg`)
  if (native.spec.sha256 !== hash(specPath) || native.output.svg.sha256 !== hash(svgPath)) {
    throw new Error(`Stale native evidence: fig-${n}`)
  }
  for (const edition of editions) {
    const folder = path.join(F, edition, 'lessons', id, 'figures')
    const targetSpec = path.join(folder, `fig-${n}.spec.json`)
    const targetSvg = path.join(folder, `fig-${n}.svg`)
    if (hash(targetSpec) !== hash(specPath)) throw new Error('Locale specs differ')
    if (edition !== editions[0]) fs.copyFileSync(svgPath, targetSvg, fs.constants.COPYFILE_EXCL)
    const root = `ssot-resources/soviet10year-textbooks/artifacts/10p/editions/${edition}/lessons/${id}/figures/fig-${n}`
    const bound = structuredClone(native)
    bound.spec.path = root + '.spec.json'
    bound.output.svg.path = root + '.svg'
    const reportTarget = path.join(folder, `fig-${n}.render.json`)
    save(reportTarget, bound)
    bindings.push({
      edition, figure: `fig-${n}`,
      nativeReport: { path: reportPath, sha256: hash(reportPath) },
      boundReport: { path: reportTarget, sha256: hash(reportTarget) },
      pathOnlyRewrite: { spec: bound.spec.path, svg: bound.output.svg.path },
      hashesStatusAndMeasurementsUnchanged: true,
      nativeRenderApprovedIndependently: false,
    })
  }
}
const browser = await chromium.launch({ headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
try {
  for (const n of [34, 35]) {
    const svgPath = path.join(F, editions[0], 'lessons', id, `figures/fig-${n}.svg`)
    const spec = load(path.join(F, editions[0], 'lessons', id, `figures/fig-${n}.spec.json`))
    const width = 331
    const height = Math.ceil(spec.canvas.height * width / spec.canvas.width)
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.setContent(`<style>html,body{margin:0;background:white}img{display:block;width:${width}px;height:auto}</style><img alt="Figure ${n}" src="data:image/svg+xml;base64,${fs.readFileSync(svgPath).toString('base64')}">`)
    await page.locator('img').evaluate(async image => {
      await image.decode()
      if (!image.complete || !image.naturalWidth) throw new Error('Blank image')
    })
    const observation = await page.locator('img').evaluate(image => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let ink = 0
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 100 && Math.min(pixels[i], pixels[i + 1], pixels[i + 2]) < 170) ink++
      }
      return { mediaWidth: image.getBoundingClientRect().width,
        naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
        nonblankPixelCount: ink, horizontalOverflow: document.documentElement.scrollWidth > innerWidth }
    })
    if (errors.length || observation.mediaWidth !== width ||
        observation.nonblankPixelCount < 100 || observation.horizontalOverflow) {
      throw new Error(JSON.stringify({ errors, observation }))
    }
    const p = path.join(F, 'previews', `fig-${n}-331.png`)
    await page.locator('img').screenshot({ path: p })
    previews.push({ figure: `fig-${n}`, preview: { path: p, sha256: hash(p) },
      observation, errors, cssWidth: width,
      minTextPx: spec.display.minTextPx,
      measuredTextPx: 32 * width / spec.canvas.width })
    await page.close()
  }
} finally {
  await browser.close()
}
save(path.join(A, 'native-binding-and-previews.json'), {
  schema: 'STEMROBIN-181/native-render-path-binding@1',
  role: 'author',
  note: 'Native reports are immutable receipts. These separate bound copies only replace spec/output paths with intended durable lesson-local paths; no native status, hash, object count, collision or width measurement is altered. Assets remain unpromoted scratch candidates.',
  bindings, previews,
})
save(path.join(F, 'bilingual-context-final.json'), {
  schema: 'STEMROBIN-181/complete-bilingual-figure-context@1', role: 'author', lesson: id,
  lessons: editions.map(edition => {
    const p = path.join(T, edition, 'lessons', id, 'lesson.template.json')
    return { edition, template: { path: p, sha256: hash(p) }, document: load(p) }
  }),
  questions: [], primaryReading: { path: path.join(A, 'primary-reading.json'),
    sha256: hash(path.join(A, 'primary-reading.json')) },
})
console.log(JSON.stringify({ bindings: bindings.length, previews }, null, 2))
