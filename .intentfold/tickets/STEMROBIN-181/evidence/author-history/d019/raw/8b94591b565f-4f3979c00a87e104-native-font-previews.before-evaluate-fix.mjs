import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const renderer = path.resolve('.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const requireRenderer = createRequire(renderer)
const { chromium } = requireRenderer('playwright-core')
const requireLesson = createRequire(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const katexRoot = path.dirname(requireLesson.resolve('katex/package.json'))
const fonts = [
  { weight: 400, path: path.join(katexRoot, 'dist/fonts/KaTeX_Main-Regular.woff2') },
  { weight: 600, path: path.join(katexRoot, 'dist/fonts/KaTeX_Main-Bold.woff2') },
]
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const css = fonts.map(font => `@font-face{font-family:KaTeX_Main;font-style:normal;font-weight:${font.weight};src:url(data:font/woff2;base64,${fs.readFileSync(font.path).toString('base64')}) format("woff2");font-display:block}`).join('')
const nativeLaunch = chromium.launch.bind(chromium)
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
let launches = 0

// Keep the existing renderer/measurement pipeline, applying the existing host font policy in memory.
chromium.launch = async options => {
  assert.equal(options.headless, true, 'Only isolated headless native rendering is allowed')
  assert.equal(++launches, 1, 'No additional preview browser')
  const browser = await nativeLaunch(options)
  const newPage = browser.newPage.bind(browser)
  browser.newPage = async options => {
    const page = await newPage(options)
    await page.route(/https?:\/\//, route => route.abort())
    const setContent = page.setContent.bind(page)
    const evaluate = page.evaluate.bind(page)
    const screenshot = page.screenshot.bind(page)
    const setViewportSize = page.setViewportSize.bind(page)
    page.setContent = async (html, options) => {
      await setContent(`${html}<style>${css}</style>`, options)
      await evaluate(async () => {
        await document.fonts.load('600 36px KaTeX_Main', 'E\u20d7')
        await document.fonts.ready
      })
    }
    page.evaluate = async (fn, arg) => {
      const source = typeof fn === 'function' ? fn.toString() : String(fn)
      const original = "node.setAttribute('font-family', 'Arial, Helvetica, sans-serif')"
      if (source.includes(original)) {
        assert.equal(source.split(original).length, 2)
        const adjusted = source.replace(original, "node.setAttribute('font-family', 'KaTeX_Main,Arial,Helvetica,sans-serif')")
        return evaluate(`(${adjusted})`, arg)
      }
      return evaluate(fn, arg)
    }
    page.screenshot = async options => {
      const result = await screenshot(options)
      if (!options.path?.endsWith('.png')) return result
      const dir = path.dirname(options.path)
      const manifest = path.join(dir, 'width-previews.json')
      assert(!fs.existsSync(manifest), 'Preserve the first native width capture')
      const box = await evaluate(() => {
        const value = document.querySelector('svg').viewBox.baseVal
        return { width: value.width, height: value.height }
      })
      const previews = []
      for (const width of [640, 331, 342]) {
        const height = Math.ceil(width * box.height / box.width)
        await setViewportSize({ width, height })
        await evaluate(({ width, ratio }) => {
          const svg = document.querySelector('svg')
          svg.setAttribute('width', String(width))
          svg.setAttribute('height', String(width * ratio))
          svg.style.width = `${width}px`
          svg.style.height = `${width * ratio}px`
        }, { width, ratio: box.height / box.width })
        const labels = await evaluate(() => [...document.querySelectorAll('text[data-label-id]')].map(node => {
          const matrix = node.getScreenCTM()
          return {
            id: node.getAttribute('data-label-id'),
            text: node.textContent,
            fontFamily: getComputedStyle(node).fontFamily,
            finalPx: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          }
        }))
        const file = path.join(dir, `width-${width}.png`)
        assert(!fs.existsSync(file), `Preserve native pixels: ${file}`)
        await screenshot({ path: file, type: 'png', animations: 'disabled' })
        previews.push({
          width, height, path: file, sha256: sha(file),
          minimumTextPx: Math.min(...labels.map(label => label.finalPx)),
          nativeMinTextPx: 16,
          labels,
          actualOpened: false,
          captureOnlyNotIndependentApproval: true,
        })
      }
      fs.writeFileSync(manifest, `${JSON.stringify({
        schema: 'ld-s10y-image/author-width-previews@1',
        nativeRenderer: { path: renderer, sha256: sha(renderer) },
        runtimeFontPolicy: 'KaTeX_Main,Arial,Helvetica,sans-serif; font replacement before native label measurement and SVG serialization, not post-render SVG editing',
        fonts: fonts.map(font => ({ ...font, sha256: sha(font.path) })),
        headless: true, existingRendererSessionOnly: true,
        networkRequestsBlocked: true, previews,
      }, null, 2)}\n`)
      return result
    }
    return page
  }
  return browser
}
