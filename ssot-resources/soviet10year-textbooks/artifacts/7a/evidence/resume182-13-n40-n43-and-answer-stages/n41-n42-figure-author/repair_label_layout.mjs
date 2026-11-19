import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const own = path.dirname(new URL(import.meta.url).pathname)
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
if (process.cwd() !== root) throw new Error('Exact checkout required')
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH,
  chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
if (!executablePath) throw new Error('Existing Chromium unavailable')
const browser = await chromium.launch({ executablePath, headless: true })
try {
  for (const figure of (process.argv.slice(2).length ? process.argv.slice(2) : ['fig-56', 'fig-57', 'fig-58'])) {
    if (!/^fig-5[678]$/.test(figure)) throw new Error('Invalid figure argument')
    const folder = path.join(own, figure)
    const firstSpec = path.join(folder, 'spec-bound-FIRST.json')
    const firstReport = path.join(folder, `${figure}-FIRST.render.json`)
    const firstSvg = path.join(folder, `${figure}-FIRST.svg`)
    const candidate = path.join(folder, 'spec-bound-REPAIR-1.json')
    const receipt = path.join(folder, 'label-layout-REPAIR-1.json')
    if (fs.existsSync(candidate) || fs.existsSync(receipt)) throw new Error('Preserve existing repair')
    const spec = JSON.parse(fs.readFileSync(firstSpec, 'utf8'))
    const report = JSON.parse(fs.readFileSync(firstReport, 'utf8'))
    if (report.status !== 'fail' || !report.collisions.length) throw new Error('Repair requires actual label failure')
    const labels = []
    for (const object of spec.objects) {
      if (object.type === 'axis') {
        object.ticks.forEach((tick, index) => labels.push({
          id: `${object.id}-tick-${index}-label`, objectId: object.id, tick: index,
          axis: object.id === 'source-x-axis' ? 'x' : 'y',
          placement: tick.labelPlacement, font: tick.fontSize || object.fontSize || 26,
        }))
      } else if (object.type === 'text') {
        labels.push({
          id: `${object.id}-label`, objectId: object.id,
          placement: object.labelPlacement || {}, font: object.fontSize || 28,
        })
      }
    }
    const page = await browser.newPage({
      viewport: { width: spec.canvas.width, height: spec.canvas.height }, deviceScaleFactor: 1,
    })
    await page.route('**/*', route => route.abort())
    await page.setContent(fs.readFileSync(firstSvg, 'utf8'))
    const solution = await page.evaluate(({ labels, width, height, points, boundingBox, minGap }) => {
      const positions = {
        CENTER: [0, 0, 'middle'], NE: [1, -1, 'start'], NW: [-1, -1, 'end'],
        SE: [1, 1, 'start'], SW: [-1, 1, 'end'], E: [1, 0, 'start'],
        W: [-1, 0, 'end'], N: [0, -1, 'middle'], S: [0, 1, 'middle'],
      }
      document.body.style.margin = '0'
      const svg = document.querySelector('svg')
      const geometry = [...svg.querySelectorAll('line,path,polygon,polyline,circle,ellipse,rect')]
        .filter(node => !node.closest('defs') && node.getAttribute('display') !== 'none'
          && node.getAttribute('stroke') !== 'none'
          && parseFloat(node.getAttribute('stroke-width') || '0') > 2.5)
      const inflate = rect => ({
        x: rect.x - minGap, y: rect.y - minGap,
        width: rect.width + 2 * minGap, height: rect.height + 2 * minGap,
      })
      const overlaps = (a, b) => Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x)
        && Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)
      const unit = Math.min(width / (boundingBox[2] - boundingBox[0]), height / (boundingBox[1] - boundingBox[3]))
      const pointRegions = points.map(point => ({
        x: (point.at[0] - boundingBox[0]) * unit - (point.size || 4) - 5,
        y: (boundingBox[1] - point.at[1]) * unit - (point.size || 4) - 5,
        width: 2 * ((point.size || 4) + 5), height: 2 * ((point.size || 4) + 5),
      }))
      const samples = geometry.map(node => {
        if (typeof node.getTotalLength !== 'function') return { id: node.id, points: [] }
        const length = node.getTotalLength()
        const count = Math.min(500, Math.max(2, Math.ceil(length / 4)))
        const matrix = node.getCTM()
        return {
          id: node.id,
          points: Array.from({ length: count + 1 }, (_, index) => {
            const point = node.getPointAtLength(length * index / count)
            const at = new DOMPoint(point.x, point.y).matrixTransform(matrix)
            return [at.x, at.y]
          }),
        }
      })
      const occupied = [...pointRegions]
      const updates = []
      const orderedLabels = [...labels].sort((a, b) => {
        const priority = label => label.axis === 'y' ? 0 : label.axis === 'x' ? 1 : 2
        return priority(a) - priority(b)
      })
      for (const definition of orderedLabels) {
        const node = [...svg.querySelectorAll('text')].find(item => item.getAttribute('data-label-id') === definition.id)
        if (!node) throw new Error(`Missing original label ${definition.id}`)
        const old = definition.placement
        const oldPosition = positions[old.position || 'CENTER']
        const oldGap = old.gap ?? Math.max(10, definition.font * 0.45)
        const oldOffset = old.offset || [0, 0]
        const anchor = [
          Number(node.getAttribute('x')) - oldPosition[0] * oldGap - oldOffset[0],
          Number(node.getAttribute('y')) - oldPosition[1] * oldGap - oldOffset[1],
        ]
        const available = definition.axis === 'x' ? ['S', 'N']
          : definition.axis === 'y' ? ['W', 'E']
            : ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW']
        const candidates = [old, ...[10, 14, 18, 22, 26, 30, 36, 42, 48, 56, 64, 72, 80, 88, 96].flatMap(gap =>
          available.map(position => ({ position, gap, offset: [0, 0] })))]
        let selected = null
        const rejected = []
        for (const placement of candidates) {
          const [dx, dy, textAnchor] = positions[placement.position]
          const gap = placement.gap ?? Math.max(10, definition.font * 0.45)
          const offset = placement.offset || [0, 0]
          node.setAttribute('x', String(anchor[0] + dx * gap + offset[0]))
          node.setAttribute('y', String(anchor[1] + dy * gap + offset[1]))
          node.setAttribute('text-anchor', textAnchor)
          const rect = inflate(node.getBBox())
          const hit = samples.filter(item => item.points.some(([x, y]) =>
            x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height))
          const occupiedHit = occupied.some(other => overlaps(rect, other))
          const outside = rect.x < 0 || rect.y < 0 || rect.x + rect.width > width || rect.y + rect.height > height
          if (!hit.length && !occupiedHit && !outside) {
            selected = { placement, rect }
            break
          }
          rejected.push({ placement, strokeIds: hit.map(item => item.id), occupiedHit, outside })
        }
        if (!selected) throw new Error(`No constrained placement for ${definition.id}: ${JSON.stringify(rejected)}`)
        occupied.push(selected.rect)
        if (JSON.stringify(selected.placement) !== JSON.stringify(old)) {
          updates.push({
            id: definition.id, objectId: definition.objectId, tick: definition.tick,
            before: old, after: selected.placement,
            originalStrokeHits: rejected[0]?.strokeIds || [],
            axisAlignmentPreserved: definition.axis ? true : null,
          })
        }
      }
      return updates
    }, {
      labels, width: spec.canvas.width, height: spec.canvas.height,
      boundingBox: spec.canvas.boundingBox, minGap: spec.layout.minLabelGap,
      points: spec.objects.filter(object => object.type === 'point' && object.visible !== false),
    })
    const repaired = structuredClone(spec)
    for (const update of solution) {
      const object = repaired.objects.find(item => item.id === update.objectId)
      if (update.tick !== undefined) object.ticks[update.tick].labelPlacement = update.after
      else object.labelPlacement = update.after
    }
    if (JSON.stringify(repaired.source) !== JSON.stringify(spec.source)
      || JSON.stringify(repaired.assertions) !== JSON.stringify(spec.assertions)
      || JSON.stringify(repaired.canvas) !== JSON.stringify(spec.canvas)) {
      throw new Error('Layout-only repair guard failed')
    }
    fs.writeFileSync(candidate, JSON.stringify(repaired, null, 2) + '\n', { flag: 'wx' })
    fs.writeFileSync(receipt, JSON.stringify({
      figure, cause: 'FIRST renderer detected actual label/stroke collisions.',
      firstSpec: { path: firstSpec, sha256: sha(firstSpec) },
      firstRender: { path: firstReport, sha256: sha(firstReport) },
      repairSpec: { path: candidate, sha256: sha(candidate) },
      changes: solution, geometryChanged: false, textChanged: false,
      method: 'Measured existing SVG label bounds/strokes to choose constrained placements; generated SVG was not edited. Axis x ticks retain their exact horizontal anchors and y ticks their exact vertical anchors.',
      standaloneValidatorExecuted: false, independentApproval: false,
    }, null, 2) + '\n', { flag: 'wx' })
    console.log(JSON.stringify({ figure, labelsAdjusted: solution.length, candidate }))
    await page.close()
  }
} finally {
  await browser.close()
}
