import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { owned, repo, sha, write } from './audit.mjs'

const require = createRequire(path.join(repo, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const [stage, ...figures] = process.argv.slice(2)
const target = path.join(owned, `${stage}-300-${figures.join('-')}.png`)
if (fs.existsSync(target)) throw new Error('Refusing to overwrite screenshot')
const inputs = figures.map(number => {
  const id = `fig-g10-${number}`
  const svg = path.join(owned, id, stage === 'first' ? 'first' : 'repaired', 'figure.svg')
  return { id, path: svg, sha256: sha(svg), svg: fs.readFileSync(svg, 'utf8') }
})
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: figures.length * 300 + (figures.length - 1) * 24, height: 350 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => route.abort())
  await page.setContent(`<!doctype html><style>
    html,body{margin:0;background:white}
    body{display:flex;gap:24px}
    .media{flex:0 0 300px;width:300px;height:350px}
    svg{display:block;width:300px;height:350px}
  </style>${inputs.map(input => `<div class="media">${input.svg}</div>`).join('')}`)
  await page.evaluate(() => document.fonts.ready)
  const checks = await page.locator('svg').evaluateAll(elements => elements.map(svg => ({
    width: svg.getBoundingClientRect().width,
    height: svg.getBoundingClientRect().height,
    labels: [...svg.querySelectorAll('text')].map(text => ({
      id: text.getAttribute('data-label-id'), text: text.textContent,
      px: Number.parseFloat(text.getAttribute('font-size')) * Math.hypot(text.getScreenCTM().a, text.getScreenCTM().b)
    }))
  })))
  if (checks.some(check => check.width !== 300 || check.labels.some(label => label.px < 16)))
    throw new Error('300px media contract failed')
  await page.screenshot({ path: target, animations: 'disabled' })
  write(path.join(owned, `${stage}-300-${figures.join('-')}.checks.json`), {
    authorOnly: true, formalProductAcceptance: false, network: 'All routes aborted; SVG embedded from owned files',
    inputs: inputs.map(({ svg, ...input }) => input), media: checks,
    screenshot: { path: target, sha256: sha(target) }, status: 'pass'
  })
} finally {
  await browser.close()
}
