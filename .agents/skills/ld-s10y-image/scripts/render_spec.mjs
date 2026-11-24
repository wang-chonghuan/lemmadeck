#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright-core'
import { materializeArrowheads } from './materialize_arrowheads.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const skillDir = path.dirname(scriptDir)
const skillsDir = path.dirname(skillDir)
const validator = path.join(scriptDir, 'validate_spec.py')
const jsxgraphPath = path.join(
  skillsDir,
  'node_modules',
  'jsxgraph',
  'distrib',
  'jsxgraphcore.js',
)
const jsxgraphCssPath = path.join(
  skillsDir,
  'node_modules',
  'jsxgraph',
  'distrib',
  'jsxgraph.css',
)
const FIGURE_SPEC_SCHEMA = 'ld-s10y-image/figure-spec@2'
const RENDER_SCHEMA = 'ld-s10y-image/render@2'

function parseArgs(argv) {
  const result = {}
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index]
    if (!key.startsWith('--')) {
      throw new Error(`unexpected argument: ${key}`)
    }
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`missing value for ${key}`)
    }
    result[key.slice(2)] = value
    index += 1
  }
  if (!result.spec || (!result.svg && !result.png && !result.artwork)) {
    throw new Error(
      'usage: render_spec.mjs --spec spec.json [--svg out.svg] ' +
      '[--artwork artwork.png] [--png preview.png] [--report render.json]',
    )
  }
  return result
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true })
}

function validateSpec(specPath) {
  const result = spawnSync(
    process.env.PYTHON || 'python3',
    [validator, specPath, '--stage', 'draft', '--json'],
    { encoding: 'utf8' },
  )
  if (result.status !== 0) {
    const detail = result.stdout.trim() || result.stderr.trim()
    throw new Error(`FigureSpec validation failed:\n${detail}`)
  }
}

function imageMime(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  if (extension === '.png') return 'image/png'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.webp') return 'image/webp'
  throw new Error(`unsupported artwork format: ${filePath}`)
}

function embedAssets(spec) {
  const assets = new Map()
  for (const asset of spec.assets || []) {
    const assetPath = path.isAbsolute(asset.path)
      ? asset.path
      : path.resolve(asset.path)
    if (!fs.existsSync(assetPath)) {
      throw new Error(`missing artwork asset: ${assetPath}`)
    }
    const data = fs.readFileSync(assetPath).toString('base64')
    assets.set(asset.id, {
      ...asset,
      dataUri: `data:${imageMime(assetPath)};base64,${data}`,
    })
  }
  return {
    ...spec,
    assets: [...assets.values()],
    objects: spec.objects.map((object) => (
      object.type === 'image'
        ? { ...object, dataUri: assets.get(object.asset)?.dataUri }
        : object
    )),
  }
}

function portablePath(filePath) {
  const absolute = path.resolve(filePath)
  const relative = path.relative(process.cwd(), absolute)
  return relative.startsWith('..') ? absolute : relative || '.'
}

function rendererBoardId(figureId) {
  return `ld-${String(figureId).replace(/[^A-Za-z0-9_-]/g, '-')}`
}

function chromeExecutable() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    chromium.executablePath(),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)
  const executable = candidates.find((candidate) => fs.existsSync(candidate))
  if (!executable) {
    throw new Error(
      'Chrome/Chromium not found; set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH',
    )
  }
  return executable
}

async function render(spec, output) {
  const boardId = rendererBoardId(spec.id)
  const browser = await chromium.launch({
    executablePath: chromeExecutable(),
    headless: true,
  })
  try {
    const page = await browser.newPage({
      viewport: {
        width: spec.canvas.width,
        height: spec.canvas.height,
      },
      deviceScaleFactor: 1,
    })
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            :root {
              --ld-figure-ink: #15201f;
              --ld-figure-muted: #4c5a58;
              --ld-figure-accent: #15201f;
              --ld-figure-accent-soft: #8a9795;
              --ld-figure-grid: #e3eae9;
              --ld-figure-paper: #ffffff;
            }
            html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
            #${boardId} {
              width: ${spec.canvas.width}px;
              height: ${spec.canvas.height}px;
              background: ${
                spec.canvas.background === 'transparent'
                  ? 'transparent'
                  : 'var(--ld-figure-paper)'
              };
              border: 0;
            }
          </style>
        </head>
        <body><div id="${boardId}" class="jxgbox"></div></body>
      </html>
    `)
    await page.addStyleTag({ path: jsxgraphCssPath })
    await page.addScriptTag({ path: jsxgraphPath })
    await page.addScriptTag({
      content: `window.materializeArrowheads = ${materializeArrowheads.toString()}`,
    })

    const result = await page.evaluate(({ figureSpec, boardId }) => {
      const SVG_NS = 'http://www.w3.org/2000/svg'
      const palette = {
        ink: 'var(--ld-figure-ink, #15201f)',
        muted: 'var(--ld-figure-muted, #4c5a58)',
        accent: 'var(--ld-figure-accent, #15201f)',
        accentSoft: 'var(--ld-figure-accent-soft, #8a9795)',
        grid: 'var(--ld-figure-grid, #e3eae9)',
        paper: 'var(--ld-figure-paper, #ffffff)',
      }
      const box = figureSpec.canvas.boundingBox
      const board = JXG.JSXGraph.initBoard(boardId, {
        boundingbox: box,
        axis: false,
        grid: false,
        keepaspectratio: figureSpec.canvas.keepAspectRatio !== false,
        pan: { enabled: false },
        zoom: { enabled: false },
        showNavigation: false,
        showCopyright: false,
        renderer: 'svg',
      })
      board.suspendUpdate()

      const elements = new Map()
      const definitions = new Map(
        figureSpec.objects.map((object) => [object.id, object]),
      )
      const labels = []
      const visiblePoints = []
      const imageRegions = []
      const rawPaths = []

      const pointValue = (value) => {
        if (Array.isArray(value)) return value
        const definition = definitions.get(value)
        if (definition?.type === 'point') return definition.at
        throw new Error(`unresolved point: ${String(value)}`)
      }
      const jsxPoint = (value) => {
        if (typeof value === 'string' && elements.has(value)) {
          return elements.get(value)
        }
        return pointValue(value)
      }
      const color = (value, fallback) => palette[value] || fallback
      const lineStyle = (object, fallback = palette.ink) => ({
        fixed: true,
        highlight: false,
        strokeColor: color(object.stroke, fallback),
        strokeWidth: object.strokeWidth || 3,
        dash: object.dash || 0,
        opacity: object.opacity ?? 1,
      })
      const addLabel = (object, at, text = object.label) => {
        if (!text) return
        labels.push({
          id: `${object.id}-label`,
          at: pointValue(at),
          text,
          placement: object.labelPlacement || {},
          fontSize: object.fontSize || 28,
          fontWeight: object.fontWeight || 600,
          fill: color(object.labelColor, palette.ink),
          textAnchor: object.textAnchor,
          dominantBaseline: object.dominantBaseline || 'middle',
        })
      }
      const createSegment = (id, from, to, style) => {
        const segment = board.create('segment', [jsxPoint(from), jsxPoint(to)], {
          id: `ld-${id}`,
          ...style,
        })
        elements.set(id, segment)
        return segment
      }

      for (const object of figureSpec.objects) {
        if (object.type === 'point') {
          const point = board.create('point', object.at, {
            id: `ld-${object.id}`,
            name: '',
            withLabel: false,
            fixed: true,
            highlight: false,
            visible: object.visible !== false,
            face: object.face || 'o',
            size: object.size || 4,
            strokeWidth: object.strokeWidth || 2,
            strokeColor: color(object.stroke, palette.accent),
            fillColor: color(object.fill, palette.accent),
          })
          elements.set(object.id, point)
          if (object.visible !== false) {
            visiblePoints.push({ at: object.at, radius: (object.size || 4) + 5 })
          }
          addLabel(object, object.at)
        } else if (object.type === 'segment') {
          createSegment(
            object.id,
            object.from,
            object.to,
            lineStyle(object),
          )
          addLabel(object, [
            (pointValue(object.from)[0] + pointValue(object.to)[0]) / 2,
            (pointValue(object.from)[1] + pointValue(object.to)[1]) / 2,
          ])
        } else if (object.type === 'line') {
          const line = board.create('line', [
            jsxPoint(object.from),
            jsxPoint(object.to),
          ], {
            id: `ld-${object.id}`,
            straightFirst: true,
            straightLast: true,
            ...lineStyle(object),
          })
          elements.set(object.id, line)
        } else if (object.type === 'arrow') {
          const arrow = board.create('arrow', [
            jsxPoint(object.from),
            jsxPoint(object.to),
          ], {
            id: `ld-${object.id}`,
            ...lineStyle(object, palette.accent),
          })
          elements.set(object.id, arrow)
        } else if (object.type === 'circle') {
          const circle = board.create('circle', [
            jsxPoint(object.center),
            object.radius,
          ], {
            id: `ld-${object.id}`,
            fixed: true,
            highlight: false,
            strokeColor: color(object.stroke, palette.accent),
            strokeWidth: object.strokeWidth || 3,
            fillColor: color(object.fill, 'none'),
            fillOpacity: object.fillOpacity ?? 0,
          })
          elements.set(object.id, circle)
        } else if (object.type === 'polygon') {
          const polygon = board.create(
            'polygon',
            object.points.map(jsxPoint),
            {
              id: `ld-${object.id}`,
              fixed: true,
              highlight: false,
            fillColor: color(object.fill, palette.accentSoft),
              fillOpacity: object.fillOpacity ?? 0.15,
              vertices: { visible: false },
              borders: lineStyle(object),
            },
          )
          elements.set(object.id, polygon)
        } else if (object.type === 'arc') {
          const arcPoint = (value, role) => {
            if (typeof value === 'string') return jsxPoint(value)
            return board.create('point', pointValue(value), {
              id: `ld-${object.id}-${role}`,
              name: '',
              withLabel: false,
              visible: false,
              fixed: true,
              highlight: false,
            })
          }
          const arc = board.create('arc', [
            arcPoint(object.center, 'center'),
            arcPoint(object.start, 'start'),
            arcPoint(object.end, 'end'),
          ], {
            id: `ld-${object.id}`,
            ...lineStyle(object, palette.accent),
          })
          elements.set(object.id, arc)
        } else if (object.type === 'grid') {
          const [xMin, yMax, xMax, yMin] = object.bounds || box
          const xOffset = object.xOffset ?? 0
          const yOffset = object.yOffset ?? 0
          let index = 0
          for (
            let x = xOffset + (
              Math.ceil((xMin - xOffset) / object.xStep - 1e-9) * object.xStep
            );
            x <= xMax + 1e-9 && index < 500;
            x += object.xStep
          ) {
            createSegment(
              `${object.id}-v-${index}`,
              [x, yMin],
              [x, yMax],
              lineStyle(object, palette.grid),
            )
            index += 1
          }
          index = 0
          for (
            let y = yOffset + (
              Math.ceil((yMin - yOffset) / object.yStep - 1e-9) * object.yStep
            );
            y <= yMax + 1e-9 && index < 500;
            y += object.yStep
          ) {
            createSegment(
              `${object.id}-h-${index}`,
              [xMin, y],
              [xMax, y],
              lineStyle(object, palette.grid),
            )
            index += 1
          }
        } else if (object.type === 'axis') {
          createSegment(
            object.id,
            object.from,
            object.to,
            lineStyle(object, palette.ink),
          )
          const start = pointValue(object.from)
          const end = pointValue(object.to)
          const dx = end[0] - start[0]
          const dy = end[1] - start[1]
          const length = Math.hypot(dx, dy) || 1
          const normal = [-dy / length, dx / length]
          for (const [index, tick] of (object.ticks || []).entries()) {
            const at = Array.isArray(tick.at)
              ? tick.at
              : [start[0] + dx * tick.at, start[1] + dy * tick.at]
            const size = tick.size || object.tickSize || 0.12
            createSegment(
              `${object.id}-tick-${index}`,
              [at[0] - normal[0] * size, at[1] - normal[1] * size],
              [at[0] + normal[0] * size, at[1] + normal[1] * size],
              lineStyle(object, palette.ink),
            )
            if (tick.label !== undefined) {
              addLabel(
                {
                  id: `${object.id}-tick-${index}`,
                  labelPlacement: tick.labelPlacement || {
                    position: Math.abs(dx) >= Math.abs(dy) ? 'S' : 'E',
                  },
                  fontSize: tick.fontSize || object.fontSize || 26,
                  fontWeight: 600,
                  labelColor: object.labelColor,
                },
                at,
                String(tick.label),
              )
            }
          }
        } else if (object.type === 'measure') {
          const start = pointValue(object.from)
          const end = pointValue(object.to)
          createSegment(
            object.id,
            start,
            end,
            lineStyle(object, palette.accent),
          )
          const dx = end[0] - start[0]
          const dy = end[1] - start[1]
          const length = Math.hypot(dx, dy) || 1
          const normal = [-dy / length, dx / length]
          const size = object.capSize || 0.15
          for (const [index, at] of [start, end].entries()) {
            createSegment(
              `${object.id}-cap-${index}`,
              [at[0] - normal[0] * size, at[1] - normal[1] * size],
              [at[0] + normal[0] * size, at[1] + normal[1] * size],
              lineStyle(object, palette.accent),
            )
          }
          addLabel(object, [
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2,
          ])
        } else if (object.type === 'text') {
          addLabel(object, object.at, object.text)
        } else if (object.type === 'image') {
          if (!object.dataUri) throw new Error(`missing asset: ${object.asset}`)
          const image = board.create('image', [
            object.dataUri,
            object.at,
            object.size,
          ], {
            id: `ld-${object.id}`,
            fixed: true,
            highlight: false,
            opacity: object.opacity ?? 1,
          })
          if (object.rotation) {
            const center = board.create('point', object.rotation.center, {
              name: '',
              visible: false,
              fixed: true,
            })
            const transform = board.create('transform', [
              object.rotation.angleDegrees * Math.PI / 180,
              center,
            ], {
              type: 'rotate',
            })
            transform.bindTo(image)
          }
          elements.set(object.id, image)
          if (object.avoidLabels === true) {
            imageRegions.push([
              object.at[0],
              object.at[1] + object.size[1],
              object.at[0] + object.size[0],
              object.at[1],
            ])
          }
        } else if (object.type === 'svgPath') {
          rawPaths.push(object)
        }
      }

      board.unsuspendUpdate()
      board.fullUpdate()

      const svg = document.getElementById(boardId)?.querySelector('svg')
      if (!svg) throw new Error('JSXGraph did not create an SVG renderer')
      svg.setAttribute('xmlns', SVG_NS)
      svg.setAttribute('width', String(figureSpec.canvas.width))
      svg.setAttribute('height', String(figureSpec.canvas.height))
      svg.setAttribute(
        'viewBox',
        `0 0 ${figureSpec.canvas.width} ${figureSpec.canvas.height}`,
      )
      svg.style.background = figureSpec.canvas.background === 'transparent'
        ? 'transparent'
        : palette.paper

      const imageFits = figureSpec.objects
        .filter((object) => object.type === 'image')
        .map((object) => {
          const node = document.getElementById(`${boardId}_ld-${object.id}`)
          if (!node) {
            return {
              id: object.id,
              status: 'fail',
              reason: 'missing rendered image node',
            }
          }
          // JSXGraph defaults SVG images to preserveAspectRatio="none".
          // Treat FigureSpec size as a fit box and never distort artwork.
          node.setAttribute('preserveAspectRatio', 'xMidYMid meet')
          node.setAttribute('data-ld-layer', 'artwork')
          return {
            id: object.id,
            status: node.getAttribute('preserveAspectRatio') === 'xMidYMid meet'
              ? 'pass'
              : 'fail',
            preserveAspectRatio: node.getAttribute('preserveAspectRatio'),
          }
        })

      if (rawPaths.length) {
        const rawLayer = document.createElementNS(SVG_NS, 'g')
        rawLayer.setAttribute('id', `${boardId}-raw-path-layer`)
        const scaleX = figureSpec.canvas.width / (
          figureSpec.canvas.boundingBox[2] - figureSpec.canvas.boundingBox[0]
        )
        const scaleY = figureSpec.canvas.height / (
          figureSpec.canvas.boundingBox[1] - figureSpec.canvas.boundingBox[3]
        )
        rawLayer.setAttribute('transform', `scale(${scaleX} ${scaleY})`)
        for (const object of rawPaths) {
          const node = document.createElementNS(SVG_NS, 'path')
          node.setAttribute('d', object.d)
          node.setAttribute('fill', color(object.fill, 'none'))
          node.setAttribute('stroke', color(object.stroke, 'none'))
          node.setAttribute(
            'stroke-width',
            String(object.strokeWidth || 1),
          )
          node.setAttribute('vector-effect', 'non-scaling-stroke')
          const dashPatterns = [
            [2, 2], [5, 5], [10, 10], [20, 20],
            [20, 10, 10, 10], [20, 5, 10, 5], [0, 5],
          ]
          const dashPattern = dashPatterns[(object.dash || 0) - 1]
          if (dashPattern) {
            node.setAttribute(
              'stroke-dasharray',
              dashPattern.map(value => value * (object.strokeWidth || 1)).join(','),
            )
          }
          if (object.fillOpacity !== undefined) {
            node.setAttribute('fill-opacity', String(object.fillOpacity))
          }
          if (object.strokeOpacity !== undefined) {
            node.setAttribute('stroke-opacity', String(object.strokeOpacity))
          }
          rawLayer.appendChild(node)
        }
        svg.appendChild(rawLayer)
      }

      const toScreen = (at) => {
        const coords = new JXG.Coords(JXG.COORDS_BY_USER, at, board)
        return [coords.scrCoords[1], coords.scrCoords[2]]
      }
      const rectFromRegion = (region) => {
        const topLeft = toScreen([region[0], region[1]])
        const bottomRight = toScreen([region[2], region[3]])
        return {
          x: Math.min(topLeft[0], bottomRight[0]),
          y: Math.min(topLeft[1], bottomRight[1]),
          width: Math.abs(bottomRight[0] - topLeft[0]),
          height: Math.abs(bottomRight[1] - topLeft[1]),
        }
      }
      const layoutErrors = []
      const labelLayer = document.createElementNS(SVG_NS, 'g')
      labelLayer.setAttribute('id', `${boardId}-label-layer`)
      svg.appendChild(labelLayer)
      const geometryNodes = [...svg.querySelectorAll(
        'line, path, polygon, polyline, circle, ellipse, rect',
      )].filter((node) => (
        !node.closest('defs') &&
        node.getAttribute('display') !== 'none' &&
        node.getAttribute('stroke') !== 'none' &&
        Number.parseFloat(node.getAttribute('stroke-width') || '0') > 2.5
      ))

      const minGap = figureSpec.layout?.minLabelGap ?? 4
      const avoid = [
        ...visiblePoints.map((point) => {
          const [x, y] = toScreen(point.at)
          return {
            x: x - point.radius,
            y: y - point.radius,
            width: point.radius * 2,
            height: point.radius * 2,
          }
        }),
        ...imageRegions.map(rectFromRegion),
        ...(figureSpec.layout?.avoidRegions || []).map(rectFromRegion),
      ]

      const overlapArea = (a, b) => {
        const width = Math.max(
          0,
          Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
        )
        const height = Math.max(
          0,
          Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y),
        )
        return width * height
      }
      const inflate = (rect, amount) => ({
        x: rect.x - amount,
        y: rect.y - amount,
        width: rect.width + amount * 2,
        height: rect.height + amount * 2,
      })
      const strokeHitsRect = (node, rect) => {
        if (typeof node.getTotalLength !== 'function') return false
        let length
        try {
          length = node.getTotalLength()
        } catch {
          return false
        }
        if (!Number.isFinite(length) || length <= 0) return false
        const ctm = node.getCTM()
        const samples = Math.min(500, Math.max(2, Math.ceil(length / 4)))
        for (let index = 0; index <= samples; index += 1) {
          const point = node.getPointAtLength(length * index / samples)
          const transformed = ctm
            ? new DOMPoint(point.x, point.y).matrixTransform(ctm)
            : point
          if (
            transformed.x >= rect.x &&
            transformed.x <= rect.x + rect.width &&
            transformed.y >= rect.y &&
            transformed.y <= rect.y + rect.height
          ) {
            return true
          }
        }
        return false
      }
      const placements = {
        CENTER: [0, 0, 'middle'],
        NE: [1, -1, 'start'],
        NW: [-1, -1, 'end'],
        SE: [1, 1, 'start'],
        SW: [-1, 1, 'end'],
        E: [1, 0, 'start'],
        W: [-1, 0, 'end'],
        N: [0, -1, 'middle'],
        S: [0, 1, 'middle'],
      }
      const AUTOMATIC = ['NE', 'NW', 'SE', 'SW', 'E', 'W', 'N', 'S']
      // Concession ladder (STEMROBIN-192). The renderer used to score eight
      // candidate positions and then fail, leaving the model to guess new
      // coordinates — five round trips for one figure. Minimising over the three
      // concessions a human would make, in increasing order of cost, is the
      // search that was missing: shift the label, widen its gap, then pad the
      // canvas. Padding is last because it scales the whole figure down at a
      // fixed product width, so a margin is only accepted while the real
      // measured font size still clears display.minTextPx.
      const GAP_SCALES = [1, 1.5, 2.25, 3]
      const unsupported = new Set()

      // Every label is laid out from scratch for a given margin, so a margin
      // retry is not biased by the previous pass's occupied rectangles.
      const layoutLabels = (margin) => {
        while (labelLayer.firstChild) labelLayer.removeChild(labelLayer.firstChild)
        const canvasRect = {
          x: -margin,
          y: -margin,
          width: figureSpec.canvas.width + margin * 2,
          height: figureSpec.canvas.height + margin * 2,
        }
        const outsideArea = (rect) => {
          const clippedWidth = Math.max(
            0,
            Math.min(rect.x + rect.width, canvasRect.x + canvasRect.width) -
              Math.max(rect.x, canvasRect.x),
          )
          const clippedHeight = Math.max(
            0,
            Math.min(rect.y + rect.height, canvasRect.y + canvasRect.height) -
              Math.max(rect.y, canvasRect.y),
          )
          return rect.width * rect.height - clippedWidth * clippedHeight
        }
        const occupied = []
        const collisions = []
        const resolved = []
        for (const label of labels) {
          const node = document.createElementNS(SVG_NS, 'text')
          node.textContent = label.text
          node.setAttribute('fill', label.fill)
          node.setAttribute('font-family', 'Arial, Helvetica, sans-serif')
          node.setAttribute('font-size', String(label.fontSize))
          node.setAttribute('font-weight', String(label.fontWeight))
          node.setAttribute('dominant-baseline', label.dominantBaseline)
          node.setAttribute('data-label-id', label.id)
          labelLayer.appendChild(node)

          const [anchorX, anchorY] = toScreen(label.at)
          const baseGap = label.placement.gap ?? Math.max(10, label.fontSize * 0.45)
          const offset = label.placement.offset || [0, 0]
          const requested = label.placement.position
          // The requested position is tried first and kept when it is clean;
          // `fallback: false` no longer means "fail instead of looking".
          const positions = requested
            ? [requested, ...AUTOMATIC.filter((item) => item !== requested)]
            : AUTOMATIC
          let best = null
          const tried = []

          for (const gapScale of GAP_SCALES) {
            for (const position of positions) {
              if (!placements[position]) {
                unsupported.add(position)
                continue
              }
              const [xDirection, yDirection, anchor] = placements[position]
              const gap = baseGap * gapScale
              node.setAttribute(
                'x',
                String(anchorX + xDirection * gap + offset[0]),
              )
              node.setAttribute(
                'y',
                String(anchorY + yDirection * gap + offset[1]),
              )
              node.setAttribute('text-anchor', label.textAnchor || anchor)
              const rect = node.getBBox()
              const padded = inflate(rect, minGap)
              const overlap = [...avoid, ...occupied].reduce(
                (sum, other) => sum + overlapArea(padded, other),
                0,
              )
              const strokeCollision = geometryNodes.some(
                (geometry) => strokeHitsRect(geometry, padded),
              )
              const score =
                overlap +
                outsideArea(padded) * 100 +
                (strokeCollision ? 10000 : 0)
              tried.push({ position, gapScale, score: Math.round(score) })
              if (!best || score < best.score) {
                best = {
                  position,
                  gapScale,
                  x: node.getAttribute('x'),
                  y: node.getAttribute('y'),
                  anchor: label.textAnchor || anchor,
                  rect: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                  },
                  score,
                }
              }
            }
            // A clean placement at this gap is accepted; the wider gaps exist to
            // break a collision, not to spread labels that already fit.
            if (best && best.score <= 0.5) break
          }

          node.setAttribute('x', best.x)
          node.setAttribute('y', best.y)
          node.setAttribute('text-anchor', best.anchor)
          occupied.push(inflate(best.rect, minGap))
          resolved.push({
            id: label.id,
            text: label.text,
            position: best.position,
            gapScale: best.gapScale,
            score: Math.round(best.score * 1000) / 1000,
          })
          if (best.score > 0.5) {
            collisions.push({
              id: label.id,
              text: label.text,
              position: best.position,
              gapScale: best.gapScale,
              score: best.score,
              tried,
            })
          }
        }
        return { collisions, resolved }
      }

      const applyCanvas = (margin) => {
        const width = figureSpec.canvas.width + margin * 2
        const height = figureSpec.canvas.height + margin * 2
        svg.setAttribute('width', String(width))
        svg.setAttribute('height', String(height))
        svg.setAttribute('viewBox', `${-margin} ${-margin} ${width} ${height}`)
        return { width, height }
      }

      const measureDisplay = () => figureSpec.display.widths.map((width) => {
        const host = document.createElement('div')
        host.style.cssText =
          `position:absolute;left:-10000px;top:0;width:${width}px;overflow:visible`
        const candidate = svg.cloneNode(true)
        candidate.setAttribute('width', String(width))
        candidate.removeAttribute('height')
        candidate.style.width = `${width}px`
        candidate.style.height = 'auto'
        host.appendChild(candidate)
        document.body.appendChild(host)
        const textSizes = [...candidate.querySelectorAll('text')].map((node) => {
          const fontSize = Number.parseFloat(node.getAttribute('font-size') || '0')
          const matrix = node.getScreenCTM()
          const scale = matrix ? Math.hypot(matrix.a, matrix.b) : 0
          return {
            id: node.getAttribute('data-label-id'),
            text: node.textContent,
            px: fontSize * scale,
          }
        })
        const failures = textSizes.filter(
          (item) => item.px + 0.01 < figureSpec.display.minTextPx,
        )
        host.remove()
        return {
          width,
          minTextPx: figureSpec.display.minTextPx,
          measuredMinPx: textSizes.length
            ? Math.min(...textSizes.map((item) => item.px))
            : null,
          failures,
          status: failures.length ? 'fail' : 'pass',
        }
      })

      const span = Math.max(figureSpec.canvas.width, figureSpec.canvas.height)
      const margins = [0, ...(
        figureSpec.layout?.expandCanvas === false
          ? []
          : [0.08, 0.16, 0.25].map((ratio) => Math.round(span * ratio))
      )]
      const attempts = []
      let chosen = null
      for (const margin of margins) {
        const canvas = applyCanvas(margin)
        const { collisions, resolved } = layoutLabels(margin)
        const displayChecks = measureDisplay()
        const displayOk = displayChecks.every((item) => item.status === 'pass')
        attempts.push({
          margin,
          canvas,
          collisions: collisions.length,
          display: displayOk ? 'pass' : 'fail',
          labels: resolved,
        })
        if (!chosen) chosen = { margin, canvas, collisions, resolved, displayChecks }
        if (collisions.length === 0 && displayOk) {
          chosen = { margin, canvas, collisions, resolved, displayChecks }
          break
        }
      }
      // Re-apply the accepted margin: the loop may have moved past it while
      // testing a wider one that then failed the font-size check.
      applyCanvas(chosen.margin)
      const { collisions: finalCollisions, resolved: finalResolved } =
        layoutLabels(chosen.margin)
      const collisions = finalCollisions
      const layout = {
        resolution: {
          margin: chosen.margin,
          canvas: chosen.canvas,
          labels: finalResolved,
        },
        attempts,
      }
      for (const position of unsupported) {
        layoutErrors.push(`Unsupported label placement: ${position}`)
      }

      svg.querySelectorAll('foreignObject, script').forEach((node) => node.remove())
      window.materializeArrowheads(svg)
      const displayChecks = measureDisplay()
      const cloneFor = (layer) => {
        const clone = svg.cloneNode(true)
        clone.style.background = layer === 'composite'
          ? svg.style.background
          : 'transparent'
        if (layer === 'overlay') {
          clone.querySelectorAll('image').forEach((node) => node.remove())
        } else if (layer === 'artwork') {
          clone.querySelectorAll(
            'line, path, polygon, polyline, circle, ellipse, rect, text',
          ).forEach((node) => {
            if (!node.closest('defs')) node.remove()
          })
        }
        clone.querySelectorAll('foreignObject, script').forEach((node) => node.remove())
        return clone.outerHTML
      }
      return {
        svg: cloneFor(figureSpec.mode === 'hybrid' ? 'overlay' : 'composite'),
        compositeSvg: cloneFor('composite'),
        artworkSvg: figureSpec.mode === 'hybrid' ? cloneFor('artwork') : null,
        labels: labels.length,
        collisions,
        layout,
        layoutErrors,
        objects: figureSpec.objects.length,
        imageFits,
        displayChecks,
      }
    }, { figureSpec: spec, boardId })

    const screenshotSvg = async (svg, filePath, transparent) => {
      ensureParent(filePath)
      await page.setContent(`
        <!doctype html>
        <style>
          :root {
            --ld-figure-ink: #15201f;
            --ld-figure-muted: #4c5a58;
            --ld-figure-accent: #15201f;
            --ld-figure-accent-soft: #8a9795;
            --ld-figure-grid: #e3eae9;
            --ld-figure-paper: #ffffff;
          }
          html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
          body { background: ${transparent ? 'transparent' : '#ffffff'}; }
          svg { display: block; }
        </style>
        ${svg}
      `)
      await page.screenshot({
        path: filePath,
        type: 'png',
        omitBackground: transparent,
        animations: 'disabled',
      })
    }
    if (output.svg) {
      ensureParent(output.svg)
      fs.writeFileSync(output.svg, `${result.svg}\n`, 'utf8')
    }
    if (output.png) {
      await screenshotSvg(result.compositeSvg, output.png, false)
    }
    if (output.artwork) {
      await screenshotSvg(result.artworkSvg, output.artwork, true)
    }
    return result
  } finally {
    await browser.close()
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const specPath = path.resolve(args.spec)
  validateSpec(specPath)
  const rawSpec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
  if (rawSpec.schema !== FIGURE_SPEC_SCHEMA) {
    throw new Error(
      `renderer accepts only ${FIGURE_SPEC_SCHEMA}; migrate the source-first spec`,
    )
  }
  if (rawSpec.mode === 'generated') {
    throw new Error('generated mode must be produced with n-azure cap4')
  }
  const spec = embedAssets(rawSpec)
  if (spec.mode === 'deterministic' && !args.svg) {
    throw new Error('deterministic mode requires --svg')
  }
  if (spec.mode === 'hybrid' && (!args.svg || !args.artwork)) {
    throw new Error('hybrid mode requires --svg and --artwork')
  }
  const result = await render(spec, {
    svg: args.svg && path.resolve(args.svg),
    png: args.png && path.resolve(args.png),
    artwork: args.artwork && path.resolve(args.artwork),
  })
  const report = {
    schema: RENDER_SCHEMA,
    figure: spec.id,
    mode: spec.mode,
    renderer: {
      name: 'JSXGraph',
      version: JSON.parse(
        fs.readFileSync(
          path.join(skillsDir, 'node_modules', 'jsxgraph', 'package.json'),
          'utf8',
        ),
      ).version,
    },
    spec: {
      path: portablePath(specPath),
      sha256: sha256File(specPath),
    },
    output: {
      ...(spec.mode === 'deterministic'
        ? { svg: { path: portablePath(args.svg), sha256: sha256File(args.svg) } }
        : {}),
      ...(spec.mode === 'hybrid'
        ? {
            artwork: {
              path: portablePath(args.artwork),
              sha256: sha256File(args.artwork),
            },
            svg: {
              path: portablePath(args.svg),
              sha256: sha256File(args.svg),
            },
          }
        : {}),
    },
    assets: (spec.assets || []).map((asset) => ({
      id: asset.id,
      path: portablePath(asset.path),
      sha256: sha256File(asset.path),
      ...(asset.metadata
        ? {
            metadata: {
              path: portablePath(asset.metadata),
              sha256: sha256File(asset.metadata),
            },
          }
        : {}),
    })),
    theme: {
      roles: ['ink', 'muted', 'accent', 'accentSoft', 'grid', 'paper'],
      output: 'css-variables',
    },
    objects: result.objects,
    labels: result.labels,
    collisions: result.collisions,
    layout: result.layout,
    layoutErrors: result.layoutErrors,
    imageFits: result.imageFits,
    displayChecks: result.displayChecks,
    status: (
      result.collisions.length ||
      result.layoutErrors.length ||
      result.imageFits.some((item) => item.status !== 'pass') ||
      result.displayChecks.some((item) => item.status !== 'pass')
    ) ? 'fail' : 'pass',
  }
  if (args.report) {
    ensureParent(args.report)
    fs.writeFileSync(
      args.report,
      `${JSON.stringify(report, null, 2)}\n`,
      'utf8',
    )
  }
  if (report.status === 'fail') {
    console.error(JSON.stringify(report, null, 2))
    process.exitCode = 2
  } else {
    console.log(`PASS: ${spec.id} (${result.objects} objects, ${result.labels} labels)`)
  }
}

main().catch((error) => {
  console.error(`ERROR: ${error.message}`)
  process.exitCode = 1
})
