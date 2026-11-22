import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { owned, repo, write } from './evidence.mjs'
const { chromium } = createRequire(path.join(repo, 'app/package.json'))('playwright')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 400 } })
  await page.route('**/*', (route) => route.abort())
  await page.setContent(fs.readFileSync(owned('display/fig-187.html'), 'utf8'))
  const result = await page.evaluate(() => {
    const svg = document.querySelector('.sr-figure-media svg')
    const line = document.getElementById('ld-fig-187_ld-left-h-bracket-start-tick')
    const mr = svg.getBoundingClientRect()
    const plain = (matrix) => ({ a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f })
    const point = svg.createSVGPoint()
    point.x = line.x1.baseVal.value
    point.y = line.y1.baseVal.value
    const actual = point.matrixTransform(line.getScreenCTM())
    const rootExpected = point.matrixTransform(svg.getScreenCTM())
    const endPoint = svg.createSVGPoint()
    endPoint.x = line.x2.baseVal.value
    endPoint.y = line.y2.baseVal.value
    const actualEnd = endPoint.matrixTransform(line.getScreenCTM())
    const intendedEnd = svg.createSVGPoint()
    intendedEnd.x = 141
    intendedEnd.y = 200
    const matrixEnd = intendedEnd.matrixTransform(svg.getScreenCTM())
    return {
      nativeEndpoints: [line.x1.baseVal.value, line.y1.baseVal.value, line.x2.baseVal.value, line.y2.baseVal.value],
      intendedFirstEndpoint: [141, 207], mediaRect: { x: mr.x, y: mr.y, width: mr.width, height: mr.height },
      lineCTM: plain(line.getScreenCTM()), rootCTM: plain(svg.getScreenCTM()),
      actual: { x: actual.x - mr.x, y: actual.y - mr.y },
      expectedFromBoundingRectRatio: { x: 141 * mr.width / 960, y: 207 * mr.height / 480 },
      expectedThroughActualSvgMatrix: { x: rootExpected.x - mr.x, y: rootExpected.y - mr.y },
      actualEnd: { x: actualEnd.x - mr.x, y: actualEnd.y - mr.y },
      expectedEndFromRatio: { x: 141 * mr.width / 960, y: 200 * mr.height / 480 },
      expectedEndThroughActualSvgMatrix: { x: matrixEnd.x - mr.x, y: matrixEnd.y - mr.y },
      actualEndRatioError: Math.abs(actualEnd.y - mr.y - 200 * mr.height / 480),
      actualEndMatrixError: Math.abs(actualEnd.y - matrixEnd.y),
    }
  })
  write('display/endpoint-diagnosis-detail.json', result)
  console.log(JSON.stringify(result, null, 2))
} finally {
  await browser.close()
}
