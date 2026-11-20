import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { chromium } from 'playwright-core'

const skill = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repo = path.resolve(skill, '../../..')

test('vector accents survive measurement and self-contained SVG image display', async () => {
  const directory = process.env.LD_VECTOR_FONT_EVIDENCE_DIR
    ? path.resolve(process.env.LD_VECTOR_FONT_EVIDENCE_DIR)
    : fs.mkdtempSync(path.join(os.tmpdir(), 'ld-vector-font-'))
  fs.mkdirSync(directory, { recursive: true })
  const outputs = {}
  for (const [name, text] of [['plain', 'i'], ['accent', 'i\u20d7']]) {
    const spec = {
      schema: 'ld-s10y-image/figure-spec@2',
      id: `fig-choice-font-${name}`,
      mode: 'deterministic',
      description: 'Synthetic typography fixture, not a lesson figure.',
      source: {
        authoredBasis: 'One written label for a renderer typography test.',
        authoritativeText: [{ text: `Display the label ${text}.` }],
        inventory: [{
          id: 'written-label', description: 'One label and no geometry.',
          objects: ['label'], assertions: ['one-label'],
        }],
      },
      canvas: { width: 320, height: 320, boundingBox: [-2, 2, 2, -2] },
      display: {
        purpose: 'instructional', layout: 'inline', maxWidthPx: 320,
        widths: [300, 320], minTextPx: 16,
      },
      objects: [{
        id: 'label', type: 'text', at: [0, 0], text, fontSize: 42,
        labelPlacement: { position: 'CENTER' },
      }],
      assertions: [{
        id: 'one-label', type: 'objectCount', objectType: 'text', count: 1,
      }],
    }
    const specFile = path.join(directory, `${name}.spec.json`)
    const svgFile = path.join(directory, `${name}.svg`)
    const reportFile = path.join(directory, `${name}.render.json`)
    fs.writeFileSync(specFile, `${JSON.stringify(spec, null, 2)}\n`)
    const args = [
      path.join(skill, 'scripts/render_spec.mjs'), '--spec', specFile,
      '--svg', svgFile, '--png', path.join(directory, `${name}.png`),
      '--report', reportFile,
    ]
    const result = spawnSync(process.execPath, args, {
      cwd: repo, encoding: 'utf8', timeout: 60000,
    })
    fs.writeFileSync(path.join(directory, `${name}.command.json`), JSON.stringify({
      cwd: repo, command: process.execPath, args, exitCode: result.status,
      stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
    }, null, 2))
    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.equal(JSON.parse(fs.readFileSync(reportFile)).status, 'pass')
    outputs[name] = fs.readFileSync(svgFile, 'utf8')
  }
  assert.ok(!outputs.plain.includes('LDVectorAccents'))
  assert.ok(outputs.accent.includes('i\u20d7'))
  assert.match(outputs.accent, /@font-face.*data:font\/woff2;base64,/)

  const executablePath = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH, chromium.executablePath(),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium',
  ].filter(Boolean).find(candidate => fs.existsSync(candidate))
  assert.ok(executablePath, 'Existing Chromium is required')
  const browser = await chromium.launch({ executablePath, headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 640, height: 320 } })
    await page.setContent(`<style>body{margin:0;display:flex}svg{display:block}</style>${outputs.plain}${outputs.accent}`)
    const measurements = await page.evaluate(async () => {
      const loaded = await document.fonts.load('42px LDVectorAccents', '\u20d7')
      await document.fonts.ready
      const boxes = [...document.querySelectorAll('text')].map(node => {
        const box = node.getBBox()
        return { text: node.textContent, x: box.x, y: box.y, width: box.width, height: box.height }
      })
      return { loadedFonts: loaded.length, boxes }
    })
    fs.writeFileSync(path.join(directory, 'measurements.json'), JSON.stringify(measurements, null, 2))
    await page.screenshot({ path: path.join(directory, 'inline.png') })
    assert.equal(measurements.loadedFonts, 1)
    assert.equal(measurements.boxes.length, 2)
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('DOM.enable')
    await cdp.send('CSS.enable')
    const { root: document } = await cdp.send('DOM.getDocument')
    const { nodeId } = await cdp.send('DOM.querySelector', {
      nodeId: document.nodeId, selector: 'svg:last-child text',
    })
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
    fs.writeFileSync(path.join(directory, 'selected-fonts.json'), JSON.stringify(fonts, null, 2))
    assert.ok(fonts.some(font => font.isCustomFont && font.familyName === 'KaTeX_Main'))
    assert.ok(fonts.every(font => font.isCustomFont), 'No missing Arial accent glyph')

    const pixels = await page.evaluate(async ({ plain, accent, withoutAccent }) => {
      const rasterize = async svg => {
        const image = new Image()
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 320
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 320, 320)
        ctx.drawImage(image, 0, 0)
        const data = ctx.getImageData(0, 0, 320, 320).data
        const ink = []
        for (let y = 0; y < 320; y += 1) {
          for (let x = 0; x < 320; x += 1) {
            const offset = (y * 320 + x) * 4
            if (data[offset] < 120 && data[offset + 1] < 120 && data[offset + 2] < 120) ink.push([x, y])
          }
        }
        return {
          count: ink.length, top: Math.min(...ink.map(point => point[1])),
          bottom: Math.max(...ink.map(point => point[1])),
        }
      }
      return {
        plain: await rasterize(plain), accent: await rasterize(accent),
        withoutAccent: await rasterize(withoutAccent),
      }
    }, { ...outputs, withoutAccent: outputs.accent.replace('i\u20d7', 'i') })
    fs.writeFileSync(path.join(directory, 'image-pixels.json'), JSON.stringify(pixels, null, 2))
    assert.ok(pixels.plain.count > 20 && pixels.accent.count > pixels.withoutAccent.count + 10,
      'Both SVG images must be nonblank, with additional accent ink')
    assert.ok(pixels.accent.top < pixels.withoutAccent.top - 2,
      'Standalone SVG image must show the accent above the letter')
  } finally {
    await browser.close()
  }
})
