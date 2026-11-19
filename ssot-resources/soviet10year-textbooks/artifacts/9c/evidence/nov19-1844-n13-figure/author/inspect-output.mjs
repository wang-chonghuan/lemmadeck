import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'

const root = process.cwd()
const out = path.join(root, '.tmp/stemrobin-184-resume/n13-figure-author')
const {chromium} = await import(pathToFileURL(path.join(root, 'app/node_modules/playwright/index.mjs')))
const digest = value => crypto.createHash('sha256').update(value).digest('hex')
const read = name => JSON.parse(fs.readFileSync(path.join(out, name)))
const spec = read('tbl-p0056-01.spec.json')
const render = read('tbl-p0056-01.render.json')
const inventory = read('source-inventory.first.json')
const context = read('author-context.first.json')
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, digest(fs.readFileSync(path.join(out, 'tbl-p0056-01.spec.json'))))
const svgBytes = fs.readFileSync(path.join(out, 'tbl-p0056-01.svg'))
assert.equal(render.output.svg.sha256, digest(svgBytes))
const byId = new Map(spec.objects.map(object => [object.id, object]))
for (const row of inventory.groups.find(group => group.id === 'digit-columns').digitRows) {
  const labels = [...row.digits].map((_, index) =>
    byId.get(`digit-columns-${row.id}-${index}`).label).join('')
  assert.equal(labels, row.digits, `source digits: ${row.id}`)
}
assert.equal([0, 1, 2, 3].map(index =>
  byId.get(`division-header-quotient-${index}`).label).join(''), '0218')
assert.equal(byId.get('division-header-decimal').label, '.')
assert.equal([0, 1].map(index => byId.get(`division-header-divisor-${index}`).label).join(''), '55')
assert.equal(spec.objects.filter(object => object.label).length, 25)
assert.deepEqual(spec.display.widths, [331, 350, 360])
assert.equal(spec.display.minTextPx, 16)
assert.equal(spec.assertions.some(item => item.type === 'objectCount'), false)

const executablePath = [chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .find(candidate => fs.existsSync(candidate))
assert.ok(executablePath, 'existing headless browser binary')
const browser = await chromium.launch({headless: true, executablePath})
let result
try {
  const page = await browser.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 1})
  await page.setContent(`<!doctype html><html><head><style>
    :root {--ld-figure-ink:#15201f;--ld-figure-accent:#15201f;--ld-figure-paper:#fff;}
    html,body {margin:0;background:#fff;}
    #media {width:350px;margin:20px;}
    #media svg {display:block;width:100%;height:auto;}
  </style></head><body><div id="media">${svgBytes.toString('utf8')}</div></body></html>`)
  result = await page.evaluate(({labels, strokes}) => {
    const svg = document.querySelector('#media svg')
    const tolerance = 0.02
    const require = (condition, message) => {if (!condition) throw new Error(message)}
    const actualLabels = [...svg.querySelectorAll('text')]
    require(actualLabels.length === labels.length, 'source-only label set')
    const labelChecks = labels.map(object => {
      const node = svg.querySelector(`[data-label-id="${object.id}-label"]`)
      require(node?.textContent === object.label, `source label ${object.id}`)
      const x = Number(node.getAttribute('x'))
      const y = Number(node.getAttribute('y'))
      require(Math.abs(x - object.at[0]) < tolerance, `label column ${object.id}`)
      require(Math.abs(y - (424 - object.at[1])) < tolerance, `label baseline ${object.id}`)
      const matrix = node.getScreenCTM()
      const finalPx = Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b)
      require(finalPx >= 16, `mobile text size ${object.id}`)
      return {id: object.id, text: node.textContent, x, y, finalPx}
    })
    const strokeChecks = strokes.map(object => {
      const node = svg.querySelector(`[id$="ld-${object.id}"]`)
      require(node?.tagName.toLowerCase() === 'line', `rendered stroke ${object.id}`)
      const x1 = Number(node.getAttribute('x1'))
      const y1 = Number(node.getAttribute('y1'))
      const x2 = Number(node.getAttribute('x2'))
      const y2 = Number(node.getAttribute('y2'))
      for (const [actual, expected] of [
        [x1, object.from[0]], [y1, 424 - object.from[1]],
        [y2, 424 - object.to[1]]
      ]) require(Math.abs(actual - expected) < tolerance, `stroke endpoint ${object.id}`)
      let arrowTip = null
      if (object.type === 'arrow') {
        require(x2 > x1 && Math.abs(y2 - y1) < tolerance, `rightward arrow ${object.id}`)
        const head = svg.querySelector(`[data-arrowhead-for="${node.id}"]`)
        require(head?.children.length > 0, `materialized arrowhead ${object.id}`)
        require(/rotate\(0\)/.test(head.getAttribute('transform')), `rightward arrowhead ${object.id}`)
        // JSXGraph shortens the shaft; the materialized head carries the tip.
        const box = head.getBBox()
        const transform = svg.getCTM().inverse().multiply(head.getCTM())
        const tip = new DOMPoint(box.x + box.width, box.y + box.height / 2)
          .matrixTransform(transform)
        require(Math.abs(tip.x - object.to[0]) < 0.2, `arrow tip x ${object.id}`)
        require(Math.abs(tip.y - (424 - object.to[1])) < tolerance, `arrow tip y ${object.id}`)
        require(tip.x > x2, `arrowhead extends shortened shaft ${object.id}`)
        arrowTip = {x: tip.x, y: tip.y}
      } else {
        require(Math.abs(x2 - object.to[0]) < tolerance, `stroke endpoint ${object.id}`)
      }
      return {id: object.id, type: object.type, x1, y1, x2, y2, arrowTip}
    })
    const bounds = svg.getBoundingClientRect()
    require(Math.abs(bounds.width - 350) < tolerance, 'actual 350px media width')
    require(bounds.left >= 0 && bounds.right <= 390, 'mobile horizontal containment')
    return {
      actualMediaWidthPx: bounds.width,
      mediaHeightPx: bounds.height,
      minimumTextPx: Math.min(...labelChecks.map(item => item.finalPx)),
      labelChecks, strokeChecks,
      materializedRightwardArrowheads: svg.querySelectorAll('[data-arrowhead-for]').length
    }
  }, {
    labels: spec.objects.filter(object => object.label),
    strokes: spec.objects.filter(object => ['segment', 'arrow'].includes(object.type))
  })
  const pixels = await page.evaluate(async svg => {
    const image = new Image()
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = 350
    canvas.height = Math.round(424 * 350 / 360)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let nonwhite = 0
    let white = 0
    for (let index = 0; index < rgba.length; index += 4) {
      if (Math.min(rgba[index], rgba[index + 1], rgba[index + 2]) < 220) nonwhite += 1
      if (Math.min(rgba[index], rgba[index + 1], rgba[index + 2]) > 245) white += 1
    }
    if (nonwhite < 1000 || white < canvas.width * canvas.height * 0.8) {
      throw new Error('blank or dark raster')
    }
    return {width: canvas.width, height: canvas.height, nonwhite, white}
  }, svgBytes.toString('utf8'))
  result.rasterPixels = pixels
  await page.locator('#media').screenshot({
    path: path.join(out, 'tbl-p0056-01.mobile-350.png'), animations: 'disabled'
  })
} finally {
  await browser.close()
}
const currentInputs = context.files.map(file => {
  const bytes = fs.readFileSync(file.path)
  return {...file, currentBytes: bytes.length, currentSha256: digest(bytes),
    byteIdenticalToAuthorContext: digest(bytes) === file.sha256}
})
const currentLesson = JSON.parse(fs.readFileSync(context.files[1].path))
const currentParagraph = currentLesson.prose.find(item => item.source_refs?.includes('p0056#2'))
const normalizeMath = text => [...text.matchAll(/\$([^$]+)\$/g)]
  .map(match => match[1].replace(/\s+/g, ''))
assert.deepEqual(normalizeMath(currentParagraph.text), normalizeMath(context.figureParagraph.text),
  'current figure mathematics has not changed')
const observation = {
  schema: 'bounded-author-output-observation@1',
  classification: 'AUTHOR checks only; not independent figure review or lesson approval',
  figure: spec.id,
  sourceOnlyLabelsChecked: true,
  displayAssertions: result,
  inputBindingsAtObservation: currentInputs,
  currentFigureParagraphMathUnchanged: true,
  currentFigureParagraphText: currentParagraph.text,
  screenshot: {
    path: path.join(out, 'tbl-p0056-01.mobile-350.png'),
    sha256: digest(fs.readFileSync(path.join(out, 'tbl-p0056-01.mobile-350.png')))
  }
}
const outputPath = path.join(out, 'output-observation.first.json')
fs.writeFileSync(outputPath, `${JSON.stringify(observation, null, 2)}\n`, {flag: 'wx'})
fs.chmodSync(outputPath, 0o444)
console.log(JSON.stringify({
  observation: outputPath,
  mediaWidthPx: result.actualMediaWidthPx,
  minimumTextPx: result.minimumTextPx,
  materializedRightwardArrowheads: result.materializedRightwardArrowheads,
  screenshotSha256: observation.screenshot.sha256,
  inputByteIdentity: currentInputs.map(file => file.byteIdenticalToAuthorContext)
}))
