import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { O, W, SOURCE, hash, read, bind, destination, write, command } from './author.mjs'
import { verifyCurrent } from './rebind.mjs'

verifyCurrent()
const bindings = read(`${O}/context-rebind.json`)
const close = (a, b, epsilon = 0.00001) => assert(Math.abs(a - b) < epsilon, `${a} != ${b}`)
const difference = (a, b) => a.map((value, i) => value - b[i])
const dot = (a, b) => a.reduce((total, value, i) => total + value * b[i], 0)
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const refs = {
  displacement: ['from', 'to'], connects: ['from', 'to'], collinear: ['a', 'b', 'c'],
  parallel: ['a', 'b', 'c', 'd'], perpendicular: ['a', 'b', 'c', 'd'],
  pointOnLine: ['point', 'a', 'b'], pointOnCircle: ['point', 'center'], distance: ['a', 'b'],
}
const checks = []
for (const figure of bindings.figures) {
  const { id, stage } = figure
  const spec = read(`${stage}/${id}.spec.json`)
  const report = read(`${stage}/${id}.render.json`)
  const geometry = read(`${O}/${id}/geometry-definition.json`)
  const objects = new Map(spec.objects.map(object => [object.id, object]))
  const at = id => objects.get(id).at
  const mapped = new Set(spec.source.inventory.flatMap(group => group.objects))
  assert.deepEqual(mapped, new Set(objects.keys()))
  const coverage = []
  for (const group of spec.source.inventory) {
    const groupPoints = new Set(group.objects.filter(id => objects.get(id).type === 'point'))
    const groupAssertions = spec.assertions.filter(item => group.assertions.includes(item.id))
    const covered = new Set()
    for (const item of groupAssertions) {
      const references = (refs[item.type] ?? []).map(key => item[key]).filter(ref => groupPoints.has(ref))
      const allNativePoints = (refs[item.type] ?? []).map(key => item[key]).filter(ref => objects.get(ref)?.type === 'point')
      if (new Set(references).size >= 2 && allNativePoints.every(ref => groupPoints.has(ref))) {
        references.forEach(ref => covered.add(ref))
      }
    }
    assert.deepEqual(covered, groupPoints)
    coverage.push({ group: group.id, pointCount: groupPoints.size,
      withinGroupCoveredPointCount: covered.size, assertionCount: groupAssertions.length })
  }
  assert.equal(report.status, 'pass')
  assert.equal(report.labels, 0)
  assert.equal(report.collisions.length, 0)
  assert.equal(report.spec.sha256, hash(`${stage}/${id}.spec.json`))
  assert.equal(report.output.svg.sha256, hash(`${stage}/${id}.svg`))
  assert(!spec.objects.some(item => ['text', 'grid', 'axis', 'image', 'svgPath', 'measure'].includes(item.type)))
  assert(!spec.objects.some(item => item.label || item.text || item.ticks))
  for (const object of spec.objects.filter(item => ['arrow', 'segment'].includes(item.type))) {
    assert(spec.assertions.some(item => item.type === 'connects' && item.arrow === object.id
      && item.from === object.from && item.to === object.to))
  }
  let relationships
  if (id === 'fig-73') {
    const planeChecks = geometry.fronts.map(front => {
      const x = at(front.top)[0]
      const defining = [front.top, front.bottom, ...front.intersections]
      defining.forEach(p => close(at(p)[0], x))
      const normal = [1, 0, 0]
      const pointInPlane = p => [at(p)[0], at(p)[1], 0]
      const origin = pointInPlane(front.top)
      for (const p of defining) close(dot(normal, difference(pointInPlane(p), origin)), 0)
      geometry.rays.forEach((ray, i) => {
        const p = at(front.intersections[i])
        const [from, to] = [at(ray.from), at(ray.to)]
        close(p[1], from[1])
        close(from[1], to[1])
        assert(from[0] < p[0] && p[0] < to[0])
        close(dot(difference(at(front.bottom), at(front.top)), difference(to, from)), 0)
        assert(to[0] > from[0])
      })
      return { x, definingPointIds: defining, commonPlaneEquation: `x = ${x}`, normal,
        allFiveRayIntersectionsConnectedAndNormal: true }
    })
    assert.equal(planeChecks.length, 7)
    assert.equal(geometry.rays.length, 5)
    relationships = { planeChecks, checkedCrossings: 35,
      interpretation: 'Each section trace extends to a parallel equal-phase plane; the representative points lie in that plane. This is not a claim that distinct wavefront planes are coplanar.' }
  } else if (id === 'fig-74') {
    const rodDirection = difference(at(geometry.rodBottom), at(geometry.rodTop))
    const left = []; const right = []
    const planarPoints = []
    geometry.waves.forEach((wave, i) => {
      const from = at(wave.top); const to = at(wave.bottom)
      close(cross(difference(to, from), rodDirection), 0)
      close(cross(difference(at(wave.middle), from), difference(to, from)), 0)
      const y = at(wave.middle)[1]
      const t = (y - at(geometry.rodTop)[1]) / rodDirection[1]
      const rodX = at(geometry.rodTop)[0] + t * rodDirection[0]
      ;(at(wave.middle)[0] < rodX ? left : right).push(i + 1)
      for (const p of [wave.top, wave.middle, wave.bottom]) {
        const [x, y] = at(p)
        const v = (238 - y) / 126
        const u = x + 60 * v - 166
        close(166 + u - 60 * v, x)
        close(238 - 126 * v, y)
        const lifted = [u, v, 0]
        close(dot([0, 0, 1], lifted), 0)
        planarPoints.push({ point: p, surfaceCoordinates: lifted })
      }
    })
    assert.deepEqual(left, [1, 2, 3])
    assert.deepEqual(right, Array.from({ length: 13 }, (_, i) => i + 4))
    for (const p of [geometry.rodTop, geometry.rodMiddle, geometry.rodBottom, geometry.contact]) {
      const [x, y] = at(p)
      const v = (238 - y) / 126
      const u = x + 60 * v - 166
      close(dot([0, 0, 1], [u, v, 0]), 0)
      planarPoints.push({ point: p, surfaceCoordinates: [u, v, 0] })
    }
    const polygon = objects.get('source-left-entering-handle').points.map(at)
    const junction = at(geometry.contact)
    assert(junction[0] >= Math.min(...polygon.map(p => p[0])) && junction[0] <= Math.max(...polygon.map(p => p[0])))
    assert(junction[1] >= Math.min(...polygon.map(p => p[1])) && junction[1] <= Math.max(...polygon.map(p => p[1])))
    assert.deepEqual(at(geometry.frontWall[0]), at(geometry.rim[3]))
    assert.deepEqual(at(geometry.frontWall[1]), at(geometry.rim[2]))
    assert.deepEqual(at(geometry.rightWall[0]), at(geometry.rim[1]))
    assert.deepEqual(at(geometry.rightWall[3]), at(geometry.rim[2]))
    relationships = { parallelWaveCount: 16, leftOfRod: left, rightOfRod: right, planarPoints,
      handleAttachedToRod: true, trayWallRimConnections: 4, waterNormal: [0, 0, 1],
      interpretation: 'All lifted water wave and contact-rod points use one affine surface plane z=0. The inverse projection verifies shared planar geometry, not an experimental depth or bulk shear-wave claim.' }
  } else {
    const center = at(geometry.center)
    const intersections = []
    for (const front of geometry.fronts) {
      const circle = objects.get(front.id)
      assert.equal(circle.center, geometry.center)
      close(circle.radius, front.radius)
      front.intersections.forEach((p, i) => {
        const radial = difference(at(p), center)
        close(Math.hypot(...radial), circle.radius)
        const ray = geometry.rays[i]
        const direction = difference(at(ray.to), at(ray.from))
        close(cross(radial, direction), 0)
        assert(dot(radial, direction) > 0)
        const tangent = [-radial[1], radial[0]]
        close(dot(radial, tangent), 0)
        assert(Math.hypot(...difference(at(ray.from), center)) < circle.radius)
        assert(Math.hypot(...difference(at(ray.to), center)) > circle.radius)
        intersections.push({ circle: front.id, point: p, ray: `source-ray-${i + 1}`, radialNormal: true })
      })
    }
    for (const ray of geometry.rays) {
      close(Math.hypot(...difference(at(ray.from), center)), 48)
      close(Math.hypot(...difference(at(ray.to), center)), 302)
      assert(dot(difference(at(ray.from), center), difference(at(ray.to), at(ray.from))) > 0)
    }
    const light = objects.get('source-sphere-light-patch')
    assert(Math.hypot(...difference(light.center, center)) + light.radius < 48)
    assert.equal(spec.objects.filter(item => item.type === 'arc' && item.dash === 2).length, 2)
    relationships = { center, concentricFrontRadii: geometry.fronts.map(front => front.radius),
      rayCount: 8, checkedRadialNormalConnections: intersections, whitePatchInsideSphere: true,
      alternatePulseOutlines: 1, nativeSemicirclesForPulse: 2,
      interpretation: 'Four circular sections of spherical wavefronts share the source center. Their representative sections share the drawing plane; physical spherical wavefronts are not declared coplanar.' }
  }
  checks.push({ figure: id, status: 'pass', spec: figure.spec, coverage,
    sourceFacts: read(`${O}/${id}/source-inventory.json`).sourceFacts, relationships,
    labelMinimum: 'not applicable: no visible or source labels; none invented',
    geometryGateRuns: 1, independentReview: false })
}
write('receipts/geometric-relationships.json', { status: 'pass', checks,
  scope: 'Executable author coverage and source-bound geometry checks, not independent SCI or visual approval.' })

const require = createRequire(`${W}/.agents/skills/package.json`)
const { chromium } = require('playwright-core')
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(fs.existsSync)
assert(executablePath)
const browser = await chromium.launch({ executablePath, headless: false,
  env: { ...process.env, TMPDIR: `${O}/runtime/` } })
const previews = []
try {
  for (const figure of bindings.figures) {
    const { id, stage } = figure
    const spec = read(`${stage}/${id}.spec.json`)
    const svg = fs.readFileSync(`${stage}/${id}.svg`, 'utf8')
    const page = await browser.newPage({ viewport: { width: 999, height: 720 }, deviceScaleFactor: 1 })
    const errors = []; const requests = []
    page.on('pageerror', error => errors.push(String(error)))
    page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()) })
    await page.setContent('<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:white}body{padding:16px}.preview{display:grid;grid-template-columns:640px 295px;gap:32px;width:967px;align-items:start}iframe{border:0;display:block}</style><div class="preview" data-testid="preview"></div>')
    await page.locator('[data-testid="preview"]').evaluate((host, data) => {
      for (const width of [640, 295]) {
        const frame = document.createElement('iframe')
        frame.id = `media-${width}`
        frame.width = String(width)
        frame.height = String(Math.ceil(width * data.height / 640))
        frame.srcdoc = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:white}svg{display:block;width:100%;height:auto}</style>${data.svg}`
        host.appendChild(frame)
      }
    }, { svg, height: spec.canvas.height })
    const sizes = []
    for (const width of [640, 295]) {
      const frame = page.frameLocator(`#media-${width}`)
      await frame.locator('svg').waitFor({ state: 'visible' })
      const observed = await frame.locator('svg').evaluate(svg => {
        const rect = svg.getBoundingClientRect()
        const visible = [...svg.querySelectorAll('path,polygon,line,polyline,circle,ellipse')]
          .filter(node => !node.closest('defs') && getComputedStyle(node).display !== 'none')
        const outside = visible.map(node => {
          const box = node.getBoundingClientRect()
          return { id: node.id, outside: box.left < rect.left - 0.1 || box.right > rect.right + 0.1
            || box.top < rect.top - 0.1 || box.bottom > rect.bottom + 0.1 }
        }).filter(item => item.outside)
        return { mediaWidth: rect.width, mediaHeight: rect.height, labels: svg.querySelectorAll('text').length,
          arrowheads: svg.querySelectorAll('[data-arrowhead-for]').length,
          dashedPaths: [...svg.querySelectorAll('path')].filter(node => node.getAttribute('stroke-dasharray')).length,
          foreignObjects: svg.querySelectorAll('foreignObject').length, geometryCount: visible.length,
          clipped: outside, horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth }
      })
      close(observed.mediaWidth, width)
      close(observed.mediaHeight, width * spec.canvas.height / 640)
      assert.equal(observed.labels, 0)
      assert.equal(observed.arrowheads, id === 'fig-73' ? 5 : id === 'fig-75' ? 8 : 0)
      assert.equal(observed.foreignObjects, 0)
      assert(observed.geometryCount > 20)
      assert.equal(observed.clipped.length, 0)
      assert.equal(observed.horizontalOverflow, false)
      if (id === 'fig-75') assert.equal(observed.dashedPaths, 2)
      sizes.push(observed)
    }
    assert.equal(errors.length, 0)
    assert.equal(requests.length, 0)
    const screenshot = destination(`${id}/preview/${id}.final-640-and-295.png`)
    await page.locator('[data-testid="preview"]').screenshot({ path: screenshot, animations: 'disabled' })
    const bytes = fs.readFileSync(screenshot)
    assert.equal(bytes.readUInt32BE(16), 967)
    assert.equal(bytes.readUInt32BE(20), spec.canvas.height)
    previews.push({ figure: id, screenshot: bind(screenshot), dimensions: [967, spec.canvas.height],
      widths: sizes, spec: figure.spec, svg: figure.svg, errors, externalRequests: requests,
      headed: true, svgUnmodified: hash(`${stage}/${id}.svg`) === figure.svg.sha256,
      initialFinalSvgEqual: hash(`${stage}/${id}.svg`) === hash(`${O}/${id}/initial/${id}.svg`),
      mobileWidthScope: 'Actual isolated SVG media width 295px. Product card/offline lesson not opened.',
      scrollEnd: 'not applicable: validated natural inline figure without horizontal overflow' })
    await page.close()
  }
} finally {
  await browser.close()
}
write('receipts/actual-inline-display.json', { status: 'pass', executablePath, previews,
  screenshotsCaptured: 3, visualImageOpensNotYetRecorded: true,
  noProductOrWholeCardAcceptance: true })

const pixels = command('preview-pixels', `${W}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, [
  '-c',
  'from PIL import Image; import json,sys\nout=[]\nfor p in sys.argv[1:]:\n im=Image.open(p).convert("RGB"); regions=[]\n for x,w in [(0,640),(672,295)]:\n  h=round(im.height*w/640); crop=im.crop((x,0,x+w,h)); dark=sum(1 for r,g,b in crop.getdata() if max(r,g,b)<220); regions.append({"width":w,"height":h,"darkPixels":dark,"totalPixels":w*h})\n out.append({"path":p,"width":im.width,"height":im.height,"regions":regions})\nprint(json.dumps(out))',
  ...previews.map(item => item.screenshot.path),
])
assert.equal(pixels.status, 0, pixels.stderr)
const pixelChecks = JSON.parse(pixels.stdout)
assert(pixelChecks.every(image => image.regions.every(region =>
  region.darkPixels > region.totalPixels * 0.002 && region.darkPixels < region.totalPixels * 0.2)))
write('receipts/raster-nonblank.json', { status: 'pass', images: pixelChecks,
  scope: 'Nonblank/nonblack raster checks at both actual widths; not source fidelity by themselves.' })
verifyCurrent()
console.log(JSON.stringify({ status: 'author-geometry-and-headed-inline-pass', previews: previews.map(item => item.screenshot.path) }))
